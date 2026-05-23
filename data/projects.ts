/**
 * 5개 프로젝트 자료 박스
 * Brain Trinity wiki/ai/ai-usage-levels-seong-pm.md 정제 결과 (2026-05-20 ~ 2026-05-23)
 */

export type StageRange =
  | "3 → 4 + 5 신호"
  | "3+4(+5) 혼합"
  | "3+4 혼합"
  | "4 + 5 (회사 역전이)"
  | "4 + 5 신호"
  | "4 (직군 안 · 4 도메인 적응)";

export type TrackTag = "satellite" | "robotics" | "both";

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
}

export const projects: Project[] = [
  {
    slug: "lumir-linux-snap",
    title: "Sentinel-1 InSAR 처리 파이프라인",
    subtitle: "5종 도구 다중 스택 + AI native 진행 · 정부 공동 지표변위 모니터링",
    badge: "3 → 4 + 5 신호",
    problem:
      "정부 공공기관 공동 지표변위 모니터링 사업 — SNAP 단독 파이프라인 처리 속도 한계로 실시간 서비스화 불가. ASC 단독 SBAS의 LOS 1D 한계. 단일 건물 hot-spot 식별 최소 2 yr stack 필수.",
    system:
      "5종 도구 다중 스택 (SNAP 12 + SNAPHU 2.0.3 + MintPy 1.6.2 + StaMPS PSI + ISCE2 2.6.3) — 오버엔지니어링 방지 원칙 + AI 사고 파트너로 도구 평가 + 다중 Claude Code agent 워크트리 (agent 1~4 병렬 + gpt_isolated wrapper + handoff 시스템).",
    impact:
      "ISCE2 도입으로 처리 속도 확보 → InSAR 데이터 DB화·API 백엔드 연결·서비스화 단계 진입 가능. 광교산 시루봉 -17.30 mm/yr (GNSS 검증) + PSI 5,143,119 PS + 5m DEM TC. 사업 보고서 v1~v4 AI native로 작성 시간 0에 가까움.",
    keywords: [
      "Sentinel-1 SAR",
      "5종 도구 스택",
      "ISCE2 속도 확보",
      "다중 agent 워크트리",
      "5,143,119 PSI",
      "사업 보고서 자동화",
    ],
    trackVisibility: "both",
    honestyNote: "SAR 도메인은 본인 직군(웹 개발) 외 — AI 사고 파트너 없이 진입 불가능했을 영역.",
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
  },
  {
    slug: "sar-data-retrieval",
    title: "Sentinel SAR 검색·분석 백엔드",
    subtitle: "NestJS 모노레포 + CDSE + NAS PoC + DDD 5-layer + snap 통합 (AI native)",
    badge: "3+4(+5) 혼합",
    problem:
      "기존에 존재하지 않는 날씨·계절 무관 지표 변위 데이터 제공 플랫폼 + Sentinel SAR 검색·다운로드·메타데이터 통합 백엔드 부재 + snap 처리 결과를 사용자 위치 검색 가능한 형태로 제공할 서비스 레이어 부재.",
    system:
      "NestJS 모노레포 (sentinel-retrieval + ai-processing) + CDSE API + NAS(SMB2 vs 직접 FS) PoC + SLC 도메인 모델링 + DDD 5-layer + snap 자매 레포 통합 레이어. AI native 진행 — 예측 보일러플레이트 시점만 도메인 구조 일부 수정.",
    impact:
      "사용자 위치 요청에 기존 분석 즉시 제공 또는 신규 처리 후 제공 가능한 플랫폼 기초 백엔드. snap의 ISCE2 속도 확보 + sar-data-retrieval의 서비스 레이어 = 한 서비스의 두 레이어라는 통합 비전 확립.",
    keywords: [
      "NestJS 모노레포",
      "CDSE",
      "NAS SMB2/직접FS PoC",
      "DDD 5-layer",
      "SLC 도메인",
      "AI native",
      "snap 통합",
    ],
    trackVisibility: "both",
    metrics: [{ label: "DDD 계층", value: "5-layer" }, { label: "통합 외부 시스템", value: "CDSE + NAS" }],
  },
  {
    slug: "sdpe",
    title: "SDPE — SAR 처리 파이프라인 오케스트레이션",
    subtitle: "루미르 LumirX 위성 데이터 다단계 파이프라인 · NestJS 5 서브시스템 + DAG",
    badge: "3+4 혼합",
    problem:
      "LumirX 위성 원시 SAR 데이터(L0~L3) 다단계 파이프라인을 운영자가 구성·실행·추적·복구할 시스템 부재 + 새 위성·새 알고리즘 추가 시 코드 변경 최소화 필요 + 본인 입장에서 파이프라인 도메인은 백지 상태 투입.",
    system:
      "인계받은 NestJS 5 서브시스템 모노레포 위에서 DAG 기획 UI 설계·구현 (Figma 없이 UI 코드 + Playwright e2e가 곧 기획 문서) + GitLab CI/CD 0에서 구축 + interfaces/csc-8 세부 설계 + ICD/SAD 80~100p docx 그대로 AI 학습 + 작은 단위 위배 검토 반복 + 운영 콘솔 작업 종료 자동 재배포 훅.",
    impact:
      "백지 상태 직군 확장에도 불구하고 사수 인계 기본 설계 위에서 상세 설계·구현을 끌어냄. 아키텍처가 확장 가능한 구조로 안정화 — Sentinel 확장 + Snappy 알고리즘 DAG 처리 등 시간 소요 없이 확장 가능.",
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
    inheritedScope: "apps 폴더 구조 + natives/csc03·csc04 + pgmq + ICD/SAD (사수가 마무리한 기본 설계)",
    honestyNote: "pgmq·기술 스택 결정은 인계받은 기본 설계. ICD/SAD는 읽고 이해해 상세 설계 추출. 사수는 힌트만, 단 기본 설계가 잘 잡혀있어 수월했음도 인정.",
    qa: [
      {
        q: "본인이 한 일과 인계받은 일을 어떻게 구분하나?",
        a: "인계: apps 구조·natives/csc03·csc04·pgmq·ICD·SAD. 본인: DAG UI 기획·GitLab CI/CD·interfaces/csc-8 세부.",
      },
      {
        q: "도메인 지식 학습은 어떻게?",
        a: "AI 기반 + DAG UI 설계와 병렬로 학습. 모르는 내용은 도식화·이미지 요청으로 보완. ICD/SAD docx 직접 학습 + 작은 위배 검토 반복.",
      },
      {
        q: "확장성이 어떻게 보장되나요?",
        a: "기획 → DAG 매핑 → 처리 프로파일의 3단 구조. 새 위성·새 알고리즘이 와도 코드 변경 거의 없음.",
      },
    ],
  },
  {
    slug: "him",
    title: "집비치기 (him)",
    subtitle: "AI native 100% 풀스택 사이드 프로젝트",
    badge: "4 + 5 (회사 역전이)",
    problem:
      "가정 재고 관리의 실제 페인 포인트 — 어디 갔지 / 유통기한 / 몇 개 남았지 / 언제 사야 하지 / 알림. 단순 학습 무대가 아닌 진짜 풀어야 할 문제 + 풀스택 증명 동기 (혼자서 UI 기획·프론트·백·인프라 모든 분야 가능함을 증명).",
    system:
      "NestJS + CQRS + TypeORM + PostgreSQL + 프론트엔드 + Docker Compose + S3 + Terraform IaC + 백업 메트릭 → Grafana. 회사 검증 아키텍처 패턴을 그대로 차용. AI native 100% — 코드 작성은 AI, 사람 노드 = (1) UI 기획 + (2) 코드 연결 검토 + (3) e2e 테스트 셋만. DB는 사용자 격리를 위해 자체 인프라 구축 중.",
    impact:
      "개인 + 거점 공유자 1인 베타 운영. 13+ 위키 자산 환류 (2단계 설계 프로세스·테스트 5-layer·정합성 31건 간극 정비·백업 메트릭 자동화·S3+Terraform 양쪽 레시피). 회사로 역전이: 집비치기 UI + current e2e 테스트 패턴이 회사 프론트엔드 강화에 도입 중 — 수동 클릭 검증 → 자동 테스트 검증 전환 단계.",
    keywords: [
      "AI native 100%",
      "NestJS + CQRS",
      "TypeORM",
      "Terraform IaC",
      "백업 메트릭 자동화",
      "e2e 회사 역전이",
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
      "UI 기획 검토 + 코드 연결 검토 + e2e 테스트만 사람. 나머지 코드 작성은 모두 AI. 회사 아키텍처를 가져온 점도 인정 — 단, 그 위에서 AI native + 빈번 검토 사이클로 인간 단독 대비 더 안정적·고도화된다는 가설을 검증한 무대.",
  },
  {
    slug: "lumir-erp",
    title: "Lumir-ERP (사내 백오피스)",
    subtitle: "4 도메인 워크스트림 통합 — CMS 풀스택 + 자원예약·LRIM·면접관리 프론트엔드",
    badge: "4 (직군 안 · 4 도메인 적응)",
    problem:
      "루미르 사내 백오피스 4개 도메인(자원예약·CMS·LRIM 채용·LRIM 면접관리) 풀스택 구축. 사내 전 사원 + 채용 담당자·면접관·평가자 + 외부 입사지원자까지 사용 — 사용자 풀이 가장 넓은 회사 프로젝트.",
    system:
      "Next.js 14/15 (App Router) + TypeScript + Tailwind + shadcn/ui + SWR + Playwright. Plan(mock)/Current(실제 API) 환경 분리 패턴 (파트장 인계) + 도메인별 Context 패턴 + (cms)/(sms)/(ams)/(uam) 도메인 분리 + UAM은 MongoDB 직접. LRIM 두 앱은 pnpm + Turborepo 모노레포(@repo/ui·common·modules). AI native 100% — 코드 작성은 AI, 본인은 UI 기획 검토 + 코드 연결 검토 + e2e 테스트.",
    impact:
      "사내 전 사원 + 외부 입사지원자까지 운영 중인 4 도메인 백오피스. CMS는 풀스택 단독(기획·BE·테스트, 프론트 테스트 개선 중), 나머지 3개는 프론트 모든 기능. 핵심 자산은 프로젝트 4개가 아니라 *4 도메인 동시 적응력* + *CMS 풀-사이클 단독* 경험.",
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
      "Plan/Current 패턴과 도메인 컨텍스트 패턴은 파트장 설계 — 본인이 새로 만든 패턴이 아님. CMS 프론트 테스트는 현재 개선 작업 중 (100% 완성도 아님). 자원예약·LRIM은 프론트만 (백엔드 X).",
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
        a: "파트장이 구축한 프론트 아키텍처. planning은 mock 데이터로 UI·기획 마무리, current는 실제 백엔드 API 연결. _services/에 v1·v2 버전 관리. 본인이 4 워크스트림에 일관 적용했음.",
      },
      {
        q: "4 워크스트림 동시 진행이 어떻게 가능했나요?",
        a: "AI native + 일관된 팀 패턴(Plan/Current·도메인 Context)·도메인 분리(api 경로 규칙) 덕분. 개별 도메인 학습은 AI 사고 파트너로 흡수.",
      },
      {
        q: "본인이 설계한 부분과 인계받은 부분?",
        a: "인계: Plan/Current 환경 분리 + 도메인 Context 패턴 + 모노레포 구조. 본인: 4 워크스트림 모든 기능 구현 + CMS 백엔드·테스트.",
      },
      {
        q: "가장 자랑하는 부분?",
        a: "CMS 풀스택 단독 (기획부터 BE 테스트까지) — 4 워크스트림 중 유일한 풀-사이클. 또는 4 도메인을 동시에 운영한 적응력 자체.",
      },
    ],
  },
  {
    slug: "brain-trinity",
    title: "Brain Trinity",
    subtitle: "인지 부하 분산 + 도메인 적응 메커니즘의 시스템화",
    badge: "4 + 5 신호",
    problem:
      "생물학적 뇌를 중요한 업무에 집중하게 두려면 '중요하지만 항상 기억할 필요는 없는 내용'을 외부 시스템으로 분리해야 함. 단순 노트앱은 검색은 되지만 합성·연결·재사용이 안 됨. 트리거: Karpathy LLM Wiki 영상.",
    system:
      "Karpathy LLM Wiki 패턴 3-레이어 (raw/ 불변 + wiki/ AI 컴파일 + Output/ 파생) + Claude Code 협업 (단일 도구) + skill 시스템(ingest/lint/query) + frontmatter 스키마 + index/log 자동 갱신 + Obsidian 그래프 + MEMORY 자동 동기화. AI 작성 100% — 사용자 입력 = 프롬프트 채팅뿐.",
    impact:
      "위키 페이지 56+ 누적, 매 ingest마다 자동 cross-link + raw frontmatter 동기화 + index/log 갱신. 본 이력서 자료 박스·자가 점검 시스템·entities 페이지 자체가 Brain Trinity의 4단계 자동 작동 살아있는 증거. 향후 회사 프로젝트 묶음(sdpe + lumir-linux-snap + sar-data-retrieval) 통합 시 5단계 사내 시스템화 흐름.",
    keywords: [
      "인지 부하 분산",
      "Karpathy /raw 패턴",
      "Claude Code 단일",
      "skill 시스템",
      "MEMORY 자동 동기화",
      "도메인 적응 메커니즘",
    ],
    trackVisibility: "robotics", // 로보틱스 트랙에 결정적 변별점, 위성 트랙에서는 base 제외
    honestyNote:
      "회사 프로젝트에 Brain Trinity 직접 적용 사례는 아직 없음 (sdpe + lumir-linux-snap + sar-data-retrieval 묶음 통합 계획 단계). 단, 본 이력서 자료 박스·자기 점검 시스템·entities 페이지 자체가 Brain Trinity의 4단계 자동 작동 살아있는 증거.",
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
      "SAR 도메인을 AI 사고 파트너 + 위키 컴파일로 학부 수준 → 5종 도구 다중 스택 + 5,143,119 PSI까지 끌어올렸다",
  },
  robotics: {
    label: "트랙 ② 로보틱스 스타트업",
    brainTrinityMeaning: "도메인 적응 시스템 그 자체 — 방법론·자산",
    sellingPoint: "메커니즘·확장성·다음 도메인 진입 가능성",
    headline:
      "정보 구조화 + AI native 기반이면 어떤 새 도메인도 같은 방식으로 진입한다. 임베디드·하드웨어·로보틱스로 자연 확장 가능",
  },
} as const;
