<script lang="ts">
  import { onMount } from "svelte";
  import { motion } from "motion-sv";
  import AuroraText from "$lib/components/magic/aurora-text/aurora-text.svelte";
  import MagicCard from "$lib/components/magic/magic-card/magic-card.svelte";
  import { Newspaper, ArrowRight, Calendar } from "@lucide/svelte";

  interface NewsItem {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    published_at?: string | null;
    created_at: string;
  }

  let news: NewsItem[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const res = await fetch("/api/news");
      if (res.ok) news = await res.json();
    } catch (_err) {}
    loading = false;
  });

  function formatDate(d: string | null | undefined) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
</script>

<svelte:head>
  <title>News - gh-mochi-org</title>
  <meta name="description" content="Updates and news from the gh-mochi-org collective." />
</svelte:head>

<main class="w-full items-center flex flex-col p-3">
  <section class="max-w-4xl mx-auto px-4 sm:px-8 py-16 text-center w-full">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Newspaper class="w-12 h-12 text-primary mx-auto mb-4" />
      <h1 class="text-3xl sm:text-5xl font-bold mb-4">
        <AuroraText>News & Updates</AuroraText>
      </h1>
      <p class="text-muted-foreground max-w-xl mx-auto leading-relaxed">
        What's cooking at gh-mochi-org. Updates, releases, and thoughts from the collective.
      </p>
    </motion.div>
  </section>

  {#if loading}
    <div class="flex items-center gap-2 text-muted-foreground py-8">
      <span class="animate-spin">⏳</span> Loading news...
    </div>
  {:else if news.length === 0}
    <section class="py-16 px-4 text-center w-full">
      <div class="mx-auto max-w-xl">
        <MagicCard class="p-10 rounded-2xl border border-border/50">
          <Newspaper class="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 class="text-xl font-bold mb-3">No news yet</h2>
          <p class="text-sm text-muted-foreground">Check back soon for updates from the collective!</p>
        </MagicCard>
      </div>
    </section>
  {:else}
    <section class="w-full max-w-3xl px-4 pb-24 mx-auto">
      <div class="flex flex-col gap-4">
        {#each news as item, i}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <a href="/news/{item.slug}" class="block group">
              <MagicCard class="p-6 rounded-xl border border-border/50 hover:border-primary/40 transition-colors">
                <div class="flex items-start gap-4">
                  <div class="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Newspaper class="w-4 h-4 text-primary" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h2 class="font-bold text-base mb-1 group-hover:text-primary transition-colors">{item.title}</h2>
                    {#if item.excerpt}
                      <p class="text-sm text-muted-foreground leading-relaxed line-clamp-2">{item.excerpt}</p>
                    {/if}
                    <div class="flex items-center gap-2 mt-3">
                      <Calendar class="w-3 h-3 text-muted-foreground" />
                      <span class="text-[11px] text-muted-foreground">{formatDate(item.published_at ?? item.created_at)}</span>
                    </div>
                  </div>
                  <ArrowRight class="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </div>
              </MagicCard>
            </a>
          </motion.div>
        {/each}
      </div>
    </section>
  {/if}
</main>
