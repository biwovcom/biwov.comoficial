import { Hero } from "@/components/sections/Hero";
import { Servicios } from "@/components/sections/Servicios";
import { ClientesMarquee } from "@/components/sections/ClientesMarquee";
import { Problem } from "@/components/sections/Problem";
import { ElCamino } from "@/components/sections/ElCamino";
import { NeedsPaths } from "@/components/sections/NeedsPaths";
import { ComoTrabajamos } from "@/components/sections/ComoTrabajamos";
import { TiendaTeaser } from "@/components/sections/TiendaTeaser";
import { RoadmapStart } from "@/components/sections/RoadmapStart";
import { FounderTeaser } from "@/components/sections/FounderTeaser";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Impacto } from "@/components/sections/Impacto";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Servicios />
      <ClientesMarquee />
      <Problem />
      <ElCamino />
      <NeedsPaths />
      <ComoTrabajamos />
      <TiendaTeaser />
      <RoadmapStart />
      <FounderTeaser />
      <CaseStudies />
      <Impacto />
      <Testimonials />
      <Faq />
      <FinalCTA />
    </>
  );
}
