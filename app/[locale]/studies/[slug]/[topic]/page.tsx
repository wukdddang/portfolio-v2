import "katex/dist/katex.min.css";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { studies, type StudyTopic } from "@/data/studies";
import { pick } from "@/data/i18n";
import { TopicDiagram, RichText } from "@/components/TopicDiagram";

/**
 * 토픽 상세 페이지 — /studies/{study}/{topic}. data/studies.ts에서 detail이 있는 토픽만 존재.
 * 학습 로그·캘린더의 토픽 카드 클릭이 도착하는 곳. Brain Trinity 위키 본문에서 컴파일한 복습 노트.
 */

type Params = Promise<{ locale: Locale; slug: string; topic: string }>;

/** detail + slug이 있는 토픽만 라우트로 노출 */
function findTopic(slug: string, topicSlug: string) {
  const study = studies.find((s) => s.slug === slug);
  if (!study) return null;
  for (const block of study.blocks) {
    const topic = block.topics.find((tp) => tp.slug === topicSlug && tp.detail);
    if (topic) return { study, block, topic: topic as Required<Pick<StudyTopic, "detail">> & StudyTopic };
  }
  return null;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    studies.flatMap((s) =>
      s.blocks.flatMap((b) =>
        b.topics
          .filter((tp) => tp.slug && tp.detail)
          .map((tp) => ({ locale, slug: s.slug, topic: tp.slug! }))
      )
    )
  );
}

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, slug, topic } = await params;
  const found = findTopic(slug, topic);
  if (!found) return {};
  const title = `${pick(found.topic.title, locale)} — ${pick(found.study.title, locale)}`;
  const description = pick(found.topic.summary, locale);
  const path = `/studies/${slug}/${topic}`;
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { ko: `/ko${path}`, en: `/en${path}`, "x-default": path },
    },
    openGraph: {
      type: "article",
      url: `/${locale}${path}`,
      title,
      description,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function TopicPage({ params }: { params: Params }) {
  const { locale, slug, topic } = await params;
  setRequestLocale(locale);
  const found = findTopic(slug, topic);
  if (!found) notFound();
  const { study, block, topic: tp } = found;
  const detail = tp.detail!;
  const catColor = `var(--cat-${block.cat})`;

  const t = await getTranslations({ locale, namespace: "studies" });

  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px] opacity-60 [mask-image:radial-gradient(ellipse_75%_90%_at_50%_0%,black,transparent)]"
        style={{ backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
      />

      <div className="relative mx-auto w-full max-w-3xl px-6 pb-24 pt-28 md:px-10">
        {/* 브레드크럼 — 학습 로그로 */}
        <Link
          href={`/studies/${study.slug}`}
          className="group inline-flex items-center gap-1.5 font-mono text-xs text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          {study.icon} {pick(study.title, locale)}
        </Link>

        {/* 헤더 */}
        <header className="mt-8">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-widest" style={{ color: catColor }}>
            {pick(block.title, locale)}
          </div>
          <h1 className="flex items-start gap-3 text-2xl font-bold tracking-tight md:text-4xl">
            <span aria-hidden className="leading-none">{tp.icon}</span>
            <span>{pick(tp.title, locale)}</span>
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {tp.tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-md border px-1.5 py-0.5 font-mono text-[10px] leading-none text-[var(--muted)]"
                style={{
                  borderColor: `color-mix(in oklch, ${catColor} 28%, var(--border))`,
                  backgroundColor: `color-mix(in oklch, ${catColor} 8%, var(--card))`,
                }}
              >
                {pick(tag, locale)}
              </span>
            ))}
            {tp.wikiSlug && (
              <span className="ml-auto whitespace-nowrap font-mono text-[10px] text-[var(--muted)]/70">
                {t("wikiBadge")}/{tp.wikiSlug}
              </span>
            )}
          </div>
        </header>

        {/* TL;DR */}
        <section
          className="mt-8 rounded-2xl border p-6"
          style={{
            borderColor: `color-mix(in oklch, ${catColor} 40%, var(--border))`,
            backgroundColor: `color-mix(in oklch, ${catColor} 6%, var(--card))`,
          }}
        >
          <div className="mb-2 font-mono text-[11px] uppercase tracking-widest" style={{ color: catColor }}>
            {t("tldr")}
          </div>
          <p className="text-[15px] leading-relaxed text-[var(--card-foreground)]">
            <RichText text={pick(detail.tldr, locale)} />
          </p>
        </section>

        {/* 섹션들 */}
        {detail.sections.map((sec, si) => (
          <section key={si} className="mt-10">
            <h2 className="mb-4 border-l-2 pl-3 text-lg font-semibold tracking-tight" style={{ borderColor: catColor }}>
              {pick(sec.heading, locale)}
            </h2>
            <ul className="flex flex-col gap-3">
              {sec.bullets.map((b, bi) => (
                <li key={bi} className="flex gap-3 text-sm leading-relaxed text-[var(--card-foreground)]">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: catColor }} />
                  <span>
                    <RichText text={pick(b, locale)} />
                  </span>
                </li>
              ))}
            </ul>
            {sec.diagram &&
              (Array.isArray(sec.diagram) ? sec.diagram : [sec.diagram]).map((d, di) => (
                <TopicDiagram key={di} diagram={d} locale={locale} catColor={catColor} />
              ))}
          </section>
        ))}

        {/* 함정·주의점 */}
        {detail.pitfall && (
          <section className="mt-10 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/[0.06] p-5">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-[var(--accent)]">
              {t("pitfall")}
            </div>
            <p className="text-sm leading-relaxed text-[var(--card-foreground)]">
              <RichText text={pick(detail.pitfall, locale)} />
            </p>
          </section>
        )}

        {/* 출처 + 돌아가기 */}
        <footer className="mt-12 flex flex-col gap-5 border-t border-dashed border-[var(--border)] pt-5">
          <span className="font-mono text-[11px] leading-relaxed text-[var(--muted)]">{t("wikiNote")}</span>
          <Link
            href={`/studies/${study.slug}`}
            className="group inline-flex items-center gap-2 self-start rounded-full border border-[var(--border)] px-4 py-2 text-sm transition-colors hover:bg-[var(--subtle)]"
          >
            <ArrowLeft className="size-4 text-[var(--accent)] transition-transform group-hover:-translate-x-0.5" />
            <span className="font-medium">{t("backToStudy")}</span>
          </Link>
        </footer>
      </div>
    </main>
  );
}
