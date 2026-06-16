import type { TopicDetail } from "../../types";

export const diodeCircuits: TopicDetail = {
  tldr: {
    ko: "다이오드 응용 회로 5종 — 삼상 전파 정류(6다이오드 브리지 + 평활 커패시터)로 AC를 DC로, 스위칭/쇼트키 선정, 제너로 일정 전압을 만드는 정전압 회로(RS로 IZ 제한), 피크를 깎는 제너 클램핑(단/양방향), 그리고 ESD·서지를 GND로 흘려보내는 TVS 보호. 정류·스위칭은 순방향 도통을, 제너·TVS는 역방향 항복을 제어된 형태로 씁니다.",
    en: "Five applied diode circuits — three-phase full-wave rectification (6-diode bridge + smoothing cap) AC→DC, switching/Schottky selection, a Zener voltage regulator (RS limits IZ), a Zener clamp that shaves peaks (uni-/bi-directional), and TVS protection that shunts ESD/surge to GND. Rectifiers/switching use forward conduction; Zener/TVS use reverse breakdown in a controlled way.",
  },
  sections: [
    {
      heading: { ko: "삼상 전파 정류 + 평활", en: "Three-phase full-wave rectify + smoothing" },
      bullets: [
        {
          ko: "삼상 교류(R·S·T)를 6개 다이오드 브리지로 정류해 DC로 만듭니다. 다이오드만 거치면 맥동(ripple)이 커, 출력단 커패시터로 평활해야 매끈한 DC가 됩니다.",
          en: "A 6-diode bridge rectifies three-phase AC (R/S/T) into DC. Diodes alone leave big ripple, so an output capacitor smooths it into clean DC.",
        },
        {
          ko: "이 정류는 MOSFET 6개로 짜는 3상 인버터(DC→AC)의 반대 동작이고, 평활 커패시터는 킥보드 입력단 940µF 전해와 같은 결입니다.",
          en: "This rectifier is the reverse of the 6-MOSFET three-phase inverter (DC→AC), and the smoothing cap is the same idea as the kickboard's 940 µF input electrolytic.",
        },
      ],
      diagram: [
        {
          kind: "plot",
          caption: { ko: "정류 직후엔 맥동(ripple)이 크고, 평활 커패시터가 골을 채워 매끈한 DC에 가깝게 만든다", en: "Right after rectification the ripple is large; the smoothing cap fills the troughs toward clean DC" },
          xLabel: { ko: "시간", en: "time" },
          yLabel: { ko: "전압", en: "V" },
          series: [
            { label: { ko: "정류 맥동 DC", en: "rippled DC" }, curve: "rectified", tone: 3 },
            { label: { ko: "평활 후 ≈ 매끈한 DC", en: "smoothed ≈ clean DC" }, curve: "dc", tone: "accent" },
          ],
        },
        {
        kind: "flow",
        dir: "row",
        caption: { ko: "AC → 6다이오드 → 평활 → 매끈한 DC", en: "AC → 6 diodes → smoothing → clean DC" },
        nodes: [
          { label: { ko: "삼상 교류", en: "3-phase AC" }, sub: { ko: "R·S·T", en: "R·S·T" }, tone: 2 },
          { icon: "▷", label: { ko: "6-다이오드 브리지", en: "6-diode bridge" }, sub: { ko: "전파 정류", en: "full-wave" }, tone: 6 },
          { label: { ko: "맥동 DC", en: "Rippled DC" }, tone: 3 },
          { icon: "🔋", label: { ko: "평활 커패시터", en: "Smoothing cap" }, sub: { ko: "매끈한 DC", en: "clean DC" }, tone: 4 },
        ],
        },
      ],
    },
    {
      heading: { ko: "제너 정전압 — RS로 전류를 묶어 일정 전압", en: "Zener regulator — clamp current with RS for steady V" },
      bullets: [
        {
          ko: "제너를 역방향으로 걸면 제너 전압 Vz에서 클램핑돼 양단 전압이 일정하게 유지됩니다. 단 Vz를 유지하려면 IZmin~IZmax 사이의 전류가 흘러야 합니다.",
          en: "Reverse-bias a Zener and it clamps at Vz, holding its voltage steady — but only while its current stays between IZmin and IZmax.",
        },
        {
          ko: "입력단 RS로 그 범위에 들도록 설계합니다. IZmax를 넘으면 제너가 소손되므로 RS의 전류 제한이 필수입니다.",
          en: "Size the series RS so current lands in that window; exceeding IZmax destroys the Zener, so RS current-limiting is mandatory.",
        },
      ],
      diagram: {
        kind: "formula",
        expr: "R_S = \\dfrac{V_{in} - V_Z}{I_Z + I_L}",
        caption: { ko: "IZmin < IZ < IZmax 안에 들도록 RS 설계", en: "Size RS so IZmin < IZ < IZmax" },
        legend: [
          { sym: "V_Z", desc: { ko: "제너(클램핑) 전압", en: "Zener (clamp) voltage" } },
          { sym: "I_Z", desc: { ko: "제너 전류 (min~max)", en: "Zener current (min–max)" } },
          { sym: "I_L", desc: { ko: "부하 전류", en: "Load current" } },
        ],
      },
    },
    {
      heading: { ko: "제너 클램핑 — 피크를 깎는다", en: "Zener clamp — shave the peaks" },
      bullets: [
        {
          ko: "단방향(제너 1개)은 +측 피크를 Vz로 클램핑하고, −측은 일반 다이오드처럼 순방향 턴온돼 −0.7V로 제한합니다.",
          en: "Uni-directional (1 Zener) clamps the + peak at Vz; the − side turns on like an ordinary diode, limited to −0.7 V.",
        },
        {
          ko: "양방향(제너 2개 역직렬)은 양·음 모두 ±(Vz+0.7V)로 제한 — 한쪽은 항복(Vz), 직렬인 다른 쪽은 순방향(0.7V)으로 동시에 동작하기 때문입니다.",
          en: "Bi-directional (two Zeners back-to-back) limits both polarities to ±(Vz+0.7 V) — one breaks down (Vz) while the series partner conducts forward (0.7 V).",
        },
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "단방향 vs 양방향 클램핑 출력", en: "Uni- vs bi-directional clamp output" },
        headers: [
          { ko: "반주기", en: "Half-cycle" },
          { ko: "단방향 (제너 1개)", en: "Uni (1 Zener)" },
          { ko: "양방향 (2개 역직렬)", en: "Bi (2 back-to-back)" },
        ],
        rows: [
          [
            { ko: "양(+)", en: "Positive (+)" },
            { ko: "Vz로 클램핑", en: "clamp at Vz" },
            { ko: "+(Vz+0.7V)", en: "+(Vz+0.7 V)" },
          ],
          [
            { ko: "음(−)", en: "Negative (−)" },
            { ko: "−0.7V (순방향 턴온)", en: "−0.7 V (forward)" },
            { ko: "−(Vz+0.7V)", en: "−(Vz+0.7 V)" },
          ],
        ],
      },
    },
    {
      heading: { ko: "TVS 보호 — 평소엔 놀다가 서지를 GND로", en: "TVS protection — idle, then shunt surge to GND" },
      bullets: [
        {
          ko: "TVS를 보호 대상(MCU) 입력과 GND 사이에 병렬로 답니다. 정상 전압엔 고임피던스라 무동작, ESD·서지 같은 과전압이 오면 매우 빠르게 도통해 큰 전류를 GND로 우회시켜 MCU를 보호합니다.",
          en: "Place a TVS in parallel between the protected input (MCU) and GND. At normal voltage it's high-impedance and idle; on an ESD/surge over-voltage it conducts very fast, shunting the big current to GND to protect the MCU.",
        },
        {
          ko: "양·음 양쪽 서지를 막으려면 TVS를 양방향으로 구성합니다. 커넥터처럼 외부에 노출되는 입력에 기본 장착합니다.",
          en: "Use a bidirectional TVS to block both polarities; fit one by default on externally exposed inputs like connectors.",
        },
      ],
      diagram: {
        kind: "branch",
        caption: { ko: "정상은 통과, 서지는 흡수해 GND로", en: "Pass when normal, absorb surge to GND" },
        root: { icon: "🔌", label: { ko: "커넥터 입력", en: "Connector in" }, tone: 6 },
        children: [
          { icon: "✅", label: { ko: "정상 → MCU", en: "Normal → MCU" }, sub: { ko: "TVS 고임피던스", en: "TVS high-Z" }, tone: 4 },
          { icon: "⚡", label: { ko: "서지 → TVS → GND", en: "Surge → TVS → GND" }, sub: { ko: "큰 전류 흡수", en: "absorbs current" }, tone: "accent" },
        ],
      },
    },
  ],
  pitfall: {
    ko: "삼상 전파 정류(다이오드 6개) ↔ 3상 인버터(MOSFET 6개)는 AC↔DC 거울 관계 — 곧 배울 MOSFET 브리지와 묶어 보면 인버터 보드 전체가 그려집니다. 제너 RS의 정확한 사이징·부하 변동 대응은 데이터시트로 보강할 자리. 전사 원본 STT 오인식(종류→정류, 평안→평활, 배너→제너, 트램핑→클램핑)은 상단 대조표 참고.",
    en: "Three-phase rectify (6 diodes) ↔ three-phase inverter (6 MOSFETs) are an AC↔DC mirror — pair it with the upcoming MOSFET bridge and the whole inverter board comes into view. Exact RS sizing and load-variation handling stay to be filled from datasheets. For raw-transcript STT errors, check the correction table.",
  },
};
