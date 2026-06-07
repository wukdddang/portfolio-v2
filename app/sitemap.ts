import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

// next.config.ts에서 301 redirect 처리되는 슬러그 — sitemap에는 캐노니컬 통합 페이지만 노출
const REDIRECTED_SLUGS = new Set([
  "sar-data-retrieval",
  "lumir-linux-snap",
  "sar-search-and-analyzer",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const locales = routing.locales;

  const staticPaths: Array<{ path: string; priority: number }> = [
    { path: "", priority: 1.0 },
    { path: "/resume", priority: 0.8 },
  ];

  const projectPaths: Array<{ path: string; priority: number }> = projects
    .filter((p) => !REDIRECTED_SLUGS.has(p.slug))
    .map((p) => ({ path: `/projects/${p.slug}`, priority: 0.7 }));

  const allPaths = [...staticPaths, ...projectPaths];

  // 각 path에 대해 locale별 entry를 만들고, alternates.languages로 hreflang 묶음
  return allPaths.flatMap(({ path, priority }) => {
    const languages = Object.fromEntries(
      locales.map((l) => [l, `${siteUrl}/${l}${path}`])
    );
    return locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages },
    }));
  });
}
