<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { motion } from "motion-sv";
  import AuroraText from "$lib/components/magic/aurora-text/aurora-text.svelte";
  import MagicCard from "$lib/components/magic/magic-card/magic-card.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { CheckCircle, HeartHandshake, Home, Users, Star, Sparkles } from "@lucide/svelte";

  onMount(() => {
    const params = $page.url.searchParams;
    if (params.get("verified") !== "1") {
      goto("/support", { replaceState: true });
    }
  });

  const name = $derived($page.url.searchParams.get("name") ?? "Friend");
  const type = $derived(($page.url.searchParams.get("type") ?? "supporter") as "supporter" | "sponsor");
  const amount = $derived($page.url.searchParams.get("amount"));
</script>

<svelte:head>
  <title>Thank You! - gh-mochi-org</title>
  <meta name="description" content="Thank you for supporting gh-mochi-org!" />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="w-full flex flex-col items-center justify-center min-h-[70vh] px-4 py-20">
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 120, damping: 14 }}
    class="w-full max-w-lg"
  >
    <MagicCard class="p-10 rounded-2xl border border-border/50 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 mx-auto mb-6"
      >
        <CheckCircle class="w-10 h-10 text-green-500" />
      </motion.div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
        <h1 class="text-3xl sm:text-4xl font-bold mb-3">
          <AuroraText>Thank you{name !== "Friend" ? `, ${name}` : ""}!</AuroraText>
        </h1>

        <p class="text-muted-foreground mb-2 leading-relaxed">
          {#if type === "sponsor"}
            Your <strong class="text-foreground">sponsorship</strong> means the world to us.
          {:else}
            Your <strong class="text-foreground">support</strong> keeps the mochi rolling.
          {/if}
          {#if amount}
            <span class="text-primary font-semibold">(${amount})</span>
          {/if}
        </p>

        <p class="text-sm text-muted-foreground mb-8">
          You'll appear in our supporters section shortly. Thank you for believing in open source!
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
          {#each [
            { icon: Sparkles, text: "Your name in our supporters marquee" },
            { icon: Star, text: "Helping fund open-source maintainers" },
            { icon: HeartHandshake, text: "Forever grateful mochi energy" },
          ] as perk}
            <div class="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-muted/20 p-3 text-center">
              <perk.icon class="w-4 h-4 text-primary" />
              <p class="text-[11px] text-muted-foreground">{perk.text}</p>
            </div>
          {/each}
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/" variant="outline" class="gap-2">
            <Home class="w-4 h-4" /> Back Home
          </Button>
          <Button href="/contributors" class="gap-2">
            <Users class="w-4 h-4" /> View Supporters
          </Button>
        </div>
      </motion.div>
    </MagicCard>
  </motion.div>
</div>
