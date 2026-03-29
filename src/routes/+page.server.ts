import type { PageServerLoad } from "./$types";
import { db, supporters, projects, news, contributors } from "$lib/server/db";
import { eq, desc, asc } from "drizzle-orm";

export const load: PageServerLoad = async () => {
  try {
    const [dbSupporters, featuredProjects, recentNews, dbContributors] = await Promise.all([
      db.select().from(supporters).where(eq(supporters.visible, true)).orderBy(desc(supporters.paid_at)),
      db.select().from(projects).where(eq(projects.featured, true)).orderBy(asc(projects.order)).limit(6),
      db.select().from(news).where(eq(news.published, true)).orderBy(desc(news.published_at)).limit(3),
      db.select().from(contributors).orderBy(desc(contributors.created_at)),
    ]);

    const allSupporters = await db.select().from(supporters);
    const allSponsors = allSupporters.filter(s => s.type === "sponsor");

    return {
      supporters: dbSupporters.filter(s => s.type === "supporter"),
      sponsors: dbSupporters.filter(s => s.type === "sponsor"),
      contributors: dbContributors,
      featuredProjects: featuredProjects.map(p => ({
        name: p.name,
        description: p.description ?? "",
        stars: p.stars ?? 0,
        forks: p.forks ?? 0,
        tags: (p.tags as string[]) ?? [],
        repoUrl: p.repo_url ?? "#",
      })),
      recentNews,
      stats: {
        projects: (await db.select().from(projects)).length,
        supporters: allSupporters.filter(s => s.type === "supporter").length,
        sponsors: allSponsors.length,
      },
    };
  } catch (err) {
    console.error("Page load error:", err);
    return {
      supporters: [],
      sponsors: [],
      contributors: [],
      featuredProjects: [],
      recentNews: [],
      stats: { projects: 0, supporters: 0, sponsors: 0 },
    };
  }
};
