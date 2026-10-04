import type { Metadata } from "next";
import { Hero } from "@/components/kathe/Hero";
import { Cifras } from "@/components/kathe/Cifras";
import { Historia } from "@/components/kathe/Historia";
import { MisionVision } from "@/components/kathe/MisionVision";
import { Trayectoria } from "@/components/kathe/Trayectoria";
import { ComoTrabajo } from "@/components/kathe/ComoTrabajo";
import { Clientes } from "@/components/kathe/Clientes";
import { Formacion } from "@/components/kathe/Formacion";
import { Eventos } from "@/components/kathe/Eventos";
import { Herramientas } from "@/components/kathe/Herramientas";
import { Cierre } from "@/components/kathe/Cierre";

export const metadata: Metadata = {
  title: "Katherine Usma Aristizábal — Fundadora de biwov_",
  description:
    "Fundadora de biwov_. Implementadora de Ecosistemas Digitales: landing pages, CRM, automatizaciones, lanzamientos y pauta para negocios en Latinoamérica.",
  openGraph: {
    title: "Katherine Usma Aristizábal — Fundadora de biwov_",
    description:
      "Fundadora de biwov_. Implementadora de Ecosistemas Digitales: landing pages, CRM, automatizaciones, lanzamientos y pauta para negocios en Latinoamérica.",
    url: "https://biwov.com/kathe",
    images: ["/kathe.png"],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Katherine Usma Aristizábal — Fundadora de biwov_",
    description:
      "Fundadora de biwov_. Implementadora de Ecosistemas Digitales para negocios en Latinoamérica.",
    images: ["/kathe.png"],
  },
};

export default function KathePage() {
  return (
    <div id="kathe-print">
      <Hero />
      <Cifras />
      <Historia />
      <MisionVision />
      <Trayectoria />
      <ComoTrabajo />
      <Clientes />
      <Formacion />
      <Eventos />
      <Herramientas />
      <Cierre />
    </div>
  );
}
