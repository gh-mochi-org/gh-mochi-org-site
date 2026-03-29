<script lang="ts">
  import { onMount } from "svelte";
  import { motion } from "motion-sv";
  import AuroraText from "$lib/components/magic/aurora-text/aurora-text.svelte";
  import MagicCard from "$lib/components/magic/magic-card/magic-card.svelte";
  import Marquee from "$lib/components/magic/marquee/marquee.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { HeartHandshake, Star, Users } from "@lucide/svelte";

  interface Supporter {
    id: number;
    name: string;
    email?: string | null;
    amount?: string | null;
    type: string;
    paid_at: string | Date;
  }

  let supporters: Supporter[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const res = await fetch("/api/supporters");
      if (res.ok) supporters = await res.json();
    } catch (_err) {}
    loading = false;
  });

  const allSupporters = $derived(supporters.filter((s) => s.type === "supporter"));
  const allSponsors = $derived(supporters.filter((s) => s.type === "sponsor"));
</script>

<svelte:head>
  <title>Contributors & Supporters - gh-mochi-org</title>
  <meta name="description" content="Meet the amazing people who support gh-mochi-org's open-source mission." />
</svelte:head>

<main class="w-full items-center flex flex-col p-3">
  <section class="max-w-4xl mx-auto px-4 sm:px-8 py-16 text-center w-full">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <HeartHandshake class="w-12 h-12 text-primary mx-auto mb-4" />
      <h1 class="text-3xl sm:text-5xl font-bold mb-4">
        <AuroraText>Our Community</AuroraText>
      </h1>
      <p class="text-muted-foreground max-w-xl mx-auto leading-relaxed">
        These amazing people fuel the collective. Every contribution keeps the mochi rolling.
      </p>
    </motion.div>
  </section>

  {#if loading}
    <div class="flex items-center gap-2 text-muted-foreground py-8">
      <span class="animate-spin">⏳</span> Loading supporters...
    </div>
  {:else if supporters.length === 0}
    <section class="py-16 px-4 text-center w-full">
      <div class="mx-auto max-w-xl">
        <MagicCard class="p-10 rounded-2xl border border-border/50">
          <HeartHandshake class="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 class="text-xl font-bold mb-3">Be the first supporter!</h2>
          <p class="text-sm text-muted-foreground mb-6">No supporters yet — be the first to join the collective!</p>
          <Button href="/support" size="lg" class="gap-2">
            <HeartHandshake class="w-4 h-4" /> Support Us
          </Button>
        </MagicCard>
      </div>
    </section>
  {:else}
    <section class="py-8 px-4 w-full">
      <div class="mx-auto max-w-4xl grid grid-cols-2 sm:grid-cols-3 gap-4">
        {#each [{ label: "Total Supporters", value: allSupporters.length, icon: HeartHandshake }, { label: "Sponsors", value: allSponsors.length, icon: Star }, { label: "Community", value: supporters.length, icon: Users }] as stat, i}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <MagicCard class="p-5 rounded-xl border border-border/50 text-center">
              <stat.icon class="w-5 h-5 text-primary mx-auto mb-2" />
              <p class="text-2xl font-bold">{stat.value}</p>
              <p class="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </MagicCard>
          </motion.div>
        {/each}
      </div>
    </section>

    {#if allSponsors.length > 0}
      <section class="py-10 px-4 w-full border-y border-border/40">
        <div class="mx-auto max-w-4xl">
          <h2 class="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <Star class="w-5 h-5 text-primary" /> Sponsors
          </h2>
          <Marquee pauseOnHover class="[--gap:1rem]">
            {#each allSponsors as s}
              <div class="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs">
                <Star class="w-3 h-3 text-primary" />
                <span class="font-semibold">{s.name}</span>
                <Badge variant="default" class="text-[8px] px-1 py-0">sponsor</Badge>
              </div>
            {/each}
          </Marquee>
        </div>
      </section>
    {/if}

    <section class="py-10 px-4 w-full">
      <div class="mx-auto max-w-4xl">
        <h2 class="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <HeartHandshake class="w-5 h-5 text-primary" /> Supporters
        </h2>
        <Marquee pauseOnHover reverse class="[--gap:1rem]">
          {#each allSupporters.length > 0 ? allSupporters : supporters as s}
            <div class="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs">
              <HeartHandshake class="w-3 h-3 text-primary" />
              <span class="font-medium">{s.name}</span>
            </div>
          {/each}
        </Marquee>
      </div>
    </section>

    <section class="py-8 px-4 w-full">
      <div class="mx-auto max-w-4xl">
        <h2 class="text-xl font-bold mb-6">All Contributors</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {#each supporters as s, i}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
              <MagicCard class="p-4 rounded-xl border border-border/50 flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-sm truncate">{s.name}</p>
                  {#if s.amount}
                    <p class="text-[10px] text-muted-foreground">${s.amount}</p>
                  {/if}
                </div>
                {#if s.type === "sponsor"}
                  <Badge variant="default" class="text-[8px] px-1 py-0">sponsor</Badge>
                {/if}
              </MagicCard>
            </motion.div>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <section class="py-16 px-4 w-full text-center">
    <div class="mx-auto max-w-xl">
      <MagicCard class="p-8 rounded-2xl border border-border/50">
        <HeartHandshake class="w-8 h-8 text-primary mx-auto mb-4" />
        <h2 class="text-xl font-bold mb-2">Want to join them?</h2>
        <p class="text-sm text-muted-foreground mb-6">Every bit of support helps us build better open-source tools.</p>
        <Button href="/support" size="lg" class="gap-2">
          <HeartHandshake class="w-4 h-4" /> Support the Project
        </Button>
      </MagicCard>
    </div>
  </section>
</main>
