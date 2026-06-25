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
  /** 다이어그램 변형 — 미지정: 가로 스파인 / orchestration: 이벤트 버스 보드 / stack: 세로 디바이스 스택 / fleet: 제어→Fleet묶음→관측 2-플레인 */
  variant?: "orchestration" | "stack" | "fleet";
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
  /** fleet 변형 — 제어 플레인(위) → Fleet 그룹 박스(가운데 묶음) → 관측 플레인(아래) */
  fleet?: {
    control: PipelineStage[];
    controlEdges: L[];
    pushLabel: L;
    node: { icon: string; label: L; sublabel: L; chips: L[] };
    scrapeLabel: L;
    observe: PipelineStage[];
    observeEdges: L[];
  };
  /** stack 변형 — 본체(데이터 파이프라인) 디바이스 하단 캡션. 잠금화면·앱 기기와 높이·라벨 대칭용 */
  deviceCaption?: L;
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

  // ── SDPE — LumirX 처리 파이프라인 · 오케스트레이터 허브 (제어/데이터 2-플레인) ──
  {
    id: "sdpe",
    projectSlug: "sdpe",
    icon: "🛰",
    variant: "orchestration",
    title: { ko: "SDPE — LumirX 처리 파이프라인", en: "SDPE — LumirX processing pipeline" },
    note: {
      ko: "운영 콘솔(React Flow 캔버스)에서 DAG를 배포하면, Pipeline Workflow 서브시스템의 오케스트레이터(CSC-08)가 컨트롤 타워로서 pgmq로 단계별 작업을 할당(SI-04)하고 완료(SI-03)를 추적해 L0→L3를 진행시킵니다. 9개 CSC가 수집(DCS)·신호처리(SPS)·후처리(PPS)·서비스(DSS)에 매핑됩니다.",
      en: "From the operator console (a React Flow canvas) a DAG is deployed; the Pipeline Workflow subsystem's orchestrator (CSC-08) acts as a control tower, assigning per-stage jobs over pgmq (SI-04) and tracking completion (SI-03) to advance L0→L3. Nine CSCs map onto collection (DCS), signal processing (SPS), post-processing (PPS) and service (DSS).",
    },
    control: {
      console: {
        kind: "endpoint",
        tone: "actor",
        icon: "🖥",
        label: { ko: "운영 콘솔", en: "Operator console" },
        sublabel: { ko: "Next.js · React Flow DAG 빌더", en: "Next.js · React Flow DAG builder" },
        desc: {
          ko: "React Flow 캔버스에서 처리 단계를 노드로 잇는 DAG를 구성·배포하고, 실행·진행 상태를 모니터링",
          en: "Compose & deploy a processing DAG by wiring stage nodes on a React Flow canvas, then monitor its progress",
        },
        tags: [
          { ko: "DAG 빌더", en: "DAG builder" },
          { ko: "배포·모니터링", en: "Deploy · monitor" },
        ],
      },
      runLabel: { ko: "DAG 배포", en: "deploy DAG" },
      workflow: {
        icon: "🗼",
        label: { ko: "Pipeline Workflow", en: "Pipeline Workflow" },
        sublabel: { ko: "CSC-08 오케스트레이터 · 컨트롤 타워", en: "CSC-08 orchestrator · control tower" },
      },
      busLabel: { ko: "pgmq · 할당(SI-04) / 완료(SI-03)", en: "pgmq · assign (SI-04) / done (SI-03)" },
    },
    stages: [
      {
        kind: "layer",
        cat: 3,
        icon: "📡",
        badge: "DCS",
        label: { ko: "수집", en: "Collection" },
        sublabel: { ko: "CSC-02 · 원시 수신", en: "CSC-02 · raw reception" },
        desc: {
          ko: "위성 다운링크 원시 신호를 수신하고, 수신 이벤트(SI-01)로 오케스트레이터를 깨웁니다",
          en: "Receives raw downlink signal and wakes the orchestrator with a reception event (SI-01)",
        },
        tags: [
          { ko: "CSC-02", en: "CSC-02" },
          { ko: "원시 수신", en: "Raw reception" },
          { ko: "NAS", en: "NAS" },
        ],
      },
      {
        kind: "layer",
        cat: 6,
        icon: "📶",
        badge: "SPS",
        label: { ko: "신호처리", en: "Signal processing" },
        sublabel: { ko: "CSC-03·04 · L0 → L1", en: "CSC-03·04 · L0 → L1" },
        desc: {
          ko: "Level-0·Level-1 처리 — range·azimuth compression 등 SAR 신호 복원",
          en: "Level-0 / Level-1 processing — range/azimuth compression and SAR signal focusing",
        },
        tags: [
          { ko: "CSC-03 L0", en: "CSC-03 L0" },
          { ko: "CSC-04 L1", en: "CSC-04 L1" },
          { ko: "Python 3.11", en: "Python 3.11" },
        ],
      },
      {
        kind: "layer",
        cat: 4,
        icon: "🛠",
        badge: "PPS",
        label: { ko: "후처리", en: "Post-processing" },
        sublabel: { ko: "CSC-05·06·07 · L2·L3·등록", en: "CSC-05·06·07 · L2·L3·register" },
        desc: {
          ko: "Level-2·Level-3 지오코딩(GEC·MAP)과 산출물 카탈로그 등록(SI-05)",
          en: "Level-2 / Level-3 geocoding (GEC · MAP) and product catalog registration (SI-05)",
        },
        tags: [
          { ko: "CSC-05·06", en: "CSC-05·06" },
          { ko: "지오코딩", en: "Geocoding" },
          { ko: "CSC-07 등록", en: "CSC-07 register" },
        ],
      },
      {
        kind: "endpoint",
        tone: "external",
        icon: "🐘",
        label: { ko: "PostGIS STAC 카탈로그", en: "PostGIS STAC catalog" },
        sublabel: { ko: "@sdpe/database", en: "@sdpe/database" },
      },
      {
        kind: "layer",
        cat: 5,
        icon: "🌐",
        badge: "DSS",
        label: { ko: "데이터 서비스", en: "Data service" },
        sublabel: { ko: "CSC-09 · REST·OGC·STAC", en: "CSC-09 · REST·OGC·STAC" },
        desc: {
          ko: "카탈로그를 조회해 REST·OGC(WMS/WCS)·STAC로 서빙하고, 필요 시 재처리(SI-07)를 요청",
          en: "Reads the catalog and serves over REST·OGC(WMS/WCS)·STAC; requests reprocessing (SI-07) when needed",
        },
        tags: [
          { ko: "CSC-09", en: "CSC-09" },
          { ko: "OGC · STAC", en: "OGC · STAC" },
          { ko: "재처리 SI-07", en: "Reprocess SI-07" },
        ],
      },
    ],
    edges: [
      { label: { ko: "원시 (NAS)", en: "raw (NAS)" } },
      { label: { ko: "L1", en: "L1" } },
      { label: { ko: "등록·적재", en: "register" } },
      { label: { ko: "조회·서빙", en: "serve" } },
    ],
    returnNote: {
      ko: "수집은 수신 이벤트(SI-01)로 오케스트레이터를 깨우고, 작업·완료(SI-03)·재처리(SI-07) 상태는 모두 운영 콘솔에서 모니터링됩니다.",
      en: "Collection wakes the orchestrator via a reception event (SI-01); job, completion (SI-03) and reprocessing (SI-07) status all flow back to the operator console for monitoring.",
    },
  },

  // ── InSAR 인프라 운영 — Ansible·모니터링·Semaphore (2-플레인 fleet) ────────
  {
    id: "infra",
    projectSlug: "fleet-infra-ops",
    icon: "🛠",
    variant: "fleet",
    title: { ko: "InSAR 인프라 운영", en: "InSAR Infrastructure Ops" },
    note: {
      ko: "운영자가 Semaphore(Ansible 웹 UI)에서 버튼으로 플레이북을 돌리면, .173 제어 허브의 Ansible이 이기종 3노드 플릿을 구성(SSH+become·인터넷 없는 노드엔 LAN 코드 push)하고, Prometheus가 각 노드 exporter를 scrape해 Grafana·Alertmanager로 시각화·알림합니다. 디스크 고갈은 자동정리 동작 전에 사전 알림으로 돌아옵니다.",
      en: "An operator runs a playbook as a button in Semaphore (Ansible web UI); Ansible on the .173 control hub configures the heterogeneous 3-node fleet (SSH+become, LAN code push for the offline node), and Prometheus scrapes each node's exporter for Grafana/Alertmanager to visualize and alert. Disk exhaustion comes back as a pre-alert before the auto-eviction fires.",
    },
    stages: [],
    edges: [],
    fleet: {
      control: [
        {
          kind: "endpoint",
          tone: "actor",
          icon: "👤",
          label: { ko: "운영자", en: "Operator" },
          sublabel: { ko: "버튼 · 런북", en: "Button · runbook" },
        },
        {
          kind: "layer",
          cat: 2,
          icon: "🎛",
          label: { ko: "Semaphore", en: "Semaphore" },
          sublabel: { ko: "Ansible 웹 UI · .173:3001", en: "Ansible web UI · .173:3001" },
          tags: [
            { ko: "버튼 실행", en: "Button run" },
            { ko: "이력·스케줄", en: "History · schedule" },
          ],
        },
        {
          kind: "layer",
          cat: 1,
          icon: "🔧",
          label: { ko: "Ansible 제어", en: "Ansible control" },
          sublabel: { ko: ".173 허브 · roles·playbook", en: ".173 hub · roles & playbooks" },
          tags: [
            { ko: "SSH + become", en: "SSH + become" },
            { ko: "sync_code (LAN)", en: "sync_code (LAN)" },
          ],
        },
      ],
      controlEdges: [
        { ko: "버튼 실행", en: "button run" },
        { ko: "플레이북", en: "playbook" },
      ],
      pushLabel: { ko: "배포·구성 (push)", en: "deploy/configure (push)" },
      node: {
        icon: "🖥",
        label: { ko: "서버 클러스터", en: "Server cluster" },
        sublabel: {
          ko: "이기종 Linux · /mnt/nas249 NFS 무중단 표준화",
          en: "Heterogeneous Linux · /mnt/nas249 NFS standardized (zero-downtime)",
        },
        chips: [
          { ko: ".173 제어 허브", en: ".173 control hub" },
          { ko: ".174 GPU 워커", en: ".174 GPU worker" },
          { ko: ".17 NFS·오프라인", en: ".17 NFS · offline" },
          { ko: "스토리지 4종", en: "4 storage systems" },
        ],
      },
      scrapeLabel: { ko: "metrics · scrape :9100 (pull)", en: "metrics · scrape :9100 (pull)" },
      observe: [
        {
          kind: "layer",
          cat: 6,
          icon: "📡",
          label: { ko: "Prometheus", en: "Prometheus" },
          sublabel: { ko: "수집 · node·snmp·windows exporter", en: "Collect · node·snmp·windows exporter" },
          tags: [
            { ko: "node_exporter ×3", en: "node_exporter ×3" },
            { ko: "snmp (QNAP)", en: "snmp (QNAP)" },
          ],
        },
        {
          kind: "layer",
          cat: 5,
          icon: "📊",
          label: { ko: "Grafana", en: "Grafana" },
          sublabel: { ko: "Alertmanager · 대시보드·알림", en: "Alertmanager · dashboards & alerts" },
          tags: [
            { ko: "디스크 알림 룰", en: "Disk alert rules" },
            { ko: "Gmail SMTP", en: "Gmail SMTP" },
          ],
        },
      ],
      observeEdges: [
        { ko: "대시보드·알림", en: "dashboard · alert" },
      ],
    },
    returnNote: {
      ko: "디스크풀 알림은 역방향(점선)으로 운영자에게 — 자동정리 동작 전에 사전 차단합니다 (disk-full 런북).",
      en: "Disk-full alerts flow back (dashed) to the operator — caught before the auto-eviction fires (disk-full runbook).",
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
    deviceCaption: { ko: "앱 본체 — CQRS 파이프라인", en: "App core — CQRS pipeline" },
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
