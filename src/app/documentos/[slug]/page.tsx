import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ClipboardList, FileSignature, LineChart } from "lucide-react";
import { DocHeader } from "@/components/documentos/DocHeader";
import { DOCUMENTOS_CLIENTES, documentosPorSlug } from "@/data/documentosClientes";

export const metadata: Metadata = {
  title: "Documentos de inicio | biwov",
  description: "Documentos privados de biwov para iniciar el trabajo: cuestionario, análisis inicial y contrato.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export function generateStaticParams() {
  return DOCUMENTOS_CLIENTES.map((d) => ({ slug: d.slug }));
}
export const dynamicParams = false;

export default async function DocumentosPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = documentosPorSlug(slug);
  if (!d) notFound();

  const docs = [
    {
      href: `/documentos/${d.slug}/cuestionario`,
      icono: ClipboardList,
      etiqueta: "Paso 1 · El más importante",
      titulo: "Cuestionario",
      texto: "Responde en línea. Con tus respuestas terminamos el análisis y armamos el plan de trabajo.",
      destacado: true,
    },
    {
      href: `/documentos/${d.slug}/analisis`,
      icono: LineChart,
      etiqueta: "Para revisar",
      titulo: "Análisis inicial",
      texto: "Lo que encontramos en tus redes y en tu publicidad: lo que funciona y las oportunidades.",
    },
    ...(d.propuestaSlug
      ? [
          {
            href: `/propuesta/${d.propuestaSlug}`,
            icono: FileSignature,
            etiqueta: "Para tener a la mano",
            titulo: "Contrato",
            texto: "El plan, la inversión y las condiciones del servicio.",
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-bg-deep text-white">
      <DocHeader />
      <section className="mx-auto max-w-5xl px-4 pb-20 pt-14 md:px-8 md:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{d.negocio}</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">
          Hola, {d.nombrePila}. Empecemos.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-text-secondary">
          Aquí están los documentos para dar inicio al proceso de trabajo. Lo más importante ahora es el
          cuestionario: será la base para definir la estrategia, las campañas y el contenido.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {docs.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className={`group flex flex-col rounded-[1.75rem] p-7 transition-transform hover:-translate-y-1 ${
                doc.destacado ? "bg-white text-[#03101b]" : "card-universo"
              }`}
            >
              <span
                className={`grid h-11 w-11 place-items-center rounded-2xl ${
                  doc.destacado ? "bg-[#03101b]" : "bg-accent/10"
                }`}
              >
                <doc.icono className="h-5 w-5 text-accent" />
              </span>
              <p
                className={`mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  doc.destacado ? "text-[#0a2642]/70" : "text-text-secondary"
                }`}
              >
                {doc.etiqueta}
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em]">{doc.titulo}</h2>
              <p className={`mt-2 flex-1 text-sm leading-relaxed ${doc.destacado ? "text-[#0a2642]/80" : "text-white/75"}`}>
                {doc.texto}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                Abrir <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-14 text-sm text-text-secondary">
          ¿Dudas? Escríbenos por WhatsApp al +57 313 312 5157 · biwov.com
        </p>
      </section>
    </div>
  );
}
