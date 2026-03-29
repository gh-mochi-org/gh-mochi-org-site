import { json, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db, projects } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { sendDiscordNotification } from "$lib/server/discord";

function guard(locals: App.Locals) {
  if (!locals.admin) throw redirect(303, "/admin/login");
}

export const GET: RequestHandler = async ({ locals }) => {
  guard(locals);
  const all = await db.select().from(projects);
  return json(all);
};

export const POST: RequestHandler = async ({ request, locals }) => {
  guard(locals);
  const body = await request.json();
  const [created] = await db.insert(projects).values({
    name: body.name,
    description: body.description ?? null,
    repo_url: body.repo_url ?? null,
    stars: body.stars ?? 0,
    forks: body.forks ?? 0,
    tags: body.tags ?? [],
    featured: body.featured ?? false,
    order: body.order ?? 0,
  }).returning();

  void sendDiscordNotification(
    "",
    [{
      title: `Project Added: ${body.name}`,
      description: body.description ?? "No description provided.",
      color: 0xf0a500,
      fields: [
        ...(body.repo_url ? [{ name: "Repository", value: body.repo_url, inline: false }] : []),
        ...(body.tags && body.tags.length > 0 ? [{ name: "Tags", value: body.tags.join(", "), inline: false }] : []),
      ],
      timestamp: new Date().toISOString(),
    }],
    "project"
  );

  return json(created, { status: 201 });
};

export const PUT: RequestHandler = async ({ request, locals }) => {
  guard(locals);
  const body = await request.json();
  const { id, ...rest } = body;
  const [updated] = await db.update(projects).set(rest).where(eq(projects.id, id)).returning();
  return json(updated);
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
  guard(locals);
  const { id } = await request.json();
  await db.delete(projects).where(eq(projects.id, id));
  return json({ ok: true });
};
