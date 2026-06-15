/**
 * Career — 홈 "경력" 섹션용 연차별 진행 타임라인.
 *
 * resume.ts 가 *프로젝트 묶음* 관점이라면 여기는 *시간 순 성장 아크* (프론트엔드 → 풀스택).
 * 단일 고용주(루미르)라 "어디서 일하는가"를 또렷이 한다.
 *  - 2023~2025: 프론트엔드 시절의 개별 프로젝트들 — 별도 쇼케이스 카드 없음 → 링크 없이 텍스트만.
 *  - 2026~현재: 풀스택으로 확장하며 쇼케이스 3개(SAR 플랫폼·SDPE·Lumir-ERP)를 *동시* 진행 → 링크.
 *
 * joinDate 는 personal.joinDate 와 단일 출처(여기 중복 보관하지 않음).
 */
import type { L } from "./i18n";

export interface CareerEntry {
  /** 연도 라벨 (예: "2023") */
  year: string;
  /** 그 시기의 역할 단계 (프론트엔드 / 풀스택 확장 등) */
  role: L;
  title: L;
  /** 한 줄 설명 */
  desc: L;
  /** 동시 진행 프로젝트들 (현재 단계 전용) — 각각 쇼케이스 카드로 링크 */
  projects?: { title: L; slug: string }[];
  /** 주력 — 제목·점 강조 */
  notable?: boolean;
  /** 현재 진행 중 — "현재" 배지 + accent 점 */
  current?: boolean;
}

/** 재직 헤드라인 — 단일 고용주. position 은 성장 아크를 한 줄로. */
export const careerRole = {
  company: { ko: "루미르", en: "Lumir" } satisfies L,
  position: {
    ko: "웹 개발자 — 프론트엔드에서 풀스택으로",
    en: "Web Developer — from frontend to full-stack",
  } satisfies L,
};

/** 연차별 진행 (오래된 → 최신). 2023~25 는 프론트엔드 개별 프로젝트(링크 X), 2026 은 동시 진행 단계. */
export const careerTimeline: CareerEntry[] = [
  {
    year: "2023",
    role: { ko: "프론트엔드", en: "Frontend" },
    title: { ko: "위성영상 검색 플랫폼", en: "Satellite imagery search platform" },
    desc: {
      ko: "Sentinel-1 기반 위성영상 검색·데이터 처리 파이프라인 플랫폼의 데스크톱 프론트엔드를 개발했습니다. 입사 후 처음 마주친 SAR 도메인을 직군 확장으로 흡수한 출발점.",
      en: "Built the desktop frontend for a Sentinel-1 satellite-imagery search and data-processing pipeline platform — the starting point of absorbing the SAR domain as a role expansion.",
    },
  },
  {
    year: "2024",
    role: { ko: "프론트엔드", en: "Frontend" },
    title: { ko: "루미르 채용관리 시스템", en: "Lumir hiring system" },
    desc: {
      ko: "지원 → 서류 → 면접 → 입사 → 수습평가 → 채용 단계를 처리하는 사내 전용 채용 플랫폼 프론트엔드.",
      en: "Frontend for an in-house hiring platform spanning application → screening → interview → onboarding → probation → hire.",
    },
  },
  {
    year: "2025",
    role: { ko: "프론트엔드", en: "Frontend" },
    title: { ko: "루미르 일정관리 시스템", en: "Lumir scheduling system" },
    desc: {
      ko: "회의실·차량·숙소 등 사내 일정 예약을 등록·관리하는 전용 플랫폼 프론트엔드.",
      en: "Frontend for an in-house scheduling platform that registers room, vehicle, and lodging reservations.",
    },
  },
  {
    year: "2026",
    role: { ko: "풀스택 확장 · 동시 진행", en: "Full-stack · in parallel" },
    title: {
      ko: "세 플랫폼을 동시에 — 백엔드·SAR 처리·AI로 확장",
      en: "Three platforms at once — into backend, SAR processing & AI",
    },
    desc: {
      ko: "프론트엔드를 넘어 아래 세 프로젝트를 같은 기간에 동시 진행하며 기획·프론트·백엔드·인프라·AI까지 한 사이클을 책임지는 단계로 확장 중입니다.",
      en: "Beyond frontend — running the three projects below concurrently, expanding into owning the whole cycle: planning · frontend · backend · infra · AI.",
    },
    notable: true,
    current: true,
    projects: [
      { title: { ko: "루미르 SAR 데이터 플랫폼", en: "Lumir SAR Data Platform" }, slug: "lumir-sar-platform" },
      { title: { ko: "SDPE", en: "SDPE" }, slug: "sdpe" },
      { title: { ko: "Lumir-ERP", en: "Lumir-ERP" }, slug: "lumir-erp" },
    ],
  },
];
