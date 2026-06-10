"use client";

import { useTranslations } from "next-intl";

export function PrintButton() {
  const t = useTranslations("resume");
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] text-xs font-mono hover:bg-[var(--subtle)] transition-colors"
    >
      {t("print")}
    </button>
  );
}
