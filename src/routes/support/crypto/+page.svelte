<script lang="ts">
  import { onMount } from "svelte";
  import { motion } from "motion-sv";
  import AuroraText from "$lib/components/magic/aurora-text/aurora-text.svelte";
  import MagicCard from "$lib/components/magic/magic-card/magic-card.svelte";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import {
    HeartHandshake,
    Copy,
    Check,
    AlertTriangle,
    ExternalLink,
    Wifi,
    Send,
    Loader,
    Clock,
  } from "@lucide/svelte";
  import QRCode from "qrcode";

  interface PageData {
    wallets: {
      btc: string | null;
      eth: string | null;
      usdt: string | null;
      usdc: string | null;
      xmr: string | null;
      sol: string | null;
    };
  }

  let { data }: { data: PageData } = $props();

  type CoinKey = "btc" | "eth" | "usdt" | "usdc" | "xmr" | "sol";

  interface CoinConfig {
    key: CoinKey;
    label: string;
    fullName: string;
    network: string;
    color: string;
    bgColor: string;
    qrFgColor: string;
    emoji: string;
  }

  const coins: CoinConfig[] = [
    { key: "btc", label: "BTC", fullName: "Bitcoin", network: "Bitcoin Network", color: "#F7931A", bgColor: "rgba(247,147,26,0.12)", qrFgColor: "#F7931A", emoji: "₿" },
    { key: "eth", label: "ETH", fullName: "Ethereum", network: "ERC-20", color: "#627EEA", bgColor: "rgba(98,126,234,0.12)", qrFgColor: "#627EEA", emoji: "Ξ" },
    { key: "usdt", label: "USDT", fullName: "Tether USD", network: "ERC-20 (ETH)", color: "#26A17B", bgColor: "rgba(38,161,123,0.12)", qrFgColor: "#26A17B", emoji: "₮" },
    { key: "usdc", label: "USDC", fullName: "USD Coin", network: "ERC-20 (ETH)", color: "#2775CA", bgColor: "rgba(39,117,202,0.12)", qrFgColor: "#2775CA", emoji: "$" },
    { key: "xmr", label: "XMR", fullName: "Monero", network: "Monero Network", color: "#FF6600", bgColor: "rgba(255,102,0,0.12)", qrFgColor: "#FF6600", emoji: "ɱ" },
    { key: "sol", label: "SOL", fullName: "Solana", network: "Solana Network", color: "#9945FF", bgColor: "rgba(153,69,255,0.12)", qrFgColor: "#9945FF", emoji: "◎" },
  ];

  const availableCoins = $derived(coins.filter((c) => data.wallets[c.key]));

  let activeTab = $state<CoinKey>("btc");
  let qrDataUrls = $state<Record<string, string>>({});
  let copiedKey = $state<string | null>(null);
  let qrGenerating = $state(true);

  const activeCoin = $derived(coins.find((c) => c.key === activeTab) ?? coins[0]);
  const activeAddress = $derived(data.wallets[activeTab] ?? "");

  $effect(() => {
    if (availableCoins.length > 0 && !availableCoins.find((c) => c.key === activeTab)) {
      activeTab = availableCoins[0].key;
    }
  });

  onMount(async () => {
    qrGenerating = true;
    const results: Record<string, string> = {};
    await Promise.all(
      availableCoins.map(async (coin) => {
        const addr = data.wallets[coin.key];
        if (!addr) return;
        try {
          results[coin.key] = await QRCode.toDataURL(addr, {
            width: 240, margin: 2,
            color: { dark: coin.qrFgColor, light: "#00000000" },
            errorCorrectionLevel: "M",
          });
        } catch {
          results[coin.key] = await QRCode.toDataURL(addr, { width: 240, margin: 2 });
        }
      }),
    );
    qrDataUrls = results;
    qrGenerating = false;
  });

  async function copyAddress(address: string, key: string) {
    try {
      await navigator.clipboard.writeText(address);
      copiedKey = key;
      setTimeout(() => (copiedKey = null), 2000);
    } catch {}
  }

  // --- Support Registration Form ---
  type SupportType = "one-time" | "monthly";
  let supporterName = $state("");
  let supporterEmail = $state("");
  let supporterAmount = $state("");
  let supporterTxId = $state("");
  let supportType: SupportType = $state("one-time");
  let submitting = $state(false);
  let formError = $state("");
  let formSuccess = $state(false);

  async function submitSupport() {
    if (!supporterName.trim()) { formError = "Please enter your name."; return; }
    if (!supporterTxId.trim()) { formError = "Please enter the transaction ID."; return; }
    submitting = true;
    formError = "";
    try {
      const res = await fetch("/api/supporter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: supporterName.trim(),
          email: supporterEmail.trim() || null,
          amount: supporterAmount.trim() || null,
          type: supportType === "monthly" ? "sponsor" : "supporter",
          txId: supporterTxId.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        formSuccess = true;
        supporterName = "";
        supporterEmail = "";
        supporterAmount = "";
        supporterTxId = "";
      } else {
        formError = data.error ?? "Something went wrong. Try again.";
      }
    } catch {
      formError = "Network error. Try again.";
    }
    submitting = false;
  }
</script>

<svelte:head>
  <title>Support via Crypto — gh-mochi-org</title>
  <meta name="description" content="Support gh-mochi-org with crypto. Send via Bitcoin, Ethereum, USDT, USDC, Monero, or Solana — no middleman, no fees beyond the network." />
</svelte:head>

<main class="w-full items-center flex flex-col p-3">
  <!-- Hero -->
  <section class="max-w-4xl mx-auto px-4 sm:px-8 py-12 text-center w-full">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <HeartHandshake class="w-12 h-12 text-primary mx-auto mb-4" />
      <h1 class="text-3xl sm:text-5xl font-bold mb-4">
        <AuroraText>Support Us</AuroraText>
      </h1>
      <p class="text-muted-foreground max-w-xl mx-auto leading-relaxed">
        Your support keeps the mochi rolling. Send crypto directly to our wallets — no middleman, no fees beyond the network.
      </p>
    </motion.div>
  </section>

  <!-- Main Wallet Section -->
  <section class="w-full max-w-2xl px-4 pb-4 mx-auto">
    <!-- Coin Tab Selector -->
    <div class="flex gap-1.5 flex-wrap mb-6 bg-muted/40 border border-border/50 rounded-xl p-1.5">
      {#each availableCoins as coin}
        <button
          onclick={() => (activeTab = coin.key)}
          aria-label="Select {coin.fullName}"
          class="flex-1 min-w-[70px] flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-200
            {activeTab === coin.key
              ? 'bg-background text-foreground shadow-sm border border-border/50 scale-[1.03]'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}"
          style={activeTab === coin.key ? `color: ${coin.color};` : ""}
        >
          <span class="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0" style="background: {coin.bgColor}; color: {coin.color};">
            {coin.emoji}
          </span>
          {coin.label}
        </button>
      {/each}
    </div>

    <!-- QR Card -->
    {#if activeCoin && activeAddress}
      {#key activeTab}
        <motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.22 }}>
          <MagicCard class="p-6 sm:p-8 rounded-2xl border border-border/50 bg-pink-50/40 dark:bg-transparent [&>div.bg-background]:bg-pink-50/40 dark:[&>div.bg-background]:bg-background" gradientFrom={activeCoin.color + "88"} gradientTo={activeCoin.color + "22"}>
            <!-- Header -->
            <div class="flex items-center gap-3 mb-6">
              <div class="w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold border-2 shadow-sm" style="background: {activeCoin.bgColor}; color: {activeCoin.color}; border-color: {activeCoin.color}44;">
                {activeCoin.emoji}
              </div>
              <div class="flex-1">
                <h2 class="font-bold text-base" style="color: {activeCoin.color};">{activeCoin.fullName}</h2>
                <p class="text-xs text-muted-foreground flex items-center gap-1"><Wifi class="w-3 h-3" />{activeCoin.network}</p>
              </div>
              <Badge variant="secondary" class="text-[10px] font-mono" style="color: {activeCoin.color}; border-color: {activeCoin.color}44; background: {activeCoin.bgColor};">{activeCoin.label}</Badge>
            </div>

            <!-- QR Code -->
            <div class="flex justify-center mb-6">
              <div class="relative">
                <div class="absolute inset-0 rounded-3xl blur-2xl opacity-30" style="background: radial-gradient(circle, {activeCoin.color}88, transparent 70%);"></div>
                <div class="relative rounded-2xl p-5 border shadow-inner" style="background: {activeCoin.bgColor}; border-color: {activeCoin.color}33;">
                  {#if qrGenerating}
                    <div class="w-[200px] h-[200px] rounded-xl animate-pulse" style="background: {activeCoin.color}22;"></div>
                  {:else if qrDataUrls[activeTab]}
                    <div class="relative">
                      <img src={qrDataUrls[activeTab]} alt="{activeCoin.fullName} wallet QR code" class="w-[200px] h-[200px] rounded-xl" style="image-rendering: pixelated;" />
                      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-lg border-2" style="background: white; color: {activeCoin.color}; border-color: {activeCoin.color};">
                          {activeCoin.emoji}
                        </div>
                      </div>
                    </div>
                  {:else}
                    <div class="w-[200px] h-[200px] rounded-xl flex items-center justify-center text-xs text-muted-foreground">QR unavailable</div>
                  {/if}
                </div>
              </div>
            </div>

            <p class="text-[10px] text-center text-muted-foreground mb-4">Scan with your wallet app or copy the address below</p>

            <!-- Address + Copy -->
            <div class="rounded-xl border p-3 mb-4 flex items-center gap-2 group cursor-pointer" style="border-color: {activeCoin.color}33; background: {activeCoin.bgColor};" onclick={() => copyAddress(activeAddress, activeTab)} role="button" tabindex="0" onkeydown={(e) => e.key === "Enter" && copyAddress(activeAddress, activeTab)}>
              <p class="text-[10px] sm:text-xs font-mono text-muted-foreground flex-1 break-all leading-relaxed">{activeAddress}</p>
              <button onclick={(e) => { e.stopPropagation(); copyAddress(activeAddress, activeTab); }} aria-label="Copy wallet address" class="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95" style="background: {activeCoin.color}22; color: {activeCoin.color};">
                {#if copiedKey === activeTab}<Check class="w-3.5 h-3.5" />{:else}<Copy class="w-3.5 h-3.5" />{/if}
              </button>
            </div>

            <!-- Instructions -->
            <div class="rounded-xl border border-border/40 bg-muted/30 p-4 text-xs text-muted-foreground space-y-1.5">
              <p class="font-semibold text-foreground text-[11px] flex items-center gap-2"><AlertTriangle class="w-3.5 h-3.5 text-amber-500 shrink-0" />After sending, please notify us!</p>
              <p class="leading-relaxed">Since this is a manual process, once you've completed your transaction, please reach out via <a href="mailto:git.mochi@protonmail.com" class="underline hover:text-foreground transition-colors">email</a> or <a href="https://discord.gg/kzTxnARC6b" target="_blank" rel="noopener noreferrer" class="underline hover:text-foreground transition-colors">Discord</a> with your name and transaction ID. Thank you! 💜</p>
            </div>
          </MagicCard>
        </motion.div>
      {/key}
    {/if}

    <!-- Register as Supporter Form -->
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} class="mt-6">
      <MagicCard class="p-6 sm:p-8 rounded-2xl border border-border/50 bg-pink-50/40 dark:bg-transparent [&>div.bg-background]:bg-pink-50/40 dark:[&>div.bg-background]:bg-background" gradientFrom="#ff890655" gradientTo="#ff890611">
        {#if formSuccess}
          <div class="text-center space-y-4">
            <Check class="w-10 h-10 text-green-500 mx-auto" />
            <h3 class="text-lg font-bold text-green-600 dark:text-green-400">Thank you! 💜</h3>
            <p class="text-sm text-muted-foreground">Your support has been registered. We'll add you to the supporters list shortly.</p>
            <button onclick={() => (formSuccess = false)} class="text-xs text-primary underline hover:no-underline">Register another support</button>
          </div>
        {:else}
          <div class="flex items-center gap-3 mb-6">
            <Send class="w-6 h-6 text-primary" />
            <div>
              <h3 class="font-bold text-base">Register Your Support</h3>
              <p class="text-xs text-muted-foreground">Send crypto above, then fill this in so we can add you 💜</p>
            </div>
          </div>

          <!-- One-time / Monthly Toggle -->
          <div class="flex gap-1.5 mb-5 bg-muted/40 border border-border/50 rounded-xl p-1.5">
            <button onclick={() => (supportType = "one-time")} class="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-200 {supportType === 'one-time' ? 'bg-background text-foreground shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}">
              <HeartHandshake class="w-3.5 h-3.5" /> One-time
            </button>
            <button onclick={() => (supportType = "monthly")} class="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-200 {supportType === 'monthly' ? 'bg-background text-foreground shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}">
              <Clock class="w-3.5 h-3.5" /> Monthly Recurring
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label for="supporter-name" class="block text-xs font-medium text-foreground mb-1.5">Name <span class="text-red-400">*</span></label>
              <input id="supporter-name" type="text" bind:value={supporterName} placeholder="Your name or alias" class="w-full rounded-lg border border-border bg-input/30 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label for="supporter-email" class="block text-xs font-medium text-foreground mb-1.5">Email <span class="text-muted-foreground font-normal">(optional)</span></label>
              <input id="supporter-email" type="email" bind:value={supporterEmail} placeholder="you@example.com" class="w-full rounded-lg border border-border bg-input/30 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label for="supporter-amount" class="block text-xs font-medium text-foreground mb-1.5">Amount <span class="text-muted-foreground font-normal">(optional)</span></label>
              <input id="supporter-amount" type="text" bind:value={supporterAmount} placeholder="e.g. 10, 0.005 BTC, $20" class="w-full rounded-lg border border-border bg-input/30 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label for="supporter-txid" class="block text-xs font-medium text-foreground mb-1.5">Transaction ID <span class="text-red-400">*</span></label>
              <input id="supporter-txid" type="text" bind:value={supporterTxId} placeholder="TX hash or transaction ID" class="w-full rounded-lg border border-border bg-input/30 px-3 py-2.5 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>

            {#if supportType === "monthly"}
              <div class="rounded-lg border border-border/40 bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
                <p class="font-semibold text-foreground text-[11px] flex items-center gap-1.5"><Clock class="w-3.5 h-3.5 text-primary shrink-0" />For Monthly Supporters</p>
                <p class="leading-relaxed">Since this is crypto, please set up recurring payments in your wallet app and register each payment here after sending. We appreciate your ongoing support! 💜</p>
              </div>
            {/if}

            {#if formError}<p class="text-sm text-red-400 text-center">{formError}</p>{/if}

            <button onclick={submitSupport} disabled={submitting} class="w-full rounded-xl bg-primary text-primary-foreground font-semibold text-sm py-2.5 flex items-center justify-center gap-2 transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
              {#if submitting}<Loader class="w-4 h-4 animate-spin" />Registering...{:else}<Send class="w-4 h-4" />Register as {supportType === "monthly" ? "Monthly Supporter" : "Supporter"}{/if}
            </button>
          </div>
        {/if}
      </MagicCard>
    </motion.div>

    <!-- Personal Note -->
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} class="mt-6">
      <MagicCard class="p-5 rounded-2xl border border-amber-500/30 bg-amber-50/30 dark:bg-amber-950/10 [&>div.bg-background]:bg-amber-50/30 dark:[&>div.bg-background]:bg-amber-950/10" gradientFrom="#f59e0b55" gradientTo="#f59e0b11">
        <div class="flex items-start gap-3">
          <span class="text-2xl shrink-0">📝</span>
          <div class="space-y-2">
            <p class="font-semibold text-sm text-amber-700 dark:text-amber-400">A note from the creator</p>
            <p class="text-xs text-muted-foreground leading-relaxed">I know the support system here is rough, and I'm genuinely sorry about the poor experience. Unfortunately, due to my family situation, I currently can't obtain any government-issued documentation — including a passport — which limits my access to many financial and verification services. Resolving this requires working with a lawyer and potentially going through court proceedings, which could cost $5K–$10K. I'm actively working on it.</p>
            <p class="text-xs text-muted-foreground leading-relaxed">Despite all this, I truly believe in what we're building. We have great products that can be genuinely useful to everyone — at a much lower cost than most alternatives. I hope you see the potential in us. If you'd like to learn more or get in touch, please don't hesitate to reach out. Thank you so much for your support and understanding. 💜</p>
            <div class="flex gap-2 flex-wrap pt-1">
              <a href="mailto:git.mochi@protonmail.com" class="inline-flex items-center gap-1.5 text-[10px] font-medium px-3 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"><ExternalLink class="w-3 h-3" /> Contact via Email</a>
              <a href="https://discord.gg/kzTxnARC6b" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-[10px] font-medium px-3 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"><ExternalLink class="w-3 h-3" /> Join Discord</a>
            </div>
          </div>
        </div>
      </MagicCard>
    </motion.div>

    <!-- Perks Grid -->
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
      {#each [{ title: "Your name in lights ✨", desc: "Featured in our supporters marquee on the homepage" }, { title: "Open source forever 🔓", desc: "Everything we build stays free and open" }, { title: "Direct impact 🎯", desc: "Funds time & tools for maintainers" }, { title: "Collective love 💜", desc: "Forever grateful mochi energy" }] as perk, i}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.07 }}>
          <MagicCard class="p-4 rounded-xl border border-border/50 bg-pink-50/40 dark:bg-transparent [&>div.bg-background]:bg-pink-50/40 dark:[&>div.bg-background]:bg-background">
            <p class="font-semibold text-sm mb-1">{perk.title}</p>
            <p class="text-xs text-muted-foreground">{perk.desc}</p>
          </MagicCard>
        </motion.div>
      {/each}
    </div>
  </section>
</main>
