"use client";

/**
 * ProjectDiagram — 프로젝트 아키텍처/데이터플로우 다이어그램 (React Flow)
 * data/projects.ts 의 `diagram` 필드(bilingual)를 받아 인터랙티브 그래프로 렌더.
 * 서버 컴포넌트(상세 페이지)에서 'use client' 아일랜드로 주입한다.
 * 공용 프리미티브는 components/diagram-flow.tsx 에서 가져온다.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Panel,
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
import type { ProjectDiagram as ProjectDiagramData } from "@/data/projects";
import {
  ACCENT,
  MUTED,
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

const nodeTypes = { card: DiagramCard, groupFrame: GroupFrame };
const edgeTypes = { flow: FlowEdge };

function buildGraph(diagram: ProjectDiagramData, locale: Locale) {
  const hasGroups = !!diagram.groups?.length;
  const cards: Node[] = diagram.nodes.map((n) => ({
    id: n.id,
    type: "card",
    position: { x: n.col * COL_W, y: n.row * ROW_H },
    draggable: false,
    selectable: false,
    // 그룹 프레임이 있을 때만 명시 z-순서: 프레임(0) < 엣지(5) < 카드(10).
    // (그룹 없는 다이어그램은 기존 기본 z 유지 → 시각 변화 없음)
    zIndex: hasGroups ? 10 : undefined,
    data: {
      label: pick(n.label, locale),
      sublabel: n.sublabel ? pick(n.sublabel, locale) : undefined,
      icon: n.icon,
      kind: n.kind ?? "layer",
      cat: n.cat,
    },
  }));

  const edges = buildFlowEdges(diagram.edges, locale).map((e) =>
    hasGroups ? { ...e, zIndex: 5 } : e
  );

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
