"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
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

/**
 * 프로젝트 카드 — "스캔 가능" 재설계.
 * 긴 문제/시스템/임팩트 문단은 상세 페이지로 미루고, 카드는 대표 이미지 + 한 줄 요약 +
 * 핵심 지표(metrics) + 키워드만 보여준다. 카드 전체가 상세로 가는 링크.
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const t = useTranslations("projectCard");
  const locale = useLocale() as Locale;
  const isRoboticsOnly = project.trackVisibility === "robotics";
  const img = project.cardImage;
  const gallery = project.cardImages;
  const metrics = project.metrics?.slice(0, 3) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full"
    >
      <Link
        href={`/projects/${project.slug}`}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[var(--card)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:ring-1 hover:ring-[var(--accent)]/15",
          isRoboticsOnly ? "border-dashed border-[var(--border)]" : "border-[var(--border)]"
        )}
      >
        {/* ── 대표 이미지 (없으면 그라데이션 + 아이콘 폴백) ── */}
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[var(--border)] bg-[var(--subtle)]">
          {gallery && gallery.length > 0 ? (
            // 세로 스크린샷 갤러리 — 비율 유지(object-contain), 나란히, 그라데이션 위 (확대 X)
            <div
              className="absolute inset-0 flex items-end justify-center gap-3 px-5 pt-6"
              style={{
                background:
                  "radial-gradient(125% 90% at 50% -12%, color-mix(in oklch, var(--accent) 14%, var(--subtle)), var(--subtle) 72%)",
              }}
            >
              {gallery.map((g, i) => (
                <div key={i} className="relative h-full min-w-0 flex-1">
                  <Image
                    src={g.src}
                    alt={pick(g.alt, locale)}
                    fill
                    className="object-contain object-bottom drop-shadow-[0_10px_28px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:-translate-y-1"
                    sizes="(min-width: 1536px) 16vw, (min-width: 768px) 25vw, 45vw"
                  />
                </div>
              ))}
            </div>
          ) : img ? (
            <Image
              src={img.src}
              alt={pick(img.alt, locale)}
              fill
              className={cn(
                "object-cover transition-transform duration-500 group-hover:scale-[1.04]",
                img.position === "top" ? "object-top" : "object-center"
              )}
              sizes="(min-width: 1536px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 90% at 22% 8%, color-mix(in oklch, var(--accent) 22%, transparent), transparent 60%), radial-gradient(110% 85% at 92% 102%, color-mix(in oklch, var(--cat-4) 20%, transparent), transparent 55%)",
                }}
              />
              <span className="relative text-5xl opacity-70" aria-hidden>
                {project.icon ?? "📦"}
              </span>
            </div>
          )}

          {/* 상단 스크림 — 배지 가독성 */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[var(--background)]/55 to-transparent"
          />

          {/* 배지 */}
          <span
            className={cn(
              "absolute right-3 top-3 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider backdrop-blur-sm",
              isRoboticsOnly
                ? "border-[var(--border)] bg-[var(--background)]/70 text-[var(--muted)]"
                : "border-[var(--accent)]/30 bg-[var(--background)]/70 text-[var(--accent)]"
            )}
          >
            {pick(project.badge, locale)}
          </span>

          {/* 로보틱스 트랙 전용 칩 */}
          {isRoboticsOnly && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--background)]/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[var(--accent)] backdrop-blur-sm">
              <Sparkles className="size-3" />
              {t("roboticsOnly")}
            </span>
          )}
        </div>

        {/* ── 콘텐츠 ── */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">
            {project.slug}
          </div>
          <h3 className="text-lg font-bold leading-tight tracking-tight md:text-xl">
            {pick(project.title, locale)}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
            {pick(project.subtitle, locale)}
          </p>

          {/* 핵심 지표 */}
          {metrics.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[var(--border)]/60 bg-[var(--subtle)]/40 px-2 py-2"
                >
                  <div className="line-clamp-2 text-[13px] font-bold leading-tight text-[var(--foreground)]">
                    {pick(m.value, locale)}
                  </div>
                  <div className="mt-1 line-clamp-1 text-[9px] leading-tight text-[var(--muted)]">
                    {pick(m.label, locale)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 키워드 */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.keywords.slice(0, 4).map((kw, i) => (
              <span
                key={i}
                className="rounded-md bg-[var(--subtle)] px-2 py-1 font-mono text-[10px] text-[var(--muted)]"
              >
                {pick(kw, locale)}
              </span>
            ))}
            {project.keywords.length > 4 && (
              <span className="px-1.5 py-1 font-mono text-[10px] text-[var(--muted)]">
                +{project.keywords.length - 4}
              </span>
            )}
          </div>

          {/* 상세 링크 어포던스 (카드 전체가 링크) */}
          <div className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
            {t("viewDetail")}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
