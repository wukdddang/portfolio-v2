"use client";

/**
 * CountUp — 문자열 값 안의 "첫 숫자"를 뷰포트 진입 시 0에서 목표값까지 카운트업한다.
 * 스탯/메트릭 값은 "13개 컴파일", "100%", "3 layers"처럼 숫자+텍스트가 섞여 있으므로,
 * 접두/숫자/접미로 쪼개 숫자만 애니메이션하고 나머지는 그대로 둔다.
 * 숫자가 없으면 값을 그대로 렌더. reduced-motion이면 즉시 최종값(애니메이션 없음).
 *
 * 서버 컴포넌트(스터디·프로젝트 페이지)에서 자식으로 그대로 쓸 수 있다.
 */

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "framer-motion";

/** "13개 컴파일" → { prefix:"", num:"13", suffix:"개 컴파일" } / 숫자 없으면 null */
function parse(value: string) {
  const m = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)([\s\S]*)$/);
  if (!m) return null;
  return { prefix: m[1], num: m[2], suffix: m[3] };
}

export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  const parsed = parse(value);
  const hasNum = !!parsed;
  const target = parsed ? parseFloat(parsed.num.replace(/,/g, "")) : 0;
  const decimals = parsed && parsed.num.includes(".") ? parsed.num.split(".")[1].length : 0;
  const grouped = !!parsed && parsed.num.includes(",");

  const [display, setDisplay] = useState(0);

  // 뷰포트 진입 시 0→target 카운트업. reduced-motion이면 duration 0으로 즉시 스냅.
  // 원시값만 의존 — 애니메이션 중 setDisplay 재렌더가 effect를 재실행하지 않게.
  useEffect(() => {
    if (!hasNum || !inView) return;
    const controls = animate(0, target, {
      duration: reduce ? 0 : 1.1,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, reduce, target, hasNum]);

  // 숫자가 없는 값은 그대로
  if (!parsed) return <span className={className}>{value}</span>;

  const shown =
    decimals > 0
      ? display.toFixed(decimals)
      : grouped
        ? Math.round(display).toLocaleString("en-US")
        : String(Math.round(display));

  return (
    <span ref={ref} className={className}>
      {parsed.prefix}
      <span className="tabular-nums">{shown}</span>
      {parsed.suffix}
    </span>
  );
}
