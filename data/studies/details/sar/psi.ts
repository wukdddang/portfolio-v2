import type { TopicDetail } from "../../types";

export const psi: TopicDetail = {
  tldr: {
    ko: "PSInSAR(PSI)는 시간이 지나도 위상이 안정적인 영구산란체(Persistent Scatterer)만 점으로 골라 풀해상도로 mm/yr 변위를 뽑는 기법으로, 인접 픽셀을 멀티룩 평균하는 SBAS와는 정반대 철학이다. MiaplPy(ISCE2 stack 위에서 동작)로 죽전 도심 PSI를 끝까지 완주해 108,690점을 대시보드에 적재했다. 가장 값비싼 phase_linking 단계는 BLAS 스레드 오버서브스크립션을 잡아 5시간에서 6분으로(~15배) 줄였다.",
    en: "PSInSAR (PSI) is a technique that selects only Persistent Scatterers — points whose phase stays stable over time — and extracts mm/yr displacement at full resolution, the exact inverse philosophy of SBAS, which multilooks (averages) neighboring pixels. Running on MiaplPy (which operates atop an ISCE2 stack), the downtown Jukjeon PSI was carried end-to-end, ingesting 108,690 points into the dashboard. The most expensive phase_linking stage was cut from five hours to six minutes (~15x) by fixing BLAS thread over-subscription."
  },
  sections: [
    {
      heading: { ko: "PSI vs SBAS — 정반대 철학", en: "PSI vs SBAS — opposite philosophies" },
      bullets: [
        { ko: "둘 다 같은 coregistered SLC 스택에서 갈리는데, SBAS는 인접 픽셀을 멀티룩 평균해 면적 변위를 얻는 분산 산란체(Distributed Scatterer) 접근이다.", en: "Both diverge from the same coregistered SLC stack, but SBAS multilooks neighboring pixels for areal displacement — a Distributed Scatterer approach." },
        { ko: "PSI는 위상이 안정적인 점만 선별해 풀해상도를 유지하므로 건물·인공구조물처럼 도심에서 강하다.", en: "PSI selects only phase-stable points and keeps full resolution, so it excels in urban settings such as buildings and man-made structures." },
        { ko: "도심 정밀은 PSI, 광역 면적은 거친 SBAS가 정석이며, 매립지·수변 간척지도 PSI 영역이다 — 송도에서 PSI 29,929점 성공 vs SBAS는 temporal coherence 0.17로 적재 불가였다.", en: "Urban precision belongs to PSI and wide-area coverage to coarse SBAS; reclaimed land and waterfront fill are PSI territory too — at Songdo, PSI succeeded with 29,929 points while SBAS was unusable at temporal coherence 0.17." }
      ],
      diagram: [
        {
          kind: "network",
          style: "psi",
          caption: { ko: "PSI는 단일 마스터 스택 — 한 기준 영상에서 전체로 연결, 멀티룩 없이 위상 안정 점(PS)만 선별", en: "PSI uses a single-master stack — one reference linked to all, selecting only phase-stable points (PS) with no multilook" }
        },
        {
        kind: "compare",
        caption: { ko: "같은 스택에서 대상·해상도·철학이 갈린다", en: "From one stack: target, resolution, and philosophy diverge" },
        headers: [
          { ko: "", en: "" },
          { ko: "SBAS", en: "SBAS" },
          { ko: "PSI", en: "PSI" }
        ],
        rows: [
          [ { ko: "산란체", en: "Scatterer" }, { ko: "Distributed (멀티룩 평균)", en: "Distributed (multilook avg)" }, { ko: "Persistent (점 선별)", en: "Persistent (point selection)" } ],
          [ { ko: "해상도", en: "Resolution" }, { ko: "멀티룩만큼 희생 (10–55m)", en: "Sacrificed by multilook (10–55m)" }, { ko: "풀해상도 유지", en: "Full resolution kept" } ],
          [ { ko: "강한 지형", en: "Strong terrain" }, { ko: "면적·평지·(거칠게) 산지", en: "Areal, flatland, mountains" }, { ko: "도심·인공구조물", en: "Urban, man-made structures" } ]
        ]
        }
      ]
    },
    {
      heading: { ko: "MiaplPy 파이프라인", en: "The MiaplPy pipeline" },
      bullets: [
        { ko: "입력은 SBAS와 달리 멀티룩하지 않은 풀해상도 SLC이며, r6 도심 coregistration 결과(coreg_secondarys 87장)를 재사용했다.", en: "Unlike SBAS, the input is un-multilooked full-resolution SLC, reusing the r6 downtown coregistration result (87 coreg_secondarys)." },
        { ko: "merged의 SLC/geom이 VRT(가상)만 존재해, MiaplPy가 요구하는 물리 바이너리(.full)로 materialize하는 전처리가 필요했다(~74GB).", en: "The merged SLC/geom existed only as VRT (virtual), so a preprocessing step materialized them into the physical binaries (.full) MiaplPy requires (~74GB)." },
        { ko: "마지막 timeseries_correction에서 ERA5·demErr 보정 후 velocity로 변환하고 geocode한다.", en: "The final timeseries_correction applies ERA5/demErr corrections, converts to velocity, then geocodes." }
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "load_data부터 timeseries_correction까지 — phase_linking이 최대 비용", en: "From load_data to timeseries_correction — phase_linking is the costliest" },
        nodes: [
          { icon: "📥", label: { ko: "load_data", en: "load_data" }, sub: { ko: "AOI subset 크롭", en: "AOI subset crop" }, tone: "muted" },
          { icon: "🔗", label: { ko: "phase_linking", en: "phase_linking" }, sub: { ko: "최대 비용 단계", en: "costliest stage" }, tone: "accent" },
          { icon: "🧩", label: { ko: "ifgram·unwrap", en: "ifgram · unwrap" }, tone: 2 },
          { icon: "🔄", label: { ko: "invert_network", en: "invert_network" }, tone: 4 },
          { icon: "🗺", label: { ko: "timeseries_correction", en: "timeseries_correction" }, sub: { ko: "ERA5·demErr → velocity → geocode", en: "ERA5/demErr → velocity → geocode" }, tone: 5 }
        ]
      }
    },
    {
      heading: { ko: "phase_linking 스레드 함정 — 5시간→6분", en: "phase_linking thread trap — 5h → 6min" },
      bullets: [
        { ko: "PSI 처리에서 가장 값비싼 단계로, 기본 num_worker=4에 워커당 ~16 BLAS 스레드가 64코어에 과다 배정되면 thread-barrier spin으로 us=100%지만 헛돈다(총 ~5시간).", en: "The costliest PSI stage: the default num_worker=4 spawns ~16 BLAS threads per worker, over-subscribing 64 cores into thread-barrier spin — us=100% but spinning idle (~5h total)." },
        { ko: "87×87 EMI 소행렬은 BLAS 멀티스레드 스케일링이 나빠, 스레드를 3으로 묶고 프로세스 병렬 numProcessor를 패치 수 이상으로 올리는 게 정답이다.", en: "The 87×87 EMI small matrices scale poorly under multithreaded BLAS, so the fix is pinning threads to 3 and raising process parallelism above the patch count." },
        { ko: "그 결과 21개 패치가 1-wave로 병렬 처리되어 patch당 3~5분·총 ~6분이 됐고, flag.npy가 있는 patch는 자동 skip이라 중단·재시작도 안전하다.", en: "As a result 21 patches run in a single parallel wave at 3–5 min/patch (~6 min total), and patches with a flag.npy are auto-skipped, making interruption and restart safe." }
      ]
    },
    {
      heading: { ko: "QA 결과 — 죽전 도심 완주", en: "QA results — downtown Jukjeon end-to-end" },
      bullets: [
        { ko: "레이더좌표 609×1393에서 진짜 PS(maskPS)는 848,337점 중 56,975점(6.7%)이 선별됐다.", en: "In radar coordinates 609×1393, true PS (maskPS) selected 56,975 of 848,337 points (6.7%)." },
        { ko: "temporal coherence는 mean 0.485, ≥0.7이 25.6%로 도시 영역에서 정상 수준이며, 보정 LOS velocity는 mean +0.20·std 0.94 mm/yr였다.", en: "Temporal coherence averaged 0.485 with 25.6% at ≥0.7 (normal for an urban area), and corrected LOS velocity was mean +0.20, std 0.94 mm/yr." },
        { ko: "최종적으로 stack_id=3 'jukjeon_psi_r6'으로 108,690점(10m 재-geocode)이 대시보드에 적재됐다.", en: "Finally, 108,690 points (re-geocoded to 10m) were ingested into the dashboard as stack_id=3 'jukjeon_psi_r6'." }
      ]
    }
  ],
  pitfall: {
    ko: "대시보드는 SBAS의 unwrap 검증 지표(conncomp_ok)로 '신뢰점'을 세는데, PSI엔 connComp가 없어 NULL이 되므로 '신뢰 점만' 토글을 켜면 0점이 된다 — 거짓으로 conncomp_ok=true를 박는 건 부정직하고, 정직한 해법은 대시보드가 temporalCoherence 신뢰등급을 PSI stack에 별도 지원하는 것이다. 또한 108,690 적재점도 단일 PS로 인용하지 말고 건물 단위(n_PS≥10)·단지·AOI 평균으로만 봐야 한다.",
    en: "The dashboard counts 'trusted points' via SBAS's unwrap-validation metric (conncomp_ok), but PSI has no connComp so it becomes NULL — toggling 'trusted points only' yields zero. Forcing conncomp_ok=true would be dishonest; the honest fix is for the dashboard to support a separate temporalCoherence confidence grade for PSI stacks. Also, even the 108,690 ingested points must never be cited as single PS — read them only as per-building (n_PS≥10), complex, or AOI averages."
  }
};
