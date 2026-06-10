import type { L } from "@/data/i18n";

/**
 * 메인 페이지 파이프라인 섹션 데이터 — 프로젝트별 "데이터가 거치는 단계" 요약.
 *
 * 시스템 간 정밀한 호출 관계가 아니라 *데이터 여정*의 요약이다. 정확한 토폴로지는
 * 각 프로젝트 상세의 다이어그램(PlatformDiagram·ProjectDiagram)이 담당한다.
 *
 * 파이프라인마다 성격이 달라 표현(variant)을 다르게 둔다:
 *  - spine  (SAR)  : 가로 스파인 — 위성·사용자 끝점 + 레이어 카드.
 *  - levels (SDPE) : L0→L1·L2→L3 처리 레벨 트랙 — 운영 콘솔 트리거 + 레벨 카드 + 카탈로그.
 *  - stack  (him)  : 세로 컴팩트 스택 — 사이드 프로젝트답게 작게, 프론트→백엔드→DB.
 *
 * layer 단계의 label·icon은 같은 slug의 subProject가 있으면 그 layerLabel·layerIcon을
 * 런타임 조회해 rename에 동기화한다(여기 값은 fallback). 단일 프로젝트는 여기 값을 그대로 쓴다.
 */

export interface PipelineStage {
  /** 같은 프로젝트 상세의 #anchor (subProject가 있는 경우). 없으면 프로젝트 상세로 링크 */
  slug?: string;
  kind: "endpoint" | "layer";
  /** endpoint 스타일 — external=점선(외부 시스템), actor=반전(사람) */
  tone?: "external" | "actor";
  icon: string;
  label: L;
  sublabel: L;
  desc?: L; // 이 단계에서 일어나는 일 (layer 카드 전용)
  cat?: number; // 카테고리 색 — 통합 다이어그램의 cat 인덱스와 동일
  badge?: string; // levels 변형의 레벨 칩 (L0 / L1·L2 / L3)
}

export interface PipelineEdge {
  label: L;
}

export interface Pipeline {
  id: string;
  /** 상세 페이지 + 카드 링크 베이스 (/projects/{projectSlug}) */
  projectSlug: string;
  title: L;
  icon: string;
  /** 시각 표현 — 파이프라인 성격별로 다르게 */
  variant: "spine" | "levels" | "stack";
  /** 좌→우(또는 위→아래) 데이터 여정. stages[i] → stages[i+1] 사이가 edges[i]. */
  stages: PipelineStage[];
  edges: PipelineEdge[];
  /** 역방향/부가 흐름 한 줄 (점선 환류) */
  returnNote?: L;
  /** 보조 설명 한 줄 (levels 변형의 오케스트레이션 설명 등) */
  note?: L;
}

export const pipelines: Pipeline[] = [
  // ── 루미르 SAR 데이터 플랫폼 (3 레이어 통합) · 가로 스파인 ────────────────
  {
    id: "sar",
    projectSlug: "lumir-sar-platform",
    icon: "🛰",
    variant: "spine",
    title: { ko: "루미르 SAR 데이터 플랫폼", en: "Lumir SAR Data Platform" },
    stages: [
      {
        kind: "endpoint",
        tone: "external",
        icon: "🛰",
        label: { ko: "Sentinel-1 · LumirX", en: "Sentinel-1 · LumirX" },
        sublabel: { ko: "위성 관측", en: "Observation" },
      },
      {
        kind: "layer",
        slug: "sar-data-retrieval",
        cat: 2,
        icon: "🗄",
        label: { ko: "데이터·운영 플랫폼", en: "Data & Ops Platform" },
        sublabel: {
          ko: "sar-data-retrieval · NestJS · DDD 5-layer",
          en: "sar-data-retrieval · NestJS · DDD 5-layer",
        },
        desc: {
          ko: "CDSE 검색·다운로드, NAS 저장, 분석 오케스트레이션",
          en: "CDSE search & download, NAS storage, analysis orchestration",
        },
      },
      {
        kind: "layer",
        slug: "lumir-linux-snap",
        cat: 6,
        icon: "⚙",
        label: { ko: "InSAR 분석 플랫폼", en: "InSAR Analysis Platform" },
        sublabel: {
          ko: "lumir-linux-snap · SNAP · ISCE2 · MintPy",
          en: "lumir-linux-snap · SNAP · ISCE2 · MintPy",
        },
        desc: {
          ko: "PSI·DInSAR 처리 — 결과는 데이터 플랫폼으로 환류",
          en: "PSI · DInSAR processing — results feed back to the data platform",
        },
      },
      {
        kind: "layer",
        slug: "sar-search-and-analyzer",
        cat: 3,
        icon: "🖥",
        label: { ko: "프론트", en: "Frontend" },
        sublabel: {
          ko: "sar-search-and-analyzer · Next.js · 지도+AOI",
          en: "sar-search-and-analyzer · Next.js · map + AOI",
        },
        desc: {
          ko: "지도에서 검색·AOI·분석 요청, 변위 시계열 시각화",
          en: "Map search, AOI, analysis requests, displacement time-series view",
        },
      },
      {
        kind: "endpoint",
        tone: "actor",
        icon: "👤",
        label: { ko: "사용자", en: "User" },
        sublabel: { ko: "위치 요청 → 변위 데이터", en: "Location → displacement" },
      },
    ],
    edges: [
      { label: { ko: "SLC 수집", en: "SLC ingest" } },
      { label: { ko: "InSAR 요청", en: "InSAR request" } },
      { label: { ko: "XYZ 시계열", en: "XYZ time series" } },
      { label: { ko: "지도 응답", en: "Map response" } },
    ],
    returnNote: {
      ko: "위치·AOI 요청은 역방향(점선)으로 흐르고, 캐시 미스일 때만 신규 분석이 돌아갑니다",
      en: "Location / AOI requests flow the other way (dashed) — fresh analysis runs only on a cache miss",
    },
  },

  // ── SDPE — LumirX 처리 파이프라인 · L0→L3 레벨 트랙 ───────────────────────
  {
    id: "sdpe",
    projectSlug: "sdpe",
    icon: "🛰",
    variant: "levels",
    title: { ko: "SDPE — LumirX 처리 파이프라인", en: "SDPE — LumirX processing pipeline" },
    note: {
      ko: "운영 콘솔에서 DAG를 구성하면 Pipeline Workflow(NestJS)가 pgmq 이벤트로 오케스트레이션하고, CSC 1~9 인터페이스 체인이 각 레벨을 처리합니다.",
      en: "From the operator console a DAG is composed; Pipeline Workflow (NestJS) orchestrates it over pgmq events, and a CSC 1–9 interface chain processes each level.",
    },
    stages: [
      {
        kind: "endpoint",
        tone: "actor",
        icon: "🖥",
        label: { ko: "운영 콘솔", en: "Operator console" },
        sublabel: { ko: "DAG 구성·실행", en: "Compose & run DAG" },
      },
      {
        kind: "layer",
        cat: 2,
        icon: "📡",
        badge: "L0",
        label: { ko: "데이터 수집", en: "Data collection" },
        sublabel: { ko: "원시 SAR 수집", en: "Raw SAR ingest" },
      },
      {
        kind: "layer",
        cat: 6,
        icon: "⚙",
        badge: "L1·L2",
        label: { ko: "SAR 처리", en: "SAR processing" },
        sublabel: { ko: "간섭·보정", en: "Interferometry · correction" },
      },
      {
        kind: "layer",
        cat: 4,
        icon: "🛠",
        badge: "L3",
        label: { ko: "후처리", en: "Post-processing" },
        sublabel: { ko: "L3 산출물 생성", en: "L3 product generation" },
      },
      {
        kind: "endpoint",
        tone: "external",
        icon: "🐘",
        label: { ko: "산출물 카탈로그", en: "Product catalog" },
        sublabel: { ko: "PostgreSQL · @sdpe/database", en: "PostgreSQL · @sdpe/database" },
      },
    ],
    edges: [
      { label: { ko: "실행", en: "run" } },
      { label: { ko: "수집", en: "ingest" } },
      { label: { ko: "처리", en: "process" } },
      { label: { ko: "적재", en: "catalog" } },
    ],
    returnNote: {
      ko: "작업·산출물 상태는 운영 콘솔에서 모니터링됩니다",
      en: "Jobs and products are monitored from the operator console",
    },
  },

  // ── 집비치기 (him) — 개인 풀스택 사이드 · 세로 컴팩트 스택 ────────────────
  {
    id: "him",
    projectSlug: "him",
    icon: "📦",
    variant: "stack",
    title: { ko: "집비치기 (him) — 개인 풀스택", en: "him — personal full-stack" },
    stages: [
      {
        kind: "endpoint",
        tone: "actor",
        icon: "📱",
        label: { ko: "사용자", en: "User" },
        sublabel: { ko: "재고 관리 (모바일)", en: "Inventory (mobile)" },
      },
      {
        kind: "layer",
        cat: 3,
        icon: "📊",
        label: { ko: "페이지", en: "Pages" },
        sublabel: {
          ko: "대시보드·구매·이력·가전",
          en: "Dashboard · Purchases · History · Appliances",
        },
        desc: {
          ko: "재고 흐름을 페이지 단위로",
          en: "Inventory flow at the page level",
        },
      },
      {
        kind: "layer",
        cat: 2,
        icon: "🧾",
        label: { ko: "CQRS 도메인 모듈", en: "CQRS domain modules" },
        sublabel: { ko: "NestJS · 23개 모듈", en: "NestJS · 23 modules" },
        desc: {
          ko: "inventory-item · purchase · log · appliance …",
          en: "inventory-item · purchase · log · appliance …",
        },
      },
      {
        kind: "endpoint",
        tone: "external",
        icon: "🐘",
        label: { ko: "PostgreSQL", en: "PostgreSQL" },
        sublabel: { ko: "도메인 데이터", en: "Domain data" },
      },
    ],
    edges: [
      { label: { ko: "페이지 요청", en: "page request" } },
      { label: { ko: "커맨드·쿼리", en: "command / query" } },
      { label: { ko: "영속화", en: "persist" } },
    ],
    returnNote: {
      ko: "유통기한 임박은 알림 모듈 → FCM 푸시로 전달됩니다",
      en: "Expiring items flow through the alert module to an FCM push",
    },
  },
];
