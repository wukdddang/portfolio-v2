import type { TopicDetail } from "../../types";

export const ohmsLaw: TopicDetail = {
              tldr: {
                ko: "옴의 법칙은 V=IR 한 줄로 전압·전류·저항의 관계를 정의하는 회로의 기본 법칙입니다. 전압=수압, 전류=물살, 저항=좁은 관이라는 물 흐름 비유로 직관을 잡고, 세 값 중 둘을 알면 나머지를 계산합니다. 킥보드 BLDC에서는 배터리 전압과 모터 코일 저항으로 흐를 전류를 추산해 모터 출력·과전류 여부를 판단하는 출발점입니다.",
                en: "Ohm's law (V=IR) defines the voltage–current–resistance relationship — the foundation of circuit analysis, grasped via the water-flow analogy and used to estimate motor current in the kickboard BLDC.",
              },
              sections: [
                {
                  heading: { ko: "법칙 한 줄 — 물 흐름 비유", en: "The law via the water-flow analogy" },
                  bullets: [
                    {
                      ko: "V는 수압(밀어주는 힘), I는 물살(실제 흐르는 양), R은 좁은 관(흐름 방해) — 수압이 세면 많이 흐르고 관이 좁으면 덜 흐른다는 게 V=IR의 모든 직관입니다.",
                      en: "V is water pressure, I is flow, R is a narrow pipe — that mapping is the entire intuition of V=IR.",
                    },
                    {
                      ko: "12V 배터리에 6Ω 저항이면 I = 12V/6Ω = 2A. 전류는 폐회로를 한 바퀴 돌며 R이 흐름의 양을 결정합니다.",
                      en: "12V across 6Ω gives I = 2A; current loops the closed circuit and R sets how much flows.",
                    },
                    {
                      ko: "V는 보통 전원이 정해주므로 설계자가 만질 수 있는 건 R — 과전류를 막으려면 R을 키웁니다.",
                      en: "The supply fixes V, so the designer's knob is R — raise it to limit current.",
                    },
                  ],
                  diagram: {
                    kind: "formula",
                    expr: "V = I \\times R",
                    caption: { ko: "12V ÷ 6Ω = 2A", en: "12V ÷ 6Ω = 2A" },
                    legend: [
                      { sym: "V", desc: { ko: "전압 = 수압", en: "Voltage = pressure" } },
                      { sym: "I", desc: { ko: "전류 = 물살", en: "Current = flow" } },
                      { sym: "R", desc: { ko: "저항 = 좁은 관", en: "Resistance = narrow pipe" } },
                    ],
                  },
                },
                {
                  heading: { ko: "접지(GND) — 0V 기준점이자 전류의 귀환로", en: "Ground (GND) — the 0V reference and current's return path" },
                  bullets: [
                    {
                      ko: "전압은 항상 '어딘가 기준'인 상대값입니다(높이를 해발 0m로 재듯). 그 0V 기준점이 접지(GND) — VGS·VCE 같은 전압도 한쪽(보통 GND)을 0으로 놓고 잰 값입니다.",
                      en: "Voltage is always relative to some reference (like altitude from sea level); that 0V reference is ground (GND) — even VGS or VCE are measured with one side (usually GND) set to 0.",
                    },
                    {
                      ko: "역할 셋 — ① 모든 전압의 0점 기준, ② 전류가 돌아오는 공통 귀환 경로(전원→부품→GND→전원), ③ 노이즈·서지를 흘려보내는 출구.",
                      en: "Three roles — (1) the 0V reference for every voltage, (2) the common return path for current (supply→part→GND→supply), (3) the exit that shunts noise/surge away.",
                    },
                    {
                      ko: "그래서 바이패스 커패시터는 고주파 노이즈를, TVS는 서지를 GND로 빼냅니다 — '버리는 곳'이 있어야 빼낼 수 있습니다. 한 줄: 접지 = 이 회로의 0V 기준점이자 전류가 돌아오는 길.",
                      en: "That's why a bypass capacitor dumps HF noise and a TVS dumps surges to GND — you need a 'place to dump' to shunt anything. In one line: ground is the circuit's 0V reference and the path current returns on.",
                    },
                  ],
                  diagram: {
                    kind: "flow",
                    dir: "row",
                    caption: { ko: "전류는 GND를 거쳐 전원으로 돌아온다 (0V 기준)", en: "Current returns to the supply via GND (the 0V reference)" },
                    nodes: [
                      { icon: "⚡", label: { ko: "전원 +", en: "Supply +" }, tone: 2 },
                      { label: { ko: "부품 (R·소자)", en: "Part (R/device)" }, tone: 6 },
                      { label: { ko: "접지 GND", en: "Ground GND" }, sub: { ko: "0V 기준", en: "0V reference" }, tone: "accent" },
                      { label: { ko: "전원으로 귀환", en: "back to supply" }, tone: 2 },
                    ],
                  },
                },
                {
                  heading: { ko: "킥보드/STM32 맥락", en: "Kickboard / STM32 context" },
                  bullets: [
                    {
                      ko: "모터 코일 — 배터리 V와 코일 R로 최대 전류 V/R을 추산해 모터가 낼 힘과 과전류로 탈 위험을 판단합니다.",
                      en: "Motor coil: estimate max current V/R to judge torque and burnout risk.",
                    },
                    {
                      ko: "션트 저항 — 작은 R에 흐른 전류가 만드는 작은 전압을 측정해 I를 역산하는 전류 측정의 원리입니다.",
                      en: "Shunt resistor: measure the small voltage across a small R to back-calculate current.",
                    },
                    {
                      ko: "LED 보호 저항은 I를 안전 범위로 제한하려고 R을 의도적으로 추가하는 것 — MOSFET 발열 추산도 같은 V·R 관계입니다.",
                      en: "LED protection resistors deliberately add R to cap current; MOSFET heat estimates use the same relation.",
                    },
                  ],
                },
              ],
              pitfall: {
                ko: "이상적 옴성 저항 가정에 주의 — 실제 모터 코일은 인덕턴스(L)도 가져 전류가 즉시 변하지 않습니다. 큰 전류에서는 배선 저항도 무시 못 해 전압 강하·발열로 이어집니다.",
                en: "Real motor coils also have inductance, so current never changes instantly; at high current even wiring resistance causes voltage drop and heat.",
              },
            };
