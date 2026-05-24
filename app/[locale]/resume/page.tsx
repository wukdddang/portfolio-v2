import { ArrowLeft, Mail, Sparkles, CheckCircle2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { personal } from "@/data/personal";
import {
  resumeSummary,
  resumeExperience,
  resumeSideProjects,
  resumeContacts,
  type ResumeProject,
} from "@/data/resume";
import { mainStack, learnedDomain } from "@/data/stack";
import { PrintButton } from "@/components/PrintButton";
import { pick } from "@/data/i18n";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("resumeTitle"),
    description: t("resumeDescription"),
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

  return (
    <article className="min-h-screen">
      <div className="print:hidden border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md sticky top-16 z-30">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-16 lg:px-24 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            {t("toolbarBack")}
          </Link>
          <PrintButton />
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl px-6 md:px-16 lg:px-24 pt-16 pb-32 print:pt-8 print:pb-8 print:max-w-none">
        {/* Header */}
        <header className="mb-12 print:mb-8">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] mb-3 print:text-[var(--muted)]">
            {t("header")}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-3">
            {pick(personal.name, locale)}
          </h1>
          <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed max-w-3xl">
            {pick(resumeSummary.oneLiner, locale)}
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-[var(--muted)]">
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
                {pick(personal.currentStage.range, locale)}
              </span>
            </span>
            <span>
              <span className="text-[var(--muted)]/60">{t("meta.yearsLabel")}</span>{" "}
              <span className="text-[var(--foreground)]">
                {pick(personal.yearsExperience, locale)}
              </span>
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs font-mono">
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
          <div className="space-y-4 max-w-3xl">
            {resumeSummary.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-[15px] leading-relaxed text-[var(--card-foreground)]"
              >
                {pick(p, locale)}
              </p>
            ))}
          </div>
          <div className="mt-8 p-5 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 print:bg-transparent">
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
              {pick(resumeSummary.positioning.headline, locale)}
            </div>
            <ul className="space-y-2">
              {resumeSummary.positioning.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                  <span className="text-[var(--accent)] font-mono mt-0.5">•</span>
                  <span>{pick(b, locale)}</span>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl">
            {personal.invitations.map((q, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] print:bg-transparent"
              >
                <CheckCircle2 className="size-5 shrink-0 text-[var(--accent)] mt-0.5" />
                <p className="text-sm leading-relaxed">{pick(q, locale)}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section title={t("sections.experience")} eyebrow={t("sections.experienceEyebrow")}>
          {resumeExperience.map((role, ri) => (
            <div key={ri} className="mb-12 last:mb-0">
              <div className="mb-6 pb-3 border-b border-[var(--border)]">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-2xl font-bold tracking-tight">
                    {pick(role.company, locale)}
                  </h3>
                  <span className="text-xs font-mono text-[var(--muted)]">
                    {pick(role.period, locale)}
                  </span>
                </div>
                <div className="text-sm text-[var(--muted)] mt-1">
                  {pick(role.position, locale)}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--card-foreground)] max-w-3xl">
                  {pick(role.summary, locale)}
                </p>
              </div>

              <div className="space-y-8">
                {role.projects.map((proj, pi) => (
                  <ProjectBlock key={pi} project={proj} locale={locale} t={t} />
                ))}
              </div>
            </div>
          ))}
        </Section>

        {/* Side Projects */}
        <Section title={t("sections.side")} eyebrow={t("sections.sideEyebrow")}>
          <div className="space-y-8">
            {resumeSideProjects.map((proj, i) => (
              <ProjectBlock key={i} project={proj} locale={locale} t={t} />
            ))}
          </div>
        </Section>

        {/* Tech Stack */}
        <Section title={t("sections.stack")} eyebrow={t("sections.stackEyebrow")}>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
                {t("stack.mainColumn")}
              </div>
              <div className="space-y-3">
                {mainStack.map((cat, i) => (
                  <div key={i}>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]/70 mb-1">
                      {pick(cat.label, locale)}
                    </div>
                    <div className="text-sm leading-relaxed">
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
              <div className="space-y-3">
                {learnedDomain.map((cat, i) => (
                  <div key={i}>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]/70 mb-1">
                      {pick(cat.label, locale)}
                    </div>
                    <div className="text-sm leading-relaxed">
                      {cat.items.map((it) => it.name).join(" · ")}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-dashed border-[var(--border)] text-xs font-mono text-[var(--muted)]">
                {t("stack.nextDirection")}
              </div>
            </div>
          </div>
        </Section>

        {/* About / Brain Trinity */}
        <Section title={t("sections.about")} eyebrow={t("sections.aboutEyebrow")}>
          <div className="p-6 rounded-2xl bg-[var(--foreground)] text-[var(--background)] mb-6 print:bg-transparent print:text-[var(--foreground)] print:border print:border-[var(--border)]">
            <div className="flex items-start gap-3">
              <Sparkles className="size-5 mt-0.5 shrink-0 opacity-80" />
              <div>
                <div className="text-xs font-mono uppercase tracking-widest opacity-60 mb-2">
                  {t("about.brainTrinityEyebrow")}
                </div>
                <p className="text-sm leading-relaxed">
                  {pick(personal.brainTrinity.note, locale)}
                </p>
              </div>
            </div>
          </div>
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
            {t("about.futureHeading")}
          </div>
          <ul className="space-y-2">
            {personal.futureVision.map((v, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-[var(--accent)] font-mono">→</span>
                <span>{pick(v, locale)}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Contact */}
        <Section title={t("sections.contact")} eyebrow={t("sections.contactEyebrow")}>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a
              href={`mailto:${resumeContacts.email}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] hover:bg-[var(--subtle)] transition-colors print:border-none print:px-0"
            >
              <Mail className="size-4" />
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
          <div className="mt-6 text-xs text-[var(--muted)] max-w-2xl print:hidden">
            {t("contact.baseNote")}
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
    <section className="mb-14 last:mb-0 print:mb-8">
      <div className="mb-6 pb-2 border-b border-[var(--border)]">
        {eyebrow && (
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mb-1">
            {eyebrow}
          </div>
        )}
        <h2
          className={`text-2xl md:text-3xl font-bold tracking-tight ${
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
        <h4 className="text-lg font-semibold tracking-tight">
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
        <div className="flex items-center gap-2 text-xs font-mono">
          {project.badge && (
            <span className="px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 print:border-current">
              {pick(project.badge, locale)}
            </span>
          )}
          {project.period && (
            <span className="text-[var(--muted)]">{pick(project.period, locale)}</span>
          )}
        </div>
      </div>

      <p className="text-sm text-[var(--muted)] leading-relaxed mb-3 max-w-3xl">
        {pick(project.context, locale)}
      </p>

      <div className="grid gap-4 md:grid-cols-2 mb-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mb-2">
            {t("block.whatLabel")}
          </div>
          <ul className="space-y-1.5 text-sm leading-relaxed">
            {project.what.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[var(--muted)] font-mono mt-1 text-[10px]">▸</span>
                <span>{pick(w, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] mb-2">
            {t("block.impactLabel")}
          </div>
          <ul className="space-y-1.5 text-sm leading-relaxed">
            {project.impact.map((im, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[var(--accent)] font-mono mt-1 text-[10px]">▸</span>
                <span>{pick(im, locale)}</span>
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
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--subtle)] text-[var(--muted)] print:bg-transparent print:border print:border-[var(--border)]"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {project.honestyNote && (
        <p className="mt-2 text-xs italic text-[var(--muted)] leading-relaxed max-w-3xl">
          ※ {pick(project.honestyNote, locale)}
        </p>
      )}
    </div>
  );
}
