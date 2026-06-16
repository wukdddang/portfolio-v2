import type { TopicDetail } from "../../types";

export const semiconductorBasics: TopicDetail = {
  tldr: {
    ko: "다이오드·BJT·MOSFET 강의가 '당연히 안다'고 깔고 넘어가는 반도체 기초입니다. 진성 실리콘에 불순물을 넣는 도핑(N형·P형), 둘이 만나는 PN 접합, 거기서 생기는 공핍층이 '한 방향으로만 흐르는' 원리의 핵심입니다. 다이오드가 한 방향으로만 도통하는 이유 = PN 접합의 공핍층 — 순방향은 공핍층을 좁혀 ~0.7V 문턱을 넘으면 도통시키고, 역방향은 넓혀 차단합니다. 이 한 장이 #9 다이오드·#10 BJT·#11 MOSFET의 공통 토대라, 여기가 잡히면 능동소자 강의가 훨씬 덜 겉돕니다.",
    en: "The semiconductor basics that diode/BJT/MOSFET lectures assume you already know. Doping intrinsic silicon (N-type/P-type), the PN junction where the two meet, and the depletion region that forms there are the core of why a diode conducts only one way. Forward bias narrows the depletion region and conducts past the ~0.7V threshold; reverse bias widens it and blocks. This single page is the shared foundation of #9 diode, #10 BJT, and #11 MOSFET — get it and the active-device lectures stop floating.",
  },
  sections: [
    {
      heading: { ko: "도핑 — N형과 P형", en: "Doping — N-type and P-type" },
      bullets: [
        {
          ko: "순수(진성) 실리콘은 전류를 거의 흘리지 않지만, 미량의 불순물을 섞으면(도핑) 전류를 나를 캐리어가 생겨 도전성이 확 바뀝니다 — 이 '조절 가능성'이 반도체로 소자를 만드는 출발점입니다.",
          en: "Pure (intrinsic) silicon barely conducts, but adding trace impurities (doping) creates carriers that change its conductivity dramatically — that tunability is the starting point for building components from a semiconductor.",
        },
        {
          ko: "N형은 5가 원소(인·비소)를 넣어 다수 캐리어가 자유 전자(−), P형은 3가 원소(붕소)를 넣어 다수 캐리어가 정공(+, 전자의 빈자리)입니다.",
          en: "N-type adds pentavalent atoms (phosphorus, arsenic) so the majority carrier is free electrons (−); P-type adds trivalent atoms (boron) so the majority carrier is holes (+, the empty seats of electrons).",
        },
        {
          ko: "정공은 '전자가 빠진 자리'로, 옆 전자가 메우며 이동하면 마치 +전하가 반대로 흐르는 것처럼 보입니다.",
          en: "A hole is 'where an electron is missing'; as neighboring electrons fill it, it looks like a + charge drifting the other way.",
        },
      ],
      diagram: [
        {
          kind: "lattice",
          caption: {
            ko: "도핑 — 진성 Si 격자에 불순물 원자 1개를 끼워 캐리어를 만든다",
            en: "Doping — one impurity atom in the intrinsic Si lattice creates a carrier",
          },
          panels: [
            {
              type: "n",
              label: { ko: "N형 — 5가(인 P) 도핑", en: "N-type — pentavalent (P)" },
              dopant: "P",
              carrier: { ko: "결합에 안 쓰인 전자 1개가 남음 → 자유 전자 −", en: "one electron left over → free electron −" },
            },
            {
              type: "p",
              label: { ko: "P형 — 3가(붕소 B) 도핑", en: "P-type — trivalent (B)" },
              dopant: "B",
              carrier: { ko: "결합 자리가 1개 비어 정공 + 이 생김", en: "one bond seat empty → a hole +" },
            },
          ],
        },
        {
        kind: "compare",
        caption: { ko: "도핑 — N형 vs P형", en: "Doping — N-type vs P-type" },
        headers: [
          { ko: "형", en: "Type" },
          { ko: "첨가 불순물", en: "Dopant" },
          { ko: "다수 캐리어", en: "Majority carrier" },
        ],
        rows: [
          [
            { ko: "N형", en: "N-type" },
            { ko: "5가 (인 P · 비소 As)", en: "pentavalent (P, As)" },
            { ko: "자유 전자 (−)", en: "free electrons (−)" },
          ],
          [
            { ko: "P형", en: "P-type" },
            { ko: "3가 (붕소 B)", en: "trivalent (B)" },
            { ko: "정공 hole (+)", en: "holes (+)" },
          ],
        ],
        },
      ],
    },
    {
      heading: { ko: "PN 접합과 공핍층 — 0.7V 문턱의 정체", en: "PN junction & depletion region — origin of the 0.7V threshold" },
      bullets: [
        {
          ko: "N형과 P형을 붙이면 경계에서 전자와 정공이 만나 재결합하고, 그 자리에 캐리어가 없는 공핍층(depletion region)이 생깁니다.",
          en: "Join N-type and P-type, and at the boundary electrons and holes recombine, leaving a carrier-free depletion region.",
        },
        {
          ko: "공핍층은 전위 장벽(built-in potential)을 만들고, 전류가 흐르려면 이 장벽을 넘어야 합니다 — 바로 이것이 다이오드·BJT에서 보는 ~0.7V(Si) 문턱의 정체입니다.",
          en: "The depletion region sets up a built-in potential barrier that current must overcome — and that barrier is exactly the ~0.7V (Si) threshold seen in diodes and BJTs.",
        },
      ],
      diagram: [
        {
          kind: "junction",
          caption: {
            ko: "PN 접합 — 경계에서 전자·정공이 재결합해 캐리어 없는 공핍층이 남는다",
            en: "PN junction — electrons and holes recombine at the boundary, leaving a carrier-free depletion region",
          },
          states: [
            {
              bias: "eq",
              label: { ko: "무바이어스 (평형)", en: "No bias (equilibrium)" },
              sub: { ko: "내부 전위 장벽 ≈0.7V", en: "built-in barrier ≈0.7V" },
            },
          ],
        },
        {
        kind: "flow",
        dir: "col",
        caption: { ko: "PN 접합 → 공핍층 → 문턱 전압", en: "PN junction → depletion → threshold" },
        nodes: [
          { icon: "🔗", label: { ko: "N형 + P형 접합", en: "N + P junction" }, sub: { ko: "두 반도체를 붙임", en: "join the two" } },
          { label: { ko: "경계 재결합", en: "boundary recombination" }, sub: { ko: "전자·정공 만나 소멸", en: "electrons meet holes" } },
          { label: { ko: "공핍층 형성", en: "depletion region" }, sub: { ko: "캐리어 없는 영역", en: "carrier-free zone" } },
          { label: { ko: "전위 장벽 ≈0.7V", en: "barrier ≈0.7V" }, sub: { ko: "= 문턱 전압의 정체", en: "= the threshold" }, tone: "accent" },
        ],
        },
      ],
    },
    {
      heading: { ko: "순방향 vs 역방향 — 한 방향 도통의 원리", en: "Forward vs reverse — why one-way conduction" },
      bullets: [
        {
          ko: "PN 접합에 전압을 어느 방향으로 거느냐가 공핍층의 폭을 바꾸고, 그게 도통/차단을 가릅니다.",
          en: "Which way you bias the PN junction changes the depletion width, and that decides conduction vs blocking.",
        },
        {
          ko: "순방향(P에 +, N에 −)은 장벽을 밀어내 공핍층을 좁히고, 0.7V(Si)를 넘으면 도통합니다.",
          en: "Forward bias (+ on P, − on N) pushes the barrier down, narrows the depletion region, and conducts past 0.7V (Si).",
        },
        {
          ko: "역방향(P에 −, N에 +)은 캐리어를 장벽에서 멀어지게 해 공핍층을 넓히고 차단합니다(미세 누설만) — 항복전압을 넘으면 급격히 도통합니다.",
          en: "Reverse bias (− on P, + on N) pulls carriers away, widens the depletion region, and blocks (only tiny leakage) — until breakdown, where it conducts abruptly.",
        },
        {
          ko: "이 거동이 곧 다이오드의 I-V 특성 곡선 — 순방향 도통·역방향 차단·항복 영역이 전부 공핍층으로 설명됩니다.",
          en: "This behavior is the diode I-V curve itself — forward conduction, reverse block, and breakdown all explained by the depletion region.",
        },
      ],
      diagram: [
        {
          kind: "junction",
          caption: {
            ko: "전압 방향이 공핍층 폭을 바꾼다 — 순방향은 좁히고, 역방향은 넓힌다",
            en: "Bias direction reshapes the depletion width — forward narrows it, reverse widens it",
          },
          states: [
            {
              bias: "forward",
              label: { ko: "순방향 (P에 + · N에 −)", en: "Forward (+ on P, − on N)" },
              sub: { ko: "공핍층 좁아짐 → 0.7V↑ 도통", en: "narrows → conducts past 0.7V" },
            },
            {
              bias: "reverse",
              label: { ko: "역방향 (P에 − · N에 +)", en: "Reverse (− on P, + on N)" },
              sub: { ko: "공핍층 넓어짐 → 차단", en: "widens → blocks" },
            },
          ],
        },
        {
          kind: "iv",
          caption: {
            ko: "다이오드 I-V 특성 곡선 — 위 공핍층 거동의 결과 (순방향 도통·역방향 차단·항복)",
            en: "Diode I-V characteristic — the result of the depletion behavior above",
          },
          xLabel: { ko: "V 전압", en: "V" },
          yLabel: { ko: "I 전류", en: "I" },
          vfLabel: { ko: "VF≈0.7V", en: "VF≈0.7V" },
          vbrLabel: { ko: "항복 VBR", en: "breakdown" },
          fwdLabel: { ko: "순방향 도통", en: "forward on" },
          revLabel: { ko: "역방향 차단(누설)", en: "reverse block" },
        },
      ],
    },
    {
      heading: { ko: "문턱 전압은 왜 재료마다 다른가", en: "Why the threshold differs by material" },
      bullets: [
        {
          ko: "장벽 높이는 재료의 밴드갭·접합 구조에 달려 있어, 같은 '다이오드'라도 재료에 따라 문턱 VF가 다릅니다.",
          en: "Barrier height depends on the material's bandgap and junction structure, so the forward threshold VF differs by material even among 'diodes'.",
        },
        {
          ko: "쇼트키는 PN이 아니라 금속-반도체 접합이라 문턱이 낮고 회복이 빠릅니다 — 정류·스위칭에서 손실이 적은 이유입니다.",
          en: "A Schottky is a metal-semiconductor junction, not PN, so it has a low threshold and fast recovery — hence low loss in rectification and switching.",
        },
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "재료별 순방향 문턱 VF", en: "Forward threshold VF by material" },
        headers: [
          { ko: "소자/재료", en: "Material" },
          { ko: "문턱 VF", en: "VF" },
          { ko: "메모", en: "Note" },
        ],
        rows: [
          [
            { ko: "실리콘(Si) PN", en: "Silicon (Si) PN" },
            { ko: "~0.7V", en: "~0.7V" },
            { ko: "일반 다이오드 · BJT B-E", en: "general diode, BJT B-E" },
          ],
          [
            { ko: "게르마늄(Ge)", en: "Germanium (Ge)" },
            { ko: "~0.3V", en: "~0.3V" },
            { ko: "낮은 VF", en: "low VF" },
          ],
          [
            { ko: "쇼트키(금속-반도체)", en: "Schottky (metal-semi)" },
            { ko: "0.2~0.6V", en: "0.2~0.6V" },
            { ko: "PN 아님 · 빠른 회복", en: "not PN · fast recovery" },
          ],
        ],
      },
    },
    {
      heading: { ko: "능동소자로 확장 — 다이오드·BJT·MOSFET의 공통 뿌리", en: "Scaling to active devices — the shared root" },
      bullets: [
        {
          ko: "다이오드 = PN 접합 1개. 순방향 도통·역방향 차단 그 자체입니다.",
          en: "Diode = one PN junction. Forward conduction and reverse blocking, full stop.",
        },
        {
          ko: "BJT = PN 접합 2개를 등 맞댄 NPN 구조. 베이스-에미터 0.7V 문턱을 넘기는 작은 베이스 전류로 큰 컬렉터 전류를 제어합니다.",
          en: "BJT = two PN junctions back-to-back (NPN). A small base current that crosses the 0.7V base-emitter threshold controls a large collector current.",
        },
        {
          ko: "MOSFET = 게이트에 전압을 걸어 반도체 표면에 전도 채널을 만드는 전압 제어 소자(게이트는 절연).",
          en: "MOSFET = a voltage-controlled device that forms a conducting channel at the semiconductor surface via gate voltage (the gate is insulated).",
        },
        {
          ko: "문턱 전압은 셋 다 있지만 메커니즘이 다르다 — 다이오드 VF·BJT 베이스-에미터는 PN 접합 장벽(~0.7V)을 넘기는 것이고, MOSFET VGS(th)는 절연된 게이트 너머 채널을 만드는 전압이라 PN 장벽이 아니다. '문턱을 넘겨야 켜진다'는 형태만 공통이다.",
          en: "All three have a threshold, but via different mechanisms — diode VF and BJT base-emitter cross a PN-junction barrier (~0.7V), while MOSFET VGS(th) forms a channel across an insulated gate (not a PN barrier). Only the 'must cross a threshold to turn on' shape is shared.",
        },
      ],
      diagram: {
        kind: "branch",
        caption: { ko: "PN 접합 하나를 어떻게 쓰느냐로 갈린다", en: "How you use one PN junction sets them apart" },
        root: { icon: "🔬", label: { ko: "PN 접합 (이 페이지)", en: "PN junction (this page)" }, tone: "accent" },
        children: [
          { label: { ko: "다이오드 #9", en: "Diode #9" }, sub: { ko: "PN 접합 1개 · 한 방향 도통", en: "1 junction · one-way" }, tone: 3 },
          { label: { ko: "BJT #10", en: "BJT #10" }, sub: { ko: "PN 접합 2개 (NPN) · 베이스 전류 제어", en: "2 junctions · base current" }, tone: 4 },
          { label: { ko: "MOSFET #11", en: "MOSFET #11" }, sub: { ko: "게이트 전압으로 채널 형성", en: "gate voltage forms channel" }, tone: 6 },
        ],
      },
    },
    {
      heading: { ko: "기생(바디) 다이오드 — 구조가 만드는 부산물", en: "Body (parasitic) diode — a byproduct of the structure" },
      bullets: [
        {
          ko: "반도체 소자를 만들면 의도한 접합 외에 공정상 어쩔 수 없이 생기는 PN 접합이 따라온다. 대표적으로 MOSFET에는 드레인-소스 사이에 바디(기생) 다이오드가 항상 존재한다(N형·P형은 방향만 반대).",
          en: "Fabricating a semiconductor device brings unintended PN junctions along with the intended ones. Notably, every MOSFET has a body (parasitic) diode between drain and source (N-/P-type differ only in direction).",
        },
        {
          ko: "이 바디 다이오드도 보통 다이오드와 같은 특성 — 순방향 도통·역방향 차단·역회복시간(trr)을 가져서, 스위칭 회로에선 그 역회복을 반드시 고려해야 한다.",
          en: "It behaves like an ordinary diode — forward conduction, reverse blocking, and a reverse-recovery time (trr) — so its recovery must be accounted for in switching circuits.",
        },
        {
          ko: "인버터에서는 이 바디 다이오드가 모터 같은 유도성 부하의 환류(freewheeling) 경로로 활용되기도 한다 — 부산물이지만 쓸모가 있다. 데이터시트의 기생 성분은 버그가 아니라 PN 접합의 자연스러운 결과다.",
          en: "In inverters this body diode even serves as the freewheeling path for inductive loads like motors — a useful byproduct. The parasitics on a datasheet aren't bugs; they're the natural result of PN junctions.",
        },
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "공정이 만든 기생 PN → 바디 다이오드 → 인버터 환류", en: "Process-made parasitic PN → body diode → inverter freewheeling" },
        nodes: [
          { icon: "🏭", label: { ko: "MOSFET 제조", en: "MOSFET fab" }, sub: { ko: "반도체 공정", en: "semiconductor process" } },
          { label: { ko: "의도치 않은 PN 접합", en: "unintended PN junction" }, sub: { ko: "드레인-소스 사이", en: "drain–source" } },
          { label: { ko: "바디(기생) 다이오드", en: "body diode" }, sub: { ko: "순방향 도통 · 역회복 trr", en: "forward · trr" }, tone: "accent" },
          { label: { ko: "인버터 환류 경로", en: "inverter freewheeling" }, sub: { ko: "+ 역회복 손실 고려", en: "+ recovery loss" }, tone: 4 },
        ],
      },
    },
  ],
  pitfall: {
    ko: "강의들은 이 바닥(도핑·공핍층)을 건너뛰고 '순방향 0.7V 문턱'부터 시작합니다. 다이오드·BJT가 안 잡혔다면 십중팔구 이 페이지가 그 빈칸이었을 겁니다 — 강의 듣기 전에 순방향/역방향 절을 먼저 보면 '문턱·차단'이라는 말이 갑자기 말이 됩니다. 밴드갭·페르미 준위·캐리어 이동도 같은 더 깊은 물성은 필요해질 때 보강하고, 지금은 '왜 한 방향으로 흐르고 왜 0.7V인가'까지만 잡습니다.",
    en: "Lectures skip this floor (doping, depletion) and start at 'the 0.7V forward threshold.' If diodes/BJTs never clicked, this page was probably the missing piece — read the forward/reverse section before the lecture and 'threshold/blocking' suddenly makes sense. Deeper physics (bandgap, Fermi level, carrier mobility) can wait; for now, just nail down why it flows one way and why 0.7V.",
  },
};
