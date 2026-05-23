"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, trackPositioning } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { cn } from "@/lib/utils";

type Track = "all" | "satellite" | "robotics";

const trackLabels: Record<Track, string> = {
  all: "전체",
  satellite: "위성 트랙",
  robotics: "로보틱스 트랙",
};

export function ProjectsGrid() {
  const [track, setTrack] = useState<Track>("all");

  const visibleProjects = useMemo(() => {
    if (track === "all") return projects;
    if (track === "satellite")
      return projects.filter((p) => p.trackVisibility === "both" || p.trackVisibility === "satellite");
    // robotics
    return projects.filter((p) => p.trackVisibility === "both" || p.trackVisibility === "robotics");
  }, [track]);

  const positioning = track === "satellite" || track === "robotics" ? trackPositioning[track] : null;

  return (
    <section
      id="projects"
      className="relative border-t border-[var(--border)]"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-16 lg:px-24 py-24">
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
            프로젝트
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            재료는 같습니다. 코스만 다릅니다
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            조립형 이력서의 원칙입니다. 같은 6개 프로젝트라도 읽는 사람에 따라 풀이 깊이가 달라집니다.
            아래 트랙 토글로 회사·도메인 맥락에 맞춘 코스를 보실 수 있습니다.
          </p>
        </div>

        {/* Track toggle */}
        <div className="flex flex-wrap items-center gap-2 mb-10 p-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] w-fit">
          {(Object.keys(trackLabels) as Track[]).map((t) => (
            <button
              key={t}
              onClick={() => setTrack(t)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                track === t
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              {trackLabels[t]}
            </button>
          ))}
        </div>

        {/* Positioning headline (when track is selected) */}
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
                  {positioning.label}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  세일즈 포인트 · {positioning.sellingPoint}
                </div>
              </div>
              <p className="text-base md:text-lg font-medium leading-relaxed">
                &ldquo;{positioning.headline}&rdquo;
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 auto-rows-fr"
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
            현재 표시 · <span className="text-[var(--foreground)]">{visibleProjects.length}</span> 개 프로젝트
          </span>
          <span>
            전체 · <span className="text-[var(--foreground)]">{projects.length}</span> 개 (Brain Trinity는 로보틱스 트랙 전용)
          </span>
        </div>
      </div>
    </section>
  );
}
