import type { Handle } from "@sveltejs/kit";
import { ADMIN_SECRET } from "$env/static/private";

export const handle: Handle = async ({ event, resolve }) => {
  const adminCookie = event.cookies.get("mochi_admin");
  event.locals.admin = adminCookie === ADMIN_SECRET;

  return resolve(event);
};
