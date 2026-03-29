<script lang="ts">
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";

  const hasError = $derived($page.url.searchParams.get("error") === "1");
</script>

<svelte:head>
  <title>Admin Login - gh-mochi-org</title>
</svelte:head>

<div
  class="min-h-screen flex items-center justify-center bg-background relative overflow-hidden"
>
  <div
    class="absolute inset-0 opacity-[0.03]"
    style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 40px 40px;"
  ></div>

  <div class="relative z-10 w-full max-w-sm px-4">
    <div class="text-center mb-10">
      <p
        class="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-3"
      >
        Admin Access
      </p>
      <h1 class="text-2xl font-bold text-primary">~/.mochi</h1>
      <p class="text-xs text-muted-foreground mt-1">Admin Panel</p>
    </div>

    <div
      class="border border-border/60 rounded-2xl p-8 bg-card/40 backdrop-blur-md shadow-lg"
    >
      {#if hasError}
        <div
          class="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          Incorrect password. Try again.
        </div>
      {/if}

      <form method="POST" action="/admin/login" use:enhance>
        <div class="space-y-4">
          <div>
            <label
              for="admin-password"
              class="text-xs font-medium text-muted-foreground block mb-2 tracking-wide uppercase"
            >
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autocomplete="current-password"
              placeholder="********"
              required
              class="w-full rounded-lg border border-border bg-input/30 px-3 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary/50 transition-all"
            />
          </div>

          <button
            type="submit"
            class="w-full rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary/90 active:translate-y-px transition-all focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            Login
          </button>
        </div>
      </form>
    </div>

    <p class="text-center text-xs text-muted-foreground/50 mt-6">
      <a href="/" class="hover:text-muted-foreground transition-colors"
        >Back to site</a
      >
    </p>
  </div>
</div>
