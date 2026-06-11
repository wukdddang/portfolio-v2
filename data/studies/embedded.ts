import type { Study } from "./types";
import { embeddedJournal } from "./journal/embedded";
import { capacitor } from "./details/embedded/capacitor";
import { componentMap } from "./details/embedded/component-map";
import { inductorTypes } from "./details/embedded/inductor-types";
import { kvlKcl } from "./details/embedded/kvl-kcl";
import { ohmsLaw } from "./details/embedded/ohms-law";
import { voltageDrop } from "./details/embedded/voltage-drop";

export const embedded: Study = {
    slug: "embedded",
    icon: "🔌",
    title: { ko: "임베디드 · 전자공학", en: "Embedded · Electronics" },
    tagline: {
      ko: "웹 풀스택에 하드웨어 축을 더하는 18토픽 로드맵 학습 로그",
      en: "An 18-topic roadmap study log adding a hardware axis to a web full-stack profile",
    },
    motive: {
      ko: "위성 회사에서 일하다 보면 소프트웨어 아래의 하드웨어 — 모터 제어, 인버터, MCU — 와 계속 마주칩니다. 풀스택의 다음 확장으로 임베디드를 골랐고, 전동킥보드 실전 프로젝트(STM32·3상 인버터·BLDC)를 골격 삼아 회로 기초부터 제어 이론까지 18토픽을 채워가고 있습니다.",
      en: "Working at a satellite company, you keep meeting the hardware beneath the software — motor control, inverters, MCUs. I picked embedded as the next full-stack extension, and I'm filling an 18-topic roadmap from circuit basics to control theory, scaffolded by a hands-on e-kickboard project (STM32 · 3-phase inverter · BLDC).",
    },
    method: {
      ko: "강의·교재를 AI 대화로 분해해 학습하고 Brain Trinity 위키로 컴파일합니다. 강의 녹음을 전사해 위키화하는 루틴까지 — SAR 학습과 같은 패턴입니다.",
      en: "Lectures and textbooks get decomposed through AI dialog, then compiled into the Brain Trinity wiki — down to a routine of transcribing lecture recordings into wiki pages. Same pattern as the SAR study.",
    },
    stats: [
      { label: { ko: "로드맵", en: "Roadmap" }, value: { ko: "18토픽 · 4블록", en: "18 topics · 4 blocks" } },
      { label: { ko: "위키 컴파일", en: "Wiki compiled" }, value: { ko: "6페이지 (진행 중)", en: "6 pages (ongoing)" } },
      { label: { ko: "본 강의", en: "Main course" }, value: { ko: "153강 · 16.5h", en: "153 lectures · 16.5 h" } },
    ],
    journal: embeddedJournal,
    timeline: [
      {
        period: "2026.06 – 07",
        title: { ko: "선수 지식", en: "Prerequisites" },
        desc: { ko: "회로이론 기초 18토픽 + C 복습", en: "18 circuit-theory topics + C refresher" },
        status: "doing",
      },
      {
        period: "2026.08 – 10",
        title: { ko: "본 강의 — 킥보드 프로젝트", en: "Main course — kickboard project" },
        desc: {
          ko: "STM32F767 · 3상 인버터 · BLDC · 4-Layer PCB",
          en: "STM32F767 · 3-phase inverter · BLDC · 4-layer PCB",
        },
        status: "todo",
      },
      {
        period: "2026.11 – 12",
        title: { ko: "정리 · 증거화", en: "Consolidate & evidence" },
        desc: { ko: "위키 정리 + 포트폴리오 반영", en: "Wiki cleanup + portfolio integration" },
        status: "todo",
      },
    ],
    blocks: [
      {
        title: { ko: "회로 기초 (#1–6)", en: "Circuit basics (#1–6)" },
        desc: {
          ko: "모든 계산의 출발점 — 옴·키르히호프·분배.",
          en: "Where every calculation starts — Ohm, Kirchhoff, dividers.",
        },
        cat: 2,
        topics: [
          {
            icon: "⚡",
            title: { ko: "옴의 법칙", en: "Ohm's law" },
            summary: {
              ko: "전압=수압·전류=물살·저항=좁은 관 비유로 직관을 잡고, 모터 코일·LED·션트 저항 계산까지. 배선 저항도 무시하면 발열로 돌아옵니다.",
              en: "Voltage as pressure, current as flow, resistance as a narrow pipe — intuition first, then motor-coil/LED/shunt calculations. Ignore wiring resistance and it comes back as heat.",
            },
            tags: [{ ko: "V=IR", en: "V=IR" }],
            status: "done",
            wikiSlug: "embedded-ohms-law",
            slug: "ohms-law",
            detail: ohmsLaw,
          },
          {
            icon: "🔀",
            title: { ko: "키르히호프 법칙 (KVL·KCL)", en: "Kirchhoff's laws (KVL · KCL)" },
            summary: {
              ko: "노드 전류 보존(KCL)과 폐회로 전압 보존(KVL) — 배터리→3상 분배, MOSFET 드라이버 전압 추적의 기본 도구.",
              en: "Current conserved at nodes (KCL), voltage conserved around loops (KVL) — the basic tools for tracing battery→3-phase distribution and MOSFET driver voltages.",
            },
            tags: [
              { ko: "KVL", en: "KVL" },
              { ko: "KCL", en: "KCL" },
            ],
            status: "done",
            wikiSlug: "embedded-kvl-kcl",
            slug: "kvl-kcl",
            detail: kvlKcl,
          },
          {
            icon: "📉",
            title: { ko: "전압 강하", en: "Voltage drop" },
            summary: {
              ko: "부품을 지나며 V=IR만큼 깎이는 전압 — 배선·MOSFET Rds(on)·션트·배터리 내부저항에서의 강하가 발열과 출력 약화로 이어집니다.",
              en: "Voltage shaved off by V=IR across each part — drops in wiring, MOSFET Rds(on), shunts and battery internal resistance turn into heat and lost output.",
            },
            tags: [
              { ko: "Rds(on)", en: "Rds(on)" },
              { ko: "발열", en: "Heat" },
            ],
            status: "done",
            wikiSlug: "embedded-voltage-drop",
            slug: "voltage-drop",
            detail: voltageDrop,
          },
          {
            icon: "🧮",
            title: { ko: "직병렬 · 전압 분배 · RC 시정수 · 전력", en: "Series/parallel · dividers · RC · power" },
            summary: {
              ko: "다음 차례 — 배터리 ADC 분압(32~45V→1.8~2.6V) 같은 실전 계산으로 바로 이어지는 블록 잔여 토픽들.",
              en: "Up next — the block's remaining topics, leading straight into practical work like the battery ADC divider (32–45 V → 1.8–2.6 V).",
            },
            tags: [{ ko: "#3–6", en: "#3–6" }],
            status: "todo",
          },
        ],
      },
      {
        title: { ko: "소자 (#7–11)", en: "Components (#7–11)" },
        desc: {
          ko: "회로도를 읽게 해주는 부품 지도.",
          en: "The component map that makes schematics readable.",
        },
        cat: 6,
        topics: [
          {
            icon: "🔋",
            title: { ko: "커패시터 실전 용도", en: "Capacitors in practice" },
            summary: {
              ko: "킥보드 입력단 940µF 전해부터 IC 전원핀 옆 0.1µF MLCC까지 — 디커플링/바이패스 구분, RC 필터 fc=1/2πRC, 공진점 너머는 인덕터처럼 변하는 임피던스.",
              en: "From the 940 µF electrolytic at the kickboard input to the 0.1 µF MLCC at the IC power pin — decoupling vs bypass, RC filter fc=1/2πRC, and impedance turning inductive past resonance.",
            },
            tags: [
              { ko: "MLCC", en: "MLCC" },
              { ko: "디커플링", en: "Decoupling" },
              { ko: "공진점", en: "Resonance" },
            ],
            status: "done",
            wikiSlug: "embedded-capacitor-uses",
            slug: "capacitor",
            detail: capacitor,
          },
          {
            icon: "🗺",
            title: { ko: "실무 회로 기본 소자 지도", en: "Practical component map" },
            summary: {
              ko: "강의 섹션3(71p) 컴파일 — 저항·커패시터·인덕터, 다이오드 5종, BJT, 3상 인버터의 핵심 MOSFET, 벅/부스트 전원까지 한 장의 지도.",
              en: "Compiled from the course's 71-page section 3 — resistors, capacitors, inductors, five diode types, BJTs, the MOSFETs at the heart of a 3-phase inverter, and buck/boost supplies on one map.",
            },
            tags: [
              { ko: "다이오드 5종", en: "5 diode types" },
              { ko: "MOSFET", en: "MOSFET" },
              { ko: "벅 컨버터", en: "Buck converter" },
            ],
            status: "done",
            wikiSlug: "embedded-circuit-components",
            slug: "component-map",
            detail: componentMap,
          },
          {
            icon: "🧲",
            title: { ko: "인덕터의 종류", en: "Types of inductors" },
            summary: {
              ko: "역기전력으로 전류 변화에 저항하는 소자. 같은 인덕터라도 파워 인덕터는 에너지를 저장하고(½Li²), 페라이트 비드는 고주파에서 저항처럼 노이즈를 열로 태웁니다. 변압기의 진짜 가치는 턴수비가 아니라 전기적 절연.",
              en: "A component that resists current change via back-EMF. The same inductor stores energy as a power inductor (½Li²) but, as a ferrite bead, acts like a resistor at high frequency to burn noise off as heat. A transformer's real value isn't the turns ratio — it's electrical isolation.",
            },
            tags: [
              { ko: "파워 인덕터", en: "Power inductor" },
              { ko: "페라이트 비드", en: "Ferrite bead" },
              { ko: "변압기 절연", en: "Transformer isolation" },
            ],
            status: "done",
            wikiSlug: "embedded-inductor-types",
            slug: "inductor-types",
            detail: inductorTypes,
          },
          {
            icon: "🔬",
            title: { ko: "다이오드·BJT·MOSFET 심화", en: "Diode · BJT · MOSFET deep-dives" },
            summary: {
              ko: "소자 지도에서 한 장씩 떼어 심화 — 다이오드 5종, BJT, 그리고 인버터 핵심 MOSFET의 스위칭 손실 같은 실전 수치 중심으로.",
              en: "Peeling one component at a time off the map — five diode types, BJTs, and practical numbers like the switching losses of the MOSFETs at the heart of the inverter.",
            },
            tags: [{ ko: "#9–11", en: "#9–11" }],
            status: "todo",
          },
        ],
      },
      {
        title: { ko: "전원·구동 (#12–14)", en: "Power & drive (#12–14)" },
        desc: {
          ko: "모터를 실제로 돌리는 회로.",
          en: "The circuits that actually spin the motor.",
        },
        cat: 4,
        topics: [
          {
            icon: "🔧",
            title: { ko: "PWM · 브리지 회로 · 벅 컨버터", en: "PWM · bridge circuits · buck converter" },
            summary: {
              ko: "하프/풀브리지와 PWM 듀티로 전력을 조절하고, 벅 컨버터로 강압하는 — 인버터 하드웨어의 골격.",
              en: "Half/full bridges and PWM duty to shape power, a buck converter to step down — the skeleton of inverter hardware.",
            },
            tags: [
              { ko: "PWM", en: "PWM" },
              { ko: "하프/풀브리지", en: "Half/full bridge" },
            ],
            status: "todo",
          },
        ],
      },
      {
        title: { ko: "제어 (#15–18)", en: "Control (#15–18)" },
        desc: {
          ko: "도는 모터를 원하는 대로 — 제어 이론.",
          en: "Making the spinning motor do what you want — control theory.",
        },
        cat: 5,
        topics: [
          {
            icon: "🎛",
            title: { ko: "피드백 · PID · 3상 BLDC 구동", en: "Feedback · PID · 3-phase BLDC drive" },
            summary: {
              ko: "피드백 루프, PID 게인, 정상상태 오차·오버슈트, 그리고 6-step commutation까지 — 킥보드가 굴러가는 마지막 블록.",
              en: "Feedback loops, PID gains, steady-state error and overshoot, through 6-step commutation — the final block that makes the kickboard roll.",
            },
            tags: [
              { ko: "PID", en: "PID" },
              { ko: "commutation", en: "Commutation" },
            ],
            status: "todo",
          },
        ],
      },
    ],
    practice: {
      title: { ko: "골격 프로젝트 — 전동킥보드 임베디드", en: "Scaffold project — e-kickboard embedded" },
      lede: {
        ko: "이론을 매달 골격 — 실제 키트가 굴러가는 실전 프로젝트입니다.",
        en: "The scaffold the theory hangs on — a hands-on project where a real kit ends up rolling.",
      },
      items: [
        {
          title: { ko: "STM32F767 펌웨어 + 3상 인버터 + BLDC", en: "STM32F767 firmware + 3-phase inverter + BLDC" },
          desc: {
            ko: "153강·16.5h 실전 강의 — 인휠모터 키트로 하드웨어부터 펌웨어까지",
            en: "A 153-lecture · 16.5 h hands-on course — hardware to firmware on an in-wheel motor kit",
          },
        },
        {
          title: { ko: "4-Layer PCB 설계 (EasyEDA)", en: "4-layer PCB design (EasyEDA)" },
          desc: {
            ko: "인버터 하드웨어 설계 → PCB 설계 → 부품 실장의 전체 사이클",
            en: "The full cycle from inverter hardware design to PCB layout to assembly",
          },
        },
        {
          title: { ko: "강의 자료 11종 + 회로이론 교재", en: "11 course PDFs + circuit-theory textbook" },
          desc: {
            ko: "수집한 PDF·강의 전사 원본은 Brain Trinity raw에, 정제된 개념은 위키에 축적",
            en: "Collected PDFs and lecture transcripts live in Brain Trinity raw; distilled concepts accumulate in the wiki",
          },
        },
      ],
    },
  };
