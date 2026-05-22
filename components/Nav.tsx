"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "#coordinates", id: "coordinates", label: "좌표" },
  { href: "#projects", id: "projects", label: "프로젝트" },
  { href: "#stack", id: "stack", label: "스택" },
  { href: "#about", id: "about", label: "About" },
];

export function Nav() {
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
          // Section is "active" when it crosses ~35% from the top viewport line
          rootMargin: "-35% 0px -55% 0px",
          threshold: 0,
        }
      );
      observer.observe(el);
      observers.push(observer);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-md bg-[var(--background)]/80 border-b border-[var(--border)]"
          : "border-b border-transparent"
      )}
    >
      <nav className="mx-auto w-full max-w-7xl px-6 md:px-16 lg:px-24 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight"
        >
          wukdddang
        </Link>
        <div className="relative flex items-center gap-1 md:gap-2">
          {links.map((l) => {
            const isActive = activeId === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  "relative px-3 py-1.5 text-sm transition-colors rounded-full",
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
      </nav>
    </header>
  );
}
