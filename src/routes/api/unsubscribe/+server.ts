import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db, newsletter_subscribers } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { env } from "$env/dynamic/private";

const HELIO_API_KEY = env.HELIO_API_KEY;
const HELIO_NETWORK = env.HELIO_NETWORK || "test";
const HELIO_BASE_URL = HELIO_NETWORK === "test" 
  ? "https://api.dev.hel.io" 
  : "https://api.hel.io";

// Paylink IDs for subscriptions
const SPONSOR_PAYLINK = "69c8d9f659012967536797d9";
const SUPPORTER_PAYLINK = "69c8d9619153c496cc83f6a0";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, subscriptionType } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Invalid email address." }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(newsletter_subscribers)
      .where(eq(newsletter_subscribers.email, email))
      .limit(1);

    if (existing.length === 0) {
      return json({ error: "Email not found in our subscription list." }, { status: 404 });
    }

    // If unsubscribing from a subscription, disable the Hel.io paylink
    if (subscriptionType && HELIO_API_KEY) {
      const paylinkId = subscriptionType === "sponsor" ? SPONSOR_PAYLINK : SUPPORTER_PAYLINK;
      
      try {
        await fetch(`${HELIO_BASE_URL}/v1/paylink/${paylinkId}/disable`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${HELIO_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ disabled: true }),
        });
      } catch (helioErr) {
        console.error("Hel.io disable failed:", helioErr);
        // Continue with local unsubscribe even if Hel.io fails
      }
    }

    await db
      .delete(newsletter_subscribers)
      .where(eq(newsletter_subscribers.email, email));

    return json({ message: "You've been unsubscribed successfully." });
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
};
