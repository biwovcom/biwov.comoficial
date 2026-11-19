import type { Metadata } from "next";
import { PlanesCliente } from "./PlanesCliente";
import { soloEquipo } from "@/lib/soloEquipo";

export const metadata: Metadata = {
  title: "Planes para empresarios | biwov",
  description:
    "Planes claros para que tu empresa venda sin que tengas que estar en todo: capacitación, mentoría 1 a 1, agencia completa, campañas, automatización y agentes de IA.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

export default async function PlanesPage() {
  await soloEquipo();
  return <PlanesCliente />;
}
