"use client";

/**
 * PlatformDiagram — lumir-sar-platform 통합 다이어그램 (Patrick's Parabox식 중첩).
 *
 * 각 레이어가 하나의 박스이고, 그 박스 *안에* 해당 레이어의 하위 다이어그램이
 * React Flow parent/child 서브플로우로 중첩 렌더된다. 박스를 클릭하면 그 안으로 줌인,
 * ⌂ 전체 보기로 복귀. 레이어 간 흐름은 보내는 노드 → 받는 노드(node→node)로 연결해
 * "어디서 나가 어디로 들어가는지"가 명확하다.
 *
 * DiagramCard·FlowEdge·buildFlowEdges 등은 components/diagram-flow.tsx 재사용.
 */

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  ACCENT,
  MUTED,
  DiagramCard,
  FlowEdge,
  buildFlowEdges,
  type CardData,
} from "@/components/diagram-flow";
import { cn } from "@/lib/utils";

// 레이어 위→아래 배치 순서 (요청 흐름: 프론트 → 저장 → 분석)
const ORDER = ["sar-search-and-analyzer", "sar-data-retrieval", "lumir-linux-snap"];

const CARD_W = 224;
const CARD_H = 100;
const ICOL = 340; // 박스 내부 열 간격 (엣지가 ~320 간격 기준으로 설계됨)
const IROW = 210; // 박스 내부 행 간격
const BPAD = 60; // 박스 내부 여백
const BHEAD = 56; // 박스 헤더(레이블) 높이
const BGAP = 240; // 박스 간 세로 간격

const STR = {
  eyebrow: { ko: "통합 아키텍처", en: "Unified architecture" },
  hint: {
    ko: "🔍 레이어 박스를 클릭하면 그 안으로 줌인",
    en: "🔍 Click a layer box to zoom inside",
  },
  reset: { ko: "전체 보기", en: "Overview" },
  legendFwd: { ko: "정방향 흐름", en: "Forward flow" },
  legendRet: { ko: "응답·복귀", en: "Response / return" },
  legendExt: { ko: "외부 시스템", en: "External system" },
} satisfies Record<string, L>;

function cardData(n: DiagramNode, locale: Locale): CardData {
  return {
    label: pick(n.label, locale),
    sublabel: n.sublabel ? pick(n.sublabel, locale) : undefined,
    icon: n.icon,
    kind: n.kind ?? "layer",
    cat: n.cat,
  };
}

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

type GroupData = { label: string; w: number; h: number };

function GroupFrame({ data }: NodeProps<Node<GroupData>>) {
  return (
    <div
      style={{ width: data.w, height: data.h }}
      className="rounded-xl border border-dashed border-[var(--accent)]/45 bg-[var(--accent)]/[0.06]"
    >
      <div className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]/80">
        {data.label}
      </div>
    </div>
  );
}

const nodeTypes = { card: DiagramCard, layerBox: LayerBox, groupFrame: GroupFrame };
const edgeTypes = { flow: FlowEdge };

function buildPlatformGraph(project: Project, locale: Locale) {
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
        zIndex: 2,
        data: cardData(n, locale),
      });
    }
    edges.push(...buildFlowEdges(dia.edges, locale, slug));

    // 그룹 프레임 — node.group === g.id 인 노드들을 한 박스로 묶음 (예: 외부 인프라)
    for (const g of dia.groups ?? []) {
      const members = dia.nodes.filter((n) => n.group === g.id);
      if (members.length === 0) continue;
      const xs = members.map((n) => BPAD + n.col * ICOL);
      const ys = members.map((n) => BHEAD + BPAD + n.row * IROW);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs) + CARD_W;
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys) + CARD_H;
      const GPAD = 22;
      const GHEAD = 30;
      nodes.push({
        id: `group__${slug}__${g.id}`,
        type: "groupFrame",
        parentId: boxId,
        position: { x: minX - GPAD, y: minY - GPAD - GHEAD },
        draggable: false,
        selectable: false,
        zIndex: 1,
        data: {
          label: pick(g.label, locale),
          w: maxX - minX + GPAD * 2,
          h: maxY - minY + GPAD * 2 + GHEAD,
        },
      });
    }

    boxChildren[boxId] = childIds;
    cursorY += h + BGAP;
  }

  // 레이어 간 흐름 — 보내는 노드 → 받는 노드 (양끝을 실제 노드에 연결)
  const interFlow: {
    from: string;
    exit: string;
    to: string;
    entry: string;
    label: L;
    kind: "primary" | "secondary";
    dashed?: boolean;
    fromSide?: string;
    toSide?: string;
  }[] = [
    { from: "sar-search-and-analyzer", exit: "storage", to: "sar-data-retrieval", entry: "api", label: { ko: "② 검색 질의", en: "② query" }, kind: "primary", fromSide: "bottom", toSide: "top" },
    { from: "sar-data-retrieval", exit: "snap", to: "lumir-linux-snap", entry: "dashboard", label: { ko: "③ 신규 분석", en: "③ analyze" }, kind: "primary", dashed: true, fromSide: "bottom", toSide: "top" },
    { from: "lumir-linux-snap", exit: "db", to: "sar-data-retrieval", entry: "snap", label: { ko: "④ 결과 저장", en: "④ write-back" }, kind: "secondary", fromSide: "right", toSide: "right" },
    { from: "sar-data-retrieval", exit: "api", to: "sar-search-and-analyzer", entry: "bff", label: { ko: "⑤ 응답", en: "⑤ response" }, kind: "secondary", dashed: true, fromSide: "left", toSide: "left" },
  ];
  interFlow.forEach((f, i) => {
    if (!boxIds[f.from] || !boxIds[f.to]) return;
    const primary = f.kind === "primary";
    const color = primary ? ACCENT : MUTED;
    edges.push({
      id: `inter-${i}`,
      source: `${f.from}__${f.exit}`,
      target: `${f.to}__${f.entry}`,
      sourceHandle: `${f.fromSide ?? "bottom"}-s`,
      targetHandle: `${f.toSide ?? "top"}-t`,
      type: "flow",
      label: pick(f.label, locale),
      markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
      style: { stroke: color, strokeWidth: primary ? 2 : 1.5, strokeDasharray: f.dashed ? "6 5" : undefined },
      data: { primary, phase: i * 0.4 },
    });
  });

  return { nodes, edges, boxChildren };
}

export function PlatformDiagram({ project }: { project: Project }) {
  const locale = useLocale() as Locale;
  const [mounted, setMounted] = useState(false);
  const rfRef = useRef<ReactFlowInstance | null>(null);
  const boxChildrenRef = useRef<Record<string, string[]>>({});
  useEffect(() => setMounted(true), []);

  const { nodes, edges, boxChildren } = useMemo(
    () => buildPlatformGraph(project, locale),
    [project, locale]
  );
  boxChildrenRef.current = boxChildren;

  const enter = useCallback((boxId: string) => {
    const ids = [boxId, ...(boxChildrenRef.current[boxId] ?? [])];
    rfRef.current?.fitView({
      nodes: ids.map((id) => ({ id })),
      duration: 700,
      padding: 0.12,
    });
  }, []);
  const reset = useCallback(() => {
    rfRef.current?.fitView({ duration: 700, padding: 0.14 });
  }, []);

  return (
    <div className="mb-12 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
          {pick(STR.eyebrow, locale)}
        </div>
        <div className="hidden text-[10px] font-mono text-[var(--muted)] sm:block">
          {pick(STR.hint, locale)}
        </div>
      </div>

      <div className="h-[600px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] md:h-[760px]">
        {mounted ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
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
              const fit = () => instance.fitView({ padding: 0.14, duration: 0 });
              requestAnimationFrame(() => requestAnimationFrame(fit));
              setTimeout(fit, 200);
            }}
            onNodeClick={(_, node) => {
              if (node.type === "layerBox") enter(node.id);
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1} />
            <Controls
              showInteractive={false}
              showFitView={false}
              position="bottom-right"
            />
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
                {pick(STR.reset, locale)}
              </button>
            </Panel>
          </ReactFlow>
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">
            {pick(STR.eyebrow, locale)}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-mono text-[var(--muted)]">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-6 rounded" style={{ background: ACCENT }} />
          {pick(STR.legendFwd, locale)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-6 border-t border-dashed" style={{ borderColor: MUTED }} />
          {pick(STR.legendRet, locale)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded border border-dashed border-[var(--border)] bg-[var(--subtle)]" />
          {pick(STR.legendExt, locale)}
        </span>
      </div>

      {project.diagram?.caption && (
        <p className="max-w-3xl text-xs leading-relaxed text-[var(--muted)]">
          {pick(project.diagram.caption, locale)}
        </p>
      )}
    </div>
  );
}
