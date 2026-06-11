import type { TopicDetail } from "../../types";

export const speckleCoherence: TopicDetail = {
  tldr: {
    ko: "Speckle은 SAR 한 픽셀(resolution cell) 안 수십~수백 산란체의 반사파가 서로 간섭해 생기는 곱셈성 노이즈로, 균일한 지면도 밝고 어두운 점무늬로 보이게 만든다. Coherence는 두 SAR 영상이 같은 산란 특성을 얼마나 유지했는지를 0~1로 잰 값인데 한 픽셀로는 통계량이 부족해 주변 window(예: 5×5)로 추정하며, 그래서 「Coherence Estimation」이라 부른다. 멀티룩(예: 3×1→9×3)은 픽셀 수를 늘려 coherence를 안정화·상승시키지만 해상도와 trade-off라 공짜가 아니다. SNAP coherence 맵은 변위 맵이 아니라 신뢰도 맵이라, SBAS·SNAPHU 결과가 이상하면 가장 먼저 coherence 맵부터 본다.",
    en: "Speckle is multiplicative noise that arises when the reflected waves of dozens to hundreds of scatterers inside one SAR pixel (resolution cell) interfere with each other, making even uniform ground look like a salt-and-pepper texture of bright and dark points. Coherence measures, on a 0–1 scale, how well two SAR images preserved the same scattering characteristics; it cannot be computed from a single pixel due to insufficient statistics, so it is estimated over a surrounding window (e.g. 5×5), which is why it is called 'Coherence Estimation'. Multilooking (e.g. 3×1 to 9×3) adds more pixels to stabilize and raise coherence, but it trades off against resolution, so it is not free. The SNAP coherence map is not a displacement map but a reliability map, so when SBAS or SNAPHU results look wrong, the coherence map is the very first thing to check."
  },
  sections: [
    {
      heading: { ko: "Speckle — SAR 고유의 곱셈성 노이즈", en: "Speckle — SAR's intrinsic multiplicative noise" },
      bullets: [
        { ko: "SAR는 전파를 쏘고 메아리를 받는 능동 센서라, 한 resolution cell 안 돌·흙·잎·풀 등 수십~수백 개 산란체의 반사파가 벡터 합산돼 한 픽셀 값이 된다.", en: "SAR is an active sensor that emits radio waves and receives their echoes, so the reflected waves of dozens to hundreds of scatterers (rock, soil, leaves, grass) inside one resolution cell are vector-summed into a single pixel value." },
        { ko: "위상이 같으면 보강간섭으로 밝게, 위상이 반대면 상쇄간섭으로 어둡게 나와, 실제 반사도가 균일해도 SLC에서는 점무늬로 보일 수 있다.", en: "When phases align they constructively interfere and appear bright, when opposite they destructively interfere and appear dark, so even uniform reflectivity can show up in the SLC as speckle." },
        { ko: "가산 노이즈와 달리 신호 세기에 비례하는 곱셈성이라, 저감은 멀티룩이나 Goldstein filter로 한다.", en: "Unlike additive noise it is multiplicative, scaling with signal strength, so it is reduced with multilooking or a Goldstein filter." },
        { ko: "InSAR에서는 Master/Slave 픽셀값 차이가 진짜 변화인지 speckle인지 구분이 어려워, interferogram이 지저분하면 대부분 speckle 영향이다.", en: "In InSAR it is hard to tell whether a Master/Slave pixel-value difference is real change or speckle, so when an interferogram looks noisy it is usually speckle." }
      ],
      diagram: {
        kind: "flow",
        dir: "col",
        caption: { ko: "한 픽셀 안 산란체 합산이 점무늬를 만드는 과정", en: "How summing scatterers inside one pixel produces speckle" },
        nodes: [
          { icon: "✨", label: { ko: "SAR 전파 → 한 픽셀", en: "SAR wave → one pixel" }, tone: "accent" },
          { label: { ko: "픽셀 내 수많은 산란체", en: "many scatterers in the pixel" }, sub: { ko: "돌·흙·잎·풀", en: "rock, soil, leaves, grass" }, tone: 1 },
          { label: { ko: "반사파 벡터 합산", en: "vector sum of reflected waves" }, tone: 2 },
          { label: { ko: "보강간섭 밝게 / 상쇄간섭 어둡게", en: "constructive = bright / destructive = dark" }, tone: 3 },
          { label: { ko: "균일 지면도 점무늬로 보임", en: "uniform ground looks speckled" }, tone: "muted" }
        ]
      }
    },
    {
      heading: { ko: "Coherence — 두 영상의 유사도(0~1)와 추정", en: "Coherence — similarity of two images (0–1) and estimation" },
      bullets: [
        { ko: "Coherence는 두 시점(Master/Slave)이 같은 지역의 산란 특성을 얼마나 유지했는지를 나타내며, 동일하면 1.0, 조금 다르면 0.5, 완전히 다르면 0.0이다.", en: "Coherence expresses how well two acquisitions (Master/Slave) preserved the same scattering characteristics for a region: identical is 1.0, slightly different is 0.5, completely different is 0.0." },
        { ko: "정의식의 분자는 두 영상이 얼마나 비슷한가를, 분모는 정규화를 담당해 값이 0~1 사이에 떨어진다.", en: "In the defining formula the numerator captures how similar the two images are and the denominator handles normalization, so the value falls between 0 and 1." },
        { ko: "핵심은 한 픽셀만으로는 통계량이 부족해 coherence를 계산할 수 없다는 점이라, 주변 window(예: 5×5 = 25픽셀)로 평균해 추정하며 그래서 「Coherence Estimation」이다.", en: "The key point is that a single pixel lacks the statistics to compute coherence, so it is averaged over a surrounding window (e.g. 5×5 = 25 pixels) to be estimated — hence 'Coherence Estimation'." }
      ],
      diagram: {
        kind: "formula",
        expr: "\\gamma = \\dfrac{\\left|\\langle M S^{*}\\rangle\\right|}{\\sqrt{\\langle |M|^{2}\\rangle\\,\\langle |S|^{2}\\rangle}}",
        caption: { ko: "Coherence 정의 — 분자는 유사도, 분모는 정규화", en: "Coherence definition — numerator is similarity, denominator is normalization" },
        legend: [
          { sym: "\\gamma", desc: { ko: "coherence 값 (0~1)", en: "coherence value (0–1)" } },
          { sym: "M,\\ S", desc: { ko: "Master·Slave SLC의 복소 픽셀값", en: "complex pixel values of the Master and Slave SLC" } },
          { sym: "\\langle\\,\\cdot\\,\\rangle", desc: { ko: "window 내 평균(추정에 필요한 통계량)", en: "average over the window (the statistics needed)" } }
        ]
      }
    },
    {
      heading: { ko: "멀티룩이 coherence를 올리는 이유", en: "Why multilooking raises coherence" },
      bullets: [
        { ko: "추정이 window 픽셀 수에 의존하므로, 멀티룩으로 픽셀을 더 모으면 추정이 안정되고 coherence가 오른다.", en: "Because the estimate depends on the number of pixels in the window, gathering more pixels via multilooking stabilizes the estimate and raises coherence." },
        { ko: "산림 coherence 예로 3×1은 픽셀이 적어 추정이 불안정해 ~0.2, 9×3은 픽셀이 많아 추정이 안정돼 ~0.45가 된다.", en: "For forest coherence as an example, 3×1 has few pixels so the estimate is unstable at ~0.2, while 9×3 has many pixels so the estimate is stable at ~0.45." },
        { ko: "이것이 r6 10m에서 3×1을 9×3으로 후퇴시켜 unwrap을 회복시킨 1차 원리지만, 해상도와 trade-off라 공짜가 아니다.", en: "This is the first principle behind backing off 3×1 to 9×3 in r6 10m to recover unwrapping, but it trades off against resolution and so is not free." }
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "멀티룩에 따른 추정 안정성과 산림 coherence", en: "Estimate stability and forest coherence by multilook" },
        headers: [
          { ko: "", en: "" },
          { ko: "3×1", en: "3×1" },
          { ko: "9×3", en: "9×3" }
        ],
        rows: [
          [ { ko: "픽셀 수", en: "pixel count" }, { ko: "적음", en: "few" }, { ko: "많음", en: "many" } ],
          [ { ko: "추정", en: "estimate" }, { ko: "불안정", en: "unstable" }, { ko: "안정", en: "stable" } ],
          [ { ko: "산림 coherence 예", en: "forest coherence example" }, { ko: "~0.2", en: "~0.2" }, { ko: "~0.45", en: "~0.45" } ]
        ]
      }
    },
    {
      heading: { ko: "Coherence 맵 읽기 — 변위가 아니라 신뢰도", en: "Reading the coherence map — reliability, not displacement" },
      bullets: [
        { ko: "SNAP에서 매일 보는 그 맵은 변위 맵이 아니라 신뢰도 맵이라, 흰색(0.8~1.0)은 신뢰 가능, 회색(0.4~0.7)은 애매, 검정(0~0.3)은 거의 신뢰 불가다.", en: "The map seen daily in SNAP is not a displacement map but a reliability map: white (0.8–1.0) is trustworthy, gray (0.4–0.7) is ambiguous, black (0–0.3) is almost untrustworthy." },
        { ko: "실무에선 보통 coh > 0.3 또는 > 0.4 마스크를 쓴다.", en: "In practice a coh > 0.3 or > 0.4 mask is typically used." },
        { ko: "처리 순서가 Interferogram → Coherence → Goldstein → SNAPHU인 이유는 SNAPHU가 coherence로 어디 위상을 믿고 어디는 버릴지 판단하기 때문이라, SBAS 결과가 이상하면 SNAPHU가 아니라 입력 coherence 맵부터 봐야 한다.", en: "The processing order Interferogram → Coherence → Goldstein → SNAPHU exists because SNAPHU uses coherence to decide which phases to trust and which to discard, so when SBAS results look wrong you should check the input coherence map first, not SNAPHU." }
      ]
    }
  ],
  pitfall: {
    ko: "coherence 맵을 변위 맵으로 오해하지 말 것 — 흰색은 「변위 큼」이 아니라 「신뢰 높음」이다. 또한 멀티룩↑ → coherence↑이지만 해상도↓라 공짜가 아니며, 도심 고해상이 필요하면 멀티룩 대신 PSI로 도구를 바꾸는 게 정답이다. 한편 coherence 자체가 두 영상 speckle의 상관성에서 나오므로 speckle은 노이즈이면서 신호의 원천이라는 양면성을 가진다.",
    en: "Do not mistake the coherence map for a displacement map — white means 'high reliability', not 'large displacement'. Also, higher multilook raises coherence but lowers resolution, so it is not free; when urban high resolution is needed, switching tools from multilooking to PSI is the right answer. Meanwhile, since coherence itself arises from the correlation of speckle between the two images, speckle is two-sided: it is noise yet also the source of the signal."
  }
};
