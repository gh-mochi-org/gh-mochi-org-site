<script lang="ts">
  import { onMount } from "svelte";
  import {
    LayoutDashboard,
    FolderDot,
    Newspaper,
    Users,
    Mail,
    Plus,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    LogOut,
    Check,
    X,
    ChevronRight,
    RefreshCw,
    Star,
    HeartHandshake,
  } from "@lucide/svelte";

  interface Project {
    id: number;
    name: string;
    description?: string | null;
    repo_url?: string | null;
    stars?: number;
    forks?: number;
    tags?: string[];
    featured: boolean;
    order?: number;
  }

  interface NewsItem {
    id: number;
    title: string;
    slug: string;
    body: string;
    excerpt?: string | null;
    published: boolean;
    published_at?: string | null;
    created_at: string;
  }

  interface Supporter {
    id: number;
    name: string;
    email?: string | null;
    amount?: string | null;
    type: string;
    paid_at: string;
    visible: boolean;
  }

  interface Subscriber {
    id: number;
    email: string;
    name?: string | null;
    subscribed_at: string;
  }

  type Tab = "overview" | "projects" | "news" | "supporters" | "subscribers";
  let activeTab: Tab = $state("overview");

  let projects: Project[] = $state([]);
  let newsItems: NewsItem[] = $state([]);
  let supporters: Supporter[] = $state([]);
  let subscribers: Subscriber[] = $state([]);
  let loading = $state(true);

  let showProjectForm = $state(false);
  let editingProject: Project | null = $state(null);
  let pName = $state("");
  let pDesc = $state("");
  let pRepo = $state("");
  let pStars = $state(0);
  let pForks = $state(0);
  let pTags = $state("");
  let pFeatured = $state(false);
  let pOrder = $state(0);

  let showNewsForm = $state(false);
  let editingNews: NewsItem | null = $state(null);
  let nTitle = $state("");
  let nSlug = $state("");
  let nExcerpt = $state("");
  let nBody = $state("");
  let nPublished = $state(false);

  let saving = $state(false);
  let toastMsg = $state("");
  let toastType: "success" | "error" = $state("success");

  function slugify(s: string) {
    return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function toast(msg: string, type: "success" | "error" = "success") {
    toastMsg = msg;
    toastType = type;
    setTimeout(() => (toastMsg = ""), 3500);
  }

  async function fetchAll() {
    loading = true;
    try {
      const [pRes, nRes, sRes] = await Promise.all([
        fetch("/api/admin/projects"),
        fetch("/api/admin/news"),
        fetch("/api/admin/supporters"),
      ]);
      if (pRes.ok) projects = await pRes.json();
      if (nRes.ok) newsItems = await nRes.json();
      if (sRes.ok) {
        const data = await sRes.json();
        supporters = data.supporters ?? [];
        subscribers = data.subscribers ?? [];
      }
    } catch (e) {
      toast("Failed to load data", "error");
    }
    loading = false;
  }

  onMount(fetchAll);

  function openNewProject() {
    editingProject = null;
    pName = ""; pDesc = ""; pRepo = ""; pStars = 0; pForks = 0; pTags = ""; pFeatured = false; pOrder = 0;
    showProjectForm = true;
  }

  function openEditProject(p: Project) {
    editingProject = p;
    pName = p.name; pDesc = p.description ?? ""; pRepo = p.repo_url ?? "";
    pStars = p.stars ?? 0; pForks = p.forks ?? 0;
    pTags = (p.tags ?? []).join(", "); pFeatured = p.featured; pOrder = p.order ?? 0;
    showProjectForm = true;
  }

  async function saveProject() {
    if (!pName.trim()) { toast("Name is required", "error"); return; }
    saving = true;
    const body = {
      ...(editingProject ? { id: editingProject.id } : {}),
      name: pName.trim(), description: pDesc.trim() || null, repo_url: pRepo.trim() || null,
      stars: Number(pStars), forks: Number(pForks),
      tags: pTags.split(",").map((t) => t.trim()).filter(Boolean),
      featured: pFeatured, order: Number(pOrder),
    };
    const res = await fetch("/api/admin/projects", {
      method: editingProject ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    saving = false;
    if (res.ok) {
      toast(editingProject ? "Project updated" : "Project created");
      showProjectForm = false;
      fetchAll();
    } else {
      toast("Failed to save project", "error");
    }
  }

  async function deleteProject(id: number) {
    if (!confirm("Delete this project?")) return;
    await fetch("/api/admin/projects", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    toast("Project deleted");
    fetchAll();
  }

  function openNewNews() {
    editingNews = null;
    nTitle = ""; nSlug = ""; nExcerpt = ""; nBody = ""; nPublished = false;
    showNewsForm = true;
  }

  function openEditNews(n: NewsItem) {
    editingNews = n;
    nTitle = n.title; nSlug = n.slug; nExcerpt = n.excerpt ?? ""; nBody = n.body; nPublished = n.published;
    showNewsForm = true;
  }

  async function saveNews() {
    if (!nTitle.trim()) { toast("Title is required", "error"); return; }
    if (!nSlug.trim()) nSlug = slugify(nTitle);
    saving = true;
    const body = {
      ...(editingNews ? { id: editingNews.id } : {}),
      title: nTitle.trim(), slug: nSlug.trim(), excerpt: nExcerpt.trim() || null,
      body: nBody.trim(), published: nPublished,
    };
    const res = await fetch("/api/admin/news", {
      method: editingNews ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    saving = false;
    if (res.ok) {
      toast(editingNews ? "News updated" : "News published");
      showNewsForm = false;
      fetchAll();
    } else {
      toast("Failed to save news", "error");
    }
  }

  async function deleteNews(id: number) {
    if (!confirm("Delete this news item?")) return;
    await fetch("/api/admin/news", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    toast("News deleted");
    fetchAll();
  }

  async function toggleNewsPublished(item: NewsItem) {
    await fetch("/api/admin/news", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, published: !item.published }),
    });
    fetchAll();
  }

  async function toggleSupporterVisible(s: Supporter) {
    await fetch("/api/admin/supporters", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: s.id, visible: !s.visible }),
    });
    fetchAll();
  }

  function fmtDate(d: string | null | undefined) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  const stats = $derived({
    projects: projects.length,
    featuredProjects: projects.filter((p) => p.featured).length,
    news: newsItems.length,
    publishedNews: newsItems.filter((n) => n.published).length,
    supporters: supporters.length,
    sponsors: supporters.filter((s) => s.type === "sponsor").length,
    subscribers: subscribers.length,
  });
</script>

<svelte:head>
  <title>Admin - gh-mochi-org</title>
</svelte:head>

{#if toastMsg}
  <div
    class="fixed top-4 right-4 z-[200] flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-md transition-all
    {toastType === 'success'
      ? 'border-primary/40 bg-primary/10 text-primary'
      : 'border-destructive/40 bg-destructive/10 text-destructive'}"
  >
    {#if toastType === "success"}
      <Check class="w-4 h-4" />
    {:else}
      <X class="w-4 h-4" />
    {/if}
    {toastMsg}
  </div>
{/if}

<div class="min-h-screen bg-background flex flex-col">
  <header
    class="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md"
  >
    <div class="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="font-bold text-primary text-sm font-mono">~/.mochi</span>
        <span class="text-muted-foreground/40 text-xs">|</span>
        <span class="text-xs text-muted-foreground tracking-widest uppercase">Admin</span>
      </div>
      <div class="flex items-center gap-3">
        <button
          onclick={fetchAll}
          class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded"
        >
          <RefreshCw class="w-3.5 h-3.5" /> Refresh
        </button>
        <a
          href="/"
          class="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
        >
          Site
        </a>
        <form method="POST" action="/api/admin/logout">
          <button
            type="submit"
            class="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-all"
          >
            <LogOut class="w-3 h-3" /> Logout
          </button>
        </form>
      </div>
    </div>
  </header>

  <div class="flex flex-1 overflow-hidden">
    <aside
      class="w-52 border-r border-border/60 flex-shrink-0 hidden md:flex flex-col py-4"
    >
      {#each [{ id: "overview", icon: LayoutDashboard, label: "Overview" }, { id: "projects", icon: FolderDot, label: "Projects" }, { id: "news", icon: Newspaper, label: "News" }, { id: "supporters", icon: HeartHandshake, label: "Supporters" }, { id: "subscribers", icon: Mail, label: "Subscribers" }] as item}
        <button
          onclick={() => (activeTab = item.id as Tab)}
          class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors
          {activeTab === item.id
            ? 'text-primary bg-primary/8 border-r-2 border-primary font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'}"
        >
          <item.icon class="w-4 h-4 flex-shrink-0" />
          {item.label}
          {#if item.id === "projects"}
            <span class="ml-auto text-[10px] text-muted-foreground tabular-nums">{stats.projects}</span>
          {:else if item.id === "news"}
            <span class="ml-auto text-[10px] text-muted-foreground tabular-nums">{stats.news}</span>
          {:else if item.id === "supporters"}
            <span class="ml-auto text-[10px] text-muted-foreground tabular-nums">{stats.supporters}</span>
          {:else if item.id === "subscribers"}
            <span class="ml-auto text-[10px] text-muted-foreground tabular-nums">{stats.subscribers}</span>
          {/if}
        </button>
      {/each}
    </aside>

    <div
      class="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/90 backdrop-blur-md flex"
    >
      {#each [{ id: "overview", icon: LayoutDashboard }, { id: "projects", icon: FolderDot }, { id: "news", icon: Newspaper }, { id: "supporters", icon: HeartHandshake }, { id: "subscribers", icon: Mail }] as item}
        <button
          onclick={() => (activeTab = item.id as Tab)}
          class="flex-1 flex flex-col items-center py-3 gap-1 text-[10px] transition-colors
          {activeTab === item.id ? 'text-primary' : 'text-muted-foreground'}"
        >
          <item.icon class="w-4 h-4" />
        </button>
      {/each}
    </div>

    <main class="flex-1 overflow-auto pb-24 md:pb-0">
      <div class="mx-auto max-w-5xl px-4 py-6">
        {#if loading}
          <div class="flex items-center justify-center py-20 text-muted-foreground gap-2">
            <RefreshCw class="w-4 h-4 animate-spin" /> Loading...
          </div>
        {:else if activeTab === "overview"}
          <div>
            <h2 class="text-xl font-bold mb-6">Overview</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {#each [{ label: "Projects", value: stats.projects, sub: stats.featuredProjects + " featured", icon: FolderDot, color: "text-primary" }, { label: "News", value: stats.news, sub: stats.publishedNews + " published", icon: Newspaper, color: "text-secondary" }, { label: "Supporters", value: stats.supporters, sub: stats.sponsors + " sponsors", icon: HeartHandshake, color: "text-green-500" }, { label: "Subscribers", value: stats.subscribers, sub: "newsletter", icon: Mail, color: "text-blue-400" }] as s}
                <div class="border border-border/60 rounded-xl p-4 bg-card/40">
                  <s.icon class="w-4 h-4 {s.color} mb-2" />
                  <p class="text-2xl font-bold">{s.value}</p>
                  <p class="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                  <p class="text-[10px] text-muted-foreground/60 mt-0.5">{s.sub}</p>
                </div>
              {/each}
            </div>

            <h3 class="text-sm font-semibold text-muted-foreground mb-3 tracking-wide uppercase">Quick Actions</h3>
            <div class="flex flex-wrap gap-2">
              <button
                onclick={() => { activeTab = "projects"; openNewProject(); }}
                class="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/8 text-primary px-4 py-2 text-sm hover:bg-primary/15 transition-colors"
              >
                <Plus class="w-4 h-4" /> New Project
              </button>
              <button
                onclick={() => { activeTab = "news"; openNewNews(); }}
                class="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 text-foreground px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
              >
                <Plus class="w-4 h-4" /> New Post
              </button>
            </div>
          </div>
        {:else if activeTab === "projects"}
          <div>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold">Projects</h2>
              <button
                onclick={openNewProject}
                class="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus class="w-4 h-4" /> Add Project
              </button>
            </div>

            {#if showProjectForm}
              <div class="border border-border/60 rounded-xl p-6 bg-card/40 mb-6">
                <h3 class="font-semibold mb-4 text-sm">{editingProject ? "Edit Project" : "New Project"}</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="field-label">Name *</label>
                    <input bind:value={pName} class="field-input" placeholder="Project name" />
                  </div>
                  <div>
                    <label class="field-label">Repo URL</label>
                    <input bind:value={pRepo} class="field-input" placeholder="https://github.com/..." />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="field-label">Description</label>
                    <textarea bind:value={pDesc} class="field-input min-h-[80px] resize-none" placeholder="Short description..."></textarea>
                  </div>
                  <div>
                    <label class="field-label">Stars</label>
                    <input type="number" bind:value={pStars} class="field-input" min="0" />
                  </div>
                  <div>
                    <label class="field-label">Forks</label>
                    <input type="number" bind:value={pForks} class="field-input" min="0" />
                  </div>
                  <div>
                    <label class="field-label">Tags (comma-separated)</label>
                    <input bind:value={pTags} class="field-input" placeholder="Rust, CLI, Fast" />
                  </div>
                  <div>
                    <label class="field-label">Display Order</label>
                    <input type="number" bind:value={pOrder} class="field-input" />
                  </div>
                  <div class="flex items-center gap-2">
                    <input id="p-featured" type="checkbox" bind:checked={pFeatured} class="w-4 h-4 accent-primary" />
                    <label for="p-featured" class="text-sm">Featured on homepage</label>
                  </div>
                </div>
                <div class="flex gap-2 mt-5">
                  <button onclick={saveProject} disabled={saving} class="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button onclick={() => (showProjectForm = false)} class="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                </div>
              </div>
            {/if}

            {#if projects.length === 0}
              <div class="text-center py-16 text-muted-foreground text-sm">No projects yet. Add one above!</div>
            {:else}
              <div class="border border-border/60 rounded-xl overflow-hidden">
                {#each projects as p, i}
                  <div class="flex items-center gap-3 px-4 py-3 {i % 2 === 0 ? 'bg-muted/10' : ''} {i > 0 ? 'border-t border-border/40' : ''}">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <p class="font-medium text-sm truncate">{p.name}</p>
                        {#if p.featured}
                          <span class="rounded-full bg-primary/15 text-primary text-[10px] px-2 py-0.5 font-medium">featured</span>
                        {/if}
                      </div>
                      <p class="text-xs text-muted-foreground truncate mt-0.5">{p.description ?? ""}</p>
                      {#if (p.tags ?? []).length > 0}
                        <div class="flex gap-1 mt-1 flex-wrap">
                          {#each (p.tags ?? []).slice(0, 4) as tag}
                            <span class="text-[9px] bg-muted/40 rounded px-1.5 py-0.5 text-muted-foreground">{tag}</span>
                          {/each}
                        </div>
                      {/if}
                    </div>
                    <div class="flex items-center gap-1 flex-shrink-0">
                      <button onclick={() => openEditProject(p)} class="p-1.5 rounded hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                        <Pencil class="w-3.5 h-3.5" />
                      </button>
                      <button onclick={() => deleteProject(p.id)} class="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {:else if activeTab === "news"}
          <div>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold">News</h2>
              <button onclick={openNewNews} class="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus class="w-4 h-4" /> New Post
              </button>
            </div>

            {#if showNewsForm}
              <div class="border border-border/60 rounded-xl p-6 bg-card/40 mb-6">
                <h3 class="font-semibold mb-4 text-sm">{editingNews ? "Edit Post" : "New Post"}</h3>
                <div class="space-y-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="sm:col-span-2">
                      <label class="field-label">Title *</label>
                      <input bind:value={nTitle} oninput={() => { if (!editingNews) nSlug = slugify(nTitle); }} class="field-input" placeholder="Post title..." />
                    </div>
                    <div>
                      <label class="field-label">Slug <span class="text-muted-foreground/60 ml-1 normal-case font-normal">(auto-generated)</span></label>
                      <input bind:value={nSlug} class="field-input font-mono text-xs" placeholder="post-slug" />
                    </div>
                    <div class="flex items-center gap-2 self-end pb-1">
                      <input id="n-published" type="checkbox" bind:checked={nPublished} class="w-4 h-4 accent-primary" />
                      <label for="n-published" class="text-sm">Published</label>
                    </div>
                  </div>
                  <div>
                    <label class="field-label">Excerpt</label>
                    <input bind:value={nExcerpt} class="field-input" placeholder="Short summary..." />
                  </div>
                  <div>
                    <label class="field-label">Body (Markdown)</label>
                    <textarea bind:value={nBody} class="field-input min-h-[200px] resize-y font-mono text-xs" placeholder="# Hello World"></textarea>
                  </div>
                </div>
                <div class="flex gap-2 mt-5">
                  <button onclick={saveNews} disabled={saving} class="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                    {saving ? "Saving..." : editingNews ? "Update Post" : "Publish Post"}
                  </button>
                  <button onclick={() => (showNewsForm = false)} class="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                </div>
              </div>
            {/if}

            {#if newsItems.length === 0}
              <div class="text-center py-16 text-muted-foreground text-sm">No news yet.</div>
            {:else}
              <div class="border border-border/60 rounded-xl overflow-hidden">
                {#each newsItems as n, i}
                  <div class="flex items-center gap-3 px-4 py-3 {i % 2 === 0 ? 'bg-muted/10' : ''} {i > 0 ? 'border-t border-border/40' : ''}">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <p class="font-medium text-sm truncate">{n.title}</p>
                        {#if n.published}
                          <span class="rounded-full bg-green-500/15 text-green-500 text-[10px] px-2 py-0.5 font-medium">published</span>
                        {:else}
                          <span class="rounded-full bg-muted/50 text-muted-foreground text-[10px] px-2 py-0.5">draft</span>
                        {/if}
                      </div>
                      <p class="text-[11px] text-muted-foreground mt-0.5 font-mono">/{n.slug}</p>
                      <p class="text-[10px] text-muted-foreground/60 mt-0.5">{fmtDate(n.published_at ?? n.created_at)}</p>
                    </div>
                    <div class="flex items-center gap-1 flex-shrink-0">
                      <button onclick={() => toggleNewsPublished(n)} class="p-1.5 rounded hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors" title={n.published ? "Unpublish" : "Publish"}>
                        {#if n.published}<EyeOff class="w-3.5 h-3.5" />{:else}<Eye class="w-3.5 h-3.5" />{/if}
                      </button>
                      <button onclick={() => openEditNews(n)} class="p-1.5 rounded hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                        <Pencil class="w-3.5 h-3.5" />
                      </button>
                      <a href="/news/{n.slug}" target="_blank" class="p-1.5 rounded hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors" title="View">
                        <ChevronRight class="w-3.5 h-3.5" />
                      </a>
                      <button onclick={() => deleteNews(n.id)} class="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {:else if activeTab === "supporters"}
          <div>
            <h2 class="text-xl font-bold mb-6">Supporters & Sponsors</h2>
            {#if supporters.length === 0}
              <div class="text-center py-16 text-muted-foreground text-sm">No supporters yet.</div>
            {:else}
              <div class="border border-border/60 rounded-xl overflow-hidden">
                {#each supporters as s, i}
                  <div class="flex items-center gap-3 px-4 py-3 {i % 2 === 0 ? 'bg-muted/10' : ''} {i > 0 ? 'border-t border-border/40' : ''}">
                    <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-xs">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <p class="font-medium text-sm truncate">{s.name}</p>
                        {#if s.type === "sponsor"}
                          <span class="rounded-full bg-primary/15 text-primary text-[10px] px-2 py-0.5 font-medium flex items-center gap-1">
                            <Star class="w-2.5 h-2.5" /> sponsor
                          </span>
                        {/if}
                        {#if !s.visible}
                          <span class="rounded-full bg-muted/50 text-muted-foreground text-[10px] px-2 py-0.5">hidden</span>
                        {/if}
                      </div>
                      <div class="flex items-center gap-2 mt-0.5">
                        {#if s.email}<p class="text-[11px] text-muted-foreground truncate">{s.email}</p>{/if}
                        {#if s.amount}<p class="text-[11px] text-primary font-medium">${s.amount}</p>{/if}
                        <p class="text-[10px] text-muted-foreground/60">{fmtDate(s.paid_at)}</p>
                      </div>
                    </div>
                    <button onclick={() => toggleSupporterVisible(s)} class="p-1.5 rounded hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" title={s.visible ? "Hide from public" : "Show on public"}>
                      {#if s.visible}<Eye class="w-3.5 h-3.5" />{:else}<EyeOff class="w-3.5 h-3.5" />{/if}
                    </button>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {:else if activeTab === "subscribers"}
          <div>
            <h2 class="text-xl font-bold mb-2">Newsletter Subscribers</h2>
            <p class="text-sm text-muted-foreground mb-6">{stats.subscribers} total</p>
            {#if subscribers.length === 0}
              <div class="text-center py-16 text-muted-foreground text-sm">No subscribers yet.</div>
            {:else}
              <div class="border border-border/60 rounded-xl overflow-hidden">
                {#each subscribers as sub, i}
                  <div class="flex items-center gap-3 px-4 py-3 {i % 2 === 0 ? 'bg-muted/10' : ''} {i > 0 ? 'border-t border-border/40' : ''}">
                    <div class="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400">
                      <Mail class="w-3 h-3" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm truncate">{sub.email}</p>
                      {#if sub.name}
                        <p class="text-[11px] text-muted-foreground">{sub.name}</p>
                      {/if}
                    </div>
                    <p class="text-[10px] text-muted-foreground/60 flex-shrink-0">{fmtDate(sub.subscribed_at)}</p>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </main>
  </div>
</div>

<style>
  :global(.field-label) {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.375rem;
  }
  :global(.field-input) {
    width: 100%;
    border-radius: 0.5rem;
    border: 1px solid var(--border);
    background: color-mix(in oklab, var(--input) 30%, transparent);
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    color: var(--foreground);
  }
  :global(.field-input:focus) {
    border-color: color-mix(in oklab, var(--primary) 50%, transparent);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 20%, transparent);
  }
</style>
