/**
 * Resume — 이력서 base 버전 (회사 미정 시점)
 * Brain Trinity 자료 박스에서 추출. JD 정해지면 코스 조정.
 * 우선순위·강조: SAR/AI native 트랙 (snap·sdpe·sar-data-retrieval) > 집비치기·Brain Trinity > Lumir-ERP
 */

export interface ResumeRole {
  company: string;
  period: string;
  position: string;
  summary: string;
  projects: ResumeProject[];
}

export interface ResumeProject {
  name: string;
  slug?: string;
  badge?: string;
  period?: string;
  context: string; // 문제·맥락
  what: string[]; // 한 일 (시스템·결정)
  impact: string[]; // 임팩트·결과
  stack?: string[];
  honestyNote?: string;
}

export const resumeSummary = {
  oneLiner:
    "웹 개발자, SAR 도메인 확장 중 · AI를 사고 파트너로 두고 직군을 확장하면서 시스템을 함께 만드는 풀스택입니다.",
  paragraphs: [
    "프론트엔드 + 백엔드 + 인프라/CI-CD를 한 사람이 풀스택으로 다루며, 루미르 입사 후 만난 SAR/위성 도메인을 직군 확장으로 흡수해 적용하고 있습니다. 모든 코드 작업은 AI native 패턴으로 진행하며, 사람은 UI 기획·코드 연결 검토·e2e 테스트의 사람 노드를 맡고 있습니다.",
    "회사에서는 LumirX SAR 처리 파이프라인(SDPE)의 DAG UI 기획·구현·GitLab CI/CD 구축·인터페이스 세부 설계와, Sentinel SAR 검색·분석 NestJS 백엔드(sar-data-retrieval) + 자매 InSAR 처리 레포(lumir-linux-snap, 5종 도구 다중 스택), 사내 백오피스 4 도메인 풀스택(Lumir-ERP — CMS·자원예약·LRIM·면접관리)을 동시에 다루고 있습니다.",
    "사이드로는 집비치기(home-inventory-manager)를 AI native 100%로 운영하며 검증한 풀스택 e2e 테스트 패턴이 회사 프론트엔드 강화에 역도입되고 있고, Brain Trinity라는 메타 위키 시스템(Karpathy LLM Wiki + Claude Code + skill 시스템)을 운영해 이 이력서·포트폴리오 자체를 컴파일했습니다.",
  ],
  positioning: {
    headline: "AI native + 풀스택 + 도메인 적응력",
    bullets: [
      "AI native 100% — 코드 작성은 AI, 사람은 기획·설계·검토 노드입니다. 동시에 여러 워크스트림을 운영하는 시스템 설계자 모드를 추구합니다.",
      "도메인 적응력 — SAR/InSAR/MintPy/SNAPHU 같은 직군 외 영역도 AI 사고 파트너로 진입해 결과를 내며, 같은 메커니즘이 임베디드·로보틱스에도 작동한다고 봅니다.",
      "풀스택 + 사이클 — 기획·프론트·백·인프라·테스트·CI/CD까지 한 사이클을 책임지는 경험이 있습니다. CMS 풀스택 단독, GitLab CI/CD 0에서 구축 같은 사례가 있습니다.",
    ],
  },
};

export const resumeExperience: ResumeRole[] = [
  {
    company: "루미르 (Lumir)",
    period: "2023-12 ~ 현재 (2년 5개월차)",
    position: "웹 개발자 (풀스택 — 프론트·백·인프라·AI 확장)",
    summary:
      "Sentinel-1 SAR 위성 데이터 처리 파이프라인과 사내 백오피스를 동시에 다루는 풀스택 포지션입니다. 본인 직군은 웹 개발이고, SAR 도메인은 입사 후 직군 확장으로 흡수했습니다.",
    projects: [
      {
        name: "SDPE — SAR Data Process Element",
        slug: "sdpe",
        badge: "3+4 혼합 · 직군 확장 표본",
        context:
          "LumirX 위성 원시 SAR 데이터(L0~L3) 다단계 파이프라인을 운영자가 안전하게 구성·실행·추적·복구할 시스템이 필요했고, 본인은 백지 상태에서 SAR 처리 도메인에 투입됐습니다.",
        what: [
          "인계받은 NestJS 5 서브시스템 모노레포 위에서 DAG 파이프라인 기획 UI를 설계·구현 (Figma 없이 UI 코드 + Playwright e2e가 곧 기획 문서)",
          "GitLab CI/CD 파이프라인을 서버 설치부터 커스텀 메일 알림·runner 구동까지 0에서 구축",
          "interfaces/csc-8 세부 설계 (csc-7/9 후속 예정)",
          "ICD/SAD 80~100p docx를 AI에 직접 학습시키고 '이 부분 위배되지 않나?' 패턴으로 작은 단위 위배 검토를 반복하는 일관성 메커니즘",
          "운영 콘솔(Next.js) 작업 종료 자동 재배포 훅 박음",
        ],
        impact: [
          "백지 상태 직군 확장에도 사수 인계 기본 설계 위에서 상세 설계·구현을 끌어냈습니다",
          "아키텍처가 기획만 정리하면 새 위성(Sentinel)·새 알고리즘(Snappy)이 시간 소요 없이 확장 가능한 구조로 안정화",
        ],
        stack: ["NestJS", "Next.js", "pgmq", "GitLab CI/CD", "Playwright", "TypeScript strict"],
        honestyNote:
          "pgmq·apps 구조·natives/csc·ICD/SAD는 사수 인계 설계. 본인은 DAG UI·CI/CD·csc-8 세부와 ICD/SAD 학습 메커니즘 적용을 담당했습니다.",
      },
      {
        name: "sar-data-retrieval (lumir-sar_analytics-and-retrieval)",
        slug: "sar-data-retrieval",
        badge: "3+4(+5) 혼합",
        context:
          "기존에 존재하지 않는 *날씨·계절 무관 지표 변위 데이터 제공* 플랫폼의 기초가 되는 Sentinel SAR 검색·분석·서비스화 백엔드가 필요했습니다.",
        what: [
          "NestJS 모노레포 (sentinel-retrieval 메인 + ai-processing 보조) 설계·구현 — 본인 단독",
          "CDSE (Copernicus Data Space) 외부 API 통합 + 호출 예시 80KB 분량 축적",
          "NAS 통합 PoC — SMB2 vs 직접 FS 마운트 두 모드 검증·의사결정 박제",
          "SLC 도메인 모델링 — ERD + 시나리오 + 유즈케이스 3종",
          "DDD 5-layer 테스트 분리 전략 적용",
          "자매 레포 snap(Snappy/MintPy 지반 침하 분석) 통합 — AI native 진행으로 처리 결과를 본 프로젝트 DB·API에 연결",
        ],
        impact: [
          "사용자 위치 요청에 기존 분석 즉시 제공 또는 신규 처리 후 제공이 가능한 플랫폼 기초 백엔드를 완성했습니다",
          "snap의 ISCE2 처리 속도 확보 + 본 프로젝트 서비스 레이어 = '한 서비스의 두 레이어' 통합 비전을 확립했습니다",
          "예측되는 보일러플레이트 시점만 도메인 구조 일부 수정하는 AI native 진행 패턴을 정립했습니다",
        ],
        stack: [
          "NestJS",
          "TypeScript",
          "CQRS",
          "TypeORM",
          "PostgreSQL",
          "CDSE API",
          "NAS (SMB2)",
          "DDD 5-layer",
          "Testcontainers",
        ],
      },
      {
        name: "lumir-linux-snap — Sentinel-1 InSAR 5종 도구 다중 스택",
        slug: "lumir-linux-snap",
        badge: "3 → 4 + 5 신호",
        context:
          "정부 공공기관 공동 지표변위 모니터링 사업에 참조 DSM·시계열 분석 파이프라인이 없었고, SNAP 단독으로는 처리 속도가 한계라 실시간 서비스화가 불가능했습니다.",
        what: [
          "ESA SNAP 12 + SNAPHU + MintPy + StaMPS PSI + ISCE2 — 5종 도구 다중 스택 설계·운영",
          "오버엔지니어링 방지 원칙 — 필요한 시점에만 도구 추가, 모든 도구 평가·선정에 AI를 사고 파트너로 활용",
          "다중 Claude Code agent 워크트리 — agent 1~4 병렬 + gpt_isolated.sh user dir race wrapper + agents-pause.sh + AGENT_BRIEF.md 표준 + docs/handoff/ 인수인계 시스템",
          "1.12 yr → 2.30 yr stack 확장 + PyAPS + ERA5 대기 보정 + 5m DEM TC",
          "사업 보고서 v1~v4 + policy briefing PDF — AI native로 작성 시간이 0에 가까웠습니다",
        ],
        impact: [
          "ISCE2 도입으로 처리 속도를 확보해 sar-data-retrieval과 통합되는 서비스화 단계 진입이 가능해졌습니다",
          "광교산 시루봉 -17.30 mm/yr 절대 침하를 GNSS(SUWN)로 검증 + PSI 5,143,119 PS 검출",
          "단일 건물 hot-spot 식별 최소 2 yr stack 필수라는 결론을 정량 데이터로 확립",
        ],
        stack: ["ESA SNAP 12", "SNAPHU", "MintPy", "StaMPS (Octave)", "ISCE2", "Python", "QGIS"],
        honestyNote:
          "SAR 도메인은 본인 직군(웹 개발) 외 영역입니다. AI를 사고 파트너로 두지 않았다면 진입이 불가능했을 영역으로 평가합니다 (3단계 직군 확장의 표본 사례).",
      },
      {
        name: "Lumir-ERP — 사내 백오피스 4 도메인 통합",
        slug: "lumir-erp",
        badge: "4 (직군 안 · 4 도메인 적응)",
        context:
          "루미르 사내 백오피스 4개 도메인(자원예약·CMS·LRIM 채용·LRIM 면접관리)을 풀스택으로 구축할 필요가 있었고, 사용자 풀은 사내 전 사원 + 외부 입사지원자까지였습니다.",
        what: [
          "자원예약/일정관리 (calendar·schedule-status) — 프론트엔드 모든 기능",
          "CMS — 풀스택 단독 (기획·백엔드·테스트). 프론트 테스트는 현재 개선 작업 중",
          "LRIM 채용관리 (apps/lrim) — 프론트엔드 모든 기능",
          "LRIM 면접관리 (apps/lrim-interview-management) — 외부 입사지원자가 면접 일정을 선택해서 제출하는 어플리케이션. 프론트엔드 모든 기능",
          "Plan(mock)/Current(실제 API) 환경 분리 패턴 + 도메인 Context 패턴을 4 워크스트림에 일관 적용",
        ],
        impact: [
          "사내 전 사원 + 채용 담당자·면접관·평가자 + 외부 입사지원자까지 운영 중인 4 도메인 백오피스",
          "프로젝트 4개가 아니라 *4 도메인 동시 적응력*과 *CMS 풀-사이클 단독* 경험이 핵심 자산입니다",
        ],
        stack: ["Next.js 14/15", "App Router", "TypeScript", "Tailwind", "shadcn/ui", "SWR", "Playwright"],
        honestyNote:
          "Plan/Current 환경 분리 + WikiContext 등 도메인 컨텍스트 패턴은 파트장이 설계한 프론트 아키텍처입니다. 본인은 4 워크스트림에 일관 적용했습니다.",
      },
    ],
  },
];

export const resumeSideProjects: ResumeProject[] = [
  {
    name: "집비치기 (him · home-inventory-manager)",
    slug: "him",
    badge: "4 + 5 (회사 역전이)",
    period: "2026-03 ~ 현재 · 누적 227h",
    context:
      "가정 재고 관리의 실제 페인 포인트(어디 갔지·유통기한·재고·재구매 알림)와 풀스택 증명 동기 — 혼자서 UI 기획·프론트·백·인프라 모든 분야가 가능함을 검증하고 싶었습니다.",
    what: [
      "NestJS + CQRS + TypeORM + PostgreSQL + 별도 프론트엔드 + Docker Compose + S3 + Terraform IaC + 백업 메트릭 → Grafana",
      "회사 검증 아키텍처 패턴을 그대로 차용 (양방향 전이의 시작점)",
      "AI native 100% — 코드 작성은 AI, 사람 노드는 UI 기획 + 코드 연결 검토 + e2e 테스트 셋만",
      "DB 사용자 격리를 위해 자체 인프라 구축 진행 중",
    ],
    impact: [
      "13+ 위키 자산 환류 (2단계 설계 프로세스·테스트 5-layer·정합성 31건 간극 정비·백업 메트릭 자동화)",
      "**회사로 역전이**: 집비치기 UI + current e2e 테스트 패턴이 회사 프론트엔드 강화에 도입 중 — 수동 클릭 검증 → 자동 테스트 검증 전환 단계",
      "AI native 100% 통찰: 사람이 직접 작성하면 검토는 간헐적, AI native + 사람 검토는 빈번·주기적 → 더 안정적·고도화 (엔티티만이 아니라 프론트·인프라·기획·UI 모두에 적용)",
    ],
    stack: ["NestJS", "CQRS", "TypeORM", "PostgreSQL", "Terraform IaC", "S3", "Grafana", "Playwright"],
  },
  {
    name: "Brain Trinity — AI 협업 위키 컴파일 시스템",
    slug: "brain-trinity",
    badge: "4 + 5 신호 · 로보틱스 트랙 변별점",
    period: "2026-04-16 ~ 현재 · 위키 56+ 누적",
    context:
      "생물학적 뇌를 중요한 업무에 집중하게 두려면 '중요하지만 항상 기억할 필요는 없는 내용'을 외부 시스템으로 분리해야 했고, 단순 노트앱은 검색은 되지만 합성·연결·재사용이 안 됐습니다.",
    what: [
      "Karpathy LLM Wiki 패턴 3-레이어 (raw/ 불변 + wiki/ AI 컴파일 + Output/ 파생)",
      "Claude Code 단일 도구 협업 (다른 AI 도구 사용 없음)",
      "skill 시스템 — ingest / lint / query 정의",
      "frontmatter 스키마 + index/log 자동 갱신 + Obsidian 그래프 + MEMORY 자동 동기화",
      "AI 작성 100% — 사용자 입력 = 프롬프트 채팅뿐",
    ],
    impact: [
      "위키 페이지 56+ 누적, 매 ingest마다 자동 cross-link + raw frontmatter 동기화 + index/log 갱신",
      "**이 포트폴리오와 이력서·자가 진단·6개 프로젝트 자료 박스가 모두 Brain Trinity 컴파일 결과** — 시스템 자체가 4단계 자동 작동의 살아있는 증거",
      "새로운 도메인이 나타나도 정보 구조화 + AI native 기반이면 해결하지 못할 일이 없다고 봅니다 — 임베디드·하드웨어·로보틱스로 자연 확장",
    ],
    stack: ["Karpathy /raw 패턴", "Claude Code", "skill 시스템", "frontmatter 스키마", "Obsidian", "MEMORY"],
  },
];

export const resumeContacts = {
  email: "dnr8874@gmail.com",
  github: "https://github.com/wukdddang",
  brainTrinityNote: "Brain Trinity 시연 — 면접에서 직접 시현 가능합니다.",
};
