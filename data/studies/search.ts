import type { L } from "../i18n";
import type { Study, StudyTopic, TopicDetail } from "./types";
import { sar } from "./sar";
import { embedded } from "./embedded";

const studies: Study[] = [sar, embedded];

/**
 * 학습 검색 인덱스 — 모든 Study의 토픽을 하나의 평탄한 레코드 배열로 펼친다.
 * 토픽 카드/캘린더에서 흩어진 학습 내용을 한 곳에서 검색하기 위한 데이터.
 *
 * 검색 대상(haystack)은 ko·en을 모두 합쳐 소문자화해 두므로, 어느 언어로 입력해도 매칭된다.
 *  - 제목·요약·태그·블록/스터디 제목·wikiSlug
 *  - 상세(detail)가 있으면 TL;DR·섹션 heading/bullets·pitfall 본문까지 포함
 *
 * 정적 데이터라 모듈 로드 시 1회 계산해 상수로 노출한다(런타임 비용 없음).
 */
export interface StudySearchRecord {
  studySlug: string;
  studyTitle: L;
  studyIcon: string;
  blockTitle: L;
  /** 블록 카테고리 색 인덱스(--cat-N) */
  cat: number;
  icon: string;
  title: L;
  summary: L;
  tags: L[];
  status: StudyTopic["status"];
  wikiSlug?: string;
  /** 상세 문서가 있으면 그 경로, 없으면 학습 로그 페이지 */
  href: string;
  /** 상세 문서로 직접 이동 가능한지 */
  hasDetail: boolean;
  /** 언어별 검색 문자열(소문자) — title/summary/tags/본문을 모두 합침 */
  haystack: { ko: string; en: string };
}

/** detail 본문(tldr·섹션·pitfall)을 언어별 평문으로 펼친다 */
function detailText(detail: TopicDetail, lang: "ko" | "en"): string {
  const parts: string[] = [detail.tldr[lang]];
  for (const sec of detail.sections) {
    parts.push(sec.heading[lang]);
    for (const b of sec.bullets) parts.push(b[lang]);
  }
  if (detail.pitfall) parts.push(detail.pitfall[lang]);
  return parts.join(" ");
}

/** 한 언어의 검색 문자열을 조립 */
function haystackFor(
  study: Study,
  blockTitle: L,
  topic: StudyTopic,
  lang: "ko" | "en"
): string {
  const parts: string[] = [
    topic.title[lang],
    topic.summary[lang],
    ...topic.tags.map((t) => t[lang]),
    blockTitle[lang],
    study.title[lang],
    topic.wikiSlug ?? "",
  ];
  if (topic.detail) parts.push(detailText(topic.detail, lang));
  return parts.join(" ").toLowerCase();
}

function build(): StudySearchRecord[] {
  const records: StudySearchRecord[] = [];
  for (const study of studies) {
    for (const block of study.blocks) {
      for (const topic of block.topics) {
        const hasDetail = !!(topic.slug && topic.detail);
        records.push({
          studySlug: study.slug,
          studyTitle: study.title,
          studyIcon: study.icon,
          blockTitle: block.title,
          cat: block.cat,
          icon: topic.icon,
          title: topic.title,
          summary: topic.summary,
          tags: topic.tags,
          status: topic.status,
          wikiSlug: topic.wikiSlug,
          href: hasDetail
            ? `/studies/${study.slug}/${topic.slug}`
            : `/studies/${study.slug}`,
          hasDetail,
          haystack: {
            ko: haystackFor(study, block.title, topic, "ko"),
            en: haystackFor(study, block.title, topic, "en"),
          },
        });
      }
    }
  }
  return records;
}

/** 모든 학습 토픽의 평탄한 검색 인덱스 (모듈 로드 시 1회 계산) */
export const studySearchIndex: StudySearchRecord[] = build();
