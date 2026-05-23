/**
 * 본인 직군 정의 — AI 활용 5단계 진단의 기준선
 * Brain Trinity wiki/ai/ai-usage-levels-seong-pm.md (2026-05-20 회고 인터뷰) 추출
 */

export const personal = {
  name: "우창욱",
  tagline: "웹 개발자, SAR 도메인 확장 중",
  subTagline: "AI 사고 파트너로 직군 확장 + 시스템화 진행 중",
  currentStage: {
    range: "3+4 진행",
    detail: "직군 확장 + 시스템화 혼합 + 5단계 사이드 검증 신호",
  },
  yearsExperience: "2년 5개월차",
  identity: "전천후 풀스택 (프론트엔드 + 백엔드 + 인프라/CI-CD + AI), SAR 도메인 확장 중",
  mainDomain: {
    label: "메인 직군",
    value: "웹 개발",
    detail: "프론트엔드 + 백엔드 + 인프라/CI-CD + AI",
    note: "2년 5개월차, 전천후 풀스택 확장 중",
  },
  academicBackground: {
    label: "전공 배경",
    value: "공간정보공학",
    detail: "SAR·위성 도메인과 간접 연결 (학부 수준)",
  },
  learnedDomain: {
    label: "회사에서 배운 도메인",
    value: "Sentinel · SAR · 위성영상 · InSAR · MintPy · SNAPHU",
    detail: "루미르 입사 후 학습 — 직군 외 영역",
  },
  diagnosticRules: [
    "순수 웹 개발 영역 = 본인 직군 안. 2~4단계는 직군 안의 깊이 측정.",
    "SAR/위성 도메인 회사 프로젝트 = 본인 직군 확장. 3단계 출발 신호, 시스템화·운영화로 가면 4단계가 위에 얹힘 → 3+4 혼합.",
    "snap/MintPy처럼 원래 본인 업무 아닌 영역에 AI 사고 파트너로 진입해 결과를 내는 사례 = 3단계(직군 확장) 교과서적 부합.",
  ],
  futureVision: [
    "임베디드 확장 진행 중",
    "하드웨어·로보틱스로 자연 확장 예측",
    "Brain Trinity 본인 완전체 시스템 (음성·일기·회의록·PDF 통합)",
  ],
  brainTrinity: {
    note: "Brain Trinity = 본 이력서·자료 박스를 만들어낸 메타 시스템. 시연 가능.",
    publicLink: null, // About 섹션에서 추후 공개
  },
  contacts: {
    github: "https://github.com/wukdddang",
    email: "dnr8874@gmail.com",
  },
} as const;

export type Personal = typeof personal;
