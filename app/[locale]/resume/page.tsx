import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { personal } from "@/data/personal";
import { tenureLabel } from "@/lib/tenure";
import {
  resumeSummary,
  resumeExperience,
  resumeEducation,
  resumeSideProjects,
  resumeContacts,
  type ResumeProject,
} from "@/data/resume";
import { mainStack, learnedDomain } from "@/data/stack";
import { PrintButton } from "@/components/PrintButton";
import { pick } from "@/data/i18n";
import { Md } from "@/lib/markdown";
import { VisionText } from "@/components/VisionText";
import { JsonLd } from "@/components/JsonLd";
import { resumeGraph } from "@/lib/jsonld";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("resumeTitle");
  const description = t("resumeDescription");
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/resume`,
      languages: {
        ko: "/ko/resume",
        en: "/en/resume",
        "x-default": "/resume",
      },
    },
    openGraph: {
      type: "article",
      url: `/${locale}/resume`,
      title,
      description,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "resume" });
  const tm = await getTranslations({ locale, namespace: "metadata" });

  return (
    <article className="min-h-screen">
      <JsonLd
        data={resumeGraph(locale, tm("resumeTitle"), tm("resumeDescription"))}
      />
      <div className="print:hidden border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md sticky top-16 z-30">
        <div className="mx-auto w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl px-6 md:px-10 lg:px-12 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            {t("toolbarBack")}
          </Link>
          <PrintButton />
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl px-6 md:px-10 lg:px-12 pt-20 md:pt-24 pb-32 print:pt-8 print:pb-8 print:max-w-none">
        {/* Header */}
        <header className="mb-12 print:mb-6">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3 print:text-[var(--muted)]">
            {t("header")}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-3">
            {pick(personal.name, locale)}
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed">
            <Md>{pick(resumeSummary.oneLiner, locale)}</Md>
          </p>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-mono text-[var(--muted)]">
            <span>
              <span className="text-[var(--muted)]/60">{t("meta.mainDomain")}</span>{" "}
              <span className="text-[var(--foreground)]">{t("meta.mainDomainValue")}</span>
            </span>
            <span>
              <span className="text-[var(--muted)]/60">{t("meta.learnedDomain")}</span>{" "}
              <span className="text-[var(--foreground)]">{t("meta.learnedDomainValue")}</span>
            </span>
            <span>
              <span className="text-[var(--muted)]/60">{t("meta.aiStage")}</span>{" "}
              <span className="text-[var(--foreground)]">
                {pick(personal.currentStage.plain, locale)}
              </span>
            </span>
            <span>
              <span className="text-[var(--muted)]/60">{t("meta.yearsLabel")}</span>{" "}
              <span className="text-[var(--foreground)]">
                {tenureLabel(personal.joinDate, locale)}
              </span>
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm font-mono">
            <a
              href={`mailto:${resumeContacts.email}`}
              className="hover:text-[var(--accent)] transition-colors"
            >
              {resumeContacts.email}
            </a>
            <a
              href={resumeContacts.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              github.com/wukdddang
            </a>
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">
              {t("linkPortfolio")}
            </Link>
          </div>
        </header>

        {/* Summary */}
        <Section title={t("sections.summary")} eyebrow={t("sections.summaryEyebrow")}>
          <div className="space-y-4">
            {resumeSummary.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-lg leading-relaxed text-[var(--card-foreground)]"
              >
                <Md>{pick(p, locale)}</Md>
              </p>
            ))}
          </div>
          <div className="mt-8 p-6 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 print:bg-transparent">
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
              {pick(resumeSummary.positioning.headline, locale)}
            </div>
            <ul className="space-y-2.5">
              {resumeSummary.positioning.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-base leading-relaxed">
                  <span className="text-[var(--accent)] font-mono mt-0.5">•</span>
                  <span>
                    <Md>{pick(b, locale)}</Md>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* Invitations */}
        <Section
          title={t("sections.invitations")}
          eyebrow={t("sections.invitationsEyebrow")}
          subtle
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {personal.invitations.map((q, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] print:bg-transparent"
              >
                <p className="text-base leading-relaxed">
                  <Md>{pick(q, locale)}</Md>
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Education */}
        <Section title={t("sections.education")} eyebrow={t("sections.educationEyebrow")}>
          <div className="space-y-5">
            {resumeEducation.map((edu, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                    {pick(edu.degree, locale)}
                  </h3>
                  <span className="text-sm font-mono text-[var(--muted)]">
                    {pick(edu.period, locale)}
                  </span>
                </div>
                <div className="text-base text-[var(--muted)] mt-1">
                  {pick(edu.school, locale)}
                </div>
                {edu.note && (
                  <p className="mt-2 text-base leading-relaxed text-[var(--card-foreground)]">
                    <Md>{pick(edu.note, locale)}</Md>
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section title={t("sections.experience")} eyebrow={t("sections.experienceEyebrow")}>
          {resumeExperience.map((role, ri) => (
            <div key={ri} className="mb-14 last:mb-0">
              <div className="mb-6 pb-3 border-b border-[var(--border)]">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {pick(role.company, locale)}
                  </h3>
                  <span className="text-sm font-mono text-[var(--muted)]">
                    {pick(role.period, locale)}
                  </span>
                </div>
                <div className="text-base text-[var(--muted)] mt-1.5">
                  {pick(role.position, locale)}
                </div>
                <p className="mt-3 text-base leading-relaxed text-[var(--card-foreground)]">
                  <Md>{pick(role.summary, locale)}</Md>
                </p>
              </div>

              <div className="space-y-9">
                {role.projects.map((proj, pi) => (
                  <ProjectBlock key={pi} project={proj} locale={locale} t={t} />
                ))}
              </div>
            </div>
          ))}
        </Section>

        {/* Side Projects */}
        <Section title={t("sections.side")} eyebrow={t("sections.sideEyebrow")}>
          <div className="space-y-9">
            {resumeSideProjects.map((proj, i) => (
              <ProjectBlock key={i} project={proj} locale={locale} t={t} />
            ))}
          </div>
        </Section>

        {/* Tech Stack */}
        <Section title={t("sections.stack")} eyebrow={t("sections.stackEyebrow")}>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
                {t("stack.mainColumn")}
              </div>
              <div className="space-y-3.5">
                {mainStack.map((cat, i) => (
                  <div key={i}>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--muted)]/70 mb-1">
                      {pick(cat.label, locale)}
                    </div>
                    <div className="text-base leading-relaxed">
                      {cat.items.map((it) => it.name).join(" · ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
                {t("stack.learnedColumn")}
              </div>
              <div className="space-y-3.5">
                {learnedDomain.map((cat, i) => (
                  <div key={i}>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--muted)]/70 mb-1">
                      {pick(cat.label, locale)}
                    </div>
                    <div className="text-base leading-relaxed">
                      {cat.items.map((it) => it.name).join(" · ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* About / Brain Trinity */}
        <Section title={t("sections.about")} eyebrow={t("sections.aboutEyebrow")}>
          <div className="p-6 rounded-xl border border-[var(--accent)]/30 bg-[var(--card)] mb-6 print:bg-transparent">
            <div className="flex items-start gap-3">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-2">
                  {t("about.brainTrinityEyebrow")}
                </div>
                <p className="text-base leading-relaxed">
                  <Md>{pick(personal.brainTrinity.note, locale)}</Md>
                </p>
              </div>
            </div>
          </div>
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
            {t("about.futureHeading")}
          </div>
          <ul className="space-y-2">
            {personal.futureVision.map((v, i) => (
              <li key={i} className="flex items-start gap-2.5 text-base">
                <span className="text-[var(--accent)] font-mono">→</span>
                <span>
                  <VisionText item={v} locale={locale} />
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Contact */}
        <Section title={t("sections.contact")} eyebrow={t("sections.contactEyebrow")}>
          <div className="flex flex-wrap items-center gap-3 text-base">
            <a
              href={`mailto:${resumeContacts.email}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] hover:bg-[var(--subtle)] transition-colors print:border-none print:px-0"
            >
              {resumeContacts.email}
            </a>
            <a
              href={resumeContacts.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] hover:bg-[var(--subtle)] transition-colors print:border-none print:px-0"
            >
              github.com/wukdddang
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] hover:bg-[var(--subtle)] transition-colors print:border-none print:px-0"
            >
              {t("contact.portfolioLink")}
            </Link>
          </div>
          <div className="mt-6 text-sm text-[var(--muted)] print:hidden">
            <Md>{t("contact.baseNote")}</Md>
          </div>
        </Section>
      </div>
    </article>
  );
}

function Section({
  title,
  eyebrow,
  children,
  subtle = false,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  subtle?: boolean;
}) {
  return (
    <section className="mb-14 last:mb-0 print:mb-6">
      <div className="mb-6 pb-2.5 border-b border-[var(--border)]">
        {eyebrow && (
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-1.5">
            {eyebrow}
          </div>
        )}
        <h2
          className={`text-3xl md:text-4xl font-bold tracking-tight ${
            subtle ? "text-[var(--card-foreground)]" : ""
          }`}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function ProjectBlock({
  project,
  locale,
  t,
}: {
  project: ResumeProject;
  locale: Locale;
  t: (key: string) => string;
}) {
  return (
    <div className="break-inside-avoid">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
        <h4 className="text-lg md:text-xl font-bold tracking-tight">
          {project.slug ? (
            <Link
              href={`/projects/${project.slug}`}
              className="hover:text-[var(--accent)] transition-colors print:text-[var(--foreground)]"
            >
              {pick(project.name, locale)}
            </Link>
          ) : (
            pick(project.name, locale)
          )}
        </h4>
        <div className="flex items-center gap-2 text-sm font-mono">
          {project.badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 print:border-current">
              {pick(project.badge, locale)}
            </span>
          )}
          {project.period && (
            <span className="text-[var(--muted)]">{pick(project.period, locale)}</span>
          )}
        </div>
      </div>

      <p className="text-base text-[var(--muted)] leading-relaxed mb-3">
        <Md>{pick(project.context, locale)}</Md>
      </p>

      <div className="grid gap-5 md:grid-cols-2 mb-3">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-2">
            {t("block.whatLabel")}
          </div>
          <ul className="space-y-2 text-base leading-relaxed">
            {project.what.map((w, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-[var(--muted)] font-mono mt-1.5 text-[11px]">▸</span>
                <span>
                  <Md>{pick(w, locale)}</Md>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-2">
            {t("block.impactLabel")}
          </div>
          <ul className="space-y-2 text-base leading-relaxed">
            {project.impact.map((im, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-[var(--accent)] font-mono mt-1.5 text-[11px]">▸</span>
                <span>
                  <Md>{pick(im, locale)}</Md>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {project.stack && project.stack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--subtle)] text-[var(--muted)] print:bg-transparent print:border print:border-[var(--border)]"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {project.honestyNote && (
        <p className="mt-2.5 text-sm italic text-[var(--muted)] leading-relaxed">
          ※ <Md>{pick(project.honestyNote, locale)}</Md>
        </p>
      )}

      {project.slug && (
        <div className="mt-3 print:hidden">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-sm font-mono text-[var(--accent)] hover:underline"
          >
            {t("block.viewDetail")}
          </Link>
        </div>
      )}
    </div>
  );
}
