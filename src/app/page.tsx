import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { EcosystemExplainer } from "@/components/sections/EcosystemExplainer";
import { NeedsPaths } from "@/components/sections/NeedsPaths";
import { Ecosystems } from "@/components/sections/Ecosystems";
import { RoadmapStart } from "@/components/sections/RoadmapStart";
import { Process } from "@/components/sections/Process";
import { TechWall } from "@/components/sections/TechWall";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { BrandingGallery } from "@/components/sections/BrandingGallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <EcosystemExplainer />
      <NeedsPaths />
      <Ecosystems />
      <RoadmapStart />
      <Process />
      <TechWall />
      <CaseStudies />
      <BrandingGallery />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
