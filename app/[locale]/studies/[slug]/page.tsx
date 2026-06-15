import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { studies, type StudyTopic } from "@/data/studies";
import { pick } from "@/data/i18n";
import { cn } from "@/lib/utils";
import { StudyCalendar } from "@/components/StudyCalendar";
import { StudySearch } from "@/components/StudySearch";

/**
 * 학습 로그 페이지 — Brain Trinity 위키에서 컴파일한 학습 여정 (/studies/sar · /studies/embedded).
 * 히어로 메타 스트립의 "학습 도메인" 링크가 도착하는 곳. 데이터는 data/studies.ts.
 */

type Params = Promise<{ locale: Locale; slug: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    studies.map((s) => ({ locale, slug: s.slug }))
  );
}

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const study = studies.find((s) => s.slug === slug);
  if (!study) return {};
  const t = await getTranslations({ locale, namespace: "studies" });
  const title = `${pick(study.title, locale)} — ${t("metaSuffix")}`;
  const description = pick(study.tagline, locale);
  const path = `/studies/${slug}`;
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

const STATUS_LABEL_KEY = {
  done: "statusDone",
  doing: "statusDoing",
  todo: "statusTodo",
} as const;

/** 토픽 상태 칩 — done은 블록 색, doing은 amber pulse, todo는 muted */
function StatusChip({
  status,
  label,
  catColor,
}: {
  status: StudyTopic["status"];
  label: string;
  catColor: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-1.5 py-0.5 font-mono text-[10px] leading-tight",
        status === "todo" && "border-dashed border-[var(--border)] text-[var(--muted)]"
      )}
      style={
        status === "done"
          ? {
              borderColor: `color-mix(in oklch, ${catColor} 45%, var(--border))`,
              color: `color-mix(in oklch, ${catColor} 60%, var(--foreground))`,
            }
          : status === "doing"
            ? { borderColor: "color-mix(in oklch, var(--accent) 45%, var(--border))", color: "var(--accent)" }
            : undefined
      }
    >
      <span
        className={cn("size-1.5 rounded-full", status === "doing" && "animate-pulse")}
        style={{
          background:
            status === "done" ? catColor : status === "doing" ? "var(--accent)" : "var(--border)",
        }}
      />
      {label}
    </span>
  );
}

function TopicCard({
  topic,
  locale,
  cat,
  statusLabel,
  wikiBadge,
  studySlug,
  detailLabel,
}: {
  topic: StudyTopic;
  locale: Locale;
  cat: number;
  statusLabel: string;
  wikiBadge: string;
  studySlug: string;
  detailLabel: string;
}) {
  const catColor = `var(--cat-${cat})`;
  const done = topic.status === "done";
  const clickable = !!(topic.slug && topic.detail);

  const inner = (
    <>
      <div className="flex items-start gap-2.5 px-4 pt-3.5">
        <span className="text-base leading-snug">{topic.icon}</span>
        <span className={cn("min-w-0 flex-1 text-[15px] font-semibold leading-snug", !done && "text-[var(--card-foreground)]")}>
          {pick(topic.title, locale)}
        </span>
        {clickable && (
          <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-[var(--accent)] opacity-0 transition-opacity group-hover/t:opacity-100" />
        )}
        <StatusChip status={topic.status} label={statusLabel} catColor={catColor} />
      </div>
      <p className={cn("flex-1 px-4 py-3 text-[13px] leading-relaxed", done ? "text-[var(--card-foreground)]" : "text-[var(--muted)]")}>
        {pick(topic.summary, locale)}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-[var(--border)]/50 px-4 py-2.5">
        {topic.tags.map((tag, i) => (
          <span
            key={i}
            className="rounded-md border px-1.5 py-0.5 font-mono text-[10px] leading-none text-[var(--muted)]"
            style={{
              borderColor: done ? `color-mix(in oklch, ${catColor} 28%, var(--border))` : "var(--border)",
              backgroundColor: done ? `color-mix(in oklch, ${catColor} 8%, var(--card))` : "transparent",
            }}
          >
            {pick(tag, locale)}
          </span>
        ))}
        {clickable && (
          <span className="font-mono text-[10px] font-medium text-[var(--accent)]">{detailLabel}</span>
        )}
        {topic.wikiSlug && (
          <span className="ml-auto whitespace-nowrap font-mono text-[10px] text-[var(--muted)]/70">
            {wikiBadge}/{topic.wikiSlug}
          </span>
        )}
      </div>
    </>
  );

  const baseCls = cn("flex h-full min-w-0 flex-col rounded-xl border", !done && "border-dashed");
  const cardStyle = done
    ? {
        borderColor: `color-mix(in oklch, ${catColor} 45%, var(--border))`,
        backgroundColor: `color-mix(in oklch, ${catColor} 6%, var(--card))`,
      }
    : { borderColor: "var(--border)", backgroundColor: "color-mix(in oklch, var(--card) 55%, transparent)" };

  return clickable ? (
    <Link
      href={`/studies/${studySlug}/${topic.slug}`}
      className={cn(baseCls, "group/t transition-all hover:ring-2 hover:ring-[var(--accent)]/40")}
      style={cardStyle}
    >
      {inner}
    </Link>
  ) : (
    <div className={baseCls} style={cardStyle}>
      {inner}
    </div>
  );
}

export default async function StudyPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const study = studies.find((s) => s.slug === slug);
  if (!study) notFound();

  const t = await getTranslations({ locale, namespace: "studies" });
  const other = studies.find((s) => s.slug !== slug);

  return (
    <main className="relative overflow-hidden">
      {/* 헤더 영역 점 격자 — 파이프라인 섹션과 같은 배경 언어 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-60 [mask-image:radial-gradient(ellipse_75%_90%_at_50%_0%,black,transparent)]"
        style={{ backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
      />

      <div className="relative mx-auto w-full max-w-5xl px-6 pb-24 pt-28 md:px-10">
        {/* 상단 바 — 돌아가기 */}
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 font-mono text-xs text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          {t("backHome")}
        </Link>

        {/* 헤더 */}
        <header className="mt-10">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
            {t("eyebrow")}
          </div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight md:text-5xl">
            <span aria-hidden>{study.icon}</span>
            {pick(study.title, locale)}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
            {pick(study.tagline, locale)}
          </p>

          {/* 스탯 스트립 — 히어로 메타와 같은 언어 */}
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-[var(--border)] pt-6 font-mono text-xs text-[var(--muted)] sm:grid-cols-3">
            {study.stats.map((stat, i) => (
              <div key={i}>
                <div className="mb-1 text-[10px] uppercase tracking-widest">{pick(stat.label, locale)}</div>
                <div className="text-[var(--foreground)]">{pick(stat.value, locale)}</div>
              </div>
            ))}
          </div>
        </header>

        {/* 학습 내용 전역 검색 — 모든 스터디의 토픽을 한 곳에서 찾기 */}
        <section className="mt-12">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
            {t("search")}
          </div>
          <StudySearch
            locale={locale}
            placeholder={t("searchPlaceholder")}
            hint={t("searchHint")}
            countLabel={t("searchCount")}
            emptyLabel={t("searchEmpty")}
          />
        </section>

        {/* 왜 / 어떻게 */}
        <section className="mt-14 grid gap-5 md:grid-cols-2">
          {(
            [
              { label: t("motive"), body: pick(study.motive, locale) },
              { label: t("method"), body: pick(study.method, locale) },
            ] as const
          ).map((box, i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 p-6">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-[var(--accent)]">
                {box.label}
              </div>
              <p className="text-sm leading-relaxed text-[var(--card-foreground)]">{box.body}</p>
            </div>
          ))}
        </section>

        {/* 타임라인 (임베디드) */}
        {study.timeline && (
          <section className="mt-14">
            <div className="mb-5 font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
              {t("timeline")}
            </div>
            <ol className="grid gap-4 md:grid-cols-3">
              {study.timeline.map((step, i) => (
                <li
                  key={i}
                  className={cn(
                    "relative rounded-xl border p-5",
                    step.status === "doing"
                      ? "border-[var(--accent)]/50 bg-[var(--card)]/60"
                      : "border-[var(--border)] border-dashed bg-[var(--card)]/30"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-[var(--muted)]">{step.period}</span>
                    <StatusChip
                      status={step.status}
                      label={t(STATUS_LABEL_KEY[step.status])}
                      catColor="var(--accent)"
                    />
                  </div>
                  <div className="mt-2.5 text-sm font-semibold">{pick(step.title, locale)}</div>
                  <div className="mt-1.5 font-mono text-[11px] leading-relaxed text-[var(--muted)]">
                    {pick(step.desc, locale)}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* 학습 캘린더 — 언제 무엇을 공부했는지 */}
        {study.journal.length > 0 && (
          <section className="mt-14">
            <div className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
              {t("calendar")}
            </div>
            <p className="mb-5 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">{t("calendarLede")}</p>
            <StudyCalendar
              journal={study.journal}
              locale={locale}
              studySlug={study.slug}
              detailCta={t("viewDetail")}
              kindLabels={{
                lecture: t("kindLecture"),
                wiki: t("kindWiki"),
                conversation: t("kindConversation"),
                work: t("kindWork"),
                plan: t("kindPlan"),
              }}
            />
          </section>
        )}

        {/* 학습 블록들 */}
        {study.blocks.map((block, bi) => {
          const catColor = `var(--cat-${block.cat})`;
          return (
            <section key={bi} className="mt-14">
              <div
                className="mb-6 border-l-2 pl-4"
                style={{ borderColor: `color-mix(in oklch, ${catColor} 70%, var(--border))` }}
              >
                <h2 className="text-lg font-semibold tracking-tight md:text-xl">{pick(block.title, locale)}</h2>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{pick(block.desc, locale)}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {block.topics.map((topic, ti) => (
                  <TopicCard
                    key={ti}
                    topic={topic}
                    locale={locale}
                    cat={block.cat}
                    statusLabel={t(STATUS_LABEL_KEY[topic.status])}
                    wikiBadge={t("wikiBadge")}
                    studySlug={study.slug}
                    detailLabel={t("viewDetail")}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* 실무/프로젝트 연결 */}
        <section className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 p-6 md:p-8">
          <h2 className="text-lg font-semibold tracking-tight md:text-xl">{pick(study.practice.title, locale)}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{pick(study.practice.lede, locale)}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {study.practice.items.map((item, i) => {
              const inner = (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold leading-snug">{pick(item.title, locale)}</span>
                    {item.href && (
                      <ArrowUpRight className="size-3.5 shrink-0 text-[var(--accent)] opacity-0 transition-opacity group-hover/p:opacity-100" />
                    )}
                  </div>
                  <p className="mt-2 font-mono text-[11px] leading-relaxed text-[var(--muted)]">
                    {pick(item.desc, locale)}
                  </p>
                </>
              );
              const cls =
                "group/p flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-4 transition-all";
              return item.href ? (
                <Link key={i} href={item.href} className={cn(cls, "hover:ring-2 hover:ring-[var(--accent)]/40")}>
                  {inner}
                </Link>
              ) : (
                <div key={i} className={cls}>
                  {inner}
                </div>
              );
            })}
          </div>
        </section>

        {/* Brain Trinity 출처 + 다른 학습 로그 */}
        <footer className="mt-14 flex flex-col gap-6">
          <div className="flex items-start gap-2 border-t border-dashed border-[var(--border)] pt-5">
            <span className="font-mono text-[11px] leading-relaxed text-[var(--muted)]">{t("wikiNote")}</span>
          </div>
          {other && (
            <Link
              href={`/studies/${other.slug}`}
              className="group inline-flex items-center gap-2 self-start rounded-full border border-[var(--border)] px-4 py-2 text-sm transition-colors hover:bg-[var(--subtle)]"
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
                {t("otherStudy")}
              </span>
              <span className="font-medium">
                {other.icon} {pick(other.title, locale)}
              </span>
              <ArrowUpRight className="size-4 text-[var(--accent)] transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </footer>
      </div>
    </main>
  );
}
