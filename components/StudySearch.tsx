"use client";

/**
 * StudySearch — 학습 내용 전역 검색. data/studies의 모든 토픽(제목·요약·태그·TL;DR·섹션 본문·함정)을
 * 평탄화한 studySearchIndex를 입력어로 즉시 필터링한다. ko·en haystack을 함께 보므로 어느 언어로 쳐도
 * 매칭되고, 매칭 토큰은 결과에서 하이라이트된다. 결과 클릭 시 상세 문서(있으면)/학습 로그로 이동.
 *
 * 스터디 페이지 헤더 아래에 놓여, 흩어진 카드/캘린더를 뒤지지 않고 한 곳에서 찾기 위한 도구.
 */

import { useDeferredValue, useId, useMemo, useRef, useState } from "react";
import { Search, X, ArrowUpRight, CornerDownLeft } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { StudySearchRecord } from "@/data/studies";
import { studySearchIndex } from "@/data/studies";
import { pick } from "@/data/i18n";
import { cn } from "@/lib/utils";

const STATUS_DOT: Record<StudySearchRecord["status"], string> = {
  done: "var(--cat-2)",
  doing: "var(--accent)",
  todo: "var(--border)",
};

const MAX_RESULTS = 30;

/** 입력어를 공백으로 토큰화(소문자, 빈 토큰 제거) */
function tokenize(q: string): string[] {
  return q.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

type Scored = { rec: StudySearchRecord; score: number };

/** AND 매칭 + 가중 점수. 모든 토큰이 haystack에 있어야 하고, 제목>태그>요약>본문 순으로 가산. */
function search(query: string): StudySearchRecord[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  const scored: Scored[] = [];
  for (const rec of studySearchIndex) {
    const hay = rec.haystack.ko + "  " + rec.haystack.en;
    let score = 0;
    let ok = true;
    for (const tok of tokens) {
      if (!hay.includes(tok)) {
        ok = false;
        break;
      }
      const inTitle = rec.title.ko.toLowerCase().includes(tok) || rec.title.en.toLowerCase().includes(tok);
      const inTags = rec.tags.some((t) => t.ko.toLowerCase().includes(tok) || t.en.toLowerCase().includes(tok));
      const inSummary = rec.summary.ko.toLowerCase().includes(tok) || rec.summary.en.toLowerCase().includes(tok);
      score += inTitle ? 8 : inTags ? 4 : inSummary ? 2 : 1;
    }
    if (ok) scored.push({ rec, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, MAX_RESULTS).map((s) => s.rec);
}

/** 매칭 토큰을 <mark>로 감싸 하이라이트 (대소문자 무시) */
function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  if (tokens.length === 0) return <>{text}</>;
  const esc = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${esc.join("|")})`, "gi");
  // split with a capturing group keeps the matched delimiters; a part is a hit
  // iff it equals one of the tokens (case-insensitive) — no stateful re.test().
  const tokenSet = new Set(tokens);
  const parts = text.split(re);
  return (
    <>
      {parts.map((part, i) =>
        tokenSet.has(part.toLowerCase()) ? (
          <mark
            key={i}
            className="rounded-[3px] bg-[var(--accent)]/20 px-0.5 text-[var(--foreground)]"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function StudySearch({
  locale,
  placeholder,
  hint,
  countLabel,
  emptyLabel,
}: {
  locale: Locale;
  placeholder: string;
  hint: string;
  /** "{n}개 결과" 처럼 {n} 토큰을 치환 */
  countLabel: string;
  emptyLabel: string;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const deferred = useDeferredValue(query);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const tokens = useMemo(() => tokenize(deferred), [deferred]);
  const results = useMemo(() => search(deferred), [deferred]);
  const hasQuery = deferred.trim().length > 0;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setQuery("");
      return;
    }
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const rec = results[Math.min(active, results.length - 1)];
      if (rec) router.push(rec.href);
    }
  };

  const safeActive = Math.min(active, Math.max(results.length - 1, 0));

  return (
    <div className="relative">
      {/* 입력 */}
      <div className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)]/50 px-3.5 py-2.5 transition-colors focus-within:border-[var(--accent)]/60">
        <Search className="size-4 shrink-0 text-[var(--muted)]" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          role="searchbox"
          aria-label={placeholder}
          aria-controls={listId}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]/70 [&::-webkit-search-cancel-button]:hidden"
        />
        {hasQuery ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="clear"
            className="flex size-5 shrink-0 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:bg-[var(--subtle)] hover:text-[var(--foreground)]"
          >
            <X className="size-3.5" />
          </button>
        ) : (
          <span className="hidden shrink-0 font-mono text-[10px] text-[var(--muted)]/60 sm:block">
            {hint}
          </span>
        )}
      </div>

      {/* 결과 */}
      {hasQuery && (
        <div className="mt-3">
          <div className="mb-2.5 flex items-center gap-2 font-mono text-[11px] text-[var(--muted)]">
            <span>{countLabel.replace("{n}", String(results.length))}</span>
            {results.length > 0 && (
              <span className="hidden items-center gap-1 text-[var(--muted)]/60 sm:inline-flex">
                <CornerDownLeft className="size-3" />
                {results.length > 1 ? "↑↓" : ""}
              </span>
            )}
          </div>

          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--border)] px-4 py-6 text-center text-sm text-[var(--muted)]">
              {emptyLabel}
            </div>
          ) : (
            <ul id={listId} role="listbox" className="flex flex-col gap-2">
              {results.map((rec, i) => {
                const catColor = `var(--cat-${rec.cat})`;
                const isActive = i === safeActive;
                return (
                  <li key={`${rec.studySlug}-${rec.href}-${i}`} role="option" aria-selected={isActive}>
                    <Link
                      href={rec.href}
                      onMouseEnter={() => setActive(i)}
                      className={cn(
                        "group/r flex items-start gap-3 rounded-xl border bg-[var(--card)]/40 px-3.5 py-3 transition-all",
                        isActive
                          ? "border-[var(--accent)]/50 ring-2 ring-[var(--accent)]/25"
                          : "border-[var(--border)] hover:border-[var(--accent)]/40"
                      )}
                    >
                      <span className="mt-0.5 text-base leading-none">{rec.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[14px] font-semibold leading-snug text-[var(--foreground)]">
                            <Highlight text={pick(rec.title, locale)} tokens={tokens} />
                          </span>
                          {rec.hasDetail && (
                            <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-[var(--accent)] opacity-0 transition-opacity group-hover/r:opacity-100" />
                          )}
                        </div>
                        <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-[var(--muted)]">
                          <Highlight text={pick(rec.summary, locale)} tokens={tokens} />
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] text-[var(--muted)]/80">
                          <span className="inline-flex items-center gap-1">
                            <span
                              className="size-1.5 rounded-full"
                              style={{ backgroundColor: STATUS_DOT[rec.status] }}
                            />
                            {rec.studyIcon} {pick(rec.studyTitle, locale)}
                          </span>
                          <span className="text-[var(--muted)]/40">·</span>
                          <span style={{ color: `color-mix(in oklch, ${catColor} 70%, var(--muted))` }}>
                            {pick(rec.blockTitle, locale)}
                          </span>
                          {rec.tags.slice(0, 3).map((tag, ti) => (
                            <span
                              key={ti}
                              className="rounded border border-[var(--border)] px-1 py-px text-[var(--muted)]"
                            >
                              <Highlight text={pick(tag, locale)} tokens={tokens} />
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
