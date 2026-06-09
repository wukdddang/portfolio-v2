"use client";

/**
 * PlatformDiagram — lumir-sar-platform 통합 다이어그램 (가로 흐름, 좌→우).
 *
 * 각 레이어가 하나의 박스이고, 그 박스 *안에* 해당 레이어의 하위 다이어그램이
 * React Flow parent/child 서브플로우로 중첩 렌더된다. 박스를 클릭하면 그 안으로 줌인,
 * ⌂ 전체 보기로 복귀. 3 레이어는 프론트 → 저장 → 분석 순으로 좌→우 배치된다.
 *
 * 레이어 간 흐름(inter-layer)은 박스 ↔ 박스 핸들로 연결해 박스 사이 빈 공간으로만 흐른다
 * (노드 위/뒤를 가로지르지 않음). 정밀한 노드 단위 흐름은 드릴인하면 보인다.
 *
 * 인터랙션:
 *  - hover 포커스 트레이싱: 카드에 마우스를 올리면 연결된 카드·엣지만 강조, 나머지는 흐림.
 *    (호버 시 흐려지는 카드/엣지만 새 객체로 만들어 리렌더 churn·깜빡임을 최소화)
 *  - 드릴인 컨텍스트: 진입 시 상단에 breadcrumb + ‹ 이전 / 다음 › 레이어 이동 + 본문 점프.
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

// 레이어 배치 순서 (요청 흐름: 프론트 → 저장 → 분석), 좌→우
const ORDER = ["sar-search-and-analyzer", "sar-data-retrieval", "lumir-linux-snap"];

const CARD_W = 224;
const CARD_H = 100;
const ICOL = 440; // 박스 내부 열 간격 — 카드(224) + 라벨 여유(~216)
const IROW = 250; // 박스 내부 행 간격 — 세로 엣지를 길게 빼 라벨이 카드에 안 붙도록
const BPAD = 72; // 박스 내부 여백 (라벨이 박스 테두리에 닿지 않게)
const BHEAD = 56; // 박스 헤더(레이블) 높이
const GAP = 300; // 박스 간 가로 간격 (레이어 간 엣지·라벨이 들어갈 공간)

const STR = {
  eyebrow: { ko: "통합 아키텍처", en: "Unified architecture" },
  hint: {
    ko: "🔍 레이어 박스를 클릭하면 그 안으로 줌인",
    en: "🔍 Click a layer box to zoom inside",
  },
  reset: { ko: "전체 보기", en: "Overview" },
  enterHint: { ko: "🔍 클릭하여 진입", en: "🔍 click to enter" },
  activeHint: { ko: "✓ 현재 레이어", en: "✓ current layer" },
  viewSection: { ko: "본문 보기", en: "View section" },
  prevLayer: { ko: "이전 레이어", en: "Previous layer" },
  nextLayer: { ko: "다음 레이어", en: "Next layer" },
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

type BoxData = { label: string; icon?: string; hint?: string; active?: boolean };

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
    <div
      className={cn(
        "h-full w-full overflow-hidden rounded-2xl border-2 bg-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.22)] transition-colors hover:border-[var(--accent)]/90",
        data.active ? "border-[var(--accent)]" : "border-[var(--accent)]/55"
      )}
    >
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
        {data.hint && (
          <span className="ml-auto font-mono text-[10px] text-[var(--muted)]">
            {data.hint}
          </span>
        )}
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

// 레이어 간 흐름 — 기본은 박스 ↔ 박스 핸들(빈 공간으로만 흐름). fromNode/toNode를 주면
// 박스 대신 그 레이어 *내부 노드*에서 출발/도착한다 → 프론트의 '저장 레이어' 노드처럼
// "그 흐름이 어느 노드에서 나가는지"를 명확히 이어 보여줄 수 있다.
//  정방향(검색·분석)은 좌→우 진행, 복귀(결과·응답)는 아래/위로 우회 루프.
const INTER_FLOW: {
  from: string;
  to: string;
  fromNode?: string; // from 레이어 내부 노드 id (생략 시 박스 핸들)
  toNode?: string; // to 레이어 내부 노드 id (생략 시 박스 핸들)
  label: L;
  kind: "primary" | "secondary";
  dashed?: boolean;
  fromSide: string;
  toSide: string;
}[] = [
  // 프론트의 '저장 레이어' 노드(박스 하단) → 저장 박스. bottom으로 빼 빈 공간으로 우회 →
  // 박스 내부 노드(admin·분석 stub)를 가로지르지 않고 저장 박스 좌측에 진입.
  { from: "sar-search-and-analyzer", fromNode: "storage", to: "sar-data-retrieval", label: { ko: "② 검색 질의", en: "② query" }, kind: "primary", fromSide: "bottom", toSide: "left" },
  { from: "sar-data-retrieval", to: "lumir-linux-snap", label: { ko: "③ InSAR 요청", en: "③ InSAR request" }, kind: "primary", fromSide: "right", toSide: "left" },
  { from: "lumir-linux-snap", to: "sar-data-retrieval", label: { ko: "④ InSAR 데이터 (API)", en: "④ InSAR data (API)" }, kind: "secondary", dashed: true, fromSide: "bottom", toSide: "bottom" },
  { from: "sar-data-retrieval", to: "sar-search-and-analyzer", label: { ko: "⑤ 응답", en: "⑤ response" }, kind: "secondary", dashed: true, fromSide: "top", toSide: "top" },
];

function buildPlatformGraph(project: Project, locale: Locale) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const subs = project.subProjects ?? [];
  const bySlug = new Map(subs.map((s) => [s.slug, s]));
  const boxChildren: Record<string, string[]> = {};
  const boxIds: Record<string, string> = {};

  let cursorX = 0; // 가로 누적 (좌→우 스파인)
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
      position: { x: cursorX, y: -h / 2 }, // y=0 기준 가운데 정렬 (가로 스파인)
      style: { width: w, height: h },
      draggable: false,
      selectable: false,
      zIndex: 0,
      data: {
        label: sub.layerLabel ? pick(sub.layerLabel, locale) : slug,
        icon: sub.layerIcon,
        hint: pick(STR.enterHint, locale),
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
    cursorX += w + GAP;
  }

  // 레이어 간 흐름 — 박스(또는 fromNode/toNode가 가리키는 내부 노드) 핸들 ↔ 핸들
  INTER_FLOW.forEach((f, i) => {
    if (!boxIds[f.from] || !boxIds[f.to]) return;
    const primary = f.kind === "primary";
    const color = primary ? ACCENT : MUTED;
    const source = f.fromNode ? `${f.from}__${f.fromNode}` : boxIds[f.from];
    const target = f.toNode ? `${f.to}__${f.toNode}` : boxIds[f.to];
    edges.push({
      id: `inter-${i}`,
      source,
      target,
      sourceHandle: `${f.fromSide}-s`,
      targetHandle: `${f.toSide}-t`,
      type: "flow",
      label: pick(f.label, locale),
      markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
      style: { stroke: color, strokeWidth: primary ? 2 : 1.5, strokeDasharray: f.dashed ? "6 5" : undefined },
      data: { primary, phase: i * 0.4 },
      zIndex: 5, // 박스(0)·카드(2) 위로 — 레이어 간 선이 박스 뒤에 묻히지 않게
    });
  });

  return { nodes, edges, boxChildren };
}

export function PlatformDiagram({ project }: { project: Project }) {
  const locale = useLocale() as Locale;
  const [mounted, setMounted] = useState(false);
  const [activeBox, setActiveBox] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const rfRef = useRef<ReactFlowInstance | null>(null);
  useEffect(() => setMounted(true), []);

  // 레이어 메타 (breadcrumb·이전/다음 이동용)
  const layers = useMemo(
    () =>
      ORDER.map((slug) => {
        const sub = (project.subProjects ?? []).find((s) => s.slug === slug);
        if (!sub?.diagram) return null;
        return {
          slug,
          boxId: `box__${slug}`,
          label: sub.layerLabel ? pick(sub.layerLabel, locale) : slug,
          icon: sub.layerIcon,
        };
      }).filter((x): x is NonNullable<typeof x> => x !== null),
    [project, locale]
  );

  const base = useMemo(
    () => buildPlatformGraph(project, locale),
    [project, locale]
  );

  // hover 포커스 트레이싱 — 호버한 카드 + 직접 연결된 카드만 강조
  const connected = useMemo(() => {
    const s = new Set<string>();
    if (hovered) {
      s.add(hovered);
      for (const e of base.edges) {
        if (e.source === hovered) s.add(e.target);
        if (e.target === hovered) s.add(e.source);
      }
    }
    return s;
  }, [hovered, base.edges]);

  // 박스 active 표시 — 드릴인 시에만 변함 (hover와 무관 → hover가 박스 객체를 재생성하지 않음)
  const styledNodes = useMemo(() => {
    return base.nodes.map((n) => {
      if (n.type !== "layerBox") return n;
      const active = n.id === activeBox;
      return {
        ...n,
        data: {
          ...(n.data as BoxData),
          active,
          hint: active ? pick(STR.activeHint, locale) : pick(STR.enterHint, locale),
        },
      };
    });
  }, [base.nodes, activeBox, locale]);

  // hover dim — 호버 안 하면 styledNodes 참조 그대로(리렌더 없음).
  // 호버 시 '흐려지는' 카드만 새 객체로 (호버 카드·연결 카드는 참조 유지 → 깜빡임 방지).
  // dim은 'rf-dim' 클래스 토글로만 표현 → 트랜지션은 globals.css의 .react-flow__node에
  // 상주하므로 dim 진입·해제 양방향 모두 부드럽게 페이드한다.
  const displayNodes = useMemo(() => {
    if (!hovered) return styledNodes;
    return styledNodes.map((n) =>
      n.type === "card" && !connected.has(n.id)
        ? { ...n, className: cn(n.className, "rf-dim") }
        : n
    );
  }, [styledNodes, hovered, connected]);

  // hover 시 '연결 안 된' 엣지만 새 객체로 dim (연결 엣지는 참조 유지 → 흐름 애니메이션 끊김 없음).
  // 선·점은 .react-flow__edge.rf-dim(클래스)로, 라벨은 별도 포털이라 data.dim → 라벨 클래스로 dim.
  const displayEdges = useMemo(() => {
    if (!hovered) return base.edges;
    return base.edges.map((e) => {
      const touches = e.source === hovered || e.target === hovered;
      return touches
        ? e
        : {
            ...e,
            className: cn(e.className, "rf-dim"),
            data: { ...(e.data as object), dim: true },
          };
    });
  }, [base.edges, hovered]);

  const enter = useCallback(
    (boxId: string) => {
      setActiveBox(boxId);
      const ids = [boxId, ...(base.boxChildren[boxId] ?? [])];
      rfRef.current?.fitView({
        nodes: ids.map((id) => ({ id })),
        duration: 700,
        padding: 0.12,
      });
    },
    [base.boxChildren]
  );

  const reset = useCallback(() => {
    setActiveBox(null);
    rfRef.current?.fitView({ duration: 700, padding: 0.14 });
  }, []);

  const gotoLayer = useCallback(
    (delta: number) => {
      const i = layers.findIndex((l) => l.boxId === activeBox);
      const target = layers[(i < 0 ? 0 : i) + delta];
      if (target) enter(target.boxId);
    },
    [layers, activeBox, enter]
  );

  // 노드(레이어) → 본문 sub-project 섹션으로 스크롤 + 잠깐 강조
  const jumpToSection = useCallback((slug: string) => {
    const el = document.getElementById(slug);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.animate(
      [
        { boxShadow: "0 0 0 0px rgba(245,158,11,0)" },
        { boxShadow: "0 0 0 4px rgba(245,158,11,0.55)", offset: 0.3 },
        { boxShadow: "0 0 0 0px rgba(245,158,11,0)" },
      ],
      { duration: 1500, easing: "ease-out" }
    );
  }, []);

  const activeIndex = layers.findIndex((l) => l.boxId === activeBox);
  const activeLayer = activeIndex >= 0 ? layers[activeIndex] : null;

  const pillBtn =
    "inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 font-mono text-[11px] text-[var(--muted)] transition-colors hover:text-[var(--foreground)] disabled:opacity-40 disabled:hover:text-[var(--muted)]";

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

      {/* 가로 스파인이라 넓다 — 본문 컬럼(max-w-6xl)을 벗어나 더 넓게 (xl+, 화면 중앙, 스크롤바 안전) */}
      <div className="h-[560px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] md:h-[680px] xl:relative xl:left-1/2 xl:w-[min(100vw-3rem,96rem)] xl:-translate-x-1/2">
        {mounted ? (
          <ReactFlow
            nodes={displayNodes}
            edges={displayEdges}
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
            onNodeMouseEnter={(_, node) => {
              if (node.type === "card") setHovered(node.id);
            }}
            onNodeMouseLeave={() => setHovered(null)}
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1} />
            <Controls
              showInteractive={false}
              showFitView={false}
              position="bottom-right"
            />

            {/* 좌상단 — 네비게이션: 전체 보기 / (드릴인 시) breadcrumb + 이전·다음 + 본문 점프 */}
            <Panel position="top-left">
              {activeLayer ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  <button type="button" onClick={(e) => { e.stopPropagation(); reset(); }} className={pillBtn}>
                    <span aria-hidden>⌂</span>
                    {pick(STR.reset, locale)}
                  </button>
                  <div className="inline-flex items-center gap-1 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-1 py-0.5">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); gotoLayer(-1); }}
                      disabled={activeIndex <= 0}
                      aria-label={pick(STR.prevLayer, locale)}
                      className="px-1.5 font-mono text-[13px] leading-none text-[var(--accent)] transition-opacity hover:opacity-70 disabled:opacity-30"
                    >
                      ‹
                    </button>
                    <span className="inline-flex items-center gap-1 px-1 font-mono text-[11px] font-semibold text-[var(--accent)]">
                      <span aria-hidden>{activeLayer.icon}</span>
                      {activeLayer.label}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); gotoLayer(1); }}
                      disabled={activeIndex >= layers.length - 1}
                      aria-label={pick(STR.nextLayer, locale)}
                      className="px-1.5 font-mono text-[13px] leading-none text-[var(--accent)] transition-opacity hover:opacity-70 disabled:opacity-30"
                    >
                      ›
                    </button>
                  </div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); jumpToSection(activeLayer.slug); }} className={pillBtn}>
                    {pick(STR.viewSection, locale)}
                    <span aria-hidden>↓</span>
                  </button>
                </div>
              ) : (
                <button type="button" onClick={(e) => { e.stopPropagation(); reset(); }} className={pillBtn}>
                  <span aria-hidden>⌂</span>
                  {pick(STR.reset, locale)}
                </button>
              )}
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
