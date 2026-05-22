/**
 * 기술 스택 — 메인 직군 vs 학습 도메인 분리
 * Brain Trinity 자료 박스 + entities 페이지에서 추출
 */

export interface StackItem {
  name: string;
  note?: string;
}

export interface StackCategory {
  label: string;
  items: StackItem[];
}

export const mainStack: StackCategory[] = [
  {
    label: "프론트엔드",
    items: [
      { name: "TypeScript" },
      { name: "Next.js" },
      { name: "React" },
      { name: "Tailwind CSS" },
      { name: "Playwright (e2e)" },
    ],
  },
  {
    label: "백엔드",
    items: [
      { name: "NestJS" },
      { name: "CQRS", note: "@nestjs/cqrs" },
      { name: "TypeORM" },
      { name: "PostgreSQL" },
      { name: "pgmq", note: "PostgreSQL message queue" },
      { name: "DDD 5-layer", note: "domain / business / context / handlers / interfaces" },
      { name: "Jest + Testcontainers" },
    ],
  },
  {
    label: "인프라 · CI/CD",
    items: [
      { name: "Docker · docker-compose" },
      { name: "GitLab CI/CD", note: "0에서 구축 + 커스텀 메일" },
      { name: "Terraform IaC", note: "S3 양쪽 레시피" },
      { name: "Grafana + Prometheus", note: "백업 메트릭 textfile collector" },
      { name: "FastAPI", note: "분석 서버 (NestJS 연결)" },
    ],
  },
  {
    label: "AI 협업",
    items: [
      { name: "Claude Code", note: "메인 사고 파트너 · AI native 100%" },
      { name: "다중 agent 워크트리", note: "agent 1~4 병렬 + handoff 시스템" },
      { name: "Brain Trinity 위키", note: "Karpathy /raw 패턴 + skill 시스템" },
    ],
  },
];

export const learnedDomain: StackCategory[] = [
  {
    label: "SAR · 위성영상",
    items: [
      { name: "Sentinel-1 SAR" },
      { name: "ESA SNAP 12", note: "MicrowaveTBX (SAR)" },
      { name: "SNAPHU", note: "위상 언래핑" },
      { name: "MintPy", note: "SBAS 시계열" },
      { name: "ISCE2", note: "신규 트랙 — 속도 확보" },
      { name: "StaMPS PSI", note: "Octave + 12 patches" },
      { name: "DInSAR · SBAS · PSInSAR" },
      { name: "PyAPS + ERA5", note: "대기 보정" },
      { name: "CDSE", note: "Copernicus Data Space" },
    ],
  },
  {
    label: "도메인 도구",
    items: [
      { name: "QGIS" },
      { name: "Python (분석)", note: "rasterio · geopandas · shapely" },
      { name: "Snappy", note: "SNAP Python bridge" },
    ],
  },
];

export const future = [
  "임베디드 (예정)",
  "하드웨어 (자연 확장 예측)",
  "로보틱스 (산업 전환 도전)",
];
