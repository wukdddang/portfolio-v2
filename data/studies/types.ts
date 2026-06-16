import type { L } from "../i18n";

/**
 * 학습 로그 페이지 데이터 — /studies/[slug].
 * Brain Trinity 위키(wiki/concepts/sar-*, embedded-*)에서 컴파일한 학습 여정 요약.
 * 히어로 메타 스트립(personal.heroDomains)의 "학습 도메인" 링크가 도착하는 곳.
 *
 * 토픽 status: done=위키 페이지 컴파일 완료 / doing=진행 중 / todo=로드맵 대기.
 * wikiSlug는 Brain Trinity 위키 원본 파일명 — 외부 링크가 아니라 출처 표기(mono).
 */

/**
 * 토픽 문서 안의 경량 도식 — 위키의 Mermaid 다이어그램을 사이트 시각 언어(박스+화살표·표·수식)로
 * 옮긴 것. React Flow를 싣지 않고 순수 DOM/SVG로 그려 이해를 돕는다.
 *  - flow    : 노드 체인 (A → B → C). dir=row(가로) | col(세로).
 *  - branch  : 한 노드에서 여러 갈래로 분기 (root → children[]).
 *  - compare : 미니 비교표 (headers + rows).
 *  - formula : 큰 수식 한 줄 + 기호 설명.
 *  - plot    : 개념 이해용 곡선 그래프(정현파·임피던스 곡선 등) — series[]를 SVG 곡선으로.
 *  - lattice : 도핑 결정 그림 — Si 격자에 도펀트 1개 + 자유 캐리어(N형 전자·P형 정공)를 SVG로.
 *  - junction: PN 접합 단면도 — P|공핍층|N 막대에 캐리어·이온을 그리고, bias별 공핍층 폭 변화를 보여줌.
 *  - iv      : 다이오드 I-V 특성 곡선 — 순방향 도통·역방향 차단·항복 3영역을 4상한 그래프로.
 *  - phasor  : 복소평면(I/Q) 위상자 — 길이 A·각도 θ 벡터. mode=interf면 M·S* 위상차까지.
 *  - scene   : SAR 관측 기하 — variant=aperture(합성개구) | swath(서브스왓). 라벨은 컴포넌트 내장.
 *  - network : 간섭쌍 네트워크 — 시간·수직기선 평면의 취득점 + 페어. style=sbas(소기선) | psi(단일 마스터).
 *  - pixel   : 비등방 픽셀 — Range×Azimuth 직사각형 + 멀티룩 창. 해상도 비대칭 설명용.
 */
export type DiagramNode = {
  icon?: string;
  label: L;
  sub?: L;
  /** 색 — "accent" | "muted" | cat 인덱스(0~6) */
  tone?: "accent" | "muted" | number;
};

export type Diagram =
  | { kind: "flow"; dir?: "row" | "col"; caption?: L; nodes: DiagramNode[] }
  | { kind: "branch"; caption?: L; root: DiagramNode; children: DiagramNode[] }
  | { kind: "compare"; caption?: L; headers: L[]; rows: L[][] }
  | { kind: "formula"; expr: string; caption?: L; legend?: { sym: string; desc: L }[] }
  | { kind: "plot"; caption?: L; xLabel?: L; yLabel?: L; series: PlotSeries[]; markers?: PlotMarker[] }
  | { kind: "lattice"; caption?: L; panels: LatticePanel[] }
  | { kind: "junction"; caption?: L; states: JunctionState[] }
  | {
      kind: "iv";
      caption?: L;
      xLabel?: L;
      yLabel?: L;
      /** 영역 라벨 — 4상한 그래프 위 주석 */
      vfLabel?: L;
      vbrLabel?: L;
      fwdLabel?: L;
      revLabel?: L;
    }
  | { kind: "phasor"; caption?: L; mode?: "single" | "interf"; vectors: PhasorVec[] }
  | { kind: "scene"; variant: "aperture" | "swath"; caption?: L }
  | { kind: "network"; style: "sbas" | "psi"; caption?: L }
  | { kind: "pixel"; caption?: L; rangeM: number; azimuthM: number; multilook?: [number, number] };

/** phasor 벡터 — 복소평면 위 화살표 하나. angleDeg=각도(반시계 +), mag=길이(0~1). */
export type PhasorVec = { label: L; angleDeg: number; mag?: number; tone?: "accent" | "muted" | number; dashed?: boolean };

/**
 * lattice 패널 — Si 결정 격자 한 칸을 도펀트로 바꾼 그림.
 *  type=n: 5가 도펀트(인 P 등) → 남는 자유 전자(−).
 *  type=p: 3가 도펀트(붕소 B 등) → 빈 자리 정공(+).
 */
export type LatticePanel = { type: "n" | "p"; label: L; dopant: string; carrier: L };

/**
 * junction 상태 — PN 접합 단면 한 컷. bias가 공핍층 폭을 정한다.
 *  eq=무바이어스(평형) · forward=순방향(공핍층 좁아짐) · reverse=역방향(공핍층 넓어짐).
 */
export type JunctionBias = "eq" | "forward" | "reverse";
export type JunctionState = { bias: JunctionBias; label: L; sub?: L };

/**
 * plot 곡선 — 개념 이해용(정밀 데이터 아님). 컴포넌트가 curve 종류별로 SVG path를 생성한다.
 *  sine 정현파 · dc 수평선 · decay 1/f 감소(Xc) · rise 선형 증가(XL) ·
 *  lowpass 저역통과 응답 · rectified 정류 맥동(|sin|) · pulse PWM 구형파.
 */
export type PlotCurve =
  | "sine"
  | "dc"
  | "decay"
  | "rise"
  | "lowpass"
  | "rectified"
  | "pulse"
  /** chirp 주파수 선형 증가 신호 · compressed 압축된 sinc 첨두 · trr 다이오드 역회복 딥 ·
   *  wrap 위상 래핑 톱니(간섭무늬) · charge RC 충전 1−e^(−t) */
  | "chirp"
  | "compressed"
  | "trr"
  | "wrap"
  | "charge";
export type PlotSeries = { label: L; curve: PlotCurve; tone?: "accent" | "muted" | number };
/** x는 0~1 정규화 위치. 세로 점선 + 라벨로 특정 지점(공진·차단 등)을 표시. */
export type PlotMarker = { x: number; label: L; tone?: "accent" | "muted" | number };

/** 토픽 상세 — Brain Trinity 위키 본문에서 컴파일한 복습 노트 */
export interface TopicDetail {
  /** 핵심 요약 — 상세 페이지 최상단 고정 */
  tldr: L;
  sections: { heading: L; bullets: L[]; diagram?: Diagram | Diagram[] }[];
  /** 내 경험·주의점·함정 */
  pitfall?: L;
}

export interface StudyTopic {
  /** 상세 라우트 슬러그 (/studies/{study}/{topic}) — detail 있는 토픽만 */
  slug?: string;
  icon: string;
  title: L;
  summary: L;
  tags: L[];
  status: "done" | "doing" | "todo";
  wikiSlug?: string;
  detail?: TopicDetail;
}

/** 학습 캘린더 항목 — 날짜별 "언제 무엇을 했는지" */
export interface JournalEntry {
  /** YYYY-MM-DD */
  date: string;
  kind: "lecture" | "wiki" | "conversation" | "work" | "plan";
  title: L;
  /** 부가 메타 — 강의 길이·출처 등 (예: "강의 29강 · 14:47") */
  meta?: L;
  /** 연관 토픽 슬러그 — 있으면 상세 페이지로 링크 (/studies/{study}/{topic}) */
  topicSlug?: string;
}

export interface StudyBlock {
  title: L;
  desc: L;
  /** 카테고리 색 — 통합 다이어그램의 cat 인덱스와 동일 (--cat-N) */
  cat: number;
  /** "prerequisite"면 본 커리큘럼 블록들보다 앞에 '선수 지식 · 먼저 보기' 전용 구획으로 분리 렌더 */
  kind?: "prerequisite";
  topics: StudyTopic[];
}

export interface Study {
  slug: string;
  icon: string;
  title: L;
  tagline: L;
  /** 왜 시작했나 */
  motive: L;
  /** 어떻게 쌓는가 — AI 사고 파트너 + Brain Trinity 위키 컴파일 루틴 */
  method: L;
  /** 헤더 스탯 스트립 */
  stats: { label: L; value: L }[];
  /** (옵션) 단계 타임라인 */
  timeline?: { period: string; title: L; desc: L; status: "done" | "doing" | "todo" }[];
  /** 학습 캘린더 — 날짜별 활동 로그(위키 created 날짜·강의 녹음일 기준). 시간 오름차순. */
  journal: JournalEntry[];
  blocks: StudyBlock[];
  /** 실무/프로젝트 연결 — href는 내부 프로젝트 상세 */
  practice: {
    title: L;
    lede: L;
    items: { title: L; desc: L; href?: string }[];
  };
}
