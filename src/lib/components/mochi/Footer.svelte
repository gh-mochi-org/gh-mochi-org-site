<script lang="ts">
  import { Github, Mail, Twitter } from "@lucide/svelte";

  const year = new Date().getFullYear();
</script>

<footer
  class="relative z-10 mt-auto border-t border-border/50 bg-background/80 backdrop-blur-md mb-12"
>
  <div class="mx-auto max-w-6xl px-4 py-12">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <!-- Brand -->
      <div class="space-y-3">
        <h3 class="font-bold text-primary">~/.mochi</h3>
        <p class="text-sm text-muted-foreground leading-relaxed">
          Sweet, cozy, and robust open-source tools. Built with love by the
          mochi collective.
        </p>
      </div>

      <!-- Links -->
      <div class="space-y-3">
        <h4 class="text-sm font-semibold text-foreground">Navigate</h4>
        <nav class="flex flex-col gap-2">
          <a
            href="/"
            class="text-sm text-muted-foreground hover:text-primary transition-colors"
            >Home</a
          >
          <a
            href="/projects"
            class="text-sm text-muted-foreground hover:text-primary transition-colors"
            >Projects</a
          >
          <a
            href="/contributors"
            class="text-sm text-muted-foreground hover:text-primary transition-colors"
            >Contributors</a
          >
          <a
            href="/news"
            class="text-sm text-muted-foreground hover:text-primary transition-colors"
            >News</a
          >
          <a
            href="/support"
            class="text-sm text-muted-foreground hover:text-primary transition-colors"
            >Support Us</a
          >
          <a
            href="/unsubscribe"
            class="text-sm text-muted-foreground hover:text-primary transition-colors"
            >Unsubscribe</a
          >
        </nav>
      </div>

      <!-- Social -->
      <div class="space-y-3">
        <h4 class="text-sm font-semibold text-foreground">Connect</h4>
        <div class="flex flex-col gap-2">
          <a
            href="https://github.com/gh-mochi-org"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Github class="h-4 w-4" />
            GitHub
          </a>
          <a
            href="https://x.com/idotconfig"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Twitter class="h-4 w-4" />
            X / Twitter
          </a>
          <a
            href="https://matrix.to/#/@git.mochi:matrix.org"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <span
              class="flex h-4 w-4 items-center justify-center rounded-sm bg-muted text-[10px] font-bold"
            >
              {@render MatrixLogo()}
            </span>
            Matrix
          </a>
          <a
            href="https://discord.gg/kzTxnARC6b"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <span
              class="flex h-4 w-4 items-center justify-center rounded-sm bg-muted text-[10px] font-bold"
            >
              {@render DiscordLogo()}
            </span>
            Discord
          </a><a
            href="mailto:git.mochi@protonmail.com"
            class="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail class="h-4 w-4" />
            ProtonMail
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div
      class="mt-10 border-t border-border/50 pt-6 flex flex-col gap-2 md:flex-row md:flex-row md:items-center md:justify-between"
    >
      <p class="text-xs text-muted-foreground">
        © {year} gh-mochi-org · AGPL-3.0 License (including the music)
      </p>
    </div>
  </div>
</footer>

{#snippet DiscordLogo()}
  <svg
    viewBox="0 0 24 24"
    class="size-4 fill-current"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"
    />
  </svg>
{/snippet}

{#snippet MatrixLogo()}
  <svg
    viewBox="0 0 24 24"
    class="size-4 fill-current text-black dark:text-white"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 0h2.28v24H0zm21.72 0H24v24h-2.28zM5.46 7.81h2.215v1.157h.033c.309-.443.683-.784 1.117-1.024.433-.245.936-.365 1.5-.365.54 0 1.033.107 1.481.314.448.208.785.582 1.02 1.108.254-.374.6-.706 1.034-.992.434-.287.95-.43 1.546-.43.453 0 .872.056 1.26.167.388.11.716.286.993.53.276.245.489.559.646.951.152.392.23.863.23 1.417v5.728h-2.349V11.52c0-.286-.01-.559-.032-.812a1.755 1.755 0 0 0-.18-.66 1.106 1.106 0 0 0-.438-.448c-.194-.11-.457-.166-.785-.166-.332 0-.6.064-.803.189a1.38 1.38 0 0 0-.48.499 1.946 1.946 0 0 0-.231.696 5.56 5.56 0 0 0-.06.785v4.768h-2.35v-4.8c0-.254-.004-.503-.018-.752a2.074 2.074 0 0 0-.143-.688 1.052 1.052 0 0 0-.415-.503c-.194-.125-.476-.19-.854-.19-.111 0-.259.024-.439.074-.18.051-.36.143-.53.282-.171.138-.319.337-.439.595-.12.259-.18.6-.18 1.02v4.966H5.46z"
    />
  </svg>
{/snippet}
