import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db, projects } from "$lib/server/db";
import { eq, asc } from "drizzle-orm";

export const GET: RequestHandler = async ({ url }) => {
  try {
    const featuredOnly = url.searchParams.get("featured") === "true";

    const all = featuredOnly
      ? await db.select().from(projects).where(eq(projects.featured, true)).orderBy(asc(projects.order))
      : await db.select().from(projects).orderBy(asc(projects.order));

    return json(all);
  } catch (err) {
    console.error("Projects fetch error:", err);
    return json([], { status: 200 });
  }
};
