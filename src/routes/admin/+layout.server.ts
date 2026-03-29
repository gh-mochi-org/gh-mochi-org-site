import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, url }) => {
  if (!locals.admin && url.pathname !== "/admin/login") {
    throw redirect(303, "/admin/login");
  }
  return { admin: locals.admin };
};
