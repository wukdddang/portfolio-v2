"use client";

/**
 * PlatformDiagram — lumir-sar-platform 통합 캔버스 (Prezi식 드릴인).
 *
 * 한 캔버스에 ① hero 개요 클러스터(상단 중앙) + ② 3 레이어 상세 클러스터(하단 행)를
 * 좌표 영역을 나눠 배치한다. hero의 레이어 노드(front·store·analyze)는 drillable —
 * 클릭하면 해당 레이어 상세 클러스터로 fitView 줌인(Prezi 느낌). '전체 보기'로 hero 복귀.
 *
 * 노드 id는 클러스터별 prefix(`hero__`, `${slug}__`)로 네임스페이스해 충돌을 막는다.
 * DiagramCard·FlowEdge·엣지 빌더는 components/diagram-flow.tsx 공용 모듈 재사용.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  type Node,
  type Edge,
  type NodeProps,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { pick, type L } from "@/data/i18n";
import type { Project } from "@/data/projects";
import {
  ACCENT,
  MUTED,
  COL_W,
  ROW_H,
  DiagramCard,
  FlowEdge,
  buildFlowEdges,
  type CardData,
} from "@/components/diagram-flow";
import { cn } from "@/lib/utils";

// hero 레이어 노드 id → 하위 프로젝트 slug (드릴 타깃)
const DRILL: Record<string, string> = {
  front: "sar-search-and-analyzer",
  store: "sar-data-retrieval",
  analyze: "lumir-linux-snap",
};
// 상세 클러스터 좌→우 배치 순서 (요청 흐름: 프론트 → 저장 → 분석)
const ORDER = ["sar-search-and-analyzer", "sar-data-retrieval", "lumir-linux-snap"];

const CARD_W = 224; // DiagramCard 고정 폭
const CARD_H = 104; // 카드 높이 추정(프레임 크기 계산용)
const PAD = 64; // 프레임 내부 여백
const HEADER = 48; // 프레임 헤더(레이블) 높이
const GAP = 360; // 상세 클러스터 간 간격
const DETAIL_TOP = 1180; // 상세 행 프레임 top (hero 아래)

const STR = {
  eyebrow: { ko: "통합 아키텍처", en: "Unified architecture" },
  hint: {
    ko: "🔍 레이어를 클릭하면 상세로 줌인",
    en: "🔍 Click a layer to zoom into its detail",
  },
  overview: { ko: "전체 보기", en: "Overview" },
  drill: { ko: "클릭하여 상세 보기", en: "Click to zoom in" },
  heroFrame: {
    ko: "통합 개요 — 요청 흐름",
    en: "Integrated overview — request flow",
  },
  legendFwd: { ko: "정방향 흐름", en: "Forward flow" },
  legendRet: { ko: "응답·복귀", en: "Response / return" },
  legendExt: { ko: "외부 시스템", en: "External system" },
} satisfies Record<string, L>;

type FrameData = { label: string; icon?: string; w: number; h: number };

function FrameNode({ data }: NodeProps<Node<FrameData>>) {
  return (
    <div
      style={{ width: data.w, height: data.h }}
      className="rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--subtle)]/30"
    >
      <div className="flex items-center gap-2 px-4 py-2.5">
        {data.icon && (
          <span className="text-base leading-none">{data.icon}</span>
        )}
        <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
          {data.label}
        </span>
      </div>
    </div>
  );
}

const nodeTypes = { card: DiagramCard, frame: FrameNode };
const edgeTypes = { flow: FlowEdge };

function buildPlatformGraph(
  project: Project,
  locale: Locale,
  onDrill: (slug: string) => void
) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const subs = project.subProjects ?? [];
  const bySlug = new Map(subs.map((s) => [s.slug, s]));

  // --- ② 상세 클러스터들 (좌→우) ---
  const clusterIds: Record<string, string[]> = {};
  let cursorX = 0;

  for (const slug of ORDER) {
    const sub = bySlug.get(slug);
    if (!sub?.diagram) continue;
    const dia = sub.diagram;
    const maxCol = Math.max(...dia.nodes.map((n) => n.col));
    const maxRow = Math.max(...dia.nodes.map((n) => n.row));
    const frameX = cursorX;
    const frameW = maxCol * COL_W + CARD_W + PAD * 2;
    const frameH = maxRow * ROW_H + CARD_H + PAD * 2 + HEADER;
    const originX = frameX + PAD;
    const originY = DETAIL_TOP + HEADER + PAD;
    const frameId = `frame__${slug}`;

    nodes.push({
      id: frameId,
      type: "frame",
      position: { x: frameX, y: DETAIL_TOP },
      draggable: false,
      selectable: false,
      zIndex: 0,
      data: {
        label: sub.layerLabel ? pick(sub.layerLabel, locale) : slug,
        icon: sub.layerIcon,
        w: frameW,
        h: frameH,
      },
    });

    const ids = [frameId];
    for (const n of dia.nodes) {
      const id = `${slug}__${n.id}`;
      ids.push(id);
      nodes.push({
        id,
        type: "card",
        position: { x: originX + n.col * COL_W, y: originY + n.row * ROW_H },
        draggable: false,
        selectable: false,
        zIndex: 1,
        data: {
          label: pick(n.label, locale),
          sublabel: n.sublabel ? pick(n.sublabel, locale) : undefined,
          icon: n.icon,
          kind: n.kind ?? "layer",
          cat: n.cat,
        } satisfies CardData,
      });
    }
    edges.push(...buildFlowEdges(dia.edges, locale, slug));
    clusterIds[slug] = ids;
    cursorX += frameW + GAP;
  }

  const detailRowWidth = cursorX > 0 ? cursorX - GAP : 0;

  // --- ① hero 개요 클러스터 (상세 행 위 중앙) ---
  const heroIds: string[] = [];
  const hero = project.diagram;
  if (hero) {
    const maxCol = Math.max(...hero.nodes.map((n) => n.col));
    const maxRow = Math.max(...hero.nodes.map((n) => n.row));
    const frameW = maxCol * COL_W + CARD_W + PAD * 2;
    const frameH = maxRow * ROW_H + CARD_H + PAD * 2 + HEADER;
    const frameX = Math.max(0, (detailRowWidth - frameW) / 2);
    const originX = frameX + PAD;
    const originY = HEADER + PAD;
    const frameId = "frame__hero";

    nodes.push({
      id: frameId,
      type: "frame",
      position: { x: frameX, y: 0 },
      draggable: false,
      selectable: false,
      zIndex: 0,
      data: { label: pick(STR.heroFrame, locale), w: frameW, h: frameH },
    });
    heroIds.push(frameId);

    for (const n of hero.nodes) {
      const id = `hero__${n.id}`;
      heroIds.push(id);
      const drillable = !!DRILL[n.id];
      nodes.push({
        id,
        type: "card",
        position: { x: originX + n.col * COL_W, y: originY + n.row * ROW_H },
        draggable: false,
        selectable: false,
        zIndex: 1,
        data: {
          label: pick(n.label, locale),
          sublabel: n.sublabel ? pick(n.sublabel, locale) : undefined,
          icon: n.icon,
          kind: n.kind ?? "layer",
          cat: n.cat,
          drillable,
          drillHint: drillable ? pick(STR.drill, locale) : undefined,
          onActivate: drillable ? () => onDrill(DRILL[n.id]) : undefined,
        } satisfies CardData,
      });
    }
    edges.push(...buildFlowEdges(hero.edges, locale, "hero"));
  }

  return { nodes, edges, heroIds, clusterIds };
}

export function PlatformDiagram({ project }: { project: Project }) {
  const locale = useLocale() as Locale;
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const rfRef = useRef<ReactFlowInstance | null>(null);
  useEffect(() => setMounted(true), []);

  const clusterIdsRef = useRef<Record<string, string[]>>({});
  const heroIdsRef = useRef<string[]>([]);

  const drill = useCallback(
    (slug: string) => {
      setActive(slug);
      const ids = clusterIdsRef.current[slug];
      if (ids) {
        rfRef.current?.fitView({
          nodes: ids.map((id) => ({ id })),
          duration: reduce ? 0 : 650,
          padding: 0.22,
        });
      }
    },
    [reduce]
  );

  const reset = useCallback(() => {
    setActive(null);
    rfRef.current?.fitView({
      nodes: heroIdsRef.current.map((id) => ({ id })),
      duration: reduce ? 0 : 650,
      padding: 0.22,
    });
  }, [reduce]);

  const { nodes, edges, heroIds, clusterIds } = useMemo(
    () => buildPlatformGraph(project, locale, drill),
    [project, locale, drill]
  );
  clusterIdsRef.current = clusterIds;
  heroIdsRef.current = heroIds;

  const subs = project.subProjects ?? [];
  const activeLabel = (() => {
    if (active == null) return null;
    const s = subs.find((x) => x.slug === active);
    return s?.layerLabel ? pick(s.layerLabel, locale) : active;
  })();

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
          {pick(STR.eyebrow, locale)}
        </div>
        <div className="hidden text-[10px] font-mono text-[var(--muted)] sm:block">
          {pick(STR.hint, locale)}
        </div>
      </div>

      <div className="h-[560px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] md:h-[720px]">
        {mounted ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            colorMode="system"
            minZoom={0.12}
            maxZoom={1.6}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            zoomOnScroll={false}
            panOnScroll={false}
            zoomOnDoubleClick={false}
            panOnDrag
            onInit={(instance) => {
              rfRef.current = instance;
              // 초기엔 hero 클러스터로 즉시 맞춤(로드 시 애니메이션 불필요).
              // fitView prop은 re-render마다 hero로 재-fit돼 '전체 보기' 애니메이션을
              // 덮어쓰므로 쓰지 않고, 측정 후 1회 imperative fit으로 처리한다.
              const fitHero = () =>
                instance.fitView({
                  nodes: heroIdsRef.current.map((id) => ({ id })),
                  padding: 0.22,
                  duration: 0,
                });
              requestAnimationFrame(() => requestAnimationFrame(fitHero));
              setTimeout(fitHero, 200);
            }}
            onNodeClick={(_, node) => {
              if (node.type === "card" && (node.data as CardData).drillable) {
                const heroId = node.id.replace(/^hero__/, "");
                if (DRILL[heroId]) drill(DRILL[heroId]);
              }
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1} />
            <Controls
              showInteractive={false}
              showFitView={false}
              position="bottom-right"
            />
            <Panel position="top-left">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    reset();
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border bg-[var(--card)] px-3 py-1.5 text-[11px] font-mono transition-colors",
                    active
                      ? "border-[var(--accent)]/50 text-[var(--foreground)] hover:border-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                  )}
                >
                  <span aria-hidden>⌂</span>
                  {pick(STR.overview, locale)}
                </button>
                {activeLabel && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--accent)]/40 bg-[var(--card)] px-3 py-1.5 text-[11px] font-mono text-[var(--accent)]">
                    ▸ {activeLabel}
                  </span>
                )}
              </div>
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
          <span
            className="inline-block h-0.5 w-6 rounded"
            style={{ background: ACCENT }}
          />
          {pick(STR.legendFwd, locale)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block w-6 border-t border-dashed"
            style={{ borderColor: MUTED }}
          />
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
    </motion.div>
  );
}
