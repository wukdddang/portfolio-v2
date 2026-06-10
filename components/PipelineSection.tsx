"use client";

/**
 * PipelineSection — 메인 페이지의 "위성에서 사용자까지" 데이터 여정 스파인.
 *
 * 프로젝트 상세의 React Flow 다이어그램과 같은 시각 언어(카테고리 색 카드,
 * amber 흐름선 + glow, SMIL 흐름 점, 점선 환류)를 쓰되, 순수 SVG/DOM으로 그려
 * 메인 번들에 @xyflow를 싣지 않는다. 정밀한 호출 관계는 통합 다이어그램이 담당하고
 * 여기는 *데이터가 거치는 단계*의 요약 — 카드 클릭 시 해당 레이어 상세로 딥링크.
 *
 * 강조 비대칭이 곧 메시지: 본인 소유 3 레이어는 큰 카드, 외부 끝점(위성·사용자)은
 * 작은 pill. lg 미만에서는 세로 스파인으로 전환.
 */

import { useMemo, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Workflow } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { projects } from "@/data/projects";
import {
  pipelineStages,
  pipelineEdges,
  type PipelineStage,
} from "@/data/pipeline";
import { pick } from "@/data/i18n";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const PLATFORM_SLUG = "lumir-sar-platform";

const chipCls =
  "whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--card)] px-1.5 py-0.5 font-mono text-[10px] leading-tight text-[var(--foreground)]";

/** amber 정방향 흐름선 — glow 밑줄 + 본선 + 화살촉 + SMIL 흐름 점 (diagram-flow 에코) */
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
      {/* 흐름 점 1개 — 짧은 커넥터라 점 2개는 과밀. 커넥터별 phase로 desync 유지 */}
      {!reduce && (
        <g>
          <circle r={4.5} fill="var(--foreground)" opacity={0.12}>
            <animateMotion
              dur={`${dur}s`}
              begin={`-${phase.toFixed(2)}s`}
              repeatCount="indefinite"
              path={path}
            />
          </circle>
          <circle r={2.2} fill="var(--foreground)" opacity={0.85}>
            <animateMotion
              dur={`${dur}s`}
              begin={`-${phase.toFixed(2)}s`}
              repeatCount="indefinite"
              path={path}
            />
          </circle>
        </g>
      )}
    </svg>
  );
}

/** 단계 사이 커넥터 — lg+: 라벨 칩 위 + 가로선, lg 미만: 세로선 + 옆 칩 */
function Connector({
  label,
  phase,
  reduce,
}: {
  label: string;
  phase: number;
  reduce: boolean;
}) {
  return (
    <>
      <div className="relative flex justify-center py-1 lg:hidden">
        <FlowLine vertical phase={phase} reduce={reduce} />
        <span
          className={cn(
            chipCls,
            "absolute left-1/2 top-1/2 ml-4 -translate-y-1/2"
          )}
        >
          {label}
        </span>
      </div>
      {/* -translate-y: 칩+선 블록을 칩 높이의 절반만큼 올려 *선*이 카드 중앙선에 오도록 */}
      <div className="hidden flex-col items-center gap-1.5 px-1 lg:flex lg:-translate-y-3">
        <span className={chipCls}>{label}</span>
        <FlowLine phase={phase} reduce={reduce} />
      </div>
    </>
  );
}

/** 외부 끝점 pill — external=점선(외부 시스템), actor=반전(사람) */
function StagePill({
  stage,
  locale,
}: {
  stage: PipelineStage;
  locale: Locale;
}) {
  const actor = stage.tone === "actor";
  return (
    <div className="flex w-28 flex-col items-center gap-1.5 px-1 text-center">
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
      <div className="font-mono text-[11px] font-semibold leading-tight">
        {pick(stage.label, locale)}
      </div>
      <div className="font-mono text-[9px] uppercase tracking-wider leading-tight text-[var(--muted)]">
        {pick(stage.sublabel, locale)}
      </div>
    </div>
  );
}

/** 레이어 카드 — DiagramCard 시각 언어(카테고리 색 보더·틴트, 상태 점, mono 디테일) */
function StageCard({
  stage,
  label,
  icon,
  locale,
}: {
  stage: PipelineStage;
  label: string;
  icon: string;
  locale: Locale;
}) {
  const catColor = stage.cat ? `var(--cat-${stage.cat})` : "var(--accent)";
  return (
    <Link
      href={`/projects/${PLATFORM_SLUG}#${stage.slug}`}
      style={{
        borderColor: `color-mix(in oklch, ${catColor} 55%, var(--border))`,
        backgroundColor: `color-mix(in oklch, ${catColor} 7%, var(--card))`,
      }}
      className="group/card relative flex h-full min-w-0 flex-col rounded-xl border transition-all duration-300 hover:ring-2 hover:ring-[var(--accent)]/40"
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <span
          className="size-1.5 shrink-0 rounded-full"
          style={{ background: catColor }}
        />
        <span className="text-base leading-none">{icon}</span>
        <span className="min-w-0 flex-1 text-[15px] font-semibold leading-tight">
          {label}
        </span>
        <ArrowUpRight className="size-3.5 shrink-0 -translate-x-0.5 translate-y-0.5 text-[var(--accent)] opacity-0 transition-all group-hover/card:translate-x-0 group-hover/card:translate-y-0 group-hover/card:opacity-100" />
      </div>
      <div className="border-t border-[var(--border)]/60 px-4 py-2 font-mono text-[10px] leading-snug text-[var(--muted)]">
        {pick(stage.sublabel, locale)}
      </div>
      {stage.desc && (
        <p className="flex-1 px-4 py-2.5 text-xs leading-relaxed text-[var(--card-foreground)]">
          {pick(stage.desc, locale)}
        </p>
      )}
    </Link>
  );
}

export function PipelineSection() {
  const t = useTranslations("pipeline");
  const locale = useLocale() as Locale;
  const reduce = useReducedMotion() ?? false;

  const platform = projects.find((p) => p.slug === PLATFORM_SLUG);
  const subBySlug = useMemo(
    () => new Map((platform?.subProjects ?? []).map((s) => [s.slug, s])),
    [platform]
  );

  // 등장 모션 — 좌→우 순차 라이즈 (reduced-motion 시 즉시 표시)
  const rise = (i: number) =>
    ({
      initial: reduce ? false : ({ opacity: 0, y: 16 } as const),
      whileInView: { opacity: 1, y: 0 } as const,
      viewport: { once: true, margin: "-60px" } as const,
      transition: { duration: 0.45, delay: i * 0.06 },
    }) as const;

  // 스파인 구성 — pill / connector / card 를 grid(lg+) 또는 column(미만) 자식으로
  const items: ReactNode[] = [];
  pipelineStages.forEach((stage, i) => {
    if (i > 0) {
      items.push(
        <motion.div
          key={`conn-${i}`}
          {...rise(i * 2 - 1)}
          className="flex justify-center lg:self-center"
        >
          <Connector
            label={pick(pipelineEdges[i - 1].label, locale)}
            phase={(i - 1) * 0.45}
            reduce={reduce}
          />
        </motion.div>
      );
    }
    if (stage.kind === "layer") {
      const sub = stage.slug ? subBySlug.get(stage.slug) : undefined;
      items.push(
        <motion.div key={stage.slug} {...rise(i * 2)} className="min-w-0">
          <StageCard
            stage={stage}
            label={
              sub?.layerLabel
                ? pick(sub.layerLabel, locale)
                : pick(stage.label, locale)
            }
            icon={sub?.layerIcon ?? stage.icon}
            locale={locale}
          />
        </motion.div>
      );
    } else {
      items.push(
        <motion.div
          key={`end-${i}`}
          {...rise(i * 2)}
          className="flex justify-center lg:self-center"
        >
          <StagePill stage={stage} locale={locale} />
        </motion.div>
      );
    }
  });

  return (
    <section
      id="pipeline"
      className="relative overflow-hidden border-t border-[var(--border)]"
    >
      {/* 도트 배경 — 프로젝트 페이지 React Flow Background(gap 22) 에코 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-36 top-24 opacity-60 [mask-image:radial-gradient(ellipse_75%_80%_at_50%_42%,black,transparent)]"
        style={{
          backgroundImage:
            "radial-gradient(var(--border) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 md:px-10 lg:px-12">
        {/* Header */}
        <motion.div {...rise(0)} className="mb-12 max-w-2xl">
          <div className="mb-3 text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
            {t("eyebrow")}
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            {t("title")}
          </h2>
          <p className="leading-relaxed text-[var(--muted)]">{t("lede")}</p>
        </motion.div>

        {/* Spine — lg+: [pill conn card conn card conn card conn pill] 가로, 미만: 세로 */}
        <div className="flex flex-col lg:grid lg:grid-cols-[auto_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_auto] lg:items-stretch">
          {items}

          {/* 환류 레인 (lg+) — 점선 = 요청 방향(우→좌), CSS 흐름 점 */}
          <motion.div
            {...rise(10)}
            className="col-span-full mt-7 hidden px-10 lg:block"
          >
            <div className="relative border-t border-dashed border-[var(--muted)]/50">
              <svg
                viewBox="0 0 8 10"
                className="absolute -left-1 top-1/2 h-2.5 w-2 -translate-y-1/2 fill-[var(--muted)]"
                aria-hidden="true"
              >
                <path d="M8 0 L0 5 L8 10 Z" />
              </svg>
              <span className="pipeline-return-dot" />
              <span
                className="pipeline-return-dot"
                style={{ animationDelay: "-3.5s" }}
              />
            </div>
            <div className="mt-2.5 flex justify-center">
              <span className="font-mono text-[10px] text-[var(--muted)]">
                {t("returnNote")}
              </span>
            </div>
          </motion.div>
        </div>

        {/* 환류 노트 (lg 미만) */}
        <div className="mt-5 flex items-center justify-center gap-2 px-2 lg:hidden">
          <span className="inline-block w-6 shrink-0 border-t border-dashed border-[var(--muted)]" />
          <span className="text-center font-mono text-[10px] leading-relaxed text-[var(--muted)]">
            {t("returnNote")}
          </span>
        </div>

        {/* CTA — 통합 다이어그램(드릴인 캔버스)으로 */}
        <motion.div
          {...rise(11)}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href={`/projects/${PLATFORM_SLUG}`}
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-90"
          >
            <Workflow className="size-4" />
            {t("ctaDiagram")}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <span className="font-mono text-xs text-[var(--muted)]">
            {t("cardHint")}
          </span>
        </motion.div>

        {/* 메트릭 스트립 — Hero meta strip 패턴 */}
        {platform?.metrics && (
          <motion.div
            {...rise(12)}
            className="mt-14 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-[var(--border)] pt-6 font-mono text-xs text-[var(--muted)] md:grid-cols-4"
          >
            {platform.metrics.map((m, i) => (
              <div key={i}>
                <div className="mb-1 text-[10px] uppercase tracking-widest">
                  {pick(m.label, locale)}
                </div>
                <div className="text-[var(--foreground)]">
                  {pick(m.value, locale)}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
