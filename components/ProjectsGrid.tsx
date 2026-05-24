"use client";

import { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { projects, trackPositioning } from "@/data/projects";
import { pick } from "@/data/i18n";
import type { Locale } from "@/i18n/routing";
import { ProjectCard } from "./ProjectCard";
import { cn } from "@/lib/utils";

type Track = "all" | "satellite" | "robotics";

export function ProjectsGrid() {
  const t = useTranslations("projects");
  const locale = useLocale() as Locale;
  const [track, setTrack] = useState<Track>("all");

  const trackLabels: Record<Track, string> = {
    all: t("trackAll"),
    satellite: t("trackSatellite"),
    robotics: t("trackRobotics"),
  };

  const visibleProjects = useMemo(() => {
    if (track === "all") return projects;
    if (track === "satellite")
      return projects.filter(
        (p) => p.trackVisibility === "both" || p.trackVisibility === "satellite"
      );
    return projects.filter(
      (p) => p.trackVisibility === "both" || p.trackVisibility === "robotics"
    );
  }, [track]);

  const positioning =
    track === "satellite" || track === "robotics"
      ? trackPositioning[track]
      : null;

  return (
    <section
      id="projects"
      className="relative border-t border-[var(--border)]"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12 py-24">
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
            {t("eyebrow")}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">{t("lede")}</p>
        </div>

        {/* Track toggle */}
        <div className="flex flex-wrap items-center gap-2 mb-10 p-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] w-fit">
          {(Object.keys(trackLabels) as Track[]).map((tk) => (
            <button
              key={tk}
              onClick={() => setTrack(tk)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                track === tk
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              {trackLabels[tk]}
            </button>
          ))}
        </div>

        {/* Positioning headline */}
        <AnimatePresence mode="wait">
          {positioning && (
            <motion.div
              key={track}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mb-10 p-5 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/20"
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-2">
                <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
                  {pick(positioning.label, locale)}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  {t("sellingPoint")} · {pick(positioning.sellingPoint, locale)}
                </div>
              </div>
              <p className="text-base md:text-lg font-medium leading-relaxed">
                &ldquo;{pick(positioning.headline, locale)}&rdquo;
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 md:gap-6 auto-rows-fr"
        >
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, idx) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                className="h-full"
              >
                <ProjectCard project={project} index={idx} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer note */}
        <div className="mt-8 text-xs font-mono text-[var(--muted)] flex flex-wrap gap-x-6 gap-y-2">
          <span>
            {t("showingNow")} ·{" "}
            <span className="text-[var(--foreground)]">{visibleProjects.length}</span>{" "}
            {t("projectsUnit")}
          </span>
          <span>
            {t("total")} ·{" "}
            <span className="text-[var(--foreground)]">{projects.length}</span>{" "}
            {t("totalSuffix")}
          </span>
        </div>
      </div>
    </section>
  );
}
