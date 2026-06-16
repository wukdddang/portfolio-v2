import type { TopicDetail } from "../../types";

export const chirp: TopicDetail = {
  tldr: {
    ko: "Chirp는 짧은 펄스처럼 동작하지만 실제로는 길게 쏘면서 주파수를 선형으로 계속 바꾸는(예: 5.38→5.43 GHz) 레이더 신호로, 「해상도엔 짧은 펄스 / 에너지엔 긴 펄스」라는 모순을 한 번에 푼다. 수신 후 프로세서는 자기가 쏜 Chirp를 정확히 알고 있어, 수신신호를 원본과 비교(matched filter)하면 길게 퍼진 신호가 하나의 짧은 펄스로 압축되는데 이것이 Range Compression이며 해상도와 SNR을 동시에 끌어올린다. 압축 후 해상도는 펄스 길이가 아니라 대역폭으로 결정되고(ΔR=c/2B), SNAP의 RAW→SLC 경로에서 Range Compression이 곧 Chirp 압축이라 Chirp가 없으면 SLC 생성 자체가 불가능하다.",
    en: "A chirp behaves like a short pulse but is actually transmitted long while its frequency sweeps linearly (e.g. 5.38→5.43 GHz), resolving in one stroke the contradiction of 'a short pulse for resolution / a long pulse for energy.' After reception the processor knows exactly the chirp it transmitted, so comparing the received signal against the original (a matched filter) compresses the long, spread-out signal into a single short pulse — this is Range Compression, and it raises resolution and SNR at the same time. After compression the resolution is set not by pulse length but by bandwidth (ΔR=c/2B), and since Range Compression is precisely chirp compression in SNAP's RAW→SLC path, without a chirp an SLC simply cannot be produced."
  },
  sections: [
    {
      heading: { ko: "해결하려는 딜레마", en: "The dilemma it solves" },
      bullets: [
        { ko: "좋은 Range 해상도를 위해서는 짧은 펄스(삐!)가 필요하지만, 펄스가 짧으면 에너지가 부족해 SNR이 낮아진다.", en: "Good Range resolution needs a short pulse (a quick 'beep!'), but a short pulse carries too little energy, so the SNR is low." },
        { ko: "충분한 에너지와 SNR을 위해서는 긴 펄스(삐이이익)가 필요하지만, 펄스가 길면 해상도가 나빠진다.", en: "Enough energy and SNR needs a long pulse (a drawn-out 'beeeeep'), but a long pulse makes resolution poor." },
        { ko: "밤 사진 비유처럼 아주 짧게 번쩍이면 선명하지만 어둡고, 1초간 비추면 밝지만 흐려진다 — SAR도 둘을 동시에 못 한다.", en: "Like night photography, a very brief flash is sharp but dark, while a one-second exposure is bright but blurry — SAR cannot have both at once either." }
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "짧은 펄스 vs 긴 펄스의 딜레마", en: "The short-pulse vs long-pulse dilemma" },
        headers: [
          { ko: "", en: "" },
          { ko: "필요한 펄스", en: "Pulse needed" },
          { ko: "문제", en: "Problem" }
        ],
        rows: [
          [
            { ko: "좋은 Range 해상도", en: "Good Range resolution" },
            { ko: "짧은 펄스 (삐!)", en: "Short pulse" },
            { ko: "에너지 부족 → SNR 낮음", en: "Too little energy → low SNR" }
          ],
          [
            { ko: "충분한 에너지/SNR", en: "Enough energy / SNR" },
            { ko: "긴 펄스 (삐이이익)", en: "Long pulse" },
            { ko: "해상도 나쁨", en: "Poor resolution" }
          ]
        ]
      }
    },
    {
      heading: { ko: "Chirp란 무엇인가", en: "What a chirp is" },
      bullets: [
        { ko: "Chirp는 시간에 따라 주파수가 선형으로 변하는 신호로, 쏘는 동안 주파수가 계속 올라간다(새 짹짹 소리 같아서 chirp).", en: "A chirp is a signal whose frequency changes linearly over time, climbing continuously as it is transmitted (named for a bird's chirp)." },
        { ko: "Sentinel-1은 중심 5.405 GHz, 대역폭 56 MHz로, 대략 5.377~5.433 GHz 범위를 쓸며 송신한다(단순화).", en: "Sentinel-1 has a center of 5.405 GHz and a bandwidth of 56 MHz, sweeping roughly the 5.377~5.433 GHz range as it transmits (simplified)." },
        { ko: "이처럼 길게 쏘면서 넓은 대역폭을 확보하는 것이, 짧은 펄스를 실제로 만들어내는 Chirp의 정체다.", en: "Securing a wide bandwidth while transmitting long is exactly how a chirp realizes what amounts to a short pulse." }
      ],
      diagram: {
        kind: "plot",
        caption: { ko: "Chirp — 시간이 갈수록 주파수가 선형으로 올라가는 신호(5.38→5.43 GHz)", en: "Chirp — frequency climbs linearly over time (5.38→5.43 GHz)" },
        xLabel: { ko: "시간", en: "time" },
        yLabel: { ko: "진폭", en: "amp" },
        series: [{ label: { ko: "송신 Chirp", en: "transmit chirp" }, curve: "chirp", tone: "accent" }]
      }
    },
    {
      heading: { ko: "Range Compression — 왜 해상도가 좋아지나", en: "Range Compression — why resolution improves" },
      bullets: [
        { ko: "수신 후 프로세서는 자기가 쏜 Chirp를 정확히 알고 있어, 수신신호와 원본 Chirp를 비교(matched filter)한다.", en: "After reception the processor knows exactly the chirp it transmitted, so it compares the received signal against the original chirp (a matched filter)." },
        { ko: "이 비교를 통해 길게 퍼진 신호가 하나의 짧은 펄스로 압축되며, 이것이 Range Compression이다.", en: "Through this comparison the long, spread-out signal is compressed into a single short pulse — this is Range Compression." },
        { ko: "길게 쐈는데 짧게 쏜 효과가 나, 에너지(SNR)와 해상도를 동시에 얻는 것이 핵심이다.", en: "The signal was transmitted long yet acts as if short, so the key is gaining energy (SNR) and resolution at the same time." },
        { ko: "압축 후 해상도는 펄스 길이가 아니라 대역폭으로 결정된다(ΔR=c/2B).", en: "After compression the resolution is set not by pulse length but by bandwidth (ΔR=c/2B)." }
      ],
      diagram: [
        {
          kind: "plot",
          caption: { ko: "Matched filter 압축 — 길게 퍼진 에코가 한 점으로 모인다(해상도 ΔR=c/2B)", en: "Matched-filter compression — the spread echo collapses to one peak (ΔR=c/2B)" },
          xLabel: { ko: "거리(시간)", en: "range (time)" },
          yLabel: { ko: "세기", en: "power" },
          series: [{ label: { ko: "압축된 펄스", en: "compressed pulse" }, curve: "compressed", tone: 4 }]
        },
        {
        kind: "flow",
        dir: "row",
        caption: { ko: "긴 Chirp 송신에서 matched filter 압축까지", en: "From transmitting a long chirp to matched-filter compression" },
        nodes: [
          { icon: "〰", label: { ko: "송신 Chirp", en: "Transmit chirp" }, sub: { ko: "긴 신호, 주파수 변조", en: "long signal, FM" }, tone: "muted" },
          { label: { ko: "수신 신호", en: "Received signal" }, sub: { ko: "지표 반사 후 긴 에코", en: "long echo after reflection" }, tone: 2 },
          { label: { ko: "Matched Filter", en: "Matched filter" }, sub: { ko: "원본 Chirp와 상관", en: "correlate with original chirp" }, tone: "accent" },
          { label: { ko: "짧은 펄스 압축", en: "Compressed short pulse" }, sub: { ko: "= Range Compression → SNR↑·해상도↑", en: "= Range Compression → SNR↑·resolution↑" }, tone: 4 }
        ]
        }
      ]
    },
    {
      heading: { ko: "SNAP에서의 위치", en: "Where it sits in SNAP" },
      bullets: [
        { ko: "SNAP 처리에서 경로는 RAW → Range Compression(= Chirp 압축) → Azimuth Compression(합성개구) → SLC이다.", en: "In SNAP processing the path is RAW → Range Compression (= chirp compression) → Azimuth Compression (synthetic aperture) → SLC." },
        { ko: "Range Compression이 곧 Chirp 압축이며, Chirp나 matched filter가 없으면 SLC 자체를 만들 수 없다.", en: "Range Compression is precisely chirp compression, and without a chirp or matched filter an SLC cannot be produced at all." }
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "RAW→SLC 경로에서 Range Compression의 위치", en: "Where Range Compression sits in the RAW→SLC path" },
        nodes: [
          { label: { ko: "RAW", en: "RAW" }, tone: "muted" },
          { label: { ko: "Range Compression", en: "Range Compression" }, sub: { ko: "= Chirp 압축", en: "= chirp compression" }, tone: "accent" },
          { label: { ko: "Azimuth Compression", en: "Azimuth Compression" }, sub: { ko: "합성개구", en: "synthetic aperture" }, tone: 2 },
          { label: { ko: "SLC", en: "SLC" }, tone: 4 }
        ]
      }
    }
  ],
  pitfall: {
    ko: "Range Compression은 SLC 이전 단계라 SNAP 워크플로우에서 직접 보이진 않아 흘려보내기 쉽지만, 「왜 56MHz 대역폭이 5m 해상도로 이어지나」를 설명하는 연결고리다. 압축 후 해상도가 펄스 길이가 아니라 대역폭으로 결정된다는 점을 놓치면, 길게 쏘는 Chirp와 좋은 해상도가 왜 모순이 아닌지 끝내 이해하지 못한다.",
    en: "Because Range Compression precedes SLC and is not directly visible in the SNAP workflow, it is easy to skip over, yet it is the link that explains why a 56MHz bandwidth leads to 5m resolution. If you miss that post-compression resolution is set by bandwidth rather than pulse length, you will never grasp why a long-transmitted chirp and good resolution are not a contradiction."
  }
};
