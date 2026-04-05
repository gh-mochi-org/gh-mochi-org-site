<script lang="ts">
  import { motion } from "motion-sv";
  import AuroraText from "$lib/components/magic/aurora-text/aurora-text.svelte";
  import MagicCard from "$lib/components/magic/magic-card/magic-card.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Tabs, TabsList, TabsTrigger, TabsContent } from "$lib/components/ui/tabs";
  import { Mail, HeartHandshake, CheckCircle, Loader } from "@lucide/svelte";
  import { toast } from "svelte-sonner";

  let email = $state("");
  let newsletterStatus: "idle" | "loading" = $state("idle");
  let supporterStatus: "idle" | "loading" = $state("idle");
  let successType: "newsletter" | "supporter" | null = $state(null);

  async function unsubscribeNewsletter() {
    if (!email || newsletterStatus === "loading") return;
    newsletterStatus = "loading";
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Unsubscribed from newsletter", { description: data.message });
        successType = "newsletter";
      } else {
        toast.error(data.error ?? "Something went wrong.");
      }
    } catch {
      toast.error("Network error. Try again.");
    }
    newsletterStatus = "idle";
  }

  async function unsubscribeSupporter() {
    if (!email || supporterStatus === "loading") return;
    supporterStatus = "loading";
    try {
      const res = await fetch("/api/unsubscribe-supporter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Hidden from supporter list", { description: data.message });
        successType = "supporter";
      } else {
        toast.error(data.error ?? "Something went wrong.");
      }
    } catch {
      toast.error("Network error. Try again.");
    }
    supporterStatus = "idle";
  }
</script>

<svelte:head>
  <title>Unsubscribe - gh-mochi-org</title>
  <meta name="description" content="Unsubscribe from gh-mochi-org newsletter updates or hide yourself from the supporter list." />
</svelte:head>

<main class="w-full items-center flex flex-col p-3">
  <section class="max-w-md mx-auto px-4 sm:px-8 py-24 text-center w-full">
    {#if successType}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <MagicCard class="p-10 rounded-2xl border border-border/50">
          <CheckCircle class="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 class="text-2xl font-bold mb-3">
            <AuroraText>{#if successType === "newsletter"}Unsubscribed!{:else}Hidden!{/if}</AuroraText>
          </h1>
          <p class="text-sm text-muted-foreground mb-6 leading-relaxed">
            {#if successType === "newsletter"}
              You've been removed from the newsletter list.
            {:else}
              Your name has been hidden from the supporter list.
            {/if}
            No hard feelings — we understand. 💜
          </p>
          <Button href="/" variant="outline" class="gap-2">Back to Home</Button>
        </MagicCard>
      </motion.div>
    {:else}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <MagicCard class="p-8 rounded-2xl border border-border/50">
          <Mail class="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 class="text-2xl font-bold mb-2"><AuroraText>Unsubscribe</AuroraText></h1>
          <p class="text-sm text-muted-foreground mb-6 leading-relaxed">Choose what you'd like to unsubscribe from. No hard feelings — we understand.</p>

          <Tabs value="newsletter" class="text-left">
            <TabsList class="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="newsletter" class="gap-1.5"><Mail class="w-3.5 h-3.5" />Newsletter</TabsTrigger>
              <TabsTrigger value="supporter" class="gap-1.5"><HeartHandshake class="w-3.5 h-3.5" />Supporter</TabsTrigger>
            </TabsList>

            <TabsContent value="newsletter">
              <div class="space-y-4">
                <div>
                  <label for="newsletter-email" class="block text-xs font-medium text-foreground mb-1.5">Email address</label>
                  <input id="newsletter-email" type="email" bind:value={email} placeholder="you@example.com" onkeydown={(e) => e.key === "Enter" && unsubscribeNewsletter()} class="w-full rounded-lg border border-border bg-input/30 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <Button onclick={unsubscribeNewsletter} disabled={newsletterStatus === "loading" || !email} class="w-full gap-2">
                  {#if newsletterStatus === "loading"}<Loader class="w-4 h-4 animate-spin" /> Unsubscribing...{:else}Unsubscribe from Newsletter{/if}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="supporter">
              <div class="space-y-4">
                <div>
                  <label for="supporter-email" class="block text-xs font-medium text-foreground mb-1.5">Email address</label>
                  <input id="supporter-email" type="email" bind:value={email} placeholder="you@example.com" onkeydown={(e) => e.key === "Enter" && unsubscribeSupporter()} class="w-full rounded-lg border border-border bg-input/30 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <p class="text-[11px] text-muted-foreground">This will hide your name from the supporter list on the contributors page. If you supported with a different email, try that one instead.</p>
                <Button onclick={unsubscribeSupporter} disabled={supporterStatus === "loading" || !email} class="w-full gap-2">
                  {#if supporterStatus === "loading"}<Loader class="w-4 h-4 animate-spin" /> Hiding...{:else}Hide from Supporter List{/if}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </MagicCard>
      </motion.div>
    {/if}
  </section>
</main>
