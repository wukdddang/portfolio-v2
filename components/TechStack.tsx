"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { mainStack, learnedDomain } from "@/data/stack";
import { pick, type L } from "@/data/i18n";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function TechStack() {
  const t = useTranslations("techStack");
  const locale = useLocale() as Locale;

  return (
    <section
      id="stack"
      className="relative border-t border-[var(--border)]"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-16 lg:px-24 py-24">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
            {t("eyebrow")}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">{t("lede")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-12">
          {/* 메인 직군 */}
          <div>
            <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-[var(--border)]">
              <h3 className="text-xl font-bold">{t("mainColumn")}</h3>
              <div className="text-xs font-mono text-[var(--muted)]">
                {t("mainStage")}
              </div>
            </div>
            <div className="space-y-6">
              {mainStack.map((cat, idx) => (
                <StackBlock
                  key={pick(cat.label, locale)}
                  category={cat}
                  locale={locale}
                  delay={idx * 0.08}
                />
              ))}
            </div>
          </div>

          {/* 학습 도메인 */}
          <div>
            <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-[var(--accent)]/40">
              <h3 className="text-xl font-bold">{t("learnedColumn")}</h3>
              <div className="text-xs font-mono text-[var(--accent)]">
                {t("learnedStage")}
              </div>
            </div>
            <div className="space-y-6">
              {learnedDomain.map((cat, idx) => (
                <StackBlock
                  key={pick(cat.label, locale)}
                  category={cat}
                  locale={locale}
                  delay={idx * 0.08}
                  accent
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StackBlock({
  category,
  locale,
  delay,
  accent = false,
}: {
  category: { label: L; items: { name: string; note?: L }[] };
  locale: Locale;
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
        {pick(category.label, locale)}
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
                · {pick(item.note, locale)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
