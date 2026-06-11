import type { TopicDetail } from "../../types";

export const inductorTypes: TopicDetail = {
              tldr: {
                ko: "인덕터는 투자율 높은 코어에 코일을 감아 자기장을 만드는 소자로, 정체성은 전류 변화에 반대 방향으로 기전력을 만드는 역기전력(렌츠 법칙)입니다. 커패시터가 전압을, 인덕터는 전류를 붙들려 하는 쌍대 관계입니다. 용도는 3종 — ① 에너지를 저장하는 파워 인덕터(DC-DC 벅/부스트), ② 고주파에서 저항처럼 노이즈를 I²R 열로 태우는 페라이트 비드, ③ R+L+역기전력으로 모델링하는 모터 등가회로. 변압기는 1·2차가 자속으로만 연결돼 전기적 절연을 제공하는 게 핵심 가치입니다.",
                en: "An inductor wraps a coil around a high-permeability core; its identity is back-EMF that opposes any change in current (Lenz's law) — the current-side dual of a capacitor. Three uses: a power inductor that stores energy (DC-DC buck/boost), a ferrite bead that acts resistive at high frequency to burn noise as I²R heat, and a motor modeled as R+L+back-EMF. A transformer's core value is electrical isolation, since the windings couple only through magnetic flux.",
              },
              sections: [
                {
                  heading: { ko: "인덕터란 — 전류의 관성", en: "What an inductor is — inertia of current" },
                  bullets: [
                    {
                      ko: "코어(자성체)에 도선을 감아 자기장을 만드는 수동소자. 전류가 변하면 변화에 반대 방향으로 역기전력 v = L·di/dt를 만들어 변화를 방해합니다(렌츠 법칙).",
                      en: "A passive part: a coil on a magnetic core. When current changes, it generates back-EMF v = L·di/dt opposing the change (Lenz's law).",
                    },
                    {
                      ko: "코일 턴수가 많을수록 인덕턴스 L이 커지고, 에너지를 E=½Li²로 저장합니다 — 커패시터의 E=½CV²와 전압/전류 쌍대(dual).",
                      en: "More turns → larger L; it stores energy as E=½Li² — the current-side dual of the capacitor's E=½CV².",
                    },
                  ],
                },
                {
                  heading: { ko: "용도 3분류 + 임피던스", en: "Three uses + impedance" },
                  bullets: [
                    {
                      ko: "파워 인덕터 — 캔·원환체(toroidal) 형태로 에너지를 저장. DC-DC 벅/부스트 컨버터 전원부, 수십 A까지. 원환체는 자속을 코어에 가둬 누설·EMI가 적습니다.",
                      en: "Power inductor — can/toroidal shapes storing energy in DC-DC buck/boost supplies, up to tens of amps. Toroidals trap flux in the core, cutting leakage and EMI.",
                    },
                    {
                      ko: "페라이트 비드 — 고주파에서 넓은 저항성 영역을 이뤄, 노이즈 전류를 I²R 열로 흡수·소멸시킵니다(반사가 아니라 흡수).",
                      en: "Ferrite bead — a broad resistive region at high frequency that absorbs noise current as I²R heat (absorbing, not reflecting).",
                    },
                    {
                      ko: "커패시터와 거울 대칭 — 둘 다 자기공진주파수(SRF) 이후 정반대 소자로 뒤집힙니다. 인덕터는 용량성으로, 커패시터는 유도성으로.",
                      en: "Mirror of the capacitor — past self-resonance (SRF) each flips to its opposite: the inductor turns capacitive, the capacitor inductive.",
                    },
                  ],
                  diagram: {
                    kind: "branch",
                    caption: { ko: "같은 인덕터, 용도로 갈리는 3종", en: "One inductor, three uses" },
                    root: { icon: "🧲", label: { ko: "인덕터", en: "Inductor" }, tone: 6 },
                    children: [
                      {
                        icon: "🔋",
                        label: { ko: "파워 인덕터", en: "Power inductor" },
                        sub: { ko: "에너지 저장 ½Li²", en: "Stores energy ½Li²" },
                        tone: 4,
                      },
                      {
                        icon: "🧹",
                        label: { ko: "페라이트 비드", en: "Ferrite bead" },
                        sub: { ko: "노이즈 → I²R 열", en: "Noise → I²R heat" },
                        tone: 5,
                      },
                      {
                        icon: "⚙",
                        label: { ko: "모터 등가회로", en: "Motor model" },
                        sub: { ko: "R + L + 역기전력", en: "R + L + back-EMF" },
                        tone: 2,
                      },
                    ],
                  },
                },
                {
                  heading: { ko: "변압기 — 진짜 가치는 절연", en: "Transformer — the real value is isolation" },
                  bullets: [
                    {
                      ko: "1·2차 코일이 한 코어에 감기되 물리적으로 비연결 — 자속으로만 전달됩니다. 전압은 턴수비를 따릅니다(V1/V2 = N1/N2).",
                      en: "Primary and secondary share a core but aren't physically connected — coupled only by flux. Voltage follows the turns ratio (V1/V2 = N1/N2).",
                    },
                    {
                      ko: "핵심은 전기적 절연 — 감전돼도 2차측 안전전압(12V)만 닿고 400V 직접 노출을 차단. 휴대폰 충전기의 플라이백 컨버터가 220V AC를 절연한 채 DC로 변환하는 원리.",
                      en: "The key is electrical isolation — you only contact the safe secondary (12 V), never the 400 V directly. It's how a phone charger's flyback converter steps 220 V AC down to DC while staying isolated.",
                    },
                  ],
                  diagram: {
                    kind: "flow",
                    dir: "row",
                    caption: { ko: "1·2차는 자속으로만 연결 — 전기적 절연", en: "Coupled only by flux — electrical isolation" },
                    nodes: [
                      { label: { ko: "1차 코일 N1", en: "Primary N1" }, sub: { ko: "교류 입력", en: "AC in" }, tone: 2 },
                      { icon: "🧲", label: { ko: "코어", en: "Core" }, sub: { ko: "자속 통로", en: "Flux path" }, tone: 6 },
                      {
                        label: { ko: "2차 코일 N2", en: "Secondary N2" },
                        sub: { ko: "V2 = V1·N2/N1", en: "V2 = V1·N2/N1" },
                        tone: 3,
                      },
                    ],
                  },
                },
                {
                  heading: { ko: "킥보드 보드 연결", en: "Kickboard board context" },
                  bullets: [
                    {
                      ko: "벅컨버터 전원부의 파워 인덕터가 에너지를 저장하며 강압하고, 신호·전원 라인의 페라이트 비드가 고주파 노이즈를 열로 흡수합니다.",
                      en: "The buck converter's power inductor stores energy while stepping down, and ferrite beads on signal/power lines soak up high-frequency noise as heat.",
                    },
                  ],
                },
              ],
              pitfall: {
                ko: "강의가 미룬 두 빈칸 — 모터 등가회로(R+L+역기전력)는 모터 제어 강의에서, 포화전류·DCR(인덕터 선정 함정)은 별도로 채울 자리. 전사 원본엔 STT 오인식이 많아(자성체·저항·권선·스위칭 등) 다시 볼 땐 상단 대조표를 먼저 봐야 합니다.",
                en: "Two gaps the lecture deferred — the motor equivalent circuit (R+L+back-EMF) comes in the motor-control course, and saturation current / DCR (the inductor-selection trap) stays to be filled. The raw transcript has many STT errors, so check the correction table at its top first.",
              },
            };
