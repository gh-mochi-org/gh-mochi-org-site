import { Resend } from "resend";
import { env } from "$env/dynamic/private";
import { db, newsletter_subscribers } from "$lib/server/db";
import { generateNewsAnnouncementEmail, generateNewsAnnouncementEmailPlainText } from "$lib/server/email-templates";

const resend = new Resend(env.RESEND_API_KEY);

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  published: boolean;
  published_at: Date | null;
}

/**
 * Send news announcement to all active newsletter subscribers
 */
export async function sendNewsletterAnnouncement(news: NewsItem) {
  try {
    if (!news.published) return;
    if (!env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set - skipping newsletter");
      return;
    }

    // Get all subscribers
    const subscribers = await db.select().from(newsletter_subscribers);

    if (subscribers.length === 0) {
      return;
    }

    const fromEmail = env.RESEND_FROM_EMAIL || "updates@gh-mochi.org";
    const excerpt = news.excerpt || news.body.substring(0, 200);

    // Send in small batches to avoid rate limits (batch of 5 emails)
    for (let i = 0; i < subscribers.length; i += 5) {
      const batch = subscribers.slice(i, i + 5);

      const emailPromises = batch.map((subscriber) => {
        const htmlContent = generateNewsAnnouncementEmail({
          email: subscriber.email,
          recipientName: subscriber.name ?? undefined,
          title: news.title,
          excerpt,
          slug: news.slug,
        });

        const textContent = generateNewsAnnouncementEmailPlainText({
          email: subscriber.email,
          recipientName: subscriber.name ?? undefined,
          title: news.title,
          excerpt,
          slug: news.slug,
        });

        return resend.emails.send({
          from: `gh-mochi-org <${fromEmail}>`,
          to: [subscriber.email],
          subject: `✨ ${news.title} - gh-mochi-org`,
          html: htmlContent,
          text: textContent,
        }).catch((err) => {
          console.error(`Failed to send newsletter to ${subscriber.email}:`, err);
        });
      });

      await Promise.all(emailPromises);
      // Small delay between batches to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log(`Sent news announcement to ${subscribers.length} subscribers`);
  } catch (err) {
    console.error("Failed to send newsletter announcement:", err);
  }
}
