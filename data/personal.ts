/**
 * 본인 직군 정의 — AI 활용 5단계 진단의 기준선
 * Brain Trinity wiki/ai/ai-usage-levels-seong-pm.md (2026-05-20 회고 인터뷰) 추출
 * Bilingual {ko, en} fields — see data/i18n.ts pick().
 */

import type { L } from "./i18n";

export const personal = {
  name: { ko: "우창욱", en: "Changwook Woo" } satisfies L,
  tagline: {
    ko: "웹 개발자, SAR 도메인 확장 중",
    en: "Web Developer, expanding into SAR",
  } satisfies L,
  // Hero h1 타자기 효과용 — 본인 직군을 한 단어씩 순환 (모두 실제 프로필 기반)
  roles: [
    { ko: "웹 개발자", en: "Web Developer" },
    { ko: "풀스택 개발자", en: "Full-stack Developer" },
    { ko: "데이터 분석가", en: "Data Analyst" },
    { ko: "프로덕트 엔지니어", en: "Product Engineer" },
    { ko: "인프라 엔지니어", en: "Infra Engineer" },
    { ko: "SAR·위성 도메인 엔지니어", en: "SAR / Satellite Engineer" },
    { ko: "AI native 빌더", en: "AI-native Builder" },
  ] satisfies L[],
  subTagline: {
    ko: "AI를 사고 파트너로 두고 직군을 확장하면서 시스템을 함께 만드는 개발자입니다",
    en: "A developer who uses AI as a thinking partner — expanding role boundaries while building systems alongside it",
  } satisfies L,
  pitch: {
    ko: "회사가 풀어야 할 문제를 옆에서 빠르게 흡수해, 도메인 학습부터 풀스택 구현·운영까지 한 사이클로 매듭짓는 것을 좋아합니다.",
    en: "I like absorbing a company's problem quickly from the sidelines and closing the whole loop — from domain learning through full-stack implementation to operations.",
  } satisfies L,
  currentStage: {
    range: { ko: "3+4 진행", en: "Stage 3+4 in progress" } satisfies L,
    detail: {
      ko: "직군 확장 + 시스템화 혼합 + 5단계 사이드 검증 신호",
      en: "Role expansion + systemization, with early signals of stage-5 side-project validation",
    } satisfies L,
  },
  yearsExperience: {
    ko: "2년 5개월차",
    en: "2 yrs 5 mos",
  } satisfies L,
  identity: {
    ko: "프론트엔드 + 백엔드 + 인프라/CI-CD + AI를 한 사람이 풀스택으로 다루며, 회사에서 만난 SAR/위성 도메인까지 확장해 적용하고 있습니다.",
    en: "I cover frontend + backend + infra/CI-CD + AI end-to-end as one full-stack developer, and have extended that reach into the SAR / satellite domain I first met at work.",
  } satisfies L,
  mainDomain: {
    label: { ko: "메인 직군", en: "Main role" } satisfies L,
    value: { ko: "웹 개발", en: "Web Development" } satisfies L,
    detail: {
      ko: "프론트엔드 + 백엔드 + 인프라/CI-CD + AI",
      en: "Frontend + backend + infra/CI-CD + AI",
    } satisfies L,
    note: {
      ko: "2년 5개월차, 전천후 풀스택으로 확장 중입니다.",
      en: "2 yrs 5 mos in, expanding into a generalist full-stack profile.",
    } satisfies L,
  },
  academicBackground: {
    label: { ko: "전공 배경", en: "Academic background" } satisfies L,
    value: {
      ko: "공간정보공학",
      en: "Geospatial Information Engineering",
    } satisfies L,
    detail: {
      ko: "SAR·위성 도메인과 간접적으로 연결됩니다 (학부 수준).",
      en: "Indirectly connected to SAR / satellite work (undergraduate level).",
    } satisfies L,
  },
  learnedDomain: {
    label: {
      ko: "회사에서 배운 도메인",
      en: "Learned at work",
    } satisfies L,
    value: {
      ko: "Sentinel · SAR · 위성영상 · InSAR · MintPy · SNAPHU",
      en: "Sentinel · SAR · Satellite imagery · InSAR · MintPy · SNAPHU",
    } satisfies L,
    detail: {
      ko: "루미르 입사 후 학습한 직군 외 영역입니다.",
      en: "Out-of-role areas I picked up after joining Lumir.",
    } satisfies L,
  },
  diagnosticRules: [
    {
      ko: "순수 웹 개발 영역은 본인 직군 안입니다. 2~4단계는 직군 안의 깊이를 측정합니다.",
      en: "Pure web work is within my main role. Stages 2–4 measure depth inside the role.",
    },
    {
      ko: "SAR/위성 도메인 회사 프로젝트는 본인 직군 확장입니다. 3단계가 출발 신호이고, 시스템화·운영화로 가면 4단계가 위에 얹힙니다 → 3+4 혼합.",
      en: "SAR / satellite work at the company is a role expansion. Stage 3 is the entry signal, and systemization / ops layer stage 4 on top of it — hence the 3+4 blend.",
    },
    {
      ko: "snap/MintPy처럼 원래 본인 업무가 아닌 영역에 AI를 사고 파트너로 두고 진입해 결과를 내는 사례는 3단계(직군 확장)의 교과서적인 모습입니다.",
      en: "Cases like snap/MintPy — entering a non-role area with AI as a thinking partner and producing results — are textbook stage 3 (role expansion).",
    },
  ] satisfies L[],
  futureVision: [
    {
      ko: "임베디드 확장을 진행하고 있습니다",
      en: "Currently extending into embedded systems",
    },
    {
      ko: "하드웨어·로보틱스로의 자연 확장을 예상하고 있습니다",
      en: "Expecting a natural extension into hardware and robotics",
    },
    {
      ko: "Brain Trinity를 본인 완전체 시스템으로 키울 계획입니다 (음성·일기·회의록·PDF 통합)",
      en: "Plan to grow Brain Trinity into a complete personal system (voice + journal + meeting notes + PDFs unified)",
    },
  ] satisfies L[],
  invitations: [
    {
      ko: "도메인을 빠르게 흡수해야 하는 새로운 산업을 시작하시나요?",
      en: "Are you launching into a new industry that demands fast domain absorption?",
    },
    {
      ko: "AI를 도구가 아니라 협업자로 쓰는 풀스택이 필요하신가요?",
      en: "Do you need a full-stack engineer who treats AI as a collaborator, not just a tool?",
    },
    {
      ko: "코드뿐 아니라 기획·인프라·테스트까지 한 사이클로 책임지는 사람을 찾으시나요?",
      en: "Looking for someone who owns one full cycle — code, planning, infra, and testing?",
    },
  ] satisfies L[],
  brainTrinity: {
    note: {
      ko: "Brain Trinity는 본 포트폴리오와 자료 박스를 만들어낸 메타 시스템입니다. 면접 시 직접 시연이 가능합니다.",
      en: "Brain Trinity is the meta system that produced this portfolio and the project briefs. I can demo it live in an interview.",
    } satisfies L,
    publicLink: null as string | null,
  },
  contacts: {
    github: "https://github.com/wukdddang",
    email: "dnr8874@gmail.com",
  },
};

export type Personal = typeof personal;
