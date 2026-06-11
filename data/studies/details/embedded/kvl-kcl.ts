import type { TopicDetail } from "../../types";

export const kvlKcl: TopicDetail = {
              tldr: {
                ko: "KCL은 한 노드에서 들어온 전류 총합 = 나간 전류 총합(전류 보존), KVL은 한 폐회로를 따라 전압의 총합 = 0(전압 보존)이라는 두 보존 법칙입니다. 옴의 법칙이 한 부품의 V-I-R 관계라면 키르히호프는 여러 부품이 모인 회로에서 전압·전류 분배를 계산하는 두 축입니다. 킥보드에서는 모터 3상(U/V/W) 전류 분배와 MOSFET·드라이버·코일의 전압 분배 추적에 쓰입니다.",
                en: "KCL (currents into a node sum to currents out) and KVL (voltages around a loop sum to zero) are the two conservation laws that let you compute current and voltage distribution in multi-component circuits.",
              },
              sections: [
                {
                  heading: { ko: "두 보존 법칙", en: "Two conservation laws" },
                  bullets: [
                    {
                      ko: "KCL — 노드에 5A가 들어오면 2A + 3A로 나뉘어 나갑니다. 물이 갈림길에서 갑자기 생기거나 사라지지 않는 것과 같습니다.",
                      en: "KCL: 5A into a node leaves as 2A + 3A — water at a fork neither appears nor vanishes.",
                    },
                    {
                      ko: "KVL — 12V 배터리 + 저항1(5V 강하) + 저항2(7V 강하) 직렬이면 +12V − 5V − 7V = 0. 공급한 전압만큼 회로에서 모두 소비되며, 이것이 전압 강하의 직접 근거입니다.",
                      en: "KVL: +12V − 5V − 7V = 0 in a series loop — supplied voltage is fully consumed, the direct basis of voltage drop.",
                    },
                  ],
                },
                {
                  heading: { ko: "직렬·병렬 회로", en: "Series vs parallel" },
                  bullets: [
                    {
                      ko: "직렬은 전류 I가 어디서나 같고 전압이 부품마다 나뉩니다 → KVL로 분배 계산.",
                      en: "Series: same I everywhere, voltage divides — compute with KVL.",
                    },
                    {
                      ko: "병렬은 전압 V가 어디서나 같고 전류가 갈래마다 나뉩니다 → KCL로 분배 계산.",
                      en: "Parallel: same V everywhere, current divides — compute with KCL.",
                    },
                  ],
                  diagram: {
                    kind: "compare",
                    caption: { ko: "무엇이 같고 무엇이 나뉘는가", en: "What stays equal vs what divides" },
                    headers: [
                      { ko: "", en: "" },
                      { ko: "직렬", en: "Series" },
                      { ko: "병렬", en: "Parallel" },
                    ],
                    rows: [
                      [
                        { ko: "어디서나 같은 값", en: "Equal everywhere" },
                        { ko: "전류 I", en: "Current I" },
                        { ko: "전압 V", en: "Voltage V" },
                      ],
                      [
                        { ko: "나뉘는 값", en: "Divides" },
                        { ko: "전압 V", en: "Voltage V" },
                        { ko: "전류 I", en: "Current I" },
                      ],
                      [
                        { ko: "계산 도구", en: "Tool" },
                        { ko: "KVL", en: "KVL" },
                        { ko: "KCL", en: "KCL" },
                      ],
                    ],
                  },
                },
                {
                  heading: { ko: "킥보드/STM32 맥락", en: "Kickboard / STM32 context" },
                  bullets: [
                    {
                      ko: "KCL — 배터리에서 모터 3상 U·V·W로 흐르는 전류 분배, 션트 저항 통과 전류 측정.",
                      en: "KCL: battery-to-3-phase (U/V/W) current split and shunt current measurement.",
                    },
                    {
                      ko: "KVL — 게이트 드라이버·MOSFET·코일에 걸린 전압의 합 = 공급 전압으로 전압 분배를 추적합니다.",
                      en: "KVL: gate driver + MOSFET + coil voltages sum to the supply voltage.",
                    },
                  ],
                },
              ],
              pitfall: {
                ko: "KCL/KVL은 어떤 회로에도 성립하지만, 실제 계산에서는 부호 규약(전압·전류 방향)을 일관되게 잡는 게 함정 — 한 번 헷갈리면 부호가 전부 틀어집니다.",
                en: "The trap is sign convention — pick consistent voltage/current directions or every sign in the calculation flips.",
              },
            };
