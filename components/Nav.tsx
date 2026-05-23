"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#coordinates", id: "coordinates", label: "위치" },
  { href: "/#projects", id: "projects", label: "프로젝트" },
  { href: "/#stack", id: "stack", label: "스택" },
  { href: "/#about", id: "about", label: "About" },
  { href: "/resume", id: "resume", label: "이력서", isPage: true },
];

type Locale = "ko" | "en";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>("ko");
  const [showLocaleToast, setShowLocaleToast] = useState(false);

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
  }, []);

  const handleLocaleClick = (target: Locale) => {
    if (target === locale) return;
    if (target === "en") {
      setShowLocaleToast(true);
      window.setTimeout(() => setShowLocaleToast(false), 2400);
      return;
    }
    setLocale(target);
  };

  return (
    <>
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
                return (
                  <a
                    key={l.href}
                    href={l.href}
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

            {/* Locale toggle */}
            <div
              className="ml-1 md:ml-2 pl-2 md:pl-3 border-l border-[var(--border)] flex items-center gap-0.5 text-[11px] font-mono"
              role="group"
              aria-label="언어 선택"
            >
              {(["ko", "en"] as Locale[]).map((l) => {
                const isActive = locale === l;
                const isDisabled = l === "en"; // 영문판 준비 중
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => handleLocaleClick(l)}
                    aria-pressed={isActive}
                    aria-label={
                      l === "ko" ? "한국어" : "English (preparing)"
                    }
                    title={isDisabled ? "English version coming soon" : undefined}
                    className={cn(
                      "px-2 py-1 rounded transition-colors uppercase",
                      isActive
                        ? "text-[var(--foreground)] font-semibold"
                        : isDisabled
                          ? "text-[var(--muted)]/40 hover:text-[var(--muted)]/70 cursor-help"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Toast — 영문판 준비 중 안내 */}
      {showLocaleToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs font-mono shadow-lg"
        >
          English version coming soon · 영문판 준비 중
        </motion.div>
      )}
    </>
  );
}
