import type { TopicDetail } from "../../types";

export const dsSqueesar: TopicDetail = {
  tldr: {
    ko: "DS-InSAR는 PSI가 못 보는 식생·농지·산악의 분산산란체(Distributed Scatterer)를 통계적으로 묶어 변위를 뽑는 기법이고, PSI(점)와 DS(면)를 결합한 게 SqueeSAR다. 국토 ~70%가 산지·식생인 한국에서 PSI 단독은 도심에만 강하므로, Lumir 로드맵상 DInSAR→SBAS→PSI 다음 우선순위가 DS-InSAR다. 식생 관통은 결국 센서 밴드 문제라 NISAR L-band(λ≈24cm)가 C-band Sentinel-1의 산림 decorrelation을 메우지만, 2026-06 현재 데이터는 Pre-Calibration이라 실무 신뢰는 2026 Q4~2027로 전망된다.",
    en: "DS-InSAR statistically groups the Distributed Scatterers of vegetation, farmland, and mountains that PSI cannot see in order to extract displacement, and combining PSI (points) with DS (areas) yields SqueeSAR. Because roughly 70% of Korea is mountainous and vegetated, PSI alone is strong only in cities, so DS-InSAR is the next priority on the Lumir roadmap after DInSAR→SBAS→PSI. Canopy penetration is ultimately a sensor-band problem, so NISAR L-band (λ≈24cm) fills the forest decorrelation gap of C-band Sentinel-1; however, as of 2026-06 the data is still Pre-Calibration, so operational trust is projected for 2026 Q4~2027."
  },
  sections: [
    {
      heading: { ko: "PSI의 빈칸을 DS-InSAR가 메운다", en: "DS-InSAR fills the gap PSI leaves behind" },
      bullets: [
        { ko: "PSI(Persistent Scatterer)는 도심·인공구조물에서 강하지만, 산지·농지·식생에서는 PS 점이 희박해 성능이 급락한다.", en: "PSI (Persistent Scatterer) is strong on cities and man-made structures, but PS points are sparse over mountains, farmland, and vegetation, so performance collapses there." },
        { ko: "DS-InSAR(Distributed Scatterer)는 homogeneous 픽셀을 통계적으로 묶어 식생·농지·산악을 활용하므로 그 빈칸을 메운다.", en: "DS-InSAR (Distributed Scatterer) statistically groups homogeneous pixels to exploit vegetation, farmland, and mountains, thereby filling that gap." },
        { ko: "SqueeSAR는 PS(점)와 DS(면)를 결합한 기법으로, 한국의 산지 비율 ~70% 환경에서 강원도·산림·댐·산사태 모니터링에 적합하다.", en: "SqueeSAR combines PS (points) and DS (areas), making it suitable for monitoring Gangwon Province, forests, dams, and landslides in Korea where ~70% of the land is mountainous." }
      ],
      diagram: {
        kind: "branch",
        caption: { ko: "SqueeSAR = PS + DS 결합", en: "SqueeSAR = PS + DS combined" },
        root: { icon: "🛰️", label: { ko: "산란체", en: "Scatterer" }, tone: "accent" },
        children: [
          { label: { ko: "PSI (Persistent)", en: "PSI (Persistent)" }, sub: { ko: "도심·인공구조물 (점)", en: "Cities, structures (points)" }, tone: 3 },
          { label: { ko: "DS-InSAR (Distributed)", en: "DS-InSAR (Distributed)" }, sub: { ko: "식생·농지·산악 (면)", en: "Vegetation, farmland, mountains (areas)" }, tone: 5 },
          { label: { ko: "SqueeSAR = PS + DS", en: "SqueeSAR = PS + DS" }, sub: { ko: "둘을 합친 결합 기법", en: "technique combining both" }, tone: "accent" }
        ]
      }
    },
    {
      heading: { ko: "Lumir InSAR 확장 로드맵", en: "Lumir InSAR expansion roadmap" },
      bullets: [
        { ko: "현재 위치는 DInSAR·SBAS·PSI 구축 완료이며, 다음은 거의 확실하게 DS-InSAR, 그 다음이 SqueeSAR다.", en: "The current position is DInSAR, SBAS, and PSI all built; the next step is almost certainly DS-InSAR, followed by SqueeSAR." },
        { ko: "PolSAR·TomoSAR는 기술적으로 흥미롭지만 Sentinel-1 기반 상용 변위 확장 관점에선 우선순위가 낮다.", en: "PolSAR and TomoSAR are technically interesting, but they are low priority from the standpoint of Sentinel-1-based commercial displacement expansion." }
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "InSAR 확장 단계 — PSI(완주) 다음은 DS-InSAR", en: "InSAR expansion stages — after PSI (done) comes DS-InSAR" },
        nodes: [
          { label: { ko: "DInSAR", en: "DInSAR" }, tone: "muted" },
          { label: { ko: "SBAS", en: "SBAS" }, tone: "muted" },
          { label: { ko: "PSI", en: "PSI" }, sub: { ko: "현재 완주", en: "currently done" }, tone: 3 },
          { label: { ko: "DS-InSAR", en: "DS-InSAR" }, sub: { ko: "다음 우선순위", en: "next priority" }, tone: "accent" },
          { label: { ko: "SqueeSAR", en: "SqueeSAR" }, tone: "muted" }
        ]
      }
    },
    {
      heading: { ko: "왜 L-band인가 — NISAR", en: "Why L-band — NISAR" },
      bullets: [
        { ko: "식생 관통은 멀티룩이 아니라 센서 밴드의 문제다 — Sentinel-1 C-band(5.405 GHz · λ≈5.6cm)는 파장이 잎 크기와 비슷해 산림 coherence가 급락한다.", en: "Canopy penetration is a matter of sensor band, not multilooking — Sentinel-1 C-band (5.405 GHz, λ≈5.6cm) has a wavelength similar to leaf size, so forest coherence collapses." },
        { ko: "NISAR L-band(1.25 GHz · λ≈24cm)는 잎을 통과하고 줄기에서 반사해 산림 coherence를 유지하므로 산지 DS-InSAR가 가능해진다.", en: "NISAR L-band (1.25 GHz, λ≈24cm) passes through leaves and reflects off trunks, maintaining forest coherence and enabling DS-InSAR over mountains." },
        { ko: "NISAR의 진짜 가치는 정확도보다 L-band 자체로, 산지 70%인 한국에서 C-band coherence 붕괴의 구조적 해법이다.", en: "NISAR's true value is L-band itself rather than accuracy; it is a structural solution to C-band coherence collapse in Korea where 70% of the land is mountainous." }
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "C-band vs L-band — 산림 관통 비교", en: "C-band vs L-band — forest penetration" },
        headers: [
          { ko: "", en: "" },
          { ko: "Sentinel-1 C-band", en: "Sentinel-1 C-band" },
          { ko: "NISAR L-band", en: "NISAR L-band" }
        ],
        rows: [
          [ { ko: "주파수·파장", en: "Freq / wavelength" }, { ko: "5.405 GHz · λ≈5.6cm", en: "5.405 GHz · λ≈5.6cm" }, { ko: "1.25 GHz · λ≈24cm", en: "1.25 GHz · λ≈24cm" } ],
          [ { ko: "산림 거동", en: "Forest behavior" }, { ko: "잎 크기와 비슷 → coherence 급락", en: "~leaf size → coherence collapses" }, { ko: "잎 통과·줄기 반사 → coherence 유지", en: "passes leaves → coherence kept" } ],
          [ { ko: "산지 DS-InSAR", en: "Mountain DS-InSAR" }, { ko: "식생 무력", en: "ineffective over vegetation" }, { ko: "가능", en: "feasible" } ]
        ]
      }
    }
  ],
  pitfall: {
    ko: "NISAR의 진짜 가치는 정확도보다 L-band 자체이며, InSAR 관점의 진짜 관심사는 방사보정보다 Coregistration·Phase Stability·Geolocation·Ionosphere다 — 특히 ionospheric phase를 NISAR 팀이 아직 다듬는 중이라 mm급 장기 시계열은 2027 이후가 현실적이다. 지금 합리적 분기는 NISAR RSLC/GUNW 파서·HDF5 구조 분석·SNAP/MintPy 테스트까지만 진행하고 상용 변위 서비스는 보류하는 것이다.",
    en: "NISAR's true value is L-band itself rather than accuracy, and the real InSAR concern is not radiometric calibration but Coregistration, Phase Stability, Geolocation, and Ionosphere — since the NISAR team is still refining ionospheric phase in particular, mm-grade long-term time series is realistic only after 2027. The sensible split right now is to proceed only as far as NISAR RSLC/GUNW parsers, HDF5 structure analysis, and SNAP/MintPy testing, while holding off on a commercial displacement service."
  }
};
