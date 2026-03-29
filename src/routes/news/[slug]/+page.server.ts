import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { db, news } from "$lib/server/db";
import { eq, and } from "drizzle-orm";

export const load: PageServerLoad = async ({ params }) => {
  try {
    const [article] = await db
      .select()
      .from(news)
      .where(and(eq(news.slug, params.slug), eq(news.published, true)))
      .limit(1);

    if (!article) throw error(404, "Article not found");
    return { article };
  } catch (err) {
    const httpError = err as { status?: number; message?: string };
    if (httpError?.status === 404) throw err;
    throw error(500, "Could not load article");
  }
};
