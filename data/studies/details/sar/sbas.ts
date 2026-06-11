import type { TopicDetail } from "../../types";

export const sbas: TopicDetail = {
  tldr: {
    ko: "SBAS(Small Baseline Subset)는 수직기선(B⊥)과 시간차(ΔT)가 작은 페어만 수십~수백 개 연결한 네트워크를 시계열 역산해 지표의 누적 변위(mm)와 연간 변위율(mm/yr)을 산출하는 InSAR 기법이다. 단일 페어 DInSAR가 대기 위상(APS) 노이즈에 mm 스케일 신호를 잃는 반면, SBAS는 시간 평균으로 APS를 완화하고 산림·평지 같은 distributed scatterer까지 커버해 도시 지반 침하 모니터링의 실전 표준이 된다. 핵심 관문은 안정 지점에 고정한 reference point 보정으로 페어별 ±37mm APS bias를 상쇄하는 것과 unwrap error를 식별하는 것이며, 신뢰할 수 있는 velocity는 1년+ 스택과 ERA5 대기 보정 뒤에야 얻어진다.",
    en: "SBAS (Small Baseline Subset) is an InSAR technique that inverts a network of tens-to-hundreds of pairs — each with small perpendicular baseline (B⊥) and short temporal separation (ΔT) — into cumulative surface displacement (mm) and an annual velocity field (mm/yr). Where single-pair DInSAR loses mm-scale signal under atmospheric phase (APS) noise, SBAS averages APS down over time and covers distributed scatterers such as forest and flatland, making it the practical standard for urban subsidence monitoring. The two decisive gates are reference-point correction — pinning a stable site to zero to cancel the per-pair APS bias of up to ±37mm — and unwrap-error identification; trustworthy velocity only emerges after a one-year-plus stack and ERA5 atmospheric correction."
  },
  sections: [
    {
      heading: { ko: "SBAS의 자리 — DInSAR·PS-InSAR와의 비교", en: "Where SBAS fits — versus DInSAR and PS-InSAR" },
      bullets: [
        { ko: "단일 DInSAR는 페어 1개로 지진·산사태 같은 이벤트 전후의 cm급 변위 스냅샷에 적합하지만, 느린 도시 지반 침하의 mm/yr 신호는 잡지 못한다.", en: "Single-pair DInSAR uses one pair and suits cm-scale before/after snapshots of events like earthquakes or landslides, but it cannot resolve the mm/yr signal of slow urban subsidence." },
        { ko: "SBAS는 B⊥<100m·ΔT 작은 페어를 수십 개 연결해 distributed scatterer(산림·평지 포함)의 시계열을 만들고, 평균화로 mm/yr까지 감지하며 최소 15~20장을 요구한다.", en: "SBAS links tens of pairs with B⊥<100m and short ΔT to build time series over distributed scatterers (including forest and flatland), reaches mm/yr after averaging, and needs at least 15-20 scenes." },
        { ko: "산림·평지·도심이 혼재한 AOI는 전 영역을 커버하는 SBAS가 1차 선택이고, 도심의 고해상 점별 변위는 영구산란체를 쓰는 PS-InSAR가 정답이다.", en: "For a mixed forest/flatland/urban AOI, full-coverage SBAS is the first choice, while high-resolution point-wise displacement in dense urban areas is best handled by PS-InSAR using permanent scatterers." }
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "DInSAR · SBAS · PS-InSAR 핵심 차이", en: "Key differences among DInSAR, SBAS, and PS-InSAR" },
        headers: [
          { ko: "", en: "" },
          { ko: "단일 DInSAR", en: "Single DInSAR" },
          { ko: "SBAS", en: "SBAS" },
          { ko: "PS-InSAR", en: "PS-InSAR" }
        ],
        rows: [
          [ { ko: "페어 수", en: "Pairs" }, { ko: "1", en: "1" }, { ko: "수십", en: "Tens" }, { ko: "수십", en: "Tens" } ],
          [ { ko: "타깃", en: "Target" }, { ko: "이벤트 전후(cm)", en: "Before/after event (cm)" }, { ko: "DS 시계열", en: "DS time series" }, { ko: "점 산란체 구조물", en: "Point-scatterer structures" } ],
          [ { ko: "감지 한계", en: "Detection limit" }, { ko: "cm 급", en: "cm level" }, { ko: "mm/yr(평균화)", en: "mm/yr (averaged)" }, { ko: "sub-mm/yr", en: "sub-mm/yr" } ],
          [ { ko: "최소 장수", en: "Min scenes" }, { ko: "2", en: "2" }, { ko: "15~20", en: "15-20" }, { ko: "25~30", en: "25-30" } ]
        ]
      }
    },
    {
      heading: { ko: "파이프라인과 페어 네트워크 설계", en: "Pipeline and pair-network design" },
      bullets: [
        { ko: "SBAS는 코레지스터된 SLC 스택에서 짧은 기선 페어 네트워크를 만들고, 페어별 DInSAR를 거쳐 시계열 역산(MintPy WLS)으로 mm/yr 속도장과 시계열을 산출하는 구조다.", en: "SBAS builds a short-baseline pair network from a coregistered SLC stack, runs per-pair DInSAR, then inverts the time series (MintPy WLS) into an mm/yr velocity field and time series." },
        { ko: "어떤 페어끼리 연결할지가 전체 품질을 지배하며, B⊥<100·ΔT<48의 Small Baseline 전략(20장 기준 약 40~60페어)이 균형과 중복을 확보한 SBAS 표준이다.", en: "Which pairs to connect dominates overall quality; the Small Baseline strategy (B⊥<100, ΔT<48; roughly 40-60 pairs for 20 scenes) is the SBAS standard, securing balance and redundancy." },
        { ko: "연결성 원칙상 모든 영상이 최소 1개 페어에 연결돼 disconnected island가 없어야 한다.", en: "By the connectivity rule every scene must join at least one pair with no disconnected islands." }
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "SBAS 시계열 역산 흐름", en: "SBAS time-series inversion flow" },
        nodes: [
          { icon: "🛰️", label: { ko: "다중 코레지스터 SLC", en: "Coregistered SLC stack" }, sub: { ko: "N장의 영상", en: "N scenes" }, tone: "muted" },
          { icon: "🔗", label: { ko: "짧은 기선 페어 네트워크", en: "Short-baseline pair network" }, sub: { ko: "B⊥·ΔT 임계로 수십~수백 페어", en: "tens-to-hundreds of pairs" }, tone: 1 },
          { icon: "🧮", label: { ko: "시계열 역산", en: "Time-series inversion" }, sub: { ko: "MintPy WLS + reference point", en: "MintPy WLS + reference point" }, tone: 2 },
          { icon: "📈", label: { ko: "mm/yr 속도장 + 시계열", en: "mm/yr velocity + time series" }, tone: "accent" }
        ]
      }
    },
    {
      heading: { ko: "Reference Point 보정 — ±37mm APS를 상쇄", en: "Reference-point correction — canceling ±37mm APS" },
      bullets: [
        { ko: "POC 9페어에서 페어별 APS 전역 평균이 ±37mm까지 다르게 나오는 것이 관찰됐고, 이 날짜별 대기 bias는 AOI 내부의 mm급 상대 변위 신호보다 크다.", en: "In the 9-pair POC the per-pair global APS mean varied by up to ±37mm, and this date-by-date atmospheric bias is larger than the mm-scale relative displacement signal inside the AOI." },
        { ko: "해결책은 구조적으로 안정하다고 믿는 지점(광교산 시루봉 582m 산림)의 픽셀을 모든 페어에서 0으로 강제하고, 나머지 픽셀을 그 reference 대비 상대값으로 해석하는 것이다.", en: "The fix pins the pixel of a site believed structurally stable (the 582m forest at Sirubong on Gwanggyosan) to zero in every pair, and reads all other pixels as values relative to that reference." },
        { ko: "reference point는 「가장 안정한 곳」이 아니라 「안정하다고 믿는 곳」일 뿐이라, 단일 픽셀보다 AOI 공간 평균을 reference로 잡는 게 더 robust하다.", en: "A reference point is only a site believed stable, not provably the most stable one, so using an AOI spatial average is more robust than a single pixel." }
      ],
      diagram: {
        kind: "formula",
        expr: "\\varphi_{\\mathrm{corr}}(x,t) = \\varphi(x,t) - \\varphi(x_{\\mathrm{ref}},t)",
        caption: { ko: "각 페어에서 reference 픽셀 값을 빼 전역 APS bias 제거", en: "Subtracting the reference-pixel value per pair removes the global APS bias" },
        legend: [
          { sym: "\\varphi(x,t)", desc: { ko: "날짜 t, 픽셀 x의 원본 위상", en: "raw phase at pixel x and date t" } },
          { sym: "x_{\\mathrm{ref}}", desc: { ko: "안정 지점 픽셀 — 모든 페어에서 0으로 고정", en: "stable reference pixel, forced to zero in every pair" } },
          { sym: "\\varphi_{\\mathrm{corr}}", desc: { ko: "reference 대비 상대 위상", en: "phase relative to the reference" } }
        ]
      }
    },
    {
      heading: { ko: "신뢰 구간과 함정", en: "Confidence and traps" },
      bullets: [
        { ko: "62일 POC(9페어)는 누적 ±5mm trend까지만 신뢰 가능하고, 62일을 365일로 외삽하면 형제봉 +89mm/yr 같은 비현실적 velocity가 튀는데 이는 unwrap error와 APS가 짧은 슬로프로 잡힌 결과다.", en: "The 62-day POC (9 pairs) is trustworthy only to a cumulative ±5mm trend; extrapolating 62 days to 365 produces unrealistic velocity such as +89mm/yr at Hyeongjebong, an artifact of unwrap error and APS read as a short slope." },
        { ko: "PyAPS+ERA5 보정 한 단계로 POC9의 std가 35.31에서 9.61 mm/yr로 약 3.7배 줄었고, comp0(82페어·1년+)에서 std 2.51 mm/yr로 노이즈 floor에 진입했다.", en: "A single PyAPS+ERA5 correction cut POC9 std from 35.31 to 9.61 mm/yr (~3.7x), and comp0 (82 pairs, one-year-plus) reached std 2.51 mm/yr, entering the noise floor." },
        { ko: "MintPy의 coherence-weighted least squares가 bad pair를 자동 down-weight해 페어를 강제 drop해도 velocity가 거의 identical하므로, 페어 품질 의심으로 별도 디버깅 가지를 만들 필요가 없다.", en: "MintPy coherence-weighted least squares auto-down-weights bad pairs — forcing pairs to drop leaves velocity nearly identical — so there is no need to branch debugging on suspected pair quality." }
      ]
    }
  ],
  pitfall: {
    ko: "짧은 stack(62일 POC)에서 62일을 365일로 외삽한 velocity(mm/yr)를 그대로 믿으면 형제봉 +89mm/yr처럼 안정 지형에서도 극단값이 튄다 — 이는 거의 전부 unwrap error와 대기 위상 잔차, 페어 수 부족 탓이다. velocity 숫자는 1년+ 스택과 ERA5 대기 보정·reference point 보정을 거친 뒤에만 신뢰하고, 그 전엔 누적 변위 trend만 해석하며 공공기관 보고에 쓰지 말 것.",
    en: "On a short stack (the 62-day POC), trusting a velocity (mm/yr) extrapolated from 62 to 365 days yields extreme values even over stable terrain — like +89mm/yr at Hyeongjebong — almost entirely caused by unwrap error, atmospheric-phase residual, and too few pairs. Trust velocity numbers only after a one-year-plus stack with ERA5 atmospheric correction and reference-point correction; before that, read only the cumulative displacement trend and do not use them for official agency reporting."
  }
};
