import { Hero } from "@/components/sections/Hero";
import { Manifiesto } from "@/components/sections/Manifiesto";
import { MarcasCarrusel } from "@/components/sections/MarcasCarrusel";
import { ServiciosSimples } from "@/components/sections/ServiciosSimples";
import { NeedsPaths } from "@/components/sections/NeedsPaths";
import { ComoTrabajamos } from "@/components/sections/ComoTrabajamos";
import { FounderTeaser } from "@/components/sections/FounderTeaser";
import { Faq } from "@/components/sections/Faq";
import { BlogTeaser } from "@/components/sections/BlogTeaser";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifiesto />
      <MarcasCarrusel />
      <ServiciosSimples />
      <NeedsPaths />
      <ComoTrabajamos />
      <FounderTeaser />
      <Faq />
      <BlogTeaser />
      <FinalCTA />
    </>
  );
}
