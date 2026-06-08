import { setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { projects } from "@/data/projects";
import { pick } from "@/data/i18n";
import { MergedDiagram, NestedDiagram } from "@/components/lab/LabDiagrams";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: "Diagram Lab",
  robots: { index: false, follow: false },
};

export default async function DiagramLabPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const project = projects.find((p) => p.slug === "lumir-sar-platform");
  if (!project) return null;

  return (
    <article className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12 lg:px-16 pt-24 pb-32">
        <Link
          href="/projects/lumir-sar-platform"
          className="mb-10 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="size-4" />
          lumir-sar-platform
        </Link>

        <div className="mb-12">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
            diagram lab · 실험용 (비공개)
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-5xl">
            4개 다이어그램 통합 — 두 가지 방식 프로토타입
          </h1>
          <p className="max-w-3xl leading-relaxed text-[var(--muted)]">
            {pick(project.title, locale)}의 히어로 + 저장·분석·프론트 3 레이어
            다이어그램(총 4개)을 하나로 합치는 두 접근을 나란히 실험합니다. 현재
            프로덕션 페이지(드릴인 줌)와 별개이며, 여기서 마음에 드는 방식을 고르면
            본 페이지에 반영합니다.
          </p>
        </div>

        {/* ① 평면 통합 */}
        <section className="mb-16">
          <div className="mb-4">
            <h2 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">
              ① 평면 통합 (flat 4-in-1)
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
              3 레이어 상세를 한 평면에 세로로 펼치고, 레이어 사이를 통합 흐름
              다리(②~⑤)로 연결합니다. 모든 노드가 동시에 보이고, 드래그·줌으로
              탐색합니다. 정보 밀도가 가장 높습니다.
            </p>
          </div>
          <MergedDiagram project={project} />
        </section>

        {/* ② 중첩 (Parabox) */}
        <section>
          <div className="mb-4">
            <h2 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">
              ② 중첩 — Patrick&apos;s Parabox식
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
              각 레이어가 하나의 &ldquo;박스&rdquo;이고, 그 박스{" "}
              <em>안에</em> 해당 레이어의 하위 다이어그램이 실제로 중첩되어 있습니다
              (React Flow parent/child 서브플로우). 박스를 클릭하면 그 안으로 줌인,
              <span className="font-mono"> ⌂ 전체 보기</span>로 복귀합니다.
            </p>
          </div>
          <NestedDiagram project={project} />
        </section>
      </div>
    </article>
  );
}
