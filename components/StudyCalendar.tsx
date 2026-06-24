"use client";

/**
 * StudyCalendar — 학습 캘린더. data/studies.ts의 journal(날짜별 활동)을 단일 월 그리드로 그린다.
 * ◀ ▶ 로 월을 이동하며, 활동이 있는 날은 kind 색으로 칠해지고 클릭하면 그날 학습한 토픽이
 * 패널에 뜬다. topicSlug가 있으면 상세 문서(/studies/{slug}/{topic})로 링크.
 * 활동은 출처(AI 대화·강의 등)에 따라 kind 색으로 구분된다.
 */

import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { JournalEntry } from "@/data/studies";
import { pick } from "@/data/i18n";
import { cn } from "@/lib/utils";

/** kind → 색(통합 다이어그램 cat 팔레트와 동일 언어) */
const KIND_COLOR: Record<JournalEntry["kind"], string> = {
  lecture: "var(--accent)",
  wiki: "var(--cat-2)",
  conversation: "var(--cat-3)",
  work: "var(--cat-6)",
  plan: "var(--cat-5)",
};

const MONTH_NAMES: Record<Locale, string[]> = {
  ko: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

const WEEKDAYS: Record<Locale, string[]> = {
  ko: ["일", "월", "화", "수", "목", "금", "토"],
  en: ["S", "M", "T", "W", "T", "F", "S"],
};

type DayMap = Map<string, JournalEntry[]>;

/** YYYY-MM-DD */
function ymd(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
/** year*12 + month — 월을 단조 정수로 */
const ord = (y: number, m: number) => y * 12 + m;

export function StudyCalendar({
  journal,
  locale,
  studySlug,
  kindLabels,
  detailCta,
}: {
  journal: JournalEntry[];
  locale: Locale;
  studySlug: string;
  kindLabels: Record<JournalEntry["kind"], string>;
  detailCta: string;
}) {
  // 날짜별 그룹 + 활동이 있는 월 경계(첫·마지막)
  const { byDate, first, last, lastDate } = useMemo(() => {
    const map: DayMap = new Map();
    for (const e of journal) {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    const dates = [...map.keys()].sort();
    const [fy, fm] = (dates[0] ?? "2026-01-01").split("-").map(Number);
    const [ly, lm] = (dates[dates.length - 1] ?? "2026-01-01").split("-").map(Number);
    return {
      byDate: map,
      first: { year: fy, month: fm - 1 },
      last: { year: ly, month: lm - 1 },
      lastDate: dates[dates.length - 1] ?? null,
    };
  }, [journal]);

  // 표시 중인 월 = 가장 최근 활동 월에서 시작
  const [view, setView] = useState({ year: last.year, month: last.month });
  const [selected, setSelected] = useState<string | null>(lastDate);

  const viewOrd = ord(view.year, view.month);
  const canPrev = viewOrd > ord(first.year, first.month);
  const canNext = viewOrd < ord(last.year, last.month);
  const step = (delta: number) => {
    const o = viewOrd + delta;
    setView({ year: Math.floor(o / 12), month: ((o % 12) + 12) % 12 });
  };

  const firstDow = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const kinds = useMemo(() => [...new Set(journal.map((e) => e.kind))], [journal]);
  const selectedEntries = selected ? byDate.get(selected) ?? [] : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
      {/* 단일 월 그리드 + 이동 */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={!canPrev}
            aria-label="prev month"
            className="flex size-7 items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted)] transition-colors enabled:hover:bg-[var(--subtle)] enabled:hover:text-[var(--foreground)] disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex items-baseline gap-1.5 font-mono text-sm">
            <span className="font-semibold">{MONTH_NAMES[locale][view.month]}</span>
            <span className="text-[var(--muted)]">{view.year}</span>
          </div>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={!canNext}
            aria-label="next month"
            className="flex size-7 items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted)] transition-colors enabled:hover:bg-[var(--subtle)] enabled:hover:text-[var(--foreground)] disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {WEEKDAYS[locale].map((w, i) => (
            <div key={i} className="pb-1 font-mono text-[10px] text-[var(--muted)]/60">
              {w}
            </div>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const key = ymd(view.year, view.month, day);
            const entries = byDate.get(key);
            const active = !!entries;
            const isSelected = selected === key;
            const color = active ? KIND_COLOR[entries![0].kind] : undefined;
            return (
              <button
                key={i}
                type="button"
                disabled={!active}
                onClick={() => active && setSelected(key)}
                aria-label={active ? `${MONTH_NAMES[locale][view.month]} ${day}` : undefined}
                className={cn(
                  "relative flex aspect-square items-center justify-center rounded-md text-xs transition-all",
                  active
                    ? "cursor-pointer border font-semibold text-[var(--foreground)] hover:brightness-110"
                    : "font-mono text-[var(--muted)]/35",
                  isSelected && "ring-2"
                )}
                style={
                  active
                    ? {
                        backgroundColor: `color-mix(in oklch, ${color} ${isSelected ? 32 : 16}%, var(--card))`,
                        borderColor: `color-mix(in oklch, ${color} 55%, var(--border))`,
                        ...(isSelected ? { ["--tw-ring-color" as string]: color } : {}),
                      }
                    : undefined
                }
              >
                {day}
                {active && entries!.length > 1 && (
                  <span
                    className="absolute -right-1 -top-1 flex size-3.5 items-center justify-center rounded-full text-[8px] font-bold text-[var(--background)]"
                    style={{ backgroundColor: color }}
                  >
                    {entries!.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 범례 */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[var(--border)]/60 pt-3">
          {kinds.map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[var(--muted)]">
              <span className="size-2.5 rounded-sm" style={{ backgroundColor: KIND_COLOR[k] }} />
              {kindLabels[k]}
            </span>
          ))}
        </div>
      </div>

      {/* 선택한 날 패널 */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/40 p-4 lg:sticky lg:top-24 lg:self-start">
        {selected ? (
          <>
            <div className="mb-3 font-mono text-[11px] text-[var(--accent)]">{selected}</div>
            <ul className="flex flex-col gap-3">
              {selectedEntries.map((e, i) => {
                const color = KIND_COLOR[e.kind];
                const inner = (
                  <div className="flex items-start gap-2">
                    <span className="mt-1 size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="text-[13px] font-medium leading-snug">{pick(e.title, locale)}</span>
                        {e.topicSlug && (
                          <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-[var(--accent)] opacity-0 transition-opacity group-hover/j:opacity-100" />
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] text-[var(--muted)]">
                        <span style={{ color }}>{kindLabels[e.kind]}</span>
                        {e.meta && (
                          <>
                            <span className="text-[var(--muted)]/40">·</span>
                            <span>{pick(e.meta, locale)}</span>
                          </>
                        )}
                      </div>
                      {e.topicSlug && (
                        <span className="mt-1 inline-block font-mono text-[10px] text-[var(--accent)]/80">{detailCta}</span>
                      )}
                    </div>
                  </div>
                );
                return e.topicSlug ? (
                  <li key={i}>
                    <Link
                      href={`/studies/${studySlug}/${e.topicSlug}`}
                      className="group/j block rounded-lg border border-[var(--border)] bg-[var(--background)]/40 p-2.5 transition-colors hover:border-[var(--accent)]/50"
                    >
                      {inner}
                    </Link>
                  </li>
                ) : (
                  <li key={i} className="rounded-lg border border-dashed border-[var(--border)] p-2.5">
                    {inner}
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}
