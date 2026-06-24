/**
 * 본인 직군 정의 — AI 활용 5단계 진단의 기준선
 * Brain Trinity wiki/ai/ai-usage-levels-seong-pm.md (2026-05-20 회고 인터뷰) 추출
 * 2026-06-17 재정렬: 리드 정체성을 "웹 개발자 + SAR 확장" → "지형공간 연구자(석사) × 풀스택 엔지니어"로.
 * Bilingual {ko, en} fields — see data/i18n.ts pick().
 */

import type { L } from "./i18n";

/** 미래 비전 항목 — 평문 + 선택적 인라인 링크. link.ko/en 단어를 link.href 로 이동하는 링크로 렌더 */
export type VisionItem = L & { link?: L & { href: string } };

export const personal = {
  name: { ko: "우창욱", en: "Changuk Woo" } satisfies L,
  tagline: {
    ko: "지형공간 연구자 · 풀스택 · 인프라 엔지니어",
    en: "Geospatial researcher · full-stack & infra engineer",
  } satisfies L,
  // Hero h1 타자기 효과용 — 본인 정체성을 한 단어씩 순환 (모두 실제 프로필 기반)
  roles: [
    { ko: "지형공간정보 연구자", en: "Geospatial Researcher" },
    { ko: "인프라 엔지니어", en: "Infra Engineer" },
    { ko: "InSAR 엔지니어", en: "InSAR Engineer" },
    { ko: "풀스택 개발자", en: "Full-stack Developer" },
    { ko: "데이터 분석가", en: "Data Analyst" },
    { ko: "AI native 빌더", en: "AI-native Builder" },
  ] satisfies L[],
  subTagline: {
    ko: "측지·지형공간(석사)에서 출발해, 위성 InSAR로 지표 변위를 직접 측정·검증하고, 그 위의 시스템을 AI native로 짓고 다중 서버·스토리지·모니터링으로 직접 운영하는 엔지니어입니다",
    en: "Starting from geodesy / geospatial research (M.S.), I measure and validate ground displacement with satellite InSAR — then build the systems on top of it AI-native and operate them across multiple servers, storage, and monitoring",
  } satisfies L,
  pitch: {
    ko: "연구 도메인을 깊이 이해하면서, 그 위의 프로덕션 시스템까지 한 사이클로 매듭짓는 것을 좋아합니다.",
    en: "I like understanding a research domain deeply while closing the whole loop on top of it — up to the production system.",
  } satisfies L,
  currentStage: {
    range: { ko: "3+4 진행", en: "Stage 3+4 in progress" } satisfies L,
    // 맥락 없이 처음 보는 사람용 평이한 표현 (Hero 등). 정밀한 "3+4"는 5단계 설명이 있는 Coordinates 섹션 전용.
    plain: {
      ko: "직군 확장 + 시스템화",
      en: "Role expansion + systemization",
    } satisfies L,
    detail: {
      ko: "직군 확장 + 시스템화 혼합 + 5단계 사이드 검증 신호",
      en: "Role expansion + systemization, with early signals of stage-5 side-project validation",
    } satisfies L,
  },
  // 루미르 입사 2023-11 (11/13) → 연차는 lib/tenure.ts tenureLabel()로 현재 날짜 기준 자동 계산 (하드코딩 금지)
  joinDate: "2023-11",
  // Hero 메타 스트립 — 직군/학습 도메인 값 세그먼트. href가 있으면 학습 로그(/studies/*) 페이지로 링크
  heroDomains: {
    main: [
      { label: { ko: "지형공간 · 풀스택", en: "Geospatial · Full-stack" } satisfies L },
      { label: { ko: "InSAR 처리", en: "InSAR processing" } satisfies L, href: "/studies/sar" },
    ],
    learned: [
      { label: { ko: "SAR 처리 도구", en: "SAR processing tools" } satisfies L, href: "/studies/sar" },
    ],
  } satisfies Record<string, { label: L; href?: string }[]>,
  identity: {
    ko: "지형공간정보 석사(지각변동·GNSS) 배경 위에 기획·설계 + 프론트엔드 + 백엔드 + 인프라/CI-CD + AI를 한 사람이 풀스택으로 다룹니다. 위성 SAR/InSAR는 제 연구 주제였던 지표·지각 변위를 다른 센서로 다시 만난 영역입니다.",
    en: "On a geospatial-engineering M.S. foundation (crustal deformation · GNSS), I cover planning & design + frontend + backend + infra/CI-CD + AI end-to-end as one full-stack engineer. SAR / InSAR is the same ground-displacement my thesis studied — met again through a different sensor.",
  } satisfies L,
  mainDomain: {
    label: { ko: "메인 직군", en: "Main role" } satisfies L,
    value: { ko: "지형공간 + 풀스택", en: "Geospatial + full-stack" } satisfies L,
    detail: {
      ko: "기획·설계 + 프론트엔드 + 백엔드 + 인프라/CI-CD + AI",
      en: "Planning & design + frontend + backend + infra/CI-CD + AI",
    } satisfies L,
    note: {
      ko: "측지 연구 배경 위의 전천후 엔지니어 — 특히 시스템·인프라 운영(다중 서버·스토리지·모니터링·CI/CD·장애 대응)으로 무게를 옮기는 중입니다.",
      en: "A generalist engineer on a geodesy-research foundation — now shifting weight toward systems & infra operation (multi-server · storage · monitoring · CI/CD · incident response).",
    } satisfies L,
  },
  academicBackground: {
    label: { ko: "전공 배경", en: "Academic background" } satisfies L,
    value: {
      ko: "지형공간정보공학 석사",
      en: "M.S., Geospatial Information Engineering",
    } satisfies L,
    detail: {
      ko: "성균관대 건설환경시스템공학과 지형공간정보공학 석사(2023) · 토목공학 학사. 학위논문 「한반도 동남권 지각변동 모델 개발」(GNSS) — InSAR가 측정하는 지표·지각 변위와 같은 현상입니다.",
      en: "M.S. in Geospatial Information Engineering, Sungkyunkwan Univ. (2023) · B.S. in Civil Engineering. Thesis: \"A crustal-deformation model for southeastern Korea\" (GNSS) — the very phenomenon InSAR measures.",
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
      ko: "위성 SAR 처리 도구·파이프라인은 입사 후 익혔습니다 (측정 대상인 지표 변위는 전공 영역).",
      en: "I picked up the satellite-SAR processing tools and pipelines after joining (the measured quantity — ground displacement — is my academic field).",
    } satisfies L,
  },
  diagnosticRules: [
    {
      ko: "순수 웹 개발 영역은 본인 직군 안입니다. 2~4단계는 직군 안의 깊이를 측정합니다.",
      en: "Pure web work is within my main role. Stages 2–4 measure depth inside the role.",
    },
    {
      ko: "SAR/위성 회사 프로젝트에서 *처리 엔지니어링*은 직군 확장이지만, 측정 대상(지표·지각 변위)은 석사 전공이라 도메인 판단은 연구 배경에서 나옵니다. 3단계 확장 + 4단계 시스템화가 겹칩니다 → 3+4.",
      en: "In SAR / satellite work, the *processing engineering* is a role expansion — but the measured quantity (ground / crustal deformation) is my master's field, so the domain judgment comes from my research background. Stage-3 expansion and stage-4 systemization overlap → 3+4.",
    },
    {
      ko: "snap/MintPy 같은 처리 *도구*는 원래 본인 업무가 아니었고 AI를 사고 파트너로 두고 익혔습니다 — 3단계(직군 확장)의 모습입니다.",
      en: "Processing *tools* like snap/MintPy weren't originally my job; I learned them with AI as a thinking partner — the shape of stage 3 (role expansion).",
    },
  ] satisfies L[],
  futureVision: [
    {
      ko: "Brain Trinity를 본인 완전체 시스템으로 키울 계획입니다 (음성·일기·회의록·PDF 통합)",
      en: "Plan to grow Brain Trinity into a complete personal system (voice + journal + meeting notes + PDFs unified)",
    },
  ] satisfies VisionItem[],
  invitations: [
    {
      ko: "여러 서버·스토리지·CI/CD를 직접 운영하고 장애·성능까지 책임지는 인프라 엔지니어가 필요하신가요?",
      en: "Need an infra engineer who operates servers, storage, and CI/CD — and owns incidents and performance end to end?",
    },
    {
      ko: "관측·실험 데이터를 직접 분석하고, 그 위의 시스템까지 만들 사람이 필요하신가요?",
      en: "Do you need someone who can analyze observational / experimental data and build the systems on top of it?",
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
