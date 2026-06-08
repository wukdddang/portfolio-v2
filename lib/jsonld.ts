/**
 * JSON-LD (schema.org) 구조화 데이터 빌더.
 * Google 리치 결과 · 지식 패널 · AI 검색이 페이지 의미를 이해하도록 돕는다.
 * 렌더는 components/JsonLd.tsx 가 <script type="application/ld+json"> 으로 주입.
 *
 * Person 은 @id 로 그래프 전역에서 단일 노드로 참조한다 (`${siteUrl}#person`).
 * locale 별 URL/언어를 채우되, person @id 는 locale 무관 단일 식별자로 둔다.
 */
import { personal } from "@/data/personal";
import { resumeContacts } from "@/data/resume";
import { type Project } from "@/data/projects";
import { pick } from "@/data/i18n";
import { siteUrl } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

const PERSON_ID = `${siteUrl}#person`;
const WEBSITE_ID = `${siteUrl}#website`;

/** 본인이 다루는 도메인/기술 — knowsAbout (지식 패널 시그널). */
const KNOWS_ABOUT = [
  "Web Development",
  "Full-stack Development",
  "Next.js",
  "NestJS",
  "TypeScript",
  "AI Engineering",
  "SAR (Synthetic Aperture Radar)",
  "InSAR",
  "Satellite Imagery",
  "Sentinel-1",
];

/** 인물 노드 — 모든 페이지 그래프가 공유하는 단일 @id. */
export function personNode(locale: Locale) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: pick(personal.name, locale),
    alternateName: locale === "ko" ? personal.name.en : personal.name.ko,
    url: `${siteUrl}/${locale}`,
    image: `${siteUrl}/${locale}/opengraph-image`,
    jobTitle: pick(personal.tagline, locale),
    description: pick(personal.subTagline, locale),
    email: `mailto:${resumeContacts.email}`,
    sameAs: [resumeContacts.github],
    knowsAbout: KNOWS_ABOUT,
    worksFor: {
      "@type": "Organization",
      name: "Lumir",
      alternateName: "루미르",
    },
  };
}

/** 홈: WebSite + Person 그래프. */
export function homeGraph(locale: Locale, title: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${siteUrl}/${locale}`,
        name: title,
        description,
        inLanguage: locale === "ko" ? "ko-KR" : "en-US",
        publisher: { "@id": PERSON_ID },
      },
      personNode(locale),
    ],
  };
}

/** 이력서: ProfilePage(mainEntity=Person) + Person 그래프. */
export function resumeGraph(locale: Locale, title: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        url: `${siteUrl}/${locale}/resume`,
        name: title,
        description,
        inLanguage: locale === "ko" ? "ko-KR" : "en-US",
        mainEntity: { "@id": PERSON_ID },
      },
      personNode(locale),
    ],
  };
}

/** 프로젝트 상세: BreadcrumbList + CreativeWork(author=Person) + Person 그래프. */
export function projectGraph(
  project: Project,
  locale: Locale,
  title: string,
  description: string,
) {
  const path = `/projects/${project.slug}`;
  const url = `${siteUrl}/${locale}${path}`;
  const keywords = project.keywords.map((kw) => pick(kw, locale)).join(", ");
  const projectsLabel = locale === "ko" ? "프로젝트" : "Projects";
  const homeLabel = locale === "ko" ? "홈" : "Home";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: homeLabel,
            item: `${siteUrl}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: projectsLabel,
            item: `${siteUrl}/${locale}/#projects`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: pick(project.title, locale),
            item: url,
          },
        ],
      },
      {
        "@type": "CreativeWork",
        "@id": url,
        url,
        name: title,
        headline: pick(project.title, locale),
        description,
        keywords,
        inLanguage: locale === "ko" ? "ko-KR" : "en-US",
        author: { "@id": PERSON_ID },
        creator: { "@id": PERSON_ID },
      },
      personNode(locale),
    ],
  };
}
