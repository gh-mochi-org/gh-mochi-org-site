import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db, supporters } from "$lib/server/db";
import { eq } from "drizzle-orm";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Invalid email address." }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(supporters)
      .where(eq(supporters.email, email))
      .limit(1);

    if (existing.length === 0) {
      return json({ error: "We couldn't find that email in our supporter list. Maybe you supported with a different email?" }, { status: 404 });
    }

    // Instead of deleting, set visible to false so they can re-enable later
    await db
      .update(supporters)
      .set({ visible: false })
      .where(eq(supporters.email, email));

    return json({ message: "You've been hidden from the supporter list. No hard feelings! 💜" });
  } catch (err) {
    console.error("Supporter unsubscribe error:", err);
    return json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
};
