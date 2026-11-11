import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROPUESTAS_CLIENTES, propuestaPorSlug } from "@/data/propuestasClientes";
import { PropuestaCliente } from "./PropuestaCliente";

export const metadata: Metadata = {
  title: "Propuesta de trabajo | biwov",
  description: "Propuesta privada de biwov: plan de trabajo, inversión y contrato para firmar en línea.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export function generateStaticParams() {
  return PROPUESTAS_CLIENTES.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export default async function PropuestaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const propuesta = propuestaPorSlug(slug);
  if (!propuesta) notFound();
  return <PropuestaCliente propuesta={propuesta} />;
}
