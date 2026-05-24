/**
 * AI 활용 5단계 모델 (참조 정의) + 본인식 단계 정의
 * Brain Trinity wiki/ai/ai-usage-levels-seong-pm.md 추출
 * Bilingual {ko, en} fields.
 */

import type { L } from "./i18n";

export type StageId = 1 | 2 | 3 | 4 | 5;

export interface Stage {
  id: StageId;
  name: L;
  short: L;
  seongPMDefinition: L;
  ownDefinition: L | null;
  resultOwner: L;
}

export const stages: Stage[] = [
  {
    id: 1,
    name: { ko: "미사용·소극", en: "Not in use / passive" },
    short: { ko: "검색 대용", en: "Search replacement" },
    seongPMDefinition: {
      ko: "회사가 막아놨거나 한두 번 써보고 손 뗌. 검색 대용 정도.",
      en: "Blocked by the company, or tried once or twice and dropped. Roughly a search replacement.",
    },
    ownDefinition: null,
    resultOwner: { ko: "사람", en: "Human" },
  },
  {
    id: 2,
    name: { ko: "내 일에 시키기", en: "Delegating my own tasks" },
    short: { ko: "메일·요약·초안", en: "Email · summary · draft" },
    seongPMDefinition: {
      ko: "메일 다듬기·요약·초안. 손이 빨라지지만 결과물은 여전히 'AI가 만든 걸 내가 다듬는' 구조.",
      en: "Cleaning up email, summarizing, drafting. Hands move faster, but the output is still 'AI generates and I polish.'",
    },
    ownDefinition: null,
    resultOwner: { ko: "사람 (속도만 ↑)", en: "Human (just faster)" },
  },
  {
    id: 3,
    name: { ko: "직군 영역 확장", en: "Expanding role boundaries" },
    short: { ko: "옆 직군 일 가능", en: "Adjacent-role work" },
    seongPMDefinition: {
      ko: "마케터가 프로토타입을 만들고, PM이 데이터 분석을 하고, 디자이너가 카피를 씁니다. AI가 옆 직군 지식을 채워줘서 내 일의 범위가 넓어집니다.",
      en: "Marketers prototype, PMs do data analysis, designers write copy. AI fills in adjacent-role knowledge so the scope of your own work expands.",
    },
    ownDefinition: {
      ko: "완벽하고 정확히는 모르는 영역인데, AI로 문제를 하나씩 해결하며 자신감과 역량을 확장합니다 — 직군 칸을 넘어선다는 체감입니다.",
      en: "I don't know the area perfectly, but solving one problem after another with AI grows both confidence and capability — the felt sense of stepping outside the role box.",
    },
    resultOwner: { ko: "사람 + AI", en: "Human + AI" },
  },
  {
    id: 4,
    name: { ko: "시스템화", en: "Systemization" },
    short: { ko: "워크플로우 자동화", en: "Workflow automation" },
    seongPMDefinition: {
      ko: "워크플로우·자동화를 구축합니다. 내가 없어도 시스템이 굴러갑니다. 막힌 노드는 사람이 채워두고 시스템 전체는 살아있게 굴립니다.",
      en: "Build workflows and automation. The system keeps running without you. Humans fill in blocked nodes; the system itself stays alive.",
    },
    ownDefinition: {
      ko: "하루에 여러 개를 동시에 처리하고 AI 에이전트 여러 개를 병렬로 운용합니다. 사람을 에이전트처럼 활용하며 본인은 시스템 설계자로 위치를 이동합니다.",
      en: "Run multiple things in parallel each day, operate several AI agents at once, and even use people as agents. You move into the system-designer seat.",
    },
    resultOwner: { ko: "시스템", en: "System" },
  },
  {
    id: 5,
    name: { ko: "사이드 권한 우회", en: "Side-project authority bypass" },
    short: { ko: "권한 우회 시스템", en: "Bypass-via-side-system" },
    seongPMDefinition: {
      ko: "회사 보안·권한에 막힌 부분을 사이드 프로젝트로 검증해 가져옵니다. AI가 직군 진입장벽을 부숴서 가능합니다.",
      en: "Parts blocked by company security or permissions are validated in a side project and ported back in. AI breaking down role-entry barriers makes this possible.",
    },
    ownDefinition: {
      ko: "24/7 무인 운영으로 가거나, 사이드에서 검증한 패턴을 회사로 가져옵니다(집비치기 e2e 역전이). 더 나아가 인터페이스 자체를 바꾸는 패러다임 전환(자비스급)을 그리고 있습니다.",
      en: "Either 24/7 unattended operation, or porting side-validated patterns back into the company (the him e2e back-transfer). Beyond that, I'm sketching a paradigm shift in the interface itself — Jarvis-grade.",
    },
    resultOwner: { ko: "시스템 + 검증", en: "System + validation" },
  },
];

export const singleLever: { title: L; description: L } = {
  title: {
    ko: "단일 레버 — AI를 사고 파트너로 쓰는가",
    en: "Single lever — do you use AI as a thinking partner?",
  },
  description: {
    ko: "단계는 순차 계단이 아닙니다. '맥락을 먼저 깔고 → AI에게 질문을 받고 → 다시 사고하고 → 피드백을 주고 → 거기서 내 생각이 더 정리되는' 사고 파트너 모드로 인식이 바뀌면 3·4·5단계가 한꺼번에 열립니다.",
    en: "The stages aren't sequential steps. Once you flip into thinking-partner mode — set the context → let AI ask you questions → think again → give feedback → and watch your own thinking sharpen in the loop — stages 3, 4, and 5 unlock together.",
  },
};
