"use client";

/**
 * diagram-flow — ProjectDiagram / PlatformDiagram 공용 React Flow 프리미티브.
 * 카드 노드(DiagramCard)·흐름 엣지(FlowEdge)·그리드 상수·엣지 빌더를 공유한다.
 * 레이아웃은 col/row 그리드를 x/y로 매핑해 결정적.
 */

import { Fragment, memo, useEffect, useRef, useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeProps,
  type EdgeProps,
} from "@xyflow/react";
import { useReducedMotion } from "framer-motion";
import { pick } from "@/data/i18n";
import type { Locale } from "@/i18n/routing";
import type { DiagramEdge, DiagramSide } from "@/data/projects";
import { cn } from "@/lib/utils";

// 그리드 → 픽셀 매핑 (fitView가 컨테이너에 맞춰 스케일)
// 간격을 넉넉히 — 선이 길어져 흐름·glow가 잘 보인다
export const COL_W = 320;
export const ROW_H = 200;

// 엣지 색 — SVG marker는 CSS 변수 해석이 불안정해 라이트/다크 양쪽에 읽히는 리터럴 사용
export const ACCENT = "#f59e0b";
export const MUTED = "#a8a29e";
// 제어 평면(이벤트·오케스트레이션) 엣지 — SVG marker는 CSS 변수 해석이 불안정해 teal 리터럴 사용
export const CONTROL = "#14b8a6";

export type CardKind = "layer" | "external" | "actor";
export type CardData = {
  label: string;
  sublabel?: string;
  icon?: string;
  kind: CardKind;
  cat?: number;
  // 통합 캔버스 전용: 하위 다이어그램으로 드릴인 가능한 노드 표시
  drillable?: boolean;
  drillHint?: string;
  onActivate?: () => void;
};

export type FlowEdgeData = { primary?: boolean; phase?: number; dim?: boolean };

const SIDES: DiagramSide[] = ["top", "right", "bottom", "left"];
const POS: Record<DiagramSide, Position> = {
  top: Position.Top,
  right: Position.Right,
  bottom: Position.Bottom,
  left: Position.Left,
};

const hiddenHandle = {
  opacity: 0,
  width: 1,
  height: 1,
  minWidth: 0,
  minHeight: 0,
  border: 0,
  background: "transparent",
} as const;

export function DiagramCard({ data }: NodeProps<Node<CardData>>) {
  const isLayer = data.kind === "layer";
  const isActor = data.kind === "actor";
  const isExternal = data.kind === "external";
  const catColor = data.cat ? `var(--cat-${data.cat})` : null;

  // status dot 색: layer=카테고리색, actor=accent, external=muted (maple식 상태 점)
  const dotColor = catColor ?? (isActor ? "var(--accent)" : "var(--muted)");
  // layer 식별색: 평면 유지(ring·shadow 없음) — 카테고리 보더 + 7% 틴트 배경
  const cardStyle =
    isLayer && catColor
      ? {
          borderColor: `color-mix(in oklch, ${catColor} 55%, var(--border))`,
          backgroundColor: `color-mix(in oklch, ${catColor} 7%, var(--card))`,
        }
      : undefined;

  return (
    <div
      onClick={
        data.drillable && data.onActivate
          ? (e) => {
              e.stopPropagation();
              data.onActivate!();
            }
          : undefined
      }
      style={
        data.drillable
          ? { ...cardStyle, pointerEvents: "auto", cursor: "pointer" }
          : cardStyle
      }
      className={cn(
        "relative w-[224px] rounded-lg border text-left",
        isLayer && !catColor && "bg-[var(--card)] border-[var(--accent)]/45",
        isActor &&
          "bg-[var(--foreground)] text-[var(--background)] border-transparent",
        isExternal && "bg-[var(--subtle)] border-dashed border-[var(--border)]",
        // 드릴 가능 노드: 클릭 어포던스 (포인터 + accent ring + hover 강조)
        data.drillable &&
          "cursor-pointer ring-1 ring-[var(--accent)]/45 transition-all hover:ring-2 hover:ring-[var(--accent)]"
      )}
    >
      {/* 4면 × (source + target) 핸들 — 표시 전용, 숨김 */}
      {SIDES.map((side) => (
        <Fragment key={side}>
          <Handle
            id={`${side}-s`}
            type="source"
            position={POS[side]}
            isConnectable={false}
            style={hiddenHandle}
          />
          <Handle
            id={`${side}-t`}
            type="target"
            position={POS[side]}
            isConnectable={false}
            style={hiddenHandle}
          />
        </Fragment>
      ))}

      {/* header — 상태 점 + 아이콘 + 이름 */}
      <div className="flex items-center gap-2 px-3 py-2">
        <span
          className="size-1.5 shrink-0 rounded-full"
          style={{ background: dotColor }}
        />
        {data.icon && (
          <span className="text-[13px] leading-none">{data.icon}</span>
        )}
        <span
          className={cn(
            "font-semibold text-[12.5px] leading-tight",
            !isActor && "text-[var(--foreground)]"
          )}
        >
          {data.label}
        </span>
      </div>

      {/* detail — 구분선 아래 mono 디테일 (maple 메트릭 행 느낌) */}
      {data.sublabel && (
        <div
          className={cn(
            "border-t px-3 py-1.5 text-[10px] font-mono leading-snug",
            isActor
              ? "border-white/15 opacity-70"
              : "border-[var(--border)]/60 text-[var(--muted)]"
          )}
        >
          {data.sublabel}
        </div>
      )}

      {/* drill 어포던스 — 하위 다이어그램으로 줌인 가능 표시 */}
      {data.drillable && data.drillHint && (
        <div className="flex items-center gap-1 border-t border-[var(--accent)]/30 px-3 py-1.5 text-[10px] font-mono text-[var(--accent)]">
          <span className="leading-none">🔍</span>
          <span className="leading-tight">{data.drillHint}</span>
        </div>
      )}
    </div>
  );
}

// 흐름 점(데이터 패킷) 서브트리 — memo로 격리.
// cx/cy 없는 circle은 SMIL animateMotion이 적용 안 되는 순간 (0,0)에 그려진다.
// 엣지가 포커스 dim 등으로 리렌더돼도 path/dotCount/durSec/phase/primary가 그대로면
// 이 컴포넌트는 리렌더되지 않아 animateMotion이 재시작(→ (0,0) 깜빡임)되지 않는다.
const FlowDots = memo(function FlowDots({
  path,
  dotCount,
  durSec,
  phase,
  primary,
}: {
  path: string;
  dotCount: number;
  durSec: number;
  phase: number;
  primary: boolean;
}) {
  return (
    <>
      {Array.from({ length: dotCount }).map((_, k) => {
        // 점들을 경로상 균등 간격으로 + 엣지별 위상차로 desync (음수 begin)
        const begin = `-${(durSec * (k / dotCount) + phase).toFixed(2)}s`;
        return (
          <g key={k}>
            {/* halo */}
            <circle r={primary ? 6 : 4} fill="var(--foreground)" opacity={0.1}>
              <animateMotion
                dur={`${durSec}s`}
                begin={begin}
                repeatCount="indefinite"
                path={path}
              />
            </circle>
            {/* core */}
            <circle
              r={primary ? 2.8 : 2}
              fill="var(--foreground)"
              opacity={primary ? 0.9 : 0.55}
            >
              <animateMotion
                dur={`${durSec}s`}
                begin={begin}
                repeatCount="indefinite"
                path={path}
              />
            </circle>
          </g>
        );
      })}
    </>
  );
});

// 라인 경로를 따라 흐르는 흰 점(데이터 패킷) — maple Service Map 스타일.
// 색은 var(--foreground)로 적응(다크=흰·라이트=검). prefers-reduced-motion이면 점 생략.
export function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  label,
  data,
}: EdgeProps<Edge<FlowEdgeData>>) {
  const reduce = useReducedMotion();
  // 좌표를 정수로 고정 → 포커스 리렌더 시 React Flow가 끝점을 서브픽셀로 재계산해도
  // edgePath 문자열이 그대로 유지된다(아래 흐름 점 SMIL의 무의미한 재시작·깜빡임 방지).
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX: Math.round(sourceX),
    sourceY: Math.round(sourceY),
    sourcePosition,
    targetX: Math.round(targetX),
    targetY: Math.round(targetY),
    targetPosition,
  });
  // 라벨을 선 위가 아니라 선 옆으로 살짝 비켜서 배치 → 선이 라벨에 가리지 않는다.
  // 엣지가 가로 우세면 위로, 세로 우세면 옆으로 오프셋 (직각 경로 기준 근사).
  const horizontalDominant =
    Math.abs(targetX - sourceX) >= Math.abs(targetY - sourceY);
  const labelOffX = horizontalDominant ? 0 : 13;
  const labelOffY = horizontalDominant ? -13 : 0;
  const primary = !!data?.primary;
  const phase = data?.phase ?? 0;
  const dim = !!data?.dim; // 포커스 트레이싱 시 비관련 엣지 흐리기
  const strokeColor = (style?.stroke as string) ?? "var(--foreground)";
  // 실제 경로 길이를 측정(getTotalLength) → 모든 엣지 동일 속도(px/s)·동일 점 간격.
  // (Manhattan 근사는 라우팅 우회 때문에 오차가 커서 실측 사용)
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = useState(0);
  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength());
  }, [edgePath]);
  const durSec = pathLen > 0 ? Math.max(1, pathLen / 100) : 2; // 100 px/s 고정 속도
  const dotCount =
    pathLen > 0 ? Math.min(7, Math.max(1, Math.round(pathLen / 78))) : 2; // ~78px 간격

  return (
    <>
      {/* glow underlay — 같은 색의 두껍고 흐린 라인으로 네온 글로우 (+ 길이 측정용 ref) */}
      <path
        ref={pathRef}
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={primary ? 7 : 5}
        strokeOpacity={0.35}
        strokeLinecap="round"
        style={{ filter: "blur(3px)" }}
      />
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      {!reduce && (
        <FlowDots
          path={edgePath}
          dotCount={dotCount}
          durSec={durSec}
          phase={phase}
          primary={primary}
        />
      )}
      {label && (
        <EdgeLabelRenderer>
          <div
            className={cn("nodrag nopan rf-edge-label", dim && "rf-dim")}
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX + labelOffX}px, ${labelY + labelOffY}px)`,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              lineHeight: 1.2,
              color: "var(--foreground)",
              background: "var(--card)",
              border: "1px solid var(--border)",
              padding: "2px 6px",
              borderRadius: 5,
              boxShadow: "0 1px 4px rgba(0,0,0,0.28)",
              // 라벨을 선·점 애니메이션 위로 올려 가독성 확보 (불투명)
              zIndex: 10,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

/**
 * DiagramEdge[] → React Flow Edge[]. prefix를 주면 source/target id와 edge id에
 * `${prefix}__` / `${prefix}` 네임스페이스를 붙여 여러 클러스터를 한 캔버스에서 충돌 없이 합칠 수 있다.
 */
export function buildFlowEdges(
  edges: DiagramEdge[],
  locale: Locale,
  prefix = ""
): Edge<FlowEdgeData>[] {
  const p = prefix ? `${prefix}__` : "";
  return edges.map((e, i) => {
    const control = e.kind === "control";
    const isPrimary = e.kind === "primary";
    const heavy = isPrimary || control; // 제어·정방향은 굵게/밝게
    const color = control ? CONTROL : isPrimary ? ACCENT : MUTED;
    return {
      id: `e-${prefix}-${i}-${e.from}-${e.to}`,
      source: `${p}${e.from}`,
      target: `${p}${e.to}`,
      sourceHandle: `${e.fromSide ?? "bottom"}-s`,
      targetHandle: `${e.toSide ?? "top"}-t`,
      type: "flow",
      label: e.label ? pick(e.label, locale) : undefined,
      markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
      style: {
        stroke: color,
        strokeWidth: heavy ? 2 : 1.5,
        strokeDasharray: e.dashed ? "6 5" : undefined,
      },
      data: {
        primary: heavy,
        phase: (i % 5) * 0.5, // 엣지마다 위상차로 흐름 desync
      },
    };
  });
}
