<script lang="ts">
  import { goto } from "$app/navigation";
  import { motion } from "motion-sv";
  import AuroraText from "$lib/components/magic/aurora-text/aurora-text.svelte";
  import MagicCard from "$lib/components/magic/magic-card/magic-card.svelte";
  import RippleButton from "$lib/components/magic/ripple-button/ripple-button.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { HeartHandshake, Star, Loader } from "@lucide/svelte";

  type Tab = "supporter" | "sponsor";
  let activeTab: Tab = $state("supporter");

  type Step = "form" | "checkout" | "done";
  let step: Step = $state("form");

  let name = $state("");
  let email = $state("");
  let amount = $state("5.99");

  let saving = $state(false);
  let saveError = $state("");

  const SPONSOR_PAYLINK = "69c8d9f659012967536797d9";
  const SUPPORTER_PAYLINK = "69c8d9619153c496cc83f6a0";

  const amounts = ["2", "5", "10", "20", "50"];

  function proceedToCheckout() {
    if (!name.trim()) {
      saveError = "Please enter your name.";
      return;
    }
    saveError = "";
    step = "checkout";
  }

  async function handleSuccess(event: any) {
    saving = true;
    try {
      await fetch("/api/supporter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email || null,
          amount,
          helioTxId:
            event?.transaction?.transactionSignature ?? event?.id ?? null,
          type: activeTab,
        }),
      });
    } catch (_err) {}
    const params = new URLSearchParams({
      verified: "1",
      name,
      type: activeTab,
      ...(amount ? { amount } : {}),
    });
    goto(`/support/thank-you?${params.toString()}`);
  }

  let checkoutMounted = $state(false);
  let checkoutError = $state("");

  $effect(() => {
    if (step === "checkout" && !checkoutMounted) {
      checkoutMounted = true;
      checkoutError = "";

      setTimeout(() => {
        const el = document.getElementById("helioCheckoutContainer");
        if (!el) {
          checkoutError = "Checkout container not ready. Please try again.";
          return;
        }
        if (typeof (window as any).helioCheckout !== "function") {
          checkoutError = "Payment widget not loaded. Please refresh.";
          return;
        }

        const paylinkId = activeTab === "sponsor" ? SPONSOR_PAYLINK : SUPPORTER_PAYLINK;

        (window as any).helioCheckout(el, {
          paylinkId,
          theme: { themeMode: "dark" },
          primaryColor: "#F5A623",
          neutralColor: "#5A6578",
          amount,
          display: "inline",
          network: "test",
          onSuccess: handleSuccess,
          onError: (e: unknown) => {
            console.error("Helio error", e);
            checkoutError = "Payment failed. Please try again.";
          },
          onPending: (e: unknown) => console.log("Helio pending", e),
          onCancel: () => {
            step = "form";
            checkoutMounted = false;
          },
          onStartPayment: () => console.log("Helio starting payment"),
        });
      }, 100);
    }
  });

  function goBack() {
    step = "form";
    checkoutMounted = false;
  }

  function setTab(t: Tab) {
    activeTab = t;
    step = "form";
    checkoutMounted = false;
    saveError = "";
  }
</script>

<svelte:head>
  <title>Support - gh-mochi-org</title>
  <meta
    name="description"
    content="Support gh-mochi-org's open-source mission."
  />
  <script type="module" crossorigin src="https://embed.hel.io/assets/index-v1.js"></script>
</svelte:head>

<main class="w-full items-center flex flex-col p-3">
  <section class="max-w-4xl mx-auto px-4 sm:px-8 py-12 text-center w-full">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeartHandshake class="w-12 h-12 text-primary mx-auto mb-4" />
      <h1 class="text-3xl sm:text-5xl font-bold mb-4">
        <AuroraText>Support Us</AuroraText>
      </h1>
      <p class="text-muted-foreground max-w-xl mx-auto leading-relaxed">
        Your support keeps the mochi rolling and helps fund the future of sweet,
        open-source tools.
      </p>
    </motion.div>
  </section>

  <section class="w-full max-w-2xl px-4 pb-16 mx-auto">
    <div
      class="flex gap-2 mb-8 bg-muted/40 border border-border/50 rounded-xl p-1.5"
    >
      <button
        onclick={() => setTab("supporter")}
        class="flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200
          {activeTab === 'supporter'
          ? 'bg-background text-foreground shadow-sm border border-border/50'
          : 'text-muted-foreground hover:text-foreground'}"
      >
        <HeartHandshake class="w-4 h-4" />
        One-Time Support
      </button>
      <button
        onclick={() => setTab("sponsor")}
        class="flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-sm font-medium transition-all duration-200
          {activeTab === 'sponsor'
          ? 'bg-background text-foreground shadow-sm border border-border/50'
          : 'text-muted-foreground hover:text-foreground'}"
      >
        <Star class="w-4 h-4" />
        Become a Sponsor
      </button>
    </div>

    {#if step === "checkout"}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <MagicCard class="p-6 rounded-2xl border border-border/50 bg-pink-50/40 dark:bg-transparent [&>div.bg-background]:bg-pink-50/40 dark:[&>div.bg-background]:bg-background">
          <div class="flex items-center gap-3 mb-4">
            <button
              onclick={goBack}
              class="text-muted-foreground hover:text-foreground text-sm"
              >&larr; Back</button
            >
            <div class="flex-1">
              <p class="font-semibold text-sm">Hey {name}!</p>
              <p class="text-xs text-muted-foreground">
                Complete your {activeTab === "sponsor"
                  ? "sponsorship"
                  : "support"} below
              </p>
            </div>
            <Badge
              variant={activeTab === "sponsor" ? "default" : "secondary"}
              class="text-xs">${amount}</Badge
            >
          </div>

          {#if saving}
            <div
              class="flex items-center justify-center gap-2 py-8 text-muted-foreground"
            >
              <Loader class="w-4 h-4 animate-spin" />
              <span class="text-sm">Saving your info...</span>
            </div>
          {:else if checkoutError}
            <div class="py-8 text-center">
              <p class="text-destructive text-sm mb-3">{checkoutError}</p>
              <Button onclick={goBack} variant="outline" size="sm">Go Back</Button>
            </div>
          {:else}
            <div id="helioCheckoutContainer" class="min-h-[400px]"></div>
          {/if}
        </MagicCard>
      </motion.div>
    {:else}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <MagicCard class="p-6 sm:p-8 rounded-2xl border border-border/50 bg-pink-50/40 dark:bg-transparent [&>div.bg-background]:bg-pink-50/40 dark:[&>div.bg-background]:bg-background">
          {#if activeTab === "supporter"}
            <div class="mb-6">
              <h2 class="text-xl font-bold mb-1">One-Time Contribution</h2>
              <p class="text-sm text-muted-foreground">
                No strings attached. Just vibes and gratitude.
              </p>
            </div>
          {:else}
            <div class="mb-6">
              <Star class="w-6 h-6 text-primary mb-2" />
              <h2 class="text-xl font-bold mb-1">Become a Sponsor</h2>
              <p class="text-sm text-muted-foreground">
                Get your name featured as a sponsor.
              </p>
            </div>
          {/if}

          <div class="space-y-4">
            <div>
              <label for="support-name" class="text-sm font-medium mb-1.5 block"
                >Your name <span class="text-destructive">*</span></label
              >
              <input
                id="support-name"
                type="text"
                bind:value={name}
                placeholder="e.g. Alex or @alex"
                class="w-full rounded-lg border border-border bg-input/30 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
              <p class="text-[11px] text-muted-foreground mt-1">
                This is how you'll appear on the supporters page.
              </p>
            </div>

            <div>
              <label
                for="support-email"
                class="text-sm font-medium mb-1.5 block"
                >Email <span class="text-destructive">*</span></label
              >
              <input
                id="support-email"
                type="email"
                bind:value={email}
                placeholder="your@email.com"
                class="w-full rounded-lg border border-border bg-input/30 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>

            <div>
              <label class="text-sm font-medium mb-2 block">Amount (USD)</label>
              <div class="flex flex-wrap gap-2 mb-2">
                {#each amounts as a}
                  <button
                    onclick={() => (amount = a)}
                    class="rounded-lg border px-4 py-2 text-sm font-medium transition-all
                      {amount === a
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/50'}"
                  >
                    ${a}
                  </button>
                {/each}
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-muted-foreground">$</span>
                <input
                  type="number"
                  bind:value={amount}
                  min="1"
                  step="0.01"
                  placeholder="Custom amount"
                  class="flex-1 rounded-lg border border-border bg-input/30 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>
            </div>

            {#if saveError}
              <p class="text-destructive text-sm">{saveError}</p>
            {/if}

            <RippleButton
              onclick={proceedToCheckout}
              class="w-full py-3 text-sm font-medium"
              rippleColor="#ff8906"
            >
              <span class="flex items-center justify-center gap-2">
                {#if activeTab === "sponsor"}
                  <Star class="w-4 h-4" /> Continue to Sponsorship
                {:else}
                  <HeartHandshake class="w-4 h-4" /> Continue to Payment
                {/if}
              </span>
            </RippleButton>
          </div>
        </MagicCard>
      </motion.div>
    {/if}

    {#if step === "form"}
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {#each [{ title: "Your name in lights", desc: "Featured in our supporters marquee" }, { title: "Open source forever", desc: "Everything we build stays free and open" }, { title: "Direct impact", desc: "Funds time & tools for maintainers" }, { title: "Collective love", desc: "Forever grateful mochi energy" }] as perk, i}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.07 }}
          >
            <MagicCard class="p-4 rounded-xl border border-border/50 bg-pink-50/40 dark:bg-transparent [&>div.bg-background]:bg-pink-50/40 dark:[&>div.bg-background]:bg-background">
              <p class="font-semibold text-sm mb-1">{perk.title}</p>
              <p class="text-xs text-muted-foreground">{perk.desc}</p>
            </MagicCard>
          </motion.div>
        {/each}
      </div>
    {/if}
  </section>
</main>
