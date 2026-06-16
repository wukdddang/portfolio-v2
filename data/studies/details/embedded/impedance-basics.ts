import type { TopicDetail } from "../../types";

export const impedanceBasics: TopicDetail = {
  tldr: {
    ko: "임피던스 $Z$는 한마디로 '주파수에 따라 값이 변하는 저항'입니다. 전류가 한 방향으로만 흐르는 직류(DC)에선 저항 $R$만 보면 됐지만, 신호가 빠르게 출렁이는 교류(AC)에선 저항 말고도 '주파수에 따라 달라지는 방해'가 추가로 생깁니다 — 이 둘을 합친 것이 $Z = R + jX$입니다. 가장 중요한 사실 하나: 커패시터와 인덕터는 정반대로 행동합니다. 주파수가 올라가면 커패시터는 더 잘 통과시키고($X_C$ 감소), 인덕터는 더 막습니다($X_L$ 증가). 이 한 가지 대칭이 필터·디커플링·공진을 전부 설명합니다.",
    en: "Impedance $Z$ is, in one line, 'resistance whose value changes with frequency.' In DC, where current flows one way, you only watch resistance $R$; but in AC, where the signal wiggles fast, an extra 'frequency-dependent opposition' appears — and the two together are $Z = R + jX$. The one fact that matters most: capacitors and inductors do the opposite of each other. As frequency rises a capacitor passes more ($X_C$ falls) while an inductor blocks more ($X_L$ rises). That single symmetry explains filters, decoupling, and resonance.",
  },
  sections: [
    {
      heading: { ko: "그 전에 — 직류(DC)와 교류(AC)", en: "First — DC and AC" },
      bullets: [
        {
          ko: "전자공학이 처음이면 여기부터. 직류(DC)는 전류가 늘 한 방향으로 일정하게 흐르는 것(건전지), 교류(AC)는 전류의 방향과 크기가 1초에 수십~수백만 번 출렁이는 것(콘센트·오디오 신호)입니다. 그 '출렁이는 빠르기'가 주파수 $f$(단위 Hz)입니다.",
          en: "New to electronics? Start here. DC means current flows steadily in one direction (a battery); AC means its direction and size wiggle tens to millions of times a second (a wall outlet, an audio signal). How fast it wiggles is the frequency $f$ (in Hz).",
        },
        {
          ko: "저항(resistor)은 직류든 교류든 똑같이 전류를 막고 그 에너지를 열로 바꿉니다. 그런데 커패시터·인덕터는 '얼마나 빨리 출렁이느냐(주파수)'에 따라 막는 정도가 달라집니다 — 그래서 저항 하나로는 부족하고 새 개념인 임피던스가 필요합니다.",
          en: "A resistor opposes current the same in DC or AC and turns that energy into heat. But capacitors and inductors oppose differently depending on how fast things wiggle (frequency) — so one number (resistance) isn't enough, and we need impedance.",
        },
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "직류와 교류 — 무엇을 봐야 하나", en: "DC vs AC — what you watch" },
        headers: [
          { ko: "", en: "" },
          { ko: "직류 DC", en: "DC" },
          { ko: "교류 AC", en: "AC" },
        ],
        rows: [
          [
            { ko: "전류 방향", en: "Current direction" },
            { ko: "한 방향 고정", en: "fixed, one way" },
            { ko: "계속 바뀜 (출렁임)", en: "keeps reversing" },
          ],
          [
            { ko: "예", en: "Example" },
            { ko: "건전지 · USB", en: "battery · USB" },
            { ko: "콘센트 · 신호", en: "outlet · signals" },
          ],
          [
            { ko: "무엇이 전류를 막나", en: "What opposes current" },
            { ko: "저항 R 만", en: "resistance R only" },
            { ko: "저항 + 리액턴스 = 임피던스 Z", en: "R + reactance = impedance Z" },
          ],
        ],
      },
    },
    {
      heading: { ko: "임피던스 = 저항 + 리액턴스", en: "Impedance = resistance + reactance" },
      bullets: [
        {
          ko: "임피던스 $Z$는 두 가지를 더한 것입니다. 하나는 우리가 아는 저항 $R$ — 주파수와 상관없이 일정하고, 막은 에너지를 열로 태웁니다. 다른 하나가 리액턴스 $X$ — 주파수에 따라 변하고, 에너지를 열로 태우지 않고 잠깐 저장했다가 되돌려줍니다.",
          en: "Impedance $Z$ adds two things. One is the familiar resistance $R$ — constant regardless of frequency, burning the blocked energy as heat. The other is reactance $X$ — it changes with frequency and, instead of burning energy, briefly stores and returns it.",
        },
        {
          ko: "그래서 $Z = R + jX$로 씁니다. 단위는 저항과 똑같은 옴($\\Omega$)이고, 실제로 '전류를 얼마나 막느냐'는 크기 $|Z|$로 봅니다. 앞의 $j$는 겁먹지 마세요 — '전압과 전류의 타이밍이 $90°$ 어긋나 있다'는 표시일 뿐, 지금은 그 정도만 알면 됩니다.",
          en: "So we write $Z = R + jX$. The unit is the same ohm ($\\Omega$) as resistance, and how much it actually blocks is the magnitude $|Z|$. Don't fear the $j$ — it just flags that voltage and current are $90°$ out of step in timing; that's all you need for now.",
        },
      ],
      diagram: {
        kind: "formula",
        expr: "Z = R + jX",
        caption: { ko: "임피던스 = 안 변하는 저항 + 변하는 리액턴스", en: "impedance = fixed R + varying reactance" },
        legend: [
          { sym: "R", desc: { ko: "저항 — 주파수 무관, 열로 소비", en: "resistance — freq-independent, heats" } },
          { sym: "X", desc: { ko: "리액턴스 — 주파수 따라 변함, 저장↔반환", en: "reactance — varies w/ freq, stores↔returns" } },
          { sym: "j", desc: { ko: "전압·전류 90° 타이밍 차", en: "90° timing offset" } },
        ],
      },
    },
    {
      heading: { ko: "핵심 — 커패시터와 인덕터는 정반대", en: "The key — capacitor and inductor are opposites" },
      bullets: [
        {
          ko: "커패시터는 주파수가 올라갈수록 임피던스가 작아져 고주파를 잘 통과시킵니다: $X_C = \\dfrac{1}{2\\pi f C}$. 직관적으로, 너무 빨리 출렁이면 다 채우기도 전에 방향이 바뀌어 전류가 술술 흐릅니다. 반대로 직류($f=0$)에선 무한대 — 완전히 막습니다.",
          en: "A capacitor's impedance falls as frequency rises, so it passes high frequencies: $X_C = \\dfrac{1}{2\\pi f C}$. Intuitively, if things wiggle too fast it reverses before it fills up, so current flows freely. At DC ($f=0$) it's infinite — a full block.",
        },
        {
          ko: "인덕터는 정반대입니다: $X_L = 2\\pi f L$. 주파수가 올라갈수록 더 막습니다(고주파 차단). 직류에선 $0$ — 그냥 전선처럼 통과시킵니다. 그래서 둘을 같은 그래프에 그리면 아래처럼 X자로 교차하고, 만나는 지점이 공진입니다.",
          en: "The inductor is the mirror: $X_L = 2\\pi f L$. The higher the frequency, the more it blocks. At DC it's $0$ — just a wire. Plot both and they cross like an X; where they meet is resonance.",
        },
      ],
      diagram: {
        kind: "plot",
        caption: { ko: "주파수가 오를수록 커패시터는 통과(↓), 인덕터는 차단(↑)", en: "As frequency rises, the cap passes (↓), the inductor blocks (↑)" },
        xLabel: { ko: "주파수 f →", en: "frequency f →" },
        yLabel: { ko: "임피던스", en: "impedance" },
        series: [
          { label: { ko: "커패시터 Xc=1/2πfC", en: "Capacitor Xc=1/2πfC" }, curve: "decay", tone: 6 },
          { label: { ko: "인덕터 XL=2πfL", en: "Inductor XL=2πfL" }, curve: "rise", tone: 4 },
        ],
        markers: [{ x: 0.5, label: { ko: "공진", en: "resonance" }, tone: "accent" }],
      },
    },
    {
      heading: { ko: "RC 필터 — 주파수로 골라내기", en: "RC filter — sorting by frequency" },
      bullets: [
        {
          ko: "저항 $R$ 하나와 커패시터 $C$ 하나만 있으면 '어떤 주파수는 통과, 어떤 주파수는 차단'하는 필터가 됩니다. 그 경계가 차단 주파수 $f_c = \\dfrac{1}{2\\pi R C}$입니다. $f_c$보다 낮은 주파수만 통과시키면 저역통과(LPF), 높은 쪽만 통과시키면 고역통과(HPF)입니다.",
          en: "Just one resistor $R$ and one capacitor $C$ make a filter that 'passes some frequencies, blocks others.' The boundary is the cutoff $f_c = \\dfrac{1}{2\\pi R C}$. Pass below $f_c$ and it's a low-pass filter (LPF); pass above and it's high-pass (HPF).",
        },
        {
          ko: "아래 그래프처럼 $f_c$ 부근부터 출력이 꺾여 내려갑니다. 정확히 $f_c$에서 출력은 입력의 $0.707$배(데시벨로 $-3\\,\\text{dB}$)가 됩니다 — 커패시터 페이지에서 봤던 그 $f_c$ 공식의 정체입니다.",
          en: "As the graph shows, output bends down around $f_c$. Exactly at $f_c$ the output is $0.707\\times$ the input ($-3\\,\\text{dB}$) — the meaning of the $f_c$ formula you saw on the capacitor page.",
        },
      ],
      diagram: {
        kind: "plot",
        caption: { ko: "저역통과(LPF) — fc 위 주파수는 깎여 나간다", en: "Low-pass — frequencies above fc get cut" },
        xLabel: { ko: "주파수 f →", en: "frequency f →" },
        yLabel: { ko: "통과 크기", en: "output" },
        series: [{ label: { ko: "출력 크기", en: "output level" }, curve: "lowpass", tone: 3 }],
        markers: [{ x: 0.42, label: { ko: "fc 차단", en: "fc" }, tone: "accent" }],
      },
    },
    {
      heading: { ko: "실제 부품은 배신한다 — 공진(SRF)", en: "Real parts betray you — resonance (SRF)" },
      bullets: [
        {
          ko: "위 공식들은 '이상적인' 부품 얘기입니다. 실제 커패시터에는 다리·내부 구조에 약간의 인덕턴스(ESL)가 숨어 있어서, 어느 주파수를 넘으면 커패시터가 갑자기 인덕터처럼 행동하기 시작합니다. 그 경계가 자기공진주파수(SRF)이고, 바로 앞 그래프에서 두 곡선이 만나던 그 지점입니다.",
          en: "Those formulas describe 'ideal' parts. A real capacitor hides a little inductance (ESL) in its leads and body, so past a certain frequency it suddenly starts acting like an inductor. That boundary is the self-resonant frequency (SRF) — the point where the two curves met in the previous graph.",
        },
        {
          ko: "그래서 디커플링 커패시터는 SRF 위에서 효과가 떨어집니다. 보드를 보면 큰 용량과 작은 용량($10\\,\\mu\\text{F}$ + $0.1\\,\\mu\\text{F}$)을 나란히 붙이는데, 각자 잘 듣는 주파수 대역이 달라 서로의 빈틈을 메우기 때문입니다.",
          en: "So a decoupling capacitor loses effect above its SRF. On real boards you'll see a big and a small value side by side ($10\\,\\mu\\text{F}$ + $0.1\\,\\mu\\text{F}$) because each works best over a different band and they cover each other's gaps.",
        },
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "SRF를 경계로 역할이 뒤집힌다", en: "Roles flip across the SRF" },
        nodes: [
          { label: { ko: "낮은 주파수", en: "low freq" }, sub: { ko: "커패시터답게", en: "capacitive" } },
          { icon: "⚡", label: { ko: "공진 SRF", en: "SRF" }, sub: { ko: "Xc = XL", en: "Xc = XL" }, tone: "accent" },
          { label: { ko: "높은 주파수", en: "high freq" }, sub: { ko: "인덕터처럼", en: "inductive" } },
        ],
      },
    },
    {
      heading: { ko: "그래서 어디에 쓰나", en: "So where is this used" },
      bullets: [
        {
          ko: "디커플링: IC 전원 핀 바로 옆에 작은 커패시터를 붙여, 고주파 노이즈에게 임피던스가 낮은 지름길(→ 접지 GND)을 내줍니다. 노이즈는 저항이 작은 길로 빠지므로 칩으로 안 갑니다.",
          en: "Decoupling: place a small capacitor right next to an IC's power pin so high-frequency noise sees a low-impedance shortcut (→ ground GND). Noise takes the low-impedance path and never reaches the chip.",
        },
        {
          ko: "페라이트 비드: 반대로 고주파에 임피던스를 높여(저항처럼) 노이즈를 막고 열로 태웁니다. 둘 다 '주파수에 따라 임피던스가 변한다'는 이 페이지 한 줄에서 나옵니다.",
          en: "Ferrite bead: the opposite — it raises impedance at high frequency (acting like a resistor) to block noise and burn it as heat. Both come straight from this page's one idea: impedance changes with frequency.",
        },
      ],
      diagram: {
        kind: "branch",
        caption: { ko: "임피던스가 주파수에 따라 변하는 걸 이용한다", en: "Exploiting frequency-dependent impedance" },
        root: { icon: "🎚", label: { ko: "임피던스 활용", en: "using impedance" }, tone: "accent" },
        children: [
          { label: { ko: "디커플링 커패시터", en: "decoupling cap" }, sub: { ko: "고주파에 낮은 임피던스 → GND 우회", en: "low-Z to HF → shunt to GND" }, tone: 6 },
          { label: { ko: "페라이트 비드", en: "ferrite bead" }, sub: { ko: "고주파에 높은 임피던스 → 열로", en: "high-Z to HF → burns as heat" }, tone: 4 },
        ],
      },
    },
  ],
  pitfall: {
    ko: "'임피던스 = 저항'이라고 뭉뚱그리면 필터·디커플링이 영영 안 잡힙니다 — 핵심은 딱 하나, 주파수에 따라 값이 변한다는 것입니다. 그리고 데이터시트에서 부품을 고를 때는 한 값이 아니라 '주파수에 따른 임피던스 곡선($|Z|$ vs $f$)'을 봐야 합니다. $j$(위상)는 지금은 '타이밍 어긋남' 정도로만 두고, 깊은 복소수 계산은 정말 필요해질 때 보강하면 됩니다.",
    en: "Lumping 'impedance = resistance' means filters and decoupling never click — the one key is that the value changes with frequency. And when picking parts from a datasheet, read the impedance-vs-frequency curve ($|Z|$ vs $f$), not a single number. Leave $j$ (phase) as just a 'timing offset' for now; deeper complex math can wait until you truly need it.",
  },
};
