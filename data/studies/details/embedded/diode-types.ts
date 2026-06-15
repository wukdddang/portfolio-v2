import type { TopicDetail } from "../../types";

export const diodeTypes: TopicDetail = {
  tldr: {
    ko: "다이오드는 전류를 한 방향으로만 흘리는 반도체 소자로, 도통해도 순방향 전압강하 VF(~0.7V)가 남습니다. I-V 곡선은 순방향 도통·역방향 차단·항복 3영역으로 나뉘고, 끌 때 전류가 즉시 0이 안 되는 역회복시간(trr)이 스위칭 손실로 돌아옵니다. 종류는 효율(저VF 쇼트키)·속도(빠른 trr 스위칭/패스트리커버리)·보호(역방향 항복을 쓰는 제너·TVS)로 갈립니다.",
    en: "A diode passes current one way, but even when conducting it keeps a forward drop VF (~0.7 V). Its I-V curve has three regions — forward conduction, reverse block, breakdown — and turn-off isn't instant: the reverse-recovery time (trr) comes back as switching loss. Types split by efficiency (low-VF Schottky), speed (fast-trr switching / fast-recovery) and protection (Zener/TVS using reverse breakdown).",
  },
  sections: [
    {
      heading: { ko: "한 방향 도통 + I-V 3영역", en: "One-way conduction + three I-V regions" },
      bullets: [
        {
          ko: "애노드(+)·캐소드(−) 순방향이면 도통하되 양단에 VF≈0.7V 강하가 남고(첫 손실), 반대로 역방향이면 차단합니다.",
          en: "Forward (anode +, cathode −) conducts but leaves VF≈0.7 V across it (the first loss); reverse blocks.",
        },
        {
          ko: "I-V는 순방향 도통(VF)·역방향 차단(미세 누설)·항복(전류 급증→파괴) 3영역. 단 무한전류는 아니므로 데이터시트 최대전류를 꼭 확인해야 합니다.",
          en: "Three regions: forward conduction (VF), reverse block (tiny leakage), breakdown (current surges → destruction). Not unlimited current — always check the datasheet max.",
        },
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "전압 방향·크기로 갈리는 3영역", en: "Three regions by voltage direction & size" },
        headers: [
          { ko: "영역", en: "Region" },
          { ko: "조건", en: "Condition" },
          { ko: "동작", en: "Behavior" },
        ],
        rows: [
          [
            { ko: "순방향", en: "Forward" },
            { ko: "V > VF", en: "V > VF" },
            { ko: "도통 (VF≈0.7V 강하)", en: "Conducts (VF≈0.7 V drop)" },
          ],
          [
            { ko: "역방향 차단", en: "Reverse block" },
            { ko: "−Vbr < V < VF", en: "−Vbr < V < VF" },
            { ko: "차단 (미세 누설)", en: "Blocks (tiny leakage)" },
          ],
          [
            { ko: "항복", en: "Breakdown" },
            { ko: "V < −Vbr", en: "V < −Vbr" },
            { ko: "급증 → 파괴 (제너·TVS는 일부러 사용)", en: "Surges → destroyed (Zener/TVS use it on purpose)" },
          ],
        ],
      },
    },
    {
      heading: { ko: "역회복시간 trr — 두 번째 손실", en: "Reverse-recovery time trr — the second loss" },
      bullets: [
        {
          ko: "순방향 도통 중 갑자기 끄면 전류가 즉시 0이 안 되고 잠깐 역방향으로 흘렀다 회복합니다 — 그 시간이 trr, 전류 파형의 면적이 곧 손실입니다.",
          en: "Cut a conducting diode and current doesn't stop instantly — it briefly flows backward, then recovers. That time is trr; the area under that current is the loss.",
        },
        {
          ko: "on/off를 끊임없이 반복하는 스위칭 회로에선 이 손실이 매 사이클 누적되므로, 고속 스위칭에는 trr이 짧은 다이오드가 필요합니다.",
          en: "In switching circuits that toggle on/off constantly the loss accumulates every cycle, so fast switching needs a short-trr diode.",
        },
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "끌 때 역전류가 trr만큼 흐른다 = 손실", en: "Turn-off draws reverse current for trr = loss" },
        nodes: [
          { label: { ko: "순방향 도통", en: "Forward on" }, tone: 4 },
          { label: { ko: "역방향 전환", en: "Switch off" }, sub: { ko: "전류 즉시 0 아님", en: "not instant" }, tone: 6 },
          { icon: "↩", label: { ko: "역전류", en: "Reverse current" }, sub: { ko: "trr 구간", en: "trr window" }, tone: "accent" },
          { icon: "🔥", label: { ko: "스위칭 손실", en: "Switching loss" }, tone: 3 },
        ],
      },
    },
    {
      heading: { ko: "종류 6종 — 효율·속도·보호로 갈림", en: "Six types — split by efficiency, speed, protection" },
      bullets: [
        {
          ko: "범용(정류)은 항복·정격이 높지만 VF·trr이 커 스위칭엔 부적합. 스위칭(1N4148)은 trr이 빨라 신호용, 쇼트키는 VF 0.2~0.6V로 효율↑·trr 매우 짧음(대신 누설 큼).",
          en: "General/rectifier has high breakdown & rating but large VF/trr (poor for switching). Switching (1N4148) is fast-trr for signals; Schottky has VF 0.2–0.6 V (efficient) and very short trr (but high leakage).",
        },
        {
          ko: "패스트리커버리는 trr을 줄인 정류용. 제너·TVS는 정류가 아니라 역방향 항복을 일부러 써서 정전압·서지/ESD 보호에 씁니다.",
          en: "Fast-recovery is a low-trr rectifier. Zener/TVS aren't rectifiers — they deliberately use reverse breakdown for voltage regulation and surge/ESD protection.",
        },
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "용도로 고르는 다이오드 6종", en: "Picking among six diode types" },
        headers: [
          { ko: "종류", en: "Type" },
          { ko: "VF / 특성", en: "VF / trait" },
          { ko: "용도", en: "Use" },
        ],
        rows: [
          [
            { ko: "범용 (정류)", en: "General" },
            { ko: "VF·trr 큼", en: "high VF/trr" },
            { ko: "교류 정류·역전류 차단", en: "AC rectify · block reverse" },
          ],
          [
            { ko: "스위칭 1N4148", en: "Switching 1N4148" },
            { ko: "trr 빠름·누설 적음", en: "fast trr, low leak" },
            { ko: "고속 신호 스위칭", en: "fast signal switching" },
          ],
          [
            { ko: "쇼트키", en: "Schottky" },
            { ko: "VF 0.2~0.6V·누설 큼", en: "VF 0.2–0.6 V, high leak" },
            { ko: "전원회로·효율", en: "power supplies · efficiency" },
          ],
          [
            { ko: "패스트리커버리", en: "Fast-recovery" },
            { ko: "trr 매우 짧음", en: "very short trr" },
            { ko: "고주파 정류", en: "high-freq rectify" },
          ],
          [
            { ko: "제너", en: "Zener" },
            { ko: "역방향 항복 사용", en: "reverse breakdown" },
            { ko: "정전압·과전압 보호", en: "voltage reg · clamp" },
          ],
          [
            { ko: "TVS", en: "TVS" },
            { ko: "응답 빠름·서지 흡수", en: "fast, absorbs surge" },
            { ko: "ESD·서지 보호", en: "ESD / surge protection" },
          ],
        ],
      },
    },
  ],
  pitfall: {
    ko: "쇼트키의 낮은 VF(효율)는 큰 역방향 누설전류와 맞바꾼 것 — 효율을 살 때 누설을 내줍니다. 강의가 미룬 부분: 쇼트키를 쓴 인버터 게이트 회로, MOSFET 바디 다이오드(역회복). 응용 회로는 자매 토픽 '다이오드 응용 회로'에서, 전사 원본의 STT 오인식(손방향→순방향, 강화→강하, 바이오스→바이어스)은 상단 대조표 참고.",
    en: "Schottky's low VF (efficiency) is traded for large reverse leakage — you buy efficiency by giving up leakage. Deferred by the lecture: the Schottky-based inverter gate circuit and the MOSFET body diode (recovery). Applied circuits live in the sibling topic 'diode circuits'; for STT errors in the raw transcript, check its correction table.",
  },
};
