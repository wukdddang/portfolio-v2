import type { TopicDetail } from "../../types";

export const acDcFrequency: TopicDetail = {
  tldr: {
    ko: "전기에는 두 종류가 있습니다. 직류(DC)는 전압이 시간이 지나도 일정한 것(건전지), 교류(AC)는 시간에 따라 +와 −로 출렁이는 것(콘센트)이고, 그 출렁임의 기본 모양이 정현파(사인파)입니다. 정현파는 $v(t) = V_p \\sin(2\\pi f t + \\varphi)$ 한 줄로 진폭·주파수·위상이 정해지고, 여기서 주파수 $f$(Hz, 초당 출렁임 수), 주기 $T = 1/f$, 각주파수 $\\omega = 2\\pi f$가 나옵니다. 실효값 $V_{rms} = V_p/\\sqrt{2}$가 'AC의 진짜 일하는 전압'이라(우리 집 220V는 사실 피크 311V) 정류·필터·PWM이 전부 이 위에 서 있습니다.",
    en: "Electricity comes in two kinds. DC keeps a steady voltage over time (a battery); AC swings + and − over time (a wall outlet), and the base shape of that swing is the sine wave. A sine is fixed in one line $v(t) = V_p \\sin(2\\pi f t + \\varphi)$, giving frequency $f$ (Hz, swings per second), period $T = 1/f$, and angular frequency $\\omega = 2\\pi f$. The RMS value $V_{rms} = V_p/\\sqrt{2}$ is AC's 'real working voltage' (your 220V outlet actually peaks at 311V), and rectification, filtering, and PWM all build on this.",
  },
  sections: [
    {
      heading: { ko: "DC와 AC, 그림으로 보기", en: "DC and AC, as a picture" },
      bullets: [
        {
          ko: "직류(DC)는 전압이 시간이 흘러도 변하지 않는 것입니다 — 그래프로 그리면 그냥 수평선이고, 건전지·USB·로직 전원이 여기 속합니다. 킥보드 배터리($32\\sim45\\,\\text{V}$)도 DC입니다.",
          en: "DC means the voltage doesn't change over time — on a graph it's just a flat line. Batteries, USB, and logic rails are DC, and the kickboard pack ($32\\sim45\\,\\text{V}$) is too.",
        },
        {
          ko: "교류(AC)는 전압이 시간에 따라 +와 −를 오가며 출렁이는 것입니다 — 아래 곡선처럼요. 집 콘센트, 오디오 신호, 모터 구동 전류가 AC입니다. 출렁임의 기본 모양이 부드러운 사인 곡선, 즉 정현파입니다.",
          en: "AC means the voltage swings between + and − over time — like the curve below. Wall outlets, audio signals, and motor-drive currents are AC. The base shape of that swing is the smooth sine curve.",
        },
      ],
      diagram: {
        kind: "plot",
        caption: { ko: "DC는 수평선, AC는 출렁이는 사인 곡선", en: "DC is a flat line, AC is a swinging sine" },
        xLabel: { ko: "시간 t →", en: "time t →" },
        yLabel: { ko: "전압", en: "voltage" },
        series: [
          { label: { ko: "AC 교류 (정현파)", en: "AC (sine)" }, curve: "sine", tone: "accent" },
          { label: { ko: "DC 직류", en: "DC" }, curve: "dc", tone: 2 },
        ],
      },
    },
    {
      heading: { ko: "정현파 한 줄로 읽기", en: "Reading the sine in one line" },
      bullets: [
        {
          ko: "출렁이는 AC 한 곡선은 딱 세 가지 숫자로 완전히 정해집니다: 얼마나 크게(진폭 $V_p$), 얼마나 빨리(주파수 $f$), 언제 시작하는지(위상 $\\varphi$). 이걸 식 하나로 묶은 게 $v(t) = V_p \\sin(2\\pi f t + \\varphi)$입니다.",
          en: "One swinging AC curve is fully fixed by just three numbers: how big (amplitude $V_p$), how fast (frequency $f$), and when it starts (phase $\\varphi$). One equation ties them together: $v(t) = V_p \\sin(2\\pi f t + \\varphi)$.",
        },
        {
          ko: "여기서 위상 $\\varphi$가 바로 임피던스 페이지의 $j$가 가리키던 '타이밍 어긋남'입니다 — 두 신호가 같은 주파수라도 시작 시점이 다르면 위상차가 생깁니다.",
          en: "That phase $\\varphi$ is exactly the 'timing offset' the $j$ on the impedance page pointed to — two signals at the same frequency can still start at different moments, giving a phase difference.",
        },
      ],
      diagram: {
        kind: "formula",
        expr: "v(t) = V_p \\sin(2\\pi f t + \\varphi)",
        caption: { ko: "정현파를 정하는 세 가지", en: "the three knobs of a sine" },
        legend: [
          { sym: "V_p", desc: { ko: "진폭 — 얼마나 크게 (꼭대기 높이)", en: "amplitude — how big (peak)" } },
          { sym: "f", desc: { ko: "주파수 — 얼마나 빨리 (Hz)", en: "frequency — how fast (Hz)" } },
          { sym: "\\varphi", desc: { ko: "위상 — 언제 시작 (타이밍)", en: "phase — when it starts (timing)" } },
        ],
      },
    },
    {
      heading: { ko: "주기·주파수·각주파수 — 같은 걸 다르게 부르기", en: "Period, frequency, angular frequency — same thing, three names" },
      bullets: [
        {
          ko: "한 번 출렁이는 데 걸리는 시간이 주기 $T$(초), 1초에 몇 번 출렁이냐가 주파수 $f$(Hz)입니다. 둘은 서로 뒤집은 관계라 $f = 1/T$입니다. 예를 들어 한국 전기는 $50\\,\\text{Hz}$, 즉 한 번 출렁이는 데 $T = 1/50 = 20\\,\\text{ms}$ 걸립니다.",
          en: "The time for one swing is the period $T$ (seconds); how many swings per second is the frequency $f$ (Hz). They're inverses, so $f = 1/T$. Korea's grid is $50\\,\\text{Hz}$, so one swing takes $T = 1/50 = 20\\,\\text{ms}$.",
        },
        {
          ko: "여기에 각주파수 $\\omega = 2\\pi f$가 더 있는데, 사인 함수가 라디안(각도)으로 도니까 $2\\pi$를 곱한 것뿐입니다. 이 $\\omega$가 임피던스 공식 $X_C = 1/(\\omega C)$, $X_L = \\omega L$에 그대로 나옵니다 — 그래서 주파수가 임피던스의 전제입니다.",
          en: "There's also angular frequency $\\omega = 2\\pi f$ — just $f$ times $2\\pi$ because the sine runs in radians. This $\\omega$ shows up verbatim in $X_C = 1/(\\omega C)$ and $X_L = \\omega L$ — which is why frequency underlies impedance.",
        },
      ],
      diagram: {
        kind: "compare",
        caption: { ko: "50Hz를 예로 — 같은 정보의 세 얼굴", en: "at 50 Hz — three faces of one fact" },
        headers: [
          { ko: "양", en: "Quantity" },
          { ko: "식", en: "Formula" },
          { ko: "50Hz일 때", en: "at 50 Hz" },
        ],
        rows: [
          [
            { ko: "주기 T", en: "Period T" },
            { ko: "T = 1/f (초)", en: "T = 1/f (s)" },
            { ko: "20 ms", en: "20 ms" },
          ],
          [
            { ko: "주파수 f", en: "Frequency f" },
            { ko: "f = 1/T (Hz)", en: "f = 1/T (Hz)" },
            { ko: "50 Hz", en: "50 Hz" },
          ],
          [
            { ko: "각주파수 ω", en: "Angular ω" },
            { ko: "ω = 2πf (rad/s)", en: "ω = 2πf (rad/s)" },
            { ko: "≈ 314", en: "≈ 314" },
          ],
        ],
      },
    },
    {
      heading: { ko: "RMS — AC의 '진짜 전압'", en: "RMS — AC's 'real voltage'" },
      bullets: [
        {
          ko: "AC는 +와 −를 똑같이 오가니까 단순 평균을 내면 $0$이 됩니다 — 그런데 전열기는 분명 뜨거워지죠. 그래서 '발열로 따졌을 때 같은 일을 하는 DC 전압'을 따로 정의한 게 실효값(RMS)입니다.",
          en: "AC swings + and − equally, so its plain average is $0$ — yet a heater clearly gets hot. So we define RMS separately: 'the DC voltage that would do the same work measured by heating.'",
        },
        {
          ko: "정현파의 경우 $V_{rms} = \\dfrac{V_p}{\\sqrt{2}} \\approx 0.707\\,V_p$입니다. 우리 집 콘센트 '220V'는 사실 이 RMS 값이고, 실제 꼭대기(피크)는 $220 \\times \\sqrt{2} \\approx 311\\,\\text{V}$까지 올라갑니다. 그래서 부품 내압은 RMS가 아니라 피크 기준으로 골라야 안 터집니다.",
          en: "For a sine, $V_{rms} = \\dfrac{V_p}{\\sqrt{2}} \\approx 0.707\\,V_p$. The '220V' at your outlet is this RMS value; the actual peak reaches $220 \\times \\sqrt{2} \\approx 311\\,\\text{V}$. So choose a part's voltage rating against the peak, not the RMS, or it blows.",
        },
      ],
      diagram: {
        kind: "formula",
        expr: "V_{rms} = \\dfrac{V_p}{\\sqrt{2}} \\approx 0.707\\,V_p",
        caption: { ko: "220V(RMS)의 피크는 ≈311V", en: "220V (RMS) peaks at ≈311V" },
        legend: [
          { sym: "V_p", desc: { ko: "피크 — 실제 꼭대기 (부품 내압 기준)", en: "peak — true top (rate parts here)" } },
          { sym: "V_{rms}", desc: { ko: "실효값 — 발열 기준 등가 DC", en: "RMS — heating-equivalent DC" } },
        ],
      },
    },
    {
      heading: { ko: "정류 — AC를 DC로 바꾸기", en: "Rectification — turning AC into DC" },
      bullets: [
        {
          ko: "회로 대부분은 일정한 DC가 필요한데 벽에서 들어오는 건 출렁이는 AC입니다. 그래서 다이오드(한 방향으로만 흐르는 부품)로 −쪽을 잘라내면, 아래 그래프처럼 +쪽만 남은 울퉁불퉁한 '맥동 DC'가 됩니다.",
          en: "Most circuits need steady DC, but the wall gives swinging AC. So a diode (a one-way part) chops off the − side, leaving only the + humps — the bumpy 'pulsing DC' shown below.",
        },
        {
          ko: "이 맥동을 커패시터로 매끈하게 펴주면(평활) 비로소 회로가 쓸 수 있는 DC가 됩니다. 정류·필터가 전부 'AC의 모양과 주파수'를 다루는 일이라, 이 페이지가 그 바닥에 깔립니다.",
          en: "Smooth those humps with a capacitor (filtering) and you finally get DC a circuit can use. Rectification and filtering are all about 'the shape and frequency of AC,' so this page sits underneath them.",
        },
      ],
      diagram: {
        kind: "plot",
        caption: { ko: "정류 후 — −쪽이 잘려 +방향 맥동만 남는다", en: "After rectifying — only + humps remain" },
        xLabel: { ko: "시간 t →", en: "time t →" },
        yLabel: { ko: "전압", en: "voltage" },
        series: [{ label: { ko: "정류된 맥동 DC", en: "rectified pulsing DC" }, curve: "rectified", tone: "accent" }],
      },
    },
    {
      heading: { ko: "한눈에 — AC에서 매끈한 DC까지", en: "At a glance — from AC to clean DC" },
      bullets: [
        {
          ko: "콘센트 AC → 다이오드 정류(한 방향만) → 맥동 DC → 커패시터 평활 → 매끈한 DC. 이 흐름이 거의 모든 전원 어댑터 안에서 일어나는 일입니다.",
          en: "Outlet AC → diode rectify (one way only) → pulsing DC → capacitor smoothing → clean DC. This flow happens inside nearly every power adapter.",
        },
        {
          ko: "PWM·스위칭 전원도 결국 'DC를 빠르게 껐다 켰다 해서 평균값을 만들고 고주파 성분은 필터로 거르는' 일이라, 똑같이 주파수 위의 이야기입니다.",
          en: "PWM and switching supplies are likewise 'toggle DC fast to set an average, then filter out the high-frequency parts' — again, a story told on the frequency axis.",
        },
      ],
      diagram: {
        kind: "flow",
        dir: "row",
        caption: { ko: "전원 어댑터 안에서 일어나는 일", en: "what happens inside a power adapter" },
        nodes: [
          { label: { ko: "AC 입력", en: "AC in" }, sub: { ko: "±, 정현파", en: "±, sine" } },
          { label: { ko: "다이오드 정류", en: "diode rectify" }, sub: { ko: "한 방향만", en: "one way" } },
          { label: { ko: "맥동 DC", en: "pulsing DC" }, sub: { ko: "+만 남음", en: "+ humps" } },
          { icon: "🔋", label: { ko: "커패시터 평활", en: "cap smoothing" }, sub: { ko: "매끈한 DC", en: "clean DC" }, tone: "accent" },
        ],
      },
    },
  ],
  pitfall: {
    ko: "'전압'이라고 하면 그게 피크($V_p$)인지 실효값($V_{rms}$)인지 항상 구분하세요 — 데이터시트 내압은 보통 피크, 콘센트·계측기 표기는 보통 RMS입니다. 둘은 $\\sqrt{2}\\approx 1.41$배 차이라, 헷갈리면 부품이 그냥 터집니다. 그리고 주파수 $f$와 각주파수 $\\omega$를 섞지 마세요 — 임피던스 공식에 들어가는 건 $\\omega = 2\\pi f$ 쪽입니다.",
    en: "When you say 'voltage,' always pin down peak ($V_p$) vs RMS ($V_{rms}$) — datasheet ratings are usually peak, outlets and meters usually RMS. They differ by $\\sqrt{2}\\approx 1.41\\times$, so confusing them just blows the part. And don't mix frequency $f$ with angular frequency $\\omega$ — the one that goes into impedance formulas is $\\omega = 2\\pi f$.",
  },
};
