<script lang="ts">
  // ============================================================
  // NOTE: This page redirects to /support/crypto via +page.server.ts
  // All Hel.io/MoonPay code below is commented out for reference.
  // ============================================================

  // import { goto } from "$app/navigation";
  // import { motion } from "motion-sv";
  // import AuroraText from "$lib/components/magic/aurora-text/aurora-text.svelte";
  // import MagicCard from "$lib/components/magic/magic-card/magic-card.svelte";
  // import RippleButton from "$lib/components/magic/ripple-button/ripple-button.svelte";
  // import Badge from "$lib/components/ui/badge/badge.svelte";
  // import Button from "$lib/components/ui/button/button.svelte";
  // import { HeartHandshake, Star, Loader } from "@lucide/svelte";

  // type Tab = "supporter" | "sponsor";
  // let activeTab: Tab = $state("supporter");

  // type Step = "form" | "checkout" | "done";
  // let step: Step = $state("form");

  // let name = $state("");
  // let email = $state("");
  // let amount = $state("5.99");

  // let saving = $state(false);
  // let saveError = $state("");

  // --- HELIO PAYLINK IDs (kept for reference, payment system replaced with crypto wallets) ---
  // const SPONSOR_PAYLINK = "69d0ba1394194dc68fa68f23";
  // const SUPPORTER_PAYLINK = "69d0b98dabbfb8e8a23c7252";

  // const amounts = ["2", "5", "10", "20", "50"];

  // function proceedToCheckout() { ... }
  // async function handleSuccess(event: any) { ... }

  // --- HELIO WIDGET MOUNT (disabled — uses hel.io embed script) ---
  // function mountHelioWidget(el: HTMLElement) { ... }
  // function initWidget(el: HTMLElement, paylinkId: string) { ... }

  // $effect(() => { ... });
  // function goBack() { ... }
  // function setTab(t: Tab) { ... }
</script>

<!-- This page redirects server-side to /support/crypto — no client UI needed -->
