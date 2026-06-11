import type { L } from "@/data/i18n";

/**
 * 메인 페이지 파이프라인 섹션 데이터 — 프로젝트별 "데이터가 거치는 단계" 요약.
 *
 * 시스템 간 정밀한 호출 관계가 아니라 *데이터 여정*의 요약이다. 정확한 토폴로지는
 * 각 프로젝트 상세의 다이어그램(PlatformDiagram·ProjectDiagram)이 담당한다.
 *
 * 프로젝트 성격이 다이어그램 *모양*으로 드러나도록 변형(variant)을 나눈다:
 *  - SAR  (spine·기본)   : 가로 스파인 — 시스템을 가로지르는 데이터 여정. 간판.
 *  - SDPE (orchestration): 제어 플레인(콘솔→워크플로) + pgmq 이벤트 버스 레일이
 *                          L0/L1·L2/L3 레벨 카드로 디스패치하는 2-플레인 보드.
 *  - him  (stack)        : 모바일 디바이스 프레임 속 세로 스택 — 커맨드/쿼리 트윈
 *                          레인(CQRS)과 프레임 밖 FCM 푸시 환류 레인.
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
  tags?: L[]; // 카드 하단 칩 — 기술·하위 항목 (flex-wrap, layer 카드 전용)
  cat?: number; // 카테고리 색 — 통합 다이어그램의 cat 인덱스와 동일
  badge?: string; // levels 변형의 레벨 칩 (L0 / L1·L2 / L3)
}

export interface PipelineEdge {
  label: L;
  /** stack 변형 — 이 구간을 두 레인으로 분리 렌더 (CQRS 커맨드/쿼리). cat은 레인 색 */
  twin?: { label: L; cat: number }[];
}

export interface Pipeline {
  id: string;
  /** 상세 페이지 + 카드 링크 베이스 (/projects/{projectSlug}) */
  projectSlug: string;
  title: L;
  icon: string;
  /** 다이어그램 변형 — 미지정: 가로 스파인 / orchestration: 이벤트 버스 보드 / stack: 세로 디바이스 스택 */
  variant?: "orchestration" | "stack";
  /** 컴팩트(작은 카드) 렌더 — 사이드 프로젝트(him)용. 미지정 시 일반 크기 */
  compact?: boolean;
  /** 좌→우(stack은 위→아래) 데이터 여정. stages[i] → stages[i+1] 사이가 edges[i]. */
  stages: PipelineStage[];
  edges: PipelineEdge[];
  /** orchestration 변형 — 제어 플레인: 콘솔 →run→ 워크플로 ⇒ 이벤트 버스 ⇒ 레벨 디스패치 */
  control?: {
    console: PipelineStage;
    runLabel: L;
    workflow: { icon: string; label: L; sublabel: L };
    busLabel: L;
  };
  /** stack 변형 — 두 번째 디바이스: 푸시 수신 잠금화면 목업. laneLabel은 본체→이 기기 점선 레인 */
  pushDevice?: {
    laneLabel: L;
    clock: string;
    date: L;
    notifications: { icon: string; app: L; time: L; title: L; body: L }[];
    hint: L;
    caption: L;
  };
  /** stack 변형 — 세 번째 디바이스: 알림 탭 후 앱 대시보드 목업 */
  appScreen?: {
    laneLabel: L;
    clock: string;
    title: L;
    stats: { value: string; label: L; tone: "ok" | "warn" | "danger" }[];
    rows: { icon: string; name: L; meta: L; badge: L; tone: "ok" | "warn" | "danger" }[];
    tabs: { icon: string; label: L }[];
    caption: L;
  };
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
        tags: [
          { ko: "CDSE", en: "CDSE" },
          { ko: "NAS · SMB2", en: "NAS · SMB2" },
          { ko: "DDD 5-layer", en: "DDD 5-layer" },
        ],
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
        tags: [
          { ko: "SNAP", en: "SNAP" },
          { ko: "ISCE2", en: "ISCE2" },
          { ko: "MintPy", en: "MintPy" },
          { ko: "5종 스택", en: "5-tool stack" },
        ],
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
        tags: [
          { ko: "Next.js", en: "Next.js" },
          { ko: "지도 + AOI", en: "Map + AOI" },
          { ko: "Route Handler BFF", en: "Route Handler BFF" },
        ],
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

  // ── SDPE — LumirX 처리 파이프라인 · 오케스트레이션 보드 (제어/데이터 2-플레인) ──
  {
    id: "sdpe",
    projectSlug: "sdpe",
    icon: "🛰",
    variant: "orchestration",
    title: { ko: "SDPE — LumirX 처리 파이프라인", en: "SDPE — LumirX processing pipeline" },
    note: {
      ko: "운영 콘솔에서 DAG를 구성하면 Pipeline Workflow(NestJS)가 pgmq 이벤트로 오케스트레이션하고, CSC 1~9 인터페이스 체인이 각 레벨을 처리합니다.",
      en: "From the operator console a DAG is composed; Pipeline Workflow (NestJS) orchestrates it over pgmq events, and a CSC 1–9 interface chain processes each level.",
    },
    control: {
      console: {
        kind: "endpoint",
        tone: "actor",
        icon: "🖥",
        label: { ko: "운영 콘솔", en: "Operator console" },
        sublabel: { ko: "DAG 구성·실행", en: "Compose & run DAG" },
      },
      runLabel: { ko: "DAG 실행", en: "run DAG" },
      workflow: {
        icon: "⚡",
        label: { ko: "Pipeline Workflow", en: "Pipeline Workflow" },
        sublabel: { ko: "NestJS · 이벤트 오케스트레이션", en: "NestJS · event orchestration" },
      },
      busLabel: { ko: "pgmq 이벤트 버스", en: "pgmq event bus" },
    },
    stages: [
      {
        kind: "layer",
        cat: 2,
        icon: "📡",
        badge: "L0",
        label: { ko: "데이터 수집", en: "Data collection" },
        sublabel: { ko: "원시 SAR 수집", en: "Raw SAR ingest" },
        desc: {
          ko: "위성 다운링크 원시 신호(L0)를 pgmq 구독으로 수집·정렬",
          en: "Subscribes over pgmq to collect & order raw downlink signals (L0)",
        },
        tags: [
          { ko: "원시 SAR", en: "Raw SAR" },
          { ko: "pgmq 구독", en: "pgmq subscribe" },
        ],
      },
      {
        kind: "layer",
        cat: 6,
        icon: "⚙",
        badge: "L1·L2",
        label: { ko: "SAR 처리", en: "SAR processing" },
        sublabel: { ko: "간섭·보정", en: "Interferometry · correction" },
        desc: {
          ko: "CSC 1~6 인터페이스 체인이 range·azimuth compression 등 레벨별 처리",
          en: "The CSC 1–6 interface chain runs per-level processing (range/azimuth compression, …)",
        },
        tags: [
          { ko: "csc-1~6", en: "csc-1–6" },
          { ko: "range compression", en: "range compression" },
          { ko: "Python 3.11", en: "Python 3.11" },
        ],
      },
      {
        kind: "layer",
        cat: 4,
        icon: "🛠",
        badge: "L3",
        label: { ko: "후처리", en: "Post-processing" },
        sublabel: { ko: "L3 산출물 생성", en: "L3 product generation" },
        desc: {
          ko: "csc-7~9가 지오코딩으로 GEC·MAP L3 산출물 생성",
          en: "csc-7–9 geocode the result into GEC · MAP L3 products",
        },
        tags: [
          { ko: "csc-7~9", en: "csc-7–9" },
          { ko: "GEC · MAP", en: "GEC · MAP" },
          { ko: "지오코딩", en: "geocoding" },
        ],
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
      { label: { ko: "원시 신호", en: "raw signal" } },
      { label: { ko: "처리 결과", en: "processed" } },
      { label: { ko: "적재", en: "catalog" } },
    ],
    returnNote: {
      ko: "작업·산출물 상태는 이벤트 버스를 거쳐 운영 콘솔에서 모니터링됩니다",
      en: "Job and product status flows back over the event bus to the operator console",
    },
  },

  // ── 집비치기 (him) — 개인 풀스택 사이드 · 모바일 디바이스 스택 ────────────
  {
    id: "him",
    projectSlug: "him",
    icon: "📦",
    variant: "stack",
    compact: true,
    title: { ko: "집비치기 (him) — 개인 풀스택", en: "him — personal full-stack" },
    note: {
      ko: "모바일 재고 앱 한 대를 위에서 아래로 — 페이지에서 갈라지는 커맨드(쓰기)·쿼리(읽기) 두 레인이 CQRS 구조 그대로입니다. 옆의 두 기기는 그 흐름의 끝: FCM 푸시가 도착한 잠금화면, 그리고 알림을 탭하면 열리는 앱 대시보드입니다.",
      en: "One mobile inventory app, top to bottom — the command (write) and query (read) lanes splitting under the pages are the CQRS structure itself. The two devices beside it are the end of that flow: a lock screen with the FCM push delivered, and the app dashboard that opens when you tap it.",
    },
    pushDevice: {
      laneLabel: { ko: "🔔 FCM 푸시", en: "🔔 FCM push" },
      clock: "07:30",
      date: { ko: "6월 11일 수요일", en: "Wednesday, June 11" },
      notifications: [
        {
          icon: "🥛",
          app: { ko: "집비치기", en: "him" },
          time: { ko: "지금", en: "now" },
          title: { ko: "우유 유통기한 D-2", en: "Milk expires in 2 days" },
          body: { ko: "냉장고 재고 2건이 임박했어요", en: "2 fridge items are expiring soon" },
        },
        {
          icon: "🔋",
          app: { ko: "집비치기", en: "him" },
          time: { ko: "1시간 전", en: "1h ago" },
          title: { ko: "건전지 재고 1개", en: "Batteries: 1 left" },
          body: { ko: "최소 수량 아래로 내려갔어요", en: "Dropped below minimum stock" },
        },
      ],
      hint: { ko: "밀어서 열기", en: "Swipe to open" },
      caption: { ko: "푸시 도착 — 잠금화면", en: "Push lands on the lock screen" },
    },
    appScreen: {
      laneLabel: { ko: "👆 알림 탭", en: "👆 Tap" },
      clock: "07:31",
      title: { ko: "집비치기", en: "him" },
      stats: [
        { value: "24", label: { ko: "전체 재고", en: "Items" }, tone: "ok" },
        { value: "2", label: { ko: "임박", en: "Expiring" }, tone: "warn" },
        { value: "1", label: { ko: "부족", en: "Low" }, tone: "danger" },
      ],
      rows: [
        {
          icon: "🥛",
          name: { ko: "우유", en: "Milk" },
          meta: { ko: "냉장 · 2개", en: "Fridge · 2" },
          badge: { ko: "D-2", en: "D-2" },
          tone: "danger",
        },
        {
          icon: "🥚",
          name: { ko: "계란", en: "Eggs" },
          meta: { ko: "냉장 · 6개", en: "Fridge · 6" },
          badge: { ko: "D-5", en: "D-5" },
          tone: "warn",
        },
        {
          icon: "🔋",
          name: { ko: "건전지 AA", en: "AA batteries" },
          meta: { ko: "서랍 · 1개", en: "Drawer · 1" },
          badge: { ko: "부족", en: "Low" },
          tone: "danger",
        },
        {
          icon: "🧻",
          name: { ko: "키친타월", en: "Paper towels" },
          meta: { ko: "창고 · 4롤", en: "Pantry · 4" },
          badge: { ko: "여유", en: "OK" },
          tone: "ok",
        },
      ],
      tabs: [
        { icon: "🏠", label: { ko: "홈", en: "Home" } },
        { icon: "📦", label: { ko: "재고", en: "Items" } },
        { icon: "🧾", label: { ko: "구매", en: "Buy" } },
        { icon: "⚙", label: { ko: "설정", en: "Set" } },
      ],
      caption: { ko: "알림 탭 → 앱 대시보드", en: "Tap → app dashboard" },
    },
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
          ko: "모바일 재고 UI",
          en: "Mobile inventory UI",
        },
        desc: {
          ko: "재고 흐름을 페이지 단위로 구성 — 직접 기획·구현",
          en: "Inventory flow organized page by page — self-planned & built",
        },
        tags: [
          { ko: "대시보드", en: "Dashboard" },
          { ko: "구매", en: "Purchases" },
          { ko: "이력", en: "History" },
          { ko: "가전", en: "Appliances" },
        ],
      },
      {
        kind: "layer",
        cat: 2,
        icon: "🧾",
        label: { ko: "CQRS 도메인 모듈", en: "CQRS domain modules" },
        sublabel: { ko: "NestJS · 23개 모듈", en: "NestJS · 23 modules" },
        desc: {
          ko: "도메인별 CQRS 모듈 — 커맨드·쿼리 책임 분리",
          en: "Per-domain CQRS modules — command/query responsibility split",
        },
        tags: [
          { ko: "inventory-item", en: "inventory-item" },
          { ko: "purchase", en: "purchase" },
          { ko: "inventory-log", en: "inventory-log" },
          { ko: "appliance", en: "appliance" },
          { ko: "+19 모듈", en: "+19 more" },
        ],
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
      {
        label: { ko: "커맨드·쿼리", en: "command / query" },
        twin: [
          { label: { ko: "커맨드", en: "command" }, cat: 1 },
          { label: { ko: "쿼리", en: "query" }, cat: 3 },
        ],
      },
      { label: { ko: "영속화", en: "persist" } },
    ],
    returnNote: {
      ko: "유통기한 임박은 알림 모듈 → FCM 푸시로 전달됩니다",
      en: "Expiring items flow through the alert module to an FCM push",
    },
  },
];
