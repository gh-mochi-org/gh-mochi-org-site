import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db, newsletter_subscribers } from "$lib/server/db";
import { Resend } from "resend";
import { env } from "$env/dynamic/private";
import { eq } from "drizzle-orm";
import { sendDiscordNotification } from "$lib/server/discord";

const resend = new Resend(env.RESEND_API_KEY);

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, name } = body;

    const fromEmail = env.RESEND_FROM_EMAIL || "updates@gh-mochi.org";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Invalid email address." }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(newsletter_subscribers)
      .where(eq(newsletter_subscribers.email, email))
      .limit(1);

    if (existing.length > 0) {
      return json({ error: "You're already subscribed!" }, { status: 409 });
    }

    await db.insert(newsletter_subscribers).values({
      email,
      name: name ?? null,
    });

    await resend.emails.send({
      from: `gh-mochi-org <${fromEmail}>`,
      to: [email],
      subject: "You're on the list! - gh-mochi-org",
      html: `
        <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #e8e8e8; border-radius: 12px;">
          <h1 style="color: #f0a500; margin-bottom: 8px;">~/.mochi</h1>
          <h2 style="font-weight: 400; color: #c0c0c0;">You're subscribed!</h2>
          <p style="color: #a0a0a0; line-height: 1.6;">
            Hey${name ? ` ${name}` : ""}! Thanks for subscribing to <strong style="color: #f0a500;">gh-mochi-org</strong> updates.
          </p>
          <hr style="border: 1px solid #222; margin: 24px 0;" />
          <p style="color: #606060; font-size: 12px;">
            Sent by gh-mochi-org<br/>
            <a href="https://gh-mochi-org.vercel.app" style="color: #f0a500;">gh-mochi-org.vercel.app</a>
          </p>
          <p style="color: #606060; font-size: 11px; margin-top: 16px;">
            Don't want to receive these emails? 
            <a href="https://gh-mochi-org.vercel.app/unsubscribe?email=${encodeURIComponent(email)}" style="color: #f0a500;">Unsubscribe here</a>.
          </p>
        </div>
      `,
    });

    await sendDiscordNotification("", [{
      title: "New Newsletter Subscriber",
      color: 0xf0a500,
      fields: [
        ...(name ? [{ name: "Name", value: name, inline: true }] : []),
      ],
      timestamp: new Date().toISOString(),
    }], "news");

    return json({ message: "Subscribed! Check your inbox" });
  } catch (err) {
    console.error("Subscribe error:", err);
    return json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
};
