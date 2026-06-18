/**
 * Resume — 이력서 base 버전 (회사 미정 시점)
 * Brain Trinity 자료 박스에서 추출. JD 정해지면 코스 조정.
 * Bilingual {ko, en} fields throughout.
 */

import type { L } from "./i18n";

export interface ResumeProject {
  name: L;
  slug?: string;
  badge?: L;
  period?: L;
  context: L;
  what: L[];
  impact: L[];
  stack?: string[];
  honestyNote?: L;
}

export interface ResumeRole {
  company: L;
  period: L;
  position: L;
  summary: L;
  projects: ResumeProject[];
}

export interface ResumeEducation {
  school: L;
  degree: L;
  period: L;
  note?: L;
}

export const resumeSummary = {
  oneLiner: {
    ko: "지형공간정보 석사(지각변동·GNSS) 배경 위에, 위성 InSAR로 지표 변위를 직접 측정·검증하고 그 위의 시스템까지 짓는 풀스택 엔지니어입니다. 연구 도메인 이해와 프로덕션 엔지니어링을 한 사람이 겸합니다.",
    en: "A full-stack engineer on a geospatial-engineering M.S. foundation (crustal deformation · GNSS), who measures and validates ground displacement with satellite InSAR and builds the systems on top of it. I pair research-domain understanding with production engineering in one person.",
  } satisfies L,
  paragraphs: [
    {
      ko: "성균관대에서 토목공학(학사)과 지형공간정보공학(석사, 학위논문 「한반도 동남권 지각변동 모델 개발」·GNSS)을 했습니다. 그래서 위성 InSAR가 측정하는 '지표·지각 변위'는 제 연구 주제 그 자체이고, SAR 처리 도구·파이프라인은 입사 후 AI를 사고 파트너 삼아 빠르게 익혔습니다. 동시에 기획·프론트·백엔드·인프라/CI-CD까지 풀스택으로 맡으며, 코드 작성은 AI가, 저는 기획·검토·e2e 테스트로 동작을 보증하는 '사람이 책임지는 노드'에 집중합니다(AI native).",
      en: "I studied Civil Engineering (B.S.) and Geospatial Information Engineering (M.S., thesis: a crustal-deformation model for southeastern Korea, GNSS-based) at Sungkyunkwan University. So the 'ground / crustal displacement' that satellite InSAR measures is my own research topic; the SAR processing tools and pipelines I picked up after joining, with AI as a thinking partner. In parallel I own the full stack — planning, frontend, backend, infra/CI-CD — working AI-native: AI writes the code while I focus on the human-owned nodes (planning, review, e2e tests that guarantee behavior).",
    },
    {
      ko: "회사에서는 성격이 다른 세 갈래 일을 동시에 끌고 갑니다. (1) **LumirX 위성 SAR 처리 파이프라인(SDPE)** — 운영자가 처리 단계를 구성·실행하는 DAG UI를 만들고, GitLab CI/CD를 맨바닥부터 구축했으며, 처리 단계 사이의 인터페이스를 세부 설계했습니다. (2) **Sentinel SAR 검색·분석 백엔드(sar-data-retrieval, NestJS)** 와 실제 InSAR 분석을 담당하는 별도 레포(lumir-linux-snap, 분석 도구 5종을 묶은 다중 스택). (3) **사내 백오피스 4개 도메인(Lumir-ERP — CMS·자원예약·채용·면접관리)** 풀스택.",
      en: "At work I run three quite different workstreams in parallel: (1) the **LumirX SAR processing pipeline (SDPE)** — I built the DAG UI operators use to compose and run processing stages, stood up GitLab CI/CD from scratch, and did the detailed design of the interfaces between stages; (2) the **Sentinel SAR search/analysis backend (sar-data-retrieval, NestJS)** plus a separate repo that handles the actual InSAR analysis (lumir-linux-snap, a 5-tool stack); and (3) a four-domain **internal back office (Lumir-ERP — CMS · resource scheduling · hiring · interview management)**, full-stack.",
    },
    {
      ko: "사이드 프로젝트도 그냥 취미가 아니라 회사 일과 양방향으로 이어집니다. 가정 재고 관리 앱 **'집비치기'** 를 AI native 100%로 직접 만들어 풀스택 e2e 테스트 패턴을 검증했고, 그 패턴이 지금 거꾸로 회사 프론트엔드 강화에 도입되고 있습니다. 또 **'Brain Trinity'** 라는 개인 지식 시스템(위키를 AI가 컴파일하는 구조)을 운영하는데, 지금 보고 계신 이 이력서와 포트폴리오 자체가 그 시스템이 만들어낸 결과물입니다.",
      en: "My side projects aren't just hobbies — they loop back into work both ways. I built **'him' (home-inventory-manager)** 100% AI-native and validated a full-stack e2e testing pattern there; that pattern is now being adopted, in reverse, to strengthen the company frontend. I also run **'Brain Trinity'**, a personal knowledge system where AI compiles a wiki — and this very resume and portfolio are outputs of that system.",
    },
  ] satisfies L[],
  positioning: {
    headline: {
      ko: "지형공간 연구 배경 × 풀스택 시스템 × AI native",
      en: "Geospatial research × full-stack systems × AI-native",
    } satisfies L,
    bullets: [
      {
        ko: "**AI native 100%** — 코드는 AI가 쓰고, 사람은 기획·설계·검토를 책임지는 노드입니다. 한 명이 여러 워크스트림을 동시에 굴리는 '시스템 설계자' 모드를 지향합니다.",
        en: "**100% AI-native** — AI writes the code; the human is the node that owns planning, design, and review. I aim for a 'system-designer' mode where one person keeps several workstreams running at once.",
      },
      {
        ko: "**연구 도메인 이해 + 적응력** — 지표·지각 변위는 석사 전공(지각변동·GNSS)이라 방법론을 판단할 수 있고, 새 처리 도구(SAR·InSAR·MintPy·SNAPHU)는 AI를 사고 파트너 삼아 익혀 실제 결과를 냅니다.",
        en: "**Research-domain understanding + adaptability** — ground/crustal displacement is my master's field (crustal deformation · GNSS), so I can judge the methodology; the new processing tools (SAR, InSAR, MintPy, SNAPHU) I learned with AI as a thinking partner to produce real results.",
      },
      {
        ko: "**풀스택 · 한 사이클 책임** — 기획·프론트·백엔드·인프라·테스트·CI/CD까지 한 사이클을 끝까지 책임진 경험이 있습니다. 예를 들어 CMS를 풀스택 단독으로 납품했고, GitLab CI/CD를 맨바닥부터 구축했습니다.",
        en: "**Full-stack · owns the whole cycle** — I've taken full cycles end to end: planning · frontend · backend · infra · testing · CI/CD. For example, I delivered a CMS solo full-stack and stood up GitLab CI/CD from scratch.",
      },
    ] satisfies L[],
  },
};

export const resumeExperience: ResumeRole[] = [
  {
    company: { ko: "루미르 (Lumir)", en: "Lumir" },
    period: {
      ko: "2023-11 ~ 현재",
      en: "Nov 2023 – present",
    },
    position: {
      ko: "웹 개발자 (풀스택 — 프론트·백·인프라·AI 확장)",
      en: "Web Developer (full-stack — frontend · backend · infra · AI expansion)",
    },
    summary: {
      ko: "Sentinel-1 SAR 위성 데이터 처리 파이프라인과 사내 백오피스를 동시에 다루는 풀스택 포지션입니다. 본인 직군은 웹 개발이고, SAR 도메인은 입사 후 직군 확장으로 흡수했습니다.",
      en: "A full-stack role running the Sentinel-1 SAR pipeline and the internal back office in parallel. My primary role is web development; the SAR domain is a role expansion absorbed after joining.",
    },
    projects: [
      {
        name: {
          ko: "루미르 SAR 데이터 플랫폼 (3 레이어 통합)",
          en: "Lumir SAR Data Platform (3-layer integration)",
        },
        slug: "lumir-sar-platform",
        badge: {
          ko: "3 레이어 단독 통합 (저장·분석·프론트)",
          en: "Solo-integrated 3 layers (storage · analysis · frontend)",
        },
        context: {
          ko: "Sentinel과 LumirX 위성 데이터를 사내에서 검색·저장·분석·요청까지 한 사이클로 처리할 통합 서비스가 부재했습니다. 데이터 저장(NAS+CDSE), InSAR 분석(SNAP·ISCE2·MintPy), 사용자 진입 프론트엔드 3 레이어를 본인이 단독으로 묶고 있습니다.",
          en: "There was no integrated service that handled Sentinel and LumirX data from search → storage → analysis → request as one cycle. I'm solo-bundling all three layers — storage (NAS + CDSE), InSAR analysis (SNAP · ISCE2 · MintPy), and the user-facing frontend.",
        },
        what: [
          {
            ko: "**저장 레이어** (sar-data-retrieval) — NestJS 모노레포 단독 + CDSE 외부 API 통합 + NAS PoC (SMB2 vs 직접 FS) + SLC 도메인 모델링 + DDD 5-layer 테스트 분리",
            en: "**Storage layer** (sar-data-retrieval) — solo NestJS monorepo + CDSE external API integration + NAS PoC (SMB2 vs direct FS) + SLC domain modeling + DDD 5-layer test separation.",
          },
          {
            ko: "**분석 레이어** (lumir-linux-snap) — 5종 도구 다중 스택 (SNAP 12 + SNAPHU + MintPy + StaMPS PSI + ISCE2) + 다중 Claude Code agent 워크트리 (agent 1~4 병렬) + 1.12 yr → 2.30 yr stack 확장 + 사업 보고서 v1~v4 AI native 자동화",
            en: "**Analysis layer** (lumir-linux-snap) — 5-tool stack (SNAP 12 + SNAPHU + MintPy + StaMPS PSI + ISCE2) + multi-Claude-Code agent worktrees (agents 1–4 in parallel) + stack extended from 1.12 yr to 2.30 yr + AI-native automation of program reports v1–v4.",
          },
          {
            ko: "**프론트 레이어** (sar-search-and-analyzer) — Next.js + Plan/Current 환경 분리 + 지도 기반 AOI 폴리곤 + 카탈로그 검색 + InSAR 분석 요청 UI (순수 프론트엔드 — 백엔드는 별도 레포 sar-data-retrieval)",
            en: "**Frontend layer** (sar-search-and-analyzer) — Next.js + Plan/Current environment split + map-based AOI polygons + catalog search + InSAR-request UI (frontend-only — the backend is the separate sar-data-retrieval repo).",
          },
          {
            ko: "오버엔지니어링 방지 원칙 + 모든 도구 평가·선정에 AI 사고 파트너 활용 + AI native 100%",
            en: "Anti-over-engineering as the working principle, AI as a thinking partner for every tool-evaluation decision, 100% AI-native.",
          },
        ],
        impact: [
          {
            ko: "ISCE2 도입으로 처리 속도를 확보해 *날씨·계절 무관 지표 변위 데이터 서비스화* 단계에 진입했습니다",
            en: "Introducing ISCE2 unlocked the processing speed needed to bring *weather- and season-independent surface-displacement data as a service* within reach.",
          },
          {
            ko: "광교산 시루봉 -17.30 mm/yr 절대 침하 GNSS(SUWN) 검증 + PSI 5,143,119 PS 검출 + 5m DEM TC 적용",
            en: "Verified Mt. Sirubong absolute subsidence of −17.30 mm/yr against GNSS (SUWN), detected 5,143,119 PSI scatterers, applied 5 m DEM terrain correction.",
          },
          {
            ko: "사용자가 지도에서 위치를 요청하면 저장된 분석 데이터를 즉시 제공하거나 신규 처리 후 제공하는 흐름을 한 사람이 풀스택으로 묶고 있다는 점이 핵심 자산입니다",
            en: "The core asset: a single person owns the full-stack flow that turns a user's location pick into either an instant cached result or a freshly-processed one.",
          },
        ],
        stack: [
          "NestJS",
          "Next.js",
          "TypeORM",
          "PostgreSQL",
          "CDSE",
          "NAS (SMB2)",
          "ESA SNAP 12 · SNAPHU · MintPy · StaMPS · ISCE2",
          "Python · QGIS",
          "Playwright",
        ],
        honestyNote: {
          ko: "각 레이어의 일부 패턴은 외부 인계입니다 — Plan/Current 환경 분리(파트장)·일부 SAR 도메인 지식(AI 사고 파트너 도움).",
          en: "Some patterns in each layer came from elsewhere — the Plan/Current split (team lead) and parts of the SAR domain knowledge (AI as a thinking partner).",
        },
      },
      {
        name: {
          ko: "SDPE — SAR 처리 파이프라인 오케스트레이션",
          en: "SDPE — SAR processing pipeline orchestration",
        },
        slug: "sdpe",
        badge: {
          ko: "직군 확장 · SAR 처리 도메인 진입",
          en: "Role expansion · into SAR processing",
        },
        context: {
          ko: "LumirX 위성 원시 SAR 데이터(L0~L3) 다단계 파이프라인을 운영자가 안전하게 구성·실행·추적·복구할 시스템이 필요했고, 본인은 백지 상태에서 SAR 처리 도메인에 투입됐습니다.",
          en: "We needed a system that lets operators safely configure, run, trace, and recover the LumirX L0–L3 SAR pipeline. I was dropped into the SAR processing domain blank-slate.",
        },
        what: [
          {
            ko: "인계받은 NestJS 5 서브시스템 모노레포 위에서 DAG 파이프라인 기획 UI를 설계·구현 (Figma 없이 UI 코드 + Playwright e2e가 곧 기획 문서)",
            en: "On top of an inherited NestJS 5-subsystem monorepo, designed and built the DAG-pipeline planning UI (no Figma — the UI code plus Playwright e2e is the planning document).",
          },
          {
            ko: "GitLab CI/CD 파이프라인을 서버 설치부터 커스텀 메일 알림·runner 구동까지 0에서 구축",
            en: "Built the GitLab CI/CD pipeline from zero — server install, custom mail notifications, runner setup.",
          },
          {
            ko: "interfaces/csc-8 세부 설계 (csc-7/9 후속 예정)",
            en: "Detailed design for interfaces/csc-8 (csc-7/9 to follow).",
          },
          {
            ko: "ICD/SAD 80~100p docx를 AI에 직접 학습시키고 '이 부분 위배되지 않나?' 패턴으로 작은 단위 위배 검토를 반복하는 일관성 메커니즘",
            en: "Fed the 80–100-page ICD/SAD docx directly into AI and ran a tight loop of small 'does this break the rule?' reviews — a consistency mechanism.",
          },
          {
            ko: "운영 콘솔(Next.js) 작업 종료 자동 재배포 훅 박음",
            en: "Wired up an auto-redeploy hook for the ops console (Next.js) that fires on work completion.",
          },
        ],
        impact: [
          {
            ko: "백지 상태 직군 확장에도 사수 인계 기본 설계 위에서 상세 설계·구현을 끌어냈습니다",
            en: "Despite a blank-slate role expansion, produced detailed design and implementation on top of my senior's base design.",
          },
          {
            ko: "아키텍처가 기획만 정리하면 새 위성(Sentinel)·새 알고리즘(Snappy)이 시간 소요 없이 확장 가능한 구조로 안정화",
            en: "Settled the architecture into a shape where, once the planning is done, a new satellite (Sentinel) or algorithm (Snappy) costs near-zero time to add.",
          },
        ],
        stack: [
          "NestJS",
          "Next.js",
          "pgmq",
          "GitLab CI/CD",
          "Playwright",
          "TypeScript strict",
        ],
        honestyNote: {
          ko: "pgmq·apps 구조·natives/csc·ICD/SAD는 사수 인계 설계. 본인은 DAG UI·CI/CD·csc-8 세부와 ICD/SAD 학습 메커니즘 적용을 담당했습니다.",
          en: "pgmq, the apps structure, natives/csc, and the ICD/SAD were the senior's inherited design. I owned the DAG UI, CI/CD, csc-8 detail, and applying the ICD/SAD learning mechanism.",
        },
      },
      {
        name: {
          ko: "Lumir-ERP — 사내 백오피스 4 도메인 통합",
          en: "Lumir-ERP — 4-domain internal back office",
        },
        slug: "lumir-erp",
        badge: {
          ko: "4 도메인 동시 적응 (직군 안)",
          en: "4 domains in parallel (in-role)",
        },
        context: {
          ko: "루미르 사내 백오피스 4개 도메인(자원예약·CMS·LRIM 채용·LRIM 면접관리)을 풀스택으로 구축할 필요가 있었고, 사용자 풀은 사내 전 사원 + 외부 입사지원자까지였습니다.",
          en: "We needed full-stack delivery across four internal back-office domains (resource scheduling · CMS · LRIM hiring · LRIM interview management); the user pool spanned every employee plus external applicants.",
        },
        what: [
          {
            ko: "자원예약/일정관리 (calendar·schedule-status) — 프론트엔드 모든 기능",
            en: "Resource scheduling / calendar / schedule-status — all frontend functionality.",
          },
          {
            ko: "CMS — 풀스택 단독 (기획·백엔드·테스트). 프론트 테스트는 현재 개선 작업 중",
            en: "CMS — solo full-stack (planning · backend · tests). Frontend tests are currently being improved.",
          },
          {
            ko: "LRIM 채용관리 (apps/lrim) — 프론트엔드 모든 기능",
            en: "LRIM hiring (apps/lrim) — all frontend functionality.",
          },
          {
            ko: "LRIM 면접관리 (apps/lrim-interview-management) — 외부 입사지원자가 면접 일정을 선택해서 제출하는 어플리케이션. 프론트엔드 모든 기능",
            en: "LRIM interview management (apps/lrim-interview-management) — applicants pick and submit interview slots. All frontend.",
          },
          {
            ko: "Plan(mock)/Current(실제 API) 환경 분리 패턴 + 도메인 Context 패턴을 4 워크스트림에 일관 적용",
            en: "Applied the Plan (mock) / Current (real API) environment split + domain-Context pattern consistently across all four workstreams.",
          },
        ],
        impact: [
          {
            ko: "사내 전 사원 + 채용 담당자·면접관·평가자 + 외부 입사지원자까지 운영 중인 4 도메인 백오피스",
            en: "A 4-domain back office running in production for every employee, recruiters, interviewers, evaluators, and external applicants.",
          },
          {
            ko: "프로젝트 4개가 아니라 *4 도메인 동시 적응력*과 *CMS 풀-사이클 단독* 경험이 핵심 자산입니다",
            en: "The asset isn't 'four projects' — it's *adapting to four domains simultaneously* and the *solo full-cycle CMS experience*.",
          },
        ],
        stack: [
          "Next.js 14/15",
          "App Router",
          "TypeScript",
          "Tailwind",
          "shadcn/ui",
          "SWR",
          "Playwright",
        ],
        honestyNote: {
          ko: "Plan/Current 환경 분리 + WikiContext 등 도메인 컨텍스트 패턴은 파트장이 설계한 프론트 아키텍처입니다. 본인은 4 워크스트림에 일관 적용했습니다.",
          en: "The Plan/Current split and domain-context patterns like WikiContext are the team lead's frontend architecture. I applied them consistently across the four workstreams.",
        },
      },
    ],
  },
];

export const resumeEducation: ResumeEducation[] = [
  {
    school: { ko: "성균관대학교", en: "Sungkyunkwan University" },
    degree: {
      ko: "건설환경시스템공학과 · 지형공간정보공학 석사",
      en: "M.S., Geospatial Information Engineering",
    },
    period: { ko: "2023.02 졸업", en: "Feb 2023" },
    note: {
      ko: "학위논문 「한반도 동남권 지각변동 모델 개발」(GNSS 기반) — 위성 InSAR가 측정하는 지표·지각 변위와 같은 물리 현상입니다.",
      en: "Thesis: \"A crustal-deformation model for southeastern Korea\" (GNSS-based) — the very phenomenon satellite InSAR measures.",
    },
  },
  {
    school: { ko: "성균관대학교", en: "Sungkyunkwan University" },
    degree: { ko: "토목공학 학사", en: "B.S., Civil Engineering" },
    period: { ko: "2021.02 졸업", en: "Feb 2021" },
  },
];

export const resumeSideProjects: ResumeProject[] = [
  {
    name: {
      ko: "집비치기 (him · home-inventory-manager)",
      en: "him (home-inventory-manager)",
    },
    slug: "him",
    badge: {
      ko: "사이드 → 회사 역전이",
      en: "Side project → back-transferred to work",
    },
    period: {
      ko: "2026-03 ~ 현재 · 누적 227h",
      en: "Mar 2026 – present · 227 cumulative hours",
    },
    context: {
      ko: "가정 재고 관리의 실제 페인 포인트(어디 갔지·유통기한·재고·재구매 알림)와 풀스택 증명 동기 — 혼자서 UI 기획·프론트·백·인프라 모든 분야가 가능함을 검증하고 싶었습니다.",
      en: "Real household-inventory pain points (where did it go · expirations · stock · re-order alerts) plus a personal motive — prove I can solo every layer: UI planning, frontend, backend, infra.",
    },
    what: [
      {
        ko: "NestJS + CQRS + TypeORM + PostgreSQL + 별도 프론트엔드 + Docker Compose + S3 + Terraform IaC + 백업 메트릭 → Grafana",
        en: "NestJS + CQRS + TypeORM + PostgreSQL + a separate frontend + Docker Compose + S3 + Terraform IaC + backup metrics piped to Grafana.",
      },
      {
        ko: "회사 검증 아키텍처 패턴을 그대로 차용 (양방향 전이의 시작점)",
        en: "Lifted work-validated architecture patterns directly — the starting point of bidirectional transfer.",
      },
      {
        ko: "AI native 100% — 코드 작성은 AI, 사람 노드는 UI 기획 + 코드 연결 검토 + e2e 테스트 셋만",
        en: "100% AI-native — AI writes code; the human nodes are only UI planning, code-connection review, and the e2e test suite.",
      },
      {
        ko: "DB 사용자 격리를 위해 자체 인프라 구축 진행 중",
        en: "Building self-hosted infra to achieve DB-level user isolation.",
      },
    ],
    impact: [
      {
        ko: "13+ 위키 자산 환류 (2단계 설계 프로세스·테스트 5-layer·정합성 31건 간극 정비·백업 메트릭 자동화)",
        en: "13+ wiki assets fed back (the 2-stage design process, 5-layer testing, 31 consistency-gap repairs, automated backup metrics).",
      },
      {
        ko: "**회사로 역전이**: 집비치기 UI + current e2e 테스트 패턴이 회사 프론트엔드 강화에 도입 중 — 수동 클릭 검증 → 자동 테스트 검증 전환 단계",
        en: "**Back-transfer to work**: the him UI + current e2e test pattern is being adopted to strengthen the company frontend — shifting from manual click-through verification to automated tests.",
      },
      {
        ko: "AI native 100% 통찰: 사람이 직접 작성하면 검토는 간헐적, AI native + 사람 검토는 빈번·주기적 → 더 안정적·고도화 (엔티티만이 아니라 프론트·인프라·기획·UI 모두에 적용)",
        en: "100%-AI-native insight: when humans write code, review is sporadic; AI-native + human review is frequent and periodic → more stable, more refined. It applies not just to entities but to frontend, infra, planning, and UI alike.",
      },
    ],
    stack: [
      "NestJS",
      "CQRS",
      "TypeORM",
      "PostgreSQL",
      "Terraform IaC",
      "S3",
      "Grafana",
      "Playwright",
    ],
  },
  {
    name: {
      ko: "Brain Trinity — AI 협업 위키 컴파일 시스템",
      en: "Brain Trinity — AI-collaboration wiki compile system",
    },
    slug: "brain-trinity",
    badge: {
      ko: "이 이력서·포트폴리오를 만든 메타 시스템",
      en: "The meta system that compiled this resume",
    },
    period: {
      ko: "2026-04-16 ~ 현재 · 위키 56+ 누적",
      en: "Apr 16 2026 – present · 56+ wiki pages",
    },
    context: {
      ko: "생물학적 뇌를 중요한 업무에 집중하게 두려면 '중요하지만 항상 기억할 필요는 없는 내용'을 외부 시스템으로 분리해야 했고, 단순 노트앱은 검색은 되지만 합성·연결·재사용이 안 됐습니다.",
      en: "To keep the biological brain on the important work, 'important but doesn't need to live in working memory' content has to live in an external system. Plain note apps are searchable but don't synthesize, link, or re-use.",
    },
    what: [
      {
        ko: "Karpathy LLM Wiki 패턴 3-레이어 (raw/ 불변 + wiki/ AI 컴파일 + Output/ 파생)",
        en: "Karpathy LLM Wiki pattern, 3 layers (immutable raw/ + AI-compiled wiki/ + derived Output/).",
      },
      {
        ko: "Claude Code 단일 도구 협업 (다른 AI 도구 사용 없음)",
        en: "Claude Code as the only collaborator — no other AI tools.",
      },
      {
        ko: "skill 시스템 — ingest / lint / query 정의",
        en: "Skill system — ingest / lint / query defined.",
      },
      {
        ko: "frontmatter 스키마 + index/log 자동 갱신 + Obsidian 그래프 + MEMORY 자동 동기화",
        en: "Frontmatter schema + auto-updating index/log + Obsidian graph + auto-syncing MEMORY.",
      },
      {
        ko: "AI 작성 100% — 사용자 입력 = 프롬프트 채팅뿐",
        en: "100% AI-written — the user's input is just the prompt chat.",
      },
    ],
    impact: [
      {
        ko: "위키 페이지 56+ 누적, 매 ingest마다 자동 cross-link + raw frontmatter 동기화 + index/log 갱신",
        en: "56+ wiki pages and counting; every ingest triggers automatic cross-linking, raw-frontmatter sync, and index/log updates.",
      },
      {
        ko: "**이 포트폴리오와 이력서·자가 진단·6개 프로젝트 자료 박스가 모두 Brain Trinity 컴파일 결과** — 시스템 자체가 4단계 자동 작동의 살아있는 증거",
        en: "**This portfolio, the resume, the self-diagnosis, and the 6 project briefs are all Brain Trinity compile outputs** — the system itself is the living evidence of stage-4 automatic operation.",
      },
      {
        ko: "새로운 도메인이 나타나도 정보 구조화 + AI native 기반이면 해결하지 못할 일이 없다고 봅니다",
        en: "Given a new domain, structured information + an AI-native foundation can solve almost anything.",
      },
    ],
    stack: [
      "Karpathy /raw pattern",
      "Claude Code",
      "skill system",
      "frontmatter schema",
      "Obsidian",
      "MEMORY",
    ],
  },
];

export const resumeContacts = {
  email: "dnr8874@gmail.com",
  github: "https://github.com/wukdddang",
  brainTrinityNote: {
    ko: "Brain Trinity 시연 — 면접에서 직접 시현 가능합니다.",
    en: "Brain Trinity demo — I can show it live in an interview.",
  } satisfies L,
};
