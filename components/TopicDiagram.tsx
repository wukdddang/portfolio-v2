/**
 * TopicDiagram — 학습 토픽 문서(/studies/{slug}/{topic}) 안의 경량 도식.
 * 위키의 Mermaid를 사이트 시각 언어(카테고리 색 박스 + 화살표·표·수식)로 옮겨, 번들에
 * @xyflow/mermaid를 싣지 않고 순수 DOM/SVG로 그린다. 서버 컴포넌트(상호작용 없음).
 */

import katex from "katex";
import { ChevronRight, ChevronDown } from "lucide-react";
import type { Diagram, DiagramNode } from "@/data/studies";
import type { Locale } from "@/i18n/routing";
import { pick } from "@/data/i18n";

/** LaTeX → HTML (서버 렌더). displayMode=true는 논문식 블록 수식. */
function tex(src: string, displayMode: boolean) {
  return katex.renderToString(src, { displayMode, throwOnError: false, output: "html" });
}

function toneColor(tone: DiagramNode["tone"], fallback: string): string {
  if (tone === "accent") return "var(--accent)";
  if (tone === "muted") return "var(--muted)";
  if (typeof tone === "number") return `var(--cat-${tone})`;
  return fallback;
}

function NodeBox({ node, locale, fallback }: { node: DiagramNode; locale: Locale; fallback: string }) {
  const color = toneColor(node.tone, fallback);
  return (
    <div
      className="flex min-w-0 flex-col gap-0.5 rounded-lg border px-3 py-2 text-center"
      style={{
        borderColor: `color-mix(in oklch, ${color} 50%, var(--border))`,
        backgroundColor: `color-mix(in oklch, ${color} 9%, var(--card))`,
      }}
    >
      <span className="text-[13px] font-semibold leading-snug">
        {node.icon && <span className="mr-1">{node.icon}</span>}
        {pick(node.label, locale)}
      </span>
      {node.sub && (
        <span className="font-mono text-[10px] leading-snug text-[var(--muted)]">{pick(node.sub, locale)}</span>
      )}
    </div>
  );
}

function Caption({ text }: { text: string }) {
  return <figcaption className="mt-2.5 text-center font-mono text-[10px] text-[var(--muted)]">{text}</figcaption>;
}

export function TopicDiagram({
  diagram,
  locale,
  catColor,
}: {
  diagram: Diagram;
  locale: Locale;
  catColor: string;
}) {
  if (diagram.kind === "flow") {
    const row = diagram.dir !== "col";
    return (
      <figure className="my-5 rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-4">
        <div
          className={
            row
              ? "flex flex-col items-stretch gap-2 sm:flex-row sm:items-center"
              : "flex flex-col items-stretch gap-2"
          }
        >
          {diagram.nodes.map((n, i) => (
            <div
              key={i}
              className={row ? "flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-2" : "contents"}
            >
              <div className={row ? "flex-1" : undefined}>
                <NodeBox node={n} locale={locale} fallback={catColor} />
              </div>
              {i < diagram.nodes.length - 1 &&
                (row ? (
                  <>
                    <ChevronRight className="mx-auto hidden size-4 shrink-0 text-[var(--accent)] sm:block" />
                    <ChevronDown className="mx-auto size-4 shrink-0 text-[var(--accent)] sm:hidden" />
                  </>
                ) : (
                  <ChevronDown className="mx-auto size-4 shrink-0 text-[var(--accent)]" />
                ))}
            </div>
          ))}
        </div>
        {diagram.caption && <Caption text={pick(diagram.caption, locale)} />}
      </figure>
    );
  }

  if (diagram.kind === "branch") {
    return (
      <figure className="my-5 rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full max-w-[16rem]">
            <NodeBox node={diagram.root} locale={locale} fallback={catColor} />
          </div>
          <ChevronDown className="size-4 text-[var(--accent)]" />
          <div className="grid w-full gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {diagram.children.map((c, i) => (
              <NodeBox key={i} node={c} locale={locale} fallback={catColor} />
            ))}
          </div>
        </div>
        {diagram.caption && <Caption text={pick(diagram.caption, locale)} />}
      </figure>
    );
  }

  if (diagram.kind === "compare") {
    return (
      <figure className="my-5 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]/40">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr>
              {diagram.headers.map((h, i) => (
                <th
                  key={i}
                  className="border-b border-[var(--border)] px-3 py-2 font-semibold"
                  style={i === 0 ? undefined : { color: catColor }}
                >
                  {pick(h, locale)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {diagram.rows.map((r, ri) => (
              <tr key={ri} className="align-top">
                {r.map((cell, ci) => (
                  <td
                    key={ci}
                    className={
                      ci === 0
                        ? "border-t border-[var(--border)]/60 px-3 py-2 font-medium text-[var(--foreground)]"
                        : "border-t border-[var(--border)]/60 px-3 py-2 text-[var(--card-foreground)]"
                    }
                  >
                    {pick(cell, locale)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {diagram.caption && (
          <div className="px-3 pb-2.5">
            <Caption text={pick(diagram.caption, locale)} />
          </div>
        )}
      </figure>
    );
  }

  // formula — 논문식 LaTeX 렌더(KaTeX)
  return (
    <figure className="my-5 rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-5 text-center">
      <div
        className="topic-eq overflow-x-auto rounded-lg px-4 py-3.5"
        style={{ color: "var(--foreground)", backgroundColor: `color-mix(in oklch, ${catColor} 7%, transparent)` }}
        dangerouslySetInnerHTML={{ __html: tex(diagram.expr, true) }}
      />
      {diagram.legend && diagram.legend.length > 0 && (
        <dl className="mx-auto mt-3.5 flex max-w-md flex-wrap justify-center gap-x-5 gap-y-1.5 text-left">
          {diagram.legend.map((l, i) => (
            <div key={i} className="flex items-baseline gap-1.5">
              <dt
                className="topic-eq-inline shrink-0"
                style={{ color: catColor }}
                dangerouslySetInnerHTML={{ __html: tex(l.sym, false) }}
              />
              <dd className="text-[11px] text-[var(--muted)]">{pick(l.desc, locale)}</dd>
            </div>
          ))}
        </dl>
      )}
      {diagram.caption && <Caption text={pick(diagram.caption, locale)} />}
    </figure>
  );
}
