import type { Locale } from "@/i18n/routing";

/** Bilingual string field. */
export type L = { ko: string; en: string };

/** Bilingual array field (each element bilingual). */
export type LArr = { ko: string; en: string }[];

/** Pick the right language out of a bilingual value. */
export function pick(value: L, locale: Locale): string {
  return value[locale];
}

/** Pick the right language out of a bilingual array. */
export function pickArr(value: LArr, locale: Locale): string[] {
  return value.map((v) => v[locale]);
}
