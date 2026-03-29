<script lang="ts">
  import { onMount } from "svelte";
  import { motion } from "motion-sv";
  import AuroraText from "$lib/components/magic/aurora-text/aurora-text.svelte";
  import MagicCard from "$lib/components/magic/magic-card/magic-card.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { FolderDot, Github, GitFork, Package, Star } from "@lucide/svelte";

  interface Project {
    id: number;
    name: string;
    description?: string | null;
    repo_url?: string | null;
    stars?: number;
    forks?: number;
    tags?: string[];
    featured?: boolean;
  }

  let projects: Project[] = $state([]);
  let loading = $state(true);
  let searchQuery = $state("");

  onMount(async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) projects = await res.json();
    } catch (_err) {}
    loading = false;
  });

  const filtered = $derived(
    projects.filter(
      (p) =>
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );
</script>

<svelte:head>
  <title>Projects - gh-mochi-org</title>
  <meta name="description" content="Open-source projects from the gh-mochi-org collective." />
</svelte:head>

<main class="w-full items-center flex flex-col p-3">
  <section class="max-w-4xl mx-auto px-4 sm:px-8 py-16 text-center w-full">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <FolderDot class="w-12 h-12 text-primary mx-auto mb-4" />
      <h1 class="text-3xl sm:text-5xl font-bold mb-4">
        <AuroraText>Our Projects</AuroraText>
      </h1>
      <p class="text-muted-foreground max-w-xl mx-auto leading-relaxed">
        Sweet, cozy, and robust open-source tools — built by developers who actually use them.
      </p>
    </motion.div>
  </section>

  <section class="w-full max-w-4xl px-4 mb-8">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search projects..."
      class="w-full rounded-xl border border-border bg-input/30 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
    />
  </section>

  {#if loading}
    <div class="flex items-center gap-2 text-muted-foreground py-8">
      <span class="animate-spin">⏳</span> Loading projects...
    </div>
  {:else if filtered.length === 0}
    <section class="py-16 px-4 text-center w-full">
      <div class="mx-auto max-w-xl">
        <MagicCard class="p-10 rounded-2xl border border-border/50">
          <FolderDot class="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 class="text-xl font-bold mb-3">{searchQuery ? "No matching projects" : "No projects yet"}</h2>
          <p class="text-sm text-muted-foreground mb-6">
            {searchQuery ? "Try a different search term." : "We're cooking up something amazing."}
          </p>
          {#if !searchQuery}
            <Button href="https://github.com/gh-mochi-org" target="_blank" class="gap-2">
              <Github class="w-4 h-4" /> Browse GitHub
            </Button>
          {/if}
        </MagicCard>
      </div>
    </section>
  {:else}
    <section class="py-4 px-4 w-full">
      <div class="mx-auto max-w-4xl">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each filtered as project, i}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <MagicCard class="p-5 rounded-xl border border-border/50 h-full flex flex-col">
                <div class="flex items-start justify-between mb-3">
                  <Package class="w-5 h-5 text-primary" />
                  <div class="flex gap-2 text-xs text-muted-foreground">
                    <span class="flex items-center gap-1">
                      <Star class="w-3 h-3" />
                      {project.stars ?? 0}
                    </span>
                    <span class="flex items-center gap-1">
                      <GitFork class="w-3 h-3" />
                      {project.forks ?? 0}
                    </span>
                  </div>
                </div>
                <h3 class="font-bold text-sm mb-1.5">{project.name}</h3>
                {#if project.featured}
                  <Badge variant="default" class="text-[8px] px-1.5 py-0 w-fit mb-2">featured</Badge>
                {/if}
                <p class="text-xs text-muted-foreground leading-relaxed flex-1">{project.description ?? ""}</p>
                <div class="flex flex-wrap gap-1 mt-3 mb-4">
                  {#each ((project.tags ?? []) as string[]).slice(0, 3) as tag}
                    <Badge variant="secondary" class="text-[9px] px-1.5 py-0">{tag}</Badge>
                  {/each}
                </div>
                <Button href={project.repo_url ?? "#"} target="_blank" variant="outline" size="sm" class="w-full gap-1.5 mt-auto">
                  <Github class="w-3 h-3" /> View Repo
                </Button>
              </MagicCard>
            </motion.div>
          {/each}
        </div>
      </div>
    </section>
  {/if}
</main>
