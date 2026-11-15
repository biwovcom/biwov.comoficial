import type { Metadata } from "next";
import { AgenciaIA } from "./AgenciaIA";

export const metadata: Metadata = {
  title: "Tu agencia de marketing con agentes de IA | biwov",
  description:
    "biwov Agentes: un equipo de agentes de IA con la memoria de tu marca que crea guiones, copys, planes y campañas. La IA trabaja; tú apruebas.",
};

export default function AgenciaIAPage() {
  return <AgenciaIA />;
}
