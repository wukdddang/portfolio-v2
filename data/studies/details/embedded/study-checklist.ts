import type { TopicDetail } from "../../types";

export const studyChecklist: TopicDetail = {
  tldr: {
    ko: "킥보드 임베디드 강의를 들을 때 '이게 뭔 소린가'를 줄이기 위한 선수·배경 개념 점검표입니다. 강의 밑에 깔린 기초 전기·전자(Layer 0)부터 수동·능동소자 핵심(Layer 1·2)까지 한곳에 모아, '검색 없이 한 문장으로 설명 가능한가'를 기준으로 자가진단합니다. 가장 큰 갭은 반도체 기초·임피던스·AC/주파수 — 다이오드·BJT·커패시터·인덕터가 전부 이 위에 서 있습니다. 강의 듣기 '전'에 해당 블록을 훑으면 강의가 훨씬 덜 겉돕니다.",
    en: "A prerequisite/background checklist to cut down the 'what does this even mean' moments while taking the kickboard embedded course. It gathers everything from basic electronics (Layer 0) to passive/active-component essentials (Layers 1–2), self-assessed by 'can I explain it in one sentence without searching.' The biggest gaps are semiconductor basics, impedance, and AC/frequency — diode, BJT, capacitor, and inductor all rest on them. Skim the relevant block before a lecture and it stops floating.",
  },
  sections: [
    {
      heading: { ko: "3개 레이어로 보는 선수 개념", en: "Prerequisites in three layers" },
      bullets: [
        {
          ko: "Layer 0(기초 전기·전자)가 막히면 그 위 레이어가 전부 겉돕니다 — 최우선 점검 대상입니다.",
          en: "If Layer 0 (basic electronics) is shaky, everything above floats — it's the top priority.",
        },
        {
          ko: "체크 기준은 '검색 없이 한 문장으로 남에게 설명 가능'이면 통과, 어렴풋하면 비워 둡니다.",
          en: "Pass a check only if you can explain it to someone in one sentence without searching; leave it blank if it's fuzzy.",
        },
        {
          ko: "강의 듣기 전에 해당 토픽 블록을 훑어 모르는 개념을 먼저 확인하는 루틴 — 그게 이 표의 핵심 사용법입니다.",
          en: "Skim the topic block before the lecture to spot unknowns first — that's the core way to use this.",
        },
      ],
      diagram: {
        kind: "branch",
        caption: { ko: "강의를 받치는 배경 지식의 층위", en: "Layers of background propping up the lectures" },
        root: { icon: "✅", label: { ko: "선수 개념 점검표", en: "prerequisite checklist" }, tone: "accent" },
        children: [
          { label: { ko: "Layer 0 — 기초 전기·전자", en: "Layer 0 — basics" }, sub: { ko: "V=IR · KVL/KCL · 임피던스 · 반도체 · 자속", en: "V=IR · KVL/KCL · impedance · semiconductor · flux" }, tone: 2 },
          { label: { ko: "Layer 1 — 수동소자", en: "Layer 1 — passive" }, sub: { ko: "커패시터(#7) · 인덕터(#8)", en: "capacitor (#7) · inductor (#8)" }, tone: 6 },
          { label: { ko: "Layer 2 — 능동소자", en: "Layer 2 — active" }, sub: { ko: "다이오드(#9) · BJT(#10)", en: "diode (#9) · BJT (#10)" }, tone: 4 },
        ],
      },
    },
    {
      heading: { ko: "갭 분석 — 아직 위키에 없는 선수 개념", en: "Gap analysis — prerequisites not yet in the wiki" },
      bullets: [
        {
          ko: "강의를 들으며 '당연히 안다고 넘어간' 개념을 모아 보니, 반도체 기초가 최우선 갭으로 드러나 가장 먼저 채웠습니다(✅).",
          en: "Collecting the concepts the lectures glossed over, semiconductor basics surfaced as the top gap and got filled first (✅).",
        },
        {
          ko: "이제 임피던스·AC/DC도 독립 페이지로, 접지는 옴의 법칙에 보강해 Layer 0 갭이 모두 채워졌습니다.",
          en: "Now impedance and AC/DC are their own pages and ground is folded into Ohm's law — the Layer 0 gaps are all filled.",
        },
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "위키에 없는 선수 개념 (stub 1순위)", en: "Prerequisites missing from the wiki (stub priority)" },
        headers: [
          { ko: "개념", en: "Concept" },
          { ko: "왜 중요한가", en: "Why it matters" },
          { ko: "상태", en: "Status" },
        ],
        rows: [
          [
            { ko: "반도체 · PN 접합 · 도핑", en: "semiconductor · PN · doping" },
            { ko: "다이오드 · BJT · MOSFET의 근본 원리", en: "root of diode/BJT/MOSFET" },
            { ko: "✅ 위키 생성됨", en: "✅ created" },
          ],
          [
            { ko: "임피던스 기초", en: "impedance basics" },
            { ko: "C · L 주파수 특성 · 필터 · 공진의 공통 언어", en: "shared language of C/L, filters, resonance" },
            { ko: "✅ 위키 생성됨", en: "✅ created" },
          ],
          [
            { ko: "AC/DC · 주파수 · 정현파", en: "AC/DC · frequency" },
            { ko: "정류 · 필터 · 스위칭의 전제", en: "premise of rectify/filter/switch" },
            { ko: "✅ 위키 생성됨", en: "✅ created" },
          ],
          [
            { ko: "접지 · 기준 전위", en: "ground · reference" },
            { ko: "노이즈 · 서지를 빼는 경로의 기준", en: "reference for shunting noise/surge" },
            { ko: "✅ 옴의 법칙에 보강", en: "✅ folded into Ohm's law" },
          ],
        ],
      },
    },
    {
      heading: { ko: "스스로 점검 — 빠른 진단 질문", en: "Self-check — quick diagnostic questions" },
      bullets: [
        {
          ko: "12V 전원에 6Ω 저항이면 전류는 몇 A이고 그 저항이 소비하는 전력은 몇 W인가? (V=IR, P=I²R)",
          en: "12V across 6Ω — how many amps, and how many watts does the resistor dissipate? (V=IR, P=I²R)",
        },
        {
          ko: "다이오드가 한 방향으로만 전류를 흘리는 이유를 PN 접합으로 설명할 수 있는가?",
          en: "Can you explain why a diode conducts only one way, in terms of the PN junction?",
        },
        {
          ko: "주파수가 높아지면 커패시터의 임피던스는 커지나 작아지나? 인덕터는 그 반대인가?",
          en: "As frequency rises, does a capacitor's impedance go up or down? Is the inductor the opposite?",
        },
        {
          ko: "답이 막히는 질문 = 그 개념이 바로 당신의 갭입니다.",
          en: "A question you stall on = exactly your gap.",
        },
      ],
    },
  ],
  pitfall: {
    ko: "체크박스는 자가진단 트래커라 위키 원본에서 직접 채웁니다(포트폴리오는 그 지도만 컴파일해 보여줍니다). '한 문장 설명'이 됐다고 체크했는데 실제 회로에서 막히면 — 개념은 알지만 적용이 안 되는 것이니 따로 표시해 두면 약점이 정확히 보입니다.",
    en: "The checkboxes are a self-assessment tracker filled in on the wiki original (the portfolio only compiles the map). If you check 'can explain in one sentence' but then stall on a real circuit, that's knowing the concept but not the application — flag it separately and your weak spot shows up precisely.",
  },
};
