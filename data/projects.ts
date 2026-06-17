/**
 * 5개 메인 프로젝트 자료 박스 (lumir-sar-platform은 3 sub-projects 통합)
 * Brain Trinity wiki/ai/ai-usage-levels-seong-pm.md 정제 결과 (2026-05-20 ~ 2026-05-23)
 * Bilingual {ko, en} fields. Slugs / keywords / icons remain plain strings.
 */

import type { L } from "./i18n";

export type TrackTag = "satellite" | "robotics" | "both";

export interface ProjectImage {
  src: string;
  alt: L;
  caption?: L;
}

/** 그리드 카드 상단 대표 이미지 — position 으로 크롭 기준 조정(세로 스크린샷은 "top" 권장, 기본 center) */
export interface ProjectCardImage {
  src: string;
  alt: L;
  position?: "top" | "center";
}

export interface ProjectVideo {
  src: string; // mp4 권장 (브라우저 호환). gif는 별도 export용.
  poster?: string; // 정지 미리보기 (mp4 prefetch 전 표시).
  gif?: string; // 외부 공유·다운로드용 GIF 경로 (선택).
  alt: L;
  caption?: L;
}

export interface ProjectArea {
  icon: string;
  label: L;
  description: L;
}

export interface ProjectMetric {
  label: L;
  value: L;
}

export interface ProjectQa {
  q: L;
  a: L;
}

// ---------------------------------------------------------------------------
// 아키텍처 / 데이터플로우 다이어그램 — React Flow 렌더 (data 기반 · bilingual)
// 좌표는 col/row 그리드로 선언 → 컴포넌트에서 x/y로 매핑 (레이아웃 결정적)
// ---------------------------------------------------------------------------
export type DiagramNodeKind = "layer" | "external" | "actor";
export type DiagramSide = "top" | "right" | "bottom" | "left";

export interface DiagramNode {
  id: string;
  label: L;
  sublabel?: L;
  icon?: string;
  kind?: DiagramNodeKind; // 스타일 변형 (기본 layer)
  cat?: number; // 카테고리 색 인덱스 (1-6) → var(--cat-N). layer "식별" 전용, 아이콘과 페어
  group?: string; // 같은 group id끼리 그룹 프레임으로 묶어 렌더 (예: "ext" 외부 인프라)
  // true면 ProjectDiagram에서 카드가 아니라 가로 버스 레일로 렌더 — 이 노드에서 나가는 엣지(to)
  // 각각이 해당 단계 위로 정렬된 드롭이 된다 (예: SDPE pgmq 이벤트 버스, 메인 미리보기와 동일).
  bus?: boolean;
  // card 대신 특수 노드로 렌더: dagBuilder=React Flow DAG 빌더 미니 캔버스(운영 콘솔),
  // cscChain=가로 컴포넌트 스트립(예: SDPE CSC 1~9). 둘 다 ProjectDiagram이 전담 렌더.
  variant?: "dagBuilder" | "cscChain";
  // cscChain 전용 — 스트립 핀 목록. id=라벨(CSC-0N) · role=한 줄 역할 · cat=서브시스템 색
  chain?: { id: string; role: L; cat?: number }[];
  col: number; // 그리드 열 (0-based)
  row: number; // 그리드 행 (0-based)
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: L;
  fromSide?: DiagramSide; // 출발 핸들 (기본 bottom)
  toSide?: DiagramSide; // 도착 핸들 (기본 top)
  kind?: "primary" | "secondary" | "control"; // primary=amber 데이터 · control=teal 제어(pgmq) · secondary=보조
  dashed?: boolean;
  animated?: boolean;
}

export interface ProjectDiagram {
  caption?: L;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  // 노드 묶음 프레임 (node.group === id 인 노드들). cat=프레임 색(var(--cat-N), 기본 accent), icon=라벨 앞 아이콘
  groups?: { id: string; label: L; cat?: number; icon?: string }[];
}

export interface Project {
  slug: string;
  title: L;
  subtitle: L;
  badge: L;
  /** 카드 대표 이미지 (그리드, 가로 스크린샷 1장 — object-cover). 없으면 icon 그라데이션 폴백 */
  cardImage?: ProjectCardImage;
  /** 카드 대표 이미지 2장 이상 (세로 스크린샷 갤러리 — 비율 유지 object-contain, 나란히). cardImage 보다 우선 */
  cardImages?: ProjectCardImage[];
  /** 카드 이미지 폴백 시 그라데이션 위에 띄울 대표 이모지 */
  icon?: string;
  problem: L;
  system: L;
  impact: L;
  keywords: L[];
  trackVisibility: TrackTag;
  /** 연관 학습 로그 슬러그(/studies/{slug}) — 프로젝트 상세에서 도메인 학습 로그로 상호 링크 */
  relatedStudies?: string[];
  honestyNote?: L;
  ownContribution?: L;
  inheritedScope?: L;
  metrics?: ProjectMetric[];
  measurementPending?: L[];
  qa?: ProjectQa[];
  images?: ProjectImage[];
  videos?: ProjectVideo[];
  subProjects?: Project[];
  layerLabel?: L;
  layerIcon?: string;
  areas?: ProjectArea[];
  diagram?: ProjectDiagram;
}

// ===========================================================================
// 3 레이어 sub-projects — lumir-sar-platform 통합 박스 안에 묶임
// ===========================================================================

const sarDataRetrievalLayer: Project = {
  slug: "sar-data-retrieval",
  diagram: {
    caption: {
      ko: "사용자 위치 검색이 sentinel-retrieval(NestJS)로 들어오면 CDSE 카탈로그를 검색·다운로드해 NAS(SMB2)에 SLC를 저장하고, 메타·결과는 PostgreSQL+PostGIS에 적재합니다. 별도 레포 snap(Snappy·MintPy)이 NAS의 SLC를 읽어 분석 결과를 환류 — DDD 5-layer로 도메인 격리.",
      en: "A user's location search hits sentinel-retrieval (NestJS), which searches/downloads the CDSE catalog, stores SLCs on NAS (SMB2), and writes metadata/results to PostgreSQL+PostGIS. The separate repo snap (Snappy · MintPy) reads SLCs from NAS and feeds analysis results back — domains isolated via DDD 5-layer.",
    },
    nodes: [
      {
        id: "api",
        kind: "actor",
        icon: "👤",
        label: { ko: "사용자 API", en: "User API" },
        sublabel: { ko: "위치·카탈로그 검색", en: "Location / catalog search" },
        col: 1,
        row: 0,
      },
      {
        id: "retrieval",
        kind: "layer",
        cat: 2,
        icon: "🗄",
        label: { ko: "sentinel-retrieval", en: "sentinel-retrieval" },
        sublabel: { ko: "NestJS · DDD 5-layer", en: "NestJS · DDD 5-layer" },
        col: 1,
        row: 1,
      },
      {
        id: "cdse",
        kind: "external",
        icon: "🛰",
        label: { ko: "CDSE", en: "CDSE" },
        sublabel: { ko: "Sentinel-1 카탈로그 API", en: "Sentinel-1 catalog API" },
        col: 0,
        row: 0,
        group: "ext",
      },
      {
        id: "db",
        kind: "external",
        icon: "🐘",
        label: { ko: "PostgreSQL", en: "PostgreSQL" },
        sublabel: { ko: "PostGIS · 메타·결과", en: "PostGIS · metadata/results" },
        col: 0,
        row: 1,
        group: "ext",
      },
      {
        id: "nas",
        kind: "external",
        icon: "💾",
        label: { ko: "NAS", en: "NAS" },
        sublabel: { ko: "SLC 저장 (SMB2)", en: "SLC store (SMB2)" },
        col: 0,
        row: 2,
        group: "ext",
      },
      {
        id: "snap",
        kind: "layer",
        cat: 6,
        icon: "📡",
        label: { ko: "snap 별도 레포", en: "snap separate repo" },
        sublabel: { ko: "Snappy · MintPy 분석", en: "Snappy · MintPy analysis" },
        col: 1,
        row: 2,
      },
    ],
    edges: [
      { from: "api", to: "retrieval", kind: "primary", animated: true, label: { ko: "① 검색 요청", en: "① search request" } },
      { from: "retrieval", to: "cdse", kind: "secondary", fromSide: "left", toSide: "right", label: { ko: "② 검색·다운로드", en: "② search·download" } },
      { from: "retrieval", to: "nas", kind: "secondary", fromSide: "left", toSide: "right", label: { ko: "③ SLC 저장", en: "③ store SLC" } },
      { from: "nas", to: "snap", kind: "secondary", fromSide: "right", toSide: "left", label: { ko: "④ SLC 읽기", en: "④ read SLC" } },
      { from: "snap", to: "retrieval", kind: "secondary", dashed: true, fromSide: "top", toSide: "bottom", label: { ko: "⑤ 분석 결과", en: "⑤ result" } },
      { from: "retrieval", to: "db", kind: "secondary", fromSide: "left", toSide: "right", label: { ko: "메타 저장", en: "meta" } },
      { from: "retrieval", to: "api", kind: "primary", dashed: true, fromSide: "right", toSide: "right", label: { ko: "⑥ 결과 응답", en: "⑥ response" } },
    ],
    groups: [
      { id: "ext", label: { ko: "외부 인프라", en: "External infrastructure" } },
    ],
  },
  layerLabel: { ko: "데이터·운영 플랫폼", en: "Data & Ops Platform" },
  layerIcon: "🗄",
  title: {
    ko: "Sentinel SAR 검색·분석 백엔드",
    en: "Sentinel SAR search & analysis backend",
  },
  subtitle: {
    ko: "NestJS 모노레포 + CDSE + NAS PoC + DDD 5-layer + snap 통합 (AI native)",
    en: "NestJS monorepo + CDSE + NAS PoC + DDD 5-layer + snap integration (AI native)",
  },
  badge: { ko: "3+4(+5) 혼합", en: "Stage 3+4 (+5) blend" },
  problem: {
    ko: "기존에 존재하지 않는 날씨·계절 무관 지표 변위 데이터 제공 플랫폼 + Sentinel SAR 검색·다운로드·메타데이터 통합 백엔드가 필요했습니다. snap 처리 결과를 사용자 위치 검색 가능한 형태로 제공할 서비스 레이어도 필요했습니다.",
    en: "We needed a previously-nonexistent platform for weather- and season-independent surface displacement data, plus a unified backend for Sentinel SAR search, download, and metadata. A service layer that exposes snap-processed results in location-searchable form was also missing.",
  },
  system: {
    ko: "NestJS 모노레포 (sentinel-retrieval + ai-processing) + CDSE API + NAS(SMB2 vs 직접 FS) PoC + SLC 도메인 모델링 + DDD 5-layer + snap 별도 레포 통합 레이어를 구축했습니다. AI native 진행으로 예측 보일러플레이트 시점만 도메인 구조를 일부 수정했습니다.",
    en: "Built a NestJS monorepo (sentinel-retrieval + ai-processing) on top of the CDSE API, ran a NAS PoC (SMB2 vs direct FS), modeled the SLC domain, applied DDD 5-layer, and added an integration layer for the snap separate repo. Done AI-native; the domain structure was only tweaked at the points where predictable boilerplate emerged.",
  },
  impact: {
    ko: "3 레이어 통합 서비스의 데이터·운영 플랫폼을 담당합니다. 사용자 위치 요청에 분석 데이터를 즉시 제공하거나 신규 처리 후 제공할 수 있는 구조의 기초가 됩니다.",
    en: "This is the data & ops platform of the 3-layer integrated service — the foundation that lets a user's location query be answered with already-analyzed data instantly, or with newly-processed data on the fly.",
  },
  keywords: [
    { ko: "NestJS 모노레포", en: "NestJS monorepo" },
    { ko: "CDSE", en: "CDSE" },
    { ko: "NAS SMB2/직접FS PoC", en: "NAS SMB2 / direct-FS PoC" },
    { ko: "DDD 5-layer", en: "DDD 5-layer" },
    { ko: "SLC 도메인", en: "SLC domain" },
    { ko: "AI native", en: "AI native" },
  ],
  trackVisibility: "both",
  metrics: [
    {
      label: { ko: "DDD 계층", en: "DDD layers" },
      value: { ko: "5-layer", en: "5-layer" },
    },
    {
      label: { ko: "통합 외부 시스템", en: "External systems integrated" },
      value: { ko: "CDSE + NAS", en: "CDSE + NAS" },
    },
  ],
};

const lumirLinuxSnapLayer: Project = {
  slug: "lumir-linux-snap",
  diagram: {
    caption: {
      ko: "사용자가 지도에서 지역·AOI를 골라 변위 분석을 요청하는 데서 흐름이 시작됩니다. 대시보드가 job을 만들어 작업 큐에 넣으면, SBAS·PSI 워커가 frame 단위로 나눠(host affinity) 각자 처리하고 velocity를 PostgreSQL에 적재 — 결과는 변위 지도로 사용자에게 돌아오고, XYZ 시계열은 외부 3D 플랫폼에 전달됩니다. DInSAR(SNAP 2-pass)는 1 페어로 빠른 LOS 변위 GeoTIFF를 만들어 대시보드로 바로 돌려줍니다. (파랑 = SBAS, 초록 = PSI, 보라 = DInSAR)",
      en: "The flow starts when the user picks a region/AOI on the map and requests a displacement analysis. The dashboard creates a job on the queue; the SBAS and PSI workers split it frame-by-frame (host affinity), process locally, and write velocity into PostgreSQL — the result returns to the user as a velocity map, and the XYZ time series goes to the external 3D platform. The DInSAR path (SNAP 2-pass) turns a single pair into a quick LOS-displacement GeoTIFF returned straight to the dashboard. (Blue = SBAS, green = PSI, violet = DInSAR.)",
    },
    nodes: [
      {
        id: "user",
        kind: "actor",
        icon: "👤",
        label: { ko: "사용자", en: "User" },
        sublabel: { ko: "지도에서 지역·AOI 분석 요청", en: "Request analysis for an AOI" },
        col: 0,
        row: 0,
      },
      {
        id: "dashboard",
        kind: "layer",
        cat: 2,
        icon: "🖥",
        label: { ko: "대시보드", en: "Dashboard" },
        sublabel: { ko: "FastAPI · 변위 지도·QA (NestJS)", en: "FastAPI · velocity map·QA (NestJS)" },
        col: 1,
        row: 0,
      },
      {
        id: "queue",
        kind: "layer",
        cat: 1,
        icon: "🔀",
        label: { ko: "작업 큐", en: "Job queue" },
        sublabel: { ko: "insar_db.jobs · frame분할·SKIP LOCKED", en: "insar_db.jobs · frame-split·SKIP LOCKED" },
        col: 1,
        row: 1,
      },
      {
        id: "isce174",
        kind: "layer",
        cat: 3,
        icon: "🛰",
        label: { ko: "ISCE2 stackSentinel", en: "ISCE2 stackSentinel" },
        sublabel: { ko: "SBAS · TOPS coreg + 간섭도", en: "SBAS · TOPS coreg + ifg" },
        col: 0,
        row: 3,
      },
      {
        id: "snaphu174",
        kind: "layer",
        cat: 3,
        icon: "🧩",
        label: { ko: "SNAPHU", en: "SNAPHU" },
        sublabel: { ko: "SBAS · 위상 펼침", en: "SBAS · phase unwrap" },
        col: 0,
        row: 4,
      },
      {
        id: "mintpy174",
        kind: "layer",
        cat: 3,
        icon: "📈",
        label: { ko: "MintPy SBAS", en: "MintPy SBAS" },
        sublabel: { ko: "ERA5 시계열", en: "ERA5 time series" },
        col: 0,
        row: 5,
      },
      {
        id: "nas",
        kind: "external",
        icon: "💾",
        label: { ko: "NAS", en: "NAS" },
        sublabel: { ko: "Sentinel-1 SLC (/mnt/sar)", en: "Sentinel-1 SLC (/mnt/sar)" },
        col: 1,
        row: 2,
      },
      {
        id: "coreg173",
        kind: "layer",
        cat: 6,
        icon: "🛰",
        label: { ko: "ISCE2 coreg", en: "ISCE2 coreg" },
        sublabel: { ko: "PSI · 자기완결 (-W slc)", en: "PSI · self-contained (-W slc)" },
        col: 1,
        row: 3,
      },
      {
        id: "miaplpy173",
        kind: "layer",
        cat: 6,
        icon: "🟢",
        label: { ko: "MiaplPy PSI", en: "MiaplPy PSI" },
        sublabel: { ko: "RTX4080 phase linking", en: "RTX4080 phase linking" },
        col: 1,
        row: 4,
      },
      {
        id: "db",
        kind: "external",
        icon: "🐘",
        label: { ko: "PostgreSQL", en: "PostgreSQL" },
        sublabel: { ko: "PostGIS · velocity_points", en: "PostGIS · velocity_points" },
        col: 1,
        row: 6,
      },
      {
        id: "platform",
        kind: "external",
        icon: "🌐",
        label: { ko: "외부 3D 플랫폼", en: "External 3D platform" },
        sublabel: { ko: "XYZ 시계열 전달", en: "XYZ time series" },
        col: 1,
        row: 7,
      },
      {
        id: "dinsar_snap",
        kind: "layer",
        cat: 4,
        icon: "🛰",
        label: { ko: "SNAP GPT", en: "SNAP GPT" },
        sublabel: { ko: "DInSAR · 1페어 간섭도+지형위상 제거", en: "DInSAR · 1-pair ifg + topo removal" },
        col: 2,
        row: 3,
      },
      {
        id: "dinsar_snaphu",
        kind: "layer",
        cat: 4,
        icon: "🧩",
        label: { ko: "SNAPHU", en: "SNAPHU" },
        sublabel: { ko: "DInSAR · 위상 펼침", en: "DInSAR · phase unwrap" },
        col: 2,
        row: 4,
      },
      {
        id: "dinsar_disp",
        kind: "layer",
        cat: 4,
        icon: "🗺",
        label: { ko: "PhaseToDisp + TC", en: "PhaseToDisp + TC" },
        sublabel: { ko: "LOS 변위 → GeoTIFF 10m", en: "LOS displacement → GeoTIFF 10m" },
        col: 2,
        row: 5,
      },
    ],
    edges: [
      { from: "user", to: "dashboard", kind: "primary", fromSide: "right", toSide: "left", label: { ko: "① 지역 분석 요청", en: "① request" } },
      { from: "dashboard", to: "queue", kind: "primary", fromSide: "bottom", toSide: "top", label: { ko: "② job 생성", en: "② create job" } },
      { from: "queue", to: "isce174", kind: "primary", fromSide: "left", toSide: "top", label: { ko: "③ SBAS job", en: "③ SBAS job" } },
      { from: "queue", to: "coreg173", kind: "primary", fromSide: "right", toSide: "top", label: { ko: "③ PSI job", en: "③ PSI job" } },
      { from: "isce174", to: "snaphu174", kind: "primary", fromSide: "bottom", toSide: "top", label: { ko: "간섭도", en: "ifg" } },
      { from: "snaphu174", to: "mintpy174", kind: "primary", fromSide: "bottom", toSide: "top", label: { ko: "unwrap", en: "unwrap" } },
      { from: "coreg173", to: "miaplpy173", kind: "primary", fromSide: "bottom", toSide: "top", label: { ko: "phase linking", en: "phase linking" } },
      { from: "nas", to: "isce174", kind: "secondary", fromSide: "left", toSide: "top", label: { ko: "SLC", en: "SLC" } },
      { from: "nas", to: "coreg173", kind: "secondary", fromSide: "bottom", toSide: "top", label: { ko: "SLC", en: "SLC" } },
      { from: "mintpy174", to: "db", kind: "primary", fromSide: "bottom", toSide: "top", label: { ko: "④ velocity", en: "④ velocity" } },
      { from: "miaplpy173", to: "db", kind: "primary", fromSide: "bottom", toSide: "top", label: { ko: "④ velocity", en: "④ velocity" } },
      { from: "db", to: "dashboard", kind: "secondary", dashed: true, fromSide: "left", toSide: "top", label: { ko: "⑤ 변위 지도", en: "⑤ velocity map" } },
      { from: "db", to: "platform", kind: "secondary", fromSide: "bottom", toSide: "top", label: { ko: "XYZ 시계열", en: "XYZ series" } },
      { from: "queue", to: "dinsar_snap", kind: "primary", fromSide: "right", toSide: "top", label: { ko: "③ DInSAR job", en: "③ DInSAR job" } },
      { from: "nas", to: "dinsar_snap", kind: "secondary", fromSide: "right", toSide: "top", label: { ko: "SLC", en: "SLC" } },
      { from: "dinsar_snap", to: "dinsar_snaphu", kind: "primary", fromSide: "bottom", toSide: "top", label: { ko: "간섭도", en: "ifg" } },
      { from: "dinsar_snaphu", to: "dinsar_disp", kind: "primary", fromSide: "bottom", toSide: "top", label: { ko: "unwrap", en: "unwrap" } },
      { from: "dinsar_disp", to: "dashboard", kind: "secondary", dashed: true, fromSide: "right", toSide: "right", label: { ko: "⑤ 변위 GeoTIFF", en: "⑤ displacement GeoTIFF" } },
    ],
  },
  layerLabel: { ko: "InSAR 분석 플랫폼", en: "InSAR Analysis Platform" },
  layerIcon: "⚙",
  title: {
    ko: "Sentinel-1 InSAR 처리 파이프라인",
    en: "Sentinel-1 InSAR processing pipeline",
  },
  subtitle: {
    ko: "5종 도구 다중 스택 + InSAR 결과 API(외부 플랫폼 전달) · 정부 공동 지표변위 모니터링",
    en: "5-tool stack + an InSAR-results API delivered to an external platform · joint-gov surface-displacement monitoring",
  },
  badge: { ko: "3 → 4 + 5 신호", en: "Stage 3 → 4 + stage-5 signal" },
  problem: {
    ko: "정부 공공기관 공동 지표변위 모니터링 사업에서 SNAP 단독 파이프라인은 처리 속도 한계로 실시간 서비스화가 불가능했습니다. ASC 단독 SBAS의 LOS 1D 한계, 단일 건물 hot-spot 식별을 위한 최소 2 yr stack 요구도 풀어야 했습니다.",
    en: "On the joint-gov surface-displacement monitoring program, a SNAP-only pipeline couldn't keep up with real-time service demands. The LOS 1-D limit of ASC-only SBAS, and the minimum 2-year stack required to identify per-building hotspots, also had to be addressed.",
  },
  system: {
    ko: "5종 도구 다중 스택 (SNAP 12 + SNAPHU 2.0.3 + MintPy 1.6.2 + StaMPS PSI + ISCE2 2.6.3)을 운영했습니다. 오버엔지니어링 방지 원칙 + AI 사고 파트너로 도구 평가 + 다중 Claude Code agent 워크트리 (agent 1~4 병렬 + gpt_isolated wrapper + handoff 시스템)를 갖췄습니다. PSI 분석은 coreg를 자기완결화(`-W slc`)해 ifg/unwrap을 우회하도록 정리하고, 단위테스트는 통과하지만 실런에서만 드러나는 실버그 7건을 잡아 실데이터 end-to-end(velocity.h5)까지 검증했습니다. 그 위에 처리 결과를 외부 3D 플랫폼으로 전달하는 FastAPI 운영 레이어(`/xyz/*` 시계열·`/aoi/assess`·`/baseline/perp`)를 직접 설계했고, 무거운 처리 전에 적합성을 초 단위로 진단하는 사전점검 엔드포인트 + 재부팅 자동기동(Docker)·디스크 풀 자동 이관(systemd 타이머)까지 운영 하드닝을 맡았습니다.",
    en: "Ran a 5-tool stack (SNAP 12 + SNAPHU 2.0.3 + MintPy 1.6.2 + StaMPS PSI + ISCE2 2.6.3). Anti-over-engineering as the working principle, tool selection done with AI as a thinking partner, and multi-Claude-Code agent worktrees (agents 1–4 in parallel + a gpt_isolated wrapper + handoff system). I consolidated the PSI path around a self-contained coregistration (`-W slc`) that bypasses ifg/unwrap, then validated it end-to-end on real data (through velocity.h5) by fixing 7 bugs that passed unit tests yet only surfaced in real runs. On top of that I designed the FastAPI operational layer that delivers results to an external 3D platform (`/xyz/*` time series · `/aoi/assess` · `/baseline/perp`), plus preflight endpoints that diagnose suitability in seconds before any heavy run, and owned the ops hardening — auto-start on reboot (Docker) and automatic disk-full eviction to NAS (systemd timer).",
  },
  impact: {
    ko: "ISCE2 도입으로 처리 속도를 확보해 3 레이어 통합 서비스의 InSAR 분석 플랫폼이 가능해졌습니다. 광교산 시루봉 -17.30 mm/yr (GNSS 검증) + PSI 5,143,119 PS + 5m DEM TC + 사업 보고서 v1~v4를 AI native로 작성 시간이 0에 가까웠습니다. 이후 분석 대상을 광교산에서 죽전·송도로 넓히고 새만금 AOI까지 준비했으며, 송도 매립지에서는 PSI 45,081 PS로 -17.9~+16.5 mm/yr 침하를 실운영으로 검출해 대시보드에 적재했습니다. 또한 외부 플랫폼이 요구한 'XYZ 좌표 시계열'을 전달하면서, 풀 시계열 일괄 응답(81MB·13s)을 시점 스냅샷 바이너리 + 점클릭 분리로 재설계해 1.1MB·0.56s로 줄였습니다 — DB 쿼리는 73ms라 병목이 직렬화·전송임을 측정으로 진단한 뒤 페이로드 구조를 바꾼 결과입니다.",
    en: "Introducing ISCE2 unlocked the processing speed needed to make the InSAR analysis platform of the 3-layer service viable. Outputs: Mt. Sirubong −17.30 mm/yr subsidence (GNSS-verified), 5,143,119 PSI persistent scatterers, 5 m DEM TC, and program reports v1–v4 — all AI-native, with near-zero writing time. Coverage then expanded from Gwanggyo to Jukjeon and Songdo (with a Saemangeum AOI staged); on the Songdo reclaimed land, a production PSI run detected 45,081 persistent scatterers (−17.9 to +16.5 mm/yr subsidence), ingested into the dashboard. I also delivered the external platform's required 'XYZ coordinate time series': re-architecting the full-series bulk response (81 MB · 13 s) into a per-epoch snapshot binary + point-click split brought it to 1.1 MB · 0.56 s — done by first measuring that the DB query was only 73 ms, so the bottleneck was serialization and transfer, then changing the payload structure.",
  },
  keywords: [
    { ko: "Sentinel-1 SAR", en: "Sentinel-1 SAR" },
    { ko: "5종 도구 스택", en: "5-tool stack" },
    { ko: "ISCE2 속도 확보", en: "Speed via ISCE2" },
    { ko: "다중 agent 워크트리", en: "Multi-agent worktrees" },
    { ko: "5,143,119 PSI", en: "5,143,119 PSI" },
    {
      ko: "사업 보고서 자동화",
      en: "Automated program reports",
    },
    { ko: "InSAR 결과 API (FastAPI)", en: "InSAR-results API (FastAPI)" },
    { ko: "성능 81MB→1.1MB", en: "Payload 81MB→1.1MB" },
    { ko: "사전점검 엔드포인트", en: "Preflight endpoints" },
    { ko: "다중 지역 (광교·죽전·송도)", en: "Multi-region (Gwanggyo · Jukjeon · Songdo)" },
    { ko: "PSI 자기완결 (-W slc)", en: "Self-contained PSI (-W slc)" },
  ],
  trackVisibility: "both",
  honestyNote: {
    ko: "측정 대상인 지표·지각 변위는 석사 전공(지각변동·GNSS)입니다. 다만 SAR 처리 도구·파이프라인(SNAP·MintPy·StaMPS 등)은 입사 후 AI를 사고 파트너 삼아 익힌 직군 확장 영역입니다 — 도메인 판단은 연구 배경에서, 처리 구현은 AI 가속으로.",
    en: "The measured quantity — ground/crustal deformation — is my master's field (crustal deformation · GNSS). The SAR processing tools and pipelines (SNAP, MintPy, StaMPS, …), though, I picked up after joining with AI as a thinking partner — a role expansion. Domain judgment from research; processing implementation accelerated by AI.",
  },
  metrics: [
    {
      label: { ko: "PSI 검출 PS", en: "PSI persistent scatterers" },
      value: { ko: "5,143,119", en: "5,143,119" },
    },
    {
      label: {
        ko: "시루봉 침하 (GNSS 검증)",
        en: "Sirubong subsidence (GNSS-verified)",
      },
      value: { ko: "-17.30 mm/yr", en: "-17.30 mm/yr" },
    },
    {
      label: { ko: "도구 스택", en: "Tool stack" },
      value: { ko: "5종 다중", en: "5 tools, blended" },
    },
    {
      label: { ko: "응답 페이로드 최적화", en: "Payload optimization" },
      value: { ko: "81MB → 1.1MB (0.56s)", en: "81MB → 1.1MB (0.56s)" },
    },
    {
      label: { ko: "분석 지역", en: "Regions analyzed" },
      value: {
        ko: "광교·죽전·송도 (+새만금)",
        en: "Gwanggyo · Jukjeon · Songdo (+Saemangeum)",
      },
    },
  ],
  measurementPending: [
    { ko: "작업 기간 정확치", en: "Exact project duration" },
    { ko: "처리 SLC 총 개수", en: "Total SLCs processed" },
    { ko: "SBAS 페어 수", en: "SBAS pair count" },
    { ko: "송도 SBAS velocity (진행 중)", en: "Songdo SBAS velocity (in progress)" },
    {
      ko: "SNAP vs ISCE2 처리 속도 비율",
      en: "SNAP vs ISCE2 processing-speed ratio",
    },
    {
      ko: "다중 agent 시간 절감 비율",
      en: "Time saved via multi-agent operation",
    },
  ],
  images: [
    {
      src: "/projects/lumir-linux-snap/timeseries-65epoch.png",
      alt: {
        ko: "control points 시계열 (65 epoch / 2.30 yr stack)",
        en: "Control-point time series (65 epochs / 2.30-yr stack)",
      },
      caption: {
        ko: "Control points 시계열 — 65 epoch / 2.30 yr stack",
        en: "Control-point time series — 65 epochs / 2.30-yr stack",
      },
    },
    {
      src: "/projects/lumir-linux-snap/dem-5m-hillshade.png",
      alt: { ko: "5m DEM hillshade", en: "5 m DEM hillshade" },
      caption: {
        ko: "5m DEM hillshade — 국토지리정보원 DEM TC 적용",
        en: "5 m DEM hillshade — NGII DEM with terrain correction applied",
      },
    },
    {
      src: "/projects/lumir-linux-snap/dem-compare-unwrap.png",
      alt: {
        ko: "DEM 비교 — unwrap 결과",
        en: "DEM comparison — unwrap result",
      },
      caption: {
        ko: "DEM 비교 — Phase unwrap 결과",
        en: "DEM comparison — phase-unwrap result",
      },
    },
  ],
};

const sarSearchAndAnalyzerLayer: Project = {
  slug: "sar-search-and-analyzer",
  diagram: {
    caption: {
      ko: "사용자가 지도에서 지역·AOI를 골라 SAR 데이터를 검색하고 InSAR 분석을 요청하는 프론트엔드. Next.js Route Handler BFF가 Plan(mock)/Current(실제 API) 환경 분리로 데이터·운영 플랫폼과 InSAR 분석 플랫폼을 호출하고, 결과를 사용자가 다운로드합니다. 관리자는 별도 콘솔로 운영 — 3 레이어 통합의 사용자 진입점입니다.",
      en: "The user-facing frontend where a user picks a region/AOI on the map to search SAR data and request InSAR analysis. A Next.js Route-Handler BFF (Plan-mock / Current-real env split) calls the data & ops platform and the InSAR analysis platform; the user then downloads results. Admins run it from a separate console — this is the user entry point of the 3-layer service.",
    },
    nodes: [
      {
        id: "user",
        kind: "actor",
        icon: "👤",
        label: { ko: "사용자", en: "User" },
        sublabel: { ko: "지도에서 SAR 검색·분석 요청", en: "Search & request on the map" },
        col: 0,
        row: 0,
      },
      {
        id: "admin",
        kind: "actor",
        icon: "🛠",
        label: { ko: "관리자", en: "Admin" },
        sublabel: { ko: "사용자·작업 운영", en: "Ops" },
        col: 3,
        row: 0,
      },
      {
        id: "search",
        kind: "layer",
        cat: 3,
        icon: "🗺",
        label: { ko: "검색·AOI 화면", en: "Search · AOI" },
        sublabel: { ko: "지도 + AOI 폴리곤 + 카탈로그", en: "Map + AOI + catalog" },
        col: 0,
        row: 1,
      },
      {
        id: "request",
        kind: "layer",
        cat: 3,
        icon: "📡",
        label: { ko: "InSAR 요청 화면", en: "InSAR request" },
        sublabel: { ko: "분석 요청 UI", en: "Analysis request UI" },
        col: 1,
        row: 1,
      },
      {
        id: "downloads",
        kind: "layer",
        cat: 3,
        icon: "📥",
        label: { ko: "다운로드 화면", en: "Downloads" },
        sublabel: { ko: "결과 조회·다운로드", en: "Browse · download results" },
        col: 2,
        row: 1,
      },
      {
        id: "adminConsole",
        kind: "layer",
        cat: 4,
        icon: "📋",
        label: { ko: "관리자 콘솔", en: "Admin console" },
        sublabel: { ko: "사용자·작업 관리", en: "Users · jobs" },
        col: 3,
        row: 1,
      },
      {
        id: "bff",
        kind: "layer",
        cat: 2,
        icon: "🔌",
        label: { ko: "Route Handler BFF", en: "Route Handler BFF" },
        sublabel: { ko: "Next.js · Plan(mock)/Current 분리", en: "Next.js · Plan/Current split" },
        col: 1.5,
        row: 2,
      },
      {
        id: "storage",
        kind: "external",
        icon: "🗄",
        label: { ko: "데이터·운영 플랫폼", en: "Data & Ops Platform" },
        sublabel: { ko: "sar-data-retrieval · 데이터·사용자·로그·알림", en: "sar-data-retrieval · data·users·logs·alerts" },
        col: 1,
        row: 3,
      },
      {
        id: "analysis",
        kind: "external",
        icon: "⚙",
        label: { ko: "InSAR 분석 플랫폼", en: "InSAR Analysis Platform" },
        sublabel: { ko: "lumir-linux-snap · InSAR", en: "lumir-linux-snap · InSAR" },
        col: 2,
        row: 3,
      },
    ],
    edges: [
      { from: "user", to: "search", kind: "primary", animated: true, label: { ko: "① 검색·AOI", en: "① search·AOI" } },
      { from: "search", to: "bff", kind: "secondary", fromSide: "bottom", toSide: "left", label: { ko: "② 카탈로그 질의", en: "② catalog" } },
      { from: "bff", to: "storage", kind: "secondary", fromSide: "bottom", toSide: "top", label: { ko: "데이터·운영", en: "data·ops" } },
      { from: "search", to: "request", kind: "primary", fromSide: "right", toSide: "left", label: { ko: "③ 분석 요청", en: "③ request" } },
      { from: "request", to: "bff", kind: "secondary", fromSide: "bottom", toSide: "top", label: { ko: "InSAR 요청", en: "InSAR req" } },
      { from: "bff", to: "analysis", kind: "secondary", fromSide: "bottom", toSide: "top", label: { ko: "④ InSAR 분석", en: "④ InSAR" } },
      { from: "bff", to: "downloads", kind: "secondary", fromSide: "right", toSide: "bottom", label: { ko: "⑤ 결과", en: "⑤ result" } },
      { from: "downloads", to: "user", kind: "primary", dashed: true, fromSide: "top", toSide: "right", label: { ko: "다운로드", en: "download" } },
      { from: "admin", to: "adminConsole", kind: "primary", animated: true, label: { ko: "운영", en: "ops" } },
      { from: "adminConsole", to: "bff", kind: "secondary", fromSide: "bottom", toSide: "right", label: { ko: "관리 API", en: "admin API" } },
    ],
  },
  layerLabel: { ko: "프론트", en: "Frontend" },
  layerIcon: "🖥",
  title: {
    ko: "Sentinel SAR 검색·요청 프론트엔드",
    en: "Sentinel SAR search & request frontend",
  },
  subtitle: {
    ko: "지도 기반 SAR 데이터 검색·다운로드·InSAR 분석 요청",
    en: "Map-driven SAR data search · download · InSAR analysis requests",
  },
  badge: {
    ko: "4 진행 중 (직군 안 · UI 기획·구현)",
    en: "Stage 4 in progress (in-role · UI planning + build)",
  },
  problem: {
    ko: "사내에서 위성 데이터를 지도에서 검색·요청하고 InSAR 분석까지 요청하는 통합 프론트 서버가 필요했습니다. 데이터·운영 플랫폼과 InSAR 분석 플랫폼을 묶어주는 사용자 진입점입니다.",
    en: "We needed an internal frontend that lets users search satellite data on a map and request InSAR analysis in one place — the entry point that ties the data & ops platform and the InSAR analysis platform together.",
  },
  system: {
    ko: "Next.js (App Router) + Plan/Current 환경 분리 패턴 + (sar) 도메인(user·admin 페이지) + Next.js Route Handler BFF로 구성된 프론트엔드입니다. BFF가 데이터·운영 플랫폼(sar-data-retrieval)과 InSAR 분석 플랫폼을 호출해 검색·다운로드·분석 요청을 한 진입점에 묶습니다.",
    en: "A Next.js (App Router) frontend: a Plan/Current environment-split pattern, a (sar) domain (user/admin pages), and a Next.js Route-Handler BFF. The BFF calls the data & ops platform (sar-data-retrieval) and the InSAR analysis platform, tying search, download, and analysis requests into a single entry point.",
  },
  impact: {
    ko: "지도 기반 AOI 폴리곤 설정 + 카탈로그 검색 + InSAR 분석 요청까지 가능한 사용자 UI 기획·구현이 진행 중입니다. 데이터·운영 플랫폼·InSAR 분석 플랫폼과의 인터페이스 정합이 핵심 작업입니다.",
    en: "Map-based AOI polygons + catalog search + InSAR analysis requests — the user UI is being planned and built right now. The core work is keeping the interfaces with the data & ops platform and the InSAR analysis platform consistent.",
  },
  keywords: [
    { ko: "Next.js App Router", en: "Next.js App Router" },
    {
      ko: "Plan/Current 환경 분리",
      en: "Plan/Current environment split",
    },
    { ko: "지도 + AOI", en: "Map + AOI" },
    { ko: "InSAR 분석 요청", en: "InSAR analysis requests" },
    { ko: "Route Handler BFF", en: "Route Handler BFF" },
  ],
  trackVisibility: "both",
  ownContribution: {
    ko: "프론트엔드 전부 본인 단독 (UI 기획·구현·Route Handler BFF).",
    en: "The frontend, entirely solo (UI planning · implementation · Route-Handler BFF).",
  },
  honestyNote: {
    ko: "현재는 Plan(mock) 모드로 백엔드 의존 없이 단독 동작합니다. Plan/Current 환경 분리 패턴은 파트장에게서 인계받았습니다.",
    en: "Currently runs standalone in Plan (mock) mode, with no backend dependency. The Plan/Current environment-split pattern was inherited from the team lead.",
  },
  metrics: [
    {
      label: { ko: "현재 단계", en: "Current stage" },
      value: { ko: "UI 기획·구현", en: "UI planning & build" },
    },
    {
      label: { ko: "팀 구성", en: "Team" },
      value: { ko: "본인 단독", en: "Solo" },
    },
    {
      label: { ko: "AI 작성", en: "AI-written" },
      value: { ko: "AI native", en: "AI native" },
    },
  ],
  measurementPending: [
    { ko: "시작 시점·누적 시간", en: "Start date · cumulative hours" },
    {
      ko: "구현 완료 화면 수",
      en: "Screens completed",
    },
  ],
  images: [
    {
      src: "/projects/sar-search-and-analyzer/search.png",
      alt: {
        ko: "SAR 데이터 검색 UI — 지도 + AOI + 카탈로그",
        en: "SAR data search UI — map + AOI + catalog",
      },
      caption: {
        ko: "검색 화면 — 한국 지도 + AOI 폴리곤 + 페이로드·위성 필터 + 카탈로그(Hwaseong·Pohang·Ulsan·Seoul)",
        en: "Search screen — Korea map + AOI polygon + payload/satellite filters + catalog (Hwaseong · Pohang · Ulsan · Seoul)",
      },
    },
    {
      src: "/projects/sar-search-and-analyzer/aoi.png",
      alt: { ko: "AOI 영역 설정 UI", en: "AOI selection UI" },
      caption: {
        ko: "AOI 설정 화면 — 두 polygon overlap + 영역 설정 패널",
        en: "AOI setup — two overlapping polygons + the AOI configuration panel",
      },
    },
  ],
  videos: [
    {
      src: "/projects/sar-search-and-analyzer/tour.mp4",
      poster: "/projects/sar-search-and-analyzer/tour-poster.png",
      gif: "/projects/sar-search-and-analyzer/tour.gif",
      alt: {
        ko: "sar-search-and-analyzer 사용자/관리자 콘솔 투어 — 검색 · AOI · InSAR · 다운로드 · 관리자 대시보드",
        en: "sar-search-and-analyzer user / admin console tour — search · AOI · InSAR · downloads · admin dashboard",
      },
      caption: {
        ko: "Playwright e2e 녹화 (Plan mock 모드, 백엔드 의존 없음) — 사용자 검색 → AOI 관리 → InSAR 분석 요청 → 다운로드 → 관리자 대시보드 다섯 화면 자동 투어.",
        en: "Recorded with Playwright e2e (Plan mock mode, no backend dependency) — auto-tour through five screens: user search → AOI manager → InSAR request → downloads → admin dashboard.",
      },
    },
  ],
};

// 통합 박스 — sub-projects 3개를 묶는 wrapper
const lumirSarPlatform: Project = {
  slug: "lumir-sar-platform",
  cardImage: {
    src: "/projects/sar-search-and-analyzer/aoi.png",
    alt: {
      ko: "SAR 검색·분석 프론트 — 지도에서 AOI 지정",
      en: "SAR search & analysis frontend — AOI selection on the map",
    },
  },
  title: {
    ko: "루미르 SAR 데이터 플랫폼",
    en: "Lumir SAR Data Platform",
  },
  subtitle: {
    ko: "Sentinel + LumirX 검색·저장·분석·요청 통합 — 사내 위성 데이터 풀스택 서비스 (3 레이어)",
    en: "Unified search, storage, analysis, and request for Sentinel + LumirX — an internal satellite-data full-stack service (3 layers)",
  },
  badge: {
    ko: "3+4 통합 (3 레이어 풀스택)",
    en: "Stage 3+4 integrated (3-layer full-stack)",
  },
  problem: {
    ko: "Sentinel과 LumirX 위성 데이터를 사내에서 검색·저장·분석·요청까지 한 사이클로 처리할 통합 서비스가 부재했습니다. 데이터 저장(NAS+CDSE), InSAR 분석(SNAP·ISCE2·MintPy), 사용자 진입 프론트엔드가 각각 분리되어 있어 사용자가 위치 요청만으로 분석 결과까지 받기 어려운 구조였습니다.",
    en: "There was no integrated service to take Sentinel and LumirX data from search through storage, analysis, and request in one cycle. Storage (NAS + CDSE), InSAR analysis (SNAP · ISCE2 · MintPy), and the user-facing frontend were all separate — making it hard for a user to get from 'I want this location' to a finished result.",
  },
  system: {
    ko: "3 레이어 통합 서비스를 본인이 단독으로 설계·구축하고 있습니다. **데이터·운영 플랫폼**(sar-data-retrieval, NestJS 모노레포 + CDSE + NAS PoC + DDD 5-layer) + **InSAR 분석 플랫폼**(lumir-linux-snap, 5종 도구 다중 스택 + 다중 agent 워크트리) + **프론트 레이어**(sar-search-and-analyzer, Next.js + 지도 + AOI + 분석 요청 UI). 모두 AI native 100%로 진행합니다.",
    en: "I'm solo-designing and building the 3-layer integrated service. **Data & Ops Platform** (sar-data-retrieval, NestJS monorepo + CDSE + NAS PoC + DDD 5-layer) + **InSAR Analysis Platform** (lumir-linux-snap, 5-tool stack + multi-agent worktrees) + **Frontend layer** (sar-search-and-analyzer, Next.js + map + AOI + analysis-request UI). All three are 100% AI-native.",
  },
  impact: {
    ko: "ISCE2 도입으로 분석 처리 속도를 확보해 *날씨·계절 무관 지표 변위 데이터 서비스화*가 가능한 단계에 진입했습니다. 사용자가 지도에서 위치를 요청하면 저장된 분석 데이터를 즉시 제공하거나, 없으면 신규 처리 후 제공하는 흐름을 한 사람이 풀스택으로 묶고 있다는 점이 핵심입니다.",
    en: "With ISCE2 in place, the InSAR analysis platform is fast enough that *weather- and season-independent surface-displacement data as a service* is now feasible. The key point: a user picking a location on the map gets either the stored result instantly, or a freshly-processed one — and the whole pipeline is full-stack-owned by a single person.",
  },
  keywords: [
    { ko: "3 레이어 풀스택", en: "3-layer full-stack" },
    { ko: "Sentinel-1 + LumirX", en: "Sentinel-1 + LumirX" },
    { ko: "NestJS + Next.js", en: "NestJS + Next.js" },
    { ko: "ISCE2 속도 확보", en: "Speed via ISCE2" },
    { ko: "다중 agent 워크트리", en: "Multi-agent worktrees" },
    { ko: "지도 + AOI", en: "Map + AOI" },
    { ko: "AI native 100%", en: "100% AI native" },
  ],
  trackVisibility: "both",
  relatedStudies: ["sar"],
  ownContribution: {
    ko: "3 레이어 모든 코드 단독 (sar-data-retrieval 5개 영역 전부, lumir-linux-snap 도구 평가·운영, sar-search-and-analyzer 프론트엔드 전부). 통합 비전 설계 본인.",
    en: "All three layers, solo (sar-data-retrieval's 5 areas in full · lumir-linux-snap tool selection & operation · sar-search-and-analyzer's frontend in full). The integrated vision is also mine.",
  },
  honestyNote: {
    ko: "각 레이어의 일부 패턴은 외부 인계입니다 — Plan/Current 환경 분리(파트장)·일부 SAR 도메인 지식(AI 사고 파트너 도움).",
    en: "Some patterns in each layer came from elsewhere — the Plan/Current environment split (from the team lead) and parts of the SAR domain knowledge (AI as a thinking partner).",
  },
  metrics: [
    {
      label: { ko: "통합 레이어", en: "Integrated layers" },
      value: {
        ko: "3 (데이터·운영·분석·프론트)",
        en: "3 (data & ops · analysis · frontend)",
      },
    },
    {
      label: { ko: "PSI 검출", en: "PSI detections" },
      value: { ko: "5,143,119", en: "5,143,119" },
    },
    {
      label: { ko: "검증된 침하", en: "Verified subsidence" },
      value: {
        ko: "-17.30 mm/yr (GNSS)",
        en: "-17.30 mm/yr (GNSS-verified)",
      },
    },
    {
      label: { ko: "AI 작성 코드", en: "AI-written code" },
      value: {
        ko: "100% (AI native)",
        en: "100% (AI native)",
      },
    },
  ],
  measurementPending: [
    {
      ko: "통합 완성 시점 (분석→데이터·운영→프론트 end-to-end)",
      en: "End-to-end completion date (analysis → data & ops → frontend)",
    },
    { ko: "사내 사용자 수", en: "Internal user count" },
    {
      ko: "지원 위성 수 (현재 Sentinel-1 + LumirX 예정)",
      en: "Number of satellites supported (currently Sentinel-1 + LumirX planned)",
    },
  ],
  qa: [
    {
      q: {
        ko: "3 레이어가 어떻게 한 서비스로 통합되나요?",
        en: "How do the three layers come together as one service?",
      },
      a: {
        ko: "사용자가 sar-search-and-analyzer 지도에서 위치를 요청하면, sar-data-retrieval이 기존 분석 데이터를 조회하거나 lumir-linux-snap에 신규 분석을 요청합니다. 분석 결과는 다시 sar-data-retrieval에 저장되어 다음 요청 시 즉시 응답할 수 있습니다.",
        en: "When a user picks a location on sar-search-and-analyzer's map, sar-data-retrieval either returns existing analysis data, or asks lumir-linux-snap for a fresh analysis. New results are written back into sar-data-retrieval so the next identical request is served instantly.",
      },
    },
    {
      q: {
        ko: "한 사람이 3 레이어를 동시 운영할 수 있는 이유는?",
        en: "How is one person able to run all three layers at once?",
      },
      a: {
        ko: "AI native 100% — 코드 작성은 AI, 본인은 UI 기획·코드 검토·통합 인터페이스 정합을 담당합니다.",
        en: "100% AI-native — AI writes the code; I plan the UI, review the code, and keep the integration interfaces consistent.",
      },
    },
    {
      q: {
        ko: "각 레이어의 본인 기여와 외부 인계 영역은?",
        en: "What's your contribution vs. inherited scope in each layer?",
      },
      a: {
        ko: "저장(sar-data-retrieval): 5개 영역 전부 본인. 분석(lumir-linux-snap): 측정 대상(지표·지각 변위)은 석사 전공이고, SAR 처리 도구는 AI 사고 파트너로 익혀 가속. 프론트(sar-search-and-analyzer): 프론트엔드 전부 본인, Plan/Current 패턴은 파트장 인계.",
        en: "Storage (sar-data-retrieval): all 5 areas mine. Analysis (lumir-linux-snap): the measured quantity (ground/crustal deformation) is my master's field; the SAR processing tools I learned with AI as a thinking partner. Frontend (sar-search-and-analyzer): the frontend all mine; the Plan/Current pattern came from the team lead.",
      },
    },
    {
      q: {
        ko: "외부 노출이 있나요?",
        en: "Is any of this exposed externally?",
      },
      a: {
        ko: "현재 사내 운영. 향후 사업 보고서 v1~v4 + policy briefing PDF 같은 자료가 외부 발주처 대상으로 활용될 수 있습니다.",
        en: "Currently internal-only. The program reports v1–v4 and policy-briefing PDFs may later be used with external program owners.",
      },
    },
  ],
  diagram: {
    caption: {
      ko: "사용자 요청이 프론트 → 데이터·운영 플랫폼(NestJS) → InSAR 분석 플랫폼(FastAPI)을 좌→우로 거치고, InSAR 결과가 데이터·운영 플랫폼으로 되돌아와 사용자에게 응답되는 흐름. 데이터·운영 플랫폼(NestJS)은 InSAR 분석 플랫폼(FastAPI)에서 InSAR 데이터를 API로 받아와 저장·중계합니다. 실선(주황)=정방향 요청, 점선=응답·데이터 환류. 한 사람이 3 레이어를 풀스택으로 묶고 있습니다.",
      en: "A user request flows left→right through frontend → data & ops platform (NestJS) → InSAR analysis platform (FastAPI); the InSAR results return to the data & ops platform to answer the user. The data & ops platform (NestJS) fetches InSAR data from the InSAR analysis platform (FastAPI) over an API, then stores and relays it. Solid (amber) = forward request, dashed = response / data feedback. One person owns all three layers full-stack.",
    },
    nodes: [
      {
        id: "user",
        kind: "actor",
        icon: "👤",
        label: { ko: "사용자", en: "User" },
        sublabel: {
          ko: "지도에서 위치·AOI 요청",
          en: "Picks a location / AOI on the map",
        },
        col: 1,
        row: 0,
      },
      {
        id: "front",
        kind: "layer",
        cat: 3,
        icon: "🖥",
        label: { ko: "프론트 레이어", en: "Frontend layer" },
        sublabel: {
          ko: "sar-search-and-analyzer · Next.js · 지도+AOI",
          en: "sar-search-and-analyzer · Next.js · map + AOI",
        },
        col: 1,
        row: 1,
      },
      {
        id: "store",
        kind: "layer",
        cat: 2,
        icon: "🗄",
        label: { ko: "데이터·운영 플랫폼", en: "Data & Ops Platform" },
        sublabel: {
          ko: "sar-data-retrieval · NestJS · DDD 5-layer",
          en: "sar-data-retrieval · NestJS · DDD 5-layer",
        },
        col: 1,
        row: 2,
      },
      {
        id: "analyze",
        kind: "layer",
        cat: 6,
        icon: "⚙",
        label: { ko: "InSAR 분석 플랫폼", en: "InSAR Analysis Platform" },
        sublabel: {
          ko: "lumir-linux-snap · SNAP·ISCE2·MintPy",
          en: "lumir-linux-snap · SNAP · ISCE2 · MintPy",
        },
        col: 1,
        row: 3,
      },
      {
        id: "cdse",
        kind: "external",
        icon: "🛰",
        label: { ko: "CDSE", en: "CDSE" },
        sublabel: {
          ko: "Sentinel-1 SLC 외부 API",
          en: "Sentinel-1 SLC external API",
        },
        col: 0,
        row: 1,
      },
      {
        id: "nas",
        kind: "external",
        icon: "💾",
        label: { ko: "NAS", en: "NAS" },
        sublabel: { ko: "SLC 원본 저장 (SMB2)", en: "Raw SLC store (SMB2)" },
        col: 0,
        row: 2,
      },
      {
        id: "platform",
        kind: "external",
        icon: "🌐",
        label: { ko: "외부 3D 플랫폼", en: "External 3D platform" },
        sublabel: {
          ko: "FastAPI XYZ 시계열 (81MB→1.1MB)",
          en: "FastAPI XYZ time series (81MB→1.1MB)",
        },
        col: 2,
        row: 3,
      },
    ],
    edges: [
      { from: "user", to: "front", kind: "primary", animated: true, label: { ko: "① 위치 요청", en: "① location request" } },
      { from: "front", to: "store", kind: "primary", label: { ko: "② 검색 질의", en: "② search query" } },
      { from: "store", to: "analyze", kind: "primary", dashed: true, label: { ko: "③ 신규 분석 (cache miss)", en: "③ new analysis (cache miss)" } },
      { from: "analyze", to: "store", kind: "secondary", fromSide: "right", toSide: "right", label: { ko: "④ 결과 저장", en: "④ write-back" } },
      { from: "store", to: "front", kind: "secondary", fromSide: "right", toSide: "right", label: { ko: "⑤ 응답", en: "⑤ response" } },
      { from: "cdse", to: "store", kind: "secondary", fromSide: "right", toSide: "left", label: { ko: "SAR 데이터", en: "SAR data" } },
      { from: "nas", to: "store", kind: "secondary", dashed: true, fromSide: "right", toSide: "left", label: { ko: "SLC I/O", en: "SLC I/O" } },
      { from: "analyze", to: "platform", kind: "secondary", fromSide: "right", toSide: "left", label: { ko: "XYZ 시계열", en: "XYZ time series" } },
    ],
  },
  subProjects: [
    sarDataRetrievalLayer,
    lumirLinuxSnapLayer,
    sarSearchAndAnalyzerLayer,
  ],
  images: [
    {
      src: "/projects/sar-search-and-analyzer/search.png",
      alt: {
        ko: "SAR 검색 UI (프론트 레이어)",
        en: "SAR search UI (frontend layer)",
      },
      caption: {
        ko: "프론트 레이어 — 지도 기반 SAR 검색 + AOI + 카탈로그",
        en: "Frontend layer — map-based SAR search + AOI + catalog",
      },
    },
    {
      src: "/projects/lumir-linux-snap/timeseries-65epoch.png",
      alt: {
        ko: "InSAR 시계열 (InSAR 분석 플랫폼)",
        en: "InSAR time series (InSAR analysis platform)",
      },
      caption: {
        ko: "InSAR 분석 플랫폼 — Control points 시계열 (65 epoch / 2.30 yr stack)",
        en: "Analysis platform — control-point time series (65 epochs / 2.30-yr stack)",
      },
    },
  ],
};

export const projects: Project[] = [
  lumirSarPlatform,
  {
    slug: "sdpe",
    cardImage: {
      src: "/projects/sdpe/dashboard.png",
      alt: {
        ko: "SDPE 운영 콘솔 — L0→L3 DAG 파이프라인 대시보드",
        en: "SDPE operator console — L0→L3 DAG pipeline dashboard",
      },
    },
    diagram: {
      caption: {
        ko: "운영자가 콘솔(React Flow 캔버스)에서 처리 DAG를 구성·배포하면, Pipeline Workflow 서브시스템의 오케스트레이터(CSC-08)가 컨트롤 타워로서 pgmq로 단계별 작업을 할당(SI-04)하고 완료(SI-03)를 추적해 L0→L3를 진행시킵니다. DAG 자체는 이벤트를 듣지 않고 '어떤 조건에 어떤 파이프라인'이라는 배포 규칙만 정의합니다(파이프라인 = 코드 아닌 데이터). 9개 CSC가 수집(DCS)·신호처리(SPS)·후처리(PPS)·서비스(DSS)에 매핑되고, 파일은 NAS·큐엔 경로/메타만 흐릅니다. 산출물은 PostGIS STAC 카탈로그에 등록되고 데이터 서비스(CSC-09)가 REST·OGC·STAC로 서빙합니다. 새 위성은 DAG+프로파일 등록만으로 확장(코드 변경 최소). teal = 제어(pgmq) / amber = 데이터.",
        en: "From the console (a React Flow canvas) an operator composes and deploys a processing DAG; the Pipeline Workflow subsystem's orchestrator (CSC-08) acts as a control tower, assigning per-stage jobs over pgmq (SI-04) and tracking completion (SI-03) to advance L0→L3. The DAG itself does not listen to events — it only defines deployment rules ('which condition → which pipeline'; a pipeline is data, not code). Nine CSCs map onto collection (DCS), signal processing (SPS), post-processing (PPS) and service (DSS); files stay on NAS while queues carry only paths/metadata. Products are registered into a PostGIS STAC catalog and the Data Service (CSC-09) serves them over REST·OGC·STAC. A new satellite is added by registering a DAG + profile (near-zero code change). Teal = control (pgmq) / amber = data.",
      },
      // 정확 모델 (SDPE 위키 · SAD/ICD v1.2): Pipeline Workflow 는 컨테이너가 아니라 CSC-08
      // 오케스트레이터(컨트롤 타워) 그 자체다. 콘솔(DAG 빌더)이 배포한 DAG를 받아 pgmq로
      // 단계별 작업을 할당(SI-04)하고 완료(SI-03)를 추적해 L0→L3를 구동한다. 9개 CSC는
      // 수집(DCS)·신호처리(SPS)·후처리(PPS)·서비스(DSS)에 매핑. teal=제어 / amber=데이터.
      nodes: [
        {
          id: "console",
          variant: "dagBuilder",
          kind: "layer",
          cat: 2,
          icon: "🖥",
          label: { ko: "운영 콘솔", en: "Operator console" },
          sublabel: { ko: "Next.js · React Flow DAG 빌더", en: "Next.js · React Flow DAG builder" },
          col: 1.5,
          row: 0,
        },
        {
          id: "orchestrator",
          kind: "layer",
          cat: 2,
          icon: "🗼",
          label: { ko: "Pipeline Workflow", en: "Pipeline Workflow" },
          sublabel: { ko: "CSC-08 오케스트레이터 · 컨트롤 타워", en: "CSC-08 orchestrator · control tower" },
          col: 1.5,
          row: 1,
        },
        {
          id: "collection",
          kind: "layer",
          cat: 3,
          icon: "📡",
          label: { ko: "수집 · DCS", en: "Collection · DCS" },
          sublabel: { ko: "CSC-02 · 원시 수신", en: "CSC-02 · raw reception" },
          col: 0,
          row: 2,
        },
        {
          id: "sigproc",
          kind: "layer",
          cat: 6,
          icon: "📶",
          label: { ko: "신호처리 · SPS", en: "Signal proc · SPS" },
          sublabel: { ko: "CSC-03·04 · L0 → L1", en: "CSC-03·04 · L0 → L1" },
          col: 1,
          row: 2,
        },
        {
          id: "postproc",
          kind: "layer",
          cat: 4,
          icon: "🛠",
          label: { ko: "후처리 · PPS", en: "Post-proc · PPS" },
          sublabel: { ko: "CSC-05·06·07 · L2·L3·등록", en: "CSC-05·06·07 · L2·L3·register" },
          col: 2,
          row: 2,
        },
        {
          id: "catalog",
          kind: "external",
          icon: "🐘",
          label: { ko: "PostgreSQL · PostGIS", en: "PostgreSQL · PostGIS" },
          sublabel: { ko: "STAC 카탈로그 · @sdpe/database", en: "STAC catalog · @sdpe/database" },
          col: 2,
          row: 3,
        },
        {
          id: "service",
          kind: "layer",
          cat: 5,
          icon: "🌐",
          label: { ko: "데이터 서비스 · DSS", en: "Data service · DSS" },
          sublabel: { ko: "CSC-09 · REST·OGC·STAC", en: "CSC-09 · REST·OGC·STAC" },
          col: 3,
          row: 3,
        },
        {
          id: "cscChain",
          variant: "cscChain",
          icon: "🧩",
          label: { ko: "CSC 1~9 컴포넌트", en: "CSC 1–9 components" },
          col: 0,
          row: 4,
          chain: [
            { id: "CSC-01", role: { ko: "공통", en: "Common" } },
            { id: "CSC-02", role: { ko: "수집", en: "Collect" }, cat: 3 },
            { id: "CSC-03", role: { ko: "L0", en: "L0" }, cat: 6 },
            { id: "CSC-04", role: { ko: "L1", en: "L1" }, cat: 6 },
            { id: "CSC-05", role: { ko: "L2", en: "L2" }, cat: 4 },
            { id: "CSC-06", role: { ko: "L3", en: "L3" }, cat: 4 },
            { id: "CSC-07", role: { ko: "등록", en: "Catalog" }, cat: 4 },
            { id: "CSC-08", role: { ko: "오케스트레이터", en: "Orchestrator" }, cat: 2 },
            { id: "CSC-09", role: { ko: "Data API", en: "Data API" }, cat: 5 },
          ],
        },
      ],
      edges: [
        { from: "console", to: "orchestrator", kind: "control", animated: true, fromSide: "bottom", toSide: "top", label: { ko: "① DAG 배포", en: "① deploy DAG" } },
        // 정확 모델: 콘솔이 DAG를 *배포*하면 CSC-08 오케스트레이터가 깨어나(SI-01 수신)
        // 단계별 작업을 할당(SI-04)하고 완료(SI-03)를 추적한다 — 브로드캐스트 버스가 아닌 허브.
        { from: "collection", to: "orchestrator", kind: "control", fromSide: "top", toSide: "left", label: { ko: "수신 (SI-01)", en: "reception (SI-01)" } },
        { from: "orchestrator", to: "sigproc", kind: "control", fromSide: "bottom", toSide: "top", label: { ko: "작업 할당 (SI-04)", en: "assign (SI-04)" } },
        { from: "postproc", to: "orchestrator", kind: "control", dashed: true, fromSide: "top", toSide: "right", label: { ko: "완료 (SI-03)", en: "done (SI-03)" } },
        { from: "collection", to: "sigproc", kind: "primary", fromSide: "right", toSide: "left", label: { ko: "원시 (NAS)", en: "raw (NAS)" } },
        { from: "sigproc", to: "postproc", kind: "primary", fromSide: "right", toSide: "left", label: { ko: "L1·L2", en: "L1·L2" } },
        { from: "postproc", to: "catalog", kind: "primary", fromSide: "bottom", toSide: "top", label: { ko: "등록·적재", en: "register" } },
        { from: "catalog", to: "service", kind: "primary", fromSide: "right", toSide: "left", label: { ko: "조회·서빙", en: "serve" } },
      ],
    },
    title: {
      ko: "SDPE — SAR 처리 파이프라인 오케스트레이션",
      en: "SDPE — SAR processing pipeline orchestration",
    },
    subtitle: {
      ko: "루미르 LumirX 위성 데이터 다단계 파이프라인 · NestJS 5 서브시스템 + DAG",
      en: "Lumir LumirX multi-stage SAR pipeline · NestJS with 5 subsystems + DAG",
    },
    badge: { ko: "3+4 혼합", en: "Stage 3+4 blend" },
    metrics: [
      {
        label: { ko: "처리 레벨", en: "Processing levels" },
        value: { ko: "L0 → L3", en: "L0 → L3" },
      },
      {
        label: { ko: "인터페이스 체인", en: "Interface chain" },
        value: { ko: "CSC 1~9", en: "CSC 1–9" },
      },
      {
        label: { ko: "GitLab CI/CD", en: "GitLab CI/CD" },
        value: { ko: "0→구축", en: "From scratch" },
      },
      {
        label: { ko: "NestJS 서브시스템", en: "NestJS subsystems" },
        value: { ko: "5개", en: "5" },
      },
    ],
    problem: {
      ko: "LumirX 위성 원시 SAR 데이터(L0~L3) 다단계 파이프라인을 운영자가 구성·실행·추적·복구할 시스템이 부재했고, 새 위성·새 알고리즘 추가 시 코드 변경 최소화가 필요했습니다. 본인 입장에서 파이프라인 도메인은 백지 상태로 투입됐습니다.",
      en: "There was no system letting an operator configure, run, trace, and recover the L0–L3 LumirX raw-SAR pipeline, and adding new satellites or algorithms needed to cost as little code change as possible. From my side, I was dropped into the pipeline domain blank-slate.",
    },
    system: {
      ko: "인계받은 NestJS 5 서브시스템 모노레포 위에서 DAG 기획 UI 설계·구현 (Figma 없이 UI 코드 + Playwright e2e가 곧 기획 문서)을 진행했습니다. GitLab CI/CD 0에서 구축 + interfaces/csc-8 세부 설계 + ICD/SAD 80~100p docx 그대로 AI 학습 + 작은 단위 위배 검토 반복 + 운영 콘솔 작업 종료 자동 재배포 훅을 박았습니다.",
      en: "On top of an inherited NestJS 5-subsystem monorepo, I designed and built the DAG planning UI (no Figma — the UI code plus Playwright e2e *is* the planning document). Built the GitLab CI/CD from zero, did the detailed design for interfaces/csc-8, fed the 80–100-page ICD/SAD docx directly into AI, ran a tight loop of small 'does this break the rule?' reviews, and wired up an auto-redeploy hook that fires when ops-console work completes.",
    },
    impact: {
      ko: "백지 상태 직군 확장에도 불구하고 사수 인계 기본 설계 위에서 상세 설계·구현을 끌어냈습니다. 아키텍처가 확장 가능한 구조로 안정화되어 Sentinel 확장 + Snappy 알고리즘 DAG 처리 등이 시간 소요 없이 확장 가능합니다.",
      en: "Despite entering blank-slate, I produced detailed design and implementation on top of my senior's base. The architecture has settled into a shape where adding Sentinel support or a Snappy-based DAG step takes near-zero time.",
    },
    keywords: [
      { ko: "NestJS 5 서브시스템", en: "NestJS · 5 subsystems" },
      { ko: "DAG 파이프라인", en: "DAG pipeline" },
      { ko: "pgmq", en: "pgmq" },
      { ko: "GitLab CI/CD", en: "GitLab CI/CD" },
      {
        ko: "ICD/SAD 일관성 메커니즘",
        en: "ICD/SAD consistency mechanism",
      },
      {
        ko: "Next.js 자동 재배포",
        en: "Next.js auto-redeploy",
      },
    ],
    trackVisibility: "both",
    relatedStudies: ["sar"],
    areas: [
      {
        icon: "🎨",
        label: { ko: "기획·UI", en: "Planning · UI" },
        description: {
          ko: "DAG 파이프라인 UI (Figma 없이 UI 코드 + Playwright e2e가 곧 기획)",
          en: "DAG pipeline UI (no Figma — UI code + Playwright e2e is the planning doc)",
        },
      },
      {
        icon: "⚙",
        label: { ko: "CI/CD", en: "CI/CD" },
        description: {
          ko: "GitLab CI/CD 0에서 구축 (서버 설치 + 커스텀 메일 + runner)",
          en: "GitLab CI/CD from zero (server setup + custom mail + runners)",
        },
      },
      {
        icon: "🔌",
        label: { ko: "인터페이스", en: "Interfaces" },
        description: {
          ko: "interfaces/csc-8 세부 설계 (csc-7/9 후속 예정)",
          en: "Detailed design for interfaces/csc-8 (csc-7/9 to follow)",
        },
      },
      {
        icon: "📋",
        label: { ko: "메타·일관성", en: "Meta · consistency" },
        description: {
          ko: "ICD/SAD docx 학습 + md 체크리스트 위배 검토 반복",
          en: "ICD/SAD docx ingestion + repeated checklist-violation reviews via markdown",
        },
      },
    ],
    ownContribution: {
      ko: "DAG 파이프라인 기획 UI 설계·구현 + GitLab CI/CD 0에서 구축 + interfaces/csc-8 세부 설계 (csc-7/9 후속 예정)",
      en: "Designed and built the DAG-pipeline planning UI; built the GitLab CI/CD from zero; produced the detailed design for interfaces/csc-8 (csc-7/9 to follow).",
    },
    inheritedScope: {
      ko: "apps 폴더 구조 + natives/csc03·csc04 + pgmq + ICD/SAD (사수가 마무리한 기본 설계)",
      en: "Apps folder structure + natives/csc03 · csc04 + pgmq + ICD/SAD (base design finished by my senior).",
    },
    honestyNote: {
      ko: "pgmq·기술 스택 결정은 인계받은 기본 설계입니다. ICD/SAD는 읽고 이해해서 상세 설계로 추출했습니다. 사수는 힌트만 줬지만, 기본 설계가 잘 잡혀있어 수월했음도 함께 인정합니다.",
      en: "pgmq and the tech-stack decisions came from the inherited base design. I read the ICD/SAD myself and extracted the detailed design from them. My senior only dropped hints — but the base design was solid enough that the work went smoothly, which I should acknowledge too.",
    },
    qa: [
      {
        q: {
          ko: "본인이 한 일과 인계받은 일을 어떻게 구분하나?",
          en: "How do you separate what you did from what you inherited?",
        },
        a: {
          ko: "인계: apps 구조·natives/csc03·csc04·pgmq·ICD·SAD. 본인: DAG UI 기획·GitLab CI/CD·interfaces/csc-8 세부.",
          en: "Inherited: apps structure · natives/csc03 · csc04 · pgmq · ICD · SAD. Mine: DAG UI planning · GitLab CI/CD · interfaces/csc-8 detail.",
        },
      },
      {
        q: {
          ko: "도메인 지식 학습은 어떻게?",
          en: "How did you learn the domain knowledge?",
        },
        a: {
          ko: "AI 기반 + DAG UI 설계와 병렬로 학습했습니다. 모르는 내용은 도식화·이미지 요청으로 보완했고, ICD/SAD docx 직접 학습 + 작은 위배 검토를 반복했습니다.",
          en: "AI-first, in parallel with DAG UI design. Whatever I didn't know I asked AI to diagram or visualize; I fed the ICD/SAD docx in directly and ran repeated 'small-violation' reviews.",
        },
      },
      {
        q: {
          ko: "확장성이 어떻게 보장되나요?",
          en: "How is extensibility guaranteed?",
        },
        a: {
          ko: "기획 → DAG 매핑 → 처리 프로파일의 3단 구조입니다. 새 위성·새 알고리즘이 와도 코드 변경이 거의 없습니다.",
          en: "A 3-step structure: planning → DAG mapping → processing profile. A new satellite or algorithm costs almost no code change.",
        },
      },
    ],
    videos: [
      {
        src: "/projects/sdpe/tour.mp4",
        poster: "/projects/sdpe/tour-poster.png",
        gif: "/projects/sdpe/tour.gif",
        alt: {
          ko: "SDPE 운영 콘솔 투어 — Plan dashboard → Deployed → Data Catalog → Jobs → DAG Console",
          en: "SDPE operator console tour — Plan dashboard → Deployed → Data Catalog → Jobs → DAG Console",
        },
        caption: {
          ko: "Playwright e2e 녹화 — Plan 모드 (mock 데이터) 콘솔 다섯 화면 자동 투어. 위성 모달 우회 → Deployed 룰 → Data Catalog → Jobs → DAG Console 흐름.",
          en: "Recorded with Playwright e2e — auto-tour through five console screens in Plan mode (mock data). Satellite-modal bypass → Deployed rules → Data Catalog → Jobs → DAG Console.",
        },
      },
    ],
  },
  {
    slug: "him",
    cardImages: [
      {
        src: "/projects/him/home.png",
        alt: {
          ko: "집비치기 모바일 앱 홈 — 위치별 재고 + 통계",
          en: "him mobile app home — stock by location + stats",
        },
      },
      {
        src: "/projects/him/m-history.png",
        alt: {
          ko: "집비치기 재고 이력 — 입고·소비·폐기 타임라인",
          en: "him inventory history — stock-in / use / disposal timeline",
        },
      },
    ],
    diagram: {
      caption: {
        ko: "AI native 100% 풀스택 사이드 — NestJS CQRS 도메인 모듈 23개·페이지 다수. 핵심 재고 흐름을 페이지 단위로 봅니다: 대시보드·구매·이력·가전 페이지 → 각 CQRS 도메인 모듈 → PostgreSQL. 유통기한 임박은 알림 모듈이 FCM 푸시로 전달. (회계·자산·관리자 등 별도 도메인은 생략)",
        en: "100% AI-native full-stack side project — 23 NestJS CQRS domain modules and many pages. Viewed at the page level: the Dashboard · Purchases · History · Appliances pages each call their CQRS domain module, which persists to PostgreSQL. Expiring items flow through the alert module to an FCM push. (Ledger / asset / admin domains omitted.)",
      },
      nodes: [
        {
          id: "user",
          kind: "actor",
          icon: "📱",
          label: { ko: "사용자", en: "User" },
          sublabel: { ko: "재고 관리 (모바일)", en: "Inventory (mobile)" },
          col: 1.5,
          row: 0,
        },
        {
          id: "dashboard",
          kind: "layer",
          cat: 3,
          icon: "📊",
          label: { ko: "대시보드", en: "Dashboard" },
          sublabel: { ko: "재고·룸 한눈에", en: "Stock by room" },
          col: 0,
          row: 1,
        },
        {
          id: "purchases",
          kind: "layer",
          cat: 3,
          icon: "🛒",
          label: { ko: "구매", en: "Purchases" },
          sublabel: { ko: "구매·로트 기록", en: "Purchases · lots" },
          col: 1,
          row: 1,
        },
        {
          id: "history",
          kind: "layer",
          cat: 3,
          icon: "📜",
          label: { ko: "재고 이력", en: "Inventory history" },
          sublabel: { ko: "소비·폐기 타임라인", en: "Use · disposal" },
          col: 2,
          row: 1,
        },
        {
          id: "appliances",
          kind: "layer",
          cat: 3,
          icon: "🔌",
          label: { ko: "가전", en: "Appliances" },
          sublabel: { ko: "가전 카탈로그", en: "Appliance catalog" },
          col: 3,
          row: 1,
        },
        {
          id: "inventory",
          kind: "layer",
          cat: 2,
          icon: "📦",
          label: { ko: "inventory-item", en: "inventory-item" },
          sublabel: { ko: "CQRS 모듈", en: "CQRS module" },
          col: 0,
          row: 2,
        },
        {
          id: "purchase",
          kind: "layer",
          cat: 2,
          icon: "🧾",
          label: { ko: "purchase", en: "purchase" },
          sublabel: { ko: "CQRS · 로트", en: "CQRS · lots" },
          col: 1,
          row: 2,
        },
        {
          id: "log",
          kind: "layer",
          cat: 2,
          icon: "🗒",
          label: { ko: "inventory-log", en: "inventory-log" },
          sublabel: { ko: "소비·폐기 로그", en: "Use / disposal log" },
          col: 2,
          row: 2,
        },
        {
          id: "appliance",
          kind: "layer",
          cat: 2,
          icon: "⚙",
          label: { ko: "appliance", en: "appliance" },
          sublabel: { ko: "CQRS 모듈", en: "CQRS module" },
          col: 3,
          row: 2,
        },
        {
          id: "notify",
          kind: "layer",
          cat: 6,
          icon: "🔔",
          label: { ko: "유통기한 알림", en: "Expiry alerts" },
          sublabel: { ko: "alert-rule → FCM push", en: "alert-rule → FCM push" },
          col: 0,
          row: 3,
        },
        {
          id: "db",
          kind: "external",
          icon: "🐘",
          label: { ko: "PostgreSQL", en: "PostgreSQL" },
          sublabel: { ko: "도메인 데이터", en: "Domain data" },
          col: 1.5,
          row: 3,
        },
      ],
      edges: [
        { from: "user", to: "dashboard", kind: "primary" },
        { from: "user", to: "purchases", kind: "primary" },
        { from: "user", to: "history", kind: "primary" },
        { from: "user", to: "appliances", kind: "primary" },
        { from: "dashboard", to: "inventory", kind: "primary", label: { ko: "재고 조회", en: "read stock" } },
        { from: "purchases", to: "purchase", kind: "primary", label: { ko: "구매 기록", en: "record" } },
        { from: "history", to: "log", kind: "primary", label: { ko: "이력", en: "history" } },
        { from: "appliances", to: "appliance", kind: "primary", label: { ko: "가전", en: "appliances" } },
        { from: "inventory", to: "db", kind: "secondary", fromSide: "right", toSide: "left" },
        { from: "purchase", to: "db", kind: "secondary" },
        { from: "log", to: "db", kind: "secondary" },
        { from: "appliance", to: "db", kind: "secondary", fromSide: "bottom", toSide: "right" },
        { from: "inventory", to: "notify", kind: "secondary", dashed: true, label: { ko: "유통기한 임박", en: "expiring" } },
      ],
    },
    title: { ko: "집비치기 (him)", en: "him (home-inventory-manager)" },
    subtitle: {
      ko: "AI native 100% 풀스택 사이드 프로젝트",
      en: "100% AI-native full-stack side project",
    },
    badge: {
      ko: "4 + 5 (회사 역전이)",
      en: "Stage 4 + 5 (back-transferred into work)",
    },
    problem: {
      ko: "가정 재고 관리의 실제 페인 포인트(어디 갔지·유통기한·재고·재구매 알림)와 풀스택 증명 동기 — 혼자서 UI 기획·프론트·백·인프라 모든 분야가 가능함을 검증하고 싶었습니다.",
      en: "Real household-inventory pain points (where did it go · expiration dates · stock levels · re-order alerts), plus a personal motive: prove I can solo every layer — UI planning, frontend, backend, infra.",
    },
    system: {
      ko: "NestJS + CQRS + TypeORM + PostgreSQL + 프론트엔드 + Docker Compose + S3 + Terraform IaC + 백업 메트릭 → Grafana를 갖췄습니다. 회사 검증 아키텍처 패턴을 그대로 차용했으며 AI native 100%로 코드 작성은 AI, 사람 노드는 (1) UI 기획 + (2) 코드 연결 검토 + (3) e2e 테스트 셋으로 분리했습니다. DB는 사용자 격리를 위해 자체 인프라를 구축 중입니다.",
      en: "NestJS + CQRS + TypeORM + PostgreSQL + a frontend + Docker Compose + S3 + Terraform IaC + backup metrics → Grafana. Architecture patterns are lifted directly from work-validated ones. 100% AI-native: AI writes code; the three human nodes are (1) UI planning, (2) code-connection review, and (3) e2e tests. Building self-hosted infra so DB-level user isolation works.",
    },
    impact: {
      ko: "개인 + 거점 공유자 1인 베타 운영 + 13+ 위키 자산 환류 (2단계 설계 프로세스·테스트 5-layer·정합성 31건 간극 정비·백업 메트릭 자동화·S3+Terraform 양쪽 레시피)를 달성했습니다. 회사로 역전이도 일어났습니다 — 집비치기 UI + current e2e 테스트 패턴이 회사 프론트엔드 강화에 도입 중입니다.",
      en: "Personal use + 1 beta user (a shared hub), 13+ wiki assets fed back (the 2-stage design process, the 5-layer testing setup, 31 consistency-gap repairs, automated backup metrics, and recipes for both sides of S3 + Terraform). Back-transfer into work happened too — the him UI + current e2e test pattern is being adopted to strengthen the company frontend.",
    },
    keywords: [
      { ko: "AI native 100%", en: "100% AI native" },
      { ko: "NestJS + CQRS", en: "NestJS + CQRS" },
      { ko: "TypeORM", en: "TypeORM" },
      { ko: "Terraform IaC", en: "Terraform IaC" },
      { ko: "백업 메트릭 자동화", en: "Automated backup metrics" },
      {
        ko: "e2e 회사 역전이",
        en: "e2e back-transfer to work",
      },
      {
        ko: "자체 인프라 (DB 격리)",
        en: "Self-hosted infra (DB isolation)",
      },
    ],
    trackVisibility: "both",
    areas: [
      {
        icon: "🔧",
        label: { ko: "백엔드", en: "Backend" },
        description: {
          ko: "NestJS + CQRS + TypeORM + PostgreSQL (회사 패턴 차용)",
          en: "NestJS + CQRS + TypeORM + PostgreSQL (patterns lifted from work)",
        },
      },
      {
        icon: "🖥",
        label: { ko: "프론트·e2e", en: "Frontend · e2e" },
        description: {
          ko: "UI + current e2e 테스트 (회사 프론트엔드 강화에 역전이 중)",
          en: "UI + current e2e tests (being back-transferred into the work frontend)",
        },
      },
      {
        icon: "☁",
        label: { ko: "인프라", en: "Infra" },
        description: {
          ko: "Docker Compose + S3 + Terraform IaC + Grafana 백업 메트릭",
          en: "Docker Compose + S3 + Terraform IaC + Grafana backup metrics",
        },
      },
      {
        icon: "📚",
        label: { ko: "위키 환류", en: "Wiki feedback loop" },
        description: {
          ko: "13+ 페이지 환류 + 정합성 31건 간극 정비",
          en: "13+ pages fed back + 31 consistency gaps repaired",
        },
      },
    ],
    metrics: [
      {
        label: { ko: "AI 작성 코드", en: "AI-written code" },
        value: { ko: "100%", en: "100%" },
      },
      {
        label: { ko: "누적 시간", en: "Cumulative hours" },
        value: { ko: "227h 13m", en: "227h 13m" },
      },
      {
        label: { ko: "위키 환류", en: "Wiki feedback" },
        value: { ko: "13+ 페이지", en: "13+ pages" },
      },
      {
        label: { ko: "정합성 간극 정비", en: "Consistency gaps repaired" },
        value: { ko: "31건", en: "31 items" },
      },
    ],
    honestyNote: {
      ko: "UI 기획 검토 + 코드 연결 검토 + e2e 테스트만 사람입니다. 나머지 코드 작성은 모두 AI입니다. 회사 아키텍처를 가져온 점도 인정합니다 — 다만 그 위에서 AI native + 빈번 검토 사이클로 인간 단독 대비 더 안정적·고도화된다는 가설을 검증한 무대입니다.",
      en: "Only UI-planning review, code-connection review, and e2e tests are human. All actual code is AI-written. I also acknowledge the architecture came from work — but on top of that base, this is the stage that validates the hypothesis that AI-native + frequent review loops can produce something more stable and refined than a solo human could.",
    },
    images: [
      {
        src: "/projects/him/home.png",
        alt: {
          ko: "집비치기 모바일 앱 홈 — 위치별 재고 + D-day",
          en: "him mobile app home — stock by location + D-day",
        },
        caption: {
          ko: "모바일 앱 홈 — 위치별 재고(침대·주방·싱크대) + 임박일(D-30·D-29) + 카테고리 태그",
          en: "Mobile home — stock by location (bed · kitchen · sink), upcoming expirations (D-30 · D-29), and category tags",
        },
      },
    ],
  },
  {
    slug: "lumir-erp",
    cardImage: {
      src: "/projects/lumir-erp/cms.png",
      alt: {
        ko: "Lumir-ERP CMS — 공지 콘텐츠 관리 (카테고리·목록·공개 토글)",
        en: "Lumir-ERP CMS — announcement content management (categories, list, publish toggles)",
      },
    },
    icon: "🏢",
    diagram: {
      caption: {
        ko: "사내 전 사원 + 외부 입사지원자까지 4 도메인 백오피스. 프론트는 외부 API(AMS·CMS·LRIM)와 UAM용 MongoDB를 호출하는 오케스트레이터이고, CMS만 풀스택 단독(기획·BE·테스트)입니다. Plan(mock)/Current(실제 API) 환경 분리 패턴(파트장 인계)을 4 도메인에 일관 적용 — 핵심 자산은 4 도메인 동시 적응력.",
        en: "A 4-domain back office serving every employee plus external applicants. The frontend orchestrates external APIs (AMS·CMS·LRIM) and MongoDB for UAM; only CMS is solo full-stack (planning · BE · tests). The Plan (mock) / Current (real API) split (inherited from the team lead) is applied consistently across all four — the real asset is adapting to four domains at once.",
      },
      nodes: [
        {
          id: "emp",
          kind: "actor",
          icon: "👥",
          label: { ko: "사내 전 사원", en: "All employees" },
          col: 1,
          row: 0,
        },
        {
          id: "applicant",
          kind: "actor",
          icon: "🧑‍💼",
          label: { ko: "외부 입사지원자", en: "External applicants" },
          col: 3,
          row: 0,
        },
        {
          id: "schedule",
          kind: "layer",
          cat: 3,
          icon: "🗓",
          label: { ko: "자원예약·일정", en: "Scheduling" },
          sublabel: { ko: "프론트 전담", en: "Frontend only" },
          col: 0,
          row: 1,
        },
        {
          id: "cms",
          kind: "layer",
          cat: 2,
          icon: "📝",
          label: { ko: "CMS", en: "CMS" },
          sublabel: { ko: "풀스택 단독 · 기획·BE·테스트", en: "Solo full-stack" },
          col: 1,
          row: 1,
        },
        {
          id: "lrimHire",
          kind: "layer",
          cat: 4,
          icon: "👤",
          label: { ko: "LRIM 채용", en: "LRIM hiring" },
          sublabel: { ko: "프론트 전담", en: "Frontend only" },
          col: 2,
          row: 1,
        },
        {
          id: "lrimInterview",
          kind: "layer",
          cat: 5,
          icon: "📋",
          label: { ko: "LRIM 면접관리", en: "LRIM interview mgmt" },
          sublabel: { ko: "프론트 · 외부 노출", en: "Frontend · public" },
          col: 3,
          row: 1,
        },
        {
          id: "backend",
          kind: "external",
          icon: "🔌",
          label: { ko: "외부 백엔드", en: "External backends" },
          sublabel: {
            ko: "AMS·CMS·LRIM API + MongoDB(UAM)",
            en: "AMS·CMS·LRIM API + MongoDB (UAM)",
          },
          col: 1.5,
          row: 2,
        },
      ],
      edges: [
        { from: "emp", to: "cms", kind: "primary", animated: true, label: { ko: "사용", en: "use" } },
        { from: "emp", to: "schedule", kind: "secondary", fromSide: "left", toSide: "top", label: { ko: "사용", en: "use" } },
        { from: "emp", to: "lrimHire", kind: "secondary", fromSide: "right", toSide: "top", label: { ko: "사용", en: "use" } },
        { from: "applicant", to: "lrimInterview", kind: "primary", animated: true, label: { ko: "면접 일정 제출", en: "submit slot" } },
        { from: "schedule", to: "backend", kind: "secondary", label: { ko: "API", en: "API" } },
        { from: "cms", to: "backend", kind: "secondary", label: { ko: "API", en: "API" } },
        { from: "lrimHire", to: "backend", kind: "secondary", label: { ko: "API", en: "API" } },
        { from: "lrimInterview", to: "backend", kind: "secondary", label: { ko: "API", en: "API" } },
      ],
    },
    title: {
      ko: "Lumir-ERP (사내 백오피스)",
      en: "Lumir-ERP (internal back office)",
    },
    subtitle: {
      ko: "4 도메인 워크스트림 통합 — CMS 풀스택 + 자원예약·LRIM·면접관리 프론트엔드",
      en: "Four domain workstreams together — full-stack CMS + frontend for resource scheduling, LRIM, and interview management",
    },
    badge: {
      ko: "4 (직군 안 · 4 도메인 적응)",
      en: "Stage 4 (in-role · adapting to 4 domains)",
    },
    problem: {
      ko: "루미르 사내 백오피스 4개 도메인(자원예약·CMS·LRIM 채용·LRIM 면접관리) 풀스택 구축이 필요했고, 사내 전 사원 + 채용 담당자·면접관·평가자 + 외부 입사지원자까지 사용자 풀이 가장 넓은 회사 프로젝트입니다.",
      en: "We needed full-stack delivery of four internal back-office domains (resource scheduling · CMS · LRIM hiring · LRIM interview management). It's the company's broadest-user project — every employee, plus recruiters, interviewers, evaluators, and external applicants.",
    },
    system: {
      ko: "Next.js 14/15 (App Router) + TypeScript + Tailwind + shadcn/ui + SWR + Playwright를 사용했습니다. Plan(mock)/Current(실제 API) 환경 분리 패턴 (파트장 인계) + 도메인별 Context 패턴 + (cms)/(sms)/(ams)/(uam) 도메인 분리 + UAM은 MongoDB 직접 접근입니다. LRIM 두 앱은 pnpm + Turborepo 모노레포(@repo/ui·common·modules)입니다. AI native 100%로 코드 작성은 AI, 본인은 UI 기획 검토 + 코드 연결 검토 + e2e 테스트를 담당합니다.",
      en: "Next.js 14/15 (App Router) + TypeScript + Tailwind + shadcn/ui + SWR + Playwright. A Plan (mock) / Current (real API) environment-split pattern (inherited from the team lead) + per-domain Context + (cms)/(sms)/(ams)/(uam) domain separation + UAM uses MongoDB directly. The two LRIM apps form a pnpm + Turborepo monorepo (@repo/ui · common · modules). 100% AI-native: AI writes code; I review the UI planning, code connections, and own the e2e tests.",
    },
    impact: {
      ko: "사내 전 사원 + 외부 입사지원자까지 운영 중인 4 도메인 백오피스입니다. CMS는 풀스택 단독(기획·BE·테스트, 프론트 테스트 개선 중), 나머지 3개는 프론트 모든 기능을 담당했습니다. 핵심 자산은 프로젝트 4개가 아니라 4 도메인 동시 적응력과 CMS 풀-사이클 단독 경험입니다.",
      en: "A 4-domain back office running in production for every employee plus external applicants. CMS is solo full-stack (planning · backend · tests; frontend tests are being improved). For the other three, I own all frontend functionality. The real asset isn't 'four projects' — it's the ability to adapt to four domains in parallel and the full-cycle solo experience on CMS.",
    },
    keywords: [
      { ko: "Next.js App Router", en: "Next.js App Router" },
      {
        ko: "Plan/Current 환경 분리",
        en: "Plan/Current environment split",
      },
      { ko: "CMS 풀스택 단독", en: "Solo full-stack CMS" },
      { ko: "LRIM 채용·면접관리", en: "LRIM hiring & interviews" },
      {
        ko: "외부 입사지원자 노출",
        en: "External applicants",
      },
      { ko: "AI native 100%", en: "100% AI native" },
      { ko: "Playwright E2E", en: "Playwright E2E" },
      { ko: "shadcn/ui", en: "shadcn/ui" },
    ],
    trackVisibility: "both",
    areas: [
      {
        icon: "🗓",
        label: { ko: "자원예약·일정", en: "Scheduling" },
        description: {
          ko: "calendar·schedule-status 프론트 모든 기능 (사내 전 사원 대상)",
          en: "calendar / schedule-status — all frontend (for every employee)",
        },
      },
      {
        icon: "📝",
        label: { ko: "CMS", en: "CMS" },
        description: {
          ko: "풀스택 단독 — 기획·BE·테스트 (프론트 테스트 개선 중)",
          en: "Solo full-stack — planning · backend · tests (frontend tests being improved)",
        },
      },
      {
        icon: "👥",
        label: { ko: "LRIM 채용", en: "LRIM hiring" },
        description: {
          ko: "채용 담당자·면접관·평가자 대상 프론트 모든 기능",
          en: "All frontend, for recruiters · interviewers · evaluators",
        },
      },
      {
        icon: "📋",
        label: { ko: "LRIM 면접관리", en: "LRIM interview mgmt" },
        description: {
          ko: "지원자가 면접 일정 선택해서 제출 (외부 입사지원자 노출)",
          en: "Applicant-facing interview-slot selection (publicly exposed)",
        },
      },
    ],
    ownContribution: {
      ko: "4 워크스트림 모든 기능 구현 (자원예약·CMS·LRIM·면접관리). CMS는 풀스택 단독 (기획·BE·테스트). 4 워크스트림에 일관된 Plan/Current 패턴 적용.",
      en: "All four workstreams (scheduling · CMS · LRIM · interview mgmt) implemented end-to-end. CMS is solo full-stack (planning · backend · tests). The Plan/Current pattern is applied consistently across all four.",
    },
    inheritedScope: {
      ko: "Plan/Current 환경 분리 패턴 + WikiContext 등 도메인 컨텍스트 패턴 (파트장 설계). 본인은 4 워크스트림에 따라 적용하는 역할.",
      en: "The Plan/Current split + domain-context patterns like WikiContext (designed by the team lead). My role: applying them across the four workstreams.",
    },
    honestyNote: {
      ko: "Plan/Current 패턴과 도메인 컨텍스트 패턴은 파트장 설계입니다. 본인이 새로 만든 패턴이 아닙니다. CMS 프론트 테스트는 현재 개선 작업 중이며, 자원예약·LRIM은 프론트만 담당하고 백엔드는 외부입니다.",
      en: "The Plan/Current and domain-context patterns are the team lead's design, not mine. The CMS frontend tests are still being improved. For scheduling and LRIM, only the frontend is mine — the backend is owned elsewhere.",
    },
    metrics: [
      {
        label: { ko: "워크스트림", en: "Workstreams" },
        value: { ko: "4 도메인", en: "4 domains" },
      },
      {
        label: { ko: "CMS", en: "CMS" },
        value: { ko: "풀스택 단독", en: "Solo full-stack" },
      },
      {
        label: { ko: "외부 노출", en: "Public exposure" },
        value: { ko: "입사지원자", en: "Applicants" },
      },
      {
        label: { ko: "AI 작성", en: "AI-written" },
        value: { ko: "100%", en: "100%" },
      },
    ],
    measurementPending: [
      {
        ko: "각 워크스트림 시작 시점",
        en: "Start date of each workstream",
      },
      {
        ko: "누적 시간 (4 워크스트림 합산)",
        en: "Cumulative hours across the 4 workstreams",
      },
      { ko: "사내 사용자 수", en: "Internal user count" },
      {
        ko: "외부 입사지원자 누적 수",
        en: "Cumulative external applicants",
      },
    ],
    qa: [
      {
        q: {
          ko: "Plan/Current 환경 분리 패턴을 설명해줄 수 있나요?",
          en: "Can you explain the Plan/Current environment-split pattern?",
        },
        a: {
          ko: "파트장이 구축한 프론트 아키텍처입니다. planning은 mock 데이터로 UI·기획 마무리, current는 실제 백엔드 API 연결입니다. _services/에 v1·v2 버전 관리, 본인이 4 워크스트림에 일관 적용했습니다.",
          en: "It's a frontend architecture set up by the team lead. 'planning' finishes UI and planning with mock data; 'current' connects to the real backend API. _services/ holds v1·v2 versioning. I applied it consistently to the four workstreams.",
        },
      },
      {
        q: {
          ko: "4 워크스트림 동시 진행이 어떻게 가능했나요?",
          en: "How did you run four workstreams in parallel?",
        },
        a: {
          ko: "AI native + 일관된 팀 패턴(Plan/Current·도메인 Context)·도메인 분리(api 경로 규칙) 덕분입니다. 개별 도메인 학습은 AI 사고 파트너로 흡수했습니다.",
          en: "AI-native, plus consistent team patterns (Plan/Current · domain Context) and domain separation (API path rules). Individual domain knowledge was absorbed via AI as a thinking partner.",
        },
      },
      {
        q: {
          ko: "본인이 설계한 부분과 인계받은 부분?",
          en: "What did you design vs. inherit?",
        },
        a: {
          ko: "인계: Plan/Current 환경 분리 + 도메인 Context 패턴 + 모노레포 구조. 본인: 4 워크스트림 모든 기능 구현 + CMS 백엔드·테스트.",
          en: "Inherited: Plan/Current + domain-context patterns + the monorepo structure. Mine: all four workstreams' features + the CMS backend and tests.",
        },
      },
      {
        q: {
          ko: "가장 자랑하는 부분?",
          en: "What are you most proud of?",
        },
        a: {
          ko: "CMS 풀스택 단독 (기획부터 BE 테스트까지) — 4 워크스트림 중 유일한 풀-사이클입니다. 또는 4 도메인을 동시에 운영한 적응력 자체입니다.",
          en: "Solo full-stack CMS (planning through backend tests) — the only full-cycle workstream of the four. Or, the adaptability of running all four domains simultaneously.",
        },
      },
    ],
  },
  {
    slug: "brain-trinity",
    icon: "🧠",
    title: { ko: "Brain Trinity", en: "Brain Trinity" },
    subtitle: {
      ko: "인지 부하 분산 + 도메인 적응 메커니즘의 시스템화",
      en: "Systematizing cognitive load distribution + a domain-adaptation mechanism",
    },
    badge: { ko: "4 + 5 신호", en: "Stage 4 + stage-5 signal" },
    problem: {
      ko: "생물학적 뇌를 중요한 업무에 집중하게 두려면 '중요하지만 항상 기억할 필요는 없는 내용'을 외부 시스템으로 분리해야 했습니다. 단순 노트앱은 검색은 되지만 합성·연결·재사용이 안 됐습니다 (트리거: Karpathy LLM Wiki 영상).",
      en: "To keep my biological brain on the important work, the 'important but doesn't need to live in working memory' content had to be offloaded to an external system. Plain note apps are searchable but don't synthesize, link, or re-use (trigger: Karpathy's LLM Wiki video).",
    },
    system: {
      ko: "Karpathy LLM Wiki 패턴 3-레이어 (raw/ 불변 + wiki/ AI 컴파일 + Output/ 파생) + Claude Code 협업 (단일 도구) + skill 시스템(ingest/lint/query) + frontmatter 스키마 + index/log 자동 갱신 + Obsidian 그래프 + MEMORY 자동 동기화를 갖췄습니다. AI 작성 100%로 사용자 입력은 프롬프트 채팅뿐입니다.",
      en: "Karpathy-style LLM Wiki 3-layer (immutable raw/ + AI-compiled wiki/ + derived Output/) + Claude Code as the only collaborator + a skill system (ingest/lint/query) + a frontmatter schema + auto-updating index/log + Obsidian graph + auto-syncing MEMORY. 100% AI-written; the user's input is just prompt chat.",
    },
    impact: {
      ko: "위키 페이지 56+ 누적, 매 ingest마다 자동 cross-link + raw frontmatter 동기화 + index/log 갱신이 일어납니다. 본 이력서·자가 진단·6개 프로젝트 자료 박스 자체가 Brain Trinity의 4단계 자동 작동의 살아있는 증거입니다. 향후 회사 프로젝트 묶음(sdpe + lumir-sar-platform) 통합 시 5단계 사내 시스템화 흐름이 가능합니다.",
      en: "56+ wiki pages and counting; every ingest triggers automatic cross-linking, raw-frontmatter sync, and index/log updates. This resume, the self-diagnosis, and the 6 project briefs are themselves the living evidence of Brain Trinity's stage-4 automatic operation. Bundling internal projects (sdpe + lumir-sar-platform) on top would open a stage-5 in-house systemization flow.",
    },
    keywords: [
      { ko: "인지 부하 분산", en: "Cognitive load distribution" },
      { ko: "Karpathy /raw 패턴", en: "Karpathy /raw pattern" },
      { ko: "Claude Code 단일", en: "Claude Code only" },
      { ko: "skill 시스템", en: "Skill system" },
      { ko: "MEMORY 자동 동기화", en: "Auto-syncing MEMORY" },
      {
        ko: "도메인 적응 메커니즘",
        en: "Domain-adaptation mechanism",
      },
    ],
    trackVisibility: "robotics",
    areas: [
      {
        icon: "📥",
        label: { ko: "raw/ 레이어", en: "raw/ layer" },
        description: {
          ko: "사용자가 떨어뜨린 불변 원본 (대화·논문·영상·메모)",
          en: "Immutable raw inputs dropped by the user (chats · papers · videos · notes)",
        },
      },
      {
        icon: "🧠",
        label: { ko: "wiki/ 컴파일", en: "wiki/ compile" },
        description: {
          ko: "AI가 raw를 위키 페이지로 컴파일 (cross-link + index/log 자동)",
          en: "AI compiles raw into wiki pages (cross-link + index/log automated)",
        },
      },
      {
        icon: "⚡",
        label: { ko: "skill 시스템", en: "Skill system" },
        description: {
          ko: "ingest / lint / query — 워크플로우 명시 자동화",
          en: "ingest / lint / query — explicit workflow automation",
        },
      },
      {
        icon: "🔄",
        label: { ko: "MEMORY 동기화", en: "MEMORY sync" },
        description: {
          ko: "Claude Code MEMORY로 세션 간 컨텍스트 보존",
          en: "Context preserved across sessions via Claude Code MEMORY",
        },
      },
    ],
    honestyNote: {
      ko: "회사 프로젝트에 Brain Trinity 직접 적용 사례는 아직 없습니다 (sdpe + lumir-sar-platform 묶음 통합 계획 단계). 다만 본 이력서·자기 점검 시스템·entities 페이지 자체가 Brain Trinity의 4단계 자동 작동 살아있는 증거입니다.",
      en: "There's no in-company project that runs on Brain Trinity directly yet — bundling sdpe + lumir-sar-platform is still at the planning stage. That said, this resume, the self-diagnosis system, and the entity pages themselves are living evidence of its stage-4 automatic operation.",
    },
    metrics: [
      {
        label: { ko: "위키 페이지", en: "Wiki pages" },
        value: { ko: "56+", en: "56+" },
      },
      {
        label: { ko: "AI 작성", en: "AI-written" },
        value: { ko: "100%", en: "100%" },
      },
      {
        label: { ko: "AI 도구", en: "AI tooling" },
        value: { ko: "Claude Code 단일", en: "Claude Code only" },
      },
    ],
  },
];

export const trackPositioning = {
  satellite: {
    label: {
      ko: "트랙 ① 위성·SAR 스타트업",
      en: "Track ① Satellite / SAR startups",
    },
    brainTrinityMeaning: {
      ko: "SAR 도메인을 빠르게 흡수·확장한 도구의 증거물",
      en: "Evidence of a tool that absorbed and expanded the SAR domain quickly",
    },
    sellingPoint: {
      ko: "SAR 도메인 디테일·정확도·결과물",
      en: "SAR domain detail · accuracy · concrete results",
    },
    headline: {
      ko: "전공(지표·지각 변위) 위에 SAR 처리 도구를 AI 사고 파트너 + 위키 컴파일로 빠르게 익혀 5종 도구 다중 스택 + 5,143,119 PSI까지 끌어올렸습니다",
      en: "On top of my academic field (ground/crustal displacement), I ramped up the SAR processing tooling — with AI as a thinking partner and wiki compilation — to a 5-tool stack with 5,143,119 PSI scatterers.",
    },
  },
  robotics: {
    label: {
      ko: "트랙 ② 로보틱스 스타트업",
      en: "Track ② Robotics startups",
    },
    brainTrinityMeaning: {
      ko: "도메인 적응 시스템 그 자체 — 방법론·자산",
      en: "The domain-adaptation system itself — methodology and asset.",
    },
    sellingPoint: {
      ko: "메커니즘·확장성·다음 도메인 진입 가능성",
      en: "Mechanism · extensibility · ability to enter the next domain",
    },
    headline: {
      ko: "정보 구조화 + AI native 기반이면 어떤 새 도메인도 같은 방식으로 진입한다고 봅니다. 임베디드·하드웨어·로보틱스로 자연 확장 가능합니다",
      en: "With structured information + an AI-native foundation, any new domain can be entered the same way. Embedded, hardware, and robotics extend naturally.",
    },
  },
} as const;
