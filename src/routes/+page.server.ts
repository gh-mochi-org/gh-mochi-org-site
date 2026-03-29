import type { PageServerLoad } from "./$types";
import { db, supporters, projects, news, contributors } from "$lib/server/db";
import { eq, desc, asc, count } from "drizzle-orm";

type CachedPage = Awaited<ReturnType<typeof fetchPageData>>;

const CACHE_TTL_MS = 30_000; // 30 seconds
let cache: { data: CachedPage; ts: number } | null = null;

async function fetchPageData() {
  // All 5 queries fire in parallel — same as before, but now cached
  const [dbSupporters, featuredProjects, recentNews, dbContributors, [projectCountRow]] =
    await Promise.all([
      db.select().from(supporters).where(eq(supporters.visible, true)).orderBy(desc(supporters.paid_at)),
      db.select().from(projects).where(eq(projects.featured, true)).orderBy(asc(projects.order)).limit(6),
      db.select().from(news).where(eq(news.published, true)).orderBy(desc(news.published_at)).limit(3),
      db.select().from(contributors).orderBy(desc(contributors.created_at)),
      db.select({ value: count() }).from(projects),
    ]);

  const sponsorCount   = dbSupporters.filter(s => s.type === "sponsor").length;
  const supporterCount = dbSupporters.filter(s => s.type === "supporter").length;

  return {
    supporters:       dbSupporters.filter(s => s.type === "supporter"),
    sponsors:         dbSupporters.filter(s => s.type === "sponsor"),
    contributors:     dbContributors,
    featuredProjects: featuredProjects.map(p => ({
      name:        p.name,
      description: p.description ?? "",
      stars:       p.stars ?? 0,
      forks:       p.forks ?? 0,
      tags:        (p.tags as string[]) ?? [],
      repoUrl:     p.repo_url ?? "#",
    })),
    recentNews,
    stats: {
      projects:   Number(projectCountRow?.value ?? 0),
      supporters: supporterCount,
      sponsors:   sponsorCount,
    },
  };
}

export const load: PageServerLoad = async ({ setHeaders }) => {
  try {
    const now = Date.now();

    // Cache hit path — zero DB queries, sub-millisecond response
    if (cache && now - cache.ts < CACHE_TTL_MS) {
      setHeaders({
        "cache-control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300",
      });
      return cache.data;
    }

    const data = await fetchPageData();
    cache = { data, ts: now };
   setHeaders({
      "cache-control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300",
    });

    return data;
  } catch (err) {
    console.error("Page load error:", err);
    return {
      supporters:       [],
      sponsors:         [],
      contributors:     [],
      featuredProjects: [],
      recentNews:       [],
      stats: { projects: 0, supporters: 0, sponsors: 0 },
    };
  }
};

