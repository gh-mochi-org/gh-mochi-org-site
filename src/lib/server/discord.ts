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

    if (!webhookUrl) return;
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ...(embeds ? { embeds } : {}),
      }),
    });
  } catch (err) {
    console.warn("Discord webhook failed:", err);
  }
}
