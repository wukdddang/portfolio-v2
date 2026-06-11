import type { TopicDetail } from "../../types";

export const slcGrd: TopicDetail = {
  tldr: {
    ko: "SLC는 각 픽셀의 복소수(I + jQ)를 그대로 저장해 위상을 보존하므로 InSAR의 입력이 되고, GRD는 진폭(|I + jQ|)만 남기고 위상을 버린 범용 제품이다. ESA 아카이브에서 GRD가 약 80~90%, SLC가 약 10~20%인 이유는 'SLC 일부만 GRD로 변환'이 아니라 수요·용량·관측모드가 겹친 결과다 — 대부분 사용자는 위상이 필요 없고 SLC는 GRD의 3~5배 용량이기 때문이다. InSAR 파이프라인만 보면 SLC가 '기본 제품'처럼 느껴지지만, 그건 전문가 시야의 착시이고 운영 관점의 기본은 GRD다.",
    en: "SLC stores each pixel's complex value (I + jQ) as-is, preserving phase, so it serves as the input for InSAR; GRD keeps only amplitude (|I + jQ|), discarding phase, as a general-purpose product. The reason GRD makes up roughly 80–90% of the ESA archive while SLC is only ~10–20% is not that 'only some SLC gets converted to GRD,' but a combination of demand, storage volume, and acquisition mode — most users do not need phase, and SLC is 3–5 times larger than GRD. Looking only at the InSAR pipeline makes SLC feel like the 'default product,' but that is an illusion of the expert's viewpoint; from an operational standpoint the default is GRD."
  },
  sections: [
    {
      heading: { ko: "SLC vs GRD — 무엇이 다른가", en: "SLC vs GRD — what is the difference" },
      bullets: [
        { ko: "SLC(Single Look Complex)는 I와 Q를 모두 저장해 위상 φ를 보존하고, GRD(Ground Range Detected)는 진폭만 저장하고 위상을 버린다.", en: "SLC (Single Look Complex) stores both I and Q to preserve phase φ, while GRD (Ground Range Detected) stores only amplitude and discards phase." },
        { ko: "위상은 두 시점 영상의 차이를 mm 단위로 재는 InSAR의 핵심 재료이므로, 위상을 버린 GRD는 InSAR에 원천적으로 쓸 수 없다.", en: "Phase is the core ingredient of InSAR, which measures the difference between two acquisitions in millimeters, so GRD — having discarded phase — fundamentally cannot be used for InSAR." },
        { ko: "반대로 '어디가 물에 잠겼나, 어디가 변했나' 같은 질문은 진폭만으로 풀리므로 변화탐지·홍수매핑·분류에는 GRD로 충분하다.", en: "Conversely, questions like 'where is flooded, where has changed' are solvable with amplitude alone, so GRD suffices for change detection, flood mapping, and classification." }
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "SLC와 GRD의 위상·용도·아카이브 비중 비교", en: "Comparing SLC and GRD by phase, use, and archive share" },
        headers: [
          { ko: "", en: "" },
          { ko: "SLC", en: "SLC" },
          { ko: "GRD", en: "GRD" }
        ],
        rows: [
          [
            { ko: "위상", en: "Phase" },
            { ko: "복소수 I+jQ로 위상 보존", en: "Preserves phase as complex I+jQ" },
            { ko: "진폭만 저장, 위상 버림", en: "Amplitude only, phase discarded" }
          ],
          [
            { ko: "용도", en: "Use" },
            { ko: "InSAR·DInSAR·SBAS·PSI 전용", en: "InSAR/DInSAR/SBAS/PSI only" },
            { ko: "변화탐지·홍수매핑·분류 등 범용", en: "Change detection, flood mapping, classification" }
          ],
          [
            { ko: "아카이브 비중", en: "Archive share" },
            { ko: "약 10~20%", en: "~10–20%" },
            { ko: "약 80~90%", en: "~80–90%" }
          ]
        ]
      }
    },
    {
      heading: { ko: "왜 GRD가 80~90%인가", en: "Why GRD is 80–90%" },
      bullets: [
        { ko: "홍수·농업·해양·산림·재난·GIS 등 대다수 활용은 위상이 불필요해 GRD로 충분하고, DInSAR·SBAS·PSInSAR를 쓰는 InSAR 사용자는 SAR 사용자 중에서도 소수다.", en: "Most uses — flood, agriculture, ocean, forestry, disaster, GIS — do not need phase and are served by GRD, while InSAR users running DInSAR/SBAS/PSInSAR are a niche even among SAR users." },
        { ko: "용량 측면에서 IW 기준 SLC는 약 3~8GB, GRDH는 약 0.8~1.5GB로 SLC가 3~5배 크며, ESA는 하루 수십 TB를 수신해 모든 모드를 SLC로 영구보관할 수 없어 수요 많은 GRD를 우선한다.", en: "In volume, IW SLC is roughly 3–8GB versus GRDH at about 0.8–1.5GB — SLC is 3–5 times larger — and since ESA receives tens of TB daily it cannot archive every mode as SLC forever, so it prioritizes the higher-demand GRD." },
        { ko: "Wave(WV, 해양) 등 일부 관측 모드는 SLC보다 OCN·GRD 활용도가 높아 모드별 편향까지 더해진다.", en: "Some acquisition modes such as Wave (WV, ocean) lean more toward OCN/GRD than SLC, adding a per-mode bias on top." }
      ]
    },
    {
      heading: { ko: "처리 체인에서의 위치와 착시", en: "Position in the processing chain and the illusion" },
      bullets: [
        { ko: "GRD는 SLC를 한 번 더 가공한(멀티룩·검파·지상투영) 후속 제품이므로, 처리 순서로는 SLC가 먼저지만 배포량은 GRD가 압도한다.", en: "GRD is a downstream product made by further processing SLC (multilook, detection, ground projection), so SLC comes first in processing order yet GRD dominates in distribution volume." },
        { ko: "'더 가공된 쪽이 더 많이 풀린다'는 역설은 전적으로 수요 때문이다.", en: "The paradox that 'the more-processed product is distributed more' is entirely due to demand." },
        { ko: "SNAP·MintPy·MiaplPy로 RAW → SLC → Coregistration → Interferogram → SBAS/PSI만 보면 SLC가 출발점이자 '기본'처럼 느껴지지만, 전 세계 배포량 기준의 기본 제품은 GRD다.", en: "Working only through RAW → SLC → Coregistration → Interferogram → SBAS/PSI in SNAP/MintPy/MiaplPy makes SLC feel like the starting point and 'default,' but by global distribution volume the default product is GRD." }
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "처리 순서는 SLC가 먼저지만 배포량은 GRD가 압도", en: "SLC comes first in processing, but GRD dominates distribution" },
        nodes: [
          { icon: "📡", label: { ko: "RAW", en: "RAW" }, sub: { ko: "수신 원시 신호", en: "Received raw signal" }, tone: "muted" },
          { icon: "🧮", label: { ko: "SLC", en: "SLC" }, sub: { ko: "압축·Focusing → 위상 보존", en: "compression, focusing → phase preserved" }, tone: "accent" },
          { icon: "🗺️", label: { ko: "GRD", en: "GRD" }, sub: { ko: "멀티룩·검파·지상투영 → 진폭만", en: "multilook, detection, projection → amplitude only" }, tone: 2 }
        ]
      }
    }
  ],
  pitfall: {
    ko: "카탈로그 검색 시 product type을 반드시 명시할 것 — CDSE/ASF의 기본 결과에는 GRD가 많이 섞여 나오므로, InSAR용이라면 'IW_SLC'를 명시적으로 필터링해야 헛걸음이 없다. 단, GRD가 많다고 'SLC 커버리지가 부족하다'는 뜻은 아니다 — 부족한 건 전 지구 SLC이지 국지 SLC가 아니며, 관심 지역에는 SLC가 이미 다수 존재할 수 있다.",
    en: "Always specify the product type when searching the catalog — default results in CDSE/ASF mix in a lot of GRD, so for InSAR you must explicitly filter for 'IW_SLC' to avoid wasted effort. That said, abundant GRD does not mean 'SLC coverage is lacking' — what is scarce is global SLC, not local SLC, and your area of interest may already have plenty of SLC."
  }
};
