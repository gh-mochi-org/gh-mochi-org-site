<script lang="ts">
  import { page } from "$app/stores";
  import { motion } from "motion-sv";
  import AuroraText from "$lib/components/magic/aurora-text/aurora-text.svelte";
  import MagicCard from "$lib/components/magic/magic-card/magic-card.svelte";
  import RippleButton from "$lib/components/magic/ripple-button/ripple-button.svelte";
  import { Mail, CheckCircle, XCircle, Loader } from "@lucide/svelte";

  let email = $state($page.url.searchParams.get("email") ?? "");
  let subscriptionType: "sponsor" | "supporter" | "" = $state("");
  let status: "idle" | "loading" | "success" | "error" = $state("idle");
  let message = $state("");

  async function unsubscribe() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status = "error";
      message = "Please enter a valid email address.";
      return;
    }

    status = "loading";
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subscriptionType: subscriptionType || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        status = "success";
        message = data.message ?? "You've been unsubscribed.";
      } else {
        status = "error";
        message = data.error ?? "Something went wrong.";
      }
    } catch {
      status = "error";
      message = "Network error. Try again.";
    }
  }
</script>

<svelte:head>
  <title>Unsubscribe - gh-mochi-org</title>
  <meta
    name="description"
    content="Unsubscribe from gh-mochi-org newsletter updates."
  />
</svelte:head>

<main class="w-full items-center flex flex-col p-3">
  <section class="max-w-lg mx-auto px-4 sm:px-8 py-12 text-center w-full">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {#if status === "success"}
        <CheckCircle class="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 class="text-3xl sm:text-4xl font-bold mb-4">
          <AuroraText>Unsubscribed!</AuroraText>
        </h1>
        <p class="text-muted-foreground max-w-md mx-auto leading-relaxed mb-6">
          {message}
        </p>
        <p class="text-sm text-muted-foreground">
          Sorry to see you go. You can always resubscribe later.
        </p>
      {:else}
        <Mail class="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 class="text-3xl sm:text-4xl font-bold mb-4">
          <AuroraText>Unsubscribe</AuroraText>
        </h1>
        <p class="text-muted-foreground max-w-md mx-auto leading-relaxed mb-6">
          Enter your email to unsubscribe from gh-mochi-org updates. No hard feelings.
        </p>

        <MagicCard class="p-6 sm:p-8 rounded-2xl border border-border/50 bg-pink-50/40 dark:bg-transparent [&>div.bg-background]:bg-pink-50/40 dark:[&>div.bg-background]:bg-background">
          {#if status === "error"}
            <div class="flex items-center gap-2 text-destructive text-sm mb-4 p-3 bg-destructive/10 rounded-lg">
              <XCircle class="w-4 h-4" />
              {message}
            </div>
          {/if}

          <div class="space-y-4">
            <div>
              <label
                for="unsubscribe-email"
                class="text-sm font-medium mb-1.5 block"
              >
                Email Address <span class="text-destructive">*</span>
              </label>
              <input
                id="unsubscribe-email"
                type="email"
                bind:value={email}
                placeholder="your@email.com"
                onkeydown={(e) => e.key === "Enter" && unsubscribe()}
                class="w-full rounded-lg border border-border bg-input/30 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
              <p class="text-[11px] text-muted-foreground mt-1">
                We'll remove this email from our newsletter list.
              </p>
            </div>

            <div>
              <label class="text-sm font-medium mb-2 block">Subscription Type (optional)</label>
              <div class="flex gap-2">
                <button
                  onclick={() => (subscriptionType = "supporter")}
                  class="flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-all
                    {subscriptionType === 'supporter'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/50'}"
                >
                  One-Time Support
                </button>
                <button
                  onclick={() => (subscriptionType = "sponsor")}
                  class="flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-all
                    {subscriptionType === 'sponsor'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/50'}"
                >
                  Sponsor (6mo)
                </button>
              </div>
              <p class="text-[11px] text-muted-foreground mt-1">
                Select if you're cancelling a subscription.
              </p>
            </div>

            <RippleButton
              onclick={unsubscribe}
              disabled={status === "loading"}
              class="w-full py-3 text-sm font-medium"
              rippleColor="#ff8906"
            >
              {status === "loading"
                ? "Unsubscribing..."
                : "Unsubscribe"}
            </RippleButton>
          </div>
        </MagicCard>

        <p class="text-xs text-muted-foreground mt-6">
          <a href="/" class="hover:text-primary transition-colors">Back to home</a>
        </p>
      {/if}
    </motion.div>
  </section>
</main>
