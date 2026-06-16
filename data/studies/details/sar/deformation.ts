import type { TopicDetail } from "../../types";

export const deformation: TopicDetail = {
  tldr: {
    ko: "InSAR는 같은 장소를 두 번 찍은 SAR 영상의 위상(phase) 차이로 지표의 cm~mm 수준 거리 변화를 측정하며, 그 핵심 수식은 Δφ=(4π/λ)·ΔR이다. Sentinel-1(λ=5.6cm C-band) 기준 fringe(간섭무늬) 한 줄은 약 2.8cm(=λ/2)의 LOS 변위에 해당한다. SAR은 위성 시선 방향(LOS)의 변위만 측정할 수 있어 동서·수직 이동을 분리하려면 Ascending과 Descending 두 궤도를 결합해야 한다. 실무 파이프라인에서는 Interferogram이 −π~π로 wrap된 위상차를 만들고 SNAPHU가 이를 unwrap한 뒤 ΔR로 환산해 LOS 변위를 얻는다.",
    en: "InSAR measures cm-to-mm-level ground range changes from the phase difference between two SAR images of the same place, its core formula being Δφ=(4π/λ)·ΔR. For Sentinel-1 (λ=5.6cm C-band) a single fringe equals about 2.8cm (=λ/2) of line-of-sight (LOS) displacement. Because SAR can only measure displacement along the satellite line-of-sight, separating east-west and vertical motion requires combining ascending and descending orbits. In the production pipeline the interferogram produces a phase difference wrapped to −π~π, SNAPHU unwraps it, and it is then converted into ΔR to yield the LOS displacement."
  },
  sections: [
    {
      heading: { ko: "위상으로 거리 변화를 잡는다", en: "Capturing range change through phase" },
      bullets: [
        { ko: "SAR의 진짜 무기는 밝기가 아니라 전파 위상이며, 같은 장소를 두 번 찍어 전파 왕복 거리 차이를 나노~센티미터 수준으로 비교한다.", en: "SAR's real weapon is not brightness but the wave phase; shooting the same place twice, it compares the round-trip range difference at the nano-to-centimeter level." },
        { ko: "핵심 수식은 Δφ=(4π/λ)·ΔR로, λ는 파장(Sentinel-1 C-band=5.6cm), ΔR은 위성↔지표 거리 변화, Δφ는 −π~π 범위로 wrap되는 위상 변화다.", en: "The core formula is Δφ=(4π/λ)·ΔR, where λ is the wavelength (Sentinel-1 C-band=5.6cm), ΔR is the satellite-to-ground range change, and Δφ is the phase change wrapped into the −π~π range." },
        { ko: "파장이 5.6cm 수준이라 수 cm 이동만 생겨도 위상이 크게 변한다 — 위성↔산 거리가 2.8cm 변하면 SAR이 위상으로 잡아낸다.", en: "Because the wavelength is around 5.6cm, even a few-cm shift changes the phase greatly — when the satellite-to-mountain range changes by 2.8cm, SAR detects it through phase." },
        { ko: "광학 카메라가 막히는 밤·구름·태풍 환경에서도 능동 전파로 관측할 수 있어 재난 직후 대응의 표준 도구가 된다.", en: "Since it observes with active waves even in night, cloud, or typhoon conditions that block optical cameras, it is the standard tool for immediate disaster response." }
      ],
      diagram: {
        kind: "formula",
        expr: "\\Delta\\varphi = \\dfrac{4\\pi}{\\lambda}\\,\\Delta R",
        caption: { ko: "위상 변화는 거리 변화에 비례 (C-band fringe 한 줄 = λ/2 ≈ 2.8cm)", en: "Phase change is proportional to range change (one C-band fringe = λ/2 ≈ 2.8cm)" },
        legend: [
          { sym: "\\Delta\\varphi", desc: { ko: "위상 변화 (−π~π로 wrap)", en: "phase change (wrapped to −π~π)" } },
          { sym: "\\lambda", desc: { ko: "파장 — Sentinel-1 C-band = 5.6cm", en: "wavelength — Sentinel-1 C-band = 5.6cm" } },
          { sym: "\\Delta R", desc: { ko: "위성↔지표 거리 변화", en: "satellite-to-ground range change" } }
        ]
      }
    },
    {
      heading: { ko: "Fringe(간섭무늬) 읽기", en: "Reading fringes" },
      bullets: [
        { ko: "InSAR 결과에는 빨강-파랑-초록-노랑이 반복되는 줄무늬, 즉 fringe가 나타나며 이 한 줄 한 줄이 일정한 LOS 변위 양을 뜻한다.", en: "InSAR results show repeating red-blue-green-yellow stripes, i.e. fringes, where each single stripe denotes a fixed amount of LOS displacement." },
        { ko: "Sentinel-1(λ=5.6cm)에서 1 fringe는 약 2.8cm(=λ/2), 10 fringe는 약 28cm에 해당하고, 수십~수백 개는 지진급 단층 이동을 가리킨다.", en: "On Sentinel-1 (λ=5.6cm) 1 fringe equals about 2.8cm (=λ/2), 10 fringes about 28cm, and tens to hundreds indicate earthquake-scale fault motion." },
        { ko: "fringe가 많을수록 큰 변위이며, 줄 간격이 좁아질수록 기울기가 큰 deformation을 의미한다.", en: "More fringes mean larger displacement, and narrower stripe spacing means deformation with a steeper gradient." }
      ],
      diagram: [
        {
          kind: "plot",
          caption: { ko: "위상은 −π~π로 반복 wrap돼 줄무늬(fringe)가 된다 — 한 줄(톱니 한 주기) = λ/2 ≈ 2.8cm LOS 변위", en: "Phase wraps repeatedly to −π~π, forming fringes — one stripe (one sawtooth period) = λ/2 ≈ 2.8cm LOS" },
          xLabel: { ko: "거리/위치", en: "distance" },
          yLabel: { ko: "위상", en: "phase" },
          series: [{ label: { ko: "wrap된 위상", en: "wrapped phase" }, curve: "wrap", tone: "accent" }]
        },
        {
        kind: "compare",
        caption: { ko: "fringe 줄 수와 LOS 변위 (Sentinel-1, λ=5.6cm)", en: "Fringe count vs LOS displacement (Sentinel-1, λ=5.6cm)" },
        headers: [
          { ko: "", en: "" },
          { ko: "줄 수", en: "Fringe count" },
          { ko: "LOS 변위", en: "LOS displacement" }
        ],
        rows: [
          [ { ko: "한 줄", en: "One fringe" }, { ko: "1 fringe", en: "1 fringe" }, { ko: "~2.8cm (= λ/2)", en: "~2.8cm (= λ/2)" } ],
          [ { ko: "열 줄", en: "Ten fringes" }, { ko: "10 fringe", en: "10 fringes" }, { ko: "~28cm", en: "~28cm" } ],
          [ { ko: "지진급", en: "Earthquake-scale" }, { ko: "수십~수백", en: "Tens to hundreds" }, { ko: "단층 이동급", en: "Fault-motion scale" } ]
        ]
        }
      ]
    },
    {
      heading: { ko: "LOS 제약 — ASC + DESC 결합", en: "The LOS constraint — combining ASC + DESC" },
      bullets: [
        { ko: "SAR은 위성 시선 방향(Line Of Sight, LOS)의 이동만 측정하므로 완전한 수평 이동은 잘 보이지 않는다.", en: "SAR measures only motion along the satellite line-of-sight (LOS), so purely horizontal motion is barely visible." },
        { ko: "그래서 북동에서 비스듬히 보는 Ascending과 북서에서 비스듬히 보는 Descending 두 궤도의 LOS를 각각 얻는다.", en: "So one obtains the LOS from two orbits: Ascending, which looks obliquely from the northeast, and Descending, which looks obliquely from the northwest." },
        { ko: "두 LOS를 기하 분해하면 동서 성분과 수직 성분으로 나눌 수 있어, 실무에서는 ASC와 DESC를 둘 다 처리한다.", en: "Geometrically decomposing the two LOS lets one split the motion into east-west and vertical components, so in practice both ASC and DESC are processed." }
      ],
      diagram: {
        kind: "branch",
        caption: { ko: "두 궤도의 LOS를 기하 분해해 동서·수직 성분으로", en: "Decomposing two-orbit LOS into east-west and vertical components" },
        root: { icon: "🛰", label: { ko: "기하 분해", en: "Geometric decomposition" }, sub: { ko: "ASC LOS + DESC LOS", en: "ASC LOS + DESC LOS" }, tone: "accent" },
        children: [
          { label: { ko: "Ascending", en: "Ascending" }, sub: { ko: "북동에서 비스듬히 → LOS 1", en: "Oblique from NE → LOS 1" }, tone: 2 },
          { label: { ko: "Descending", en: "Descending" }, sub: { ko: "북서에서 비스듬히 → LOS 2", en: "Oblique from NW → LOS 2" }, tone: 3 },
          { label: { ko: "동서 성분", en: "East-west component" }, sub: { ko: "수평 이동 복원", en: "Recovers horizontal motion" }, tone: 4 },
          { label: { ko: "수직 성분", en: "Vertical component" }, sub: { ko: "융기·침하 복원", en: "Recovers uplift/subsidence" }, tone: 5 }
        ]
      }
    },
    {
      heading: { ko: "파이프라인 — 위상차에서 변위까지", en: "The pipeline — from phase difference to displacement" },
      bullets: [
        { ko: "Coregistration이 두 SLC의 화소를 정렬하면 Interferogram이 −π~π로 wrap된 위상차를 산출한다.", en: "Coregistration aligns the pixels of the two SLCs, then the interferogram produces a phase difference wrapped to −π~π." },
        { ko: "Coherence는 결과의 신뢰도를 나타내는 QA 지표이고, SNAPHU는 wrap된 위상을 unwrap된 연속 위상으로 펼친다.", en: "Coherence is a QA metric indicating result reliability, and SNAPHU unwraps the wrapped phase into a continuous unwrapped phase." },
        { ko: "마지막으로 Phase → Displacement 단계가 Δφ를 ΔR로 환산해 LOS 변위 결과를 만든다.", en: "Finally the Phase → Displacement step converts Δφ into ΔR to produce the LOS displacement result." }
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "SLC 2장에서 LOS 변위까지의 처리 흐름", en: "Processing flow from two SLCs to LOS displacement" },
        nodes: [
          { icon: "📦", label: { ko: "SLC 2장", en: "Two SLCs" }, sub: { ko: "Coregistration 정렬", en: "Coregistration alignment" }, tone: "muted" },
          { label: { ko: "Interferogram", en: "Interferogram" }, sub: { ko: "위상차 (wrapped −π~π)", en: "phase diff (wrapped −π~π)" }, tone: 2 },
          { icon: "🧩", label: { ko: "SNAPHU", en: "SNAPHU" }, sub: { ko: "Phase Unwrap", en: "phase unwrap" }, tone: "accent" },
          { icon: "🌍", label: { ko: "LOS 변위", en: "LOS displacement" }, sub: { ko: "Δφ → ΔR · ASC+DESC 분해", en: "Δφ → ΔR · ASC+DESC decomposition" }, tone: 5 }
        ]
      }
    }
  ],
  pitfall: {
    ko: "LOS 제약은 실무 절대 함정이다 — 수평 이동만 있는 strike-slip 지진은 ASC 단독으로 거의 안 보이므로 ASC+DESC 결합이 필수다. 또한 fringe가 많다고 항상 진짜 변위는 아니다 — 대기 영향(APS)이나 unwrap error가 fringe처럼 보일 수 있어 반드시 QA Metrics(특히 coherence)와 짝으로 해석해야 한다.",
    en: "The LOS constraint is an absolute practical trap — a strike-slip earthquake with only horizontal motion is nearly invisible from ASC alone, so combining ASC+DESC is essential. Also, more fringes are not always real displacement — atmospheric effects (APS) or unwrap errors can masquerade as fringes, so results must always be read paired with QA metrics, especially coherence."
  }
};
