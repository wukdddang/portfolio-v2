/**
 * 5개 메인 프로젝트 자료 박스 (lumir-sar-platform은 3 sub-projects 통합)
 * Brain Trinity wiki/ai/ai-usage-levels-seong-pm.md 정제 결과 (2026-05-20 ~ 2026-05-23)
 */

export type StageRange =
  | "3 → 4 + 5 신호"
  | "3+4(+5) 혼합"
  | "3+4 혼합"
  | "4 + 5 (회사 역전이)"
  | "4 + 5 신호"
  | "4 (직군 안 · 4 도메인 적응)"
  | "4 진행 중 (직군 안 · UI 기획·백엔드 동시)"
  | "3+4 통합 (3 레이어 풀스택)";

export type TrackTag = "satellite" | "robotics" | "both";

export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  badge: StageRange;
  problem: string;
  system: string;
  impact: string;
  keywords: string[];
  trackVisibility: TrackTag; // both | satellite-only | robotics-only
  honestyNote?: string;
  ownContribution?: string;
  inheritedScope?: string;
  metrics?: { label: string; value: string }[];
  measurementPending?: string[];
  qa?: { q: string; a: string }[];
  images?: ProjectImage[];
  /**
   * 통합 박스(예: lumir-sar-platform)가 묶은 sub 프로젝트들.
   * 카드에는 미니 레이어 라벨로, 상세 페이지에서는 각 레이어 깊이 섹션으로 렌더된다.
   */
  subProjects?: Project[];
  /**
   * sub 프로젝트 식별용 — 통합 박스 안에서 표시 라벨 (예: "저장", "분석", "프론트").
   */
  layerLabel?: string;
  layerIcon?: string;
}

// ===========================================================================
// 3 레이어 sub-projects — lumir-sar-platform 통합 박스 안에 묶임
// 직접 ProjectsGrid에는 노출되지 않고, 통합 박스의 상세 페이지에서만 깊이로 렌더된다.
// ===========================================================================

const sarDataRetrievalLayer: Project = {
  slug: "sar-data-retrieval",
  layerLabel: "저장",
  layerIcon: "🗄",
  title: "Sentinel SAR 검색·분석 백엔드",
  subtitle: "NestJS 모노레포 + CDSE + NAS PoC + DDD 5-layer + snap 통합 (AI native)",
  badge: "3+4(+5) 혼합",
  problem:
    "기존에 존재하지 않는 날씨·계절 무관 지표 변위 데이터 제공 플랫폼 + Sentinel SAR 검색·다운로드·메타데이터 통합 백엔드가 필요했습니다. snap 처리 결과를 사용자 위치 검색 가능한 형태로 제공할 서비스 레이어도 필요했습니다.",
  system:
    "NestJS 모노레포 (sentinel-retrieval + ai-processing) + CDSE API + NAS(SMB2 vs 직접 FS) PoC + SLC 도메인 모델링 + DDD 5-layer + snap 자매 레포 통합 레이어를 구축했습니다. AI native 진행으로 예측 보일러플레이트 시점만 도메인 구조를 일부 수정했습니다.",
  impact:
    "3 레이어 통합 서비스의 데이터 저장 레이어를 담당합니다. 사용자 위치 요청에 분석 데이터를 즉시 제공하거나 신규 처리 후 제공할 수 있는 구조의 기초가 됩니다.",
  keywords: [
    "NestJS 모노레포",
    "CDSE",
    "NAS SMB2/직접FS PoC",
    "DDD 5-layer",
    "SLC 도메인",
    "AI native",
  ],
  trackVisibility: "both",
  metrics: [
    { label: "DDD 계층", value: "5-layer" },
    { label: "통합 외부 시스템", value: "CDSE + NAS" },
  ],
};

const lumirLinuxSnapLayer: Project = {
  slug: "lumir-linux-snap",
  layerLabel: "분석",
  layerIcon: "⚙",
  title: "Sentinel-1 InSAR 처리 파이프라인",
  subtitle: "5종 도구 다중 스택 + AI native 진행 · 정부 공동 지표변위 모니터링",
  badge: "3 → 4 + 5 신호",
  problem:
    "정부 공공기관 공동 지표변위 모니터링 사업에서 SNAP 단독 파이프라인은 처리 속도 한계로 실시간 서비스화가 불가능했습니다. ASC 단독 SBAS의 LOS 1D 한계, 단일 건물 hot-spot 식별을 위한 최소 2 yr stack 요구도 풀어야 했습니다.",
  system:
    "5종 도구 다중 스택 (SNAP 12 + SNAPHU 2.0.3 + MintPy 1.6.2 + StaMPS PSI + ISCE2 2.6.3)을 운영했습니다. 오버엔지니어링 방지 원칙 + AI 사고 파트너로 도구 평가 + 다중 Claude Code agent 워크트리 (agent 1~4 병렬 + gpt_isolated wrapper + handoff 시스템)를 갖췄습니다.",
  impact:
    "ISCE2 도입으로 처리 속도를 확보해 3 레이어 통합 서비스의 분석 처리 레이어가 가능해졌습니다. 광교산 시루봉 -17.30 mm/yr (GNSS 검증) + PSI 5,143,119 PS + 5m DEM TC + 사업 보고서 v1~v4를 AI native로 작성 시간이 0에 가까웠습니다.",
  keywords: [
    "Sentinel-1 SAR",
    "5종 도구 스택",
    "ISCE2 속도 확보",
    "다중 agent 워크트리",
    "5,143,119 PSI",
    "사업 보고서 자동화",
  ],
  trackVisibility: "both",
  honestyNote:
    "SAR 도메인은 본인 직군(웹 개발) 외 영역입니다. AI 사고 파트너 없이는 진입이 불가능했을 영역으로 평가합니다 (3단계 직군 확장의 표본 사례).",
  metrics: [
    { label: "PSI 검출 PS", value: "5,143,119" },
    { label: "시루봉 침하 (GNSS 검증)", value: "-17.30 mm/yr" },
    { label: "도구 스택", value: "5종 다중" },
  ],
  measurementPending: [
    "작업 기간 정확치",
    "처리 SLC 총 개수",
    "SBAS 페어 수",
    "SNAP vs ISCE2 처리 속도 비율",
    "다중 agent 시간 절감 비율",
  ],
  images: [
    {
      src: "/projects/lumir-linux-snap/timeseries-65epoch.png",
      alt: "control points 시계열 (65 epoch / 2.30 yr stack)",
      caption: "Control points 시계열 — 65 epoch / 2.30 yr stack",
    },
    {
      src: "/projects/lumir-linux-snap/dem-5m-hillshade.png",
      alt: "5m DEM hillshade",
      caption: "5m DEM hillshade — 국토지리정보원 DEM TC 적용",
    },
    {
      src: "/projects/lumir-linux-snap/dem-compare-unwrap.png",
      alt: "DEM 비교 — unwrap 결과",
      caption: "DEM 비교 — Phase unwrap 결과",
    },
  ],
};

const sarSearchAndAnalyzerLayer: Project = {
  slug: "sar-search-and-analyzer",
  layerLabel: "프론트",
  layerIcon: "🖥",
  title: "Sentinel SAR 검색·요청 프론트엔드 (풀스택 준비)",
  subtitle: "지도 기반 SAR 데이터 검색·다운로드·InSAR 분석 요청",
  badge: "4 진행 중 (직군 안 · UI 기획·백엔드 동시)",
  problem:
    "사내에서 위성 데이터를 지도에서 검색·요청하고 InSAR 분석까지 요청하는 통합 프론트 서버가 필요했습니다. 저장 레이어와 분석 레이어를 묶어주는 사용자 진입점입니다.",
  system:
    "Next.js (App Router) + Plan/Current 환경 분리 패턴 + (sar) 도메인 (user·admin 페이지) + Next.js Route Handler BFF를 갖췄습니다. 현재는 apps/web 단독 운영이며, 모노레포(pnpm + libs/*)는 향후 백엔드(apps/api·worker·crawler) 추가 대비 사전 셋업입니다. CLAUDE.md에 4-Layer Clean Architecture + CQRS + 한글 메서드명 백엔드 설계 문서를 본인이 직접 작성했고, 집비치기에서 검증한 패턴을 가져왔습니다.",
  impact:
    "지도 기반 AOI 폴리곤 설정 + 카탈로그 검색 + InSAR 분석 요청까지 가능한 사용자 UI 기획·구현이 진행 중입니다. 백엔드 개발과 기획이 동시 진행되어 혼선을 막는 인터페이스 설계가 핵심 작업입니다.",
  keywords: [
    "Next.js App Router",
    "Plan/Current 환경 분리",
    "지도 + AOI",
    "InSAR 분석 요청",
    "pnpm 모노레포",
    "Route Handler BFF",
  ],
  trackVisibility: "both",
  ownContribution:
    "apps/web 전부 본인 단독 (UI 기획·구현·Route Handler BFF). CLAUDE.md의 백엔드 설계 문서(4-Layer + CQRS + 한글 메서드명)도 본인이 직접 작성했습니다 — 집비치기 검증 패턴을 본 프로젝트에 적용 예정.",
  honestyNote:
    "현재 코드는 apps/web 단독입니다 (apps/api·worker·crawler 미구현). 모노레포는 향후 백엔드 추가 대비 사전 셋업이며, 백엔드 4-Layer는 CLAUDE.md 설계 문서 단계입니다. UI 기획·백엔드 설계가 동시 진행 중이라 인터페이스 정합이 중요한 시점입니다.",
  metrics: [
    { label: "현재 단계", value: "UI 기획·구현" },
    { label: "팀 구성", value: "본인 단독" },
    { label: "AI 작성", value: "AI native" },
  ],
  measurementPending: [
    "시작 시점·누적 시간",
    "구현 완료 화면 수",
    "백엔드 Phase 진척 (0~9)",
  ],
  images: [
    {
      src: "/projects/sar-search-and-analyzer/search.png",
      alt: "SAR 데이터 검색 UI — 지도 + AOI + 카탈로그",
      caption: "검색 화면 — 한국 지도 + AOI 폴리곤 + 페이로드·위성 필터 + 카탈로그(Hwaseong·Pohang·Ulsan·Seoul)",
    },
    {
      src: "/projects/sar-search-and-analyzer/aoi.png",
      alt: "AOI 영역 설정 UI",
      caption: "AOI 설정 화면 — 두 polygon overlap + 영역 설정 패널",
    },
  ],
};

// 통합 박스 — sub-projects 3개를 묶는 wrapper
const lumirSarPlatform: Project = {
  slug: "lumir-sar-platform",
  title: "루미르 SAR 데이터 플랫폼",
  subtitle: "Sentinel + LumirX 검색·저장·분석·요청 통합 — 사내 위성 데이터 풀스택 서비스 (3 레이어)",
  badge: "3+4 통합 (3 레이어 풀스택)",
  problem:
    "Sentinel과 LumirX 위성 데이터를 사내에서 검색·저장·분석·요청까지 한 사이클로 처리할 통합 서비스가 부재했습니다. 데이터 저장(NAS+CDSE), InSAR 분석(SNAP·ISCE2·MintPy), 사용자 진입 프론트엔드가 각각 분리되어 있어 사용자가 위치 요청만으로 분석 결과까지 받기 어려운 구조였습니다.",
  system:
    "3 레이어 통합 서비스를 본인이 단독으로 설계·구축하고 있습니다. **저장 레이어**(sar-data-retrieval, NestJS 모노레포 + CDSE + NAS PoC + DDD 5-layer) + **분석 레이어**(lumir-linux-snap, 5종 도구 다중 스택 + 다중 agent 워크트리) + **프론트 레이어**(sar-search-and-analyzer, Next.js + 지도 + AOI + 분석 요청 UI). 모두 AI native 100%로 진행하며, [[집비치기-him]]에서 검증한 4-Layer + CQRS + 한글 메서드명 패턴을 회사 백엔드 설계에 역전이 중입니다.",
  impact:
    "ISCE2 도입으로 분석 처리 속도를 확보해 *날씨·계절 무관 지표 변위 데이터 서비스화*가 가능한 단계에 진입했습니다. 사용자가 지도에서 위치를 요청하면 저장된 분석 데이터를 즉시 제공하거나, 없으면 신규 처리 후 제공하는 흐름을 한 사람이 풀스택으로 묶고 있다는 점이 핵심입니다.",
  keywords: [
    "3 레이어 풀스택",
    "Sentinel-1 + LumirX",
    "NestJS + Next.js",
    "ISCE2 속도 확보",
    "다중 agent 워크트리",
    "지도 + AOI",
    "AI native 100%",
    "집비치기 패턴 역전이",
  ],
  trackVisibility: "both",
  ownContribution:
    "3 레이어 모든 코드 단독 (sar-data-retrieval 5개 영역 전부, lumir-linux-snap 도구 평가·운영, sar-search-and-analyzer apps/web 전부 + 백엔드 설계 문서). 통합 비전 설계 본인.",
  honestyNote:
    "각 레이어의 일부 패턴은 외부 인계입니다 — Plan/Current 환경 분리(파트장)·일부 SAR 도메인 지식(AI 사고 파트너 도움). sar-search-and-analyzer 백엔드(apps/api·worker·crawler)는 CLAUDE.md 설계 문서 단계이며 실제 구현은 다음 Phase입니다.",
  metrics: [
    { label: "통합 레이어", value: "3 (저장·분석·프론트)" },
    { label: "PSI 검출", value: "5,143,119" },
    { label: "검증된 침하", value: "-17.30 mm/yr (GNSS)" },
    { label: "AI 작성 코드", value: "100% (AI native)" },
  ],
  measurementPending: [
    "통합 완성 시점 (분석→저장→프론트 end-to-end)",
    "사내 사용자 수",
    "지원 위성 수 (현재 Sentinel-1 + LumirX 예정)",
  ],
  qa: [
    {
      q: "3 레이어가 어떻게 한 서비스로 통합되나요?",
      a: "사용자가 sar-search-and-analyzer 지도에서 위치를 요청하면, sar-data-retrieval이 기존 분석 데이터를 조회하거나 lumir-linux-snap에 신규 분석을 요청합니다. 분석 결과는 다시 sar-data-retrieval에 저장되어 다음 요청 시 즉시 응답할 수 있습니다.",
    },
    {
      q: "한 사람이 3 레이어를 동시 운영할 수 있는 이유는?",
      a: "AI native 100% — 코드 작성은 AI, 본인은 UI 기획·코드 검토·통합 인터페이스 정합을 담당합니다. 또한 집비치기에서 검증한 4-Layer + CQRS + 한글 메서드명 패턴을 회사 백엔드 설계에 역전이해서 패턴 일관성을 유지합니다.",
    },
    {
      q: "각 레이어의 본인 기여와 외부 인계 영역은?",
      a: "저장(sar-data-retrieval): 5개 영역 전부 본인. 분석(lumir-linux-snap): SAR 도메인은 학부 수준이라 AI 사고 파트너 의존이 큼. 프론트(sar-search-and-analyzer): apps/web 전부 본인, Plan/Current 패턴은 파트장 인계.",
    },
    {
      q: "외부 노출이 있나요?",
      a: "현재 사내 운영. 향후 사업 보고서 v1~v4 + policy briefing PDF 같은 자료가 외부 발주처 대상으로 활용될 수 있습니다.",
    },
  ],
  // sub-projects — 통합 박스 안에 깊이로 들어감
  subProjects: [sarDataRetrievalLayer, lumirLinuxSnapLayer, sarSearchAndAnalyzerLayer],
  images: [
    {
      src: "/projects/sar-search-and-analyzer/search.png",
      alt: "SAR 검색 UI (프론트 레이어)",
      caption: "프론트 레이어 — 지도 기반 SAR 검색 + AOI + 카탈로그",
    },
    {
      src: "/projects/lumir-linux-snap/timeseries-65epoch.png",
      alt: "InSAR 시계열 (분석 레이어)",
      caption: "분석 레이어 — Control points 시계열 (65 epoch / 2.30 yr stack)",
    },
  ],
};

export const projects: Project[] = [
  lumirSarPlatform,
  {
    slug: "sdpe",
    title: "SDPE — SAR 처리 파이프라인 오케스트레이션",
    subtitle: "루미르 LumirX 위성 데이터 다단계 파이프라인 · NestJS 5 서브시스템 + DAG",
    badge: "3+4 혼합",
    problem:
      "LumirX 위성 원시 SAR 데이터(L0~L3) 다단계 파이프라인을 운영자가 구성·실행·추적·복구할 시스템이 부재했고, 새 위성·새 알고리즘 추가 시 코드 변경 최소화가 필요했습니다. 본인 입장에서 파이프라인 도메인은 백지 상태로 투입됐습니다.",
    system:
      "인계받은 NestJS 5 서브시스템 모노레포 위에서 DAG 기획 UI 설계·구현 (Figma 없이 UI 코드 + Playwright e2e가 곧 기획 문서)을 진행했습니다. GitLab CI/CD 0에서 구축 + interfaces/csc-8 세부 설계 + ICD/SAD 80~100p docx 그대로 AI 학습 + 작은 단위 위배 검토 반복 + 운영 콘솔 작업 종료 자동 재배포 훅을 박았습니다.",
    impact:
      "백지 상태 직군 확장에도 불구하고 사수 인계 기본 설계 위에서 상세 설계·구현을 끌어냈습니다. 아키텍처가 확장 가능한 구조로 안정화되어 Sentinel 확장 + Snappy 알고리즘 DAG 처리 등이 시간 소요 없이 확장 가능합니다.",
    keywords: [
      "NestJS 5 서브시스템",
      "DAG 파이프라인",
      "pgmq",
      "GitLab CI/CD",
      "ICD/SAD 일관성 메커니즘",
      "Next.js 자동 재배포",
    ],
    trackVisibility: "both",
    ownContribution:
      "DAG 파이프라인 기획 UI 설계·구현 + GitLab CI/CD 0에서 구축 + interfaces/csc-8 세부 설계 (csc-7/9 후속 예정)",
    inheritedScope:
      "apps 폴더 구조 + natives/csc03·csc04 + pgmq + ICD/SAD (사수가 마무리한 기본 설계)",
    honestyNote:
      "pgmq·기술 스택 결정은 인계받은 기본 설계입니다. ICD/SAD는 읽고 이해해서 상세 설계로 추출했습니다. 사수는 힌트만 줬지만, 기본 설계가 잘 잡혀있어 수월했음도 함께 인정합니다.",
    qa: [
      {
        q: "본인이 한 일과 인계받은 일을 어떻게 구분하나?",
        a: "인계: apps 구조·natives/csc03·csc04·pgmq·ICD·SAD. 본인: DAG UI 기획·GitLab CI/CD·interfaces/csc-8 세부.",
      },
      {
        q: "도메인 지식 학습은 어떻게?",
        a: "AI 기반 + DAG UI 설계와 병렬로 학습했습니다. 모르는 내용은 도식화·이미지 요청으로 보완했고, ICD/SAD docx 직접 학습 + 작은 위배 검토를 반복했습니다.",
      },
      {
        q: "확장성이 어떻게 보장되나요?",
        a: "기획 → DAG 매핑 → 처리 프로파일의 3단 구조입니다. 새 위성·새 알고리즘이 와도 코드 변경이 거의 없습니다.",
      },
    ],
  },
  {
    slug: "him",
    title: "집비치기 (him)",
    subtitle: "AI native 100% 풀스택 사이드 프로젝트",
    badge: "4 + 5 (회사 역전이)",
    problem:
      "가정 재고 관리의 실제 페인 포인트(어디 갔지·유통기한·재고·재구매 알림)와 풀스택 증명 동기 — 혼자서 UI 기획·프론트·백·인프라 모든 분야가 가능함을 검증하고 싶었습니다.",
    system:
      "NestJS + CQRS + TypeORM + PostgreSQL + 프론트엔드 + Docker Compose + S3 + Terraform IaC + 백업 메트릭 → Grafana를 갖췄습니다. 회사 검증 아키텍처 패턴을 그대로 차용했으며 AI native 100%로 코드 작성은 AI, 사람 노드는 (1) UI 기획 + (2) 코드 연결 검토 + (3) e2e 테스트 셋으로 분리했습니다. DB는 사용자 격리를 위해 자체 인프라를 구축 중입니다.",
    impact:
      "개인 + 거점 공유자 1인 베타 운영 + 13+ 위키 자산 환류 (2단계 설계 프로세스·테스트 5-layer·정합성 31건 간극 정비·백업 메트릭 자동화·S3+Terraform 양쪽 레시피)를 달성했습니다. 회사로 역전이도 일어났습니다 — 집비치기 UI + current e2e 테스트 패턴이 회사 프론트엔드 강화에 도입 중이고, 4-Layer 패턴이 sar-search-and-analyzer 백엔드 설계에 적용됩니다.",
    keywords: [
      "AI native 100%",
      "NestJS + CQRS",
      "TypeORM",
      "Terraform IaC",
      "백업 메트릭 자동화",
      "e2e 회사 역전이",
      "4-Layer 회사 역전이",
      "자체 인프라 (DB 격리)",
    ],
    trackVisibility: "both",
    metrics: [
      { label: "AI 작성 코드", value: "100%" },
      { label: "누적 시간", value: "227h 13m" },
      { label: "위키 환류", value: "13+ 페이지" },
      { label: "정합성 간극 정비", value: "31건" },
    ],
    honestyNote:
      "UI 기획 검토 + 코드 연결 검토 + e2e 테스트만 사람입니다. 나머지 코드 작성은 모두 AI입니다. 회사 아키텍처를 가져온 점도 인정합니다 — 다만 그 위에서 AI native + 빈번 검토 사이클로 인간 단독 대비 더 안정적·고도화된다는 가설을 검증한 무대입니다.",
    images: [
      {
        src: "/projects/him/home.png",
        alt: "집비치기 모바일 앱 홈 — 위치별 재고 + D-day",
        caption: "모바일 앱 홈 — 위치별 재고(침대·주방·싱크대) + 임박일(D-30·D-29) + 카테고리 태그",
      },
    ],
  },
  {
    slug: "lumir-erp",
    title: "Lumir-ERP (사내 백오피스)",
    subtitle: "4 도메인 워크스트림 통합 — CMS 풀스택 + 자원예약·LRIM·면접관리 프론트엔드",
    badge: "4 (직군 안 · 4 도메인 적응)",
    problem:
      "루미르 사내 백오피스 4개 도메인(자원예약·CMS·LRIM 채용·LRIM 면접관리) 풀스택 구축이 필요했고, 사내 전 사원 + 채용 담당자·면접관·평가자 + 외부 입사지원자까지 사용자 풀이 가장 넓은 회사 프로젝트입니다.",
    system:
      "Next.js 14/15 (App Router) + TypeScript + Tailwind + shadcn/ui + SWR + Playwright를 사용했습니다. Plan(mock)/Current(실제 API) 환경 분리 패턴 (파트장 인계) + 도메인별 Context 패턴 + (cms)/(sms)/(ams)/(uam) 도메인 분리 + UAM은 MongoDB 직접 접근입니다. LRIM 두 앱은 pnpm + Turborepo 모노레포(@repo/ui·common·modules)입니다. AI native 100%로 코드 작성은 AI, 본인은 UI 기획 검토 + 코드 연결 검토 + e2e 테스트를 담당합니다.",
    impact:
      "사내 전 사원 + 외부 입사지원자까지 운영 중인 4 도메인 백오피스입니다. CMS는 풀스택 단독(기획·BE·테스트, 프론트 테스트 개선 중), 나머지 3개는 프론트 모든 기능을 담당했습니다. 핵심 자산은 프로젝트 4개가 아니라 4 도메인 동시 적응력과 CMS 풀-사이클 단독 경험입니다.",
    keywords: [
      "Next.js App Router",
      "Plan/Current 환경 분리",
      "CMS 풀스택 단독",
      "LRIM 채용·면접관리",
      "외부 입사지원자 노출",
      "AI native 100%",
      "Playwright E2E",
      "shadcn/ui",
    ],
    trackVisibility: "both",
    ownContribution:
      "4 워크스트림 모든 기능 구현 (자원예약·CMS·LRIM·면접관리). CMS는 풀스택 단독 (기획·BE·테스트). 4 워크스트림에 일관된 Plan/Current 패턴 적용.",
    inheritedScope:
      "Plan/Current 환경 분리 패턴 + WikiContext 등 도메인 컨텍스트 패턴 (파트장 설계). 본인은 4 워크스트림에 따라 적용하는 역할.",
    honestyNote:
      "Plan/Current 패턴과 도메인 컨텍스트 패턴은 파트장 설계입니다. 본인이 새로 만든 패턴이 아닙니다. CMS 프론트 테스트는 현재 개선 작업 중이며, 자원예약·LRIM은 프론트만 담당하고 백엔드는 외부입니다.",
    metrics: [
      { label: "워크스트림", value: "4 도메인" },
      { label: "CMS", value: "풀스택 단독" },
      { label: "외부 노출", value: "입사지원자" },
      { label: "AI 작성", value: "100%" },
    ],
    measurementPending: [
      "각 워크스트림 시작 시점",
      "누적 시간 (4 워크스트림 합산)",
      "사내 사용자 수",
      "외부 입사지원자 누적 수",
    ],
    qa: [
      {
        q: "Plan/Current 환경 분리 패턴을 설명해줄 수 있나요?",
        a: "파트장이 구축한 프론트 아키텍처입니다. planning은 mock 데이터로 UI·기획 마무리, current는 실제 백엔드 API 연결입니다. _services/에 v1·v2 버전 관리, 본인이 4 워크스트림에 일관 적용했습니다.",
      },
      {
        q: "4 워크스트림 동시 진행이 어떻게 가능했나요?",
        a: "AI native + 일관된 팀 패턴(Plan/Current·도메인 Context)·도메인 분리(api 경로 규칙) 덕분입니다. 개별 도메인 학습은 AI 사고 파트너로 흡수했습니다.",
      },
      {
        q: "본인이 설계한 부분과 인계받은 부분?",
        a: "인계: Plan/Current 환경 분리 + 도메인 Context 패턴 + 모노레포 구조. 본인: 4 워크스트림 모든 기능 구현 + CMS 백엔드·테스트.",
      },
      {
        q: "가장 자랑하는 부분?",
        a: "CMS 풀스택 단독 (기획부터 BE 테스트까지) — 4 워크스트림 중 유일한 풀-사이클입니다. 또는 4 도메인을 동시에 운영한 적응력 자체입니다.",
      },
    ],
  },
  {
    slug: "brain-trinity",
    title: "Brain Trinity",
    subtitle: "인지 부하 분산 + 도메인 적응 메커니즘의 시스템화",
    badge: "4 + 5 신호",
    problem:
      "생물학적 뇌를 중요한 업무에 집중하게 두려면 '중요하지만 항상 기억할 필요는 없는 내용'을 외부 시스템으로 분리해야 했습니다. 단순 노트앱은 검색은 되지만 합성·연결·재사용이 안 됐습니다 (트리거: Karpathy LLM Wiki 영상).",
    system:
      "Karpathy LLM Wiki 패턴 3-레이어 (raw/ 불변 + wiki/ AI 컴파일 + Output/ 파생) + Claude Code 협업 (단일 도구) + skill 시스템(ingest/lint/query) + frontmatter 스키마 + index/log 자동 갱신 + Obsidian 그래프 + MEMORY 자동 동기화를 갖췄습니다. AI 작성 100%로 사용자 입력은 프롬프트 채팅뿐입니다.",
    impact:
      "위키 페이지 56+ 누적, 매 ingest마다 자동 cross-link + raw frontmatter 동기화 + index/log 갱신이 일어납니다. 본 이력서·자가 진단·6개 프로젝트 자료 박스 자체가 Brain Trinity의 4단계 자동 작동의 살아있는 증거입니다. 향후 회사 프로젝트 묶음(sdpe + lumir-sar-platform) 통합 시 5단계 사내 시스템화 흐름이 가능합니다.",
    keywords: [
      "인지 부하 분산",
      "Karpathy /raw 패턴",
      "Claude Code 단일",
      "skill 시스템",
      "MEMORY 자동 동기화",
      "도메인 적응 메커니즘",
    ],
    trackVisibility: "robotics",
    honestyNote:
      "회사 프로젝트에 Brain Trinity 직접 적용 사례는 아직 없습니다 (sdpe + lumir-sar-platform 묶음 통합 계획 단계). 다만 본 이력서·자기 점검 시스템·entities 페이지 자체가 Brain Trinity의 4단계 자동 작동 살아있는 증거입니다.",
    metrics: [
      { label: "위키 페이지", value: "56+" },
      { label: "AI 작성", value: "100%" },
      { label: "AI 도구", value: "Claude Code 단일" },
    ],
  },
];

export const trackPositioning = {
  satellite: {
    label: "트랙 ① 위성·SAR 스타트업",
    brainTrinityMeaning: "SAR 도메인을 빠르게 흡수·확장한 도구의 증거물",
    sellingPoint: "SAR 도메인 디테일·정확도·결과물",
    headline:
      "SAR 도메인을 AI 사고 파트너 + 위키 컴파일로 학부 수준 → 5종 도구 다중 스택 + 5,143,119 PSI까지 끌어올렸습니다",
  },
  robotics: {
    label: "트랙 ② 로보틱스 스타트업",
    brainTrinityMeaning: "도메인 적응 시스템 그 자체 — 방법론·자산",
    sellingPoint: "메커니즘·확장성·다음 도메인 진입 가능성",
    headline:
      "정보 구조화 + AI native 기반이면 어떤 새 도메인도 같은 방식으로 진입한다고 봅니다. 임베디드·하드웨어·로보틱스로 자연 확장 가능합니다",
  },
} as const;
