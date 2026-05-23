import Link from "next/link";
import { ArrowLeft, Mail, Sparkles, CheckCircle2 } from "lucide-react";
import { personal } from "@/data/personal";
import {
  resumeSummary,
  resumeExperience,
  resumeSideProjects,
  resumeContacts,
} from "@/data/resume";
import { mainStack, learnedDomain } from "@/data/stack";
import { PrintButton } from "@/components/PrintButton";

export const metadata = {
  title: "우창욱 이력서 · 웹 개발자, SAR 도메인 확장 중",
  description:
    "AI native 풀스택 + 직군 확장 · base 이력서 (회사 미정 시점, 인쇄·PDF export 가능)",
};

export default function ResumePage() {
  return (
    <article className="min-h-screen">
      {/* Toolbar — print 시 hidden */}
      <div className="print:hidden border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md sticky top-16 z-30">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-16 lg:px-24 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            포트폴리오로
          </Link>
          <PrintButton />
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl px-6 md:px-16 lg:px-24 pt-16 pb-32 print:pt-8 print:pb-8 print:max-w-none">
        {/* Header */}
        <header className="mb-12 print:mb-8">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] mb-3 print:text-[var(--muted)]">
            Resume · 2026-05 · Base 버전
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-3">
            {personal.name}
          </h1>
          <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed max-w-3xl">
            {resumeSummary.oneLiner}
          </p>

          {/* meta strip */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-[var(--muted)]">
            <span>
              <span className="text-[var(--muted)]/60">메인 직군</span>{" "}
              <span className="text-[var(--foreground)]">웹 개발 · 풀스택</span>
            </span>
            <span>
              <span className="text-[var(--muted)]/60">학습 도메인</span>{" "}
              <span className="text-[var(--foreground)]">SAR · 위성영상</span>
            </span>
            <span>
              <span className="text-[var(--muted)]/60">AI 활용 단계</span>{" "}
              <span className="text-[var(--foreground)]">
                {personal.currentStage.range}
              </span>
            </span>
            <span>
              <span className="text-[var(--muted)]/60">연차</span>{" "}
              <span className="text-[var(--foreground)]">
                {personal.yearsExperience}
              </span>
            </span>
          </div>

          {/* Contacts */}
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
            <Link
              href="/"
              className="hover:text-[var(--accent)] transition-colors"
            >
              포트폴리오
            </Link>
          </div>
        </header>

        {/* Summary */}
        <Section title="Summary" eyebrow="요약">
          <div className="space-y-4 max-w-3xl">
            {resumeSummary.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-[15px] leading-relaxed text-[var(--card-foreground)]"
              >
                {p}
              </p>
            ))}
          </div>
          <div className="mt-8 p-5 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 print:bg-transparent">
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
              {resumeSummary.positioning.headline}
            </div>
            <ul className="space-y-2">
              {resumeSummary.positioning.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                  <span className="text-[var(--accent)] font-mono mt-0.5">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* Invitations */}
        <Section title="찾으시는 분이라면" eyebrow="invitations" subtle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl">
            {personal.invitations.map((q) => (
              <div
                key={q}
                className="flex items-start gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] print:bg-transparent"
              >
                <CheckCircle2 className="size-5 shrink-0 text-[var(--accent)] mt-0.5" />
                <p className="text-sm leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section title="Experience" eyebrow="회사 경력">
          {resumeExperience.map((role) => (
            <div key={role.company} className="mb-12 last:mb-0">
              <div className="mb-6 pb-3 border-b border-[var(--border)]">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-2xl font-bold tracking-tight">
                    {role.company}
                  </h3>
                  <span className="text-xs font-mono text-[var(--muted)]">
                    {role.period}
                  </span>
                </div>
                <div className="text-sm text-[var(--muted)] mt-1">
                  {role.position}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--card-foreground)] max-w-3xl">
                  {role.summary}
                </p>
              </div>

              <div className="space-y-8">
                {role.projects.map((proj) => (
                  <ProjectBlock key={proj.name} project={proj} />
                ))}
              </div>
            </div>
          ))}
        </Section>

        {/* Side Projects */}
        <Section title="Side Projects" eyebrow="사이드 프로젝트">
          <div className="space-y-8">
            {resumeSideProjects.map((proj) => (
              <ProjectBlock key={proj.name} project={proj} />
            ))}
          </div>
        </Section>

        {/* Tech Stack */}
        <Section title="Tech Stack" eyebrow="기술 스택">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
                메인 직군 · 웹 개발
              </div>
              <div className="space-y-3">
                {mainStack.map((cat) => (
                  <div key={cat.label}>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]/70 mb-1">
                      {cat.label}
                    </div>
                    <div className="text-sm leading-relaxed">
                      {cat.items.map((i) => i.name).join(" · ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
                학습 도메인 · SAR · 위성영상
              </div>
              <div className="space-y-3">
                {learnedDomain.map((cat) => (
                  <div key={cat.label}>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]/70 mb-1">
                      {cat.label}
                    </div>
                    <div className="text-sm leading-relaxed">
                      {cat.items.map((i) => i.name).join(" · ")}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-dashed border-[var(--border)] text-xs font-mono text-[var(--muted)]">
                다음 방향: 임베디드 → 하드웨어 → 로보틱스
              </div>
            </div>
          </div>
        </Section>

        {/* About / Brain Trinity */}
        <Section title="About" eyebrow="소개 · 다음 방향">
          <div className="p-6 rounded-2xl bg-[var(--foreground)] text-[var(--background)] mb-6 print:bg-transparent print:text-[var(--foreground)] print:border print:border-[var(--border)]">
            <div className="flex items-start gap-3">
              <Sparkles className="size-5 mt-0.5 shrink-0 opacity-80" />
              <div>
                <div className="text-xs font-mono uppercase tracking-widest opacity-60 mb-2">
                  Brain Trinity · 시연 가능
                </div>
                <p className="text-sm leading-relaxed">
                  {personal.brainTrinity.note}
                </p>
              </div>
            </div>
          </div>
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
            다음 방향
          </div>
          <ul className="space-y-2">
            {personal.futureVision.map((v) => (
              <li key={v} className="flex items-start gap-2 text-sm">
                <span className="text-[var(--accent)] font-mono">→</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Contact */}
        <Section title="Contact" eyebrow="연락처">
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
              포트폴리오 사이트
            </Link>
          </div>
          <div className="mt-6 text-xs text-[var(--muted)] max-w-2xl print:hidden">
            이 이력서는 base 버전입니다. 회사 JD가 정해지면 *읽는 사람*에 맞춰
            풀이 깊이와 강조 코스를 조립해 다시 다듬을 예정입니다.
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
}: {
  project: {
    name: string;
    slug?: string;
    badge?: string;
    period?: string;
    context: string;
    what: string[];
    impact: string[];
    stack?: string[];
    honestyNote?: string;
  };
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
              {project.name}
            </Link>
          ) : (
            project.name
          )}
        </h4>
        <div className="flex items-center gap-2 text-xs font-mono">
          {project.badge && (
            <span className="px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 print:border-current">
              {project.badge}
            </span>
          )}
          {project.period && (
            <span className="text-[var(--muted)]">{project.period}</span>
          )}
        </div>
      </div>

      <p className="text-sm text-[var(--muted)] leading-relaxed mb-3 max-w-3xl">
        {project.context}
      </p>

      <div className="grid gap-4 md:grid-cols-2 mb-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mb-2">
            한 일
          </div>
          <ul className="space-y-1.5 text-sm leading-relaxed">
            {project.what.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[var(--muted)] font-mono mt-1 text-[10px]">
                  ▸
                </span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] mb-2">
            임팩트
          </div>
          <ul className="space-y-1.5 text-sm leading-relaxed">
            {project.impact.map((im, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[var(--accent)] font-mono mt-1 text-[10px]">
                  ▸
                </span>
                <span>{im}</span>
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
          ※ {project.honestyNote}
        </p>
      )}
    </div>
  );
}

