"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { singleLever } from "@/data/levels";
import { personal } from "@/data/personal";
import { pick } from "@/data/i18n";
import { tenureLabel } from "@/lib/tenure";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { StageScrollytelling } from "@/components/StageScrollytelling";

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
                  {tenureLabel(personal.joinDate, locale)} · {pick(personal.mainDomain.note, locale)}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* 5단계 모델 + 본인 위치 — sticky 스크롤 텔링 */}
        <StageScrollytelling />

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
