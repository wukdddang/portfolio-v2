import type { TopicDetail } from "../../types";

export const voltageDrop: TopicDetail = {
  tldr: {
    ko: "전압 강하는 전류가 저항 같은 부품을 지날 때 V=IR 만큼 전압을 소비하며 잃는 현상으로, 직렬 회로에서 각 부품의 강하 합이 공급 전압과 같아야 한다는 KVL의 직접 결과다. 12V에 6Ω 저항 2개를 직렬로 달면 전류 1A가 흐르고 각 저항에서 6V씩 강하해 합 12V가 공급 전압과 일치한다. 킥보드 BLDC처럼 큰 모터 전류가 흐를 때는 배선·MOSFET·션트·배터리 내부저항에서 생기는 강하가 출력 약화와 발열로 이어지므로, 전압 분배기·내부저항·전력 손실 계산의 출발점이 된다.",
    en: "Voltage drop is the phenomenon where current passing through a part such as a resistor consumes and loses voltage by V=IR; in a series circuit the sum of each part's drops must equal the supply voltage, a direct consequence of KVL. With a 12V battery and two 6Ω resistors in series, 1A flows and each resistor drops 6V, so the total 12V matches the supply. When large motor currents flow, as in a kickboard BLDC, drops across wiring, MOSFETs, shunts, and battery internal resistance turn into weakened output and heat, making this the starting point for voltage-divider, internal-resistance, and power-loss calculations."
  },
  sections: [
    {
      heading: { ko: "개념 한 줄과 물 비유", en: "The concept in one line, with a water analogy" },
      bullets: [
        { ko: "전압 강하는 부품을 지날 때 V=IR 만큼 전압이 소비되는 양이다.", en: "Voltage drop is the amount of voltage consumed, equal to V=IR, as current passes through a part." },
        { ko: "물 비유로 보면 좁은 관을 지날 때 수압이 줄어드는 것과 같아서, 배터리가 전압을 밀어주고 저항(좁은 관)을 지나며 전압이 줄어든다.", en: "By the water analogy it is like water pressure dropping through a narrow pipe: the battery pushes voltage, and it falls as current passes the resistor (the narrow pipe)." },
        { ko: "옴의 법칙(V=IR)으로 각 부품의 강하량을 계산하고, KVL로 그 합이 공급 전압과 같음을 보장한다.", en: "Ohm's law (V=IR) gives each part's drop, and KVL guarantees that their sum equals the supply voltage." }
      ]
    },
    {
      heading: { ko: "숫자로 만져보기 — 12V에 6Ω 2개 직렬", en: "Working it with numbers — 12V with two 6Ω in series" },
      bullets: [
        { ko: "전체 저항 R = 6 + 6 = 12Ω이고 전체 전류 I = V/R = 12V/12Ω = 1A다.", en: "Total resistance R = 6 + 6 = 12Ω, and total current I = V/R = 12V/12Ω = 1A." },
        { ko: "각 저항의 전압 강하 V_drop = I × R = 1A × 6Ω = 6V이며, 회로를 따라가면 12V에서 첫 저항을 지나 6V로, 두 번째 저항을 지나 0V로 떨어진다.", en: "Each resistor's drop is V_drop = I × R = 1A × 6Ω = 6V; following the circuit, 12V falls to 6V after the first resistor and to 0V after the second." },
        { ko: "강하의 합 6V + 6V = 12V가 공급 전압과 정확히 일치하며, 이는 KVL이 보장한다.", en: "The drops sum to 6V + 6V = 12V, exactly the supply voltage, as guaranteed by KVL." }
      ],
      diagram: {
        kind: "formula",
        expr: "V_{\\mathrm{drop}} = I \\times R",
        caption: { ko: "각 부품의 전압 강하 = 흐르는 전류 × 그 부품의 저항", en: "Each part's drop = current through it × that part's resistance" },
        legend: [
          { sym: "V_{\\mathrm{drop}}", desc: { ko: "그 부품에서 소비되는 전압 강하 [V]", en: "voltage drop at that part [V]" } },
          { sym: "I", desc: { ko: "부품을 지나는 전류 [A] — 직렬에선 어디서나 같다", en: "current through the part [A] — same everywhere in series" } },
          { sym: "R", desc: { ko: "그 부품의 저항 [Ω]", en: "resistance of that part [Ω]" } }
        ]
      }
    },
    {
      heading: { ko: "킥보드/STM32 맥락 — 강하가 생기는 곳", en: "Kickboard/STM32 context — where drops occur" },
      bullets: [
        { ko: "배선은 저항이 작아도 큰 전류가 흐르면 강하가 커져 모터 전압이 줄고 출력이 약화된다.", en: "Wiring has small resistance, but large current makes its drop grow, lowering motor voltage and weakening output." },
        { ko: "MOSFET의 Rds(on)에서는 전류 × Rds(on)이 발열로 나타나 효율이 떨어지고, 배터리 내부저항에서는 부하가 클수록 단자전압이 떨어지는 전압 Sag가 생긴다.", en: "A MOSFET's Rds(on) turns current × Rds(on) into heat that lowers efficiency, while battery internal resistance causes voltage sag where terminal voltage falls as load grows." },
        { ko: "션트저항은 의도된 강하를 이용해 전류를 측정하며, 결국 「왜 큰 전류가 흐르면 모터가 약해지나」의 답이 곧 전압 강하다.", en: "A shunt resistor uses an intentional drop to measure current, and ultimately the answer to 'why does the motor weaken under large current' is voltage drop." }
      ],
      diagram: {
        kind: "branch",
        caption: { ko: "전압 강하 발생 지점과 그 결과", en: "Where voltage drop occurs and what it causes" },
        root: { icon: "📉", label: { ko: "전압 강하 발생 지점", en: "Where voltage drop occurs" }, tone: "accent" },
        children: [
          { icon: "🔌", label: { ko: "배선", en: "Wiring" }, sub: { ko: "큰 전류 → 출력 약화", en: "large current → weaker output" }, tone: 2 },
          { icon: "🔥", label: { ko: "MOSFET Rds(on)", en: "MOSFET Rds(on)" }, sub: { ko: "전류 × Rds(on) = 발열", en: "current × Rds(on) = heat" }, tone: 4 },
          { icon: "📏", label: { ko: "션트저항", en: "Shunt resistor" }, sub: { ko: "의도된 강하로 전류 측정", en: "intentional drop to measure current" }, tone: 5 },
          { icon: "🔋", label: { ko: "배터리 내부저항", en: "Battery internal R" }, sub: { ko: "부하 클수록 전압 Sag", en: "heavier load → voltage sag" }, tone: 1 }
        ]
      }
    }
  ],
  pitfall: {
    ko: "전압 강하는 낭비가 아니라 모든 부품이 V=IR로 자기 몫을 가져가는 것이며, 그 합이 공급 전압과 같음을 KVL이 보장한다. 발열은 I²×R(전력 손실)이라 큰 전류에서는 작은 강하도 큰 발열로 이어지고, 이것이 배선 굵기와 MOSFET 선정의 근거가 된다.",
    en: "A voltage drop is not waste but each part taking its share by V=IR, and KVL guarantees their sum equals the supply voltage. Heat is I²×R (power loss), so at large currents even a small drop produces large heat — the basis for choosing wire gauge and MOSFETs."
  }
};
