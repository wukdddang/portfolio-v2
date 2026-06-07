import * as React from "react";

/**
 * 인라인 마크다운 렌더러 — `**bold**` · `*emphasis*` · `` `code` ``만 처리.
 * 한국어 본문에서 이탤릭은 어색하므로 `*emphasis*`는 이탤릭 대신 accent 컬러로 강조.
 * 다중 라인은 처리하지 않음 (인라인 강조 전용).
 */

// 토큰 우선순위: 강한 → 약한 (**bold**가 *italic*보다 먼저 매칭되어야 함)
const TOKEN = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g;

export function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  const parts = text.split(TOKEN);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong
          key={i}
          className="font-semibold text-[var(--foreground)]"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em
          key={i}
          className="not-italic font-medium text-[var(--accent)]"
        >
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={i}
          className="font-mono text-[0.9em] px-1.5 py-0.5 rounded bg-[var(--subtle)] text-[var(--card-foreground)]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

/** Convenience wrapper component. */
export function Md({ children }: { children: string | null | undefined }) {
  if (!children) return null;
  return <>{renderInlineMarkdown(children)}</>;
}
