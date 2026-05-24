"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { stages, singleLever } from "@/data/levels";
import { personal } from "@/data/personal";
import { pick } from "@/data/i18n";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function Coordinates() {
  const t = useTranslations("coordinates");
  const locale = useLocale() as Locale;

  const axes = [personal.mainDomain, personal.academicBackground, personal.learnedDomain];

  return (
    <section
      id="coordinates"
      className="relative border-t border-[var(--border)]"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-16 lg:px-24 py-24">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
            {t("eyebrow")}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            {t("lede")}
          </p>
        </div>

        {/* 직군 매트릭스 — 3축 */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {axes.map((axis, idx) => (
            <motion.div
              key={pick(axis.label, locale)}
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
                {pick(axis.label, locale)}
              </div>
              <div className="text-xl font-semibold mb-2">{pick(axis.value, locale)}</div>
              <div className="text-sm text-[var(--muted)] leading-relaxed">
                {pick(axis.detail, locale)}
              </div>
              {idx === 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs font-mono text-[var(--muted)]">
                  {pick(personal.mainDomain.note, locale)}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* 5단계 모델 + 본인 위치 */}
        <div className="mb-8">
          <div className="flex items-baseline justify-between mb-6">
            <h3 className="text-2xl font-bold">{t("stagesTitle")}</h3>
            <div className="text-xs font-mono text-[var(--muted)]">
              {t("currentLabel")} · {pick(personal.currentStage.range, locale)}
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
                      <div className="font-semibold text-base">{pick(stage.name, locale)}</div>
                      <div className="text-xs font-mono text-[var(--muted)]">
                        {pick(stage.short, locale)} · {t("resultLabel")} {pick(stage.resultOwner, locale)}
                      </div>
                      {isActive && (
                        <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]">
                          {t("currentBadge")}
                        </span>
                      )}
                      {isSignal && (
                        <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border border-[var(--accent)]/60 text-[var(--accent)]">
                          {t("signalBadge")}
                        </span>
                      )}
                    </div>
                    {stage.ownDefinition ? (
                      <div className="text-sm text-[var(--card-foreground)] leading-relaxed">
                        <span className="text-[var(--muted)] font-mono text-xs mr-1">
                          {t("ownFeel")}
                        </span>
                        {pick(stage.ownDefinition, locale)}
                      </div>
                    ) : (
                      <div className="text-sm text-[var(--muted)] leading-relaxed">
                        {pick(stage.seongPMDefinition, locale)}
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
                {t("singleLeverEyebrow")}
              </div>
              <div className="text-xl md:text-2xl font-bold mb-3">
                {pick(singleLever.title, locale)
                  .replace("단일 레버 — ", "")
                  .replace("Single lever — ", "")}
              </div>
              <p className="opacity-80 leading-relaxed">{pick(singleLever.description, locale)}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
