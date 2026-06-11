import type { TopicDetail } from "../../types";

export const capacitor: TopicDetail = {
  tldr: {
    ko: "킥보드 임베디드 강의 「커패시터 소자 용도」를 컴파일한 페이지로, 커패시터 실전 용법 4종(대용량 전해 전압 안정화·디커플링/바이패스·병렬 합성·RC 필터)을 다룬다. 네 용법 모두 '주파수가 높을수록 임피던스가 낮아진다'는 단일 특성에서 파생되며, 공진점 왼쪽 영역까지만 필터로 유효하다는 관점이 전체를 관통한다. 실무 기본기는 두 가지로, 커패시터는 IC 전원핀에 최대한 가까이 배치하고 용량은 0.1µF(100nF)을 기본으로 깔고 측정 후 튜닝한다. 이종 용량 병렬은 반공진점이 여러 개 생겨 오히려 특성이 악화될 수 있다.",
    en: "This page compiles the kickboard embedded lecture on capacitor uses, covering four practical applications: bulk electrolytic voltage stabilization, decoupling/bypass, parallel combination, and RC filtering. All four derive from a single property — impedance drops as frequency rises — and the unifying view is that a capacitor only works as a filter in the region left of its resonance point. Two practical fundamentals dominate: place the capacitor as close as possible to the IC power pin, and start with 0.1µF (100nF) as the default value, then tune after measurement. Mixing different capacitance values in parallel can introduce multiple anti-resonance points and actually worsen the response."
  },
  sections: [
    {
      heading: { ko: "용법 지도 — 전부 주파수 특성에서 나온다", en: "Usage map — everything stems from the frequency characteristic" },
      bullets: [
        { ko: "커패시터의 임피던스는 저주파에서 높고 주파수가 올라갈수록 낮아지는데, 이 한 가지 특성이 네 가지 실전 용법의 공통 뿌리다.", en: "A capacitor's impedance is high at low frequencies and falls as frequency rises, and this single property is the common root of all four practical uses." },
        { ko: "단, 공진점을 지나면 커패시터가 유도성(인덕터처럼)으로 변하므로 공진점 왼쪽 영역만 필터로 사용한다.", en: "However, past the resonance point a capacitor turns inductive (behaving like an inductor), so only the region left of resonance is usable as a filter." }
      ],
      diagram: {
        kind: "branch",
        caption: { ko: "주파수 특성 하나에서 파생되는 커패시터 용도", en: "Capacitor uses derived from one frequency characteristic" },
        root: { icon: "🔋", label: { ko: "커패시터 주파수 특성", en: "Capacitor frequency characteristic" }, sub: { ko: "고주파일수록 임피던스 낮음", en: "higher freq → lower impedance" }, tone: "accent" },
        children: [
          { label: { ko: "① 대용량 전해", en: "(1) Bulk electrolytic" }, sub: { ko: "전압 안정화·에너지 백업", en: "voltage stabilization / backup" }, tone: 2 },
          { label: { ko: "② 디커플링", en: "(2) Decoupling" }, sub: { ko: "IC 순간 전류 공급", en: "supplies IC transient current" }, tone: 4 },
          { label: { ko: "③ 바이패스", en: "(3) Bypass" }, sub: { ko: "고주파 노이즈 GND 우회", en: "diverts HF noise to GND" }, tone: 5 },
          { label: { ko: "④ RC 필터", en: "(4) RC filter" }, sub: { ko: "LPF·HPF 차단주파수 설계", en: "LPF/HPF cutoff design" }, tone: 1 }
        ]
      }
    },
    {
      heading: { ko: "대용량 전해 vs 디커플링·바이패스", en: "Bulk electrolytic vs decoupling/bypass" },
      bullets: [
        { ko: "킥보드 보드의 DC 배터리 입력단에는 470µF 전해 커패시터 2개(C56·C57)를 병렬로 묶어 총 940µF를 구성했으며, 병렬 합성 용량은 단순 합산이다.", en: "The kickboard board's DC battery input uses two 470µF electrolytic capacitors (C56, C57) in parallel for a total of 940µF, since parallel capacitance simply adds up." },
        { ko: "모터가 급가속하며 전류를 확 당기면 배터리만으로는 순간 공급이 늦어 전압이 출렁이는데, 입력단 대용량 전해가 저장해둔 에너지를 즉시 토해내 전압을 잡아준다.", en: "When the motor accelerates hard and draws a current surge, the battery alone is too slow and the voltage sags; the bulk input electrolytic instantly dumps its stored energy to hold the voltage steady." },
        { ko: "디커플링은 IC 바로 옆 커패시터가 로컬 에너지 탱크로 순간 전류를 즉시 공급하는 것으로, 멀리 달면 강의 표현 그대로 '달아도 안 단 것과 같다'.", en: "Decoupling places a capacitor right next to the IC as a local energy tank that instantly supplies transient current; placed far away it is, in the lecture's words, 'as if it were not there at all'." }
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "디커플링 vs 바이패스 — 실무에선 거의 동일하게 취급", en: "Decoupling vs bypass — treated almost identically in practice" },
        headers: [
          { ko: "", en: "" },
          { ko: "디커플링", en: "Decoupling" },
          { ko: "바이패스", en: "Bypass" }
        ],
        rows: [
          [ { ko: "목적", en: "Purpose" }, { ko: "IC에 안정적 전원 공급", en: "Stable power to the IC" }, { ko: "전원 노이즈를 GND로 우회", en: "Divert supply noise to GND" } ],
          [ { ko: "노이즈원", en: "Noise source" }, { ko: "외부·전원공급장치", en: "External / supply" }, { ko: "IC 내부 스위칭 고조파", en: "IC internal switching harmonics" } ],
          [ { ko: "실무", en: "In practice" }, { ko: "MLCC, IC 전원핀 최근접", en: "MLCC, nearest the IC power pin" }, { ko: "동일하게 취급", en: "Treated the same" } ]
        ]
      }
    },
    {
      heading: { ko: "병렬 합성과 용량 선정", en: "Parallel combination and value selection" },
      bullets: [
        { ko: "동일 용량을 병렬로 묶으면(예: 22µF×3 = 66µF) 공진점 임피던스가 크게 낮아져 특정 대역을 노릴 때 유효하다.", en: "Combining equal values in parallel (e.g. 22µF×3 = 66µF) sharply lowers the impedance at the resonance point, effective when targeting a specific band." },
        { ko: "이종 용량을 혼합하면(22µF + 0.1µF + 0.01µF) 전 대역 임피던스는 낮아지지만 공진점 사이에 반공진이 다수 발생해 상황에 따라 특성이 오히려 악화된다.", en: "Mixing different values (22µF + 0.1µF + 0.01µF) lowers impedance across the band, but multiple anti-resonances arise between resonance points and the response can actually worsen." },
        { ko: "측정이 현실적으로 어려운 실무에서는 0.1µF(100nF)을 기본으로 깔고, 측정 후 노이즈가 심하면 용량을 튜닝한다 — 100nF은 주파수 중간 대역을 폭넓게 걸러주는 무난한 출발점이다.", en: "Where measurement is impractical, the default is 0.1µF (100nF), then tune if noise proves severe — 100nF filters a broad mid-frequency band and is a sound starting point." }
      ]
    },
    {
      heading: { ko: "RC 필터 — fc = 1/(2πRC)", en: "RC filter — fc = 1/(2πRC)" },
      bullets: [
        { ko: "LPF는 R을 직렬·C를 GND로 연결해 fc 이하를 통과시키고, HPF는 C를 직렬·R을 GND로 연결해 fc 이상을 통과시킨다.", en: "An LPF puts R in series and C to GND, passing below fc; an HPF puts C in series and R to GND, passing above fc." },
        { ko: "차단 주파수(fc)는 출력이 입력의 0.707배(-3dB)가 되는 지점이며, 1차 시스템에서는 이때 위상 지연이 -45°다.", en: "The cutoff fc is where output is 0.707× input (-3dB), and in a first-order system the phase lag there is -45°." },
        { ko: "예로 R = 1kΩ, C = 0.1µF이면 fc ≈ 1.59kHz로, LPF로 쓰면 그 이하를, HPF로 쓰면 그 이상을 통과시킨다.", en: "For example, with R = 1kΩ and C = 0.1µF, fc ≈ 1.59kHz: an LPF passes below it and an HPF above it." }
      ],
      diagram: {
        kind: "formula",
        expr: "f_c = \\dfrac{1}{2\\pi R C}",
        caption: { ko: "차단 주파수 — 출력이 입력의 0.707배(-3dB)가 되는 지점", en: "Cutoff frequency — where output is 0.707× input (-3dB)" },
        legend: [
          { sym: "f_c", desc: { ko: "차단 주파수 (Hz)", en: "cutoff frequency (Hz)" } },
          { sym: "R", desc: { ko: "직렬/GND 저항 (Ω)", en: "series/GND resistance (Ω)" } },
          { sym: "C", desc: { ko: "커패시턴스 (F)", en: "capacitance (F)" } }
        ]
      }
    }
  ],
  pitfall: {
    ko: "이종 용량 병렬은 공진점 사이에 반공진점이 여러 개 생겨 오히려 특성을 악화시킬 수 있으므로 무작정 다른 용량을 섞지 말 것. 또한 디커플링/바이패스 커패시터는 반드시 IC 전원핀에 최대한 가까이 배치해야 하며, 멀리 달면 '달아도 안 단 것과 같다'. 전사 원본에는 STT 오인식(470mAh→470µF, 동진→공진 등)이 많아 참조 시 오인식 대조표를 먼저 봐야 한다.",
    en: "Do not blindly mix different capacitance values in parallel — multiple anti-resonance points appear between resonance points and can worsen the response. Decoupling/bypass capacitors must be placed as close as possible to the IC power pin; placed far away they are 'as if not there at all'. The raw transcript contains many STT mis-recognitions, so consult the correction table first when referencing it."
  }
};
