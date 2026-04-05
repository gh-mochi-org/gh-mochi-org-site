/**
 * Email Templates with consistent design system
 * Color palette: #f0a500 (primary orange), #0a0a0a (dark bg), #e8e8e8 (light text)
 */

interface EmailProps {
  recipientName?: string;
  email: string;
}

const baseStyles = {
  container: "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #e8e8e8; border-radius: 12px; line-height: 1.6;",
  header: "color: #f0a500; margin-bottom: 8px; font-size: 24px; font-weight: bold;",
  heading: "font-weight: 400; color: #c0c0c0; font-size: 20px; margin-bottom: 16px;",
  paragraph: "color: #a0a0a0; line-height: 1.6; margin: 12px 0;",
  button: "display: inline-block; padding: 10px 20px; background: #f0a500; color: #0a0a0a; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 12px 0;",
  divider: "border: 1px solid #222; margin: 24px 0;",
  footer: "color: #606060; font-size: 12px; margin-top: 24px;",
  footerLink: "color: #f0a500; text-decoration: none;",
  unsubscribe: "color: #606060; font-size: 11px; margin-top: 16px;",
};

/**
 * Newsletter subscription welcome email
 */
export function generateNewsletterWelcomeEmail(props: EmailProps): string {
  const { recipientName, email } = props;
  const unsubscribeUrl = `https://gh-mochi.org/unsubscribe?token=PLACEHOLDER`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GH-Mochi Newsletter</title>
</head>
<body style="${baseStyles.container}">
  <div>
    <!-- Header -->
    <h1 style="${baseStyles.header}">~/.mochi</h1>
    <h2 style="${baseStyles.heading}">You're subscribed!</h2>

    <!-- Main content -->
    <p style="${baseStyles.paragraph}">
      Hey${recipientName ? ` ${recipientName}` : ""}! Thanks for subscribing to <strong style="color: #f0a500;">gh-mochi-org</strong> updates.
    </p>

    <p style="${baseStyles.paragraph}">
      You'll now receive updates about our latest projects, releases, and community news. We're building sweet, cozy, and robust open-source tools, and we can't wait to share our journey with you.
    </p>

    <p style="${baseStyles.paragraph}">
      <strong>What's next?</strong> Explore our projects and join our community!
    </p>

    <a href="https://gh-mochi.org/projects" style="${baseStyles.button}">
      Explore Projects
    </a>

    <!-- Divider -->
    <hr style="${baseStyles.divider}" />

    <!-- Footer -->
    <p style="${baseStyles.footer}">
      Sent by gh-mochi-org<br />
      <a href="https://gh-mochi.org" style="${baseStyles.footerLink}">gh-mochi.org</a>
    </p>

    <!-- Unsubscribe -->
    <p style="${baseStyles.unsubscribe}">
      Don't want to receive these emails? 
      <a href="${unsubscribeUrl}" style="${baseStyles.footerLink}">Unsubscribe here</a>.
    </p>
  </div>
</body>
</html>`;
}

/**
 * Plain text version of newsletter welcome email
 */
export function generateNewsletterWelcomeEmailPlainText(props: EmailProps): string {
  const { recipientName } = props;

  return `
~/.mochi

You're subscribed!

Hey${recipientName ? ` ${recipientName}` : ""}! Thanks for subscribing to gh-mochi-org updates.

You'll now receive updates about our latest projects, releases, and community news. We're building sweet, cozy, and robust open-source tools, and we can't wait to share our journey with you.

What's next? Explore our projects and join our community!

Explore Projects: https://gh-mochi.org/projects

---

Sent by gh-mochi-org
https://gh-mochi.org

Don't want to receive these emails? Unsubscribe here: https://gh-mochi.org/unsubscribe?token=PLACEHOLDER
`.trim();
}

/**
 * Supporter/Sponsor thank you email
 */
export function generateSupporterThankYouEmail(props: EmailProps & { type: 'supporter' | 'sponsor'; amount?: string }): string {
  const { recipientName, email, type, amount } = props;

  const title = type === 'sponsor' ? '🌟 Thank you for sponsoring!' : '💜 Thank you for supporting!';
  const messageContent = type === 'sponsor'
    ? 'Your sponsorship means the world to us and directly supports the development of gh-mochi-org. You\'re part of making open-source development sustainable.'
    : 'Your support helps us continue building amazing open-source tools. Thank you for believing in what we\'re creating!';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GH-Mochi - Thank You</title>
</head>
<body style="${baseStyles.container}">
  <div>
    <!-- Header -->
    <h1 style="${baseStyles.header}">~/.mochi</h1>
    <h2 style="${baseStyles.heading}">${title}</h2>

    <!-- Main content -->
    <p style="${baseStyles.paragraph}">
      Hey${recipientName ? ` ${recipientName}` : ""}!
    </p>

    <p style="${baseStyles.paragraph}">
      ${messageContent}
    </p>

    ${amount ? `<p style="${baseStyles.paragraph}"><strong>Amount:</strong> ${amount}</p>` : ''}

    <p style="${baseStyles.paragraph}">
      You're now part of our amazing community. We'll keep you updated on project progress and releases!
    </p>

    <!-- Divider -->
    <hr style="${baseStyles.divider}" />

    <!-- Footer -->
    <p style="${baseStyles.footer}">
      Sent by gh-mochi-org<br />
      <a href="https://gh-mochi.org" style="${baseStyles.footerLink}">gh-mochi.org</a>
    </p>
  </div>
</body>
</html>`;
}

/**
 * Plain text version of supporter email
 */
export function generateSupporterThankYouEmailPlainText(props: EmailProps & { type: 'supporter' | 'sponsor'; amount?: string }): string {
  const { recipientName, type, amount } = props;

  const title = type === 'sponsor' ? '🌟 Thank you for sponsoring!' : '💜 Thank you for supporting!';
  const messageContent = type === 'sponsor'
    ? 'Your sponsorship means the world to us and directly supports the development of gh-mochi-org. You\'re part of making open-source development sustainable.'
    : 'Your support helps us continue building amazing open-source tools. Thank you for believing in what we\'re creating!';

  return `
~/.mochi

${title}

Hey${recipientName ? ` ${recipientName}` : ""}!

${messageContent}

${amount ? `Amount: ${amount}\n` : ''}

You're now part of our amazing community. We'll keep you updated on project progress and releases!

---

Sent by gh-mochi-org
https://gh-mochi.org
`.trim();
}

/**
 * News announcement email for newsletter subscribers
 */
export function generateNewsAnnouncementEmail(props: EmailProps & { title: string; excerpt: string; slug: string }): string {
  const { recipientName, title, excerpt, slug } = props;
  const newsUrl = `https://gh-mochi.org/news/${slug}`;
  const unsubscribeUrl = `https://gh-mochi.org/unsubscribe`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GH-Mochi News</title>
</head>
<body style="${baseStyles.container}">
  <div>
    <!-- Header -->
    <h1 style="${baseStyles.header}">~/.mochi</h1>
    <h2 style="${baseStyles.heading}">✨ New Update</h2>

    <!-- Main content -->
    <p style="${baseStyles.paragraph}">
      Hey${recipientName ? ` ${recipientName}` : ""}!
    </p>

    <h3 style="${baseStyles.heading}">${title}</h3>
    <p style="${baseStyles.paragraph}">${excerpt}</p>

    <a href="${newsUrl}" style="${baseStyles.button}">Read Full Article</a>

    <!-- Divider -->
    <hr style="${baseStyles.divider}" />

    <!-- Footer -->
    <p style="${baseStyles.footer}">
      Sent by gh-mochi-org<br />
      <a href="https://gh-mochi.org" style="${baseStyles.footerLink}">gh-mochi.org</a>
    </p>

    <!-- Unsubscribe -->
    <p style="${baseStyles.unsubscribe}">
      Don't want to receive these emails? 
      <a href="${unsubscribeUrl}" style="${baseStyles.footerLink}">Unsubscribe here</a>.
    </p>
  </div>
</body>
</html>`;
}

/**
 * Plain text version of news announcement email
 */
export function generateNewsAnnouncementEmailPlainText(props: EmailProps & { title: string; excerpt: string; slug: string }): string {
  const { recipientName, title, excerpt, slug } = props;
  const newsUrl = `https://gh-mochi.org/news/${slug}`;
  const unsubscribeUrl = `https://gh-mochi.org/unsubscribe`;

  return `
~/.mochi

✨ New Update

Hey${recipientName ? ` ${recipientName}` : ""}!

${title}

${excerpt}

Read Full Article: ${newsUrl}

---

Sent by gh-mochi-org
https://gh-mochi.org

Don't want to receive these emails? Unsubscribe here: ${unsubscribeUrl}
`.trim();
}
