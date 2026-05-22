import { Hero } from "@/components/Hero";
import { Coordinates } from "@/components/Coordinates";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { TechStack } from "@/components/TechStack";
import { About } from "@/components/About";

export default function HomePage() {
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
