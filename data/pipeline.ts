import type { L } from "@/data/i18n";

/**
 * 메인 페이지 파이프라인 섹션 데이터 — "위성에서 사용자까지" 데이터 여정.
 *
 * 시스템 간 정밀한 호출 관계(콜 그래프)가 아니라 *데이터가 거치는 단계*의 요약이다.
 * 정확한 토폴로지(분석 결과의 데이터 플랫폼 환류 등)는
 * /projects/lumir-sar-platform 의 통합 다이어그램(PlatformDiagram)이 담당한다.
 *
 * layer 단계의 label·icon은 lumir-sar-platform subProjects의
 * layerLabel·layerIcon을 런타임에 조회해 rename에 동기화된다 (여기 값은 fallback).
 */

export interface PipelineStage {
  /** layer 단계만 — lumir-sar-platform subProject slug. 상세 페이지 #anchor와 동일 */
  slug?: string;
  kind: "endpoint" | "layer";
  /** endpoint 스타일 — external=점선(외부 시스템), actor=반전(사람). 다이어그램 kind와 동일 의미 */
  tone?: "external" | "actor";
  icon: string; // layer는 layerIcon 조회 실패 시 fallback
  label: L; // layer는 layerLabel 조회 실패 시 fallback
  sublabel: L; // repo · 스택 (mono 한 줄)
  desc?: L; // 이 단계에서 일어나는 일 (layer 카드 전용)
  cat?: number; // 카테고리 색 — 통합 다이어그램의 cat 인덱스와 동일하게 유지
}

export interface PipelineEdge {
  label: L;
}

/** 좌→우 데이터 여정. stages[i] → stages[i+1] 사이가 edges[i]. */
export const pipelineStages: PipelineStage[] = [
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
    sublabel: {
      ko: "위치 요청 → 변위 데이터",
      en: "Location → displacement",
    },
  },
];

export const pipelineEdges: PipelineEdge[] = [
  { label: { ko: "SLC 수집", en: "SLC ingest" } },
  { label: { ko: "InSAR 요청", en: "InSAR request" } },
  { label: { ko: "XYZ 시계열", en: "XYZ time series" } },
  { label: { ko: "지도 응답", en: "Map response" } },
];
