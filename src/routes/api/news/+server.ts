import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db, news } from "$lib/server/db";
import { eq, desc } from "drizzle-orm";

export const GET: RequestHandler = async () => {
  try {
    const all = await db
      .select()
      .from(news)
      .where(eq(news.published, true))
      .orderBy(desc(news.published_at));

    return json(all);
  } catch (err) {
    console.error("News fetch error:", err);
    return json([], { status: 200 });
  }
};
