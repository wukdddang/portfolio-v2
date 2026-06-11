import type { TopicDetail } from "../../types";

export const resolution: TopicDetail = {
  tldr: {
    ko: "SAR 픽셀의 두 방향은 결정 원리가 완전히 다르다. Range(앞뒤 구분)는 펄스 대역폭이 결정하여 ΔR=c/2B로 표현되고, Azimuth(옆 구분)는 합성개구가 결정하여 사실상 안테나 길이에 묶인다. Sentinel-1 IW는 Range ~5m가 Azimuth ~20m보다 훨씬 좋아 픽셀이 5m×20m 직사각형인데, 이는 TOPS 모드로 250km 광역을 얻는 대가로 Azimuth를 희생했기 때문이다(SM 모드는 ~5m×5m). 이 비대칭 때문에 InSAR speckle 저감용 Multilook도 보통 Range 방향만 더 평균하는 3×1로 건다.",
    en: "The two directions of a SAR pixel are governed by completely different principles. Range (front-back separation) is set by pulse bandwidth, expressed as ΔR=c/2B, while Azimuth (side separation) is set by the synthetic aperture and is effectively tied to the antenna length. On Sentinel-1 IW, Range (~5m) is far better than Azimuth (~20m), giving a rectangular 5m×20m pixel; this is because TOPS mode trades away Azimuth resolution to image a 250km-wide swath (SM mode is ~5m×5m). Because of this asymmetry, InSAR multilook for speckle reduction is usually applied as 3×1, averaging mainly in the Range direction."
  },
  sections: [
    {
      heading: { ko: "두 방향의 정의", en: "Defining the two directions" },
      bullets: [
        { ko: "Range 해상도는 레이더 시선 방향으로 얼마나 가까운 두 물체를 분리할 수 있는지를 말한다(앞뒤 구분).", en: "Range resolution measures how close two objects can be along the radar line-of-sight while still being separated (front-back separation)." },
        { ko: "Azimuth 해상도는 위성 진행 방향, 즉 옆 방향으로 두 물체를 얼마나 잘 분리하는지를 말한다.", en: "Azimuth resolution measures how well two objects are separated along the satellite's flight direction, that is, the sideways direction." }
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "SAR 픽셀의 두 축", en: "The two axes of a SAR pixel" },
        nodes: [
          { icon: "↕️", label: { ko: "Azimuth", en: "Azimuth" }, sub: { ko: "위성 진행방향, 옆 구분", en: "Flight direction, side separation" }, tone: "muted" },
          { icon: "↔️", label: { ko: "Range", en: "Range" }, sub: { ko: "레이더 시선방향, 앞뒤 구분", en: "Line-of-sight, front-back separation" }, tone: "accent" }
        ]
      }
    },
    {
      heading: { ko: "Range 해상도 — 대역폭이 결정", en: "Range resolution — set by bandwidth" },
      bullets: [
        { ko: "박쥐 초음파처럼 두 물체의 메아리가 거의 동시면 하나로, 시간차가 나면 둘로 들린다. SAR은 가까운 물체는 빨리, 먼 물체는 늦게 돌아오는 시간차로 물체를 분리한다.", en: "Like a bat's ultrasound, if two echoes arrive almost simultaneously they sound as one, and if there is a time gap they sound as two. SAR separates objects by this time difference, where near objects return early and far objects return late." },
        { ko: "이 시간차를 얼마나 잘게 쪼개느냐가 대역폭(Bandwidth)에 달려 있어, 대역폭이 넓을수록 펄스가 짧아져 가까운 두 물체를 분리할 수 있다.", en: "How finely this time gap can be resolved depends on bandwidth, so wider bandwidth yields shorter pulses and lets closer objects be separated." },
        { ko: "Sentinel-1의 대역폭 약 56MHz는 이론상 ~2.7m 해상도에 해당하며, 짧은 펄스를 실제로 만드는 방법은 Chirp·Range Compression이 담당한다.", en: "Sentinel-1's roughly 56MHz bandwidth corresponds to a theoretical ~2.7m resolution, while the actual method of producing short pulses is handled by Chirp and range compression." }
      ],
      diagram: {
        kind: "formula",
        expr: "\\Delta R = \\dfrac{c}{2B}",
        caption: { ko: "Range 해상도는 대역폭에 반비례한다", en: "Range resolution is inversely proportional to bandwidth" },
        legend: [
          { sym: "\\Delta R", desc: { ko: "Range 방향 해상도", en: "Range-direction resolution" } },
          { sym: "c", desc: { ko: "빛의 속도", en: "Speed of light" } },
          { sym: "B", desc: { ko: "펄스 대역폭", en: "Pulse bandwidth" } }
        ]
      }
    },
    {
      heading: { ko: "Azimuth 해상도 — 합성개구가 결정", en: "Azimuth resolution — set by the synthetic aperture" },
      bullets: [
        { ko: "작은 안테나는 빔이 넓게 퍼져 옆 방향을 구분하지 못하므로, 12.3m뿐인 Sentinel-1 안테나는 이동하며 같은 표적을 수백~수천 번 관측해 위상을 맞춰 합산하는 합성개구로 가상의 수 km 안테나를 만든다.", en: "A small antenna spreads its beam too widely to separate the side direction, so Sentinel-1's mere 12.3m antenna observes the same target hundreds to thousands of times while moving and phase-coherently sums them, building a virtual antenna several km long via the synthetic aperture." },
        { ko: "그 결과 Azimuth 해상도는 사실상 실제 안테나 길이에 묶이며, 근사적으로 Δ_az ≈ L/2 (L은 실제 안테나 길이)로 표현된다.", en: "As a result, Azimuth resolution is effectively tied to the real antenna length, approximated as Δ_az ≈ L/2 (L being the real antenna length)." },
        { ko: "L/2 ≈ 6m는 Stripmap(SM) 모드의 이론 근사일 뿐이고, IW는 TOPS 모드라서 250km 광역을 위해 빔을 azimuth로 스윙(전자적 스캔)하는 대가로 Azimuth 해상도를 ~20m로 희생한다.", en: "L/2 ≈ 6m is only the theoretical approximation for Stripmap (SM) mode; IW uses TOPS mode, which electronically swings the beam in azimuth to image a 250km-wide swath and thereby sacrifices Azimuth resolution down to ~20m." },
        { ko: "즉 실제 해상도는 안테나 길이만으로 정해지지 않고, 안테나·TOPS 스캔·프로세싱·운영모드가 합쳐져 IW에서 ~20m로 나온다.", en: "In other words, the actual resolution is not set by antenna length alone but by antenna, TOPS scanning, processing, and operating mode combined, yielding ~20m for IW." }
      ]
    },
    {
      heading: { ko: "위성·모드별 비교와 Multilook 함의", en: "Comparison across modes and multilook implications" },
      bullets: [
        { ko: "Sentinel-1 IW에서는 Range가 Azimuth보다 훨씬 좋다. Range는 Chirp·대역폭 덕에 좋고(56MHz → 실제 2~3m 가능, 제품에선 멀티룩·리샘플링·GRD로 ~5m), Azimuth는 고해상도보다 광역 250km를 우선한 TOPS 설계 탓에 나쁘다.", en: "On Sentinel-1 IW, Range is far better than Azimuth. Range is good thanks to chirp and bandwidth (56MHz allows an actual 2~3m, becoming ~5m in products after multilook, resampling, and GRD), while Azimuth is poor because the TOPS design prioritized a 250km-wide swath over high resolution." },
        { ko: "SNAP에서 SLC 픽셀이 직사각형으로 보이는 것은 Range 5m / Azimuth 20m의 정상적인 결과이므로 당황할 필요가 없다.", en: "Seeing a rectangular SLC pixel in SNAP is the normal result of Range 5m / Azimuth 20m, so there is no need to be alarmed." },
        { ko: "이미 Azimuth가 20m로 나쁜데 azimuth를 더 뭉개면 해상도가 과도하게 떨어지므로, InSAR speckle 저감용 Multilook은 보통 Range 방향만 더 평균하는 3×1로 건다.", en: "Since Azimuth is already poor at 20m, smearing it further would drop resolution excessively, so InSAR multilook for speckle reduction is usually applied as 3×1, averaging mainly in Range." }
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "Range vs Azimuth, 그리고 모드별 값", en: "Range vs Azimuth, and values by mode" },
        headers: [
          { ko: "", en: "" },
          { ko: "Range", en: "Range" },
          { ko: "Azimuth", en: "Azimuth" }
        ],
        rows: [
          [
            { ko: "무엇이 결정", en: "What it determines" },
            { ko: "앞뒤 구분", en: "Front-back separation" },
            { ko: "옆 방향 구분", en: "Side separation" }
          ],
          [
            { ko: "결정 요인", en: "Governing factor" },
            { ko: "펄스 대역폭 (ΔR=c/2B)", en: "Pulse bandwidth (ΔR=c/2B)" },
            { ko: "합성개구 (Δ_az≈L/2)", en: "Synthetic aperture (Δ_az≈L/2)" }
          ],
          [
            { ko: "S1 IW 값", en: "S1 IW value" },
            { ko: "~5m", en: "~5m" },
            { ko: "~20m", en: "~20m" }
          ],
          [
            { ko: "S1 SM 값", en: "S1 SM value" },
            { ko: "~5m", en: "~5m" },
            { ko: "~5m", en: "~5m" }
          ]
        ]
      }
    }
  ],
  pitfall: {
    ko: "12.3m 안테나에 L/2 ≈ 6m 공식을 곧이곧대로 적용해 IW Azimuth가 6m일 거라 기대하면 안 된다. L/2는 Stripmap(SM) 모드의 이론 근사일 뿐이고, IW는 TOPS 모드라서 250km 광역을 얻는 대가로 빔을 azimuth로 스윙하며 해상도를 ~20m로 희생한다.",
    en: "Do not naively apply the L/2 ≈ 6m formula to the 12.3m antenna and expect IW Azimuth to be 6m. L/2 is only the theoretical approximation for Stripmap (SM) mode; IW uses TOPS mode, which swings the beam in azimuth to gain a 250km-wide swath and thereby sacrifices resolution to ~20m."
  }
};
