import { env } from "$env/dynamic/private";

export type WebhookType = "general" | "news" | "project";

export async function sendDiscordNotification(content: string, embeds?: object[], type: WebhookType = "general") {
  try {
    let webhookUrl = env.DISCORD_WEBHOOK_URL;
    
    if (type === "news") {
      webhookUrl = env.DISCORD_GH_MOCHI_UPDATES_NEWS_ANNOUNCEMENT_CHANNEL_WEBHOOK || webhookUrl;
    } else if (type === "project") {
      webhookUrl = env.DISCORD_GH_MOCHI_NEW_PROJECT_ANNOUNCEMENT_CHANNEL_WEBHOOK || webhookUrl;
    }

    if (!webhookUrl) {
      console.warn(`[Discord] No webhook URL configured for type: ${type}`);
      return;
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ...(embeds ? { embeds } : {}),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.warn(`[Discord] Webhook failed with status ${response.status} for type ${type}: ${text}`);
      return; // Don't throw - just warn and continue
    }

    console.log(`[Discord] Notification sent (type: ${type})`);
  } catch (err) {
    console.warn(`[Discord] Error sending webhook:`, err);
    // Don't throw - just warn so it doesn't crash the server
  }
}
