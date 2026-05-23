import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { projects } from "@/data/projects";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} · 우창욱 포트폴리오`,
    description: project.subtitle,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article className="min-h-screen">
      <div className="mx-auto w-full max-w-4xl px-6 md:px-16 lg:px-24 pt-24 pb-32">
        {/* Back link */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-10"
        >
          <ArrowLeft className="size-4" />
          프로젝트 목록으로
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-baseline gap-3 mb-4">
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)]">
              {project.slug}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30">
              {project.badge}
            </div>
            {project.trackVisibility === "robotics" && (
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[var(--accent)]">
                <Sparkles className="size-3" />
                로보틱스 트랙 전용
              </div>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-3">
            {project.title}
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed">
            {project.subtitle}
          </p>
        </div>

        {/* Metrics (if any) */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]"
              >
                <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mb-1">
                  {m.label}
                </div>
                <div className="text-lg font-bold tracking-tight">{m.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Images Gallery */}
        {project.images && project.images.length > 0 && (
          <div className="mb-12 space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
              화면 · 산출물
            </div>
            <div
              className={`grid gap-4 ${
                project.images.length === 1
                  ? "grid-cols-1"
                  : project.images.length === 2
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {project.images.map((img) => (
                <figure
                  key={img.src}
                  className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)]"
                >
                  <div className="relative w-full aspect-[16/10] bg-[var(--subtle)]">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-contain"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  {img.caption && (
                    <figcaption className="px-4 py-3 text-xs leading-relaxed text-[var(--muted)] border-t border-[var(--border)]">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* 문제 → 시스템 → 임팩트 */}
        <div className="space-y-8 mb-12">
          {[
            { label: "문제", body: project.problem, accent: false },
            { label: "시스템", body: project.system, accent: false },
            { label: "임팩트", body: project.impact, accent: true },
          ].map((section) => (
            <div key={section.label}>
              <div
                className={`text-xs font-mono uppercase tracking-widest mb-3 ${
                  section.accent ? "text-[var(--accent)]" : "text-[var(--muted)]"
                }`}
              >
                {section.label}
              </div>
              <p className="text-base md:text-lg leading-relaxed text-[var(--card-foreground)]">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* 본인 기여 vs 인계받은 영역 (있을 때만) */}
        {(project.ownContribution || project.inheritedScope) && (
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {project.ownContribution && (
              <div className="p-5 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
                  <CheckCircle2 className="size-4" />
                  본인 기여
                </div>
                <p className="text-sm leading-relaxed">{project.ownContribution}</p>
              </div>
            )}
            {project.inheritedScope && (
              <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
                  <AlertCircle className="size-4" />
                  인계받은 영역
                </div>
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  {project.inheritedScope}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Honesty note */}
        {project.honestyNote && (
          <div className="mb-12 p-5 rounded-xl border border-dashed border-[var(--border)] bg-[var(--subtle)]">
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-2">
              솔직성 메모 (면접용)
            </div>
            <p className="text-sm leading-relaxed text-[var(--muted)] italic">
              {project.honestyNote}
            </p>
          </div>
        )}

        {/* Q&A */}
        {project.qa && project.qa.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-5">면접 Q&amp;A 준비</h2>
            <div className="space-y-3">
              {project.qa.map((item, idx) => (
                <details
                  key={idx}
                  className="group p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] open:border-[var(--accent)]/40 transition-colors"
                >
                  <summary className="font-medium cursor-pointer list-none flex items-start justify-between gap-3">
                    <span className="flex-1">
                      <span className="text-[var(--accent)] font-mono mr-2">Q.</span>
                      {item.q}
                    </span>
                    <span className="text-[var(--muted)] text-sm font-mono shrink-0 group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <div className="mt-3 pt-3 border-t border-[var(--border)] text-sm leading-relaxed text-[var(--muted)]">
                    <span className="text-[var(--foreground)] font-mono mr-2">A.</span>
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Keywords */}
        <div className="mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
            키워드
          </div>
          <div className="flex flex-wrap gap-2">
            {project.keywords.map((kw) => (
              <span
                key={kw}
                className="text-xs font-mono px-3 py-1.5 rounded-md bg-[var(--subtle)] text-[var(--card-foreground)]"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Measurement pending */}
        {project.measurementPending && project.measurementPending.length > 0 && (
          <div className="p-5 rounded-xl border border-dashed border-[var(--border)]">
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
              📊 정량 측정 권장 (현재 미측정)
            </div>
            <ul className="text-sm text-[var(--muted)] space-y-1">
              {project.measurementPending.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[var(--muted)]">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sub Projects — 통합 박스가 묶은 레이어별 깊이 */}
        {project.subProjects && project.subProjects.length > 0 && (
          <div className="mt-20">
            <div className="mb-8 pb-4 border-b border-[var(--border)]">
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
                레이어별 깊이
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                3 레이어 각각 자세히
              </h2>
              <p className="text-sm text-[var(--muted)] leading-relaxed max-w-3xl">
                통합 박스가 묶은 각 레이어를 깊이 풀어 봅니다. 외부 검색·공유 시 깊은 링크가 도착하는 위치이기도 합니다.
              </p>
            </div>

            <nav className="mb-10 flex flex-wrap gap-2">
              {project.subProjects.map((sub) => (
                <a
                  key={sub.slug}
                  href={`#${sub.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/40 transition-colors text-sm"
                >
                  <span className="text-base leading-none">{sub.layerIcon}</span>
                  <span className="font-medium">{sub.layerLabel}</span>
                  <span className="text-[var(--muted)]">— {sub.title}</span>
                </a>
              ))}
            </nav>

            <div className="space-y-16">
              {project.subProjects.map((sub) => (
                <SubProjectSection key={sub.slug} sub={sub} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function SubProjectSection({ sub }: { sub: import("@/data/projects").Project }) {
  return (
    <section
      id={sub.slug}
      className="scroll-mt-20 pt-8 border-t border-dashed border-[var(--border)]"
    >
      {/* Layer header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-baseline gap-3 mb-3">
          <span className="text-2xl leading-none">{sub.layerIcon}</span>
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
            {sub.layerLabel} 레이어
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30">
            {sub.badge}
          </span>
          <span className="text-xs font-mono text-[var(--muted)]">/ {sub.slug}</span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2">
          {sub.title}
        </h3>
        <p className="text-sm text-[var(--muted)] leading-relaxed">{sub.subtitle}</p>
      </div>

      {/* Metrics */}
      {sub.metrics && sub.metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {sub.metrics.map((m) => (
            <div
              key={m.label}
              className="p-3 rounded-xl border border-[var(--border)] bg-[var(--card)]"
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mb-1">
                {m.label}
              </div>
              <div className="text-base font-bold tracking-tight">{m.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Problem · System · Impact */}
      <div className="space-y-6 mb-8">
        {[
          { label: "문제", body: sub.problem, accent: false },
          { label: "시스템", body: sub.system, accent: false },
          { label: "임팩트", body: sub.impact, accent: true },
        ].map((section) => (
          <div key={section.label}>
            <div
              className={`text-xs font-mono uppercase tracking-widest mb-2 ${
                section.accent ? "text-[var(--accent)]" : "text-[var(--muted)]"
              }`}
            >
              {section.label}
            </div>
            <p className="text-sm md:text-base leading-relaxed text-[var(--card-foreground)]">
              {section.body}
            </p>
          </div>
        ))}
      </div>

      {/* Sub images */}
      {sub.images && sub.images.length > 0 && (
        <div
          className={`grid gap-4 mb-8 ${
            sub.images.length === 1
              ? "grid-cols-1"
              : sub.images.length === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {sub.images.map((img) => (
            <figure
              key={img.src}
              className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)]"
            >
              <div className="relative w-full aspect-[16/10] bg-[var(--subtle)]">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-contain"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              {img.caption && (
                <figcaption className="px-3 py-2 text-[11px] leading-relaxed text-[var(--muted)] border-t border-[var(--border)]">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      {/* Honesty */}
      {sub.honestyNote && (
        <div className="p-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--subtle)]">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mb-1.5">
            솔직성 메모
          </div>
          <p className="text-xs leading-relaxed text-[var(--muted)] italic">
            {sub.honestyNote}
          </p>
        </div>
      )}
    </section>
  );
}
