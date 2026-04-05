import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db, newsletter_subscribers } from "$lib/server/db";
import { Resend } from "resend";
import { env } from "$env/dynamic/private";
import { eq } from "drizzle-orm";
import { sendDiscordNotification } from "$lib/server/discord";
import { generateNewsletterWelcomeEmail, generateNewsletterWelcomeEmailPlainText } from "$lib/server/email-templates";
import { generateEmailToken, validateEmail, escapeHtml } from "$lib/server/email-utils";
import { isRateLimited, getClientIp } from "$lib/server/rate-limit";

const resend = new Resend(env.RESEND_API_KEY);

// Rate limit: 3 subscriptions per IP per hour
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimitKey = `subscribe:${clientIp}`;
    
    if (isRateLimited(rateLimitKey, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
      return json(
        { error: "Too many subscription attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, name } = body;

    const fromEmail = env.RESEND_FROM_EMAIL || "updates@gh-mochi.org";

    // Improved email validation
    if (!email || !validateEmail(email)) {
      return json({ error: "Invalid email address." }, { status: 400 });
    }

    // Check for duplicate subscription
    const existing = await db
      .select()
      .from(newsletter_subscribers)
      .where(eq(newsletter_subscribers.email, email))
      .limit(1);

    if (existing.length > 0) {
      return json({ error: "You're already subscribed!" }, { status: 409 });
    }

    // Generate secure unsubscribe token
    const unsubscribeToken = generateEmailToken(email);

    // Insert into database
    await db.insert(newsletter_subscribers).values({
      email,
      name: name ?? null,
    });

    // Generate email content with secure unsubscribe link
    const htmlContent = generateNewsletterWelcomeEmail({ 
      email,
      recipientName: name ? escapeHtml(name) : undefined 
    }).replace('PLACEHOLDER', unsubscribeToken);
    
    const textContent = generateNewsletterWelcomeEmailPlainText({ 
      email,
      recipientName: name ? escapeHtml(name) : undefined 
    }).replace('PLACEHOLDER', unsubscribeToken);

    // Send email with both HTML and plain text
    await resend.emails.send({
      from: `gh-mochi-org <${fromEmail}>`,
      to: [email],
      subject: "You're on the list! - gh-mochi-org",
      html: htmlContent,
      text: textContent,
    });

    // Send Discord notification
    await sendDiscordNotification("", [{
      title: "New Newsletter Subscriber",
      color: 0xf0a500,
      fields: [
        ...(name ? [{ name: "Name", value: escapeHtml(name), inline: true }] : []),
        { name: "Email", value: email.substring(0, 3) + "***" + email.substring(email.length - 3), inline: true },
      ],
      timestamp: new Date().toISOString(),
    }], "news");

    return json({ message: "Subscribed! Check your inbox" });
  } catch (err) {
    console.error("Subscribe error:", err);
    return json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
};
