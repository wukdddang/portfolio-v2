"use client";

/**
 * PipelineSection — 메인 페이지 "프로젝트별 데이터 파이프라인" 섹션.
 *
 * 프로젝트 상세의 React Flow 다이어그램과 같은 시각 언어(카테고리 색 카드, amber 흐름선
 * + glow, SMIL 흐름 점, 점선 환류)를 순수 SVG/DOM으로 그려 메인 번들에 @xyflow를 싣지 않는다.
 *
 * 프로젝트 성격이 다이어그램 *모양*으로 드러나도록 변형을 나눈다 (data/pipeline.ts 참조):
 *  - SAR  (SpineRow)        : 가로 스파인 — 시스템을 가로지르는 데이터 여정. 간판.
 *  - SDPE (OrchestrationRow): 제어 플레인(콘솔→워크플로) + 전폭 pgmq 이벤트 버스(teal)가
 *                             레벨 카드로 디스패치하는 2-플레인 보드. 제어=teal 점선,
 *                             데이터=amber 실선으로 흐름 종류를 색으로 분리.
 *  - him  (StackRow)        : 모바일 디바이스 프레임 속 세로 스택 — 커맨드/쿼리 트윈
 *                             레인(CQRS)과 프레임 밖 FCM 푸시 업 레인.
 */

import { Fragment, useMemo, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { projects } from "@/data/projects";
import { pipelines, type Pipeline, type PipelineStage } from "@/data/pipeline";
import { pick, type L } from "@/data/i18n";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const chipCls =
  "whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--card)] px-1.5 py-0.5 font-mono text-[10px] leading-tight text-[var(--foreground)]";

/** teal(이벤트/제어 플레인) 칩 색 — orchestration 변형 전용 */
const tealChipStyle = {
  borderColor: "color-mix(in oklch, var(--cat-2) 45%, var(--border))",
  color: "color-mix(in oklch, var(--cat-2) 60%, var(--foreground))",
} as const;

/** amber 정방향 흐름선 — glow 밑줄 + 본선 + 화살촉 + SMIL 흐름 점 (diagram-flow 에코) */
function FlowLine({
  vertical = false,
  phase = 0,
  reduce = false,
  color = "var(--accent)",
}: {
  vertical?: boolean;
  phase?: number;
  reduce?: boolean;
  color?: string;
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
        stroke={color}
        strokeWidth={6}
        strokeOpacity={0.3}
        strokeLinecap="round"
        style={{ filter: "blur(3px)" }}
      />
      <path d={path} fill="none" stroke={color} strokeWidth={2} />
      <path d={arrow} fill={color} />
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

/** 세로 흐름선 + 옆 라벨 칩 — 모든 브레이크포인트에서 세로인 곳(디바이스 스택 등)에 사용 */
function VerticalEdge({
  label,
  phase,
  reduce,
  color,
}: {
  label: string;
  phase: number;
  reduce: boolean;
  color?: string;
}) {
  return (
    <div className="relative flex justify-center py-1">
      <FlowLine vertical phase={phase} reduce={reduce} color={color} />
      <span className={cn(chipCls, "absolute left-1/2 top-1/2 ml-4 -translate-y-1/2")} style={tintedChipStyle(color)}>
        {label}
      </span>
    </div>
  );
}

/** color 지정 시 칩 테두리·글자를 그 색으로 틴트 (제어 플레인 teal 등). 미지정이면 기본 칩 */
function tintedChipStyle(color?: string) {
  return color
    ? ({
        borderColor: `color-mix(in oklch, ${color} 45%, var(--border))`,
        color: `color-mix(in oklch, ${color} 60%, var(--foreground))`,
      } as const)
    : undefined;
}

/** 단계 사이 커넥터 — lg+: 라벨 칩 위 + 가로선, lg 미만: 세로선 + 옆 칩. color 지정 시 흐름선·칩 틴트 */
function Connector({ label, phase, reduce, color }: { label: string; phase: number; reduce: boolean; color?: string }) {
  return (
    <>
      <div className="lg:hidden">
        <VerticalEdge label={label} phase={phase} reduce={reduce} color={color} />
      </div>
      <div className="hidden flex-col items-center gap-1.5 px-1 lg:flex lg:-translate-y-3">
        <span className={chipCls} style={tintedChipStyle(color)}>{label}</span>
        <FlowLine phase={phase} reduce={reduce} color={color} />
      </div>
    </>
  );
}

/** 이벤트 디스패치 드롭 — teal 세로 점선 + 화살촉 + SMIL 점 (버스 → 레벨 카드) */
function EventDrop({ tall = false, phase = 0, reduce }: { tall?: boolean; phase?: number; reduce: boolean }) {
  const h = tall ? 48 : 40;
  const lineEnd = h - 8;
  const path = `M12 0 V${lineEnd}`;
  return (
    <svg viewBox={`0 0 24 ${h}`} className={cn("w-6", tall ? "h-12" : "h-10")} aria-hidden="true">
      <path
        d={path}
        fill="none"
        stroke="var(--cat-2)"
        strokeWidth={2}
        strokeDasharray="3 4"
        strokeOpacity={0.75}
      />
      <path d={`M7.5 ${lineEnd - 0.5} L12 ${h - 0.5} L16.5 ${lineEnd - 0.5} Z`} fill="var(--cat-2)" />
      {!reduce && (
        <circle r={2.2} fill="var(--cat-2)" opacity={0.9}>
          <animateMotion dur="1.6s" begin={`-${phase.toFixed(2)}s`} repeatCount="indefinite" path={path} />
        </circle>
      )}
    </svg>
  );
}

/** 제어 플레인 노드 — CSC-08 오케스트레이터(컨트롤 타워) teal 카드. 아래 pgmq 드롭으로 처리 단계를 구동 */
function WorkflowNode({ pipeline, locale }: { pipeline: Pipeline; locale: Locale }) {
  const wf = pipeline.control!.workflow;
  return (
    <Link
      href={`/projects/${pipeline.projectSlug}`}
      style={{
        borderColor: "color-mix(in oklch, var(--cat-2) 55%, var(--border))",
        backgroundColor: "color-mix(in oklch, var(--cat-2) 10%, var(--card))",
      }}
      className="group/wf flex items-center gap-2.5 rounded-xl border px-4 py-2.5 transition-all duration-300 hover:ring-2 hover:ring-[var(--accent)]/40"
    >
      <span
        className="flex size-7 shrink-0 items-center justify-center rounded-lg text-sm leading-none"
        style={{ backgroundColor: "color-mix(in oklch, var(--cat-2) 22%, var(--card))" }}
      >
        {wf.icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-semibold leading-tight">{pick(wf.label, locale)}</span>
        <span className="font-mono text-[10px] leading-tight text-[var(--muted)]">{pick(wf.sublabel, locale)}</span>
      </span>
      <ArrowUpRight className="size-3.5 shrink-0 text-[var(--accent)] opacity-0 transition-all group-hover/wf:opacity-100" />
    </Link>
  );
}

/**
 * DAG 프론트엔드 노드 — SDPE 운영 콘솔(Next.js·React Flow)의 n8n 스타일 DAG 빌더를
 * 미니 캔버스로 압축. 윈도우 크롬 헤더 + 점 배경 위 노드 스트립(진입→CSC×2→카탈로그).
 * 제어 플레인 색(teal·--cat-2)으로 워크플로·버스와 한 묶음. 탭하면 프로젝트 상세로.
 */
function DagFrontendNode({ pipeline, locale }: { pipeline: Pipeline; locale: Locale }) {
  const c = pipeline.control!.console;
  // 미니 DAG 노드 — 진입(trigger) → CSC 처리 ×2 → 카탈로그. 실제 React Flow DAG 빌더의 축약.
  const miniNodes = ["⚡", "⚙", "⚙", "🗄"];
  return (
    <Link
      href={`/projects/${pipeline.projectSlug}`}
      style={{
        borderColor: "color-mix(in oklch, var(--cat-2) 50%, var(--border))",
        backgroundColor: "color-mix(in oklch, var(--cat-2) 8%, var(--card))",
      }}
      className="group/dag flex w-full flex-col gap-3 rounded-xl border px-4 py-3.5 transition-all duration-300 hover:ring-2 hover:ring-[var(--accent)]/40"
    >
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2 rounded-full" style={{ background: "color-mix(in oklch, var(--cat-5) 70%, transparent)" }} />
          <span className="size-2 rounded-full" style={{ background: "color-mix(in oklch, var(--accent) 70%, transparent)" }} />
          <span className="size-2 rounded-full" style={{ background: "color-mix(in oklch, var(--cat-6) 70%, transparent)" }} />
        </span>
        <span className="text-base leading-none">{c.icon}</span>
        <span className="flex min-w-0 flex-col">
          <span className="text-[15px] font-semibold leading-tight">{pick(c.label, locale)}</span>
          <span className="font-mono text-[10px] leading-tight text-[var(--muted)]">{pick(c.sublabel, locale)}</span>
        </span>
        <ArrowUpRight className="ml-auto size-3.5 shrink-0 text-[var(--accent)] opacity-0 transition-all group-hover/dag:opacity-100" />
      </div>
      <div
        className="flex items-center justify-center rounded-lg border border-[var(--border)]/60 px-2 py-3.5"
        style={{
          backgroundColor: "color-mix(in oklch, var(--cat-2) 5%, var(--background))",
          backgroundImage: "radial-gradient(color-mix(in oklch, var(--cat-2) 22%, transparent) 0.5px, transparent 0.5px)",
          backgroundSize: "10px 10px",
        }}
      >
        {miniNodes.map((icon, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <span
                aria-hidden
                className="h-[1.5px] w-4 shrink-0"
                style={{ background: "color-mix(in oklch, var(--cat-2) 55%, transparent)" }}
              />
            )}
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-md border text-[13px] leading-none"
              style={{
                borderColor: "color-mix(in oklch, var(--cat-2) 55%, var(--border))",
                background: "color-mix(in oklch, var(--cat-2) 14%, var(--card))",
              }}
            >
              {icon}
            </span>
          </Fragment>
        ))}
      </div>
      {c.desc && (
        <p className="text-xs leading-relaxed text-[var(--card-foreground)]">{pick(c.desc, locale)}</p>
      )}
      {c.tags && c.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {c.tags.map((tag, ti) => (
            <span
              key={ti}
              className="rounded-md border px-1.5 py-0.5 font-mono text-[10px] leading-none text-[var(--muted)]"
              style={{
                borderColor: "color-mix(in oklch, var(--cat-2) 28%, var(--border))",
                backgroundColor: "color-mix(in oklch, var(--cat-2) 8%, var(--card))",
              }}
            >
              {pick(tag, locale)}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

/** CQRS 트윈 레인 — 한 구간을 커맨드/쿼리 두 색 레인으로 분리 (stack 변형) */
function TwinLanes({
  lanes,
  locale,
  reduce,
}: {
  lanes: { label: L; cat: number }[];
  locale: Locale;
  reduce: boolean;
}) {
  return (
    <div className="flex items-start justify-center gap-10 py-1">
      {lanes.map((lane, i) => {
        const color = `var(--cat-${lane.cat})`;
        return (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span
              className={cn(chipCls, "inline-flex items-center gap-1.5")}
              style={{
                borderColor: `color-mix(in oklch, ${color} 45%, var(--border))`,
                color: `color-mix(in oklch, ${color} 55%, var(--foreground))`,
              }}
            >
              <span aria-hidden className="size-1.5 rounded-full" style={{ background: color }} />
              {pick(lane.label, locale)}
            </span>
            <FlowLine vertical phase={i * 0.6} reduce={reduce} color={color} />
          </div>
        );
      })}
    </div>
  );
}

/** 본체 → 푸시 기기 점선 레인 — 환류 시각 언어(muted dashed) + 흐르는 점 */
function PushLane({
  label,
  vertical = false,
  reduce,
}: {
  label: string;
  vertical?: boolean;
  reduce: boolean;
}) {
  const path = vertical ? "M12 2 V40" : "M2 12 H62";
  const arrow = vertical ? "M7.5 40 L12 48 L16.5 40 Z" : "M62 7 L70 12 L62 17 Z";
  const dot = !reduce && (
    <circle r={2.2} fill="var(--foreground)" opacity={0.7}>
      <animateMotion dur="2.4s" repeatCount="indefinite" path={path} />
    </circle>
  );
  if (vertical) {
    return (
      <div className="relative flex justify-center py-1">
        <svg viewBox="0 0 24 50" className="h-12 w-6" aria-hidden="true">
          <path d={path} fill="none" stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="4 5" strokeOpacity={0.7} />
          <path d={arrow} fill="var(--muted)" />
          {dot}
        </svg>
        <span className={cn(chipCls, "absolute left-1/2 top-1/2 ml-4 -translate-y-1/2")}>{label}</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-1.5 px-1.5">
      <span className={chipCls}>{label}</span>
      <svg viewBox="0 0 72 24" className="h-6 w-[4.5rem]" aria-hidden="true">
        <path d={path} fill="none" stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="4 5" strokeOpacity={0.7} />
        <path d={arrow} fill="var(--muted)" />
        {dot}
      </svg>
    </div>
  );
}

/** 미니 디바이스 공통 상태바 — 펀치홀 + 신호·LTE·배터리. time 없으면 좌측 비움(잠금화면) */
function DeviceStatusBar({ time }: { time?: string }) {
  return (
    <div className="relative flex items-center justify-between px-2.5 pb-1 pt-2">
      <span className="min-w-8 font-mono text-[8px] leading-none text-[var(--muted)]">{time ?? ""}</span>
      <span
        aria-hidden
        className="absolute left-1/2 top-2 h-2 w-11 -translate-x-1/2 rounded-full border border-[var(--border)]/70 bg-[var(--background)]"
      />
      <span className="flex items-center gap-1" aria-hidden>
        <span className="flex items-end gap-[2px]">
          {[3, 5, 7, 9].map((h, i) => (
            <span
              key={i}
              className="w-[2.5px] rounded-[1px]"
              style={{
                height: h,
                background: i < 3 ? "var(--muted)" : "color-mix(in oklch, var(--muted) 40%, transparent)",
              }}
            />
          ))}
        </span>
        <span className="font-mono text-[7px] leading-none text-[var(--muted)]">LTE</span>
        <span className="relative ml-0.5 inline-block h-[9px] w-[17px] rounded-[3px] border border-[var(--muted)]/70">
          <span className="absolute bottom-[1.5px] left-[1.5px] top-[1.5px] w-[9px] rounded-[1px] bg-[var(--muted)]" />
          <span className="absolute -right-[3px] top-1/2 h-[4px] w-[2px] -translate-y-1/2 rounded-r-[1px] bg-[var(--muted)]/70" />
        </span>
      </span>
    </div>
  );
}

/** 두 번째 디바이스 — FCM 푸시가 도착한 잠금화면 (월페이퍼·잠금 아이콘·블러 알림 카드) */
function LockDevice({
  device,
  locale,
}: {
  device: NonNullable<Pipeline["pushDevice"]>;
  locale: Locale;
}) {
  return (
    <figure className="flex h-full w-full flex-col items-center gap-2.5">
      <div className="relative flex w-full max-w-[17.5rem] flex-1 flex-col overflow-hidden rounded-[2rem] border-2 border-[var(--border)] bg-[var(--card)]/50 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.9)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(130% 70% at 50% -5%, color-mix(in oklch, var(--accent) 13%, transparent), transparent 62%), radial-gradient(90% 50% at 85% 105%, color-mix(in oklch, var(--cat-3) 11%, transparent), transparent)",
          }}
        />
        <div className="relative flex flex-1 flex-col">
          <DeviceStatusBar />
          <div className="mt-3 flex flex-col items-center">
            <svg viewBox="0 0 12 14" className="h-3 w-3 fill-[var(--muted)]" aria-hidden="true">
              <path d="M6 0a3.2 3.2 0 0 0-3.2 3.2V5H2A1.4 1.4 0 0 0 .6 6.4v5.2A1.4 1.4 0 0 0 2 13h8a1.4 1.4 0 0 0 1.4-1.4V6.4A1.4 1.4 0 0 0 10 5h-.8V3.2A3.2 3.2 0 0 0 6 0ZM4.2 3.2a1.8 1.8 0 1 1 3.6 0V5H4.2V3.2Z" />
            </svg>
            <div className="mt-1.5 text-[11px] font-medium text-[var(--card-foreground)]">
              {pick(device.date, locale)}
            </div>
            <div className="text-[2.75rem] font-light leading-none tracking-tight text-[var(--foreground)]">
              {device.clock}
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-1.5 px-2.5">
            {device.notifications.map((n, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--foreground)]/5 px-2.5 py-2 backdrop-blur-md"
              >
                <div className="flex items-start gap-2">
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-[8px] text-sm leading-none"
                    style={{
                      background:
                        "linear-gradient(135deg, color-mix(in oklch, var(--accent) 35%, var(--card)), color-mix(in oklch, var(--accent) 10%, var(--card)))",
                    }}
                  >
                    {n.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="text-[9px] font-medium uppercase tracking-wide text-[var(--muted)]">
                        {pick(n.app, locale)}
                      </span>
                      <span className="text-[8px] text-[var(--muted)]/80">{pick(n.time, locale)}</span>
                    </span>
                    <span className="block text-[11px] font-semibold leading-tight">{pick(n.title, locale)}</span>
                    <span className="block text-[10px] leading-snug text-[var(--muted)]">{pick(n.body, locale)}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto pb-2.5 pt-5 text-center">
            <div className="text-[9px] text-[var(--muted)]/80">{pick(device.hint, locale)}</div>
            <span aria-hidden className="mx-auto mt-2 block h-1 w-14 rounded-full bg-[var(--foreground)]/30" />
          </div>
        </div>
      </div>
      <figcaption className="text-center font-mono text-[10px] text-[var(--muted)]">
        {pick(device.caption, locale)}
      </figcaption>
    </figure>
  );
}

const TONE_COLOR = {
  ok: "var(--cat-6)",
  warn: "var(--accent)",
  danger: "var(--cat-5)",
} as const;

/** 세 번째 디바이스 — 알림 탭 후 앱 대시보드 (스탯·재고 리스트·탭바) */
function AppDevice({
  screen,
  locale,
}: {
  screen: NonNullable<Pipeline["appScreen"]>;
  locale: Locale;
}) {
  return (
    <figure className="flex h-full w-full flex-col items-center gap-2.5">
      <div className="relative flex w-full max-w-[17.5rem] flex-1 flex-col overflow-hidden rounded-[2rem] border-2 border-[var(--border)] bg-[var(--card)]/50 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.9)]">
        <DeviceStatusBar time={screen.clock} />
        <div className="flex items-center justify-between px-3 pt-2">
          <span className="text-[13px] font-bold tracking-tight">{pick(screen.title, locale)}</span>
          <span className="relative text-[11px] leading-none" aria-hidden>
            🔔
            <span
              className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full"
              style={{ background: "var(--cat-5)" }}
            />
          </span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5 px-3">
          {screen.stats.map((s, i) => (
            <div key={i} className="rounded-lg border border-[var(--border)]/60 bg-[var(--subtle)]/50 py-1.5 text-center">
              <div className="text-sm font-bold leading-none" style={{ color: TONE_COLOR[s.tone] }}>
                {s.value}
              </div>
              <div className="mt-1 text-[8px] leading-none text-[var(--muted)]">{pick(s.label, locale)}</div>
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex flex-1 flex-col gap-1 px-3 pb-3">
          {screen.rows.map((r, i) => {
            const c = TONE_COLOR[r.tone];
            return (
              <div key={i} className="flex items-center gap-2 rounded-xl border border-[var(--border)]/50 bg-[var(--card)] px-2 py-1.5">
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[13px] leading-none"
                  style={{ background: `color-mix(in oklch, ${c} 14%, var(--card))` }}
                >
                  {r.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10.5px] font-semibold leading-tight">{pick(r.name, locale)}</span>
                  <span className="block text-[8.5px] text-[var(--muted)]">{pick(r.meta, locale)}</span>
                </span>
                <span
                  className="shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[8px] font-bold leading-none"
                  style={{ color: c, background: `color-mix(in oklch, ${c} 14%, transparent)` }}
                >
                  {pick(r.badge, locale)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-around border-t border-[var(--border)]/60 px-2 pb-1.5 pt-1.5">
          {screen.tabs.map((tb, i) => (
            <span
              key={i}
              className={cn(
                "flex flex-col items-center gap-0.5",
                i === 0 ? "text-[var(--accent)]" : "text-[var(--muted)]/70"
              )}
            >
              <span className="text-[11px] leading-none" aria-hidden>
                {tb.icon}
              </span>
              <span className="text-[7px] font-medium leading-none">{pick(tb.label, locale)}</span>
            </span>
          ))}
        </div>
        <span aria-hidden className="mx-auto mb-1.5 block h-1 w-12 rounded-full bg-[var(--foreground)]/25" />
      </div>
      <figcaption className="text-center font-mono text-[10px] text-[var(--muted)]">
        {pick(screen.caption, locale)}
      </figcaption>
    </figure>
  );
}

/** 외부 끝점 pill — external=점선(외부 시스템), actor=반전(사람). compact면 한 단계 작게 */
function StagePill({
  stage,
  locale,
  compact = false,
}: {
  stage: PipelineStage;
  locale: Locale;
  compact?: boolean;
}) {
  const actor = stage.tone === "actor";
  return (
    <div className={cn("flex shrink-0 flex-col items-center gap-1.5 px-1 text-center", compact ? "w-24" : "w-28")}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full leading-none",
          compact ? "size-10 text-lg" : "size-12 text-xl",
          actor
            ? "bg-[var(--foreground)] text-[var(--background)]"
            : "border border-dashed border-[var(--border)] bg-[var(--subtle)]"
        )}
      >
        {stage.icon}
      </div>
      <div className={cn("break-keep font-mono font-semibold leading-tight", compact ? "text-[10px]" : "text-[11px]")}>
        {pick(stage.label, locale)}
      </div>
      <div className="break-keep font-mono text-[9px] uppercase tracking-wider leading-tight text-[var(--muted)]">
        {pick(stage.sublabel, locale)}
      </div>
    </div>
  );
}

/** 레이어 카드 — DiagramCard 시각 언어. badge 있으면 레벨 칩(L0/L1·L2/L3), compact면 작고 desc 생략 */
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
      <div className={cn("flex items-center gap-2", compact ? "px-3 py-2.5" : "px-4 py-3")}>
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
        <span className={cn("min-w-0 flex-1 break-keep text-balance font-semibold leading-tight", compact ? "text-sm" : "text-[15px]")}>
          {label}
        </span>
        <ArrowUpRight className="size-3.5 shrink-0 -translate-x-0.5 translate-y-0.5 text-[var(--accent)] opacity-0 transition-all group-hover/card:translate-x-0 group-hover/card:translate-y-0 group-hover/card:opacity-100" />
      </div>
      <div
        className={cn(
          "border-t border-[var(--border)]/60 break-keep font-mono text-[10px] leading-snug text-[var(--muted)]",
          compact ? "px-3 py-1.5" : "px-4 py-2"
        )}
      >
        {pick(stage.sublabel, locale)}
      </div>
      {stage.desc && (
        <p
          className={cn(
            "flex-1 break-keep leading-relaxed text-[var(--card-foreground)]",
            compact ? "px-3 py-2 text-[11px]" : "px-4 py-2.5 text-xs"
          )}
        >
          {pick(stage.desc, locale)}
        </p>
      )}
      {stage.tags && stage.tags.length > 0 && (
        <div
          className={cn(
            "mt-auto flex flex-wrap gap-1.5 border-t border-[var(--border)]/50",
            compact ? "px-3 py-2" : "px-4 py-2.5"
          )}
        >
          {stage.tags.map((tag, ti) => (
            <span
              key={ti}
              className="rounded-md border px-1.5 py-0.5 font-mono text-[10px] leading-none text-[var(--muted)]"
              style={{
                borderColor: `color-mix(in oklch, ${catColor} 28%, var(--border))`,
                backgroundColor: `color-mix(in oklch, ${catColor} 8%, var(--card))`,
              }}
            >
              {pick(tag, locale)}
            </span>
          ))}
        </div>
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

/** 점선 환류 레인 — lg: 역방향 점이 흐르는 전폭 점선, 미만: 한 줄 텍스트 */
function ReturnLane({ note, locale }: { note: L; locale: Locale }) {
  return (
    <>
      <div className="col-span-full mt-7 hidden px-10 lg:block">
        <div className="relative border-t border-dashed border-[var(--muted)]/50">
          <svg viewBox="0 0 8 10" className="absolute -left-1 top-1/2 h-2.5 w-2 -translate-y-1/2 fill-[var(--muted)]" aria-hidden="true">
            <path d="M8 0 L0 5 L8 10 Z" />
          </svg>
          <span className="pipeline-return-dot" />
        </div>
        <div className="mt-2.5 flex justify-center">
          <span className="font-mono text-[10px] text-[var(--muted)]">{pick(note, locale)}</span>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-center gap-2 px-2 lg:hidden">
        <span className="inline-block w-6 shrink-0 border-t border-dashed border-[var(--muted)]" />
        <span className="text-center font-mono text-[10px] leading-relaxed text-[var(--muted)]">
          {pick(note, locale)}
        </span>
      </div>
    </>
  );
}

const rise = (reduce: boolean, i: number) =>
  ({
    initial: reduce ? false : ({ opacity: 0, y: 16 } as const),
    whileInView: { opacity: 1, y: 0 } as const,
    viewport: { once: true, margin: "-60px" } as const,
    transition: { duration: 0.45, delay: i * 0.05 },
  }) as const;

interface RowProps {
  pipeline: Pipeline;
  locale: Locale;
  reduce: boolean;
}

/** 기본 변형 — 가로 스파인 (lg+), 세로 폴백 (미만). SAR 간판용 */
function SpineRow({ pipeline, locale, reduce }: RowProps) {
  const compact = !!pipeline.compact;
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
          <StageCard stage={stage} label={label} icon={icon} locale={locale} projectSlug={pipeline.projectSlug} compact={compact} />
        </motion.div>
      );
    } else {
      items.push(
        <motion.div key={`s-${i}`} {...rise(reduce, i * 2)} className="flex justify-center lg:self-center">
          <StagePill stage={stage} locale={locale} compact={compact} />
        </motion.div>
      );
    }
  });

  return (
    <div>
      <RowHeader pipeline={pipeline} locale={locale} />
      <div className="flex flex-col lg:grid lg:items-stretch" style={{ gridTemplateColumns: gridCols }}>
        {items}
        {pipeline.returnNote && <ReturnLane note={pipeline.returnNote} locale={locale} />}
      </div>
    </div>
  );
}

/**
 * orchestration 변형 — SDPE. 정확 모델(오케스트레이터 허브): Pipeline Workflow 는 레벨을
 * *감싸는 경계*가 아니라 CSC-08 오케스트레이터(컨트롤 타워) 그 자체다. 제어 플레인
 * (운영 콘솔 DAG 빌더 → 오케스트레이터, teal)이 위에 서고, 데이터 플레인(수집→…→서비스)이
 * 아래 amber 스파인으로 흐른다. 둘은 teal pgmq 드롭(할당 SI-04 / 완료 SI-03)으로 연결된다.
 */
function OrchestrationRow({ pipeline, locale, reduce }: RowProps) {
  const control = pipeline.control!;
  const gridCols = pipeline.stages.map((s) => (s.kind === "layer" ? "minmax(0,1fr)" : "auto")).join(" auto ");

  // 제어 플레인 — 운영 콘솔(DAG 빌더) → DAG 배포 → 오케스트레이터(CSC-08 허브). 센터 컬럼.
  const controlColumn = (
    <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center">
      <motion.div {...rise(reduce, 0)} className="w-full">
        <DagFrontendNode pipeline={pipeline} locale={locale} />
      </motion.div>
      <motion.div {...rise(reduce, 1)}>
        <VerticalEdge label={pick(control.runLabel, locale)} phase={0} reduce={reduce} color="var(--cat-2)" />
      </motion.div>
      <motion.div {...rise(reduce, 2)}>
        <WorkflowNode pipeline={pipeline} locale={locale} />
      </motion.div>
    </div>
  );

  // 오케스트레이터 → 처리 단계: teal pgmq 드롭 (할당 SI-04 ↓ / 완료 SI-03 ↑) — 제어/데이터 플레인 연결
  const controlDrop = (
    <motion.div {...rise(reduce, 3)} className="relative flex justify-center py-1">
      <EventDrop tall reduce={reduce} />
      <span className={cn(chipCls, "absolute left-1/2 top-1/2 ml-5 -translate-y-1/2 whitespace-nowrap")} style={tealChipStyle}>
        {pick(control.busLabel, locale)}
      </span>
    </motion.div>
  );

  return (
    <div>
      <RowHeader pipeline={pipeline} locale={locale} />

      {/* ── lg+: 2-플레인 — 제어(콘솔→오케스트레이터) 위, 데이터 스파인 아래, pgmq 드롭으로 연결 ── */}
      <div className="hidden lg:block">
        {controlColumn}
        {controlDrop}
        <div className="grid items-stretch" style={{ gridTemplateColumns: gridCols }}>
          {pipeline.stages.map((stage, i) => (
            <Fragment key={i}>
              {i > 0 && (
                <motion.div {...rise(reduce, i * 2 + 3)} className="flex justify-center lg:self-center">
                  <Connector label={pick(pipeline.edges[i - 1].label, locale)} phase={(i - 1) * 0.45} reduce={reduce} />
                </motion.div>
              )}
              {stage.kind === "layer" ? (
                <motion.div {...rise(reduce, i * 2 + 4)} className="min-w-0">
                  <StageCard
                    stage={stage}
                    label={pick(stage.label, locale)}
                    icon={stage.icon}
                    locale={locale}
                    projectSlug={pipeline.projectSlug}
                  />
                </motion.div>
              ) : (
                <motion.div {...rise(reduce, i * 2 + 4)} className="flex justify-center lg:self-center">
                  <StagePill stage={stage} locale={locale} />
                </motion.div>
              )}
            </Fragment>
          ))}
        </div>
      </div>

      {/* ── lg 미만: 세로 폴백 — 콘솔 → 오케스트레이터 → (pgmq) → 단계 세로 스택 ── */}
      <div className="flex flex-col lg:hidden">
        {controlColumn}
        {controlDrop}
        {pipeline.stages.map((stage, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <motion.div {...rise(reduce, i * 2 + 4)}>
                <VerticalEdge label={pick(pipeline.edges[i - 1].label, locale)} phase={(i - 1) * 0.45} reduce={reduce} />
              </motion.div>
            )}
            <motion.div
              {...rise(reduce, i * 2 + 5)}
              className={stage.kind === "layer" ? "min-w-0" : "flex justify-center"}
            >
              {stage.kind === "layer" ? (
                <StageCard
                  stage={stage}
                  label={pick(stage.label, locale)}
                  icon={stage.icon}
                  locale={locale}
                  projectSlug={pipeline.projectSlug}
                />
              ) : (
                <StagePill stage={stage} locale={locale} />
              )}
            </motion.div>
          </Fragment>
        ))}
      </div>

      {pipeline.returnNote && <ReturnLane note={pipeline.returnNote} locale={locale} />}
    </div>
  );
}

/**
 * stack 변형 — him. 모바일 디바이스 프레임(노치+홈바) 속 세로 스택.
 * twin 엣지는 커맨드/쿼리 두 색 레인으로 갈라지고(CQRS), 푸시 환류는 프레임 *밖*
 * 점선 업 레인으로 — 푸시가 외부(FCM)에서 기기로 도착하는 모양 그대로.
 * lg+에서는 헤더·노트가 왼쪽, 디바이스가 오른쪽인 비대칭 배치.
 */
function StackRow({ pipeline, locale, reduce }: RowProps) {
  const items: ReactNode[] = [];
  pipeline.stages.forEach((stage, i) => {
    if (i > 0) {
      const edge = pipeline.edges[i - 1];
      items.push(
        <motion.div key={`e-${i}`} {...rise(reduce, i * 2 - 1)}>
          {edge.twin ? (
            <TwinLanes lanes={edge.twin} locale={locale} reduce={reduce} />
          ) : (
            <VerticalEdge label={pick(edge.label, locale)} phase={(i - 1) * 0.45} reduce={reduce} />
          )}
        </motion.div>
      );
    }
    items.push(
      <motion.div key={`s-${i}`} {...rise(reduce, i * 2)} className={stage.kind === "layer" ? "min-w-0" : "flex justify-center"}>
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
          <StagePill stage={stage} locale={locale} compact />
        )}
      </motion.div>
    );
  });

  return (
    <div>
      <RowHeader pipeline={pipeline} locale={locale} />
      {pipeline.returnNote && (
        <div className="mb-10 flex items-center gap-2">
          <span className="inline-block w-6 shrink-0 border-t border-dashed border-[var(--muted)]" />
          <span className="font-mono text-[10px] leading-relaxed text-[var(--muted)]">
            {pick(pipeline.returnNote, locale)}
          </span>
        </div>
      )}

      {/* 디바이스 여정 — xl+: 가로(파이프라인 →FCM→ 잠금화면 →탭→ 앱), 미만: 세로.
          xl+ 에서 items-stretch 로 세 기기 베젤 높이를 본체(가장 큼)에 맞춰 통일한다. */}
      <div className="flex flex-col items-center xl:flex-row xl:items-stretch xl:justify-center">
        {/* 본체 프레임 — 데이터 파이프라인. figure+caption 으로 옆 기기와 높이·라벨 대칭 */}
        <motion.div {...rise(reduce, 0)} className="w-full max-w-[17.5rem]">
          <figure className="flex h-full w-full flex-col items-center gap-2.5">
            <div className="relative flex w-full flex-1 flex-col rounded-[2.25rem] border-2 border-[var(--border)] bg-[var(--card)]/40 px-4 pb-4 pt-9">
              <span aria-hidden className="absolute left-1/2 top-3.5 h-1.5 w-14 -translate-x-1/2 rounded-full bg-[var(--border)]" />
              <div className="flex flex-col">{items}</div>
              <span aria-hidden className="mx-auto mt-4 block h-1 w-16 rounded-full bg-[var(--border)]" />
            </div>
            {pipeline.deviceCaption && (
              <figcaption className="text-center font-mono text-[10px] text-[var(--muted)]">
                {pick(pipeline.deviceCaption, locale)}
              </figcaption>
            )}
          </figure>
        </motion.div>

        {/* 잠금화면 — 푸시 도착 */}
        {pipeline.pushDevice && (
          <>
            <motion.div {...rise(reduce, 2)} className="hidden self-center xl:block">
              <PushLane label={pick(pipeline.pushDevice.laneLabel, locale)} reduce={reduce} />
            </motion.div>
            <motion.div {...rise(reduce, 2)} className="w-full xl:hidden">
              <PushLane label={pick(pipeline.pushDevice.laneLabel, locale)} vertical reduce={reduce} />
            </motion.div>
            <motion.div {...rise(reduce, 3)} className="w-full max-w-[17.5rem]">
              <LockDevice device={pipeline.pushDevice} locale={locale} />
            </motion.div>
          </>
        )}

        {/* 앱 대시보드 — 알림 탭 이후 */}
        {pipeline.appScreen && (
          <>
            <motion.div {...rise(reduce, 4)} className="hidden self-center xl:block">
              <PushLane label={pick(pipeline.appScreen.laneLabel, locale)} reduce={reduce} />
            </motion.div>
            <motion.div {...rise(reduce, 4)} className="w-full xl:hidden">
              <PushLane label={pick(pipeline.appScreen.laneLabel, locale)} vertical reduce={reduce} />
            </motion.div>
            <motion.div {...rise(reduce, 5)} className="w-full max-w-[17.5rem]">
              <AppDevice screen={pipeline.appScreen} locale={locale} />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

/** fleet 변형 — 가로 플레인 한 줄(제어/관측)을 compact 카드+커넥터로 렌더 (SpineRow 에코) */
function FleetPlane({
  stages,
  edges,
  locale,
  reduce,
  projectSlug,
}: {
  stages: PipelineStage[];
  edges: L[];
  locale: Locale;
  reduce: boolean;
  projectSlug: string;
}) {
  const gridCols = stages.map((s) => (s.kind === "layer" ? "minmax(0,1fr)" : "auto")).join(" auto ");
  const items: ReactNode[] = [];
  stages.forEach((stage, i) => {
    if (i > 0) {
      items.push(
        <div key={`c-${i}`} className="flex justify-center lg:self-center">
          <Connector label={pick(edges[i - 1], locale)} phase={(i - 1) * 0.45} reduce={reduce} />
        </div>
      );
    }
    items.push(
      <div key={`s-${i}`} className={stage.kind === "layer" ? "min-w-0" : "flex justify-center lg:self-center"}>
        {stage.kind === "layer" ? (
          <StageCard stage={stage} label={pick(stage.label, locale)} icon={stage.icon} locale={locale} projectSlug={projectSlug} compact />
        ) : (
          <StagePill stage={stage} locale={locale} compact />
        )}
      </div>
    );
  });
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col lg:grid lg:items-stretch" style={{ gridTemplateColumns: gridCols }}>
      {items}
    </div>
  );
}

/** fleet 변형 — 운영 대상(노드들)을 하나로 묶은 그룹 박스 (점선 테두리 = 한 클러스터) */
function FleetGroupBox({
  node,
  locale,
  projectSlug,
}: {
  node: NonNullable<Pipeline["fleet"]>["node"];
  locale: Locale;
  projectSlug: string;
}) {
  return (
    <Link
      href={`/projects/${projectSlug}`}
      style={{
        borderColor: "color-mix(in oklch, var(--cat-3) 50%, var(--border))",
        backgroundColor: "color-mix(in oklch, var(--cat-3) 6%, var(--card))",
      }}
      className="group/fleet mx-auto flex w-full max-w-lg flex-col gap-3 rounded-2xl border-2 border-dashed px-5 py-4 transition-all duration-300 hover:ring-2 hover:ring-[var(--accent)]/40"
    >
      <div className="flex items-center gap-2.5">
        <span className="text-xl leading-none">{node.icon}</span>
        <span className="flex min-w-0 flex-col">
          <span className="break-keep text-[15px] font-semibold leading-tight">{pick(node.label, locale)}</span>
          <span className="break-keep font-mono text-[10px] leading-tight text-[var(--muted)]">{pick(node.sublabel, locale)}</span>
        </span>
        <ArrowUpRight className="ml-auto size-3.5 shrink-0 text-[var(--accent)] opacity-0 transition-all group-hover/fleet:opacity-100" />
      </div>
      <div className="flex flex-wrap gap-2">
        {node.chips.map((c, i) => (
          <span
            key={i}
            className="break-keep rounded-md border px-2 py-0.5 font-mono text-[11px] leading-tight text-[var(--muted)]"
            style={{
              borderColor: "color-mix(in oklch, var(--cat-3) 30%, var(--border))",
              backgroundColor: "color-mix(in oklch, var(--cat-3) 8%, var(--card))",
            }}
          >
            {pick(c, locale)}
          </span>
        ))}
      </div>
    </Link>
  );
}

/**
 * fleet 변형 — 인프라 운영. 제어 플레인(운영자→Semaphore→Ansible)이 위에서 Fleet를 구성(push),
 * Fleet 그룹 박스가 가운데 묶이고, 관측 플레인(Prometheus→Grafana)이 아래서 metrics를 긁어 올린다(pull).
 */
function FleetRow({ pipeline, locale, reduce }: RowProps) {
  const f = pipeline.fleet!;
  return (
    <div>
      <RowHeader pipeline={pipeline} locale={locale} />
      <motion.div {...rise(reduce, 0)}>
        <FleetPlane stages={f.control} edges={f.controlEdges} locale={locale} reduce={reduce} projectSlug={pipeline.projectSlug} />
      </motion.div>
      <motion.div {...rise(reduce, 1)} className="flex justify-center">
        <VerticalEdge label={pick(f.pushLabel, locale)} phase={0} reduce={reduce} color="var(--cat-1)" />
      </motion.div>
      <motion.div {...rise(reduce, 2)}>
        <FleetGroupBox node={f.node} locale={locale} projectSlug={pipeline.projectSlug} />
      </motion.div>
      <motion.div {...rise(reduce, 3)} className="flex justify-center">
        <VerticalEdge label={pick(f.scrapeLabel, locale)} phase={0} reduce={reduce} color="var(--cat-6)" />
      </motion.div>
      <motion.div {...rise(reduce, 4)}>
        <FleetPlane stages={f.observe} edges={f.observeEdges} locale={locale} reduce={reduce} projectSlug={pipeline.projectSlug} />
      </motion.div>
      {pipeline.returnNote && <ReturnLane note={pipeline.returnNote} locale={locale} />}
    </div>
  );
}

/** 변형 디스패치 */
function PipelineRow(props: RowProps) {
  if (props.pipeline.variant === "orchestration") return <OrchestrationRow {...props} />;
  if (props.pipeline.variant === "stack") return <StackRow {...props} />;
  if (props.pipeline.variant === "fleet") return <FleetRow {...props} />;
  return <SpineRow {...props} />;
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
            <PipelineRow key={p.id} pipeline={p} locale={locale} reduce={reduce} />
          ))}
        </div>
      </div>
    </section>
  );
}
