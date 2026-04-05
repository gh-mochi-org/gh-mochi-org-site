<script lang="ts">
  import mochi from "$lib/assets/mochi.png";
  import AuroraText from "$lib/components/magic/aurora-text/aurora-text.svelte";
  import MagicCard from "$lib/components/magic/magic-card/magic-card.svelte";
  import Marquee from "$lib/components/magic/marquee/marquee.svelte";
  import MorphingText from "$lib/components/magic/morphing-text/morphing-text.svelte";
  import RippleButton from "$lib/components/magic/ripple-button/ripple-button.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import {
    ArrowRight,
    Box,
    CheckCircle,
    Code2,
    Cpu,
    FolderDot,
    GitFork,
    Github,
    Globe,
    HeartHandshake,
    Layers,
    Mail,
    MessageSquare,
    Newspaper,
    Package,
    Puzzle,
    ShieldCheck,
    Sparkles,
    Star,
    Terminal,
    Users,
    Zap,
  } from "@lucide/svelte";
  import { motion } from "motion-sv";
  import idotconfig from "$lib/assets/idotconfig.png";

  interface Supporter {
    name: string;
    github?: string;
    type?: "sponsor" | "supporter";
  }

  interface Project {
    name: string;
    description: string;
    stars: number;
    forks: number;
    tags: string[];
    repoUrl: string;
  }

  interface NewsItem {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    published_at?: Date | string | null;
  }

  interface PageData {
    supporters?: Supporter[];
    featuredProjects?: Project[];
    recentNews?: NewsItem[];
    stats?: {
      projects: number;
      supporters: number;
      sponsors: number;
    };
  }

  let { data }: { data: PageData } = $props();

  const idotconfig_data = {
    name: "~/.config",
    github: "idotconfig",
    matrix: "@idotconfig:matrix.org",
    discord: "idotconfig",
    bio: "Creator of gh-mochi-org. Building tools that are cozy, robust, and open-source. Always up for a chat about tech, open source, or the best mochi flavors.",
    avatar: idotconfig,
  };

  let email = $state("");
  let subStatus: "idle" | "loading" | "success" | "error" = $state("idle");
  let subMessage = $state("");

  async function subscribe() {
    if (!email || subStatus === "loading") return;
    subStatus = "loading";
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        subStatus = "success";
        subMessage = data.message ?? "Subscribed!";
        email = "";
      } else {
        subStatus = "error";
        subMessage = data.error ?? "Something went wrong.";
      }
    } catch {
      subStatus = "error";
      subMessage = "Network error. Try again.";
    }
  }

  const techStack = [
    "Rust",
    "C++",
    "C",
    "Zig",
    "Go",
    "Python",
    "Bun",
    "Java",
    "Kotlin",
    "Dart",
    "Flutter",
    "Svelte",
    "Next.js",
    "Tailwind",
    "Vite",
    "Docker",
    "CI/CD",
    "GitHub Actions",
    "Linux",
    "Neovim",
  ];

  const morphTexts = [
    "OpenSource",
    "Simplicity",
    "Community",
    "Innovation",
    "Collaboration",
    "Transparency",
    "Empowerment",
    "Sustainability",
    "Inclusivity",
    "Impact",
    "Privacy",
    "Security",
    "Accessibility",
    "Performance",
    "Reliability",
    "Scalability",
    "Maintainability",
    "Flexibility",
    "Extensibility",
    "Control",
  ];

  const values = [
    {
      icon: Zap,
      title: "Fast by default",
      desc: "We build with performance in mind. No bloat, no unnecessary deps.",
    },
    {
      icon: Code2,
      title: "Open source first",
      desc: "Everything we make is AGPL-3.0/Apache-2.0 licensed. Fork it, ship it, improve it.",
    },
    {
      icon: Globe,
      title: "Easy to use",
      desc: "Great DX is non-negotiable. If it's hard to use, it's not done yet.",
    },
    {
      icon: ShieldCheck,
      title: "Privacy respecting",
      desc: "No tracking, no dark patterns. Your data stays yours.",
    },
    {
      icon: Layers,
      title: "Modern architecture",
      desc: "Cutting-edge stack. We embrace the future of web development.",
    },
    {
      icon: Users,
      title: "Community driven",
      desc: "Built by contributors, for developers. Everyone is welcome.",
    },
    {
      icon: CheckCircle,
      title: "Reliable",
      desc: "Battle-tested patterns. What works stays.",
    },
    {
      icon: Puzzle,
      title: "Extensible",
      desc: "Designed to be extended. Plugins, APIs, and hooks from day one.",
    },
    {
      icon: Box,
      title: "Minimal footprint",
      desc: "Small bundles, fewer dependencies, less complexity.",
    },
  ];

  const supporters = $derived(data?.supporters ?? []);
  const projects = $derived(
    [...(data?.featuredProjects ?? [])]
      .sort((a, b) => b.stars + b.forks - (a.stars + a.forks))
      .slice(0, 6),
  );
  const recentNews = $derived(data?.recentNews ?? []);
  const stats = $derived(
    data?.stats ?? { projects: 42, supporters: 128, sponsors: 12 },
  );
</script>

<main class="w-full items-center flex flex-col p-3 z-80">
  <section
    class="max-w-6xl mx-auto px-4 sm:px-8 py-12 flex flex-col items-center text-center"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
      class="relative mb-8"
    >
      <div
        class="absolute inset-0 bg-gray-500/40 rounded-full blur-3xl opacity-50"
      ></div>
      <motion.img
        src={mochi}
        alt="Mochi Mascot"
        class="w-50 h-50 sm:w-64 sm:h-64 object-contain relative z-10 drop-shadow-lg drop-shadow-gray-600 transition-all duration-300"
        style={{ imageRendering: "pixelated" }}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />
    </motion.div>

    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Badge
        variant="secondary"
        class="mb-6 sm:px-4 py-1 sm:py-2 text-[8px] lg:text-sm"
      >
        <Sparkles class="w-4 h-4 mr-2" />
        Open Source Collective
      </Badge>

      <h1 class="text-3xl sm:text-7xl font-bold mb-6 tracking-tighter">
        <AuroraText>gh-mochi-org</AuroraText>
      </h1>

      <Badge
        variant="secondary"
        class="mb-6 sm:px-4 py-1 sm:py-2 text-[8px] lg:text-sm"
      >
        <Sparkles class="w-4 h-4 mr-2" />
        This Website is not live yet!!
      </Badge>

      <p
        class="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto"
      >
        We build <span class="text-primary font-semibold"
          >sweet, cozy, and robust</span
        > open-source tools. Embracing simplicity and modern architecture.
      </p>

      <div
        class="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2"
      >
        <Button href="/projects" size="lg" class="w-full sm:w-auto gap-2">
          <FolderDot class="w-4 h-4" />
          Explore Projects
          <ArrowRight class="w-4 h-4" />
        </Button>
        <RippleButton
          onclick={() => (window.location.href = "/support")}
          class="w-full sm:w-auto px-6 py-2 text-sm font-medium"
          rippleColor="#ff8906"
        >
          <span class="flex items-center gap-2">
            <HeartHandshake class="w-4 h-4" />
            Support Us
          </span>
        </RippleButton>
      </div>
    </motion.div>
  </section>

  <section class="py-12 px-4">
    <div class="mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        class="text-center mb-12"
      >
        <h2 class="text-2xl sm:text-4xl font-bold mb-4">Who we are</h2>
        <p
          class="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm sm:text-base"
        >
          gh-mochi-org is a collective of developers who believe great software
          can be cozy. We build tools we actually use.
        </p>
      </motion.div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each values as val, i}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
          >
            <MagicCard
              class="p-5 rounded-xl border border-border/50 h-full bg-pink-50/40 dark:bg-transparent [&>div.bg-background]:bg-pink-50/40 dark:[&>div.bg-background]:bg-background"
            >
              {#if val.icon}
                <val.icon class="w-6 h-6 text-primary mb-3" />
              {/if}
              <h3 class="font-semibold text-sm mb-1.5">{val.title}</h3>
              <p class="text-xs text-muted-foreground leading-relaxed">
                {val.desc}
              </p>
            </MagicCard>
          </motion.div>
        {/each}
      </div>
    </div>
  </section>

  <section
    class="w-full min-h-[50vh] py-16 flex flex-col items-center justify-center text-center border-y gap-6"
  >
    <h1 class="text-md text-muted-foreground mb-8 tracking-widest uppercase">
      We Value
    </h1>

    <MorphingText
      texts={morphTexts}
      class="text-3xl sm:text-5xl lg:text-6xl font-semibold text-primary whitespace-nowrap"
    />

    <p
      class="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm sm:text-base"
    >
      Open source is more than just code.
    </p>

    <div class="mx-auto max-w-4xl grid grid-cols-3 gap-4 sm:gap-8">
      {#each [{ label: "Projects", value: stats.projects, icon: FolderDot }, { label: "Supporters", value: stats.supporters, icon: HeartHandshake }, { label: "Sponsors", value: stats.sponsors, icon: Mail }] as stat}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          class="text-center"
        >
          <MagicCard
            class="p-4 sm:p-6 rounded-xl border border-border/50 bg-pink-50/40 dark:bg-transparent [&>div.bg-background]:bg-pink-50/40 dark:[&>div.bg-background]:bg-background"
          >
            {#if stat.icon}
              <stat.icon class="w-6 h-6 text-primary mx-auto mb-3" />
            {/if}
            <p class="text-2xl sm:text-4xl font-bold text-foreground">
              {stat.value}
            </p>
            <p class="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </MagicCard>
        </motion.div>
      {/each}
    </div>
  </section>

  {#if projects.length > 0}
    <section class="py-12 px-4">
      <div class="mx-auto max-w-4xl">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold">Featured Projects</h2>
            <p class="text-sm text-muted-foreground mt-1">
              What we've been cooking
            </p>
          </div>
          <Button href="/projects" variant="outline" size="sm" class="gap-1.5">
            View all <ArrowRight class="w-3 h-3" />
          </Button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each projects as project}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <MagicCard
                class="p-5 rounded-xl border border-border/50 h-full flex flex-col bg-pink-50/40 dark:bg-transparent [&>div.bg-background]:bg-pink-50/40 dark:[&>div.bg-background]:bg-background"
              >
                <div class="flex items-start justify-between mb-3">
                  <Package class="w-5 h-5 text-primary" />
                  <div class="flex gap-2 text-xs text-muted-foreground">
                    <span class="flex items-center gap-1">
                      <Star class="w-3 h-3" />
                      {project.stars}
                    </span>
                    <span class="flex items-center gap-1">
                      <GitFork class="w-3 h-3" />
                      {project.forks}
                    </span>
                  </div>
                </div>
                <h3 class="font-bold text-sm mb-1.5">{project.name}</h3>
                <p class="text-xs text-muted-foreground leading-relaxed flex-1">
                  {project.description}
                </p>
                <div class="flex flex-wrap gap-1 mt-3 mb-4">
                  {#each (project.tags ?? []).slice(0, 3) as tag}
                    <Badge variant="secondary" class="text-[9px] px-1.5 py-0"
                      >{tag}</Badge
                    >
                  {/each}
                </div>
                <Button
                  href={project.repoUrl}
                  target="_blank"
                  variant="outline"
                  size="sm"
                  class="w-full gap-1.5 mt-auto"
                >
                  <Github class="w-3 h-3" /> View Repo
                </Button>
              </MagicCard>
            </motion.div>
          {/each}
        </div>
      </div>
    </section>
  {:else}
    <section class="py-12 px-4 text-center">
      <div class="mx-auto max-w-4xl py-12">
        <h2 class="text-2xl sm:text-3xl font-bold mb-6">
          <AuroraText>Featured Projects Coming Soon</AuroraText>
        </h2>
        <p class="text-muted-foreground mb-8 max-w-xl mx-auto">
          We're cooking up something amazing.
        </p>
        <Button href="/projects" size="lg" class="gap-2">
          Explore All Projects <ArrowRight class="w-4 h-4" />
        </Button>
      </div>
    </section>
  {/if}

  <section class="py-12 border-y border-border/40 overflow-hidden">
    <h2
      class="text-center text-md text-muted-foreground w-full max-w-2xl mx-auto mb-8 px-4 text-balance"
    >
      <AuroraText>Wanna make something new?</AuroraText>
    </h2>
    <p
      class="text-center text-sm text-muted-foreground w-full max-w-2xl mx-auto mb-8 px-4 text-balance"
    >
      Have an awesome idea?
    </p>

    <p
      class="text-center text-sm text-muted-foreground w-full max-w-2xl mx-auto mb-8 px-4 text-balance"
    >
      We'd love to hear it!
    </p>
    <p
      class="text-center text-xs text-muted-foreground mb-6 tracking-widest uppercase px-4"
    >
      Tech Stack We Love
    </p>
    <Marquee pauseOnHover class="[--gap:1.5rem]">
      {#each techStack as tech}
        <div
          class="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-4 py-2 text-xs font-mono text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
        >
          {tech}
        </div>
      {/each}
    </Marquee>

    <Marquee pauseOnHover class="[--gap:1.5rem]" reverse>
      {#each techStack as tech}
        <div
          class="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-4 py-2 text-xs font-mono text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
        >
          {tech}
        </div>
      {/each}
    </Marquee>
  </section>

  {#if supporters.length > 0}
    <section class="py-12 px-4">
      <div class="mx-auto max-w-4xl text-center">
        <h2 class="text-2xl sm:text-3xl font-bold mb-2">Our Community</h2>
        <p class="text-sm text-muted-foreground mb-8">
          Amazing people who believe in open source
        </p>
        <Marquee pauseOnHover reverse class="[--gap:1rem]">
          {#each supporters as s}
            <div
              class="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs"
            >
              <HeartHandshake class="w-3 h-3 text-primary" />
              <span class="font-medium">
                {#if s.github}
                  <a
                    href="https://github.com/{s.github}"
                    target="_blank"
                    class="hover:text-primary transition-colors"
                  >
                    {s.name}
                  </a>
                {:else}
                  {s.name}
                {/if}
              </span>
              {#if s.type === "sponsor"}
                <Badge variant="default" class="text-[8px] px-1 py-0"
                  >sponsor</Badge
                >
              {/if}
            </div>
          {/each}
        </Marquee>
      </div>
    </section>
  {:else}
    <section class="py-12 px-4 text-center">
      <div class="mx-auto max-w-4xl py-12">
        <h2 class="text-2xl sm:text-3xl font-bold mb-6">
          <AuroraText>Join Our Community</AuroraText>
        </h2>
        <p class="text-muted-foreground mb-8 max-w-xl mx-auto">
          Be part of something special.
        </p>
        <Button href="/support" size="lg" class="gap-2">
          <HeartHandshake class="w-4 h-4" />
          Become a Supporter
        </Button>
      </div>
    </section>
  {/if}

  <section class="py-12 px-4 border-b border-border/40">
    <div class="w-full mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        class="text-center mb-12"
      >
        <h2 class="text-3xl sm:text-4xl font-bold mb-4">About the Creator</h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Meet the person behind gh-mochi-org
        </p>
      </motion.div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          class="lg:col-span-1"
        >
          <MagicCard
            class="h-full p-6 rounded-xl border border-border/50 flex flex-col justify-between bg-pink-50/40 dark:bg-transparent [&>div.bg-background]:bg-pink-50/40 dark:[&>div.bg-background]:bg-background"
          >
            <div class="text-center">
              <div
                class="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center overflow-hidden border-2 border-primary/20"
              >
                <enhanced:img
                  src={idotconfig}
                  alt="idotconfig"
                  class="rounded-full"
                />
              </div>
              <h3 class="font-bold text-lg mb-1">~/.config</h3>
              <p class="text-xs text-primary font-mono mb-4">idotconfig</p>
              <p class="text-xs text-muted-foreground leading-relaxed mb-6">
                Creator & Maintainer of gh-mochi-org.
              </p>
              <div class="flex flex-col gap-2 justify-center">
                <div class="flex gap-2 justify-center">
                  <Button
                    href="https://github.com/idotconfig"
                    target="_blank"
                    variant="outline"
                    size="sm"
                    class="flex-1 gap-1.5"
                  >
                    <Github class="w-3 h-3" />
                    GitHub
                  </Button>
                  <Button
                    href="https://x.com/idotconfig"
                    target="_blank"
                    variant="outline"
                    size="sm"
                    class="flex-1 gap-1.5"
                  >
                    <Cpu class="w-3 h-3" />
                    X
                  </Button>
                </div>
                <div class="flex gap-2 justify-center">
                  <Button
                    href="https://matrix.to/#/@git.mochi:matrix.org"
                    target="_blank"
                    variant="outline"
                    size="sm"
                    class="flex-1 gap-1.5"
                  >
                    <MessageSquare class="w-3 h-3" />
                    Matrix
                  </Button>
                  <Button
                    href="https://discord.gg/kzTxnARC6b"
                    target="_blank"
                    variant="outline"
                    size="sm"
                    class="flex-1 gap-1.5"
                  >
                    <MessageSquare class="w-3 h-3" />
                    Discord
                  </Button>
                </div>
              </div>
            </div>
          </MagicCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          class="lg:col-span-2"
        >
          <MagicCard
            class="p-6 rounded-xl border border-border/50 h-full bg-pink-50/40 dark:bg-transparent [&>div.bg-background]:bg-pink-50/40 dark:[&>div.bg-background]:bg-background"
          >
            <div class="space-y-4">
              <div>
                <h4 class="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles class="w-4 h-4 text-primary" />
                  My Story
                </h4>
                <p class="text-sm text-muted-foreground leading-relaxed">
                  I'm a passionate developer and open-source enthusiast who
                  believes software should be both powerful and joyful.
                </p>
              </div>

              <div>
                <h4 class="font-semibold mb-2 flex items-center gap-2">
                  <Code2 class="w-4 h-4 text-primary" />
                  What I Do
                </h4>
                <p class="text-sm text-muted-foreground leading-relaxed">
                  I use nvim in my Arch Linux to write Rust code to run on my i5
                  2400 intel machine and make source available to the world (yes
                  I don't have GPU and I should upgrade and I need your help!!)
                </p>
              </div>

              <div>
                <h4 class="font-semibold mb-3 flex items-center gap-2">
                  <Zap class="w-4 h-4 text-primary" />
                  Outside of Code
                </h4>
                <div class="flex flex-wrap gap-2">
                  <Badge variant="secondary">Mention Linux</Badge>
                  <Badge variant="secondary">Use Linux</Badge>
                  <Badge variant="secondary">Mention Rust</Badge>
                  <Badge variant="secondary">Use Rust</Badge>
                  <Badge variant="secondary">Stare at my slow pc</Badge>
                  <Badge variant="secondary">Wait for code to finish comp</Badge
                  >
                </div>
              </div>
            </div>
          </MagicCard>
        </motion.div>
      </div>
    </div>
  </section>

  {#if recentNews.length > 0}
    <section class="py-12 px-4 border-b border-border/40">
      <div class="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          class="flex items-center justify-between mb-10"
        >
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold">Latest News</h2>
            <p class="text-sm text-muted-foreground mt-1">
              Updates from the collective
            </p>
          </div>
          <Button href="/news" variant="outline" size="sm" class="gap-1.5">
            All News <ArrowRight class="w-3 h-3" />
          </Button>
        </motion.div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each recentNews as item, i}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <a href="/news/{item.slug}" class="block h-full">
                <MagicCard
                  class="p-5 rounded-xl border border-border/50 h-full flex flex-col hover:border-primary/40 transition-colors bg-pink-50/40 dark:bg-transparent [&>div.bg-background]:bg-pink-50/40 dark:[&>div.bg-background]:bg-background"
                >
                  <Newspaper class="w-5 h-5 text-primary mb-3" />
                  <h3 class="font-bold text-sm mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  {#if item.excerpt}
                    <p
                      class="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3"
                    >
                      {item.excerpt}
                    </p>
                  {/if}
                  <p class="text-[10px] text-muted-foreground/60 mt-3">
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )
                      : ""}
                  </p>
                </MagicCard>
              </a>
            </motion.div>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <section class="py-12 px-4">
    <div class="mx-auto max-w-xl">
      <MagicCard
        class="p-8 sm:p-10 rounded-2xl border border-border/50 text-center bg-pink-50/40 dark:bg-transparent [&>div.bg-background]:bg-pink-50/40 dark:[&>div.bg-background]:bg-background"
      >
        <Mail class="w-8 h-8 text-primary mx-auto mb-4" />
        <h2 class="text-xl sm:text-2xl font-bold mb-2">Stay in the loop</h2>
        <p class="text-sm text-muted-foreground mb-6 leading-relaxed">
          Get notified when we ship something new. No spam, just cozy updates.
        </p>

        {#if subStatus === "success"}
          <p class="text-primary font-medium text-sm">{subMessage}</p>
        {:else}
          <div class="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              bind:value={email}
              placeholder="your @email.com"
              onkeydown={(e) => e.key === "Enter" && subscribe()}
              class="flex-1 rounded-lg border border-border bg-input/30 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
            <RippleButton
              onclick={subscribe}
              disabled={subStatus === "loading"}
              class="px-5 py-2 text-sm font-medium whitespace-nowrap"
              rippleColor="#ff8906"
            >
              {subStatus === "loading" ? "Subscribing..." : "Subscribe"}
            </RippleButton>
          </div>
          {#if subStatus === "error"}
            <p class="text-destructive text-xs mt-2">{subMessage}</p>
          {/if}
        {/if}
      </MagicCard>
    </div>
  </section>

  <section class="py-12 px-4">
    <div class="mx-auto max-w-4xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 class="text-2xl sm:text-3xl font-bold mb-4">Join the collective</h2>
        <p class="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
          Open source thrives on collaboration.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <Button
            href="https://github.com/gh-mochi-org"
            target="_blank"
            size="lg"
            class="gap-2"
          >
            <Github class="w-4 h-4" />
            GitHub Org
          </Button>
          <Button
            href="https://x.com/idotconfig"
            target="_blank"
            variant="outline"
            size="lg"
            class="gap-2"
          >
            <Cpu class="w-4 h-4" />
            Follow on X
          </Button>
          <RippleButton
            onclick={() => (window.location.href = "/support")}
            class="px-6 py-2.5 text-sm font-medium"
            rippleColor="#ff8906"
          >
            <span class="flex items-center gap-2">
              <HeartHandshake class="w-4 h-4" />
              Support the project
            </span>
          </RippleButton>
        </div>
      </motion.div>
    </div>
  </section>
</main>
