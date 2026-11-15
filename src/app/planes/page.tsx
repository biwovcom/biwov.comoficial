import type { Metadata } from "next";
import { PlanesCliente } from "./PlanesCliente";

export const metadata: Metadata = {
  title: "Planes para empresarios | biwov",
  description:
    "Planes claros para que tu empresa venda sin que tengas que estar en todo: capacitación, mentoría 1 a 1, agencia completa, campañas, automatización y agentes de IA.",
};

export default function PlanesPage() {
  return <PlanesCliente />;
}
