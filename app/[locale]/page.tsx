import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { Coordinates } from "@/components/Coordinates";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { TechStack } from "@/components/TechStack";
import { About } from "@/components/About";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <Coordinates />
      <ProjectsGrid />
      <TechStack />
      <About />
    </>
  );
}
