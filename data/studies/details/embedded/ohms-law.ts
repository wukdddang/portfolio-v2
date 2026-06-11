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
