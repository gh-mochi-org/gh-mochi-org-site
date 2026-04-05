import { json, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db, webhooks } from "$lib/server/db";
import { eq } from "drizzle-orm";

function guard(locals: App.Locals) {
  if (!locals.admin) throw redirect(303, "/admin/login");
}

export const GET: RequestHandler = async ({ locals }) => {
  guard(locals);
  const all = await db.select().from(webhooks);
  return json(all);
};

export const POST: RequestHandler = async ({ request, locals }) => {
  guard(locals);
  const body = await request.json();
  const { url, event_type } = body;

  if (!url || !event_type) {
    return json(
      { error: "url and event_type are required" },
      { status: 400 }
    );
  }

  try {
    new URL(url);
  } catch {
    return json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!["news", "project"].includes(event_type)) {
    return json(
      { error: "event_type must be 'news' or 'project'" },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(webhooks)
    .values({
      url,
      event_type,
      active: true,
    })
    .returning();

  return json(created, { status: 201 });
};

export const PUT: RequestHandler = async ({ request, locals }) => {
  guard(locals);
  const body = await request.json();
  const { id, ...rest } = body;

  rest.updated_at = new Date();

  const [updated] = await db
    .update(webhooks)
    .set(rest)
    .where(eq(webhooks.id, id))
    .returning();

  return json(updated);
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
  guard(locals);
  const { id } = await request.json();
  await db.delete(webhooks).where(eq(webhooks.id, id));
  return json({ ok: true });
};
