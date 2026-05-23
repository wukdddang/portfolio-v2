/**
 * AI 활용 5단계 모델 (참조 정의) + 본인식 단계 정의
 * Brain Trinity wiki/ai/ai-usage-levels-seong-pm.md 추출
 */

export type StageId = 1 | 2 | 3 | 4 | 5;

export interface Stage {
  id: StageId;
  name: string;
  short: string;
  seongPMDefinition: string;
  ownDefinition: string | null; // 본인 체감 정의 — 2026-05-22 추출
  resultOwner: "사람" | "사람 (속도만 ↑)" | "사람 + AI" | "시스템" | "시스템 + 검증";
}

export const stages: Stage[] = [
  {
    id: 1,
    name: "미사용·소극",
    short: "검색 대용",
    seongPMDefinition: "회사가 막아놨거나 한두 번 써보고 손 뗌. 검색 대용 정도.",
    ownDefinition: null,
    resultOwner: "사람",
  },
  {
    id: 2,
    name: "내 일에 시키기",
    short: "메일·요약·초안",
    seongPMDefinition:
      "메일 다듬기·요약·초안. 손이 빨라지지만 결과물은 여전히 'AI가 만든 걸 내가 다듬는' 구조.",
    ownDefinition: null,
    resultOwner: "사람 (속도만 ↑)",
  },
  {
    id: 3,
    name: "직군 영역 확장",
    short: "옆 직군 일 가능",
    seongPMDefinition:
      "마케터가 프로토타입을 만들고, PM이 데이터 분석을 하고, 디자이너가 카피를 씁니다. AI가 옆 직군 지식을 채워줘서 내 일의 범위가 넓어집니다.",
    ownDefinition:
      "완벽하고 정확히는 모르는 영역인데, AI로 문제를 하나씩 해결하며 자신감과 역량을 확장합니다 — 직군 칸을 넘어선다는 체감입니다.",
    resultOwner: "사람 + AI",
  },
  {
    id: 4,
    name: "시스템화",
    short: "워크플로우 자동화",
    seongPMDefinition:
      "워크플로우·자동화를 구축합니다. 내가 없어도 시스템이 굴러갑니다. 막힌 노드는 사람이 채워두고 시스템 전체는 살아있게 굴립니다.",
    ownDefinition:
      "하루에 여러 개를 동시에 처리하고 AI 에이전트 여러 개를 병렬로 운용합니다. 사람을 에이전트처럼 활용하며 본인은 시스템 설계자로 위치를 이동합니다.",
    resultOwner: "시스템",
  },
  {
    id: 5,
    name: "사이드 권한 우회",
    short: "권한 우회 시스템",
    seongPMDefinition: "회사 보안·권한에 막힌 부분을 사이드 프로젝트로 검증해 가져옵니다. AI가 직군 진입장벽을 부숴서 가능합니다.",
    ownDefinition:
      "24/7 무인 운영으로 가거나, 사이드에서 검증한 패턴을 회사로 가져옵니다(집비치기 e2e 역전이). 더 나아가 인터페이스 자체를 바꾸는 패러다임 전환(자비스급)을 그리고 있습니다.",
    resultOwner: "시스템 + 검증",
  },
];

export const singleLever = {
  title: "단일 레버 — AI를 사고 파트너로 쓰는가",
  description:
    "단계는 순차 계단이 아닙니다. '맥락을 먼저 깔고 → AI에게 질문을 받고 → 다시 사고하고 → 피드백을 주고 → 거기서 내 생각이 더 정리되는' 사고 파트너 모드로 인식이 바뀌면 3·4·5단계가 한꺼번에 열립니다.",
};
