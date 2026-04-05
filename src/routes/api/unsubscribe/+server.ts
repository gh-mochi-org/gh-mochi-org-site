import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db, newsletter_subscribers } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { verifyEmailToken, validateEmail } from "$lib/server/email-utils";
import { isRateLimited, getClientIp } from "$lib/server/rate-limit";

// Rate limit: 10 unsubscribe attempts per IP per hour
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimitKey = `unsubscribe:${clientIp}`;
    
    if (isRateLimited(rateLimitKey, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
      return json(
        { error: "Too many unsubscribe attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, token } = body;

    // Support both token-based (secure) and email-based (legacy) unsubscribe
    let verifiedEmail: string | null = null;

    if (token) {
      // Verify secure token
      verifiedEmail = verifyEmailToken(token);
      if (!verifiedEmail) {
        return json({ error: "Invalid or expired unsubscribe link." }, { status: 400 });
      }
    } else if (email && validateEmail(email)) {
      // Legacy email-based unsubscribe (requires form submission)
      verifiedEmail = email;
    } else {
      return json({ error: "Invalid email address or token." }, { status: 400 });
    }

    // Check if subscription exists
    const existing = await db
      .select()
      .from(newsletter_subscribers)
      .where(eq(newsletter_subscribers.email, verifiedEmail))
      .limit(1);

    if (existing.length === 0) {
      return json({ error: "Email not found in our subscription list." }, { status: 404 });
    }

    // Delete subscription
    await db
      .delete(newsletter_subscribers)
      .where(eq(newsletter_subscribers.email, verifiedEmail));

    return json({ message: "You've been unsubscribed from the newsletter. No hard feelings! 💜" });
  } catch (err) {
    console.error("Newsletter unsubscribe error:", err);
    return json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
};
