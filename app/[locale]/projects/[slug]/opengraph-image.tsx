import { ImageResponse } from "next/og";
import { loadOgFonts, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { siteHost } from "@/lib/site";
import { projects } from "@/data/projects";
import { pick } from "@/data/i18n";
import { routing, type Locale } from "@/i18n/routing";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Project · Changwook Woo Portfolio";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug })),
  );
}

export default async function OgProject({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const fonts = await loadOgFonts();

  // fallback — 알 수 없는 slug면 빈 OG 한 장
  const title = project ? pick(project.title, locale) : "Project";
  const subtitle = project ? pick(project.subtitle, locale) : "";
  const badge = project ? pick(project.badge, locale) : "";
  const firstMetric = project?.metrics?.[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0a0f1c",
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          padding: "72px 80px",
          fontFamily: "Pretendard",
          color: "#e2e8f0",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            color: "#fbbf24",
            letterSpacing: 3,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 999, background: "#fbbf24" }} />
          <span>{slug}</span>
          {badge && (
            <span
              style={{
                marginLeft: 12,
                padding: "4px 14px",
                borderRadius: 999,
                border: "1px solid rgba(251,191,36,0.4)",
                background: "rgba(251,191,36,0.08)",
                fontSize: 16,
                letterSpacing: 2,
              }}
            >
              {badge}
            </span>
          )}
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -2,
              maxWidth: 1040,
              display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              color: "#94a3b8",
              lineHeight: 1.5,
              maxWidth: 1040,
              display: "flex",
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "#64748b",
            letterSpacing: 1,
          }}
        >
          {firstMetric ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 14, color: "#475569", letterSpacing: 2, textTransform: "uppercase" }}>
                {pick(firstMetric.label, locale)}
              </span>
              <span style={{ fontSize: 24, color: "#e2e8f0", fontWeight: 700 }}>
                {pick(firstMetric.value, locale)}
              </span>
            </div>
          ) : (
            <span>Changwook Woo · Portfolio</span>
          )}
          <span style={{ fontWeight: 700, color: "#94a3b8" }}>
            {siteHost}/{locale}/projects/{slug}
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 6,
            background:
              "linear-gradient(to right, #fbbf24 0%, #f97316 35%, rgba(249,115,22,0) 100%)",
          }}
        />
      </div>
    ),
    { ...size, fonts },
  );
}
