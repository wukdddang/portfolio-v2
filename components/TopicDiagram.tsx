/**
 * TopicDiagram — 학습 토픽 문서(/studies/{slug}/{topic}) 안의 경량 도식.
 * 위키의 Mermaid를 사이트 시각 언어(카테고리 색 박스 + 화살표·표·수식)로 옮겨, 번들에
 * @xyflow/mermaid를 싣지 않고 순수 DOM/SVG로 그린다. 서버 컴포넌트(상호작용 없음).
 */

import { Fragment } from "react";
import katex from "katex";
import { ArrowRight, ArrowDown } from "lucide-react";
import type { Diagram, DiagramNode, PlotCurve, LatticePanel, JunctionState } from "@/data/studies";
import type { Locale } from "@/i18n/routing";
import { pick } from "@/data/i18n";
import { cn } from "@/lib/utils";

/** LaTeX → HTML (서버 렌더). displayMode=true는 논문식 블록 수식. */
function tex(src: string, displayMode: boolean) {
  return katex.renderToString(src, { displayMode, throwOnError: false, output: "html" });
}

/**
 * RichText — 본문 텍스트 안의 인라인 수식을 KaTeX로 렌더한다.
 * "$...$"로 감싼 부분만 수식이고 나머지는 평문. 학습 노트의 bullet·TL;DR·함정에 쓴다.
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/\$([^$]+)\$/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} className="topic-eq-inline" dangerouslySetInnerHTML={{ __html: tex(p, false) }} />
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

/** plot 곡선 — x∈[0,1] → y∈[0,1] (y=1이 위). 정밀 데이터가 아니라 개념 모양만 표현. */
function curveY(curve: PlotCurve, x: number): number {
  switch (curve) {
    case "sine":
      return 0.5 + 0.4 * Math.sin(2 * Math.PI * 1.5 * x);
    case "dc":
      return 0.72;
    case "decay":
      return 0.92 / (1 + 7 * x);
    case "rise":
      return 0.08 + 0.84 * x;
    case "lowpass":
      return x < 0.42 ? 0.82 : (0.82 * 0.46) / (x + 0.04);
    case "rectified":
      return 0.12 + 0.72 * Math.abs(Math.sin(2 * Math.PI * 1.5 * x));
    case "pulse":
      return Math.floor(x * 6) % 2 === 0 ? 0.78 : 0.16;
    case "chirp": {
      // 주파수가 시간에 따라 선형 증가하는 처프 — 위상 = 2π(f0·x + k·x²)
      const phase = 2 * Math.PI * (0.6 * x + 2.6 * x * x);
      return 0.5 + 0.4 * Math.sin(phase);
    }
    case "compressed": {
      // 압축된 첨두 — 중앙에 좁고 높은 sinc 메인로브 + 작은 사이드로브
      const t = x - 0.5;
      const s = 13 * Math.PI * t;
      const sinc = Math.abs(t) < 1e-4 ? 1 : Math.sin(s) / s;
      return 0.16 + 0.76 * sinc;
    }
    case "trr": {
      // 다이오드 역회복 — 순방향 전류(높음)→0 통과→역방향 언더슈트→회복. y=0.5가 전류 0.
      if (x < 0.38) return 0.8;
      if (x < 0.5) return 0.8 - ((x - 0.38) / 0.12) * 0.64; // 0.8 → 0.16
      if (x < 0.74) return 0.16 + (1 - Math.exp(-(x - 0.5) * 12)) * 0.34; // 0.16 → ~0.5
      return 0.5;
    }
    case "wrap":
      // 위상 래핑 톱니 — 0→1 반복(간섭무늬 fringe)
      return 0.1 + 0.8 * ((x * 4) % 1);
    case "charge":
      // RC 충전 — 1 − e^(−t)
      return 0.12 + 0.8 * (1 - Math.exp(-3.4 * x));
    default:
      return 0.5;
  }
}

/** 곡선을 SVG path(d)로 변환. pulse는 계단이라 촘촘히 샘플링한다. */
function plotPath(curve: PlotCurve, padL: number, padT: number, pw: number, ph: number): string {
  const n = curve === "pulse" || curve === "wrap" ? 240 : 72;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const x = i / n;
    const y = curveY(curve, x);
    const px = padL + x * pw;
    const py = padT + (1 - y) * ph;
    d += (i === 0 ? "M" : "L") + px.toFixed(1) + " " + py.toFixed(1) + " ";
  }
  return d;
}

function toneColor(tone: DiagramNode["tone"], fallback: string): string {
  if (tone === "accent") return "var(--accent)";
  if (tone === "muted") return "var(--muted)";
  if (typeof tone === "number") return `var(--cat-${tone})`;
  return fallback;
}

function NodeBox({
  node,
  locale,
  fallback,
  className,
}: {
  node: DiagramNode;
  locale: Locale;
  fallback: string;
  className?: string;
}) {
  const color = toneColor(node.tone, fallback);
  return (
    <div
      className={cn("flex min-w-0 flex-col justify-center gap-0.5 rounded-lg border px-3 py-2 text-center", className)}
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

/* ─── lattice — 도핑 결정 그림 (Si 격자 + 도펀트 + 자유 캐리어) ─────────────── */
const LATTICE_COLS = [34, 73, 112, 151];
const LATTICE_ROWS = [34, 70, 106];
const LATTICE_DOP_C = 1; // 도펀트 격자 위치 (col, row)
const LATTICE_DOP_R = 1;

function LatticePanelSvg({ panel, locale }: { panel: LatticePanel; locale: Locale }) {
  const isN = panel.type === "n";
  const color = isN ? "var(--cat-3)" : "var(--cat-5)"; // N형=파랑(전자) · P형=주황(정공)
  const dx = LATTICE_COLS[LATTICE_DOP_C];
  const dy = LATTICE_ROWS[LATTICE_DOP_R];
  const carrierX = dx + 27;
  const carrierY = dy - 24;
  return (
    <div
      className="flex min-w-0 flex-1 flex-col items-center gap-2 rounded-lg border px-3 py-3"
      style={{
        borderColor: `color-mix(in oklch, ${color} 45%, var(--border))`,
        backgroundColor: `color-mix(in oklch, ${color} 7%, var(--card))`,
      }}
    >
      <span className="text-[13px] font-semibold leading-snug">{pick(panel.label, locale)}</span>
      <svg viewBox="0 0 185 140" className="w-full max-w-[200px]" role="img" aria-label={pick(panel.label, locale)}>
        {/* 공유 결합선 */}
        {LATTICE_ROWS.map((y, ri) =>
          LATTICE_COLS.map((x, ci) => (
            <g key={`b${ri}-${ci}`} stroke="var(--border)" strokeWidth="1">
              {ci < LATTICE_COLS.length - 1 && <line x1={x} y1={y} x2={LATTICE_COLS[ci + 1]} y2={y} />}
              {ri < LATTICE_ROWS.length - 1 && <line x1={x} y1={y} x2={x} y2={LATTICE_ROWS[ri + 1]} />}
            </g>
          )),
        )}
        {/* 원자 — 도펀트 1개만 색칠 */}
        {LATTICE_ROWS.map((y, ri) =>
          LATTICE_COLS.map((x, ci) => {
            const dop = ci === LATTICE_DOP_C && ri === LATTICE_DOP_R;
            return (
              <g key={`a${ri}-${ci}`}>
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill={dop ? `color-mix(in oklch, ${color} 82%, var(--card))` : "var(--card)"}
                  stroke={dop ? color : "var(--muted)"}
                  strokeWidth={dop ? 2 : 1}
                />
                <text
                  x={x}
                  y={y + 3.5}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight={dop ? 700 : 400}
                  fill={dop ? "var(--card)" : "var(--muted)"}
                  className="font-mono"
                >
                  {dop ? panel.dopant : "Si"}
                </text>
              </g>
            );
          }),
        )}
        {/* 자유 캐리어 — N형: 자유 전자(채움 −) · P형: 정공(빈자리 +) */}
        {isN ? (
          <g>
            <line x1={dx} y1={dy} x2={carrierX} y2={carrierY} stroke={color} strokeWidth="1" strokeDasharray="2 2" />
            <circle cx={carrierX} cy={carrierY} r="8" fill={color} />
            <text x={carrierX} y={carrierY + 3.5} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--card)">
              −
            </text>
          </g>
        ) : (
          <g>
            <circle cx={carrierX} cy={carrierY} r="8" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2.5 2" />
            <text x={carrierX} y={carrierY + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>
              +
            </text>
          </g>
        )}
      </svg>
      <span className="text-center font-mono text-[10px] leading-snug text-[var(--muted)]">{pick(panel.carrier, locale)}</span>
    </div>
  );
}

/* ─── junction — PN 접합 단면도 (bias별 공핍층 폭) ──────────────────────────── */
const DEPL_W: Record<JunctionState["bias"], number> = { eq: 48, forward: 22, reverse: 86 };

function carrierPts(xa: number, xb: number, count: number): { x: number; y: number }[] {
  const ys = [25, 43];
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    pts.push({ x: xa + t * (xb - xa), y: ys[i % 2] });
  }
  return pts;
}

function JunctionStateSvg({ state, locale }: { state: JunctionState; locale: Locale }) {
  const pColor = "var(--cat-5)"; // P형 — 주황(정공 +)
  const nColor = "var(--cat-3)"; // N형 — 파랑(전자 −)
  const x0 = 12, x1 = 288, mid = 150, top = 14, h = 40, bot = top + h;
  const dw = DEPL_W[state.bias];
  const dL = mid - dw / 2;
  const dR = mid + dw / 2;
  const holes = carrierPts(x0 + 8, dL - 8, state.bias === "reverse" ? 5 : 6);
  const elecs = carrierPts(dR + 8, x1 - 8, state.bias === "reverse" ? 5 : 6);
  const fwd = state.bias === "forward";
  const rev = state.bias === "reverse";
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)]/40 px-3 py-2.5">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-[12px] font-semibold">{pick(state.label, locale)}</span>
        {state.sub && <span className="font-mono text-[10px] text-[var(--muted)]">{pick(state.sub, locale)}</span>}
      </div>
      <svg viewBox="0 0 300 96" className="w-full" role="img" aria-label={pick(state.label, locale)}>
        {/* 영역 채움 */}
        <rect x={x0} y={top} width={dL - x0} height={h} fill={`color-mix(in oklch, ${pColor} 15%, var(--card))`} />
        <rect x={dR} y={top} width={x1 - dR} height={h} fill={`color-mix(in oklch, ${nColor} 15%, var(--card))`} />
        {/* 공핍층 — 캐리어 없는 영역(빗금) */}
        <rect x={dL} y={top} width={dw} height={h} fill="color-mix(in oklch, var(--muted) 10%, var(--card))" />
        {[0.28, 0.5, 0.72].map((f, i) => (
          <line key={i} x1={dL + dw * f} y1={top} x2={dL + dw * f} y2={bot} stroke="var(--border)" strokeWidth="1" />
        ))}
        <rect x={x0} y={top} width={x1 - x0} height={h} fill="none" stroke="var(--border)" strokeWidth="1" rx="3" />
        {/* 영역 글자 */}
        <text x={(x0 + dL) / 2} y={top + h / 2 + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill={`color-mix(in oklch, ${pColor} 70%, var(--foreground))`}>P</text>
        <text x={(dR + x1) / 2} y={top + h / 2 + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill={`color-mix(in oklch, ${nColor} 70%, var(--foreground))`}>N</text>
        {/* 정공(+) · 전자(−) */}
        {holes.map((p, i) => (
          <g key={`h${i}`}>
            <circle cx={p.x} cy={p.y} r="5.5" fill="none" stroke={pColor} strokeWidth="1.3" />
            <text x={p.x} y={p.y + 3} textAnchor="middle" fontSize="9" fontWeight="700" fill={pColor}>+</text>
          </g>
        ))}
        {elecs.map((p, i) => (
          <g key={`e${i}`}>
            <circle cx={p.x} cy={p.y} r="5.5" fill={nColor} />
            <text x={p.x} y={p.y + 3} textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--card)">−</text>
          </g>
        ))}
        {/* 고정 이온 — 공핍층(P쪽 음이온 ⊖ · N쪽 양이온 ⊕) */}
        {dw >= 30 && (
          <>
            <text x={(dL + mid) / 2} y={top + 16} textAnchor="middle" fontSize="11" fill="var(--muted)">⊖</text>
            <text x={(dL + mid) / 2} y={top + 33} textAnchor="middle" fontSize="11" fill="var(--muted)">⊖</text>
            <text x={(mid + dR) / 2} y={top + 16} textAnchor="middle" fontSize="11" fill="var(--muted)">⊕</text>
            <text x={(mid + dR) / 2} y={top + 33} textAnchor="middle" fontSize="11" fill="var(--muted)">⊕</text>
          </>
        )}
        {/* 바이어스 단자 + 전류 표시 */}
        {!rev && fwd && (
          <line x1={mid - 30} y1={top + h / 2} x2={mid + 30} y2={top + h / 2} stroke="var(--cat-6)" strokeWidth="2" markerEnd="url(#jflow)" />
        )}
        <defs>
          <marker id="jflow" markerWidth="7" markerHeight="7" refX="5" refY="3.2" orient="auto">
            <path d="M0 0 L6 3.2 L0 6.4 Z" fill="var(--cat-6)" />
          </marker>
        </defs>
        {state.bias !== "eq" && (
          <>
            <text x={x0 + 18} y={bot + 19} textAnchor="middle" fontSize="13" fontWeight="700" fill={fwd ? "var(--cat-5)" : "var(--cat-3)"}>{fwd ? "+" : "−"}</text>
            <text x={x1 - 18} y={bot + 19} textAnchor="middle" fontSize="13" fontWeight="700" fill={fwd ? "var(--cat-3)" : "var(--cat-5)"}>{fwd ? "−" : "+"}</text>
            <text x={mid} y={bot + 19} textAnchor="middle" fontSize="9" fill="var(--muted)" className="font-mono">
              {fwd ? "도통" : "차단"}
            </text>
            <line x1={x0 + 18} y1={bot + 2} x2={x0 + 18} y2={bot + 10} stroke="var(--muted)" strokeWidth="1" />
            <line x1={x1 - 18} y1={bot + 2} x2={x1 - 18} y2={bot + 10} stroke="var(--muted)" strokeWidth="1" />
          </>
        )}
      </svg>
    </div>
  );
}

/* ─── iv — 다이오드 I-V 특성 곡선 (4상한) ───────────────────────────────────── */
function ivForwardPath(cx: number, cy: number, xVf: number, xR: number, up: number): string {
  let d = `M ${cx} ${cy} L ${xVf} ${cy} `;
  const n = 28;
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const x = xVf + t * (xR - xVf);
    const y = cy - up * ((Math.exp(2.6 * t) - 1) / (Math.exp(2.6) - 1));
    d += `L ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
}

/* ─── phasor — 복소평면(I/Q) 위상자 ────────────────────────────────────────── */
function phasorTip(cx: number, cy: number, R: number, angleDeg: number, mag: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + mag * R * Math.cos(rad), y: cy - mag * R * Math.sin(rad), rad };
}

function arrowHead(tx: number, ty: number, rad: number, color: string, key: string) {
  const ux = Math.cos(rad), uy = -Math.sin(rad);
  const bx = tx - 10 * ux, by = ty - 10 * uy;
  const px = -uy, py = ux;
  return <polygon key={key} points={`${tx},${ty} ${(bx + 4.5 * px).toFixed(1)},${(by + 4.5 * py).toFixed(1)} ${(bx - 4.5 * px).toFixed(1)},${(by - 4.5 * py).toFixed(1)}`} fill={color} />;
}

function PhasorFigure({ diagram, locale, catColor }: { diagram: Extract<Diagram, { kind: "phasor" }>; locale: Locale; catColor: string }) {
  const cx = 132, cy = 100, R = 74;
  const single = diagram.mode !== "interf";
  const v0 = diagram.vectors[0];
  return (
    <figure className="my-5 rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-4">
      <svg viewBox="0 0 264 200" className="mx-auto block w-full max-w-[320px]" role="img" aria-label={diagram.caption ? pick(diagram.caption, locale) : "phasor"}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <line x1={cx - R - 16} y1={cy} x2={cx + R + 16} y2={cy} stroke="var(--muted)" strokeWidth="1" />
        <line x1={cx} y1={cy + R + 16} x2={cx} y2={cy - R - 16} stroke="var(--muted)" strokeWidth="1" />
        <text x={cx + R + 18} y={cy + 11} fontSize="10" fill="var(--muted)" className="font-mono">I</text>
        <text x={cx + 4} y={cy - R - 8} fontSize="10" fill="var(--muted)" className="font-mono">Q</text>
        {single && v0 && (() => {
          const { x, y, rad } = phasorTip(cx, cy, R, v0.angleDeg, v0.mag ?? 1);
          const col = toneColor(v0.tone, catColor);
          const arcR = 26;
          const ex = cx + arcR * Math.cos(rad), ey = cy - arcR * Math.sin(rad);
          return (
            <g>
              <line x1={x} y1={y} x2={x} y2={cy} stroke={col} strokeWidth="1" strokeDasharray="3 3" opacity="0.65" />
              <line x1={x} y1={y} x2={cx} y2={y} stroke={col} strokeWidth="1" strokeDasharray="3 3" opacity="0.65" />
              <circle cx={x} cy={cy} r="2.5" fill={col} />
              <circle cx={cx} cy={y} r="2.5" fill={col} />
              <text x={x} y={cy + 13} textAnchor="middle" fontSize="9" fill={col} className="font-mono">I=A·cosθ</text>
              <text x={cx - 6} y={y - 3} textAnchor="end" fontSize="9" fill={col} className="font-mono">Q=A·sinθ</text>
              <path d={`M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 0 0 ${ex.toFixed(1)} ${ey.toFixed(1)}`} fill="none" stroke="var(--muted)" strokeWidth="1" />
              <text x={cx + arcR + 7} y={cy - 6} fontSize="10" fill="var(--muted)" className="font-mono">θ</text>
            </g>
          );
        })()}
        {diagram.vectors.map((v, i) => {
          const { x, y, rad } = phasorTip(cx, cy, R, v.angleDeg, v.mag ?? 1);
          const col = toneColor(v.tone, catColor);
          const right = Math.cos(rad) >= 0;
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke={col} strokeWidth="2" strokeDasharray={v.dashed ? "4 3" : undefined} />
              {arrowHead(x, y, rad, col, `ah${i}`)}
              <text x={x + (right ? 7 : -7)} y={y + (Math.sin(rad) >= 0 ? -6 : 13)} textAnchor={right ? "start" : "end"} fontSize="10" fontWeight="600" fill={col} className="font-mono">{pick(v.label, locale)}</text>
            </g>
          );
        })}
      </svg>
      {diagram.caption && <Caption text={pick(diagram.caption, locale)} />}
    </figure>
  );
}

/* ─── scene — SAR 관측 기하 (합성개구 / 서브스왓) ─────────────────────────────── */
function SceneFigure({ diagram, locale, catColor }: { diagram: Extract<Diagram, { kind: "scene" }>; locale: Locale; catColor: string }) {
  const T = (ko: string, en: string) => (locale === "ko" ? ko : en);
  return (
    <figure className="my-5 rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-4">
      <svg viewBox="0 0 320 196" className="w-full" role="img" aria-label={diagram.caption ? pick(diagram.caption, locale) : "SAR geometry"}>
        <defs>
          <marker id="scarrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L7 4 L0 8 Z" fill="var(--muted)" />
          </marker>
        </defs>
        {diagram.variant === "aperture" ? (
          <>
            {/* 비행 궤적 (Azimuth) */}
            <line x1={40} y1={34} x2={270} y2={34} stroke="var(--muted)" strokeWidth="1.5" markerEnd="url(#scarrow)" />
            <text x={316} y={31} textAnchor="end" fontSize="9" fill="var(--muted)" className="font-mono">{T("진행 Azimuth →", "track Azimuth →")}</text>
            {/* 합성개구 브레이스 */}
            <line x1={64} y1={20} x2={244} y2={20} stroke={catColor} strokeWidth="1" />
            <line x1={64} y1={16} x2={64} y2={24} stroke={catColor} strokeWidth="1" />
            <line x1={244} y1={16} x2={244} y2={24} stroke={catColor} strokeWidth="1" />
            <text x={154} y={13} textAnchor="middle" fontSize="9" fill={catColor} className="font-mono">{T("합성 개구 ≈ 가상 수 km 안테나", "synthetic aperture ≈ virtual km antenna")}</text>
            {/* 위성 3개 위치 + 표적 + 거리 */}
            {[{ x: 64, r: "R₁" }, { x: 154, r: "R₂" }, { x: 244, r: "R₃" }].map((s, i) => (
              <g key={i}>
                <line x1={s.x} y1={40} x2={158} y2={158} stroke={i === 1 ? catColor : "var(--border)"} strokeWidth="1" strokeDasharray={i === 1 ? undefined : "3 2"} />
                <rect x={s.x - 7} y={28} width={14} height={11} rx={2} fill={`color-mix(in oklch, ${catColor} 22%, var(--card))`} stroke={catColor} strokeWidth="1" />
                <text x={s.x + (i === 0 ? -9 : i === 2 ? 9 : 0)} y={i === 1 ? 96 : 92} textAnchor="middle" fontSize="9" fill={i === 1 ? catColor : "var(--muted)"} className="font-mono">{s.r}</text>
              </g>
            ))}
            <text x={158} y={176} textAnchor="middle" fontSize="9" fill="var(--cat-6)" className="font-mono">▲ {T("동일 표적", "same target")}</text>
            <polygon points="158,150 152,160 164,160" fill="var(--cat-6)" />
            <text x={40} y={120} fontSize="8.5" fill="var(--muted)" className="font-mono">{T("거리 R₁≠R₂≠R₃ → 위상차 → 위상정렬 합산", "ranges differ → phase diff → coherent sum")}</text>
          </>
        ) : (
          <>
            {/* 위성 + 측방 관측 (across-track) */}
            <rect x={28} y={22} width={20} height={14} rx={2} fill={`color-mix(in oklch, ${catColor} 22%, var(--card))`} stroke={catColor} strokeWidth="1" />
            <text x={38} y={17} textAnchor="middle" fontSize="9" fill="var(--muted)" className="font-mono">{T("위성", "sat")}</text>
            {/* 지표면 */}
            <line x1={20} y1={168} x2={304} y2={168} stroke="var(--muted)" strokeWidth="1.5" markerEnd="url(#scarrow)" />
            <text x={300} y={182} textAnchor="end" fontSize="9" fill="var(--muted)" className="font-mono">{T("지표 Range →", "ground Range →")}</text>
            {/* 빔 경계 + 서브스왓 3개 */}
            {(() => {
              const sat = { x: 38, y: 36 };
              const segs = [
                { x0: 110, x1: 175, tone: 3, label: "IW1" },
                { x0: 175, x1: 235, tone: 4, label: "IW2" },
                { x0: 235, x1: 292, tone: 6, label: "IW3" },
              ];
              return (
                <>
                  <line x1={sat.x} y1={sat.y} x2={110} y2={168} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 2" />
                  <line x1={sat.x} y1={sat.y} x2={292} y2={168} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 2" />
                  {segs.map((s, i) => (
                    <g key={i}>
                      <rect x={s.x0} y={160} width={s.x1 - s.x0} height={8} fill={`var(--cat-${s.tone})`} opacity="0.8" />
                      <line x1={sat.x} y1={sat.y} x2={(s.x0 + s.x1) / 2} y2={160} stroke={`var(--cat-${s.tone})`} strokeWidth="1" opacity="0.5" />
                      <text x={(s.x0 + s.x1) / 2} y={154} textAnchor="middle" fontSize="9" fontWeight="600" fill={`var(--cat-${s.tone})`} className="font-mono">{s.label}</text>
                    </g>
                  ))}
                  <text x={110} y={182} textAnchor="middle" fontSize="8.5" fill="var(--muted)" className="font-mono">{T("근거리", "near")}</text>
                  <text x={292} y={182} textAnchor="middle" fontSize="8.5" fill="var(--muted)" className="font-mono">{T("원거리", "far")}</text>
                  <text x={150} y={48} fontSize="8.5" fill="var(--muted)" className="font-mono">{T("Azimuth = 지면 안쪽 방향", "Azimuth = into the page")}</text>
                </>
              );
            })()}
          </>
        )}
      </svg>
      {diagram.caption && <Caption text={pick(diagram.caption, locale)} />}
    </figure>
  );
}

/* ─── network — 간섭쌍 시간·기선 네트워크 (SBAS / PSI) ─────────────────────────── */
const NET_NODES = [
  { x: 44, y: 118 }, { x: 82, y: 86 }, { x: 120, y: 134 }, { x: 158, y: 72 },
  { x: 196, y: 108 }, { x: 234, y: 92 }, { x: 272, y: 128 },
];

function NetworkFigure({ diagram, locale, catColor }: { diagram: Extract<Diagram, { kind: "network" }>; locale: Locale; catColor: string }) {
  const T = (ko: string, en: string) => (locale === "ko" ? ko : en);
  const sbas = diagram.style === "sbas";
  const edges: [number, number][] = [];
  if (sbas) {
    for (let i = 0; i < NET_NODES.length; i++)
      for (let j = i + 1; j < NET_NODES.length; j++)
        if (j - i <= 2 && Math.abs(NET_NODES[i].y - NET_NODES[j].y) <= 46) edges.push([i, j]);
  } else {
    const master = 3;
    for (let i = 0; i < NET_NODES.length; i++) if (i !== master) edges.push([master, i]);
  }
  const masterIdx = sbas ? -1 : 3;
  return (
    <figure className="my-5 rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-4">
      <svg viewBox="0 0 312 178" className="w-full" role="img" aria-label={diagram.caption ? pick(diagram.caption, locale) : "interferogram network"}>
        <defs>
          <marker id="netax" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0 0 L7 4 L0 8 Z" fill="var(--muted)" />
          </marker>
        </defs>
        {/* 축 */}
        <line x1={28} y1={160} x2={300} y2={160} stroke="var(--muted)" strokeWidth="1" markerEnd="url(#netax)" />
        <line x1={28} y1={160} x2={28} y2={20} stroke="var(--muted)" strokeWidth="1" markerEnd="url(#netax)" />
        <text x={298} y={174} textAnchor="end" fontSize="9" fill="var(--muted)" className="font-mono">{T("시간 →", "time →")}</text>
        <text x={32} y={26} fontSize="9" fill="var(--muted)" className="font-mono">{T("수직기선 B⊥", "B⊥")}</text>
        {/* 간섭쌍 엣지 */}
        {edges.map(([a, b], i) => (
          <line key={i} x1={NET_NODES[a].x} y1={NET_NODES[a].y} x2={NET_NODES[b].x} y2={NET_NODES[b].y} stroke={catColor} strokeWidth="1.2" opacity={sbas ? 0.55 : 0.7} />
        ))}
        {/* 취득점 노드 */}
        {NET_NODES.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={i === masterIdx ? 6 : 4.5} fill={i === masterIdx ? "var(--accent)" : `color-mix(in oklch, ${catColor} 55%, var(--card))`} stroke={i === masterIdx ? "var(--accent)" : catColor} strokeWidth="1.3" />
          </g>
        ))}
        {masterIdx >= 0 && (
          <text x={NET_NODES[masterIdx].x} y={NET_NODES[masterIdx].y - 10} textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--accent)" className="font-mono">{T("마스터", "master")}</text>
        )}
        <text x={166} y={16} textAnchor="middle" fontSize="9" fill="var(--muted)" className="font-mono">
          {sbas ? T("소기선 다중 페어 (SBAS)", "small-baseline pairs (SBAS)") : T("단일 마스터 → 전체 (PSI)", "single master → all (PSI)")}
        </text>
      </svg>
      {diagram.caption && <Caption text={pick(diagram.caption, locale)} />}
    </figure>
  );
}

/* ─── pixel — 비등방 Range×Azimuth 픽셀 + 멀티룩 ──────────────────────────────── */
function PixelFigure({ diagram, locale, catColor }: { diagram: Extract<Diagram, { kind: "pixel" }>; locale: Locale; catColor: string }) {
  const T = (ko: string, en: string) => (locale === "ko" ? ko : en);
  const { rangeM, azimuthM, multilook } = diagram;
  const maxH = 132;
  const h = maxH;
  const w = Math.max(14, (maxH * rangeM) / azimuthM);
  const ml = multilook;
  const leftX = ml ? 70 : 150 - w / 2;
  const topY = 30;
  const fill = `color-mix(in oklch, ${catColor} 16%, var(--card))`;
  return (
    <figure className="my-5 rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-4">
      <svg viewBox="0 0 300 196" className="w-full" role="img" aria-label={diagram.caption ? pick(diagram.caption, locale) : "SAR pixel"}>
        {/* 단일 SLC 픽셀 */}
        <rect x={leftX} y={topY} width={w} height={h} fill={fill} stroke={catColor} strokeWidth="1.5" />
        <line x1={leftX} y1={topY + h + 10} x2={leftX + w} y2={topY + h + 10} stroke="var(--muted)" strokeWidth="1" />
        <text x={leftX + w / 2} y={topY + h + 22} textAnchor="middle" fontSize="9" fill="var(--muted)" className="font-mono">Range {rangeM}m</text>
        <line x1={leftX - 10} y1={topY} x2={leftX - 10} y2={topY + h} stroke="var(--muted)" strokeWidth="1" />
        <text x={leftX - 14} y={topY + h / 2} textAnchor="middle" fontSize="9" fill="var(--muted)" transform={`rotate(-90 ${leftX - 14} ${topY + h / 2})`} className="font-mono">Azimuth {azimuthM}m</text>
        {ml && (() => {
          const [mr] = ml;
          const rx = 200;
          const rw = w * mr;
          return (
            <g>
              {/* 멀티룩 결과 — range로 mr배 평균 → 더 등방적 */}
              <text x={(leftX + w + rx) / 2} y={topY + h / 2 - 6} textAnchor="middle" fontSize="9" fill="var(--accent)" className="font-mono">{T(`멀티룩 ${ml[0]}×${ml[1]}`, `multilook ${ml[0]}×${ml[1]}`)}</text>
              <text x={(leftX + w + rx) / 2} y={topY + h / 2 + 8} textAnchor="middle" fontSize="13" fill="var(--accent)">→</text>
              <rect x={rx} y={topY} width={rw} height={h} fill={`color-mix(in oklch, ${catColor} 16%, var(--card))`} stroke={catColor} strokeWidth="1.5" />
              {Array.from({ length: mr - 1 }, (_, k) => (
                <line key={k} x1={rx + w * (k + 1)} y1={topY} x2={rx + w * (k + 1)} y2={topY + h} stroke={catColor} strokeWidth="0.75" strokeDasharray="2 2" opacity="0.6" />
              ))}
              <text x={rx + rw / 2} y={topY + h + 22} textAnchor="middle" fontSize="9" fill="var(--muted)" className="font-mono">{rangeM * mr}m × {azimuthM}m</text>
              <text x={rx + rw / 2} y={topY + h + 34} textAnchor="middle" fontSize="8.5" fill="var(--accent)" className="font-mono">{T("더 등방적", "more isotropic")}</text>
            </g>
          );
        })()}
      </svg>
      {diagram.caption && <Caption text={pick(diagram.caption, locale)} />}
    </figure>
  );
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
            row ? "flex flex-col items-stretch gap-2 sm:flex-row sm:items-stretch" : "flex flex-col items-stretch gap-2"
          }
        >
          {diagram.nodes.map((n, i) => (
            <Fragment key={i}>
              {/* 노드 — row일 때 동일 폭(flex-1)으로 전체 폭을 채움 */}
              <div className={row ? "flex sm:flex-1 sm:min-w-0" : undefined}>
                <NodeBox node={n} locale={locale} fallback={catColor} className="w-full" />
              </div>
              {i < diagram.nodes.length - 1 && (
                <div className="flex items-center justify-center">
                  {row ? (
                    <>
                      <ArrowRight className="hidden size-5 shrink-0 text-[var(--accent)] sm:block" strokeWidth={2.25} />
                      <ArrowDown className="size-5 shrink-0 text-[var(--accent)] sm:hidden" strokeWidth={2.25} />
                    </>
                  ) : (
                    <ArrowDown className="size-5 shrink-0 text-[var(--accent)]" strokeWidth={2.25} />
                  )}
                </div>
              )}
            </Fragment>
          ))}
        </div>
        {diagram.caption && <Caption text={pick(diagram.caption, locale)} />}
      </figure>
    );
  }

  if (diagram.kind === "branch") {
    const n = diagram.children.length;
    const colClass = n >= 4 ? "sm:grid-cols-4" : n === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
    return (
      <figure className="my-5 rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-4">
        {/* 근원 노드 — 전체 폭 (여기서 갈라진다) */}
        <NodeBox node={diagram.root} locale={locale} fallback={catColor} />
        {/* 분기 — 자식마다 아래 화살표로 갈라짐을 명시 */}
        <div className={`mt-1.5 grid grid-cols-2 gap-2.5 ${colClass}`}>
          {diagram.children.map((c, i) => (
            <div key={i} className="flex flex-col gap-1">
              <ArrowDown className="mx-auto size-5 shrink-0 text-[var(--accent)]" strokeWidth={2.25} />
              <NodeBox node={c} locale={locale} fallback={catColor} className="flex-1" />
            </div>
          ))}
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

  if (diagram.kind === "plot") {
    const W = 320, H = 172, padL = 40, padR = 14, padT = 16, padB = 30;
    const pw = W - padL - padR;
    const ph = H - padT - padB;
    return (
      <figure className="my-5 rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label={diagram.caption ? pick(diagram.caption, locale) : "graph"}
        >
          {/* 축 */}
          <line x1={padL} y1={padT} x2={padL} y2={padT + ph} stroke="var(--border)" strokeWidth="1" />
          <line x1={padL} y1={padT + ph} x2={padL + pw} y2={padT + ph} stroke="var(--border)" strokeWidth="1" />
          {/* 특정 지점 표시 (공진·차단 등) */}
          {diagram.markers?.map((m, i) => {
            const mx = padL + m.x * pw;
            const col = toneColor(m.tone, "var(--accent)");
            return (
              <g key={i}>
                <line x1={mx} y1={padT} x2={mx} y2={padT + ph} stroke={col} strokeWidth="1" strokeDasharray="3 3" opacity="0.65" />
                <text x={mx} y={padT - 4} textAnchor="middle" fontSize="9" fill={col} className="font-mono">
                  {pick(m.label, locale)}
                </text>
              </g>
            );
          })}
          {/* 곡선들 */}
          {diagram.series.map((s, i) => (
            <path
              key={i}
              d={plotPath(s.curve, padL, padT, pw, ph)}
              fill="none"
              stroke={toneColor(s.tone, catColor)}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          {/* 축 라벨 */}
          {diagram.xLabel && (
            <text x={padL + pw} y={H - 7} textAnchor="end" fontSize="9.5" fill="var(--muted)" className="font-mono">
              {pick(diagram.xLabel, locale)}
            </text>
          )}
          {diagram.yLabel && (
            <text x={padL - 4} y={padT + 1} textAnchor="end" fontSize="9.5" fill="var(--muted)" className="font-mono">
              {pick(diagram.yLabel, locale)}
            </text>
          )}
        </svg>
        {diagram.series.length > 1 && (
          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
            {diagram.series.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[var(--muted)]">
                <span
                  className="inline-block h-[3px] w-4 rounded-full"
                  style={{ backgroundColor: toneColor(s.tone, catColor) }}
                />
                {pick(s.label, locale)}
              </span>
            ))}
          </div>
        )}
        {diagram.caption && <Caption text={pick(diagram.caption, locale)} />}
      </figure>
    );
  }

  if (diagram.kind === "lattice") {
    return (
      <figure className="my-5 rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          {diagram.panels.map((p, i) => (
            <LatticePanelSvg key={i} panel={p} locale={locale} />
          ))}
        </div>
        {diagram.caption && <Caption text={pick(diagram.caption, locale)} />}
      </figure>
    );
  }

  if (diagram.kind === "junction") {
    return (
      <figure className="my-5 rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-4">
        <div className="flex flex-col gap-3">
          {diagram.states.map((s, i) => (
            <JunctionStateSvg key={i} state={s} locale={locale} />
          ))}
        </div>
        {/* 범례 */}
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 font-mono text-[10px] text-[var(--muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-grid size-3 place-items-center rounded-full border" style={{ borderColor: "var(--cat-5)" }}>
              <span className="text-[7px] leading-none" style={{ color: "var(--cat-5)" }}>+</span>
            </span>
            정공 (P형)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-grid size-3 place-items-center rounded-full" style={{ backgroundColor: "var(--cat-3)" }}>
              <span className="text-[7px] leading-none text-[var(--card)]">−</span>
            </span>
            전자 (N형)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-[var(--muted)]">⊖⊕</span>
            고정 이온 = 공핍층
          </span>
        </div>
        {diagram.caption && <Caption text={pick(diagram.caption, locale)} />}
      </figure>
    );
  }

  if (diagram.kind === "iv") {
    const W = 300, H = 200;
    const cx = 150, cy = 108;
    const axL = 24, axR = 290, axT = 14, axB = 190;
    const halfR = axR - cx, halfL = cx - axL;
    const up = cy - axT - 6;
    const xVf = cx + 0.34 * halfR;
    const xVbr = cx - 0.82 * halfL;
    const fwdD = ivForwardPath(cx, cy, xVf, axR - 2, up);
    const revD = `M ${cx} ${cy} L ${xVbr} ${cy + 4} L ${(xVbr - 2).toFixed(1)} ${cy + 26} L ${(xVbr - 9).toFixed(1)} ${axB - 2}`;
    return (
      <figure className="my-5 rounded-xl border border-[var(--border)] bg-[var(--background)]/40 p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={diagram.caption ? pick(diagram.caption, locale) : "I-V curve"}>
          <defs>
            <marker id="ivax" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0 0 L7 4 L0 8 Z" fill="var(--muted)" />
            </marker>
          </defs>
          {/* 축 (4상한) */}
          <line x1={axL} y1={cy} x2={axR} y2={cy} stroke="var(--muted)" strokeWidth="1" markerEnd="url(#ivax)" />
          <line x1={cx} y1={axB} x2={cx} y2={axT} stroke="var(--muted)" strokeWidth="1" markerEnd="url(#ivax)" />
          {/* VF · VBR 마커 */}
          <line x1={xVf} y1={axT} x2={xVf} y2={axB} stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <line x1={xVbr} y1={axT} x2={xVbr} y2={axB} stroke="var(--cat-5)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          {/* 곡선 — 순방향/누설(본색) + 항복(빨강) */}
          <path d={revD} fill="none" stroke="var(--cat-5)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <path d={fwdD} fill="none" stroke={catColor} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
          {/* 라벨 */}
          <text x={xVf + 4} y={axB - 4} fontSize="9" fill="var(--accent)" className="font-mono">
            {diagram.vfLabel ? pick(diagram.vfLabel, locale) : "VF"}
          </text>
          <text x={xVbr} y={axT + 8} textAnchor="middle" fontSize="9" fill="var(--cat-5)" className="font-mono">
            {diagram.vbrLabel ? pick(diagram.vbrLabel, locale) : "VBR"}
          </text>
          {diagram.fwdLabel && (
            <text x={axR - 4} y={axT + 22} textAnchor="end" fontSize="9.5" fill={catColor} className="font-mono">
              {pick(diagram.fwdLabel, locale)}
            </text>
          )}
          {diagram.revLabel && (
            <text x={cx - 8} y={cy - 7} textAnchor="end" fontSize="9.5" fill="var(--muted)" className="font-mono">
              {pick(diagram.revLabel, locale)}
            </text>
          )}
          {/* 축 라벨 */}
          {diagram.xLabel && (
            <text x={axR - 2} y={cy + 14} textAnchor="end" fontSize="9.5" fill="var(--muted)" className="font-mono">
              {pick(diagram.xLabel, locale)}
            </text>
          )}
          {diagram.yLabel && (
            <text x={cx + 6} y={axT + 8} fontSize="9.5" fill="var(--muted)" className="font-mono">
              {pick(diagram.yLabel, locale)}
            </text>
          )}
        </svg>
        {diagram.caption && <Caption text={pick(diagram.caption, locale)} />}
      </figure>
    );
  }

  if (diagram.kind === "phasor") return <PhasorFigure diagram={diagram} locale={locale} catColor={catColor} />;
  if (diagram.kind === "scene") return <SceneFigure diagram={diagram} locale={locale} catColor={catColor} />;
  if (diagram.kind === "network") return <NetworkFigure diagram={diagram} locale={locale} catColor={catColor} />;
  if (diagram.kind === "pixel") return <PixelFigure diagram={diagram} locale={locale} catColor={catColor} />;

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
