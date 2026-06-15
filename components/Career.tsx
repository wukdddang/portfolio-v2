"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { personal } from "@/data/personal";
import { careerRole, careerTimeline } from "@/data/career";
import { pick } from "@/data/i18n";
import { tenureLabel } from "@/lib/tenure";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Career — 연차별 성장 아크(프론트엔드 → 풀스택) 세로 타임라인.
 * 단일 고용주(루미르)를 헤드라인으로 또렷이 하고, 주력은 강조·비주력은 한 줄.
 * data/career.ts 기반, 근속은 tenureLabel 로 렌더 시점 자동 계산.
 */
export function Career() {
  const t = useTranslations("career");
  const locale = useLocale() as Locale;
  const joined = personal.joinDate.replace("-", ".");

  return (
    <section id="career" className="relative border-t border-[var(--border)]">
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

        {/* 재직 헤드라인 — 어디서·직무·근속 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-[var(--accent)]/40 ring-1 ring-[var(--accent)]/20 bg-[var(--card)] px-5 py-4"
        >
          <span className="text-xl md:text-2xl font-bold tracking-tight">
            {pick(careerRole.company, locale)}
          </span>
          <span className="text-sm text-[var(--muted)]">
            {pick(careerRole.position, locale)}
          </span>
          <span className="sm:ml-auto whitespace-nowrap rounded-full bg-[var(--subtle)] px-3 py-1 font-mono text-xs text-[var(--foreground)]">
            {joined} ~ {t("present")} · {tenureLabel(personal.joinDate, locale)}
          </span>
        </motion.div>

        {/* 연차 타임라인 */}
        <ol className="relative ml-2 border-l border-[var(--border)]">
          {careerTimeline.map((e, i) => (
            <motion.li
              key={e.year}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="relative pl-6 pb-8 last:pb-0"
            >
              {/* rail dot */}
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[7px] top-1 size-3 rounded-full border-2 border-[var(--background)]",
                  e.current
                    ? "bg-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                    : e.notable
                      ? "bg-[var(--accent)]"
                      : "bg-[var(--muted)]"
                )}
              />
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-semibold text-[var(--foreground)]">
                  {e.year}
                </span>
                <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-2 py-0.5 font-mono text-[10px] text-[var(--muted)]">
                  {pick(e.role, locale)}
                </span>
                {e.current && (
                  <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--accent)]">
                    {t("present")}
                  </span>
                )}
              </div>
              <div className={cn("font-semibold leading-tight", e.notable ? "text-lg" : "text-base")}>
                {pick(e.title, locale)}
              </div>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
                {pick(e.desc, locale)}
              </p>
              {e.projects && e.projects.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
                    {t("concurrent")}
                  </span>
                  {e.projects.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/projects/${p.slug}`}
                      className="group/cl inline-flex items-center gap-1 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/5 px-3 py-1 font-mono text-xs text-[var(--foreground)] transition-colors hover:bg-[var(--accent)]/10"
                    >
                      {pick(p.title, locale)}
                      <ArrowUpRight className="size-3 text-[var(--accent)] transition-transform group-hover/cl:translate-x-0.5 group-hover/cl:-translate-y-0.5" />
                    </Link>
                  ))}
                </div>
              )}
            </motion.li>
          ))}
        </ol>

        {/* CTA — 전체 이력 */}
        <div className="mt-12">
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--subtle)]"
          >
            {t("resumeCta")}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
