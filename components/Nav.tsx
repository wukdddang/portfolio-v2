"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
  { href: "#coordinates", label: "좌표" },
  { href: "#projects", label: "프로젝트" },
  { href: "#stack", label: "스택" },
  { href: "#about", label: "About" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      <nav className="px-6 md:px-16 lg:px-24 h-16 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
          wukdddang
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors rounded-full hover:bg-[var(--subtle)]"
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
