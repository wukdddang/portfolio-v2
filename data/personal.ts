/**
 * 본인 직군 정의 — AI 활용 5단계 진단의 기준선
 * Brain Trinity wiki/ai/ai-usage-levels-seong-pm.md (2026-05-20 회고 인터뷰) 추출
 */

export const personal = {
  name: "우창욱",
  tagline: "웹 개발자, SAR 도메인 확장 중",
  subTagline: "AI를 사고 파트너로 두고 직군을 확장하면서 시스템을 함께 만드는 개발자입니다",
  pitch:
    "회사가 풀어야 할 문제를 옆에서 빠르게 흡수해, 도메인 학습부터 풀스택 구현·운영까지 한 사이클로 매듭짓는 것을 좋아합니다.",
  currentStage: {
    range: "3+4 진행",
    detail: "직군 확장 + 시스템화 혼합 + 5단계 사이드 검증 신호",
  },
  yearsExperience: "2년 5개월차",
  identity:
    "프론트엔드 + 백엔드 + 인프라/CI-CD + AI를 한 사람이 풀스택으로 다루며, 회사에서 만난 SAR/위성 도메인까지 확장해 적용하고 있습니다.",
  mainDomain: {
    label: "메인 직군",
    value: "웹 개발",
    detail: "프론트엔드 + 백엔드 + 인프라/CI-CD + AI",
    note: "2년 5개월차, 전천후 풀스택으로 확장 중입니다.",
  },
  academicBackground: {
    label: "전공 배경",
    value: "공간정보공학",
    detail: "SAR·위성 도메인과 간접적으로 연결됩니다 (학부 수준).",
  },
  learnedDomain: {
    label: "회사에서 배운 도메인",
    value: "Sentinel · SAR · 위성영상 · InSAR · MintPy · SNAPHU",
    detail: "루미르 입사 후 학습한 직군 외 영역입니다.",
  },
  diagnosticRules: [
    "순수 웹 개발 영역은 본인 직군 안입니다. 2~4단계는 직군 안의 깊이를 측정합니다.",
    "SAR/위성 도메인 회사 프로젝트는 본인 직군 확장입니다. 3단계가 출발 신호이고, 시스템화·운영화로 가면 4단계가 위에 얹힙니다 → 3+4 혼합.",
    "snap/MintPy처럼 원래 본인 업무가 아닌 영역에 AI를 사고 파트너로 두고 진입해 결과를 내는 사례는 3단계(직군 확장)의 교과서적인 모습입니다.",
  ],
  futureVision: [
    "임베디드 확장을 진행하고 있습니다",
    "하드웨어·로보틱스로의 자연 확장을 예상하고 있습니다",
    "Brain Trinity를 본인 완전체 시스템으로 키울 계획입니다 (음성·일기·회의록·PDF 통합)",
  ],
  invitations: [
    "도메인을 빠르게 흡수해야 하는 새로운 산업을 시작하시나요?",
    "AI를 도구가 아니라 협업자로 쓰는 풀스택이 필요하신가요?",
    "코드뿐 아니라 기획·인프라·테스트까지 한 사이클로 책임지는 사람을 찾으시나요?",
  ],
  brainTrinity: {
    note: "Brain Trinity는 본 포트폴리오와 자료 박스를 만들어낸 메타 시스템입니다. 면접 시 직접 시연이 가능합니다.",
    publicLink: null, // About 섹션에서 추후 공개
  },
  contacts: {
    github: "https://github.com/wukdddang",
    email: "dnr8874@gmail.com",
  },
} as const;

export type Personal = typeof personal;
