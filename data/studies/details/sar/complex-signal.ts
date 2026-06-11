import type { TopicDetail } from "../../types";

export const complexSignal: TopicDetail = {
  tldr: {
    ko: "SLC 한 픽셀은 복소수 신호 I + jQ 하나로, 진폭은 후방산란 세기를, 위상은 전파의 왕복 시점(회전 각도)을 담는다. 위상을 복소수로 다루는 진짜 이유는 저장이 아니라 계산이다 — 회전이 오일러 공식 e^(jθ)=cosθ+jsinθ 덕분에 곱셈 한 번으로 끝나기 때문이다. Interferogram은 Master × Slave*(Slave의 켤레)이고, 이 곱셈이 위상차 θ₁−θ₂를 자동으로 추출하며 그 값이 곧 경로 길이차가 되어 표고·변위로 환산된다. SNAPHU가 푸는 대상이 바로 이 θ₁−θ₂다.",
    en: "A single SLC pixel is one complex signal, I + jQ, whose amplitude holds the backscatter strength and whose phase holds the round-trip timing of the wave (its rotation angle). The real reason for treating phase as a complex number is computation, not storage — thanks to Euler's formula e^(jθ)=cosθ+jsinθ, a rotation reduces to a single multiplication. An interferogram is Master × Slave* (the conjugate of the slave), and this multiplication automatically extracts the phase difference θ₁−θ₂, which equals the path-length difference and thus converts into elevation and displacement. That θ₁−θ₂ is exactly what SNAPHU solves for."
  },
  sections: [
    {
      heading: { ko: "SLC 픽셀 = 복소수 신호 (I/Q)", en: "An SLC pixel is a complex signal (I/Q)" },
      bullets: [
        { ko: "전파는 「진폭 + 회전하는 파동」이며, SAR이 받은 한 픽셀은 좌표로 보면 (I, Q), 복소수로 보면 I + jQ로 같은 정보의 두 표기일 뿐이다.", en: "A radar wave is amplitude plus a rotating oscillation, so a received pixel can be written as coordinates (I, Q) or as the complex number I + jQ — two notations for the same information." },
        { ko: "진폭 A = √(I² + Q²)는 후방산란 세기, 즉 내가 쏜 전파 중 돌아온 양을 뜻한다.", en: "The amplitude A = √(I² + Q²) is the backscatter strength, i.e. how much of the transmitted wave came back." },
        { ko: "위상 θ = atan2(Q, I)는 전파가 돌아온 시점, 곧 회전 각도를 담으며, 이 위상이 InSAR의 핵심이다.", en: "The phase θ = atan2(Q, I) holds the round-trip timing, i.e. the rotation angle, and this phase is the heart of InSAR." },
        { ko: "GRD가 진폭만 남기고 위상을 버리는 제품인 이유가 바로 여기서 갈린다.", en: "This is precisely where GRD diverges as a product that keeps only amplitude and discards the phase." }
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "수신 전파에서 SLC 복소 픽셀, 그리고 진폭·위상 분기까지", en: "From received wave to the complex SLC pixel, then the amplitude/phase split" },
        nodes: [
          { icon: "📡", label: { ko: "수신 전파", en: "Received wave" }, sub: { ko: "진폭 + 위상", en: "amplitude + phase" }, tone: "muted" },
          { label: { ko: "SLC 픽셀", en: "SLC pixel" }, sub: { ko: "I + jQ", en: "I + jQ" }, tone: "accent" },
          { label: { ko: "진폭 A", en: "Amplitude A" }, sub: { ko: "후방산란 세기 → GRD", en: "backscatter → GRD" }, tone: 2 },
          { label: { ko: "위상 θ", en: "Phase θ" }, sub: { ko: "왕복 시점 → InSAR", en: "round-trip → InSAR" }, tone: 4 }
        ]
      }
    },
    {
      heading: { ko: "왜 복소수인가 — 회전 = 곱셈", en: "Why complex numbers — rotation is multiplication" },
      bullets: [
        { ko: "핵심은 복소수가 저장에 편하다는 것이 아니라, 회전을 곱셈 한 번으로 처리한다는 점이다.", en: "The key is not that complex numbers are convenient for storage, but that they reduce a rotation to a single multiplication." },
        { ko: "x·y 좌표 방식은 x' = x·cosθ − y·sinθ, y' = x·sinθ + y·cosθ처럼 픽셀 수백만 개마다 삼각함수를 돌려야 해 비용이 폭증한다.", en: "The x/y coordinate approach must run trigonometry per pixel — x' = x·cosθ − y·sinθ, y' = x·sinθ + y·cosθ — exploding the cost over millions of pixels." },
        { ko: "복소수 방식은 e^(jθ)를 곱하는 곱셈 한 번으로 끝나며 삼각함수 호출이 없다.", en: "The complex approach finishes with one multiplication by e^(jθ) and needs no trig calls at all." },
        { ko: "예로 신호 (1,0)을 90° 회전하면 좌표 방식은 회전공식을 쓰지만, 복소수 방식은 그냥 j를 곱해 (0,1)을 얻는다.", en: "For example, rotating the signal (1,0) by 90° requires the rotation formula in coordinates, whereas in complex form you simply multiply by j to get (0,1)." }
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "좌표 방식 vs 복소수 방식의 회전 처리", en: "Handling a rotation: coordinates vs complex numbers" },
        headers: [
          { ko: "", en: "" },
          { ko: "x·y 좌표 방식", en: "x/y coordinates" },
          { ko: "복소수 방식", en: "Complex numbers" }
        ],
        rows: [
          [
            { ko: "회전 연산", en: "Rotation op" },
            { ko: "x·cosθ − y·sinθ 등 회전공식", en: "rotation formula x·cosθ − y·sinθ …" },
            { ko: "× e^(jθ) 곱셈 한 번", en: "one multiply by e^(jθ)" }
          ],
          [
            { ko: "삼각함수", en: "Trig functions" },
            { ko: "픽셀마다 sin·cos 폭증", en: "sin/cos explode per pixel" },
            { ko: "삼각함수 없음", en: "none" }
          ]
        ]
      }
    },
    {
      heading: { ko: "오일러 공식 — 회전을 숫자 하나로", en: "Euler's formula — a rotation as a single number" },
      bullets: [
        { ko: "반지름 1 원 위를 도는 점은 (cosθ, sinθ), 복소수로는 cosθ + j·sinθ이며, 이것이 놀랍게도 e^(jθ)와 같다는 것이 오일러 공식이다.", en: "A point on the unit circle is (cosθ, sinθ), or cosθ + j·sinθ as a complex number, and Euler's formula states that this remarkably equals e^(jθ)." },
        { ko: "그래서 전파 한 줄을 A·e^(jθ)로 쓴다 — I/Q 평면 위에서 길이 A, 각도 θ인 벡터 하나다.", en: "So a wave is written compactly as A·e^(jθ) — a single vector of length A and angle θ on the I/Q plane." },
        { ko: "SAR 엔지니어가 오일러 공식을 쓰는 이유는 증명이 아니라, 회전하는 전파를 한 줄로 표현해 위상 연산을 곱셈으로 환원하기 때문이다.", en: "SAR engineers use Euler's formula not for its proof but because it expresses a rotating wave in one line and reduces phase operations to multiplication." }
      ],
      diagram: {
        kind: "formula",
        expr: "e^{j\\theta} = \\cos\\theta + j\\sin\\theta",
        caption: { ko: "오일러 공식: 회전하는 전파를 A·e^(jθ) 한 줄로", en: "Euler's formula: a rotating wave as the single term A·e^(jθ)" },
        legend: [
          { sym: "A", desc: { ko: "진폭 (벡터 길이)", en: "amplitude (vector length)" } },
          { sym: "\\theta", desc: { ko: "위상 (회전 각도)", en: "phase (rotation angle)" } },
          { sym: "j", desc: { ko: "허수 단위 (90° 회전)", en: "imaginary unit (a 90° rotation)" } }
        ]
      }
    },
    {
      heading: { ko: "켤레복소수와 Interferogram = M × S*", en: "The conjugate and the interferogram = M × S*" },
      bullets: [
        { ko: "InSAR가 원하는 것은 절대 위상이 아니라 두 촬영의 위상차 θ₁ − θ₂인데, 그냥 곱하면 위상이 더해져(θ₁+θ₂) 의미가 없어진다.", en: "InSAR wants not the absolute phase but the phase difference θ₁ − θ₂ between two acquisitions, yet a plain product adds the phases (θ₁+θ₂) and becomes meaningless." },
        { ko: "그래서 Slave의 켤레복소수, 즉 위상 부호를 뒤집은 e^(−jθ₂)를 곱하면 AB·e^(j(θ₁−θ₂))가 되어 위상차가 자동으로 추출된다.", en: "So multiplying by the slave's conjugate — e^(−jθ₂) with the phase sign flipped — yields AB·e^(j(θ₁−θ₂)), automatically extracting the phase difference." },
        { ko: "시계 비유로 Master 30°, Slave 20°일 때 그냥 더하면 50°(무의미)이지만, Slave를 −20°로 뒤집어 더하면 10°라는 원하는 상대 각도가 나온다.", en: "By the clock analogy, with Master 30° and Slave 20°, plain addition gives a meaningless 50°, but flipping the slave to −20° gives the desired relative angle of 10°." },
        { ko: "SNAP의 Interferogram Formation 단계는 사실상 픽셀마다 이 M × S*를 수행하는 위상차 계산기이고, SNAPHU가 푸는 대상은 Master도 Slave도 아닌 바로 이 θ₁ − θ₂이며, 그 차이가 경로 길이차 ΔR을 거쳐 표고·변위로 환산된다.", en: "SNAP's Interferogram Formation step is effectively a per-pixel phase-difference calculator running this M × S*, and what SNAPHU solves is neither the master nor slave phase but exactly this θ₁ − θ₂, which becomes a path-length difference ΔR and thus elevation and displacement." }
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "M × S* 곱이 위상차를 토하고 경로차·변위로 이어지는 흐름", en: "The M × S* product yields the phase difference, leading to path difference and displacement" },
        nodes: [
          { label: { ko: "Master", en: "Master" }, sub: { ko: "A·e^(jθ₁)", en: "A·e^(jθ₁)" }, tone: 1 },
          { label: { ko: "Slave 켤레 S*", en: "Slave conjugate S*" }, sub: { ko: "B·e^(−jθ₂)", en: "B·e^(−jθ₂)" }, tone: 3 },
          { icon: "✳️", label: { ko: "M × S*", en: "M × S*" }, sub: { ko: "AB·e^(j(θ₁−θ₂))", en: "AB·e^(j(θ₁−θ₂))" }, tone: "accent" },
          { label: { ko: "경로차 ΔR", en: "Path diff ΔR" }, sub: { ko: "→ 표고 / 변위", en: "→ elevation / displacement" }, tone: 5 }
        ]
      }
    }
  ],
  pitfall: {
    ko: "복소수를 저장 포맷으로만 외우면 M×S*가 끝내 안 풀린다 — 회전=곱셈이라는 계산 동기로 잡아야 켤레의 부호 뒤집기가 자연스럽다. M×S가 아니라 M×S*인 이유는 단 하나, 더하기(θ₁+θ₂)가 아니라 빼기(θ₁−θ₂)를 원하기 때문이며, 부호 실수는 위상차의 방향을 통째로 뒤집는다.",
    en: "If you memorize complex numbers as merely a storage format, M×S* never clicks — you must grasp the computational motive that rotation equals multiplication, which makes the conjugate's sign flip feel natural. The sole reason it is M×S* rather than M×S is that we want subtraction (θ₁−θ₂), not addition (θ₁+θ₂), and a sign mistake flips the entire direction of the phase difference."
  }
};
