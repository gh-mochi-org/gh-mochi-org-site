<script lang="ts">
  import mochi from "$lib/assets/moch_cursor.gif";
  import { Github, Menu } from "@lucide/svelte";
  import AnimatedThemeToggler from "../magic/animated-theme-toggler/animated-theme-toggler.svelte";
  import Button from "../ui/button/button.svelte";

  let isOpen = $state(false);
</script>

<nav
  class="fixed p-3 top-0 z-100 w-full border-b-gray-600 border-b backdrop-blur-md"
>
  <div class="w-full flex items-center justify-between">
    <a href="/" class="flex items-center gap-0.5">
      <enhanced:img src={mochi} alt="mochieee" class="w-12 h-12" />
      <Button href="/" variant="link" class="font-bold hover:underline"
        >~/.mochi</Button
      >
    </a>

    <div class="hidden lg:flex items-center gap-4">
      <Button
        href="/"
        onclick={() => {
          isOpen = !isOpen;
        }}
        variant="link"
        class="font-light hover:underline">HOME</Button
      >
      <Button
        href="/projects"
        onclick={() => {
          isOpen = !isOpen;
        }}
        variant="link"
        class="font-light hover:underline">PROJECTS</Button
      >
      <Button
        href="/contributors"
        onclick={() => {
          isOpen = !isOpen;
        }}
        variant="link"
        class="font-light hover:underline">CONTRIBUTORS</Button
      >
      <Button
        href="/news"
        onclick={() => {
          isOpen = !isOpen;
        }}
        variant="link"
        class="font-light hover:underline">NEWS</Button
      >
      <Button
        href="/support"
        onclick={() => {
          isOpen = !isOpen;
        }}
        variant="link"
        class="font-light hover:underline">SUPPORT</Button
      >

      <div class="flex items-center gap-3">
        <AnimatedThemeToggler />

        <Button
          onclick={() => {
            isOpen = false;
          }}
          href="https://github.com/gh-mochi-org"
          variant="default"
          class="gap-1"
          target="_blank"
        >
          <Github />
          Github
        </Button>
      </div>
    </div>

    <div class="flex items-center gap-2 lg:hidden">
      <AnimatedThemeToggler />
      <Button onclick={() => (isOpen = !isOpen)}
        ><Menu class="w-5 h-5" /></Button
      >
    </div>
  </div>

  {#if isOpen}
    <div
      class="lg:hidden border-t border-gray-600 backdrop-blur-sm p-4 flex flex-col gap-4 text-lg font-bold"
    >
      <Button href="/" onclick={() => (isOpen = false)} variant="link" class="font-light hover:underline"
        >HOME</Button
      >
      <Button href="/projects" onclick={() => (isOpen = false)} variant="link" class="font-light hover:underline"
        >PROJECTS</Button
      >
      <Button
        href="/contributors"
        onclick={() => (isOpen = false)}
        variant="link"
        class="font-light hover:underline">CONTRIBUTORS</Button
      >
      <Button href="/news" onclick={() => (isOpen = false)} variant="link" class="font-light hover:underline"
        >NEWS</Button
      >
      <Button href="/support" onclick={() => (isOpen = false)} variant="link" class="font-light hover:underline"
        >SUPPORT</Button
      >

      <div class="w-full flex items-center justify-center">
        <AnimatedThemeToggler />
      </div>

      <Button
        href="https://github.com/gh-mochi-org"
        onclick={() => (isOpen = false)}
        variant="default"
        class="gap-1 max-w-lg"
        target="_blank"
      >
        <Github />
        Github
      </Button>
    </div>
  {/if}
</nav>
