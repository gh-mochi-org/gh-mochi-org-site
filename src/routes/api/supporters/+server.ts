import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db, supporters } from "$lib/server/db";
import { eq, desc } from "drizzle-orm";

export const GET: RequestHandler = async () => {
  try {
    const all = await db
      .select()
      .from(supporters)
      .where(eq(supporters.visible, true))
      .orderBy(desc(supporters.paid_at));

    return json(all);
  } catch (err) {
    console.error("Supporters fetch error:", err);
    return json([], { status: 200 });
  }
};
