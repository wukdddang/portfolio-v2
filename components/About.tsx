"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Mail, Sparkles, CheckCircle2 } from "lucide-react";
import { personal } from "@/data/personal";
import { pick } from "@/data/i18n";
import type { Locale } from "@/i18n/routing";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.21-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.39-5.26 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.14 0 .31.21.68.8.56C20.22 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export function About() {
  const t = useTranslations("about");
  const locale = useLocale() as Locale;

  return (
    <section
      id="about"
      className="relative border-t border-[var(--border)]"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-16 lg:px-24 py-24">
        <div className="mb-12 max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
            {t("eyebrow")}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {pick(personal.name, locale)}
            {t("nameSuffix")}
          </h2>
          <p className="text-lg text-[var(--muted)] leading-relaxed">
            {pick(personal.tagline, locale)}. {pick(personal.identity, locale)}
          </p>
        </div>

        {/* Invitations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl"
        >
          {personal.invitations.map((q, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]"
            >
              <CheckCircle2 className="size-5 shrink-0 text-[var(--accent)] mt-0.5" />
              <p className="text-sm leading-relaxed text-[var(--card-foreground)]">
                {pick(q, locale)}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Brain Trinity highlight */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="p-6 md:p-8 rounded-2xl bg-[var(--foreground)] text-[var(--background)] mb-10"
        >
          <div className="flex items-start gap-4">
            <Sparkles className="size-5 mt-0.5 shrink-0 opacity-80" />
            <div>
              <div className="text-xs font-mono uppercase tracking-widest opacity-60 mb-2">
                {t("brainTrinityEyebrow")}
              </div>
              <p className="text-base md:text-lg leading-relaxed mb-3">
                {t("brainTrinityBody1Pre")}
                <span className="font-semibold">{t("brainTrinityBody1Bold")}</span>
                {t("brainTrinityBody1Post")}
              </p>
              <p className="text-sm opacity-70 leading-relaxed">
                {t("brainTrinityBody2")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Future vision */}
        <div className="mb-10 max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] mb-3">
            {t("futureHeading")}
          </div>
          <ul className="space-y-2">
            {personal.futureVision.map((v, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-base text-[var(--card-foreground)]"
              >
                <span className="text-[var(--accent)] font-mono">→</span>
                <span>{pick(v, locale)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacts */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-[var(--border)]">
          <a
            href={personal.contacts.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--border)] text-sm font-medium hover:bg-[var(--subtle)] transition-colors"
          >
            <GithubIcon className="size-4" />
            GitHub
          </a>
          <a
            href={`mailto:${personal.contacts.email}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--border)] text-sm font-medium hover:bg-[var(--subtle)] transition-colors"
          >
            <Mail className="size-4" />
            {personal.contacts.email}
          </a>
        </div>
      </div>
    </section>
  );
}
