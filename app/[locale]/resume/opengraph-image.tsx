import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { loadOgFonts, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { siteHost } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Changwook Woo · Resume";

export default async function OgResume({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const fonts = await loadOgFonts();

  const title = t("resumeTitle");
  const description = t("resumeDescription");
  const eyebrow = locale === "ko" ? "이력서 · Base 버전" : "Resume · Base version";

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
          <span>{eyebrow}</span>
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
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: -2,
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 26,
              color: "#94a3b8",
              lineHeight: 1.55,
              maxWidth: 1040,
              display: "flex",
            }}
          >
            {description}
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
          <span>{locale === "ko" ? "PDF · 인쇄 가능" : "Print · PDF ready"}</span>
          <span style={{ fontWeight: 700, color: "#94a3b8" }}>{siteHost}/{locale}/resume</span>
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
