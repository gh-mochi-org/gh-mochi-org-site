import { json, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db, supporters, newsletter_subscribers } from "$lib/server/db";
import { eq, desc } from "drizzle-orm";

function guard(locals: App.Locals) {
  if (!locals.admin) throw redirect(303, "/admin/login");
}

export const GET: RequestHandler = async ({ locals }) => {
  guard(locals);
  const all = await db.select().from(supporters).orderBy(desc(supporters.paid_at));
  const subs = await db.select().from(newsletter_subscribers).orderBy(desc(newsletter_subscribers.subscribed_at));
  return json({ supporters: all, subscribers: subs });
};

export const PUT: RequestHandler = async ({ request, locals }) => {
  guard(locals);
  const { id, visible } = await request.json();
  const [updated] = await db.update(supporters).set({ visible }).where(eq(supporters.id, id)).returning();
  return json(updated);
};
