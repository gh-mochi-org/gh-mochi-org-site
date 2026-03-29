import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { ADMIN_SECRET } from "$env/static/private";

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const password = form.get("password")?.toString();

    if (password === ADMIN_SECRET) {
      cookies.set("mochi_admin", ADMIN_SECRET, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        secure: false,
      });
      throw redirect(303, "/admin");
    }

    throw redirect(303, "/admin/login?error=1");
  }
};
