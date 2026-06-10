"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowDown, FileText, Briefcase } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { personal } from "@/data/personal";
import { pick, pickArr } from "@/data/i18n";
import { tenureLabel } from "@/lib/tenure";
import type { Locale } from "@/i18n/routing";
import { Typewriter } from "./Typewriter";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale() as Locale;

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Subtle background grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-16 lg:px-24 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-xs font-mono text-[var(--muted)] mb-8"
        >
          <span className="size-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          {t("stageLabel")} · {pick(personal.currentStage.plain, locale)}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] break-keep min-h-[1.2em]"
        >
          <Typewriter key={locale} phrases={pickArr(personal.roles, locale)} />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-[var(--muted)] max-w-2xl leading-relaxed"
        >
          {pick(personal.subTagline, locale)}.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-4 text-base md:text-lg text-[var(--card-foreground)] max-w-2xl leading-relaxed"
        >
          {pick(personal.pitch, locale)}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-3 text-sm md:text-base text-[var(--muted)] max-w-2xl leading-relaxed"
        >
          {pick(personal.identity, locale)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--foreground)] text-[var(--background)] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Briefcase className="size-4" />
            {t("ctaProjects")}
            <ArrowDown className="size-4 group-hover:translate-y-0.5 transition-transform" />
          </a>
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[var(--border)] text-sm font-medium hover:bg-[var(--subtle)] transition-colors"
          >
            <FileText className="size-4" />
            {t("ctaResume")}
            <span className="text-xs text-[var(--muted)] font-mono ml-1">/resume</span>
          </Link>
        </motion.div>

        {/* meta strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 text-xs font-mono text-[var(--muted)] border-t border-[var(--border)] pt-6"
        >
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1">
              {t("meta.mainDomain")}
            </div>
            <div className="text-[var(--foreground)]">{t("meta.mainDomainValue")}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1">
              {t("meta.learnedDomain")}
            </div>
            <div className="text-[var(--foreground)]">{t("meta.learnedDomainValue")}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1">
              {t("meta.aiStage")}
            </div>
            <div className="text-[var(--foreground)]">{pick(personal.currentStage.plain, locale)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1">
              {t("meta.yearsLabel")}
            </div>
            <div className="text-[var(--foreground)]">{tenureLabel(personal.joinDate, locale)}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
