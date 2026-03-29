<script lang="ts">
  import "../layout.css";
  import favicon from "$lib/assets/mochi.png";
  import { ModeWatcher } from "mode-watcher";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<div
  class="min-h-screen bg-background text-foreground transition-colors duration-300"
>
  {@render children()}
</div>
