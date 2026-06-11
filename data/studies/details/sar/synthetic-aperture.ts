import type { TopicDetail } from "../../types";

export const syntheticAperture: TopicDetail = {
  tldr: {
    ko: "합성개구(Synthetic Aperture)는 작은 안테나를 위성 이동으로 옮겨가며 같은 표적을 수백~수천 번 관측한 복소수 신호를 위상 정렬 후 합산해, 수 km짜리 거대 안테나로 찍은 것과 같은 효과를 만드는 기술이다. 위성이 움직이면 표적까지의 거리(R1, R2, …)가 변하고 그 거리차가 위상차로 나타나는데, 같은 표적임을 아는 프로세서가 위상을 보정해 더하는 과정이 바로 Azimuth Compression(matched filter)이다. 진폭만이 아니라 위상까지 맞춰 더해야 하므로 복소수(I/Q)가 필수이며, 이 과정은 SNAP의 RAW→SLC 안에 이미 끝나 있어 SLC·Interferogram·Coherence는 전부 합성개구의 결과물이다.",
    en: "Synthetic Aperture is a technique that moves a small antenna along the satellite track, observes the same target hundreds to thousands of times, and sums those complex signals after phase alignment — producing the same effect as a kilometers-wide giant antenna. As the satellite moves, the range to the target (R1, R2, …) changes, and that range difference shows up as a phase difference; the process where a processor that knows it is the same target corrects the phase and adds them up is exactly Azimuth Compression (a matched filter). Because the signals must be summed with not just amplitude but phase aligned, complex (I/Q) data is essential, and since this step is already completed inside SNAP's RAW→SLC stage, SLC, Interferogram, and Coherence are all products of synthetic aperture."
  },
  sections: [
    {
      heading: { ko: "왜 필요한가 — 안테나 딜레마", en: "Why it is needed — the antenna dilemma" },
      bullets: [
        { ko: "원래 Azimuth(방위) 해상도는 안테나가 길수록 좋아지지만, 위성에 10km짜리 안테나를 달 수는 없다(Sentinel-1 실제 안테나는 12.3m).", en: "Azimuth resolution improves the longer the antenna is, but you cannot mount a 10km antenna on a satellite (Sentinel-1's real antenna is 12.3m)." },
        { ko: "그래서 안테나를 물리적으로 키우는 대신, 위성 이동 중 얻은 관측을 합쳐 가상의 초대형 안테나를 만들자는 것이 합성개구의 핵심 아이디어다.", en: "So instead of physically enlarging the antenna, the core idea of synthetic aperture is to combine observations gathered while the satellite moves, creating a virtual ultra-large antenna." },
        { ko: "광학 카메라에서 렌즈(개구)가 클수록 해상도가 좋아지는 원리를, 물리적 안테나 대신 위성의 궤적으로 합성한다.", en: "It synthesizes — via the satellite's trajectory rather than a physical antenna — the same principle by which a larger lens (aperture) yields higher resolution in an optical camera." }
      ]
    },
    {
      heading: { ko: "메커니즘 — 거리차가 위상차로", en: "Mechanism — range difference becomes phase difference" },
      bullets: [
        { ko: "위성은 능동센서로 「삐익! → 메아리 → 들었다」를 반복하며 궤적을 따라 계속 이동한다.", en: "As an active sensor the satellite repeats 'beep! → echo → received' over and over while continuously moving along its track." },
        { ko: "한 표적은 위성이 지나가는 동안 수백~수천 번 관측되고, 각 위치에서 표적까지의 거리가 조금씩 달라지며, 거리가 다르면 돌아오는 신호의 위상도 달라진다.", en: "A single target is observed hundreds to thousands of times as the satellite passes, the range to it differs slightly at each position, and a different range means a different phase in the returning signal." },
        { ko: "핵심은 프로세서가 이 위상 변화가 같은 표적 때문임을 안다는 것이며, 각 관측을 위상 보정 후 전부 더하면(matched filter) 신호가 한 점에 강하게 모인다.", en: "The key is that the processor knows this phase variation comes from the same target, so when each observation is summed after phase correction (a matched filter), the signal concentrates strongly at a single point." }
      ],
      diagram: {
        kind: "flow",
        dir: "col",
        caption: { ko: "합성개구 처리 흐름: 안테나 이동에서 가상 거대 안테나까지", en: "Synthetic aperture processing flow: from antenna motion to a virtual giant antenna" },
        nodes: [
          { icon: "📡", label: { ko: "실제 안테나 이동", en: "Real antenna moves" }, sub: { ko: "위성 t1·t2·…·tN 궤적 따라 이동", en: "Satellite travels along track t1·t2·…·tN" }, tone: "muted" },
          { icon: "🛰️", label: { ko: "수백~수천 번 관측", en: "Hundreds–thousands of observations" }, sub: { ko: "동일 표적, 거리 R1≠R2≠…≠RN → 위상이 위치마다 다름", en: "Same target, ranges R1≠R2≠…≠RN → phase differs per position" }, tone: 2 },
          { icon: "🔄", label: { ko: "위상 보정·합산", en: "Phase correction and summation" }, sub: { ko: "Azimuth Compression / matched filter", en: "Azimuth Compression / matched filter" }, tone: "accent" },
          { icon: "🎯", label: { ko: "가상 거대 안테나", en: "Virtual giant antenna" }, sub: { ko: "한 점에 에너지 집중 → 높은 Azimuth 해상도 → SLC", en: "Energy concentrated at one point → high azimuth resolution → SLC" }, tone: 4 }
        ]
      }
    },
    {
      heading: { ko: "작은 안테나 vs 합성개구, 그리고 왜 복소수인가", en: "Small antenna vs synthetic aperture, and why complex numbers" },
      bullets: [
        { ko: "작은 실제 안테나만 쓰면 빔이 손전등처럼 넓게 퍼져 어느 표적인지 흐릿하고, 방위 해상도가 수백 m까지 악화될 수 있다.", en: "With only the small real antenna, the beam spreads wide like a flashlight, blurring which target is which, and azimuth resolution can degrade to hundreds of meters." },
        { ko: "합성개구 후에는 빔이 레이저 포인터처럼 집속되어 특정 위치에서만 신호가 강해지고, Azimuth 해상도 약 20m를 얻는다.", en: "After synthetic aperture, the beam focuses like a laser pointer so the signal is strong only at a specific position, yielding an azimuth resolution of about 20m." },
        { ko: "합성개구는 단순 합산이 아니라 위상까지 맞춰 더해야 하며, 「1+1+1+1=4」가 되려면 방향(위상)이 같아야 하기 때문에 복소수(I/Q)가 필수다.", en: "Synthetic aperture is not a plain sum but an addition with phase aligned; for '1+1+1+1=4' to hold the directions (phases) must match, which is why complex (I/Q) data is essential." },
        { ko: "복소수 평면에서 위상은 각도이고(A·e^(jθ)), 위상 보정은 곧 회전이자 곱셈 한 번이라 합산이 쉬워진다.", en: "On the complex plane phase is an angle (A·e^(jθ)), and phase correction is a rotation — a single multiplication — which makes the summation easy." }
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "작은 실제 안테나만 vs 합성개구 후", en: "Small real antenna only vs after synthetic aperture" },
        headers: [
          { ko: "", en: "" },
          { ko: "빔 모양", en: "Beam shape" },
          { ko: "결과", en: "Result" }
        ],
        rows: [
          [
            { ko: "작은 실제 안테나만", en: "Small real antenna only" },
            { ko: "손전등처럼 넓게 퍼짐", en: "Spreads wide like a flashlight" },
            { ko: "어느 표적인지 흐릿 — 방위 해상도 수백 m까지 악화", en: "Blurry target — azimuth worsens to hundreds of m" }
          ],
          [
            { ko: "합성개구 후", en: "After synthetic aperture" },
            { ko: "레이저 포인터처럼 집속", en: "Focused like a laser pointer" },
            { ko: "특정 위치에서만 신호 강함 — Azimuth 약 20m", en: "Strong only at one position — azimuth ~20m" }
          ]
        ]
      }
    },
    {
      heading: { ko: "Sentinel-1 숫자와 SNAP에서의 위치", en: "Sentinel-1 numbers and where it sits in SNAP" },
      bullets: [
        { ko: "Sentinel-1은 주파수 5.405 GHz, 파장 λ 약 5.6 cm, 실제 안테나 길이 약 12.3 m, IW swath 약 250 km를 갖는다.", en: "Sentinel-1 operates at 5.405 GHz with a wavelength λ of about 5.6 cm, a real antenna length of about 12.3 m, and an IW swath of about 250 km." },
        { ko: "실제 안테나만으로는 방위 해상도가 수백 m 수준이지만, 합성개구로 최종 약 20 m를 획득한다(TOPS·운영모드 영향 포함).", en: "With the real antenna alone azimuth resolution is on the order of hundreds of meters, but synthetic aperture brings the final value down to about 20 m (including TOPS and operational-mode effects)." },
        { ko: "SNAP 처리에서 합성개구는 RAW → Range Compression → Azimuth Compression(합성개구) → SLC 단계의 Azimuth Compression에 해당한다.", en: "In SNAP processing, synthetic aperture corresponds to the Azimuth Compression step in RAW → Range Compression → Azimuth Compression (synthetic aperture) → SLC." },
        { ko: "SLC·Interferogram·Coherence·DSM·DInSAR·SBAS는 모두 합성개구가 끝난 결과를 사용하므로, 합성개구가 실패하면 SLC 자체가 제대로 만들어지지 않는다.", en: "SLC, Interferogram, Coherence, DSM, DInSAR, and SBAS all use the completed synthetic-aperture result, so if synthetic aperture fails the SLC itself is not produced properly." }
      ]
    }
  ],
  pitfall: {
    ko: "실무에서 합성개구 자체를 직접 건드릴 일은 거의 없지만, 「Azimuth가 왜 Range보다 해상도가 나쁜가」를 설명할 때의 출발점이 된다. SLC·Interferogram·Coherence가 전부 합성개구 결과물임을 잊으면, 합성개구 실패가 곧 SLC 생성 실패라는 인과를 놓치기 쉽다.",
    en: "In practice you rarely touch synthetic aperture directly, but it is the starting point when explaining why azimuth resolution is worse than range. Forgetting that SLC, Interferogram, and Coherence are all synthetic-aperture products makes it easy to miss the causal link that a synthetic-aperture failure means an SLC-generation failure."
  }
};
