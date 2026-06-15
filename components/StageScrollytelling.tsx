"use client";

/**
 * StageScrollytelling — AI 활용 5단계 모델을 sticky 스크롤 텔링으로.
 * 데스크톱(lg+)에서 왼쪽 인디케이터 패널이 화면에 고정(sticky)되고, 오른쪽 단계 카드 리스트를
 * 스크롤하면 useScroll 진행도에 맞춰 "현재 보고 있는 단계"가 1→5로 전환된다(scrubbed).
 * 고정 패널은 현재 단계의 큰 번호·이름·결과 주체 + 세로 진행 게이지를 보여준다.
 *
 * 콘텐츠(stages)는 그대로 유지하고 연출만 입힌다. reduced-motion이면 단계 전환 크로스페이드를 끈다.
 * 모바일에선 인디케이터를 숨기고(카드가 모든 정보를 담음) 카드 리스트만 노출.
 */

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { stages } from "@/data/levels";
import { personal } from "@/data/personal";
import { pick } from "@/data/i18n";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** 본인 현재 위치(3+4)에 해당하는 단계 */
const isOwnStage = (id: number) => id === 3 || id === 4;

export function StageScrollytelling() {
  const t = useTranslations("coordinates");
  const locale = useLocale() as Locale;
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // 리스트가 뷰포트 중앙을 지나는 동안의 진행도(0~1) → 활성 단계 인덱스
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start center", "end center"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(stages.length - 1, Math.max(0, Math.floor(v * stages.length)));
    setActive((prev) => (prev === idx ? prev : idx));
  });

  const current = stages[active];

  return (
    <div className="mb-8">
      <div className="mb-6 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold">{t("stagesTitle")}</h3>
        <div className="font-mono text-xs text-[var(--muted)]">
          {t("currentLabel")} · {pick(personal.currentStage.range, locale)}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[19rem_1fr]">
        {/* 고정 인디케이터 패널 — 데스크톱 전용 */}
        <div className="hidden lg:block">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="mb-4 flex items-center gap-4">
                {/* 세로 진행 게이지 */}
                <div className="flex flex-col items-center gap-1.5">
                  {stages.map((s, i) => (
                    <span
                      key={s.id}
                      className={cn(
                        "w-1 rounded-full transition-all duration-300",
                        i === active
                          ? "h-7 bg-[var(--accent)]"
                          : i < active
                            ? "h-4 bg-[var(--accent)]/40"
                            : "h-4 bg-[var(--border)]"
                      )}
                    />
                  ))}
                </div>

                <div className="min-w-0">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
                    {t("stageWord")} {current.id} / {stages.length}
                  </div>
                  <motion.div
                    key={reduce ? undefined : current.id}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="mt-1 text-7xl font-bold leading-none tracking-tight tabular-nums">
                      {current.id}
                    </div>
                    <div className="mt-3 text-lg font-semibold leading-snug">
                      {pick(current.name, locale)}
                    </div>
                    <div className="mt-1 font-mono text-xs text-[var(--muted)]">
                      {pick(current.short, locale)}
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 font-mono text-[11px]">
                <span className="text-[var(--muted)]">{t("resultLabel")}</span>
                <span className="font-medium">{pick(current.resultOwner, locale)}</span>
              </div>

              {isOwnStage(current.id) && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[var(--accent-foreground)]">
                  <span className="size-1.5 rounded-full bg-current" />
                  {t("currentBadge")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 스크롤되는 단계 카드 리스트 */}
        <div ref={listRef} className="space-y-3">
          {stages.map((stage, idx) => {
            const own = isOwnStage(stage.id);
            const isSignal = stage.id === 5;
            const scrollActive = idx === active;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={cn(
                  "relative grid grid-cols-[auto_1fr] gap-6 rounded-xl border p-5 transition-all duration-300",
                  own && "bg-[var(--accent)]/5 border-[var(--accent)]/40",
                  isSignal && "border-dashed border-[var(--accent)]/40",
                  !own && !isSignal && "border-[var(--border)]",
                  // 스크롤로 지나는 카드 강조 — 의미색(3+4)은 유지한 채 링/스케일만 더함
                  scrollActive
                    ? "opacity-100 ring-2 ring-[var(--accent)]/30 lg:scale-[1.015]"
                    : !own && !isSignal && "opacity-60"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-lg font-mono text-lg font-bold transition-colors",
                      own || scrollActive
                        ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                        : "bg-[var(--subtle)] text-[var(--muted)]"
                    )}
                  >
                    {stage.id}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <div className="text-base font-semibold">{pick(stage.name, locale)}</div>
                    <div className="font-mono text-xs text-[var(--muted)]">
                      {pick(stage.short, locale)} · {t("resultLabel")} {pick(stage.resultOwner, locale)}
                    </div>
                    {own && (
                      <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--accent-foreground)]">
                        {t("currentBadge")}
                      </span>
                    )}
                    {isSignal && (
                      <span className="rounded-full border border-[var(--accent)]/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
                        {t("signalBadge")}
                      </span>
                    )}
                  </div>
                  {stage.ownDefinition ? (
                    <div className="text-sm leading-relaxed text-[var(--card-foreground)]">
                      <span className="mr-1 font-mono text-xs text-[var(--muted)]">{t("ownFeel")}</span>
                      {pick(stage.ownDefinition, locale)}
                    </div>
                  ) : (
                    <div className="text-sm leading-relaxed text-[var(--muted)]">
                      {pick(stage.seongPMDefinition, locale)}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
