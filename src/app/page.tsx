import { Hero } from "@/components/sections/Hero";
import { ClientesMarquee } from "@/components/sections/ClientesMarquee";
import { Problem } from "@/components/sections/Problem";
import { ElCamino } from "@/components/sections/ElCamino";
import { NeedsPaths } from "@/components/sections/NeedsPaths";
import { ComoTrabajamos } from "@/components/sections/ComoTrabajamos";
import { Ecosystems } from "@/components/sections/Ecosystems";
import { TiendaBiwov } from "@/components/sections/TiendaBiwov";
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
      <ClientesMarquee />
      <Problem />
      <ElCamino />
      <NeedsPaths />
      <ComoTrabajamos />
      <Ecosystems />
      <TiendaBiwov />
      <RoadmapStart />
      <FounderTeaser />
      <CaseStudies />
      <Testimonials />
      <Faq />
      <FinalCTA />
    </>
  );
}
