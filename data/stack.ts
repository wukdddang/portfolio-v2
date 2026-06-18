/**
 * 기술 스택 — 메인 직군 vs 학습 도메인 분리
 * Brain Trinity 자료 박스 + entities 페이지에서 추출
 * Bilingual {ko, en} fields for label and notes (item names stay plain).
 */

import type { L } from "./i18n";

export interface StackItem {
  name: string;
  note?: L;
}

export interface StackCategory {
  label: L;
  items: StackItem[];
}

export const mainStack: StackCategory[] = [
  {
    label: { ko: "프론트엔드", en: "Frontend" },
    items: [
      { name: "TypeScript" },
      { name: "Next.js" },
      { name: "React" },
      { name: "Tailwind CSS" },
      { name: "Playwright (e2e)" },
    ],
  },
  {
    label: { ko: "백엔드", en: "Backend" },
    items: [
      { name: "NestJS" },
      { name: "CQRS", note: { ko: "@nestjs/cqrs", en: "@nestjs/cqrs" } },
      { name: "TypeORM" },
      { name: "PostgreSQL" },
      {
        name: "pgmq",
        note: {
          ko: "PostgreSQL message queue",
          en: "PostgreSQL message queue",
        },
      },
      {
        name: "DDD 5-layer",
        note: {
          ko: "domain / business / context / handlers / interfaces",
          en: "domain / business / context / handlers / interfaces",
        },
      },
      { name: "Jest + Testcontainers" },
    ],
  },
  {
    label: { ko: "인프라 · CI/CD", en: "Infra · CI/CD" },
    items: [
      { name: "Docker · docker-compose" },
      {
        name: "GitLab CI/CD",
        note: {
          ko: "0에서 구축 + 커스텀 메일",
          en: "Built from scratch + custom mail",
        },
      },
      {
        name: "Terraform IaC",
        note: { ko: "S3 양쪽 레시피", en: "Recipes for both S3 sides" },
      },
      {
        name: "Grafana + Prometheus",
        note: {
          ko: "백업 메트릭 textfile collector",
          en: "Backup metrics via textfile collector",
        },
      },
      {
        name: "FastAPI",
        note: {
          ko: "분석 서버 (NestJS 연결)",
          en: "Analysis server (bridged to NestJS)",
        },
      },
    ],
  },
  {
    label: { ko: "AI 협업", en: "AI collaboration" },
    items: [
      {
        name: "Claude Code",
        note: {
          ko: "메인 사고 파트너 · AI native 100%",
          en: "Primary thinking partner · 100% AI native",
        },
      },
      {
        name: "다중 agent 워크트리",
        note: {
          ko: "agent 1~4 병렬 + handoff 시스템",
          en: "Agents 1–4 in parallel + handoff system",
        },
      },
      {
        name: "Brain Trinity 위키",
        note: {
          ko: "Karpathy /raw 패턴 + skill 시스템",
          en: "Karpathy /raw pattern + skill system",
        },
      },
    ],
  },
];

export const learnedDomain: StackCategory[] = [
  {
    label: { ko: "SAR · 위성영상", en: "SAR · Satellite imagery" },
    items: [
      { name: "Sentinel-1 SAR" },
      {
        name: "ESA SNAP 12",
        note: { ko: "MicrowaveTBX (SAR)", en: "MicrowaveTBX (SAR)" },
      },
      {
        name: "SNAPHU",
        note: { ko: "위상 언래핑", en: "Phase unwrapping" },
      },
      {
        name: "MintPy",
        note: { ko: "SBAS 시계열", en: "SBAS time series" },
      },
      {
        name: "ISCE2",
        note: {
          ko: "신규 트랙 — 속도 확보",
          en: "New track — speed unlocked",
        },
      },
      {
        name: "StaMPS PSI",
        note: { ko: "Octave + 12 patches", en: "Octave + 12 patches" },
      },
      { name: "DInSAR · SBAS · PSInSAR" },
      {
        name: "PyAPS + ERA5",
        note: { ko: "대기 보정", en: "Atmospheric correction" },
      },
      {
        name: "CDSE",
        note: { ko: "Copernicus Data Space", en: "Copernicus Data Space" },
      },
    ],
  },
  {
    label: { ko: "도메인 도구", en: "Domain tools" },
    items: [
      { name: "QGIS" },
      {
        name: "Python (분석)",
        note: {
          ko: "rasterio · geopandas · shapely",
          en: "rasterio · geopandas · shapely",
        },
      },
      {
        name: "Snappy",
        note: { ko: "SNAP Python bridge", en: "SNAP Python bridge" },
      },
    ],
  },
];
