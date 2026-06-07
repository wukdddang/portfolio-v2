"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/data/projects";
import { pick } from "@/data/i18n";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const t = useTranslations("projectCard");
  const locale = useLocale() as Locale;
  const isRoboticsOnly = project.trackVisibility === "robotics";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        "group relative flex flex-col h-full p-6 rounded-2xl border bg-[var(--card)] transition-all duration-300 hover:border-[var(--accent)]/40 hover:ring-1 hover:ring-[var(--accent)]/15",
        isRoboticsOnly
          ? "border-dashed border-[var(--border)]"
          : "border-[var(--border)]"
      )}
    >
      {/* Header — slug + badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">
          {project.slug}
        </div>
        <div
          className={cn(
            "text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full",
            isRoboticsOnly
              ? "border border-[var(--border)] text-[var(--muted)]"
              : "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30"
          )}
        >
          {pick(project.badge, locale)}
        </div>
      </div>

      {/* Title + subtitle */}
      <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2 leading-tight">
        {pick(project.title, locale)}
      </h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed mb-5 line-clamp-2">
        {pick(project.subtitle, locale)}
      </p>

      {/* Track badge */}
      {isRoboticsOnly && (
        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] mb-4 self-start">
          <Sparkles className="size-3" />
          {t("roboticsOnly")}
        </div>
      )}

      {/* 문제 → 시스템 → 임팩트 압축 */}
      <div className="space-y-2.5 mb-5 text-xs leading-relaxed flex-1">
        <div className="flex gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] shrink-0 w-16 pt-0.5">
            {t("problem")}
          </span>
          <p className="text-[var(--card-foreground)] line-clamp-2">{pick(project.problem, locale)}</p>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] shrink-0 w-16 pt-0.5">
            {t("system")}
          </span>
          <p className="text-[var(--card-foreground)] line-clamp-2">{pick(project.system, locale)}</p>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] shrink-0 w-16 pt-0.5">
            {t("impact")}
          </span>
          <p className="text-[var(--card-foreground)] line-clamp-2">{pick(project.impact, locale)}</p>
        </div>
      </div>

      {/* Sub-layers */}
      {project.subProjects && project.subProjects.length > 0 && (
        <div className="mb-5 p-3 rounded-lg border border-dashed border-[var(--border)] bg-[var(--subtle)]/40">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--muted)] mb-2">
            {t("subLayers")}
          </div>
          <div className="space-y-1.5">
            {project.subProjects.map((sub) => (
              <div key={sub.slug} className="flex items-center gap-2 text-xs">
                <span className="shrink-0 text-base leading-none">{sub.layerIcon}</span>
                <span className="font-medium text-[var(--card-foreground)]">
                  {sub.layerLabel ? pick(sub.layerLabel, locale) : sub.slug}
                </span>
                <span className="text-[var(--muted)] truncate">— {pick(sub.title, locale)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Areas */}
      {!project.subProjects && project.areas && project.areas.length > 0 && (
        <div className="mb-5 p-3 rounded-lg border border-dashed border-[var(--border)] bg-[var(--subtle)]/40">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--muted)] mb-2">
            {t("areas")}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5">
            {project.areas.map((area, i) => (
              <div key={`${area.icon}-${i}`} className="flex items-start gap-2 text-xs">
                <span className="shrink-0 text-base leading-none mt-0.5">{area.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-[var(--card-foreground)] truncate">
                    {pick(area.label, locale)}
                  </div>
                  <div className="text-[var(--muted)] line-clamp-1 text-[11px] leading-tight">
                    {pick(area.description, locale)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.keywords.slice(0, 5).map((kw, i) => (
          <span
            key={i}
            className="text-[10px] font-mono px-2 py-1 rounded-md bg-[var(--subtle)] text-[var(--muted)]"
          >
            {pick(kw, locale)}
          </span>
        ))}
        {project.keywords.length > 5 && (
          <span className="text-[10px] font-mono px-2 py-1 text-[var(--muted)]">
            +{project.keywords.length - 5}
          </span>
        )}
      </div>

      {/* Detail link */}
      <Link
        href={`/projects/${project.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors mt-auto"
      >
        {t("viewDetail")}
        <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </Link>
    </motion.div>
  );
}
