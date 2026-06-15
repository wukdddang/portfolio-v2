"use client";

/**
 * FaqSection — 홈 FAQ 아코디언. data/faq.ts를 펼쳐 보여준다.
 * 두 가지 목적을 한 컴포넌트로:
 *  - 동선/클릭(B): 각 답변 아래 관련 내부 링크(이력서·학습 로그·프로젝트)로 이동 유도.
 *  - AI 검색(C): 같은 q/a가 lib/jsonld.ts의 FAQPage 구조화 데이터로도 주입돼 LLM/리치결과에 노출.
 *
 * 펼침은 framer-motion height 애니메이션(reduced-motion이면 즉시). 한 번에 하나만 열린다.
 */

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { faq } from "@/data/faq";
import { pick } from "@/data/i18n";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** 같은 페이지 해시(/#id)는 앵커로, 그 외 라우트는 i18n Link로 */
function FaqLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const cls =
    "group/l inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--card-foreground)] transition-colors hover:border-[var(--accent)]/50 hover:bg-[var(--subtle)]";
  const icon = (
    <ArrowUpRight className="size-3.5 text-[var(--accent)] transition-transform group-hover/l:translate-x-0.5 group-hover/l:-translate-y-0.5" />
  );
  if (href.startsWith("/#")) {
    return (
      <a href={href.slice(1)} className={cls}>
        {children}
        {icon}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      {icon}
    </Link>
  );
}

export function FaqSection() {
  const t = useTranslations("faq");
  const locale = useLocale() as Locale;
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative border-t border-[var(--border)]">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-16 lg:px-24 py-24">
        <div className="mb-12 max-w-2xl">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
            {t("eyebrow")}
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            {t("title")}
          </h2>
          <p className="text-lg leading-relaxed text-[var(--muted)]">{t("subtitle")}</p>
        </div>

        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-3xl flex-col gap-3"
        >
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <li
                key={i}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-[var(--card)] transition-colors",
                  isOpen ? "border-[var(--accent)]/40" : "border-[var(--border)]"
                )}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[15px] font-semibold leading-snug md:text-base">
                      {pick(item.q, locale)}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-5 shrink-0 text-[var(--muted)] transition-transform duration-300",
                        isOpen && "rotate-180 text-[var(--accent)]"
                      )}
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <p className="text-sm leading-relaxed text-[var(--card-foreground)] md:text-[15px]">
                          {pick(item.a, locale)}
                        </p>
                        {item.links && item.links.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.links.map((l, li) => (
                              <FaqLink key={li} href={l.href}>
                                {pick(l.label, locale)}
                              </FaqLink>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
