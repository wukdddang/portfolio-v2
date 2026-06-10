"use client";

/**
 * LayerDiagramDisclosure — 통합 캔버스(PlatformDiagram)가 있는 페이지에서
 * 레이어 *개별* 다이어그램을 제공한다.
 *
 * 기본 펼침: 통합 캔버스(개요) 아래에 각 레이어 클로즈업이 펼쳐진 자연스러운
 * 문서 흐름. 접기 토글은 남겨 스크롤을 줄이고 싶을 때 접을 수 있고, 접어둔
 * 레이어라도 #slug 딥링크/해시 이동이 오면 다시 펼친다.
 *
 * 성능: 이 페이지엔 통합 캔버스까지 React Flow가 여럿 — viewport 근처(rootMargin)
 * 에 들어와야 ReactFlow를 마운트(lazy)해 초기 로드의 다중 마운트·SMIL 부하를 푼다.
 * 마운트 전엔 동일 높이 placeholder로 스크롤 점프를 막는다.
 */

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { ProjectDiagram as ProjectDiagramData } from "@/data/projects";
import { ProjectDiagram } from "@/components/ProjectDiagram";
import { cn } from "@/lib/utils";

export function LayerDiagramDisclosure({
  slug,
  diagram,
}: {
  slug: string;
  diagram: ProjectDiagramData;
}) {
  const t = useTranslations("projectDetail");
  const [open, setOpen] = useState(true);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 딥링크/해시 이동 대상 레이어는 IO와 무관하게 즉시 펼치고 마운트한다.
    // (사용자가 보려는 대상 — IO 초기 콜백이 안 오는 백그라운드 탭에서도 확실히 표시)
    const onHash = () => {
      if (window.location.hash === `#${slug}`) {
        setOpen(true);
        setInView(true);
      }
    };
    onHash();
    window.addEventListener("hashchange", onHash);

    // 그 외 레이어는 viewport 근처(rootMargin)에 들어와야 마운트 — 다중 React Flow
    // 동시 마운트를 피하는 lazy 게이트. visible 탭에서만 발화하지만, 위 딥링크 경로가
    // "꼭 봐야 하는" 레이어를 이미 커버하므로 lazy가 핵심 기능을 막지 않는다.
    const el = ref.current;
    let io: IntersectionObserver | undefined;
    if (el) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            io?.disconnect();
          }
        },
        { rootMargin: "300px 0px" }
      );
      io.observe(el);
    }
    return () => {
      window.removeEventListener("hashchange", onHash);
      io?.disconnect();
    };
  }, [slug]);

  return (
    <div
      ref={ref}
      className={cn(
        "mb-8 rounded-xl border bg-[var(--card)] transition-colors",
        open ? "border-[var(--accent)]/40" : "border-[var(--border)]"
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
          {t("architecture")}
        </span>
        <span className="flex items-center gap-3">
          <span className="hidden font-mono text-[10px] text-[var(--muted)] sm:block">
            {open ? t("diagramHint") : t("layerDiagramExpand")}
          </span>
          <span
            className={cn(
              "shrink-0 font-mono text-sm text-[var(--muted)] transition-transform",
              open && "rotate-45"
            )}
          >
            +
          </span>
        </span>
      </button>
      {open && (
        <div className="border-t border-[var(--border)] px-5 pb-5 pt-4">
          {inView ? (
            <ProjectDiagram diagram={diagram} headerless />
          ) : (
            <div className="flex h-[520px] items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] md:h-[640px]">
              {t("architecture")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
