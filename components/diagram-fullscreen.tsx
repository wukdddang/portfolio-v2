"use client";

/**
 * 다이어그램 전체화면 — React Flow 캔버스를 브라우저 전체화면으로 확대.
 *
 * 메커니즘: 네이티브 Fullscreen API로 컨테이너를 top-layer에 올린다. 그러면 조상의
 * transform(motion.div·xl:-translate-x-1/2 등)이 만드는 containing block을 무시하고
 * 화면을 덮는다 — 단순 `position:fixed`는 그 transform 때문에 어긋난다.
 * API 거부/미지원 시 fixed inset-0 오버레이로 폴백(Esc·body 스크롤 잠금 포함).
 *
 * 사용:
 *   const fs = useDiagramFullscreen();
 *   <div ref={fs.ref} style={fs.expanded ? FS_EXPANDED_STYLE : undefined} className={base}>
 *     <ReactFlow ...>
 *       <Panel position="top-right">
 *         <DiagramFullscreenButton expanded={fs.expanded} onToggle={fs.toggle} locale={locale} />
 *       </Panel>
 *     </ReactFlow>
 *   </div>
 * 전체화면 진입/이탈 시 fitView는 호출부에서 fs.expanded 변화를 보고 재호출한다.
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { pick, type L } from "@/data/i18n";
import type { Locale } from "@/i18n/routing";

// 전체화면일 때 컨테이너에 적용하는 인라인 스타일.
// inset:0 으로 화면을 채우고(네이티브 FS의 UA 크기·base 높이 무시), transform/translate를
// 제거해 PlatformDiagram의 xl:-translate-x-1/2 등 잔여 변환을 확실히 무력화한다.
export const FS_EXPANDED_STYLE: CSSProperties = {
  position: "fixed",
  inset: 0,
  // width/height를 명시해야 컨테이너의 Tailwind h-[680px]/xl:w-[...] 클래스를 덮어
  // 화면 전체를 채운다 (inset:0만으로는 고정 height 클래스가 이김).
  width: "100vw",
  height: "100vh",
  maxWidth: "none",
  transform: "none",
  translate: "none",
  borderRadius: 0,
  border: "none",
  zIndex: 120,
};

const STR = {
  enter: { ko: "전체화면", en: "Fullscreen" },
  exit: { ko: "닫기", en: "Exit" },
} satisfies Record<string, L>;

type FSDoc = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => void;
};
type FSEl = HTMLElement & { webkitRequestFullscreen?: () => void };

export function useDiagramFullscreen() {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const fallback = useRef(false); // 네이티브 FS 없이 CSS 오버레이로 떠 있는지

  // 네이티브 fullscreen 상태와 동기화 (Esc·F11로 빠져나가는 경우 포함)
  useEffect(() => {
    const onChange = () => {
      const d = document as FSDoc;
      const fsEl = document.fullscreenElement ?? d.webkitFullscreenElement ?? null;
      if (fsEl) setExpanded(fsEl === ref.current);
      else if (!fallback.current) setExpanded(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const enter = useCallback(() => {
    const el = ref.current as FSEl | null;
    if (!el) return;
    const req = el.requestFullscreen ?? el.webkitRequestFullscreen;
    if (req) {
      // requestFullscreen은 거부 시 reject → CSS 오버레이로 폴백
      Promise.resolve(req.call(el)).catch(() => {
        fallback.current = true;
        setExpanded(true);
      });
    } else {
      fallback.current = true;
      setExpanded(true);
    }
  }, []);

  const exit = useCallback(() => {
    const d = document as FSDoc;
    if (document.fullscreenElement ?? d.webkitFullscreenElement) {
      (document.exitFullscreen ?? d.webkitExitFullscreen)?.call(document);
    }
    fallback.current = false;
    setExpanded(false);
  }, []);

  const toggle = useCallback(() => {
    if (expanded) exit();
    else enter();
  }, [expanded, enter, exit]);

  // CSS 폴백 모드에서만 Esc 처리 + body 스크롤 잠금 (네이티브 FS는 브라우저가 처리)
  useEffect(() => {
    if (!expanded || !fallback.current) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        fallback.current = false;
        setExpanded(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  return { ref, expanded, enter, exit, toggle };
}

export function DiagramFullscreenButton({
  expanded,
  onToggle,
  locale,
}: {
  expanded: boolean;
  onToggle: () => void;
  locale: Locale;
}) {
  const label = pick(expanded ? STR.exit : STR.enter, locale);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={label}
      title={label}
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 font-mono text-[11px] text-[var(--muted)] shadow-sm transition-colors hover:border-[var(--accent)]/55 hover:text-[var(--foreground)]"
    >
      {expanded ? (
        // close (x)
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      ) : (
        // maximize (four corners)
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
      )}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
