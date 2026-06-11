import type { TopicDetail } from "../../types";

export const componentMap: TopicDetail = {
  tldr: {
    ko: "킥보드 임베디드 강의 섹션3 '실무 회로' 슬라이드를 한 페이지로 묶은 기본 소자 지도로, 수동소자(저항·커패시터·인덕터)·다이오드 5종·트랜지스터(BJT·MOSFET)·전원회로(벅·부스트)를 킥보드 보드 실물 기준으로 설명한다. 전기기사 시험서처럼 손계산을 외우는 것이 아니라, SMD·배터리 분압·940µF 입력 커패시터·션트·MOSFET 인버터 같은 실제 보드 사례로 '소자를 어떻게 고르고 배치하는가'라는 선정·설계 직관을 잡는 것이 핵심이다. 개별 토픽을 깊게 파기 전 '전체 지도'로 먼저 읽는 진입점이다.",
    en: "This page is a basic component map bundling the section-3 'practical circuits' slides of the kickboard embedded course onto one page, covering passive components (resistor, capacitor, inductor), the five diode types, transistors (BJT, MOSFET), and power circuits (buck, boost) — all against the real kickboard board. Rather than memorizing hand-calculations like an electrician-exam textbook, the point is to build a selection-and-design intuition for how to pick and place components, using real cases such as SMD parts, battery voltage division, the 940µF input capacitor, a shunt, and the MOSFET inverter. It is the entry point to read as a 'whole map' before digging into any single topic."
  },
  sections: [
    {
      heading: { ko: "소자 분류 지도 — 수동 · 다이오드 · 트랜지스터 · 전원", en: "Component map — passive, diode, transistor, power" },
      bullets: [
        { ko: "전기 소자는 동작 전압이 필요 없는 수동소자(저항·커패시터·인덕터)와 반도체라 동작 전압이 필요한 능동소자(다이오드·BJT·MOSFET)로 크게 갈린다.", en: "Electrical components split broadly into passive parts that need no operating voltage (resistor, capacitor, inductor) and active semiconductor parts that do (diode, BJT, MOSFET)." },
        { ko: "MOSFET은 전압 제어 스위치로서 위로는 디지털 로직, 아래로는 벅·부스트 전원회로로 가지를 뻗는 이 지도의 허브 부품이다.", en: "The MOSFET, a voltage-controlled switch, is the hub of this map, branching up into digital logic and down into buck/boost power circuits." },
        { ko: "다이오드와 인덕터도 전원회로로 흘러 들어가, 정류·에너지 저장 역할로 벅·부스트 동작의 한 축을 맡는다.", en: "Diodes and inductors also feed into the power circuits, taking part in buck/boost operation through rectification and energy storage." }
      ],
      diagram: {
        kind: "branch",
        caption: { ko: "기본 소자 지도 — 한 페이지 분류", en: "Basic component map — a one-page taxonomy" },
        root: { icon: "🗺", label: { ko: "기본 소자 지도", en: "Basic component map" }, sub: { ko: "킥보드 실무 회로", en: "kickboard practical circuits" }, tone: "accent" },
        children: [
          { label: { ko: "수동소자", en: "Passive" }, sub: { ko: "저항 · 커패시터 · 인덕터", en: "R · C · L" }, tone: 2 },
          { label: { ko: "다이오드", en: "Diodes" }, sub: { ko: "5종 · 단방향 도통", en: "5 types · one-way conduction" }, tone: 3 },
          { label: { ko: "트랜지스터", en: "Transistors" }, sub: { ko: "BJT(전류) · MOSFET(전압)", en: "BJT (current) · MOSFET (voltage)" }, tone: 4 },
          { label: { ko: "전원", en: "Power" }, sub: { ko: "벅 강압 · 부스트 승압", en: "buck (step-down) · boost (step-up)" }, tone: 5 }
        ]
      }
    },
    {
      heading: { ko: "수동소자 — 저항 · 커패시터 · 인덕터", en: "Passive — resistor, capacitor, inductor" },
      bullets: [
        { ko: "저항은 전류 제한(LED)·풀업/풀다운·전압분배(배터리→ADC)·션트(전류측정)에 쓰이며, 실제 저항에는 기생 L·C가 있어 고주파에서 영향을 받는다.", en: "Resistors handle current limiting (LED), pull-up/pull-down, voltage division (battery→ADC), and shunting (current sensing); real resistors carry parasitic L and C, affected at high frequency." },
        { ko: "킥보드 입력 DC는 470µF 전해 커패시터 2개를 병렬로 묶은 940µF으로 받치며, 커패시터는 디커플링·바이패스·RC필터에도 쓰인다.", en: "The kickboard input DC is backed by 940µF — two 470µF electrolytics in parallel — and capacitors also serve decoupling, bypass, and RC filtering." },
        { ko: "인덕터는 벅컨버터에서 에너지를 저장하고 비드로 고주파 노이즈를 열로 소비하지만, 포화전류 이상에선 자속이 더 늘지 않고 DCR로 발열한다.", en: "Inductors store energy in the buck converter and dissipate high-frequency noise as heat via beads, but above the saturation current the flux stops increasing and the DCR causes heating." }
      ],
      diagram: {
        kind: "formula",
        expr: "V_{\\mathrm{adc}} = \\dfrac{4.99\\,\\mathrm{k}\\Omega}{82\\,\\mathrm{k}\\Omega + 4.99\\,\\mathrm{k}\\Omega}\\times V_{\\mathrm{bat}}",
        caption: { ko: "전압 분배 — 킥보드 배터리 32~45V를 ADC 범위로", en: "Voltage division — kickboard battery 32~45V into ADC range" },
        legend: [
          { sym: "32\\,\\mathrm{V}", desc: { ko: "→ 1.83V (ADC 입력 범위 내)", en: "→ 1.83V (within ADC range)" } },
          { sym: "45\\,\\mathrm{V}", desc: { ko: "→ 2.58V (ADC 입력 범위 내)", en: "→ 2.58V (within ADC range)" } }
        ]
      }
    },
    {
      heading: { ko: "다이오드 5종 · 트랜지스터(BJT · MOSFET)", en: "Five diodes · transistors (BJT · MOSFET)" },
      bullets: [
        { ko: "다이오드는 순방향 약 0.7V·역방향 차단이 기본이며, 범용(정류)·스위칭(1N4148)·쇼트키(SS14, 순방향 0.2~0.6V)·제너(역방향 클램핑)·TVS(서지·정전기 흡수) 5종으로 나뉜다.", en: "Diodes conduct forward at about 0.7V and block reverse; the five types are general (rectifying), switching (1N4148), Schottky (SS14, 0.2~0.6V forward), Zener (reverse clamping), and TVS (surge/ESD absorption)." },
        { ko: "BJT는 전류 제어 소자로 베이스 전류로 컬렉터 전류를 제어하고(I_C = I_B × h_FE), 스위칭 시 포화 Vce≈0.2V로 동작한다.", en: "The BJT is a current-controlled device controlling collector current via base current (I_C = I_B × h_FE), operating at saturation Vce≈0.2V when switching." },
        { ko: "MOSFET은 전압 제어 스위치이자 3상 인버터의 핵심 부품으로, Vgs 12~15V가 필요해 MCU 단독 구동이 안 되어 게이트 드라이버 IC가 필수다.", en: "The MOSFET is a voltage-controlled switch and the core part of a 3-phase inverter; it needs Vgs of 12~15V, so the MCU cannot drive it alone, making a gate-driver IC essential." }
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "BJT(전류 제어) vs MOSFET(전압 제어)", en: "BJT (current-controlled) vs MOSFET (voltage-controlled)" },
        headers: [
          { ko: "", en: "" },
          { ko: "BJT", en: "BJT" },
          { ko: "MOSFET", en: "MOSFET" }
        ],
        rows: [
          [ { ko: "제어 방식", en: "Control" }, { ko: "베이스 전류로 제어", en: "by base current" }, { ko: "게이트 전압으로 제어", en: "by gate voltage" } ],
          [ { ko: "스위칭 시", en: "Switching" }, { ko: "포화 Vce≈0.2V", en: "saturation Vce≈0.2V" }, { ko: "선형 영역 낮은 Rds(on)", en: "ohmic, low Rds(on)" } ],
          [ { ko: "구동", en: "Drive" }, { ko: "I_C = I_B × h_FE", en: "I_C = I_B × h_FE" }, { ko: "Vgs 12~15V → 게이트 드라이버", en: "Vgs 12~15V → gate driver" } ]
        ]
      }
    },
    {
      heading: { ko: "전원 회로 — 벅 강압 · 부스트 승압", en: "Power circuits — buck step-down, boost step-up" },
      bullets: [
        { ko: "전원회로는 저노이즈·정밀하지만 발열·저효율인 리니어 레귤레이터와, 고효율·승강압이 되지만 스위칭 노이즈·부품이 많은 스위칭 레귤레이터(DC-DC)로 나뉜다.", en: "Power circuits divide into linear regulators (low noise, precise, but hot and inefficient) and switching regulators (DC-DC: efficient, step up or down, but with switching noise and more parts)." },
        { ko: "벅(강압)은 인덕터를 거쳐 Vout < Vin을, 부스트(승압)는 Vout > Vin을 만들며, 둘 다 스위치를 On/Off 한다.", en: "Buck (step-down) makes Vout < Vin through an inductor and boost (step-up) makes Vout > Vin, both toggling the switch On/Off." },
        { ko: "벅컨버터의 핵심 원리는 인덕터 전압의 On/Off 넓이가 같아야 한다는 Volt-second 평형이며, 동기식 벅은 다이오드를 MOSFET으로 교체해 효율을 올린다.", en: "The core of the buck converter is volt-second balance — the On and Off areas of the inductor voltage must match — and a synchronous buck improves efficiency by replacing the diode with a MOSFET." }
      ]
    }
  ],
  pitfall: {
    ko: "이 슬라이드는 깊은 이론이 아니라 '개요(지도)'라는 점을 잊으면 안 된다 — 각 소자의 깊은 이해는 강의 수강과 AI 틈새학습으로 개별 페이지를 채우며 보완해야 한다. 슬라이드가 '뒤 강의에서 자세히'로 미룬 OP-AMP 전류 센싱, 3상 인버터 MOSFET 6개 배치·commutation, 게이트 드라이버 IC 설계는 여기에 없으므로, 이 지도만으로 실전 설계를 끝냈다고 착각하지 말 것.",
    en: "Do not forget this slide is an 'overview (map),' not deep theory — a deep grasp of each component must be filled in through the course and AI micro-study on separate pages. The items the slide defers to 'covered in detail later' — OP-AMP current sensing, the placement and commutation of the six MOSFETs in a 3-phase inverter, and gate-driver IC design — are absent here, so do not mistake this map for finished real-world design."
  }
};
