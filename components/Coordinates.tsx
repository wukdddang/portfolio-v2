"use client";

import { motion } from "framer-motion";
import { stages, singleLever } from "@/data/levels";
import { personal } from "@/data/personal";
import { cn } from "@/lib/utils";

export function Coordinates() {
  return (
    <section
      id="coordinates"
      className="relative px-6 md:px-16 lg:px-24 py-24 border-t border-[var(--border)]"
    >
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
            나의 좌표
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            단계 진단은 직군이 기준선이다
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            같은 SAR 작업이라도 *공간정보공학 전공자가 메인 직군으로* 하는 것과 *웹
            개발자가 직군 확장으로* 하는 것은 다르다. 아래 매트릭스 + 5단계 모델이 본인의
            현재 좌표.
          </p>
        </div>

        {/* 직군 매트릭스 — 3축 */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {[personal.mainDomain, personal.academicBackground, personal.learnedDomain].map(
            (axis, idx) => (
              <motion.div
                key={axis.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={cn(
                  "p-6 rounded-2xl border bg-[var(--card)]",
                  idx === 0
                    ? "border-[var(--accent)]/40 ring-1 ring-[var(--accent)]/20"
                    : "border-[var(--border)]"
                )}
              >
                <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
                  {axis.label}
                </div>
                <div className="text-xl font-semibold mb-2">{axis.value}</div>
                <div className="text-sm text-[var(--muted)] leading-relaxed">
                  {axis.detail}
                </div>
                {"note" in axis && axis.note && (
                  <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs font-mono text-[var(--muted)]">
                    {axis.note}
                  </div>
                )}
              </motion.div>
            )
          )}
        </div>

        {/* 5단계 모델 + 본인 위치 */}
        <div className="mb-8">
          <div className="flex items-baseline justify-between mb-6">
            <h3 className="text-2xl font-bold">셩PM 5단계 — 본인식 정의</h3>
            <div className="text-xs font-mono text-[var(--muted)]">
              현재 좌표 · {personal.currentStage.range}
            </div>
          </div>

          <div className="space-y-3">
            {stages.map((stage, idx) => {
              const isActive = stage.id === 3 || stage.id === 4;
              const isSignal = stage.id === 5;

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={cn(
                    "relative grid grid-cols-[auto_1fr] gap-6 p-5 rounded-xl border transition-all",
                    isActive &&
                      "bg-[var(--accent)]/5 border-[var(--accent)]/40 ring-1 ring-[var(--accent)]/20",
                    isSignal && "border-dashed border-[var(--accent)]/40",
                    !isActive && !isSignal && "border-[var(--border)] opacity-60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "size-12 rounded-lg flex items-center justify-center text-lg font-bold font-mono",
                        isActive
                          ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                          : "bg-[var(--subtle)] text-[var(--muted)]"
                      )}
                    >
                      {stage.id}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                      <div className="font-semibold text-base">{stage.name}</div>
                      <div className="text-xs font-mono text-[var(--muted)]">
                        {stage.short} · 결과물 = {stage.resultOwner}
                      </div>
                      {isActive && (
                        <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]">
                          현재
                        </span>
                      )}
                      {isSignal && (
                        <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border border-[var(--accent)]/60 text-[var(--accent)]">
                          진입 신호
                        </span>
                      )}
                    </div>
                    {stage.ownDefinition ? (
                      <div className="text-sm text-[var(--card-foreground)] leading-relaxed">
                        <span className="text-[var(--muted)] font-mono text-xs mr-1">
                          본인 체감:
                        </span>
                        {stage.ownDefinition}
                      </div>
                    ) : (
                      <div className="text-sm text-[var(--muted)] leading-relaxed">
                        {stage.seongPMDefinition}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 단일 레버 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mt-12 p-6 md:p-8 rounded-2xl bg-[var(--foreground)] text-[var(--background)]"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">🔑</div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest opacity-60 mb-2">
                단일 레버
              </div>
              <div className="text-xl md:text-2xl font-bold mb-3">
                {singleLever.title.replace("단일 레버 — ", "")}
              </div>
              <p className="opacity-80 leading-relaxed">{singleLever.description}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
