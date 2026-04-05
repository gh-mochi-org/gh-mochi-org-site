import type { Handle } from "@sveltejs/kit";
import { ADMIN_SECRET } from "$env/static/private";
import { generateCSRFToken, CSRF_COOKIE_OPTIONS } from "$lib/server/csrf";

export const handle: Handle = async ({ event, resolve }) => {
  // Check admin authentication
  const adminCookie = event.cookies.get("mochi_admin");
  event.locals.admin = adminCookie === ADMIN_SECRET;

  // Generate and set CSRF token
  let csrfToken = event.cookies.get("csrf_token");
  if (!csrfToken) {
    csrfToken = generateCSRFToken();
    event.cookies.set("csrf_token", csrfToken, CSRF_COOKIE_OPTIONS);
  }
  event.locals.csrfToken = csrfToken;

  return resolve(event);
};
