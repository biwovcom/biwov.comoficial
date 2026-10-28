import type { Metadata } from "next";
import { Ecosystems } from "@/components/sections/Ecosystems";
import { TiendaBiwov } from "@/components/sections/TiendaBiwov";

export const metadata: Metadata = {
  title: "Tienda biwov_ — Planes y servicios digitales",
  description:
    "Elige un plan mensual o arma tu propio combo de servicios: producción de contenido, páginas web, campañas en Meta y automatizaciones con IA.",
  alternates: {
    canonical: "https://biwov.com/tienda",
  },
};

export default function TiendaPage() {
  return (
    <>
      <Ecosystems />
      <TiendaBiwov />
    </>
  );
}
