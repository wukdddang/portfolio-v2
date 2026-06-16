import type { TopicDetail } from "../../types";

export const mosfet: TopicDetail = {
  tldr: {
    ko: "MOSFET은 게이트-소스 전압으로 드레인-소스 채널을 여닫는 전압 제어 스위치로, 3상 인버터의 핵심 부품(6개)입니다. 게이트가 절연돼 있어 전류가 아닌 전압(전기장)으로 채널을 만듭니다. BJT와 달리 ON 시 일정 강하(VCE(sat)) 대신 도통 저항 Rds(on)이 나타나 I²R 발열이 선정 급소이고, 공정상 기생 커패시턴스(Ciss·Coss·Crss)와 바디 다이오드가 따라옵니다. 스위칭은 손실 적은 선형(ohmic) 영역에서 — 게이트를 12V로 켜야 해 STM32 3.3V로는 부족하므로 게이트 드라이버 IC가 필수입니다.",
    en: "A MOSFET is a voltage-controlled switch that opens/closes the drain-source channel via gate-source voltage — the core part (×6) of a 3-phase inverter. Its gate is insulated, so it controls via voltage (a field), not current. Unlike a BJT, when ON it shows an on-resistance Rds(on) instead of a fixed drop (VCE(sat)), so I²R heat is the key selection criterion; fabrication also leaves parasitic capacitances (Ciss/Coss/Crss) and a body diode. Switching happens in the low-loss linear (ohmic) region — and since the gate needs ~12V while an STM32 outputs only 3.3V, a gate-driver IC is mandatory.",
  },
  sections: [
    {
      heading: { ko: "MOSFET이란 + 심볼이 그렇게 생긴 이유", en: "What a MOSFET is + why the symbol looks like that" },
      bullets: [
        {
          ko: "게이트-소스 전압(VGS)으로 드레인-소스 사이 전도 채널을 만들어 전류를 여닫는 전압 제어 소자입니다.",
          en: "A voltage-controlled device that forms a conducting drain-source channel via gate-source voltage (VGS) to switch current.",
        },
        {
          ko: "심볼 3조각만 읽으면 된다 — 게이트가 본체와 떨어짐(절연 → 전압 제어), 가운데 끊긴 채널(평소 OFF, Vth 넘으면 ON), 안쪽 화살표(바디 다이오드·N/P채널 구분).",
          en: "Read just three parts — the gate drawn separate (insulated → voltage control), the broken channel in the middle (OFF until VGS>Vth), and the inner arrow (the body diode, also marking N-/P-channel).",
        },
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "MOSFET 심볼 3조각", en: "Three parts of the MOSFET symbol" },
        headers: [
          { ko: "심볼 요소", en: "Symbol part" },
          { ko: "의미", en: "Meaning" },
        ],
        rows: [
          [
            { ko: "게이트가 떨어져 있음", en: "Gate drawn apart" },
            { ko: "절연 → 전류 X, 전압으로만 제어", en: "Insulated → no current, voltage control" },
          ],
          [
            { ko: "가운데 끊긴 채널", en: "Broken channel" },
            { ko: "평소 OFF · VGS>Vth면 ON", en: "OFF normally · ON when VGS>Vth" },
          ],
          [
            { ko: "안쪽 화살표", en: "Inner arrow" },
            { ko: "바디(기생) 다이오드", en: "Body (parasitic) diode" },
          ],
        ],
      },
    },
    {
      heading: { ko: "BJT vs MOSFET — ON 특성이 다르다", en: "BJT vs MOSFET — different ON behavior" },
      bullets: [
        {
          ko: "둘 다 작은 입력으로 큰 출력을 제어하지만, BJT는 베이스 전류로·MOSFET은 게이트 전압(절연)으로 제어합니다.",
          en: "Both control a large output with a small input, but a BJT uses base current while a MOSFET uses gate voltage (insulated).",
        },
        {
          ko: "함정: '완전히 켠 스위치' 영역의 이름이 BJT는 포화, MOSFET은 선형(ohmic)으로 정반대입니다. MOSFET의 포화는 오히려 손실 큰 통과 구간.",
          en: "Trap: the 'fully-on switch' region is called saturation for a BJT but linear (ohmic) for a MOSFET — opposite names. A MOSFET's saturation is actually the lossy transition.",
        },
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "닮았지만 ON 상태가 다름", en: "Alike, but ON state differs" },
        headers: [
          { ko: "", en: "" },
          { ko: "BJT", en: "BJT" },
          { ko: "MOSFET", en: "MOSFET" },
        ],
        rows: [
          [
            { ko: "제어", en: "Control" },
            { ko: "베이스 전류", en: "Base current" },
            { ko: "게이트 전압(절연)", en: "Gate voltage (insulated)" },
          ],
          [
            { ko: "ON 시", en: "When ON" },
            { ko: "VCE(sat) ≈ 0.2~0.3V", en: "VCE(sat) ≈ 0.2–0.3V" },
            { ko: "Rds(on) 저항 (I²R 발열)", en: "Rds(on) (I²R heat)" },
          ],
          [
            { ko: "스위칭 영역", en: "Switching region" },
            { ko: "포화", en: "Saturation" },
            { ko: "선형(ohmic) ← 반대!", en: "Linear (ohmic) ← opposite!" },
          ],
        ],
      },
    },
    {
      heading: { ko: "동작 영역 3개 — 스위칭은 선형(ohmic)에서", en: "Three regions — switch in the linear (ohmic) region" },
      bullets: [
        {
          ko: "차단(VGS<Vth, OFF) · 선형/ohmic(완전 ON, Rds(on) 최소, 저손실) · 포화(VDS 큼, 고손실 통과 구간) 셋으로 나뉩니다.",
          en: "Cut-off (VGS<Vth, OFF), linear/ohmic (fully ON, minimum Rds(on), low loss), and saturation (large VDS, lossy transition).",
        },
        {
          ko: "스위칭(90%+ 용도)은 선형에서 하고, 손실 큰 포화 구간은 빠르게 통과시켜야 효율이 납니다 — 그래서 게이트를 빠르고 충분히 구동.",
          en: "Switching (90%+ of use) happens in linear; pass quickly through the lossy saturation region for efficiency — hence drive the gate fast and hard.",
        },
      ],
      diagram: {
        kind: "branch",
        caption: { ko: "차단 → (포화 빨리 통과) → 선형 안착", en: "Cut-off → (pass saturation fast) → settle in linear" },
        root: { icon: "🎚", label: { ko: "MOSFET 동작 영역", en: "MOSFET regions" }, tone: "accent" },
        children: [
          { label: { ko: "차단", en: "Cut-off" }, sub: { ko: "VGS<Vth · OFF", en: "VGS<Vth · OFF" }, tone: "muted" },
          { label: { ko: "선형(ohmic)", en: "Linear (ohmic)" }, sub: { ko: "완전 ON · Rds(on) 최소 · 스위칭", en: "fully ON · min Rds(on) · switch" }, tone: 4 },
          { label: { ko: "포화", en: "Saturation" }, sub: { ko: "고손실 · 빨리 통과", en: "lossy · pass fast" }, tone: 3 },
        ],
      },
    },
    {
      heading: { ko: "전기적 특성 — SQJQ466E 데이터시트", en: "Electrical characteristics — SQJQ466E datasheet" },
      bullets: [
        {
          ko: "인버터용 N채널 SQJQ466E 기준 주요 정격 — VDS 60V(절대 초과 금지)·VGS ±20V·ID 200A(25°C)/118A(125°C 디레이팅)·문턱 VGS(th) 3.5V·Rds(on) 1.9mΩ.",
          en: "Key ratings of the inverter N-channel SQJQ466E — VDS 60V (never exceed), VGS ±20V, ID 200A (25°C)/118A (125°C derated), threshold VGS(th) 3.5V, Rds(on) 1.9mΩ.",
        },
        {
          ko: "Rds(on) 발열이 선정 급소 — 200A면 P=I²R=200²×0.0019≈80W로 방열 없이 감당 불가. 그래서 실제 인버터는 큰 마진을 두고 'Rds(on) 낮은 소자'를 고른다.",
          en: "Rds(on) heat is the selection crux — at 200A, P=I²R=200²×0.0019≈80W, impossible without heatsinking. Real inverters keep a big margin and pick low-Rds(on) parts.",
        },
      ],
      diagram: {
        kind: "formula",
        expr: "P_{loss} = I_D^2 \\times R_{ds(on)} = 200^2 \\times 0.0019 \\approx 80\\,W",
        caption: { ko: "Rds(on)이 곧 발열 — 200A에서 80W", en: "Rds(on) is the heat — 80W at 200A" },
        legend: [
          { sym: "I_D", desc: { ko: "드레인 전류", en: "drain current" } },
          { sym: "R_{ds(on)}", desc: { ko: "도통 저항 (1.9mΩ)", en: "on-resistance (1.9mΩ)" } },
        ],
      },
    },
    {
      heading: { ko: "기생 커패시턴스 — 스위칭 속도·손실의 원인", en: "Parasitic capacitance — source of switching speed & loss" },
      bullets: [
        {
          ko: "공정상 Cgd·Cgs·Cds가 생기고, 게이트를 켜고 끄려면 이들을 충·방전해야 합니다. 값이 크면 스위칭이 느려지고 I=C·dv/dt로 손실이 납니다.",
          en: "Fabrication leaves Cgd·Cgs·Cds; turning the gate on/off means charging/discharging them. Larger values slow switching and cause loss via I=C·dv/dt.",
        },
        {
          ko: "데이터시트 분류 — Ciss=Cgs+Cgd(입력), Coss=Cds+Cgd(출력), Crss=Cgd(역전달). 충·방전 전류를 빠르게 대려면 MCU론 부족 → 게이트 드라이버 IC 필수.",
          en: "Datasheet groups them — Ciss=Cgs+Cgd (input), Coss=Cds+Cgd (output), Crss=Cgd (reverse). Supplying that charge fast is beyond an MCU → a gate-driver IC is mandatory.",
        },
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "게이트 충·방전 → 스위칭 / I=C·dv/dt 손실", en: "Gate charge/discharge → switching / I=C·dv/dt loss" },
        nodes: [
          { label: { ko: "게이트 전압 인가", en: "apply VGS" }, tone: 2 },
          { label: { ko: "기생 C 충·방전", en: "charge/discharge C" }, sub: { ko: "Cgs·Cgd", en: "Cgs·Cgd" }, tone: 6 },
          { label: { ko: "Turn On/Off", en: "Turn On/Off" }, tone: 4 },
          { icon: "🔥", label: { ko: "I=C·dv/dt 손실", en: "I=C·dv/dt loss" }, sub: { ko: "C 클수록 느리고 손실↑", en: "bigger C → slower, lossy" }, tone: "accent" },
        ],
      },
    },
    {
      heading: { ko: "바디(기생) 다이오드", en: "Body (parasitic) diode" },
      bullets: [
        {
          ko: "공정상 드레인-소스 사이에 생기는 기생 다이오드. 게이트가 0V라 MOSFET이 OFF여도 소스 전압 > 드레인 전압이면 소스→드레인으로 전류가 흐른다.",
          en: "A parasitic diode between drain and source. Even with the gate at 0V (MOSFET OFF), current flows source→drain when the source voltage exceeds the drain.",
        },
        {
          ko: "역회복 시간(trr)이 비교적 길어 손실 문제가 되면 외부 다이오드(쇼트키 등)를 추가한다. 인버터에선 유도성 부하의 환류(freewheeling) 경로로 활용되기도 한다.",
          en: "Its reverse-recovery time (trr) is fairly long, so an external diode (e.g., Schottky) is added if loss matters; in inverters it also serves as the freewheeling path for inductive loads.",
        },
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "OFF여도 소스>드레인이면 도통 → 환류 경로", en: "Conducts when source>drain even if OFF → freewheeling path" },
        nodes: [
          { label: { ko: "MOSFET OFF (게이트 0V)", en: "MOSFET OFF (gate 0V)" }, tone: "muted" },
          { label: { ko: "소스 > 드레인 전압", en: "source > drain" }, tone: 6 },
          { label: { ko: "바디 다이오드 도통", en: "body diode conducts" }, sub: { ko: "소스 → 드레인", en: "source → drain" }, tone: "accent" },
          { label: { ko: "인버터 환류 경로", en: "inverter freewheeling" }, sub: { ko: "+ 역회복 trr 고려", en: "+ trr to consider" }, tone: 4 },
        ],
      },
    },
  ],
  pitfall: {
    ko: "가장 헷갈리는 함정 — '완전히 켠 스위치' 영역이 BJT는 포화, MOSFET은 선형(ohmic)으로 명명이 반대다. 'MOSFET 스위칭은 선형에서, 포화는 빨리 지나칠 손실 구간'으로 기억할 것. 강의 슬라이드(SQJQ466E)의 정확한 수치를 raw 전사본 '슬라이드 자료'로 박제했고, 패키지·게이트 드라이버 회로 선정은 인버터 설계 강의에서 채울 자리.",
    en: "Biggest trap — the 'fully-on switch' region is named oppositely: saturation for BJT, linear (ohmic) for MOSFET. Remember 'MOSFET switches in linear; saturation is the lossy region to pass through quickly.' The exact SQJQ466E datasheet numbers are pinned in the raw transcript's 'slide data'; package and gate-driver circuit selection come in the inverter-design lectures.",
  },
};
