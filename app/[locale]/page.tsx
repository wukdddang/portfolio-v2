import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { PipelineSection } from "@/components/PipelineSection";
import { Coordinates } from "@/components/Coordinates";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { TechStack } from "@/components/TechStack";
import { About } from "@/components/About";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { homeGraph } from "@/lib/jsonld";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "metadata" });
  return (
    <>
      <JsonLd data={homeGraph(locale, t("homeTitle"), t("homeDescription"))} />
      <Hero />
      <PipelineSection />
      <Coordinates />
      <ProjectsGrid />
      <TechStack />
      <FaqSection />
      <About />
    </>
  );
}
