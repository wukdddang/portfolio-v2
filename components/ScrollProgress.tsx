"use client";

/**
 * ScrollProgress — 페이지 상단에 고정된 스크롤 진행바.
 * framer-motion useScroll의 scrollYProgress(0~1)를 scaleX로 직접 연동(scrubbed)해
 * 스크롤 위치에 맞춰 좌→우로 채워진다. 읽기 진행률 신호 + "디자인에 신경 썼다"는 인상.
 * reduced-motion 사용자에겐 스프링 없이 즉시 반영(useReducedMotion).
 */

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // 부드러운 추종 — reduced-motion이면 스프링을 사실상 끄고 즉시 반영
  const scaleX = useSpring(scrollYProgress, {
    stiffness: reduce ? 1000 : 140,
    damping: reduce ? 100 : 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-[var(--accent)]"
      style={{ scaleX }}
    />
  );
}
