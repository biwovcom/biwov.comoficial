import type { Metadata } from "next";
import { AgenciaIA } from "./AgenciaIA";
import { FAQ_AGENCIA } from "@/data/faqAgenciaIA";

export const metadata: Metadata = {
  title: "Tu agencia de marketing con agentes de IA | biwov",
  description:
    "biwov Agentes: un equipo de agentes de IA con la memoria de tu marca que crea guiones, copys, planes y campañas. La IA trabaja; tú apruebas.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_AGENCIA.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function AgenciaIAPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <AgenciaIA />
    </>
  );
}
