import type { TopicDetail } from "../../types";

export const bjt: TopicDetail = {
  tldr: {
    ko: "BJT는 작은 베이스 전류로 큰 컬렉터 전류를 제어하는 전류 제어 능동소자로, 쓰임은 전류 증폭과 온오프 스위칭 둘입니다. 내부 접합에 따라 NPN/PNP로 갈리고 베이스-에미터 문턱(~0.7V)을 넘겨야 켜집니다. 동작 영역은 차단(OFF)·선형(증폭, IC=IB·hFE)·포화(스위칭, VCE(sat)≈0.2V) 셋 — 스위칭이 '포화'에서 일어난다는 점이 MOSFET(스위칭=선형/ohmic)과 명명이 정반대인 핵심 함정입니다. 설계는 hFE로 베이스 전류를 역산해, 2N3904로 IC=50mA 스위치를 만들 때 데이터시트 VCE(sat)·VBE(sat)로 RL·RB를 계산합니다.",
    en: "A BJT is a current-controlled device where a small base current steers a large collector current; its two uses are current amplification and on/off switching. Internal junctions split it into NPN/PNP, and it turns on past the base-emitter threshold (~0.7V). Three regions — cut-off (OFF), active (amplify, IC=IB·hFE), saturation (switch, VCE(sat)≈0.2V). That switching happens in *saturation* is the opposite of a MOSFET (switch = linear/ohmic) — the key trap. Design back-calculates base current from hFE: for a 50mA switch on a 2N3904, size RL and RB from the datasheet VCE(sat)/VBE(sat).",
  },
  sections: [
    {
      heading: { ko: "BJT란 — 전류로 전류를 제어", en: "What a BJT is — current controls current" },
      bullets: [
        {
          ko: "NPN 기준, 작은 베이스 전류(IB)를 흘리면 컬렉터→에미터로 hFE배 큰 전류(IC)가 흐릅니다. 도통 조건은 베이스-에미터 전압이 ~0.7V 문턱을 넘는 것 — PN 접합 문턱 그대로입니다(PNP는 전압 방향 반대).",
          en: "In an NPN, a small base current (IB) lets an hFE-times-larger current (IC) flow collector→emitter. It conducts once the base-emitter voltage passes the ~0.7V threshold — the PN-junction threshold itself (PNP is the opposite polarity).",
        },
        {
          ko: "쓰임은 둘 — 작은 신호를 키우는 전류 증폭, 그리고 켰다 끄는 온오프 스위칭.",
          en: "Two uses — current amplification (boosting a small signal) and on/off switching.",
        },
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "작은 IB → hFE배 증폭 → 큰 IC", en: "Small IB → ×hFE → large IC" },
        nodes: [
          { label: { ko: "베이스 전류 IB", en: "Base current IB" }, sub: { ko: "VBE > 0.7V", en: "VBE > 0.7V" }, tone: 2 },
          { icon: "📶", label: { ko: "hFE배 증폭", en: "×hFE" }, tone: "accent" },
          { label: { ko: "컬렉터 전류 IC", en: "Collector current IC" }, sub: { ko: "IC = IB·hFE", en: "IC = IB·hFE" }, tone: 4 },
          { label: { ko: "증폭 / 스위칭", en: "Amplify / switch" }, tone: 6 },
        ],
      },
    },
    {
      heading: { ko: "동작 영역 3개 — 스위칭은 포화에서", en: "Three regions — switch in saturation" },
      bullets: [
        {
          ko: "차단(IB≈0 → IC≈0, OFF) · 선형/활성(IC=IB·hFE, 증폭) · 포화(VCE(sat)≈0.2V, 완전 ON 스위치) 셋으로 나뉩니다.",
          en: "Cut-off (IB≈0 → IC≈0, OFF), active/linear (IC=IB·hFE, amplify), and saturation (VCE(sat)≈0.2V, fully-on switch).",
        },
        {
          ko: "함정: 완전히 켠 스위치 영역이 BJT는 '포화', MOSFET은 '선형(ohmic)'으로 명명이 정반대입니다. BJT 포화 = ON, MOSFET 포화 = 손실 큰 통과 구간.",
          en: "Trap: the 'fully-on switch' region is called saturation for a BJT but linear (ohmic) for a MOSFET — opposite names. BJT saturation = ON; MOSFET saturation = the lossy transition.",
        },
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "세 영역 — 증폭은 선형, 스위칭은 포화", en: "Three regions — amplify in active, switch in saturation" },
        headers: [
          { ko: "영역", en: "Region" },
          { ko: "조건", en: "Condition" },
          { ko: "동작 / 용도", en: "Behavior / use" },
        ],
        rows: [
          [
            { ko: "차단", en: "Cut-off" },
            { ko: "IB ≈ 0", en: "IB ≈ 0" },
            { ko: "IC≈0, OFF (open)", en: "IC≈0, OFF (open)" },
          ],
          [
            { ko: "선형(활성)", en: "Active" },
            { ko: "IB 흐름", en: "IB flows" },
            { ko: "IC=IB·hFE — 증폭", en: "IC=IB·hFE — amplify" },
          ],
          [
            { ko: "포화", en: "Saturation" },
            { ko: "IB 충분히 큼", en: "IB large enough" },
            { ko: "VCE(sat)≈0.2V, 완전 ON — 스위칭", en: "VCE(sat)≈0.2V, fully ON — switch" },
          ],
        ],
      },
    },
    {
      heading: { ko: "hFE 증폭 + 2N3904 스위칭 설계", en: "hFE gain + 2N3904 switching design" },
      bullets: [
        {
          ko: "선형에서 IC = IB×hFE. hFE는 데이터시트값이며, 포화에선 선형값보다 절반 이상 줄어드는 경향이라 스위칭 설계 땐 보수적으로(예: ~10) 잡습니다.",
          en: "In active region IC = IB×hFE. hFE comes from the datasheet and drops by half or more in saturation, so switching design assumes it conservatively (e.g., ~10).",
        },
        {
          ko: "2N3904로 IC=50mA 스위치 (VCC=12V, VIN=5V): 데이터시트 Max Ratings(VCEO 80V·IC 0.2A) 확인 후, RL은 컬렉터 전류를·RB는 베이스 전류를 정한다.",
          en: "A 50mA switch on a 2N3904 (VCC=12V, VIN=5V): after checking Max Ratings (VCEO 80V, IC 0.2A), RL sets collector current and RB sets base current.",
        },
      ],
      diagram: {
        kind: "formula",
        expr: "R_L = \\dfrac{V_{CC} - V_{CE(sat)}}{I_C},\\quad R_B = \\dfrac{V_{IN} - V_{BE(sat)}}{I_B}",
        caption: { ko: "RL=(12−0.3)/50mA≈234Ω→245Ω · RB=(5−0.95)/5mA=810Ω→820Ω", en: "RL=(12−0.3)/50mA≈234Ω→245Ω · RB=(5−0.95)/5mA=810Ω→820Ω" },
        legend: [
          { sym: "I_B", desc: { ko: "= IC/hFE = 50mA/10 = 5mA", en: "= IC/hFE = 50mA/10 = 5mA" } },
          { sym: "V_{CE(sat)}", desc: { ko: "0.3V (데이터시트)", en: "0.3V (datasheet)" } },
          { sym: "V_{BE(sat)}", desc: { ko: "0.95V (데이터시트)", en: "0.95V (datasheet)" } },
        ],
      },
    },
  ],
  pitfall: {
    ko: "가장 큰 함정 — 완전히 켠 스위치 영역이 BJT는 '포화', MOSFET은 '선형(ohmic)'으로 명명이 반대다. 둘을 같이 배우면 반드시 헷갈리니 'ON 스위치 영역 이름이 반대'임을 못박아 둘 것. 인버터 주 스위치는 게이트 전류 ≈0으로 구동이 쉽고 손실이 작은 MOSFET이 맡고, BJT는 그 전류 제어 원형·소신호 증폭에서 쓰인다. (강의도 RL을 계산 234Ω 대신 표준 245Ω로 맞췄음.)",
    en: "Biggest trap — the fully-on switch region is 'saturation' for a BJT but 'linear (ohmic)' for a MOSFET; learn them together and you'll mix them up, so nail down that the 'ON region' names are reversed. The inverter's main switch is the MOSFET (≈0 gate current, easy drive, low loss); the BJT is its current-control archetype, still used for small-signal amplification. (The lecture also rounded RL from the computed 234Ω to the standard 245Ω.)",
  },
};
