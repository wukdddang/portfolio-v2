import type { Study } from "./types";
import { sarJournal } from "./journal/sar";
import { chirp } from "./details/sar/chirp";
import { complexSignal } from "./details/sar/complex-signal";
import { deformation } from "./details/sar/deformation";
import { dsSqueesar } from "./details/sar/ds-squeesar";
import { psi } from "./details/sar/psi";
import { resolution } from "./details/sar/resolution";
import { sbas } from "./details/sar/sbas";
import { slcGrd } from "./details/sar/slc-grd";
import { speckleCoherence } from "./details/sar/speckle-coherence";
import { swathTops } from "./details/sar/swath-tops";
import { syntheticAperture } from "./details/sar/synthetic-aperture";

export const sar: Study = {
    slug: "sar",
    icon: "🛰",
    title: { ko: "SAR · 위성영상", en: "SAR · Satellite Imagery" },
    tagline: {
      ko: "실무로 먼저 구축한 InSAR 파이프라인 아래에 제1원리를 채우는 학습 로그",
      en: "A study log filling in first principles beneath an InSAR pipeline I built in production first",
    },
    motive: {
      ko: "루미르에서 Sentinel-1 InSAR 파이프라인(DInSAR·SBAS·PSI)을 실무로 먼저 구축했습니다. 파이프라인은 돌아가는데 \"왜 복소수인가, 왜 위상차가 변위가 되는가, Coherence는 정확히 무엇인가\" 같은 제1원리가 비어 있었고 — 그 공백을 기초 이론 블록부터 다시 채워 실무 경험과 연결하고 있습니다.",
      en: "At Lumir I built the Sentinel-1 InSAR pipeline (DInSAR · SBAS · PSI) in production first. The pipeline ran fine, but first principles — why complex numbers, why a phase difference becomes displacement, what coherence really is — were missing. I'm filling that gap from the theory blocks up, wiring it back into hands-on experience.",
    },
    method: {
      ko: "AI(ChatGPT·Claude)를 사고 파트너로 둔 대화 학습 → Brain Trinity 위키로 컴파일하는 루틴입니다. 대화 원본은 raw로 보존하고, 개념은 위키 페이지로 정제해 미래의 나와 AI(RAG)가 다시 쓸 수 있게 축적합니다.",
      en: "Conversational learning with AI (ChatGPT · Claude) as a thinking partner, compiled into the Brain Trinity wiki. Raw conversations are preserved as-is; concepts are distilled into wiki pages my future self — and an LLM via RAG — can reuse.",
    },
    stats: [
      { label: { ko: "위키 페이지", en: "Wiki pages" }, value: { ko: "13개 컴파일", en: "13 compiled" } },
      { label: { ko: "학습 방식", en: "Method" }, value: { ko: "AI 대화 → 위키", en: "AI dialog → wiki" } },
      { label: { ko: "실무 연계", en: "In production" }, value: { ko: "루미르 InSAR 파이프라인", en: "Lumir InSAR pipeline" } },
    ],
    journal: sarJournal,
    blocks: [
      {
        title: { ko: "기초 이론 — 신호와 영상의 물리", en: "Foundations — the physics of signal & image" },
        desc: {
          ko: "파이프라인 아래의 \"왜\" — 복소수 신호부터 TOPS 스캔까지.",
          en: "The \"why\" beneath the pipeline — from complex signals to TOPS scanning.",
        },
        cat: 2,
        topics: [
          {
            icon: "🔢",
            title: { ko: "복소수 신호·위상의 수학", en: "Complex signals & phase math" },
            summary: {
              ko: "SLC 픽셀 = A·e^jθ. 회전을 곱셈 한 번으로 처리하는 오일러 공식이 복소수를 쓰는 이유이고, Interferogram = M×S*(켤레 곱)가 위상차를 자동으로 꺼냅니다.",
              en: "An SLC pixel is A·e^jθ. Euler's formula turns rotation into a single multiplication — that's why complex numbers — and the interferogram M×S* (conjugate product) extracts the phase difference automatically.",
            },
            tags: [
              { ko: "I/Q", en: "I/Q" },
              { ko: "오일러 공식", en: "Euler's formula" },
              { ko: "M×S*", en: "M×S*" },
            ],
            status: "done",
            wikiSlug: "sar-complex-signal-phase-math",
            slug: "complex-signal",
            detail: complexSignal,
          },
          {
            icon: "📡",
            title: { ko: "합성개구(Synthetic Aperture) 원리", en: "Synthetic aperture principle" },
            summary: {
              ko: "12.3m 안테나를 이동시키며 같은 표적을 수백 번 관측하고, 위상을 보정해 합산(matched filter)하면 거대한 가상 안테나가 됩니다 — Azimuth Compression의 정체.",
              en: "Move a 12.3 m antenna, observe the same target hundreds of times, phase-correct and sum (matched filter) — a huge virtual antenna emerges. That's what azimuth compression is.",
            },
            tags: [
              { ko: "matched filter", en: "matched filter" },
              { ko: "Azimuth Compression", en: "Azimuth compression" },
            ],
            status: "done",
            wikiSlug: "sar-synthetic-aperture",
            slug: "synthetic-aperture",
            detail: syntheticAperture,
          },
          {
            icon: "📏",
            title: { ko: "거리·방위 해상도", en: "Range & azimuth resolution" },
            summary: {
              ko: "Range는 대역폭이(ΔR=c/2B), Azimuth는 합성개구가 결정합니다. Sentinel-1 IW의 5m×20m 비대칭 픽셀과 Multilook 3×1의 이유가 여기서 나옵니다.",
              en: "Bandwidth sets range resolution (ΔR=c/2B); the synthetic aperture sets azimuth. Sentinel-1 IW's asymmetric 5 m × 20 m pixel — and why multilook is 3×1 — both follow from here.",
            },
            tags: [
              { ko: "ΔR=c/2B", en: "ΔR=c/2B" },
              { ko: "TOPS 희생", en: "TOPS trade-off" },
              { ko: "Multilook", en: "Multilook" },
            ],
            status: "done",
            wikiSlug: "sar-resolution",
            slug: "resolution",
            detail: resolution,
          },
          {
            icon: "〰",
            title: { ko: "Chirp와 Range Compression", en: "Chirp & range compression" },
            summary: {
              ko: "주파수를 쓸며 길게 쏘고 matched filter로 짧게 압축 — 해상도와 SNR을 동시에 얻는 펄스 압축이 곧 RAW→SLC의 Range Compression입니다.",
              en: "Transmit long while sweeping frequency, compress short with a matched filter — pulse compression wins resolution and SNR at once, and it is the range compression in RAW→SLC.",
            },
            tags: [
              { ko: "펄스 압축", en: "Pulse compression" },
              { ko: "SNR", en: "SNR" },
            ],
            status: "done",
            wikiSlug: "sar-chirp-range-compression",
            slug: "chirp",
            detail: chirp,
          },
          {
            icon: "✨",
            title: { ko: "Speckle와 Coherence", en: "Speckle & coherence" },
            summary: {
              ko: "산란체 간섭이 만드는 점무늬 노이즈(Speckle), 두 SLC의 유사도(Coherence 0~1), 그리고 Coherence를 올리는 대신 해상도를 내주는 Multilook trade-off.",
              en: "Speckle — interference noise from scatterers; coherence — similarity of two SLCs (0–1); and the multilook trade-off that buys coherence at the cost of resolution.",
            },
            tags: [
              { ko: "Coherence", en: "Coherence" },
              { ko: "Multilook", en: "Multilook" },
            ],
            status: "done",
            wikiSlug: "sar-speckle-coherence",
            slug: "speckle-coherence",
            detail: speckleCoherence,
          },
          {
            icon: "🗺",
            title: { ko: "Swath·Subswath·TOPSAR", en: "Swath · subswath · TOPSAR" },
            summary: {
              ko: "빔을 전자적으로 스윙해 250km 폭을 얻는 TOPSAR — IW1/2/3 서브스와스 구조, 그리고 Azimuth 해상도 20m라는 대가.",
              en: "TOPSAR sweeps the beam electronically to cover a 250 km swath — the IW1/2/3 subswath structure, paid for with 20 m azimuth resolution.",
            },
            tags: [
              { ko: "IW", en: "IW" },
              { ko: "빔 스윙", en: "Beam steering" },
            ],
            status: "done",
            wikiSlug: "sar-swath-subswath-tops",
            slug: "swath-tops",
            detail: swathTops,
          },
        ],
      },
      {
        title: { ko: "위성 운용·데이터", en: "Operations & data products" },
        desc: {
          ko: "Sentinel-1 제품 체계 — 무엇을 받아서 시작하는가.",
          en: "The Sentinel-1 product system — what you actually download to start.",
        },
        cat: 3,
        topics: [
          {
            icon: "📦",
            title: { ko: "SLC vs GRD 제품 레벨", en: "SLC vs GRD product levels" },
            summary: {
              ko: "SLC는 위상을 보존한 복소수(InSAR 전용), GRD는 진폭만 남긴 범용 제품. 아카이브의 80~90%는 GRD — \"SLC가 기본\"은 InSAR 시야의 착시입니다.",
              en: "SLC keeps phase as complex data (InSAR-only); GRD keeps amplitude for general use. 80–90% of the archive is GRD — \"SLC is the default\" is an InSAR-eye illusion.",
            },
            tags: [
              { ko: "SLC", en: "SLC" },
              { ko: "GRD", en: "GRD" },
              { ko: "위상 보존", en: "Phase preserved" },
            ],
            status: "done",
            wikiSlug: "sentinel1-product-levels-slc-grd",
            slug: "slc-grd",
            detail: slcGrd,
          },
        ],
      },
      {
        title: { ko: "InSAR 변위 탐지", en: "InSAR deformation" },
        desc: {
          ko: "위상차가 mm 변위가 되기까지 — 실무 파이프라인의 이론.",
          en: "From phase difference to millimetre displacement — the theory of the production pipeline.",
        },
        cat: 6,
        topics: [
          {
            icon: "🌍",
            title: { ko: "변위 탐지 원리 — 위상·LOS·Fringe", en: "Deformation basics — phase · LOS · fringes" },
            summary: {
              ko: "Δφ=(4π/λ)ΔR — C-band에서 fringe 한 줄이 2.8cm입니다. LOS 한 방향만 보는 제약은 Ascending+Descending 결합으로 분해합니다.",
              en: "Δφ=(4π/λ)ΔR — one fringe is 2.8 cm in C-band. The line-of-sight constraint is resolved by combining ascending and descending passes.",
            },
            tags: [
              { ko: "Fringe", en: "Fringe" },
              { ko: "LOS", en: "LOS" },
              { ko: "SNAPHU", en: "SNAPHU" },
            ],
            status: "done",
            wikiSlug: "insar-deformation-fundamentals",
            slug: "deformation",
            detail: deformation,
          },
          {
            icon: "📈",
            title: { ko: "SBAS 시계열", en: "SBAS time series" },
            summary: {
              ko: "짧은 기선 페어 수십~수백 개를 네트워크로 역산해 mm/yr 속도장과 시계열을 얻습니다. 안정 지점을 0으로 고정하는 Reference Point로 대기(APS) 노이즈를 누릅니다.",
              en: "Invert a network of tens-to-hundreds of short-baseline pairs into a mm/yr velocity field and time series. A reference point pinned to a stable site suppresses atmospheric (APS) noise.",
            },
            tags: [
              { ko: "MintPy", en: "MintPy" },
              { ko: "Reference Point", en: "Reference point" },
              { ko: "APS", en: "APS" },
            ],
            status: "done",
            wikiSlug: "sbas-timeseries-insar",
            slug: "sbas",
            detail: sbas,
          },
          {
            icon: "🏙",
            title: { ko: "PSI · MiaplPy", en: "PSI · MiaplPy" },
            summary: {
              ko: "도시 구조물의 영구산란체(PS)만 선별해 점별 풀해상도 시계열을 얻는, SBAS와 정반대의 접근. 죽전 도심 108,690점 실증까지 완주했습니다.",
              en: "Select only persistent scatterers on urban structures for full-resolution per-point time series — the inverse of SBAS. Proven end-to-end on 108,690 points in downtown Jukjeon.",
            },
            tags: [
              { ko: "PS", en: "PS" },
              { ko: "phase linking", en: "Phase linking" },
            ],
            status: "done",
            wikiSlug: "psinsar-miaplpy-workflow",
            slug: "psi",
            detail: psi,
          },
          {
            icon: "🌲",
            title: { ko: "DS·SqueeSAR·NISAR 로드맵", en: "DS · SqueeSAR · NISAR roadmap" },
            summary: {
              ko: "PSI가 못 보는 식생·산지의 분산산란체(DS)로 확장하는 SqueeSAR, 그리고 식생 투과가 좋은 L-band NISAR 시대를 준비하는 다음 지도.",
              en: "SqueeSAR extends into vegetation and mountains with distributed scatterers PSI can't see — and the next map prepares for L-band NISAR with better canopy penetration.",
            },
            tags: [
              { ko: "DS", en: "DS" },
              { ko: "L-band", en: "L-band" },
            ],
            status: "done",
            wikiSlug: "ds-insar-squeesar-nisar-roadmap",
            slug: "ds-squeesar",
            detail: dsSqueesar,
          },
        ],
      },
    ],
    practice: {
      title: { ko: "실무에서 이미 돌고 있는 것들", en: "Already running in production" },
      lede: {
        ko: "이 학습은 책상 위 이론이 아니라, 운영 중인 파이프라인의 기초 공사입니다.",
        en: "This isn't desk theory — it's foundation work under a pipeline that's already in operation.",
      },
      items: [
        {
          title: { ko: "lumir-linux-snap — InSAR 분석 플랫폼", en: "lumir-linux-snap — InSAR analysis platform" },
          desc: {
            ko: "SNAP·ISCE2·MintPy 5종 스택 파이프라인 구축·운영",
            en: "Built and operate the 5-tool pipeline across SNAP · ISCE2 · MintPy",
          },
          href: "/projects/lumir-sar-platform",
        },
        {
          title: { ko: "동천동 SBAS 82페어", en: "Dongcheon-dong SBAS, 82 pairs" },
          desc: {
            ko: "DInSAR→SBAS 시계열 완주 — Reference Point 보정·품질 평가까지",
            en: "DInSAR→SBAS time series end-to-end — through reference-point correction and QA",
          },
        },
        {
          title: { ko: "죽전 PSI 108,690점", en: "Jukjeon PSI, 108,690 points" },
          desc: {
            ko: "MiaplPy phase linking 최적화(5h→6분)로 도심 영구산란체 시계열 완주",
            en: "Urban PS time series completed, with phase-linking optimized from 5 h to 6 min",
          },
        },
      ],
    },
  };
