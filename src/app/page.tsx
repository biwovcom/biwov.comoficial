import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { ElCamino } from "@/components/sections/ElCamino";
import { NeedsPaths } from "@/components/sections/NeedsPaths";
import { ComoTrabajamos } from "@/components/sections/ComoTrabajamos";
import { Ecosystems } from "@/components/sections/Ecosystems";
import { Complementos } from "@/components/sections/Complementos";
import { RoadmapStart } from "@/components/sections/RoadmapStart";
import { FounderTeaser } from "@/components/sections/FounderTeaser";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <ElCamino />
      <NeedsPaths />
      <ComoTrabajamos />
      <Ecosystems />
      <Complementos />
      <RoadmapStart />
      <FounderTeaser />
      <CaseStudies />
      <Testimonials />
      <Faq />
      <FinalCTA />
    </>
  );
}
