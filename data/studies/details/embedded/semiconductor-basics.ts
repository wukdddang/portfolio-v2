import type { TopicDetail } from "../../types";

export const semiconductorBasics: TopicDetail = {
  tldr: {
    ko: "반도체는 순수 상태에선 전류를 거의 안 흘리지만, 불순물을 더하는 도핑으로 캐리어를 만들어 도전성을 조절합니다. N형(자유전자)과 P형(정공)을 붙인 PN 접합에서는 경계의 캐리어가 재결합해 공핍층과 전위 장벽(~0.7V)이 생기는데, 이게 다이오드·BJT가 보이는 문턱 전압의 정체입니다. 순방향 바이어스는 장벽을 좁혀 도통시키고 역방향은 넓혀 차단 — 이 한 방향 도통이 다이오드(접합 1개)·BJT(접합 2개)·MOSFET(전압 채널)의 공통 토대입니다.",
    en: "Pure semiconductor barely conducts, but doping adds carriers to control conductivity. Join N-type (free electrons) and P-type (holes) and the carriers recombine at the boundary, forming a depletion region and a built-in barrier (~0.7 V) — that barrier is the threshold voltage you see in diodes and BJTs. Forward bias narrows it to conduct, reverse bias widens it to block; this one-way conduction is the shared foundation of the diode (1 junction), BJT (2 junctions) and MOSFET (voltage-formed channel).",
  },
  sections: [
    {
      heading: { ko: "도핑 — N형과 P형", en: "Doping — N-type and P-type" },
      bullets: [
        {
          ko: "진성 실리콘은 거의 부도체입니다. 5가 불순물(인·비소)을 넣으면 자유 전자(−)가 남아 N형, 3가(붕소)를 넣으면 정공(+)이 남아 P형 — 이 다수 캐리어가 전류를 나릅니다.",
          en: "Intrinsic silicon barely conducts. A pentavalent dopant (P, As) leaves free electrons (−) → N-type; a trivalent one (B) leaves holes (+) → P-type. These majority carriers carry the current.",
        },
        {
          ko: "정공은 '전자가 빠진 자리'로, 옆 전자가 메우며 이동하면 마치 +전하가 반대 방향으로 흐르는 것처럼 보입니다.",
          en: "A hole is 'a missing electron'; as neighboring electrons fill it, it looks like a positive charge drifting the other way.",
        },
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "도핑으로 다수 캐리어를 만든다", en: "Doping creates majority carriers" },
        headers: [
          { ko: "형", en: "Type" },
          { ko: "첨가 불순물", en: "Dopant" },
          { ko: "다수 캐리어", en: "Majority carrier" },
        ],
        rows: [
          [
            { ko: "N형", en: "N-type" },
            { ko: "5가 (인·비소)", en: "Pentavalent (P, As)" },
            { ko: "자유 전자 (−)", en: "Free electrons (−)" },
          ],
          [
            { ko: "P형", en: "P-type" },
            { ko: "3가 (붕소)", en: "Trivalent (B)" },
            { ko: "정공 (+)", en: "Holes (+)" },
          ],
        ],
      },
    },
    {
      heading: { ko: "PN 접합과 공핍층 — 0.7V 문턱의 정체", en: "PN junction & depletion region — what the 0.7 V threshold is" },
      bullets: [
        {
          ko: "N과 P를 붙이면 경계에서 전자·정공이 재결합해 캐리어가 없는 공핍층(depletion region)이 생기고, 이 층이 전위 장벽을 만듭니다.",
          en: "Join N and P and electrons/holes recombine at the boundary, leaving a carrier-free depletion region that sets up a built-in potential barrier.",
        },
        {
          ko: "이 장벽을 넘어야 전류가 흐르므로, 바로 이것이 다이오드·BJT에서 보는 ~0.7V(Si) 문턱의 정체입니다.",
          en: "Current only flows once you overcome that barrier — which is exactly the ~0.7 V (Si) threshold seen in diodes and BJTs.",
        },
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "공핍층이 전위 장벽 = 문턱 전압을 만든다", en: "The depletion region builds the barrier = threshold" },
        nodes: [
          { label: { ko: "P형", en: "P-type" }, sub: { ko: "정공 (+)", en: "Holes (+)" }, tone: 3 },
          { icon: "⚡", label: { ko: "접합부", en: "Junction" }, sub: { ko: "재결합 → 공핍층", en: "Recombine → depletion" }, tone: 6 },
          { label: { ko: "N형", en: "N-type" }, sub: { ko: "자유전자 (−)", en: "Electrons (−)" }, tone: 2 },
          { icon: "🚧", label: { ko: "전위 장벽", en: "Barrier" }, sub: { ko: "≈0.7V 문턱", en: "≈0.7 V threshold" }, tone: "accent" },
        ],
      },
    },
    {
      heading: { ko: "순방향 vs 역방향 바이어스 — 한 방향 도통", en: "Forward vs reverse bias — one-way conduction" },
      bullets: [
        {
          ko: "순방향(P에 +, N에 −): 장벽을 밀어내 공핍층이 좁아짐 → 0.7V를 넘으면 도통합니다.",
          en: "Forward (P to +, N to −): pushes the barrier down, depletion narrows → conducts once past 0.7 V.",
        },
        {
          ko: "역방향(P에 −, N에 +): 공핍층이 넓어져 차단(미세 누설만). 항복전압을 넘으면 급격히 도통하며 파괴됩니다.",
          en: "Reverse (P to −, N to +): depletion widens → blocked (tiny leakage only). Past breakdown it conducts abruptly and is destroyed.",
        },
        {
          ko: "이 거동이 곧 다이오드의 I-V 곡선(순방향 도통·역방향 차단·항복) 그 자체입니다.",
          en: "This behavior is the diode's I-V curve itself (forward conduction · reverse block · breakdown).",
        },
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "공핍층 폭이 도통/차단을 가른다", en: "Depletion width decides conduct vs block" },
        headers: [
          { ko: "바이어스", en: "Bias" },
          { ko: "공핍층", en: "Depletion" },
          { ko: "결과", en: "Result" },
        ],
        rows: [
          [
            { ko: "순방향 (P+)", en: "Forward (P+)" },
            { ko: "좁아짐", en: "Narrows" },
            { ko: "0.7V↑ 도통", en: "Conducts past 0.7 V" },
          ],
          [
            { ko: "역방향 (P−)", en: "Reverse (P−)" },
            { ko: "넓어짐", en: "Widens" },
            { ko: "차단 (항복 시 급증)", en: "Blocks (surges at breakdown)" },
          ],
        ],
      },
    },
    {
      heading: { ko: "능동소자의 공통 뿌리", en: "The shared root of active devices" },
      bullets: [
        {
          ko: "다이오드 = PN 접합 1개, BJT = 접합 2개(NPN)로 작은 베이스 전류가 큰 컬렉터 전류를 제어, MOSFET = 게이트 전압으로 채널을 형성하는 전압 제어 소자.",
          en: "Diode = 1 PN junction; BJT = 2 junctions (NPN) where a small base current controls a large collector current; MOSFET = a voltage-controlled device that forms a channel via gate voltage.",
        },
        {
          ko: "여기가 잡히면 #9 다이오드·#10 BJT·#11 MOSFET 강의가 '왜 한 방향', '왜 0.7V'에서 더는 막히지 않습니다.",
          en: "Once this clicks, the #9 diode / #10 BJT / #11 MOSFET lectures stop stalling on 'why one-way' and 'why 0.7 V'.",
        },
      ],
      diagram: {
        kind: "branch",
        caption: { ko: "PN 접합 하나에서 갈라지는 능동소자", en: "Active devices branching from one PN junction" },
        root: { icon: "🔬", label: { ko: "PN 접합", en: "PN junction" }, tone: "accent" },
        children: [
          { icon: "▷", label: { ko: "다이오드", en: "Diode" }, sub: { ko: "접합 1개", en: "1 junction" }, tone: 2 },
          { icon: "📶", label: { ko: "BJT", en: "BJT" }, sub: { ko: "접합 2개 · 전류 제어", en: "2 junctions · current" }, tone: 4 },
          { icon: "🎚", label: { ko: "MOSFET", en: "MOSFET" }, sub: { ko: "전압으로 채널 형성", en: "voltage-formed channel" }, tone: 5 },
        ],
      },
    },
  ],
  pitfall: {
    ko: "강의는 이 바닥(도핑·공핍층)을 건너뛰고 '순방향 0.7V 문턱'부터 시작합니다. 다이오드·BJT가 안 잡혔다면 십중팔구 여기가 그 빈칸 — 강의 전에 PN 접합·바이어스를 먼저 보면 '문턱·차단'이 갑자기 말이 됩니다. 밴드갭·페르미 준위 같은 더 깊은 물성은 필요할 때 보강합니다.",
    en: "Lectures skip this floor (doping, depletion) and start at 'the 0.7 V forward threshold'. If diodes/BJTs didn't click, this is usually the missing piece — read PN junction + bias first and 'threshold/blocking' suddenly makes sense. Deeper physics (bandgap, Fermi level) can wait until needed.",
  },
};
