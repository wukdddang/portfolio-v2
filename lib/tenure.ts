import type { Locale } from "@/i18n/routing";

/**
 * 입사일(YYYY-MM)부터 현재까지 경과 연차를 "N년 M개월차" / "N yrs M mos"로 포맷.
 * 정적 문자열을 하드코딩하면 시간이 지나도 갱신되지 않으므로(이전 버그 — "2년 5개월차" 고정),
 * 렌더 시점의 현재 날짜로 매번 계산한다. 월 단위라 SSR↔클라이언트 하이드레이션 값 불일치 없음.
 */
export function tenureLabel(
  joinDate: string,
  locale: Locale,
  now: Date = new Date()
): string {
  const [jy, jm] = joinDate.split("-").map(Number);
  const months = Math.max(
    0,
    (now.getFullYear() - jy) * 12 + (now.getMonth() + 1 - jm)
  );
  const years = Math.floor(months / 12);
  const rem = months % 12;

  if (locale === "en") {
    const parts: string[] = [];
    if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
    if (rem > 0) parts.push(`${rem} mo${rem > 1 ? "s" : ""}`);
    return parts.join(" ") || "0 mos";
  }
  const parts: string[] = [];
  if (years > 0) parts.push(`${years}년`);
  if (rem > 0) parts.push(`${rem}개월`);
  return `${parts.join(" ") || "0개월"}차`;
}
