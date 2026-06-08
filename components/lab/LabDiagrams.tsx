"use client";

/**
 * LabDiagrams — 평면 통합 다이어그램 실험 (프로덕션 아님, /diagram-lab 전용).
 *
 * MergedDiagram — 4개 다이어그램을 한 평면에 펼치고 레이어 간 다리 엣지로 연결 (flat).
 *
 * 중첩(Patrick's Parabox식) 변형은 정식 컴포넌트 components/PlatformDiagram.tsx로
 * 승격되었다. /diagram-lab은 그 PlatformDiagram을 직접 렌더해 "평면 vs 중첩"을 비교한다.
 *
 * DiagramCard·FlowEdge·buildFlowEdges 등은 components/diagram-flow.tsx 재사용.
 */

import { useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  type Node,
  type Edge,
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

// 레이어 좌→우(평면) 배치 순서 (요청 흐름: 프론트 → 저장 → 분석)
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
// 평면 통합 (flat 4-in-1)
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
