import { personal } from "@/data/personal";
import { projects } from "@/data/projects";
import { studies } from "@/data/studies";
import { faq } from "@/data/faq";
import { pick } from "@/data/i18n";
import { siteUrl } from "@/lib/site";

/**
 * /llms.txt — LLM·AI 검색 크롤러용 사이트 요약 (llmstxt.org 규약).
 * 사람용 HTML과 별개로, AI가 "우창욱이 누구인지·무엇을 만들었는지"를 한 파일에서
 * 정확히 파악하도록 핵심 페이지·프로젝트·학습 로그·FAQ를 평문 마크다운으로 제공한다.
 * 데이터(personal/projects/studies/faq)에서 동적 생성 → 콘텐츠와 항상 동기화.
 *
 * 정적 생성(force-static): 요청마다 계산할 필요 없는 정적 자료.
 */
export const dynamic = "force-static";

// next.config.ts에서 301 redirect되는 슬러그 — 캐노니컬 페이지만 노출 (sitemap.ts와 동일 기준)
const REDIRECTED_SLUGS = new Set([
  "sar-data-retrieval",
  "lumir-linux-snap",
  "sar-search-and-analyzer",
]);

const L = "en" as const; // llms.txt 본문은 영어 기준 (사이트는 ko/en 양국어 제공)

export async function GET() {
  const url = (path: string) => `${siteUrl}/${L}${path}`;

  const projectLines = projects
    .filter((p) => !REDIRECTED_SLUGS.has(p.slug))
    .map((p) => `- [${pick(p.title, L)}](${url(`/projects/${p.slug}`)}): ${pick(p.subtitle, L)}`)
    .join("\n");

  const studyLines = studies
    .map((s) => `- [${pick(s.title, L)}](${url(`/studies/${s.slug}`)}): ${pick(s.tagline, L)}`)
    .join("\n");

  const faqLines = faq
    .map((f) => `### ${pick(f.q, L)}\n${pick(f.a, L)}`)
    .join("\n\n");

  const body = `# ${pick(personal.name, L)} (${personal.name.ko}) — ${pick(personal.tagline, L)}

> ${pick(personal.subTagline, L)}.

${pick(personal.identity, L)}

This site is available in Korean (/ko) and English (/en).

## Key pages
- [Portfolio home](${url("")}): overview, AI-usage coordinates, projects, tech stack, FAQ.
- [Resume](${url("/resume")}): full professional background and contact.

## Projects
${projectLines}

## Study logs
${studyLines}

## FAQ
${faqLines}

## Contact
- Email: ${personal.contacts.email}
- GitHub: ${personal.contacts.github}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
