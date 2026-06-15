"use client";

/**
 * ProjectDiagram — 프로젝트 아키텍처/데이터플로우 다이어그램 (React Flow)
 * data/projects.ts 의 `diagram` 필드(bilingual)를 받아 인터랙티브 그래프로 렌더.
 * 서버 컴포넌트(상세 페이지)에서 'use client' 아일랜드로 주입한다.
 * 공용 프리미티브는 components/diagram-flow.tsx 에서 가져온다.
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
  type Edge,
  type Node,
  type NodeProps,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { pick } from "@/data/i18n";
import type { ProjectDiagram as ProjectDiagramData, DiagramNode } from "@/data/projects";
import {
  ACCENT,
  MUTED,
  CONTROL,
  COL_W,
  ROW_H,
  DiagramCard,
  FlowEdge,
  buildFlowEdges,
  type FlowEdgeData,
} from "@/components/diagram-flow";
import {
  useDiagramFullscreen,
  DiagramFullscreenButton,
  FS_EXPANDED_STYLE,
} from "@/components/diagram-fullscreen";
import { cn } from "@/lib/utils";

// 카드 크기 — 그룹 프레임 경계 계산용 (DiagramCard: w=224, 헤더+sublabel ≈ 76)
const CARD_W = 224;
const CARD_H = 76;

type GroupData = { label: string; icon?: string; w: number; h: number; color: string };

/**
 * GroupFrame — node.group === id 인 노드들을 한 박스로 감싸는 배경 프레임.
 * 예: SDPE 의 "Pipeline Workflow" — pgmq 버스 + L0~L3 처리 단계를 오케스트레이션 경계로 두른다
 * (메인 미리보기의 envelope 와 동일 모델). cat 색으로 틴트, 좌상단에 제목.
 */
function GroupFrame({ data }: NodeProps<Node<GroupData>>) {
  return (
    <div
      style={{
        width: data.w,
        height: data.h,
        borderColor: `color-mix(in oklch, ${data.color} 45%, var(--border))`,
        backgroundColor: `color-mix(in oklch, ${data.color} 6%, transparent)`,
      }}
      className="rounded-2xl border"
    >
      <div
        className="inline-flex items-center gap-1.5 rounded-br-xl rounded-tl-2xl px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest"
        style={{
          color: `color-mix(in oklch, ${data.color} 70%, var(--foreground))`,
          backgroundColor: `color-mix(in oklch, ${data.color} 12%, transparent)`,
        }}
      >
        {data.icon && <span className="text-[13px] leading-none">{data.icon}</span>}
        {data.label}
      </div>
    </div>
  );
}

const hiddenHandle = {
  opacity: 0,
  width: 1,
  height: 1,
  minWidth: 0,
  minHeight: 0,
  border: 0,
  background: "transparent",
} as const;

type BusData = {
  label: string;
  sublabel?: string;
  icon?: string;
  color: string;
  w: number;
  inLeft: number; // 진입(상단) 핸들 x (버스 좌측 기준)
  drops: { id: string; left: number }[]; // 각 단계로 내려가는 하단 드롭 핸들
};

/**
 * BusRail — 가로 이벤트 버스 레일 (메인 미리보기 BusRail 의 React Flow 판).
 * 단일 카드가 아니라 처리 단계들 위를 가로지르는 선으로 그려, 상단으로 진입(워크플로 → 버스)하고
 * 하단의 정렬된 드롭 핸들로 각 레벨을 기동한다. node.bus === true 인 노드에 적용.
 */
function BusRail({ data }: NodeProps<Node<BusData>>) {
  return (
    <div style={{ width: data.w }} className="relative h-9">
      <Handle id="in" type="target" position={Position.Top} style={{ left: data.inLeft, ...hiddenHandle }} isConnectable={false} />
      {/* 레일 — glow 언더레이 + 본선 */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-1/2 h-[7px] -translate-y-1/2 rounded-full opacity-30"
        style={{ background: data.color, filter: "blur(3px)" }}
      />
      <span
        aria-hidden
        className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full"
        style={{ background: `color-mix(in oklch, ${data.color} 75%, var(--border))` }}
      />
      {/* 라벨 칩 — 레일 위 중앙 */}
      <span
        className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-md border bg-[var(--card)] px-2 py-0.5 font-mono text-[10px] leading-tight"
        style={{
          borderColor: `color-mix(in oklch, ${data.color} 45%, var(--border))`,
          color: `color-mix(in oklch, ${data.color} 65%, var(--foreground))`,
        }}
      >
        {data.icon && <span className="not-italic">{data.icon}</span>}
        {data.label}
        {data.sublabel && <span className="text-[var(--muted)]">· {data.sublabel}</span>}
      </span>
      {/* 드롭 핸들 — 각 단계 중앙 x 에 정렬 */}
      {data.drops.map((d) => (
        <Handle
          key={d.id}
          id={d.id}
          type="source"
          position={Position.Bottom}
          style={{ left: d.left, ...hiddenHandle }}
          isConnectable={false}
        />
      ))}
    </div>
  );
}

// 4면 숨김 핸들 — DiagramCard 와 동일한 id 규약(`${side}-s` / `${side}-t`)으로 엣지가 붙는다.
const HANDLE_SIDES = [
  ["top", Position.Top],
  ["right", Position.Right],
  ["bottom", Position.Bottom],
  ["left", Position.Left],
] as const;
function SideHandles() {
  return (
    <>
      {HANDLE_SIDES.map(([id, pos]) => (
        <Fragment key={id}>
          <Handle id={`${id}-s`} type="source" position={pos} isConnectable={false} style={hiddenHandle} />
          <Handle id={`${id}-t`} type="target" position={pos} isConnectable={false} style={hiddenHandle} />
        </Fragment>
      ))}
    </>
  );
}

type DagBuilderData = { label: string; sublabel?: string; icon?: string };
const DAG_MINI = ["⚡", "⚙", "⚙", "🗄"];

/**
 * DagBuilderNode — 운영 콘솔을 React Flow DAG 빌더로 그리는 노드 (메인 미리보기 DagFrontendNode 캔버스판).
 * 윈도우 크롬 점 + 점배경 미니 캔버스 위 노드 스트립(트리거→처리→처리→카탈로그)으로
 * "이건 DAG 캔버스다"를 노드 모양으로 드러낸다. 제어 플레인 teal(--cat-2).
 */
function DagBuilderNode({ data }: NodeProps<Node<DagBuilderData>>) {
  const teal = "var(--cat-2)";
  return (
    <div
      style={{
        width: 248,
        borderColor: `color-mix(in oklch, ${teal} 55%, var(--border))`,
        backgroundColor: `color-mix(in oklch, ${teal} 8%, var(--card))`,
      }}
      className="rounded-xl border"
    >
      <SideHandles />
      <div className="flex items-center gap-2 px-3 pb-1.5 pt-2">
        <span className="flex items-center gap-1" aria-hidden>
          <span className="size-1.5 rounded-full" style={{ background: "color-mix(in oklch, var(--cat-5) 70%, transparent)" }} />
          <span className="size-1.5 rounded-full" style={{ background: "color-mix(in oklch, var(--accent) 70%, transparent)" }} />
          <span className="size-1.5 rounded-full" style={{ background: "color-mix(in oklch, var(--cat-6) 70%, transparent)" }} />
        </span>
        {data.icon && <span className="text-[13px] leading-none">{data.icon}</span>}
        <span className="flex min-w-0 flex-col">
          <span className="text-[12.5px] font-semibold leading-tight text-[var(--foreground)]">{data.label}</span>
          {data.sublabel && (
            <span className="font-mono text-[10px] leading-tight text-[var(--muted)]">{data.sublabel}</span>
          )}
        </span>
      </div>
      <div
        className="mx-3 mb-2.5 flex items-center justify-center rounded-lg border border-[var(--border)]/60 px-2 py-2.5"
        style={{
          backgroundColor: `color-mix(in oklch, ${teal} 5%, var(--background))`,
          backgroundImage: `radial-gradient(color-mix(in oklch, ${teal} 22%, transparent) 0.5px, transparent 0.5px)`,
          backgroundSize: "9px 9px",
        }}
      >
        {DAG_MINI.map((icon, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <span aria-hidden className="h-[1.5px] w-4 shrink-0" style={{ background: `color-mix(in oklch, ${teal} 55%, transparent)` }} />
            )}
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-md border text-[13px] leading-none"
              style={{
                borderColor: `color-mix(in oklch, ${teal} 55%, var(--border))`,
                background: `color-mix(in oklch, ${teal} 14%, var(--card))`,
              }}
            >
              {icon}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

type CscChainData = {
  label: string;
  icon?: string;
  w: number;
  chain: { id: string; role: string; color: string }[];
};

/**
 * CscChainNode — 가로 컴포넌트 스트립. 9개 CSC 핀을 서브시스템 색으로 깔아 "CSC 1~9"를
 * 한눈에 보여주는 인벤토리 리본 (예: SDPE). 엣지가 붙지 않는 정보 노드.
 */
function CscChainNode({ data }: NodeProps<Node<CscChainData>>) {
  return (
    <div
      style={{ width: data.w }}
      className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] px-3 py-2.5"
    >
      <div className="mb-2 inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
        {data.icon && <span className="text-[12px] leading-none not-italic">{data.icon}</span>}
        {data.label}
      </div>
      <div className="flex items-stretch gap-1.5">
        {data.chain.map((c) => (
          <div
            key={c.id}
            className="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-md border px-1 py-1.5"
            style={{
              borderColor: `color-mix(in oklch, ${c.color} 45%, var(--border))`,
              backgroundColor: `color-mix(in oklch, ${c.color} 8%, var(--card))`,
            }}
          >
            <span
              className="font-mono text-[11px] font-semibold leading-none"
              style={{ color: `color-mix(in oklch, ${c.color} 72%, var(--foreground))` }}
            >
              {c.id}
            </span>
            <span className="truncate font-mono text-[9px] leading-none text-[var(--muted)]">{c.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const nodeTypes = {
  card: DiagramCard,
  groupFrame: GroupFrame,
  busRail: BusRail,
  dagBuilder: DagBuilderNode,
  cscChain: CscChainNode,
};
const edgeTypes = { flow: FlowEdge };

function buildGraph(diagram: ProjectDiagramData, locale: Locale) {
  const hasGroups = !!diagram.groups?.length;
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]));
  const centerX = (n: DiagramNode) => n.col * COL_W + CARD_W / 2;
  const z = hasGroups ? 10 : undefined;

  const cards: Node[] = diagram.nodes.map((n) => {
    // DAG 빌더 노드 — 콘솔을 React Flow 캔버스 미니로 렌더 (n.variant === "dagBuilder").
    if (n.variant === "dagBuilder") {
      return {
        id: n.id,
        type: "dagBuilder",
        position: { x: n.col * COL_W, y: n.row * ROW_H },
        draggable: false,
        selectable: false,
        zIndex: z,
        data: {
          label: pick(n.label, locale),
          sublabel: n.sublabel ? pick(n.sublabel, locale) : undefined,
          icon: n.icon,
        },
      } satisfies Node;
    }
    // CSC 컴포넌트 스트립 — 단계 행 아래 전폭 인벤토리 리본 (n.variant === "cscChain").
    if (n.variant === "cscChain") {
      const maxCol = Math.max(
        ...diagram.nodes.filter((m) => m.variant !== "cscChain").map((m) => m.col)
      );
      return {
        id: n.id,
        type: "cscChain",
        position: { x: n.col * COL_W, y: n.row * ROW_H },
        draggable: false,
        selectable: false,
        zIndex: z,
        data: {
          label: pick(n.label, locale),
          icon: n.icon,
          w: (maxCol - n.col) * COL_W + CARD_W,
          chain: (n.chain ?? []).map((c) => ({
            id: c.id,
            role: pick(c.role, locale),
            color: c.cat ? `var(--cat-${c.cat})` : "var(--muted)",
          })),
        },
      } satisfies Node;
    }
    // 버스 레일 — 카드가 아니라 가로 선. 나가는 엣지의 to 노드들이 정렬된 드롭이 된다.
    if (n.bus) {
      const targets = diagram.edges
        .filter((e) => e.from === n.id)
        .map((e) => byId.get(e.to))
        .filter((t): t is DiagramNode => !!t);
      const left = n.col * COL_W;
      const right = targets.length
        ? Math.max(...targets.map((t) => t.col * COL_W + CARD_W))
        : left + CARD_W;
      // 진입(상단) 핸들: 이 버스로 들어오는 엣지의 from(예: 워크플로/콘솔) 중앙에 정렬.
      const inbound = diagram.edges.find((e) => e.to === n.id);
      const inFrom = inbound ? byId.get(inbound.from) : undefined;
      return {
        id: n.id,
        type: "busRail",
        position: { x: left, y: n.row * ROW_H },
        draggable: false,
        selectable: false,
        zIndex: z,
        data: {
          label: pick(n.label, locale),
          sublabel: n.sublabel ? pick(n.sublabel, locale) : undefined,
          icon: n.icon,
          color: n.cat ? `var(--cat-${n.cat})` : "var(--cat-2)",
          w: right - left,
          inLeft: inFrom ? centerX(inFrom) - left : (right - left) / 2,
          drops: targets.map((t) => ({ id: `drop-${t.id}`, left: centerX(t) - left })),
        },
      } satisfies Node;
    }
    return {
      id: n.id,
      type: "card",
      position: { x: n.col * COL_W, y: n.row * ROW_H },
      draggable: false,
      selectable: false,
      // 그룹 프레임이 있을 때만 명시 z-순서: 프레임(0) < 엣지(5) < 카드(10).
      // (그룹 없는 다이어그램은 기존 기본 z 유지 → 시각 변화 없음)
      zIndex: z,
      data: {
        label: pick(n.label, locale),
        sublabel: n.sublabel ? pick(n.sublabel, locale) : undefined,
        icon: n.icon,
        kind: n.kind ?? "layer",
        cat: n.cat,
      },
    } satisfies Node;
  });

  // 버스 엣지는 정렬된 커스텀 핸들로 다시 연결 — 드롭(버스→단계)/진입(→버스).
  const busIds = new Set(diagram.nodes.filter((n) => n.bus).map((n) => n.id));
  const edges = buildFlowEdges(diagram.edges, locale).map((e) => {
    const ne: Edge<FlowEdgeData> = hasGroups ? { ...e, zIndex: 5 } : { ...e };
    if (busIds.has(e.source)) ne.sourceHandle = `drop-${e.target}`;
    if (busIds.has(e.target)) ne.targetHandle = "in";
    return ne;
  });

  // 그룹 프레임 — 멤버 노드들의 경계 박스를 배경으로 깔고 좌상단에 제목.
  const frames: Node[] = [];
  for (const g of diagram.groups ?? []) {
    const members = diagram.nodes.filter((n) => n.group === g.id);
    if (members.length === 0) continue;
    const xs = members.map((n) => n.col * COL_W);
    const ys = members.map((n) => n.row * ROW_H);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs) + CARD_W;
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys) + CARD_H;
    const GPAD = 26;
    const GHEAD = 30; // 제목 높이만큼 프레임을 위로 더 키운다
    frames.push({
      id: `group__${g.id}`,
      type: "groupFrame",
      position: { x: minX - GPAD, y: minY - GPAD - GHEAD },
      draggable: false,
      selectable: false,
      zIndex: 0,
      data: {
        label: pick(g.label, locale),
        icon: g.icon,
        color: g.cat ? `var(--cat-${g.cat})` : ACCENT,
        w: maxX - minX + GPAD * 2,
        h: maxY - minY + GPAD * 2 + GHEAD,
      },
    });
  }

  // 프레임을 앞쪽(배경)에 — 카드/엣지가 그 위에 그려진다.
  return { nodes: [...frames, ...cards], edges };
}

export function ProjectDiagram({
  diagram,
  headerless = false,
}: {
  diagram: ProjectDiagramData;
  /** 헤더 행 생략 — 바깥 컨테이너(예: LayerDiagramDisclosure 토글 행)가 헤더를 대신할 때 */
  headerless?: boolean;
}) {
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
  // teal 제어 엣지가 있는 다이어그램에서만 제어 범례를 노출 (예: SDPE 오케스트레이션)
  const hasControl = useMemo(
    () => diagram.edges.some((e) => e.kind === "control"),
    [diagram]
  );

  const fs = useDiagramFullscreen();
  const rfRef = useRef<ReactFlowInstance<Node, Edge<FlowEdgeData>> | null>(null);
  // 전체화면 진입·이탈로 캔버스 크기가 바뀌면 새 크기에 맞춰 재-fit
  useEffect(() => {
    const inst = rfRef.current;
    if (!inst) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => inst.fitView({ padding: 0.16, duration: 300 }))
    );
    return () => cancelAnimationFrame(id);
  }, [fs.expanded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={cn("space-y-3", !headerless && "mb-12")}
    >
      {!headerless && (
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
            {t("architecture")}
          </div>
          <div className="hidden text-[10px] font-mono text-[var(--muted)] sm:block">
            {t("diagramHint")}
          </div>
        </div>
      )}

      <div
        ref={fs.ref}
        style={fs.expanded ? FS_EXPANDED_STYLE : undefined}
        className="h-[520px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] md:h-[640px]"
      >
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
              rfRef.current = instance;
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
            <Panel position="top-right">
              <DiagramFullscreenButton
                expanded={fs.expanded}
                onToggle={fs.toggle}
                locale={locale}
              />
            </Panel>
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
        {hasControl && (
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-0.5 w-6 rounded"
              style={{ background: CONTROL }}
            />
            {t("legendControl")}
          </span>
        )}
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
