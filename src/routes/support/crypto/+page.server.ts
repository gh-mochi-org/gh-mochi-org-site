import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";

export const load: PageServerLoad = async () => {
  return {
    wallets: {
      btc: env.BTC_WALLET_ADDR ?? null,
      eth: env.ETH_WALLET_ADDR ?? null,
      usdt: env.USDT_WALLET_ADDR ?? null,
      usdc: env.USDC_WALLET_ADDR ?? null,
      xmr: env.XMR_WALLET_ADDR ?? null,
      sol: env.SOL_WALLET_ADDR ?? null,
    },
  };
};
