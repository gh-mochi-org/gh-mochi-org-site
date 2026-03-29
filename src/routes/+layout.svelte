<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/mochi.png";
  import { ModeWatcher } from "mode-watcher";
  import LightRays from "$lib/components/magic/light-rays/light-rays.svelte";
  import ScrollProgress from "$lib/components/magic/scroll-progress/scroll-progress.svelte";
  import Meteors from "$lib/components/magic/meteors/meteors.svelte";
  import Navbar from "$lib/components/mochi/Navbar.svelte";
  import MochiDock from "$lib/components/mochi/MochiDock.svelte";
  import Footer from "$lib/components/mochi/Footer.svelte";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>~/.mochi | gh-mochi-org</title>
</svelte:head>

<ModeWatcher />

<div
  class="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300"
>
  <div class="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
    <LightRays count={4} />
    <Meteors number={20} />
  </div>

  <ScrollProgress class="top-18 z-100" />
  <Navbar />

  <main class="flex-1 pt-20 pb-32">
    {@render children()}
  </main>

  <Footer />
  <MochiDock />
</div>
