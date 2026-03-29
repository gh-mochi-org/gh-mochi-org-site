<script lang="ts">
  import { motion } from "motion-sv";
  import Button from "$lib/components/ui/button/button.svelte";
  import { ArrowLeft, Calendar, Newspaper } from "@lucide/svelte";

  let { data } = $props();
  const article = $derived(data.article);

  function formatDate(d: string | Date | null | undefined) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  function sanitizeContent(content: string) {
    const formatted = content
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br/>")
      .replace(/^/, "<p>")
      .replace(/$/, "</p>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>");
    return formatted;
  }
</script>

<svelte:head>
  <title>{article.title} - gh-mochi-org</title>
  <meta name="description" content={article.excerpt ?? article.title} />
</svelte:head>

<main class="w-full flex flex-col items-center p-3">
  <article class="w-full max-w-3xl px-4 sm:px-8 py-12">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Button href="/news" variant="ghost" size="sm" class="gap-2 mb-8 -ml-2">
        <ArrowLeft class="w-4 h-4" /> Back to News
      </Button>

      <div class="flex items-center gap-2 mb-4">
        <div class="p-1.5 rounded-md bg-primary/10">
          <Newspaper class="w-4 h-4 text-primary" />
        </div>
        <div class="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Calendar class="w-3 h-3" />
          {formatDate(article.published_at ?? article.created_at)}
        </div>
      </div>

      <h1 class="text-2xl sm:text-4xl font-bold mb-6 leading-tight">{article.title}</h1>

      {#if article.excerpt}
        <p class="text-lg text-muted-foreground mb-8 leading-relaxed border-l-2 border-primary/40 pl-4">
          {article.excerpt}
        </p>
      {/if}

      <div class="prose prose-sm sm:prose dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-muted-foreground prose-a:text-primary prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded">
        {@html sanitizeContent(article.body)}
      </div>

      <div class="mt-12 pt-8 border-t border-border/50">
        <Button href="/news" variant="outline" class="gap-2">
          <ArrowLeft class="w-4 h-4" /> More Updates
        </Button>
      </div>
    </motion.div>
  </article>
</main>
