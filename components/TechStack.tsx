"use client";

import { motion } from "framer-motion";
import { mainStack, learnedDomain, future } from "@/data/stack";
import { cn } from "@/lib/utils";

export function TechStack() {
  return (
    <section
      id="stack"
      className="relative border-t border-[var(--border)]"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-16 lg:px-24 py-24">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
            기술 스택
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            메인 직군 · 학습 도메인 · 미래
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            본인 직군(웹 개발)과 회사에서 배운 학습 도메인(SAR·위성영상)을 분리해서 봅니다. 직군 안의 깊이와 직군 확장을 명확히 구분합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-12">
          {/* 메인 직군 */}
          <div>
            <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-[var(--border)]">
              <h3 className="text-xl font-bold">메인 직군 · 웹 개발</h3>
              <div className="text-xs font-mono text-[var(--muted)]">
                4단계 시스템화
              </div>
            </div>
            <div className="space-y-6">
              {mainStack.map((cat, idx) => (
                <StackBlock key={cat.label} category={cat} delay={idx * 0.08} />
              ))}
            </div>
          </div>

          {/* 학습 도메인 */}
          <div>
            <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-[var(--accent)]/40">
              <h3 className="text-xl font-bold">학습 도메인 · SAR · 위성영상</h3>
              <div className="text-xs font-mono text-[var(--accent)]">
                3단계 직군 확장
              </div>
            </div>
            <div className="space-y-6">
              {learnedDomain.map((cat, idx) => (
                <StackBlock
                  key={cat.label}
                  category={cat}
                  delay={idx * 0.08}
                  accent
                />
              ))}
            </div>

            {/* Future */}
            <div className="mt-10 pt-6 border-t border-dashed border-[var(--border)]">
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
                다음 직군 확장 — 예측
              </div>
              <div className="flex flex-wrap gap-2">
                {future.map((f) => (
                  <span
                    key={f}
                    className="text-xs font-mono px-3 py-1.5 rounded-md border border-dashed border-[var(--border)] text-[var(--muted)]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StackBlock({
  category,
  delay,
  accent = false,
}: {
  category: { label: string; items: { name: string; note?: string }[] };
  delay: number;
  accent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay }}
    >
      <div
        className={cn(
          "text-[10px] font-mono uppercase tracking-widest mb-3",
          accent ? "text-[var(--accent)]" : "text-[var(--muted)]"
        )}
      >
        {category.label}
      </div>
      <ul className="space-y-2">
        {category.items.map((item) => (
          <li
            key={item.name}
            className="flex flex-wrap items-baseline gap-x-2 text-sm"
          >
            <span className="font-medium">{item.name}</span>
            {item.note && (
              <span className="text-xs font-mono text-[var(--muted)]">
                · {item.note}
              </span>
            )}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
