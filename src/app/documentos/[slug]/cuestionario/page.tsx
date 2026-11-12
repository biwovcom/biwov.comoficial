import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocHeader } from "@/components/documentos/DocHeader";
import { DOCUMENTOS_CLIENTES, documentosPorSlug } from "@/data/documentosClientes";
import { CuestionarioCliente } from "./CuestionarioCliente";

export const metadata: Metadata = {
  title: "Cuestionario de inicio | biwov",
  description: "Cuestionario privado de biwov para conocer el negocio y armar el plan de trabajo.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export function generateStaticParams() {
  return DOCUMENTOS_CLIENTES.map((d) => ({ slug: d.slug }));
}
export const dynamicParams = false;

export default async function CuestionarioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = documentosPorSlug(slug);
  if (!d) notFound();
  const total = d.cuestionario.grupos.reduce((n, g) => n + g.preguntas.length, 0);

  return (
    <div className="min-h-screen overflow-x-clip bg-bg-deep text-white print:min-h-0 print:overflow-visible print:bg-white">
      <DocHeader volver={{ href: `/documentos/${d.slug}`, texto: "Documentos" }} />
      <section className="mx-auto max-w-3xl px-4 pt-12 md:px-8 md:pt-16 print:hidden">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent print:text-[#0a2642]">
          biwov_ · {d.cliente}
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">
          Cuestionario de inicio
        </h1>
        <p className="mt-5 text-lg text-text-secondary print:text-[#10233a]">{d.cuestionario.intro}</p>
        <p className="mt-3 text-sm text-text-secondary print:hidden">
          {total} preguntas · unos 35 minutos · puedes responder por partes.
        </p>
      </section>
      <CuestionarioCliente d={d} />
    </div>
  );
}
