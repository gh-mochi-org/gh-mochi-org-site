import { json, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db, news } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { sendDiscordNotification } from "$lib/server/discord";
import { triggerWebhooks } from "$lib/server/webhooks";
import { sendNewsletterAnnouncement } from "$lib/server/newsletter";

function guard(locals: App.Locals) {
  if (!locals.admin) throw redirect(303, "/admin/login");
}

export const GET: RequestHandler = async ({ locals }) => {
  guard(locals);
  const all = await db.select().from(news).orderBy(news.created_at);
  return json(all);
};

export const POST: RequestHandler = async ({ request, locals }) => {
  guard(locals);
  const body = await request.json();
  const [created] = await db.insert(news).values({
    title: body.title,
    slug: body.slug,
    body: body.body ?? "",
    excerpt: body.excerpt ?? null,
    published: body.published ?? false,
    published_at: body.published ? new Date() : null,
  }).returning();

  if (body.published) {
    // Send Discord notification (non-blocking)
    void sendDiscordNotification(
      "",
      [{
        title: `News Update: ${body.title}`,
        description: body.excerpt || (body.body ? `${body.body.substring(0, 100)}...` : "No details provided."),
        color: 0xf0a500,
        timestamp: new Date().toISOString(),
      }],
      "news"
    );

    // Send to newsletter subscribers (non-blocking)
    void sendNewsletterAnnouncement(created).catch((err) => {
      console.error("Newsletter sending failed:", err);
    });

    // Trigger webhooks (non-blocking)
    void triggerWebhooks("news", "created", created);
  }

  return json(created, { status: 201 });
};

export const PUT: RequestHandler = async ({ request, locals }) => {
  guard(locals);
  const body = await request.json();
  const { id, ...rest } = body;
  if (rest.published && !rest.published_at) {
    rest.published_at = new Date();
  }
  rest.updated_at = new Date();
  const [updated] = await db.update(news).set(rest).where(eq(news.id, id)).returning();
  
  // If published, send notifications (non-blocking)
  if (updated.published) {
    // Send Discord notification (non-blocking)
    void sendDiscordNotification(
      "",
      [{
        title: `News Update: ${updated.title}`,
        description: updated.excerpt || (updated.body ? `${updated.body.substring(0, 100)}...` : "No details provided."),
        color: 0xf0a500,
        timestamp: new Date().toISOString(),
      }],
      "news"
    );

    // Send to newsletter subscribers (non-blocking)
    void sendNewsletterAnnouncement(updated).catch((err) => {
      console.error("Newsletter sending failed:", err);
    });

    // Trigger webhooks (non-blocking)
    void triggerWebhooks("news", "updated", updated);
  }
  
  return json(updated);
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
  guard(locals);
  const { id } = await request.json();
  
  // Get the news item before deleting to pass to webhooks
  const newsItem = await db.select().from(news).where(eq(news.id, id)).limit(1);
  
  await db.delete(news).where(eq(news.id, id));
  
  // Trigger webhooks if the item was published
  if (newsItem.length > 0 && newsItem[0].published) {
    void triggerWebhooks("news", "deleted", newsItem[0]);
  }
  
  return json({ ok: true });
};
