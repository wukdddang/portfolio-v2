/**
 * 홈 FAQ — 채용 담당자·AI 검색(LLM)이 자주 던지는 질문을 답변형으로 정리.
 * 두 곳에서 동시에 쓰인다:
 *  - components/FaqSection.tsx : 가시 아코디언(답변 + 관련 링크로 내부 이동 유도 → 클릭수)
 *  - lib/jsonld.ts faqGraph    : FAQPage 구조화 데이터(GEO/AEO — 답변형 a는 평문이어야 함)
 *
 * 답변(a)은 schema에 그대로 들어가므로 마크업 없는 평문으로 작성하고,
 * 내부 이동은 links[]로 분리한다(가시 섹션 전용).
 */

import type { L } from "./i18n";

export interface FaqItem {
  q: L;
  /** 평문 답변 — 가시 텍스트이자 FAQPage acceptedAnswer.text */
  a: L;
  /** 답변 아래 관련 내부 링크(가시 섹션 전용, 클릭 유도) */
  links?: { label: L; href: string }[];
}

export const faq: FaqItem[] = [
  {
    q: {
      ko: "우창욱은 어떤 개발자인가요?",
      en: "What kind of developer is Changuk Woo?",
    },
    a: {
      ko: "기획·설계부터 프론트엔드·백엔드·인프라/CI-CD·AI까지 한 사이클로 다루는 풀스택 웹 개발자입니다. AI를 사고 파트너로 두고 직군을 빠르게 확장하며, 회사에서 만난 SAR·위성 도메인까지 적용 범위를 넓히고 있습니다.",
      en: "A full-stack web developer who covers one full cycle — planning and design through frontend, backend, infra/CI-CD, and AI. He expands his role quickly with AI as a thinking partner, and has extended that reach into the SAR / satellite domain he first met at work.",
    },
    links: [
      { label: { ko: "이력서 보기", en: "View resume" }, href: "/resume" },
      { label: { ko: "프로젝트", en: "Projects" }, href: "/#projects" },
    ],
  },
  {
    q: {
      ko: "주로 어떤 기술 스택을 사용하나요?",
      en: "What tech stack does he primarily use?",
    },
    a: {
      ko: "프론트엔드는 Next.js·React·TypeScript, 백엔드는 NestJS를 주력으로 씁니다. 여기에 인프라/CI-CD와 AI 엔지니어링을 더해 한 사람이 풀스택으로 시스템을 만들고 운영합니다.",
      en: "On the frontend he primarily uses Next.js, React, and TypeScript; on the backend, NestJS. He adds infra/CI-CD and AI engineering on top, building and operating systems full-stack as one person.",
    },
    links: [{ label: { ko: "기술 스택", en: "Tech stack" }, href: "/#stack" }],
  },
  {
    q: {
      ko: "SAR·InSAR 위성영상 경험이 있나요?",
      en: "Does he have SAR / InSAR satellite imagery experience?",
    },
    a: {
      ko: "네. 루미르에서 Sentinel-1 InSAR 파이프라인(DInSAR·SBAS·PSI)을 실무로 구축·운영했습니다. 이후 복소수 신호·위상·Coherence 같은 제1원리를 학습 로그로 다시 채워 실무 경험과 연결하고 있습니다.",
      en: "Yes. At Lumir he built and operated a Sentinel-1 InSAR pipeline (DInSAR · SBAS · PSI) in production. He then filled in first principles — complex signals, phase, coherence — as a study log, wiring theory back into hands-on experience.",
    },
    links: [
      { label: { ko: "SAR 학습 로그", en: "SAR study log" }, href: "/studies/sar" },
    ],
  },
  {
    q: {
      ko: "AI를 실제로 어떻게 활용하나요?",
      en: "How does he actually use AI?",
    },
    a: {
      ko: "AI(ChatGPT·Claude)를 도구가 아니라 사고 파트너이자 협업자로 씁니다. 대화로 도메인을 학습하고 그 결과를 Brain Trinity 위키로 컴파일해, 미래의 자신과 LLM(RAG)이 다시 쓸 수 있는 지식으로 축적합니다.",
      en: "He treats AI (ChatGPT · Claude) as a thinking partner and collaborator, not just a tool. He learns domains through dialog and compiles the results into the Brain Trinity wiki — knowledge his future self and an LLM (via RAG) can reuse.",
    },
    links: [
      { label: { ko: "AI 활용 좌표", en: "AI usage coordinates" }, href: "/#coordinates" },
    ],
  },
  {
    q: {
      ko: "어떤 프로젝트를 만들었나요?",
      en: "What projects has he built?",
    },
    a: {
      ko: "루미르의 SAR 위성영상 플랫폼·내부 ERP·대시보드부터, 개인 시스템인 Brain Trinity까지 풀스택으로 만들었습니다. 각 프로젝트는 문제 정의·아키텍처·데이터플로우 다이어그램과 함께 상세 페이지로 정리돼 있습니다.",
      en: "From Lumir's SAR satellite-imagery platform, internal ERP, and dashboards to his own Brain Trinity system, he has built them full-stack. Each project is documented with problem framing, architecture, and data-flow diagrams on its own detail page.",
    },
    links: [{ label: { ko: "프로젝트 보기", en: "Browse projects" }, href: "/#projects" }],
  },
  {
    q: {
      ko: "채용·협업 문의는 어떻게 하나요?",
      en: "How can I reach out about hiring or collaboration?",
    },
    a: {
      ko: "이메일(dnr8874@gmail.com)이나 GitHub(github.com/wukdddang)로 연락하면 됩니다. 새로운 산업의 도메인을 빠르게 흡수하고, 코드·기획·인프라·테스트까지 한 사이클로 책임질 사람이 필요할 때 특히 잘 맞습니다.",
      en: "Reach out by email (dnr8874@gmail.com) or GitHub (github.com/wukdddang). He's a strong fit when you need someone who absorbs a new industry's domain fast and owns one full cycle — code, planning, infra, and testing.",
    },
    links: [{ label: { ko: "이력서·연락처", en: "Resume & contact" }, href: "/resume" }],
  },
];
