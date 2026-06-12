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
  type CardData,
  type FlowEdgeData,
} from "@/components/diagram-flow";
import {
  useDiagramFullscreen,
  DiagramFullscreenButton,
  FS_EXPANDED_STYLE,
} from "@/components/diagram-fullscreen";
import { cn } from "@/lib/utils";

const nodeTypes = { card: DiagramCard };
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

  const edges = buildFlowEdges(diagram.edges, locale);

  return { nodes, edges };
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
  const rfRef = useRef<ReactFlowInstance<Node<CardData>, Edge<FlowEdgeData>> | null>(null);
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
