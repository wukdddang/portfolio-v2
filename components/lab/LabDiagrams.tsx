"use client";

/**
 * LabDiagrams — 통합 다이어그램 실험 (프로덕션 아님, /diagram-lab 전용).
 *
 * ① MergedDiagram  — 4개 다이어그램을 한 평면에 펼치고 레이어 간 다리 엣지로 연결 (flat).
 * ② NestedDiagram  — React Flow parent/child 서브플로우로 레이어 박스 *안에* 하위
 *                    다이어그램을 중첩 (Patrick's Parabox식). 박스 클릭 → 그 안으로 줌인.
 *
 * DiagramCard·FlowEdge·buildFlowEdges 등은 components/diagram-flow.tsx 재사용.
 */

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeProps,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { pick, type L } from "@/data/i18n";
import type { Project, DiagramNode } from "@/data/projects";
import {
  COL_W,
  ROW_H,
  ACCENT,
  MUTED,
  DiagramCard,
  FlowEdge,
  buildFlowEdges,
  type CardData,
} from "@/components/diagram-flow";

// 레이어 좌→우(평면) / 위→아래(중첩) 배치 순서 (요청 흐름: 프론트 → 저장 → 분석)
const ORDER = ["sar-search-and-analyzer", "sar-data-retrieval", "lumir-linux-snap"];
const CARD_W = 224;
const CARD_H = 100;

function cardData(n: DiagramNode, locale: Locale): CardData {
  return {
    label: pick(n.label, locale),
    sublabel: n.sublabel ? pick(n.sublabel, locale) : undefined,
    icon: n.icon,
    kind: n.kind ?? "layer",
    cat: n.cat,
  };
}

type BridgeOpts = {
  kind?: "primary" | "secondary";
  fromSide?: string;
  toSide?: string;
  dashed?: boolean;
  label?: L;
};

function bridgeEdge(
  id: string,
  source: string,
  target: string,
  i: number,
  opts: BridgeOpts,
  locale: Locale
): Edge {
  const primary = opts.kind === "primary";
  const color = primary ? ACCENT : MUTED;
  return {
    id,
    source,
    target,
    sourceHandle: `${opts.fromSide ?? "bottom"}-s`,
    targetHandle: `${opts.toSide ?? "top"}-t`,
    type: "flow",
    label: opts.label ? pick(opts.label, locale) : undefined,
    markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
    style: {
      stroke: color,
      strokeWidth: primary ? 2 : 1.5,
      strokeDasharray: opts.dashed ? "6 5" : undefined,
    },
    data: { primary, phase: (i % 5) * 0.4 },
  };
}

// ===========================================================================
// ① 평면 통합 (flat 4-in-1)
// ===========================================================================

const BAND_GAP = 340;

function buildMerged(project: Project, locale: Locale) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const subs = project.subProjects ?? [];
  const bySlug = new Map(subs.map((s) => [s.slug, s]));

  let cursorY = 0;
  for (const slug of ORDER) {
    const sub = bySlug.get(slug);
    if (!sub?.diagram) continue;
    const dia = sub.diagram;
    const maxCol = Math.max(...dia.nodes.map((n) => n.col));
    const maxRow = Math.max(...dia.nodes.map((n) => n.row));
    const w = maxCol * COL_W + CARD_W;
    const offX = -w / 2; // 밴드를 x=0 기준 가운데 정렬

    for (const n of dia.nodes) {
      nodes.push({
        id: `${slug}__${n.id}`,
        type: "card",
        position: { x: offX + n.col * COL_W, y: cursorY + n.row * ROW_H },
        draggable: false,
        selectable: false,
        data: cardData(n, locale),
      });
    }
    edges.push(...buildFlowEdges(dia.edges, locale, slug));
    cursorY += maxRow * ROW_H + CARD_H + BAND_GAP;
  }

  // 레이어 간 다리 (hero 흐름을 구체 노드에 매핑)
  const F = "sar-search-and-analyzer";
  const S = "sar-data-retrieval";
  const A = "lumir-linux-snap";
  const bridges: [string, string, BridgeOpts][] = [
    [`${F}__bff`, `${S}__retrieval`, { kind: "primary", label: { ko: "② 검색 질의", en: "② query" } }],
    [`${S}__retrieval`, `${A}__dashboard`, { kind: "primary", dashed: true, label: { ko: "③ 신규 분석", en: "③ analyze" } }],
    [`${A}__db`, `${S}__db`, { kind: "secondary", fromSide: "right", toSide: "right", label: { ko: "④ 결과 저장", en: "④ write-back" } }],
    [`${S}__retrieval`, `${F}__bff`, { kind: "secondary", dashed: true, fromSide: "left", toSide: "left", label: { ko: "⑤ 응답", en: "⑤ response" } }],
  ];
  bridges.forEach(([source, target, opts], i) =>
    edges.push(bridgeEdge(`bridge-${i}`, source, target, i, opts, locale))
  );

  return { nodes, edges };
}

const mergedNodeTypes = { card: DiagramCard };
const flowEdgeTypes = { flow: FlowEdge };

export function MergedDiagram({ project }: { project: Project }) {
  const locale = useLocale() as Locale;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { nodes, edges } = useMemo(
    () => buildMerged(project, locale),
    [project, locale]
  );

  return (
    <div className="h-[600px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] md:h-[760px]">
      {mounted && (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={mergedNodeTypes}
          edgeTypes={flowEdgeTypes}
          colorMode="system"
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.08}
          maxZoom={1.8}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={true}
          panOnScroll={false}
          zoomOnDoubleClick={false}
          panOnDrag
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1} />
          <Controls showInteractive={false} position="bottom-right" />
        </ReactFlow>
      )}
    </div>
  );
}

// ===========================================================================
// ② 중첩 (Patrick's Parabox식 — 레이어 박스 안에 하위 다이어그램)
// ===========================================================================

const ICOL = 340; // 박스 내부 열 간격 (엣지가 원래 ~320 간격에 맞춰 설계됨)
const IROW = 210; // 박스 내부 행 간격
const BPAD = 60; // 박스 내부 여백
const BHEAD = 56; // 박스 헤더 높이
const BGAP = 240; // 박스 간 세로 간격

type BoxData = { label: string; icon?: string };

const BOX_SIDES = ["top", "right", "bottom", "left"] as const;
const BOX_POS: Record<string, Position> = {
  top: Position.Top,
  right: Position.Right,
  bottom: Position.Bottom,
  left: Position.Left,
};
const hiddenHandle = {
  opacity: 0,
  width: 1,
  height: 1,
  border: 0,
  background: "transparent",
} as const;

function LayerBox({ data }: NodeProps<Node<BoxData>>) {
  return (
    <div className="h-full w-full overflow-hidden rounded-2xl border-2 border-[var(--accent)]/55 bg-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.22)] transition-colors hover:border-[var(--accent)]/90">
      {BOX_SIDES.map((s) => (
        <Fragment key={s}>
          <Handle id={`${s}-s`} type="source" position={BOX_POS[s]} isConnectable={false} style={hiddenHandle} />
          <Handle id={`${s}-t`} type="target" position={BOX_POS[s]} isConnectable={false} style={hiddenHandle} />
        </Fragment>
      ))}
      <div className="flex items-center gap-2 border-b-2 border-[var(--accent)]/30 bg-[var(--accent)]/12 px-4 py-3">
        {data.icon && <span className="text-lg leading-none">{data.icon}</span>}
        <span className="font-mono text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
          {data.label}
        </span>
        <span className="ml-auto font-mono text-[10px] text-[var(--muted)]">
          🔍 클릭하여 진입
        </span>
      </div>
    </div>
  );
}

const nestedNodeTypes = { card: DiagramCard, layerBox: LayerBox };

function buildNested(project: Project, locale: Locale) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const subs = project.subProjects ?? [];
  const bySlug = new Map(subs.map((s) => [s.slug, s]));
  const boxChildren: Record<string, string[]> = {};
  const boxIds: Record<string, string> = {};

  let cursorY = 0;
  for (const slug of ORDER) {
    const sub = bySlug.get(slug);
    if (!sub?.diagram) continue;
    const dia = sub.diagram;
    const maxCol = Math.max(...dia.nodes.map((n) => n.col));
    const maxRow = Math.max(...dia.nodes.map((n) => n.row));
    const w = maxCol * ICOL + CARD_W + BPAD * 2;
    const h = maxRow * IROW + CARD_H + BPAD * 2 + BHEAD;
    const boxId = `box__${slug}`;
    boxIds[slug] = boxId;

    // parent box (자식보다 먼저 push)
    nodes.push({
      id: boxId,
      type: "layerBox",
      position: { x: -w / 2, y: cursorY }, // x=0 기준 가운데 정렬 (세로 스파인)
      style: { width: w, height: h },
      draggable: false,
      selectable: false,
      zIndex: 0,
      data: {
        label: sub.layerLabel ? pick(sub.layerLabel, locale) : slug,
        icon: sub.layerIcon,
      },
    });

    const childIds: string[] = [];
    for (const n of dia.nodes) {
      const id = `${slug}__${n.id}`;
      childIds.push(id);
      nodes.push({
        id,
        type: "card",
        parentId: boxId,
        extent: "parent",
        position: { x: BPAD + n.col * ICOL, y: BHEAD + BPAD + n.row * IROW },
        draggable: false,
        selectable: false,
        zIndex: 1,
        data: cardData(n, locale),
      });
    }
    edges.push(...buildFlowEdges(dia.edges, locale, slug));
    boxChildren[boxId] = childIds;
    cursorY += h + BGAP;
  }

  // 박스 ↔ 박스 (레이어 단위 흐름) + 진입 노드 보조선 (그 안 어느 노드가 받는지)
  const interFlow: {
    from: string;
    to: string;
    entry: string;
    label: L;
    kind: "primary" | "secondary";
    dashed?: boolean;
    fromSide?: string;
    toSide?: string;
  }[] = [
    { from: "sar-search-and-analyzer", to: "sar-data-retrieval", entry: "api", label: { ko: "② 검색 질의", en: "② query" }, kind: "primary" },
    { from: "sar-data-retrieval", to: "lumir-linux-snap", entry: "dashboard", label: { ko: "③ 신규 분석", en: "③ analyze" }, kind: "primary", dashed: true },
    { from: "lumir-linux-snap", to: "sar-data-retrieval", entry: "snap", label: { ko: "④ 결과 저장", en: "④ write-back" }, kind: "secondary", fromSide: "right", toSide: "right" },
    { from: "sar-data-retrieval", to: "sar-search-and-analyzer", entry: "bff", label: { ko: "⑤ 응답", en: "⑤ response" }, kind: "secondary", dashed: true, fromSide: "left", toSide: "left" },
  ];
  interFlow.forEach((f, i) => {
    const sBox = boxIds[f.from];
    const tBox = boxIds[f.to];
    if (!sBox || !tBox) return;
    const primary = f.kind === "primary";
    const color = primary ? ACCENT : MUTED;
    const fromSide = f.fromSide ?? "bottom";
    const toSide = f.toSide ?? "top";
    // ⓐ box → box (레이어 단위 흐름, 라벨)
    edges.push({
      id: `box-bridge-${i}`,
      source: sBox,
      target: tBox,
      sourceHandle: `${fromSide}-s`,
      targetHandle: `${toSide}-t`,
      type: "flow",
      label: pick(f.label, locale),
      markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
      style: { stroke: color, strokeWidth: primary ? 2 : 1.5, strokeDasharray: f.dashed ? "6 5" : undefined },
      data: { primary, phase: i * 0.4 },
    });
    // ⓑ box → 진입 노드 (그 안 어느 노드가 데이터를 받는지 명시)
    edges.push({
      id: `box-entry-${i}`,
      source: sBox,
      target: `${f.to}__${f.entry}`,
      sourceHandle: `${fromSide}-s`,
      targetHandle: `${toSide}-t`,
      type: "flow",
      markerEnd: { type: MarkerType.ArrowClosed, color, width: 12, height: 12 },
      style: { stroke: color, strokeWidth: 1.25, strokeDasharray: "2 5", opacity: 0.9 },
      data: { primary: false, phase: i * 0.4 + 0.25 },
    });
  });

  return { nodes, edges, boxChildren };
}

const NESTED_STR = {
  reset: { ko: "전체 보기", en: "Overview" },
  hint: {
    ko: "🔍 레이어 박스를 클릭하면 그 안으로 줌인",
    en: "🔍 Click a layer box to zoom inside",
  },
} satisfies Record<string, L>;

export function NestedDiagram({ project }: { project: Project }) {
  const locale = useLocale() as Locale;
  const [mounted, setMounted] = useState(false);
  const rfRef = useRef<ReactFlowInstance | null>(null);
  const boxChildrenRef = useRef<Record<string, string[]>>({});
  useEffect(() => setMounted(true), []);

  const { nodes, edges, boxChildren } = useMemo(
    () => buildNested(project, locale),
    [project, locale]
  );
  boxChildrenRef.current = boxChildren;

  const enter = (boxId: string) => {
    const ids = [boxId, ...(boxChildrenRef.current[boxId] ?? [])];
    rfRef.current?.fitView({
      nodes: ids.map((id) => ({ id })),
      duration: 700,
      padding: 0.12,
    });
  };
  const reset = () => rfRef.current?.fitView({ duration: 700, padding: 0.15 });

  return (
    <div className="h-[600px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] md:h-[760px]">
      {mounted && (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nestedNodeTypes}
          edgeTypes={flowEdgeTypes}
          colorMode="system"
          minZoom={0.08}
          maxZoom={1.8}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={true}
          panOnScroll={false}
          zoomOnDoubleClick={false}
          panOnDrag
          onInit={(instance) => {
            rfRef.current = instance;
            const fit = () => instance.fitView({ padding: 0.15, duration: 0 });
            requestAnimationFrame(() => requestAnimationFrame(fit));
            setTimeout(fit, 200);
          }}
          onNodeClick={(_, node) => {
            if (node.type === "layerBox") enter(node.id);
          }}
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1} />
          <Controls showInteractive={false} showFitView={false} position="bottom-right" />
          <Panel position="top-left">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 font-mono text-[11px] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              <span aria-hidden>⌂</span>
              {pick(NESTED_STR.reset, locale)}
            </button>
          </Panel>
          <Panel position="top-right">
            <span className="hidden font-mono text-[10px] text-[var(--muted)] sm:block">
              {pick(NESTED_STR.hint, locale)}
            </span>
          </Panel>
        </ReactFlow>
      )}
    </div>
  );
}
