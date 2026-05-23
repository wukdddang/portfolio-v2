"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] text-xs font-mono hover:bg-[var(--subtle)] transition-colors"
    >
      <Printer className="size-3.5" />
      인쇄 · PDF로 저장
    </button>
  );
}
