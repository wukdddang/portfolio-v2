"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const isRoboticsOnly = project.trackVisibility === "robotics";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        "group relative flex flex-col h-full p-6 rounded-2xl border bg-[var(--card)] hover:border-[var(--accent)]/40 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]",
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
          {project.badge}
        </div>
      </div>

      {/* Title + subtitle */}
      <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2 leading-tight">
        {project.title}
      </h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed mb-5 line-clamp-2">
        {project.subtitle}
      </p>

      {/* Track badge */}
      {isRoboticsOnly && (
        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] mb-4 self-start">
          <Sparkles className="size-3" />
          로보틱스 트랙 전용
        </div>
      )}

      {/* 문제 → 시스템 → 임팩트 압축 */}
      <div className="space-y-2.5 mb-5 text-xs leading-relaxed flex-1">
        <div className="flex gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] shrink-0 w-12 pt-0.5">
            문제
          </span>
          <p className="text-[var(--card-foreground)] line-clamp-2">{project.problem}</p>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] shrink-0 w-12 pt-0.5">
            시스템
          </span>
          <p className="text-[var(--card-foreground)] line-clamp-2">{project.system}</p>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] shrink-0 w-12 pt-0.5">
            임팩트
          </span>
          <p className="text-[var(--card-foreground)] line-clamp-2">{project.impact}</p>
        </div>
      </div>

      {/* Sub-layers — 통합 박스 (lumir-sar-platform 등 별도 Project 묶음) */}
      {project.subProjects && project.subProjects.length > 0 && (
        <div className="mb-5 p-3 rounded-lg border border-dashed border-[var(--border)] bg-[var(--subtle)]/40">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--muted)] mb-2">
            구성 레이어
          </div>
          <div className="space-y-1.5">
            {project.subProjects.map((sub) => (
              <div key={sub.slug} className="flex items-center gap-2 text-xs">
                <span className="shrink-0 text-base leading-none">{sub.layerIcon}</span>
                <span className="font-medium text-[var(--card-foreground)]">
                  {sub.layerLabel}
                </span>
                <span className="text-[var(--muted)] truncate">— {sub.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Areas — 카드 안 미니 구성 영역 (subProjects 없을 때) */}
      {!project.subProjects && project.areas && project.areas.length > 0 && (
        <div className="mb-5 p-3 rounded-lg border border-dashed border-[var(--border)] bg-[var(--subtle)]/40">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--muted)] mb-2">
            구성 영역
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5">
            {project.areas.map((area) => (
              <div key={area.label} className="flex items-start gap-2 text-xs">
                <span className="shrink-0 text-base leading-none mt-0.5">{area.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-[var(--card-foreground)] truncate">
                    {area.label}
                  </div>
                  <div className="text-[var(--muted)] line-clamp-1 text-[11px] leading-tight">
                    {area.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.keywords.slice(0, 5).map((kw) => (
          <span
            key={kw}
            className="text-[10px] font-mono px-2 py-1 rounded-md bg-[var(--subtle)] text-[var(--muted)]"
          >
            {kw}
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
        자세히 보기
        <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </Link>
    </motion.div>
  );
}
