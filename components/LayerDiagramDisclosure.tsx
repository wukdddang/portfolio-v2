"use client";

/**
 * LayerDiagramDisclosure — 통합 캔버스(PlatformDiagram)가 있는 페이지에서
 * 레이어 *개별* 다이어그램을 접힌 상태로 제공한다.
 *
 * 순차 독자는 같은 그림(통합 캔버스에 중첩된 레이어)을 두 번 보지 않고,
 * 딥링크(#slug — 메인 파이프라인 카드·외부 공유)로 도착한 독자는 제자리에서
 * 자동으로 펼쳐진 구조도를 본다. React Flow는 펼칠 때만 마운트(온디맨드 렌더).
 * 토글 행 스타일은 같은 페이지 Q&A <details> 패턴(+ 회전, accent 보더)을 따른다.
 */

import { useEffect, useState } from "react";
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
  const [open, setOpen] = useState(false);

  // URL 해시가 이 레이어를 가리키면 자동 펼침 — 초기 로드 + 페이지 내 해시 이동 모두
  useEffect(() => {
    const sync = () => {
      if (window.location.hash === `#${slug}`) setOpen(true);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [slug]);

  return (
    <div
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
          <ProjectDiagram diagram={diagram} headerless />
        </div>
      )}
    </div>
  );
}
