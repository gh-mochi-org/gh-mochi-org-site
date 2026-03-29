import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db, supporters } from "$lib/server/db";
import { sendDiscordNotification } from "$lib/server/discord";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, amount, helioTxId, type } = body;

    if (!name) {
      return json({ error: "Name is required." }, { status: 400 });
    }

    await db.insert(supporters).values({
      name,
      email: email ?? null,
      amount: amount ? String(amount) : null,
      type: type === "sponsor" ? "sponsor" : "supporter",
      helio_tx_id: helioTxId ?? null,
    });

    await sendDiscordNotification("", [{
      title: type === "sponsor" ? "New Sponsor!" : "New Supporter!",
      color: type === "sponsor" ? 0xf0a500 : 0x7c3aed,
      fields: [
        { name: "Name", value: name, inline: true },
        ...(amount ? [{ name: "Amount", value: `$${amount}`, inline: true }] : []),
        { name: "Type", value: type === "sponsor" ? "Sponsor" : "Supporter", inline: true },
      ],
      timestamp: new Date().toISOString(),
    }],
    "news");

    return json({ message: "Thank you for your support!" });
  } catch (err) {
    console.error("Supporter save error:", err);
    return json({ error: "Could not save your support. Try again." }, { status: 500 });
  }
};
