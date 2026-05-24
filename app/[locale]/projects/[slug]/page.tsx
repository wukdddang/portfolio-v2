import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, CheckCircle2, AlertCircle, Sparkles, Download } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { projects, type Project } from "@/data/projects";
import { pick } from "@/data/i18n";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: `${pick(project.title, locale)} ${t("projectSuffix")}`,
    description: pick(project.subtitle, locale),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: "projectDetail" });

  const sections = [
    { label: t("problem"), body: pick(project.problem, locale), accent: false },
    { label: t("system"), body: pick(project.system, locale), accent: false },
    { label: t("impact"), body: pick(project.impact, locale), accent: true },
  ];

  return (
    <article className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12 lg:px-16 pt-24 pb-32">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-10"
        >
          <ArrowLeft className="size-4" />
          {t("backToList")}
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-baseline gap-3 mb-4">
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)]">
              {project.slug}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30">
              {pick(project.badge, locale)}
            </div>
            {project.trackVisibility === "robotics" && (
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[var(--accent)]">
                <Sparkles className="size-3" />
                {t("roboticsOnly")}
              </div>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-3">
            {pick(project.title, locale)}
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed">
            {pick(project.subtitle, locale)}
          </p>
        </div>

        {/* Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {project.metrics.map((m, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]"
              >
                <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mb-1">
                  {pick(m.label, locale)}
                </div>
                <div className="text-lg font-bold tracking-tight">
                  {pick(m.value, locale)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Videos Gallery */}
        {project.videos && project.videos.length > 0 && (
          <div className="mb-12 space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
              {t("imagesGallery")}
            </div>
            <div className="space-y-6">
              {project.videos.map((vid) => (
                <figure
                  key={vid.src}
                  className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)]"
                >
                  <div className="relative w-full bg-[var(--subtle)]">
                    <video
                      src={vid.src}
                      poster={vid.poster}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-label={pick(vid.alt, locale)}
                      className="w-full h-auto block"
                    />
                  </div>
                  {(vid.caption || vid.gif) && (
                    <figcaption className="px-4 py-3 text-xs leading-relaxed text-[var(--muted)] border-t border-[var(--border)] flex flex-wrap items-start justify-between gap-3">
                      {vid.caption && <span className="flex-1">{pick(vid.caption, locale)}</span>}
                      {vid.gif && (
                        <a
                          href={vid.gif}
                          download
                          className="inline-flex items-center gap-1.5 shrink-0 font-mono text-[10px] uppercase tracking-widest text-[var(--accent)] hover:underline"
                        >
                          <Download className="size-3" />
                          GIF
                        </a>
                      )}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* Images Gallery */}
        {project.images && project.images.length > 0 && (
          <div className="mb-12 space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
              {t("imagesGallery")}
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
                      alt={pick(img.alt, locale)}
                      fill
                      className="object-contain"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  {img.caption && (
                    <figcaption className="px-4 py-3 text-xs leading-relaxed text-[var(--muted)] border-t border-[var(--border)]">
                      {pick(img.caption, locale)}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* Problem · System · Impact */}
        <div className="space-y-8 mb-12">
          {sections.map((section) => (
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

        {/* Own contribution / Inherited */}
        {(project.ownContribution || project.inheritedScope) && (
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {project.ownContribution && (
              <div className="p-5 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
                  <CheckCircle2 className="size-4" />
                  {t("ownContribution")}
                </div>
                <p className="text-sm leading-relaxed">
                  {pick(project.ownContribution, locale)}
                </p>
              </div>
            )}
            {project.inheritedScope && (
              <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
                  <AlertCircle className="size-4" />
                  {t("inheritedScope")}
                </div>
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  {pick(project.inheritedScope, locale)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Honesty note */}
        {project.honestyNote && (
          <div className="mb-12 p-5 rounded-xl border border-dashed border-[var(--border)] bg-[var(--subtle)]">
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-2">
              {t("honestyNote")}
            </div>
            <p className="text-sm leading-relaxed text-[var(--muted)] italic">
              {pick(project.honestyNote, locale)}
            </p>
          </div>
        )}

        {/* Q&A */}
        {project.qa && project.qa.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-5">
              {t("qaTitle")}
            </h2>
            <div className="space-y-3">
              {project.qa.map((item, idx) => (
                <details
                  key={idx}
                  className="group p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] open:border-[var(--accent)]/40 transition-colors"
                >
                  <summary className="font-medium cursor-pointer list-none flex items-start justify-between gap-3">
                    <span className="flex-1">
                      <span className="text-[var(--accent)] font-mono mr-2">Q.</span>
                      {pick(item.q, locale)}
                    </span>
                    <span className="text-[var(--muted)] text-sm font-mono shrink-0 group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <div className="mt-3 pt-3 border-t border-[var(--border)] text-sm leading-relaxed text-[var(--muted)]">
                    <span className="text-[var(--foreground)] font-mono mr-2">A.</span>
                    {pick(item.a, locale)}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Keywords */}
        <div className="mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
            {t("keywords")}
          </div>
          <div className="flex flex-wrap gap-2">
            {project.keywords.map((kw, i) => (
              <span
                key={i}
                className="text-xs font-mono px-3 py-1.5 rounded-md bg-[var(--subtle)] text-[var(--card-foreground)]"
              >
                {pick(kw, locale)}
              </span>
            ))}
          </div>
        </div>

        {/* Measurement pending */}
        {project.measurementPending && project.measurementPending.length > 0 && (
          <div className="p-5 rounded-xl border border-dashed border-[var(--border)]">
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
              {t("measurementPending")}
            </div>
            <ul className="text-sm text-[var(--muted)] space-y-1">
              {project.measurementPending.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[var(--muted)]">·</span>
                  <span>{pick(item, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sub Projects */}
        {project.subProjects && project.subProjects.length > 0 && (
          <div className="mt-20">
            <div className="mb-8 pb-4 border-b border-[var(--border)]">
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
                {t("subProjectsEyebrow")}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                {t("subProjectsTitle")}
              </h2>
              <p className="text-sm text-[var(--muted)] leading-relaxed max-w-3xl">
                {t("subProjectsLede")}
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
                  <span className="font-medium">
                    {sub.layerLabel ? pick(sub.layerLabel, locale) : sub.slug}
                  </span>
                  <span className="text-[var(--muted)]">— {pick(sub.title, locale)}</span>
                </a>
              ))}
            </nav>

            <div className="space-y-16">
              {project.subProjects.map((sub) => (
                <SubProjectSection key={sub.slug} sub={sub} locale={locale} t={t} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function SubProjectSection({
  sub,
  locale,
  t,
}: {
  sub: Project;
  locale: Locale;
  t: (key: string) => string;
}) {
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
            {sub.layerLabel ? pick(sub.layerLabel, locale) : sub.slug} {t("layerSuffix")}
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30">
            {pick(sub.badge, locale)}
          </span>
          <span className="text-xs font-mono text-[var(--muted)]">/ {sub.slug}</span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2">
          {pick(sub.title, locale)}
        </h3>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          {pick(sub.subtitle, locale)}
        </p>
      </div>

      {/* Metrics */}
      {sub.metrics && sub.metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {sub.metrics.map((m, i) => (
            <div
              key={i}
              className="p-3 rounded-xl border border-[var(--border)] bg-[var(--card)]"
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mb-1">
                {pick(m.label, locale)}
              </div>
              <div className="text-base font-bold tracking-tight">
                {pick(m.value, locale)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Problem · System · Impact */}
      <div className="space-y-6 mb-8">
        {[
          { label: t("problem"), body: pick(sub.problem, locale), accent: false },
          { label: t("system"), body: pick(sub.system, locale), accent: false },
          { label: t("impact"), body: pick(sub.impact, locale), accent: true },
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

      {/* Sub videos */}
      {sub.videos && sub.videos.length > 0 && (
        <div className="space-y-4 mb-8">
          {sub.videos.map((vid) => (
            <figure
              key={vid.src}
              className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)]"
            >
              <div className="relative w-full bg-[var(--subtle)]">
                <video
                  src={vid.src}
                  poster={vid.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={pick(vid.alt, locale)}
                  className="w-full h-auto block"
                />
              </div>
              {(vid.caption || vid.gif) && (
                <figcaption className="px-3 py-2 text-[11px] leading-relaxed text-[var(--muted)] border-t border-[var(--border)] flex flex-wrap items-start justify-between gap-3">
                  {vid.caption && <span className="flex-1">{pick(vid.caption, locale)}</span>}
                  {vid.gif && (
                    <a
                      href={vid.gif}
                      download
                      className="inline-flex items-center gap-1.5 shrink-0 font-mono text-[10px] uppercase tracking-widest text-[var(--accent)] hover:underline"
                    >
                      <Download className="size-3" />
                      GIF
                    </a>
                  )}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

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
                  alt={pick(img.alt, locale)}
                  fill
                  className="object-contain"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              {img.caption && (
                <figcaption className="px-3 py-2 text-[11px] leading-relaxed text-[var(--muted)] border-t border-[var(--border)]">
                  {pick(img.caption, locale)}
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
            {t("honestyShort")}
          </div>
          <p className="text-xs leading-relaxed text-[var(--muted)] italic">
            {pick(sub.honestyNote, locale)}
          </p>
        </div>
      )}
    </section>
  );
}
