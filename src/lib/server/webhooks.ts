import { db, webhooks } from "$lib/server/db";
import { eq } from "drizzle-orm";

export type WebhookEventType = "news" | "project";
export type WebhookAction = "created" | "updated" | "deleted";

export interface WebhookPayload {
  event: WebhookEventType;
  action: WebhookAction;
  timestamp: string;
  data: any;
}

export async function triggerWebhooks(
  eventType: WebhookEventType,
  action: WebhookAction,
  data: any
) {
  try {
    // Get all active webhooks for this event type
    const activeWebhooks = await db
      .select()
      .from(webhooks)
      .where(eq(webhooks.event_type, eventType))
      .where(eq(webhooks.active, true));

    if (activeWebhooks.length === 0) return;

    const payload: WebhookPayload = {
      event: eventType,
      action,
      timestamp: new Date().toISOString(),
      data,
    };

    // Send to all webhooks (non-blocking)
    activeWebhooks.forEach((webhook) => {
      sendWebhook(webhook.url, payload).catch((err) => {
        console.error(`Webhook delivery failed for ${webhook.url}:`, err);
      });
    });
  } catch (err: any) {
    // Silently handle table not existing yet (during initial setup)
    if (err?.cause?.code === '42P01' && err?.cause?.message?.includes('webhooks')) {
      return;
    }
    console.error("Failed to trigger webhooks:", err);
  }
}

async function sendWebhook(url: string, payload: WebhookPayload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn(`Webhook returned status ${response.status} for ${url}`);
    }
  } finally {
    clearTimeout(timeoutId);
  }
}
