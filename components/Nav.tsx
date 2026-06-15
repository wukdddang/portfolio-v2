"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const isHome = pathname === "/";

  const links = [
    { href: "/#coordinates", id: "coordinates", label: t("location") },
    { href: "/#projects", id: "projects", label: t("projects") },
    { href: "/#stack", id: "stack", label: t("stack") },
    { href: "/#faq", id: "faq", label: t("faq") },
    { href: "/#about", id: "about", label: t("about") },
    { href: "/resume", id: "resume", label: t("resume"), isPage: true },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const link of links) {
      const el = document.getElementById(link.id);
      if (!el) continue;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveId(link.id);
          });
        },
        {
          rootMargin: "-35% 0px -55% 0px",
          threshold: 0,
        }
      );
      observer.observe(el);
      observers.push(observer);
    }
    return () => observers.forEach((o) => o.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-md bg-[var(--background)]/80 border-b border-[var(--border)]"
          : "border-b border-transparent"
      )}
    >
      <nav className="mx-auto w-full max-w-7xl px-6 md:px-16 lg:px-24 h-16 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight whitespace-nowrap"
        >
          wukdddang
        </Link>
        <div className="flex items-center gap-1 md:gap-3">
          <div className="relative flex items-center gap-1 md:gap-2">
            {links.map((l) => {
              const isActive = activeId === l.id;
              // 섹션 링크(/#id)는 홈에서 순수 해시(#id)로 → 새로고침 없이 현재 위치에서 스무스 스크롤.
              // 다른 라우트(/resume 등)에서는 홈+앵커(/ko/#id)로 이동. 페이지 링크(/resume)는 그대로.
              const href = !l.href.startsWith("/#")
                ? `/${locale}${l.href}`
                : isHome
                  ? l.href.slice(1)
                  : `/${locale}${l.href}`;
              return (
                <a
                  key={l.href}
                  href={href}
                  onClick={(e) => {
                    // 홈에서 섹션 탭 → 새로고침 없이 현재 위치에서 스무스 스크롤 (reduced-motion 존중).
                    // cross-page·페이지 링크(/resume)는 기본 내비게이션에 맡긴다.
                    if (!isHome || !l.href.startsWith("/#")) return;
                    const el = document.getElementById(l.id);
                    if (!el) return;
                    e.preventDefault();
                    el.scrollIntoView({
                      behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                      ).matches
                        ? "auto"
                        : "smooth",
                    });
                    history.pushState(null, "", `#${l.id}`);
                  }}
                  className={cn(
                    "relative px-3 py-1.5 text-sm transition-colors rounded-full whitespace-nowrap",
                    isActive
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-[var(--subtle)] rounded-full -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  {l.label}
                </a>
              );
            })}
          </div>

          {/* Locale toggle — Link로 동일 path를 다른 locale로 전환 */}
          <div
            className="ml-1 md:ml-2 pl-2 md:pl-3 border-l border-[var(--border)] flex items-center gap-0.5 text-[11px] font-mono"
            role="group"
            aria-label={t("ariaLocale")}
          >
            {routing.locales.map((l) => {
              const isActive = locale === l;
              return (
                <Link
                  key={l}
                  href={pathname}
                  locale={l}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={l === "ko" ? t("ariaKo") : t("ariaEn")}
                  className={cn(
                    "px-2 py-1 rounded transition-colors uppercase",
                    isActive
                      ? "text-[var(--foreground)] font-semibold"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  )}
                >
                  {l}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
