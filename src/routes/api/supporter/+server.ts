import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db, supporters } from "$lib/server/db";
import { sendDiscordNotification } from "$lib/server/discord";
import { generateSupporterThankYouEmail, generateSupporterThankYouEmailPlainText } from "$lib/server/email-templates";
import { validateEmail, escapeHtml } from "$lib/server/email-utils";
import { Resend } from "resend";
import { env } from "$env/dynamic/private";
import { isRateLimited, getClientIp } from "$lib/server/rate-limit";

// Rate limit: 5 support submissions per IP per hour
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimitKey = `supporter:${clientIp}`;
    
    if (isRateLimited(rateLimitKey, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
      return json(
        { error: "Too many support submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, amount, txId, cryptoNetwork, type } = body;

    if (!name || name.trim().length === 0) {
      return json({ error: "Name is required." }, { status: 400 });
    }

    // Sanitize and validate input
    const sanitizedName = escapeHtml(name.trim());
    const isSponsorship = type === "sponsor";

    // Validate email if provided
    if (email && !validateEmail(email)) {
      return json({ error: "Invalid email address." }, { status: 400 });
    }

    // Insert supporter record
    const result = await db.insert(supporters).values({
      name: sanitizedName,
      email: email ?? null,
      amount: amount ? String(amount) : null,
      type: isSponsorship ? "sponsor" : "supporter",
      helio_tx_id: txId ?? null,
    });

    // Send thank you email if email provided
    if (email && validateEmail(email)) {
      const resend = new Resend(env.RESEND_API_KEY);
      const fromEmail = env.RESEND_FROM_EMAIL || "updates@gh-mochi.org";

      try {
        const htmlContent = generateSupporterThankYouEmail({
          email,
          recipientName: sanitizedName,
          type: isSponsorship ? "sponsor" : "supporter",
          amount,
        });

        const textContent = generateSupporterThankYouEmailPlainText({
          email,
          recipientName: sanitizedName,
          type: isSponsorship ? "sponsor" : "supporter",
          amount,
        });

        await resend.emails.send({
          from: `gh-mochi-org <${fromEmail}>`,
          to: [email],
          subject: isSponsorship ? "Thank you for sponsoring gh-mochi-org! 🌟" : "Thank you for supporting gh-mochi-org! 💜",
          html: htmlContent,
          text: textContent,
        });
      } catch (emailErr) {
        console.error("Failed to send supporter email:", emailErr);
        // Don't fail the request if email sending fails
      }
    }

    // Send Discord notification
    await sendDiscordNotification(
      "",
      [
        {
          title: isSponsorship ? "🌟 New Sponsor!" : "💜 New Supporter!",
          color: isSponsorship ? 0xf0a500 : 0x7c3aed,
          fields: [
            { name: "Name", value: sanitizedName, inline: true },
            ...(amount ? [{ name: "Amount", value: `${amount}`, inline: true }] : []),
            ...(cryptoNetwork ? [{ name: "Network", value: cryptoNetwork, inline: true }] : []),
            ...(txId ? [{ name: "TX ID", value: txId, inline: false }] : []),
          ],
          timestamp: new Date().toISOString(),
          footer: { text: "gh-mochi-org supporter system" },
        },
      ],
      "news",
    );

    return json({ message: "Thank you for your support! 💜" });
  } catch (err) {
    console.error("Supporter save error:", err);
    return json({ error: "Could not save your support. Please try again." }, { status: 500 });
  }
};
