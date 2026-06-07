/**
 * OG image용 Pretendard 폰트 fetch.
 * Satori(next/og 내부)는 woff2 미지원 — woff v1을 명시적으로 받아야 한글 글리프가 렌더된다.
 */
const PRETENDARD_BASE =
  "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff";

export async function loadOgFonts() {
  const [regular, bold] = await Promise.all([
    fetch(`${PRETENDARD_BASE}/Pretendard-Regular.woff`).then((r) => r.arrayBuffer()),
    fetch(`${PRETENDARD_BASE}/Pretendard-Bold.woff`).then((r) => r.arrayBuffer()),
  ]);
  return [
    { name: "Pretendard", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Pretendard", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;
