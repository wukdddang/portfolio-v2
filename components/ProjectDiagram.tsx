"use client";

/**
 * ProjectDiagram — 프로젝트 아키텍처/데이터플로우 다이어그램 (React Flow)
 * data/projects.ts 의 `diagram` 필드(bilingual)를 받아 인터랙티브 그래프로 렌더.
 * 서버 컴포넌트(상세 페이지)에서 'use client' 아일랜드로 주입한다.
 * 레이아웃은 col/row 그리드를 x/y로 매핑해 결정적이며, 다크모드는 colorMode="system".
 */

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  BaseEdge,
  Controls,
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
import "@xyflow/react/dist/style.css";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { pick } from "@/data/i18n";
import type {
  ProjectDiagram as ProjectDiagramData,
  DiagramSide,
} from "@/data/projects";
import { cn } from "@/lib/utils";

// 그리드 → 픽셀 매핑 (fitView가 컨테이너에 맞춰 스케일)
// 간격을 넉넉히 — 선이 길어져 흐름·glow가 잘 보인다
const COL_W = 320;
const ROW_H = 200;

// 엣지 색 — SVG marker는 CSS 변수 해석이 불안정해 라이트/다크 양쪽에 읽히는 리터럴 사용
const ACCENT = "#f59e0b";
const MUTED = "#a8a29e";

type CardKind = "layer" | "external" | "actor";
type CardData = {
  label: string;
  sublabel?: string;
  icon?: string;
  kind: CardKind;
  cat?: number;
};

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

function DiagramCard({ data }: NodeProps<Node<CardData>>) {
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
      style={cardStyle}
      className={cn(
        "relative w-[224px] rounded-lg border text-left",
        isLayer && !catColor && "bg-[var(--card)] border-[var(--accent)]/45",
        isActor &&
          "bg-[var(--foreground)] text-[var(--background)] border-transparent",
        isExternal && "bg-[var(--subtle)] border-dashed border-[var(--border)]"
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
    </div>
  );
}

const nodeTypes = { card: DiagramCard };

type FlowEdgeData = { primary?: boolean; phase?: number };

// 라인 경로를 따라 흐르는 흰 점(데이터 패킷) — maple Service Map 스타일.
// 색은 var(--foreground)로 적응(다크=흰·라이트=검). prefers-reduced-motion이면 점 생략.
function FlowEdge({
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
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const primary = !!data?.primary;
  const phase = data?.phase ?? 0;
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
      {!reduce &&
        Array.from({ length: dotCount }).map((_, k) => {
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
                  path={edgePath}
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
                  path={edgePath}
                />
              </circle>
            </g>
          );
        })}
      {label && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              lineHeight: 1.2,
              color: "var(--foreground)",
              background: "var(--card)",
              padding: "1px 5px",
              borderRadius: 4,
              opacity: 0.92,
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

const edgeTypes = { flow: FlowEdge };

function buildGraph(diagram: ProjectDiagramData, locale: Locale) {
  const nodes: Node<CardData>[] = diagram.nodes.map((n) => ({
    id: n.id,
    type: "card",
    position: { x: n.col * COL_W, y: n.row * ROW_H },
    draggable: false,
    selectable: false,
    data: {
      label: pick(n.label, locale),
      sublabel: n.sublabel ? pick(n.sublabel, locale) : undefined,
      icon: n.icon,
      kind: n.kind ?? "layer",
      cat: n.cat,
    },
  }));

  const edges: Edge[] = diagram.edges.map((e, i) => {
    const primary = e.kind === "primary";
    const color = primary ? ACCENT : MUTED;
    return {
      id: `e-${i}-${e.from}-${e.to}`,
      source: e.from,
      target: e.to,
      sourceHandle: `${e.fromSide ?? "bottom"}-s`,
      targetHandle: `${e.toSide ?? "top"}-t`,
      type: "flow",
      label: e.label ? pick(e.label, locale) : undefined,
      markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
      style: {
        stroke: color,
        strokeWidth: primary ? 2 : 1.5,
        strokeDasharray: e.dashed ? "6 5" : undefined,
      },
      data: {
        primary,
        phase: (i % 5) * 0.5, // 엣지마다 위상차로 흐름 desync
      },
    };
  });

  return { nodes, edges };
}

export function ProjectDiagram({ diagram }: { diagram: ProjectDiagramData }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("projectDetail");
  // colorMode="system"는 서버(light)/클라(dark) 하이드레이션 불일치를 유발.
  // 다이어그램은 SEO 불필요한 인터랙티브 아일랜드 → 마운트 후 클라이언트 전용 렌더.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { nodes, edges } = useMemo(
    () => buildGraph(diagram, locale),
    [diagram, locale]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mb-12 space-y-3"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
          {t("architecture")}
        </div>
        <div className="hidden text-[10px] font-mono text-[var(--muted)] sm:block">
          {t("diagramHint")}
        </div>
      </div>

      <div className="h-[520px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] md:h-[640px]">
        {mounted ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            colorMode="system"
            fitView
            fitViewOptions={{ padding: 0.16 }}
            onInit={(instance) => {
              // 커스텀 노드 측정 완료 후 재-fit (초기 fitView 타이밍 보정)
              requestAnimationFrame(() =>
                requestAnimationFrame(() =>
                  instance.fitView({ padding: 0.16 })
                )
              );
            }}
            minZoom={0.4}
            maxZoom={1.6}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            zoomOnScroll={false}
            panOnScroll={false}
            zoomOnDoubleClick={false}
            panOnDrag
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1} />
            <Controls showInteractive={false} position="bottom-right" />
          </ReactFlow>
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">
            {t("architecture")}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-mono text-[var(--muted)]">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-0.5 w-6 rounded"
            style={{ background: ACCENT }}
          />
          {t("legendForward")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block w-6 border-t border-dashed"
            style={{ borderColor: MUTED }}
          />
          {t("legendReturn")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded border border-dashed border-[var(--border)] bg-[var(--subtle)]" />
          {t("legendExternal")}
        </span>
      </div>

      {diagram.caption && (
        <p className="max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
          {pick(diagram.caption, locale)}
        </p>
      )}
    </motion.div>
  );
}
