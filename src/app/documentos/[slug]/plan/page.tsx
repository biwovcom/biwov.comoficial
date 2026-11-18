import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocHeader } from "@/components/documentos/DocHeader";
import { DOCUMENTOS_CLIENTES, documentosPorSlug } from "@/data/documentosClientes";
import { PlanCliente } from "./PlanCliente";

export const metadata: Metadata = {
  title: "Plan de trabajo | biwov",
  description: "Plan de contenido, guiones, estrategia y calculadora de pacientes, preparado por biwov.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

// Cualquier cliente con plan publicado desde la oficina (planesPublicos/<slug>) tiene esta página.
export function generateStaticParams() {
  return DOCUMENTOS_CLIENTES.filter((d) => d.plan).map((d) => ({ slug: d.slug }));
}
export const dynamicParams = true;

export default async function PlanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[a-z0-9-]{3,80}$/.test(slug)) notFound();
  const d = documentosPorSlug(slug);
  return (
    <div className="min-h-screen overflow-x-clip bg-bg-deep text-white">
      <DocHeader volver={d ? { href: `/documentos/${d.slug}`, texto: "Documentos" } : undefined} />
      <PlanCliente slug={slug} nombre={d?.nombrePila} negocio={d?.negocio} plan={d?.plan} />
    </div>
  );
}
