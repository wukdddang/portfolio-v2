import type { TopicDetail } from "../../types";

export const swathTops: TopicDetail = {
  tldr: {
    ko: "Swath는 Sentinel-1이 한 번 지나가며 보는 전체 관측 띠(IW 모드 약 250km)이고, Subswath(IW1·IW2·IW3)는 그 띠를 약 80km씩 셋으로 나눈 세부 구역으로 서로 약간 겹친다. Sentinel-1 IW는 빔을 IW1→IW2→IW3로 빠르게 번갈아 스캔하는 TOPSAR(Terrain Observation by Progressive Scans) 방식이라, 데이터량·안테나·해상도 제약을 피하려 250km를 한 번에 안 찍고 나눠 찍는다. 가장 헷갈리는 점은 IW1→IW3가 Azimuth(위성 진행)가 아니라 Range(옆) 방향 배열이라는 것이며, SNAP TOPSAR Split에서 고르는 IW가 곧 subswath이고 burst·deburst·coregistration은 전부 subswath 단위로 처리된다.",
    en: "A Swath is the entire observation strip Sentinel-1 sees in a single pass (about 250km in IW mode), and a Subswath (IW1·IW2·IW3) is a subregion that splits that strip into three pieces of about 80km each, slightly overlapping. Sentinel-1 IW uses TOPSAR (Terrain Observation by Progressive Scans), rapidly alternating the beam across IW1→IW2→IW3, so it does not image 250km at once but in pieces to avoid limits on data volume, antenna, and resolution. The most confusing point is that IW1→IW3 are arrayed along Range (the side direction), not Azimuth (the satellite's flight direction); the IW chosen in SNAP TOPSAR Split is exactly the subswath, and burst, deburst, and coregistration are all processed per subswath."
  },
  sections: [
    {
      heading: { ko: "Swath vs Subswath", en: "Swath vs Subswath" },
      bullets: [
        { ko: "Swath는 위성이 한 번에 보는 전체 폭으로, Sentinel-1 IW 모드에서 약 250km다.", en: "A Swath is the entire width the satellite sees in one pass, about 250km in Sentinel-1 IW mode." },
        { ko: "Subswath는 그 폭을 나눈 세부 구역으로, IW1·IW2·IW3 각각이 약 80km이며 합치면 약 250km가 되고 서로 약간 겹친다.", en: "A Subswath is a subregion of that width — IW1·IW2·IW3 each about 80km, summing to roughly 250km, with slight overlap between them." },
        { ko: "즉 하나의 swath 안에 세 개의 subswath가 들어 있으며, IW1/2/3는 swath를 쪼갠 단위다.", en: "In other words a single swath contains three subswaths, and IW1/2/3 are the units into which the swath is divided." }
      ],
      diagram: {
        kind: "branch",
        caption: { ko: "전체 관측 띠(Swath)가 세 subswath로 갈린다", en: "The observation strip (Swath) splits into three subswaths" },
        root: { icon: "🗺", label: { ko: "Swath", en: "Swath" }, sub: { ko: "전체 관측 띠 · IW 약 250km", en: "Whole strip · IW ~250km" }, tone: "accent" },
        children: [
          { label: { ko: "IW1", en: "IW1" }, sub: { ko: "subswath 약 80km", en: "subswath ~80km" }, tone: 2 },
          { label: { ko: "IW2", en: "IW2" }, sub: { ko: "subswath 약 80km", en: "subswath ~80km" }, tone: 4 },
          { label: { ko: "IW3", en: "IW3" }, sub: { ko: "subswath 약 80km", en: "subswath ~80km" }, tone: 5 }
        ]
      }
    },
    {
      heading: { ko: "TOPSAR — 왜 나눠 찍나", en: "TOPSAR — why image it in pieces" },
      bullets: [
        { ko: "250km를 한 번에 고해상도로 관측하면 데이터량 폭증·안테나 제약·해상도 저하가 생기므로, 전자적으로 빔을 움직이며 subswath를 번갈아 스캔한다.", en: "Imaging 250km at high resolution all at once would explode data volume, strain the antenna, and degrade resolution, so the beam is steered electronically to scan the subswaths alternately." },
        { ko: "이 방식이 TOPSAR(Terrain Observation by Progressive Scans)로, burst 단위로 빔을 진행 방향으로 쓸며 각 subswath를 채운다.", en: "This is TOPSAR (Terrain Observation by Progressive Scans), sweeping the beam along the flight direction in bursts to fill each subswath." },
        { ko: "빔은 IW1→IW2→IW3→IW1→IW2→… 순서로 빠르게 번갈아 스캔하며, 250km 광역을 한 번에 찍지 않고 나눠 채운다.", en: "The beam rapidly alternates in the order IW1→IW2→IW3→IW1→IW2→…, filling the 250km wide area piece by piece rather than in a single shot." }
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "빔이 subswath를 번갈아 스캔하는 TOPSAR 순서", en: "The TOPSAR order in which the beam alternates across subswaths" },
        nodes: [
          { label: { ko: "IW1", en: "IW1" }, tone: 2 },
          { label: { ko: "IW2", en: "IW2" }, tone: 4 },
          { label: { ko: "IW3", en: "IW3" }, tone: 5 },
          { label: { ko: "IW1", en: "IW1" }, tone: 2 },
          { label: { ko: "…", en: "…" }, tone: "muted" }
        ]
      }
    },
    {
      heading: { ko: "Range vs Azimuth — 가장 헷갈리는 포인트", en: "Range vs Azimuth — the most confusing point" },
      bullets: [
        { ko: "IW1→IW3는 위성 진행 방향(Azimuth)이 아니라 Range(옆) 방향으로 배열된다.", en: "IW1→IW3 are arrayed along Range (the side direction), not along the satellite's flight direction (Azimuth)." },
        { ko: "위성은 위쪽(Azimuth)으로 날아가고, IW1·IW2·IW3는 그 궤적 옆(Range)으로 나란히 놓인다.", en: "The satellite flies upward (Azimuth) while IW1·IW2·IW3 lie side by side next to its track (Range)." },
        { ko: "이 그림을 외워두면 좌표계 혼동을 막을 수 있다 — IW 번호가 진행 방향 단계가 아니라 옆으로 늘어선 띠임을 기억하자.", en: "Memorizing this picture prevents coordinate-system confusion — remember that the IW numbers are strips lined up sideways, not stages along the flight direction." }
      ],
      diagram: [
        {
          kind: "scene",
          variant: "swath",
          caption: { ko: "IW1·IW2·IW3는 위성 궤적 옆(Range) 방향으로 나란히 — 진행(Azimuth)이 아니라 측방 배열", en: "IW1·IW2·IW3 lie side by side along Range (next to the track) — arrayed sideways, not along Azimuth" }
        },
        {
        kind: "compare",
        caption: { ko: "두 축의 의미와 IW 배열 방향", en: "The meaning of the two axes and the direction IW are arrayed" },
        headers: [
          { ko: "", en: "" },
          { ko: "Azimuth", en: "Azimuth" },
          { ko: "Range", en: "Range" }
        ],
        rows: [
          [
            { ko: "방향", en: "Direction" },
            { ko: "위성 진행 방향 (위로)", en: "Satellite flight direction (upward)" },
            { ko: "궤적 옆 방향", en: "Sideways from the track" }
          ],
          [
            { ko: "IW1·IW2·IW3", en: "IW1·IW2·IW3" },
            { ko: "이 방향 아님", en: "Not this direction" },
            { ko: "이 방향으로 나란히 배열", en: "Arrayed side by side here" }
          ]
        ]
        }
      ]
    },
    {
      heading: { ko: "SNAP 실무 연결", en: "Connecting to SNAP in practice" },
      bullets: [
        { ko: "TOPSAR Split 단계에서 IW1/IW2/IW3 중 처리할 subswath를 선택하며, 관심 AOI가 IW2에만 있으면 IW2만 잘라 처리한다.", en: "In the TOPSAR Split step you select which subswath (IW1/IW2/IW3) to process, and if the AOI of interest lies only in IW2 you cut out and process IW2 alone." },
        { ko: "Burst·Deburst는 subswath 안의 burst 단위로 분해·병합하고, Coregistration은 subswath 단위로 정렬한다.", en: "Burst and Deburst decompose and merge by the burst units inside a subswath, while Coregistration aligns per subswath." },
        { ko: "SNAP에서 IW1·IW2·IW3 폴더가 따로 보이는 이유가 바로 이 구조이며, 처리 비용을 줄이려면 관심 AOI가 든 subswath만 고르는 게 핵심이다.", en: "This structure is exactly why separate IW1·IW2·IW3 folders appear in SNAP, and to reduce processing cost the key is to pick only the subswath containing the AOI of interest." }
      ]
    }
  ],
  pitfall: {
    ko: "IW1→IW3를 Range(옆) 방향이 아니라 Azimuth로 착각하면 좌표계가 통째로 꼬인다 — 그림으로 외워두는 게 안전하다. 또 burst는 최소 2개가 필요한데, 단일 burst(FIRST=LAST=1)면 ESD overlap이 0이라 파이프라인이 exit 0으로 성공 보고하면서도 빈 산출물을 낸다. 반대로 관심 AOI가 한 subswath에 들면 그것만 처리하면 되는데, 송도 트랙은 rel127 북 slice의 IW2 한 swath(VV만)만 materialize해 약 121GB로 줄였다 — swath/subswath를 알면 materialize 비용을 크게 절감한다.",
    en: "Mistaking IW1→IW3 for the Azimuth direction instead of Range (the side direction) tangles the entire coordinate system — it is safest to memorize the picture. Also, a burst count of at least 2 is required: with a single burst (FIRST=LAST=1) the ESD overlap is 0, so the pipeline reports success with exit 0 yet produces empty output. Conversely, when the AOI of interest falls within one subswath you only process that one — the Songdo track materialized just the IW2 single swath (VV only) of the rel127 north slice, shrinking it to about 121GB; knowing swath/subswath greatly cuts materialization cost."
  }
};
