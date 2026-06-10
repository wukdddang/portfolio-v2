"use client";

/**
 * PipelineSection — 메인 페이지 "프로젝트별 데이터 파이프라인" 섹션.
 *
 * 프로젝트 상세의 React Flow 다이어그램과 같은 시각 언어(카테고리 색 카드, amber 흐름선
 * + glow, SMIL 흐름 점, 점선 환류)를 순수 SVG/DOM으로 그려 메인 번들에 @xyflow를 싣지 않는다.
 *
 * 파이프라인마다 성격이 달라 표현(variant)을 다르게 둔다 — '복붙' 인상 회피:
 *  - spine  (SAR)  : 가로 스파인 (끝점 pill + 레이어 카드 + amber 흐름 + 점선 환류).
 *  - levels (SDPE) : L0→L1·L2→L3 처리 레벨 트랙 (운영 콘솔 트리거 + 레벨 배지 카드 + 카탈로그).
 *  - stack  (him)  : 세로 컴팩트 스택 (사이드 프로젝트답게 좁고 작게).
 */

import { Fragment, useMemo, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { projects } from "@/data/projects";
import { pipelines, type Pipeline, type PipelineStage } from "@/data/pipeline";
import { pick } from "@/data/i18n";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const chipCls =
  "whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--card)] px-1.5 py-0.5 font-mono text-[10px] leading-tight text-[var(--foreground)]";

/** amber 정방향 흐름선 — glow 밑줄 + 본선 + 화살촉 + SMIL 흐름 점 (spine 전용) */
function FlowLine({
  vertical = false,
  phase = 0,
  reduce = false,
}: {
  vertical?: boolean;
  phase?: number;
  reduce?: boolean;
}) {
  const path = vertical ? "M12 2 V38" : "M2 12 H46";
  const arrow = vertical ? "M7.5 38 L12 46 L16.5 38 Z" : "M46 7 L54 12 L46 17 Z";
  const dur = 1.8;
  return (
    <svg
      viewBox={vertical ? "0 0 24 48" : "0 0 56 24"}
      className={vertical ? "h-12 w-6" : "h-6 w-14"}
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={6}
        strokeOpacity={0.3}
        strokeLinecap="round"
        style={{ filter: "blur(3px)" }}
      />
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth={2} />
      <path d={arrow} fill="var(--accent)" />
      {!reduce && (
        <g>
          <circle r={4.5} fill="var(--foreground)" opacity={0.12}>
            <animateMotion dur={`${dur}s`} begin={`-${phase.toFixed(2)}s`} repeatCount="indefinite" path={path} />
          </circle>
          <circle r={2.2} fill="var(--foreground)" opacity={0.85}>
            <animateMotion dur={`${dur}s`} begin={`-${phase.toFixed(2)}s`} repeatCount="indefinite" path={path} />
          </circle>
        </g>
      )}
    </svg>
  );
}

/** spine 커넥터 — lg+: 라벨 칩 위 + 가로선, lg 미만: 세로선 + 옆 칩 */
function Connector({ label, phase, reduce }: { label: string; phase: number; reduce: boolean }) {
  return (
    <>
      <div className="relative flex justify-center py-1 lg:hidden">
        <FlowLine vertical phase={phase} reduce={reduce} />
        <span className={cn(chipCls, "absolute left-1/2 top-1/2 ml-4 -translate-y-1/2")}>{label}</span>
      </div>
      <div className="hidden flex-col items-center gap-1.5 px-1 lg:flex lg:-translate-y-3">
        <span className={chipCls}>{label}</span>
        <FlowLine phase={phase} reduce={reduce} />
      </div>
    </>
  );
}

/** 간단한 화살표 — levels/stack 트랙용 (가로 → / 세로 ↓) + 라벨 */
function Arrow({ vertical = false, label }: { vertical?: boolean; label?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center gap-1.5 text-[var(--accent)]",
        vertical ? "flex-col py-0.5" : "flex-col px-0.5"
      )}
    >
      {label && (
        <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--muted)]">
          {label}
        </span>
      )}
      <span aria-hidden className="text-base leading-none">
        {vertical ? "↓" : "→"}
      </span>
    </div>
  );
}

/** 외부 끝점 pill — external=점선(외부 시스템), actor=반전(사람) */
function StagePill({ stage, locale }: { stage: PipelineStage; locale: Locale }) {
  const actor = stage.tone === "actor";
  return (
    <div className="flex w-28 shrink-0 flex-col items-center gap-1.5 px-1 text-center">
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-full text-xl leading-none",
          actor
            ? "bg-[var(--foreground)] text-[var(--background)]"
            : "border border-dashed border-[var(--border)] bg-[var(--subtle)]"
        )}
      >
        {stage.icon}
      </div>
      <div className="font-mono text-[11px] font-semibold leading-tight">{pick(stage.label, locale)}</div>
      <div className="font-mono text-[9px] uppercase tracking-wider leading-tight text-[var(--muted)]">
        {pick(stage.sublabel, locale)}
      </div>
    </div>
  );
}

/** 레이어 카드 — DiagramCard 시각 언어. badge 있으면 레벨 칩(L0/L1·L2/L3) 표시 */
function StageCard({
  stage,
  label,
  icon,
  locale,
  projectSlug,
  compact = false,
}: {
  stage: PipelineStage;
  label: string;
  icon: string;
  locale: Locale;
  projectSlug: string;
  compact?: boolean;
}) {
  const catColor = stage.cat ? `var(--cat-${stage.cat})` : "var(--accent)";
  return (
    <Link
      href={`/projects/${projectSlug}${stage.slug ? `#${stage.slug}` : ""}`}
      style={{
        borderColor: `color-mix(in oklch, ${catColor} 55%, var(--border))`,
        backgroundColor: `color-mix(in oklch, ${catColor} 7%, var(--card))`,
      }}
      className="group/card relative flex h-full min-w-0 flex-col rounded-xl border transition-all duration-300 hover:ring-2 hover:ring-[var(--accent)]/40"
    >
      <div className="flex items-center gap-2 px-4 py-3">
        {stage.badge ? (
          <span
            className="shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold leading-none"
            style={{
              backgroundColor: `color-mix(in oklch, ${catColor} 22%, var(--card))`,
              color: `color-mix(in oklch, ${catColor} 70%, var(--foreground))`,
            }}
          >
            {stage.badge}
          </span>
        ) : (
          <span className="size-1.5 shrink-0 rounded-full" style={{ background: catColor }} />
        )}
        <span className="text-base leading-none">{icon}</span>
        <span className="min-w-0 flex-1 text-[15px] font-semibold leading-tight">{label}</span>
        <ArrowUpRight className="size-3.5 shrink-0 -translate-x-0.5 translate-y-0.5 text-[var(--accent)] opacity-0 transition-all group-hover/card:translate-x-0 group-hover/card:translate-y-0 group-hover/card:opacity-100" />
      </div>
      <div className="border-t border-[var(--border)]/60 px-4 py-2 font-mono text-[10px] leading-snug text-[var(--muted)]">
        {pick(stage.sublabel, locale)}
      </div>
      {!compact && stage.desc && (
        <p className="flex-1 px-4 py-2.5 text-xs leading-relaxed text-[var(--card-foreground)]">
          {pick(stage.desc, locale)}
        </p>
      )}
    </Link>
  );
}

/** 소제목 — 프로젝트 상세로 링크 + (옵션) 보조 설명 */
function RowHeader({ pipeline, locale }: { pipeline: Pipeline; locale: Locale }) {
  return (
    <div className="mb-6">
      <Link
        href={`/projects/${pipeline.projectSlug}`}
        className="group/h inline-flex items-center gap-2 text-[var(--foreground)]"
      >
        <span className="text-lg leading-none">{pipeline.icon}</span>
        <span className="text-base font-semibold tracking-tight">{pick(pipeline.title, locale)}</span>
        <ArrowUpRight className="size-4 text-[var(--accent)] opacity-0 transition-all group-hover/h:translate-x-0.5 group-hover/h:opacity-100" />
      </Link>
      {pipeline.note && (
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">{pick(pipeline.note, locale)}</p>
      )}
    </div>
  );
}

/** 점선 환류 노트 (모든 variant 공용, 본문 아래) */
function ReturnNote({ note }: { note: string }) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2.5 px-2">
      <span className="hidden h-px w-10 shrink-0 border-t border-dashed border-[var(--muted)]/60 sm:inline-block" />
      <span className="text-center font-mono text-[10px] leading-relaxed text-[var(--muted)]">{note}</span>
      <span className="hidden h-px w-10 shrink-0 border-t border-dashed border-[var(--muted)]/60 sm:inline-block" />
    </div>
  );
}

const rise = (reduce: boolean, i: number) =>
  ({
    initial: reduce ? false : ({ opacity: 0, y: 16 } as const),
    whileInView: { opacity: 1, y: 0 } as const,
    viewport: { once: true, margin: "-60px" } as const,
    transition: { duration: 0.45, delay: i * 0.05 },
  }) as const;

/** variant: spine — 가로 스파인 (SAR) */
function SpineRow({ pipeline, locale, reduce }: { pipeline: Pipeline; locale: Locale; reduce: boolean }) {
  const subBySlug = useMemo(
    () =>
      new Map(
        (
          projects.find((p) => p.slug === pipeline.projectSlug)?.subProjects ?? []
        ).map((s) => [s.slug, s])
      ),
    [pipeline]
  );
  const gridCols = pipeline.stages.map((s) => (s.kind === "layer" ? "minmax(0,1fr)" : "auto")).join(" auto ");

  const items: ReactNode[] = [];
  pipeline.stages.forEach((stage, i) => {
    if (i > 0) {
      items.push(
        <motion.div key={`c-${i}`} {...rise(reduce, i * 2 - 1)} className="flex justify-center lg:self-center">
          <Connector label={pick(pipeline.edges[i - 1].label, locale)} phase={(i - 1) * 0.45} reduce={reduce} />
        </motion.div>
      );
    }
    if (stage.kind === "layer") {
      const sub = stage.slug ? subBySlug.get(stage.slug) : undefined;
      const label = sub?.layerLabel ? pick(sub.layerLabel, locale) : pick(stage.label, locale);
      const icon = sub?.layerIcon ?? stage.icon;
      items.push(
        <motion.div key={`s-${i}`} {...rise(reduce, i * 2)} className="min-w-0">
          <StageCard stage={stage} label={label} icon={icon} locale={locale} projectSlug={pipeline.projectSlug} />
        </motion.div>
      );
    } else {
      items.push(
        <motion.div key={`s-${i}`} {...rise(reduce, i * 2)} className="flex justify-center lg:self-center">
          <StagePill stage={stage} locale={locale} />
        </motion.div>
      );
    }
  });

  return (
    <div>
      <RowHeader pipeline={pipeline} locale={locale} />
      <div className="flex flex-col lg:grid lg:items-stretch" style={{ gridTemplateColumns: gridCols }}>
        {items}
        {pipeline.returnNote && (
          <>
            <div className="col-span-full mt-7 hidden px-10 lg:block">
              <div className="relative border-t border-dashed border-[var(--muted)]/50">
                <svg viewBox="0 0 8 10" className="absolute -left-1 top-1/2 h-2.5 w-2 -translate-y-1/2 fill-[var(--muted)]" aria-hidden="true">
                  <path d="M8 0 L0 5 L8 10 Z" />
                </svg>
                <span className="pipeline-return-dot" />
              </div>
              <div className="mt-2.5 flex justify-center">
                <span className="font-mono text-[10px] text-[var(--muted)]">{pick(pipeline.returnNote, locale)}</span>
              </div>
            </div>
            <div className="lg:hidden">
              <ReturnNote note={pick(pipeline.returnNote, locale)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** variant: levels — L0→L1·L2→L3 처리 레벨 트랙 (SDPE) */
function LevelsRow({ pipeline, locale, reduce }: { pipeline: Pipeline; locale: Locale; reduce: boolean }) {
  const start = pipeline.stages.find((s) => s.kind === "endpoint" && s.tone === "actor");
  const end = [...pipeline.stages].reverse().find((s) => s.kind === "endpoint" && s.tone !== "actor");
  const levels = pipeline.stages.filter((s) => s.kind === "layer");

  return (
    <div>
      <RowHeader pipeline={pipeline} locale={locale} />
      <motion.div
        {...rise(reduce, 0)}
        className="flex flex-col items-stretch gap-3 md:flex-row md:items-center"
      >
        {start && <StagePill stage={start} locale={locale} />}
        {start && <Arrow label={pick(pipeline.edges[0]?.label ?? { ko: "", en: "" }, locale)} />}

        {/* 레벨 트랙 — 레벨 카드들이 한 묶음(track)으로 */}
        <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--subtle)]/40 p-2.5 md:flex-row md:items-stretch">
          {levels.map((lv, i) => (
            <Fragment key={`lv-${i}`}>
              {i > 0 && <Arrow />}
              <div className="min-w-0 flex-1">
                <StageCard
                  stage={lv}
                  label={pick(lv.label, locale)}
                  icon={lv.icon}
                  locale={locale}
                  projectSlug={pipeline.projectSlug}
                  compact
                />
              </div>
            </Fragment>
          ))}
        </div>

        {end && <Arrow label={pick(pipeline.edges[pipeline.edges.length - 1]?.label ?? { ko: "", en: "" }, locale)} />}
        {end && <StagePill stage={end} locale={locale} />}
      </motion.div>
      {pipeline.returnNote && <ReturnNote note={pick(pipeline.returnNote, locale)} />}
    </div>
  );
}

/** variant: stack — 세로 컴팩트 스택 (him) */
function StackRow({ pipeline, locale, reduce }: { pipeline: Pipeline; locale: Locale; reduce: boolean }) {
  return (
    <div>
      <RowHeader pipeline={pipeline} locale={locale} />
      <motion.div {...rise(reduce, 0)} className="flex flex-col items-stretch gap-1.5 sm:max-w-md">
        {pipeline.stages.map((stage, i) => (
          <Fragment key={`st-${i}`}>
            {i > 0 && (
              <div className="flex items-center justify-center">
                <Arrow vertical label={pick(pipeline.edges[i - 1]?.label ?? { ko: "", en: "" }, locale)} />
              </div>
            )}
            {stage.kind === "layer" ? (
              <StageCard
                stage={stage}
                label={pick(stage.label, locale)}
                icon={stage.icon}
                locale={locale}
                projectSlug={pipeline.projectSlug}
                compact
              />
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--subtle)]/60 px-4 py-2.5">
                <span className="text-lg leading-none">{stage.icon}</span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold leading-tight">{pick(stage.label, locale)}</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                    {pick(stage.sublabel, locale)}
                  </div>
                </div>
              </div>
            )}
          </Fragment>
        ))}
      </motion.div>
      {pipeline.returnNote && <ReturnNote note={pick(pipeline.returnNote, locale)} />}
    </div>
  );
}

function PipelineBlock({ pipeline, locale, reduce }: { pipeline: Pipeline; locale: Locale; reduce: boolean }) {
  if (pipeline.variant === "levels") return <LevelsRow pipeline={pipeline} locale={locale} reduce={reduce} />;
  if (pipeline.variant === "stack") return <StackRow pipeline={pipeline} locale={locale} reduce={reduce} />;
  return <SpineRow pipeline={pipeline} locale={locale} reduce={reduce} />;
}

export function PipelineSection() {
  const t = useTranslations("pipeline");
  const locale = useLocale() as Locale;
  const reduce = useReducedMotion() ?? false;

  return (
    <section id="pipeline" className="relative overflow-hidden border-t border-[var(--border)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-36 top-24 opacity-60 [mask-image:radial-gradient(ellipse_75%_80%_at_50%_42%,black,transparent)]"
        style={{ backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 md:px-10 lg:px-12">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="mb-16 max-w-2xl"
        >
          <div className="mb-3 text-xs font-mono uppercase tracking-widest text-[var(--accent)]">{t("eyebrow")}</div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">{t("title")}</h2>
          <p className="leading-relaxed text-[var(--muted)]">{t("lede")}</p>
        </motion.div>

        <div className="space-y-16">
          {pipelines.map((p) => (
            <PipelineBlock key={p.id} pipeline={p} locale={locale} reduce={reduce} />
          ))}
        </div>
      </div>
    </section>
  );
}
