/**
 * siteUrl — Vercel · 로컬 · 사용자 지정 우선순위로 사이트 절대 URL 결정.
 * Vercel 빌드 시 VERCEL_PROJECT_PRODUCTION_URL이 자동 주입되어 prod 도메인을 잡는다.
 * 명시적으로 덮어쓰려면 NEXT_PUBLIC_SITE_URL 사용 (커스텀 도메인 연결 후 권장).
 */
export const siteUrl: string = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return `https://${vercelProd}`;
  const vercelAny = process.env.VERCEL_URL;
  if (vercelAny) return `https://${vercelAny}`;
  return "http://localhost:3000";
})();

export const siteHost: string = siteUrl.replace(/^https?:\/\//, "");
