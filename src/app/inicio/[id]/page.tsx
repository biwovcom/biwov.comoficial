import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import { DocHeader } from "@/components/documentos/DocHeader";
import {
  CUESTIONARIO_GENERAL,
  documentosPorProspecto,
  type DocumentosCliente,
} from "@/data/documentosClientes";
import { CuestionarioCliente } from "@/app/documentos/[slug]/cuestionario/CuestionarioCliente";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cuestionario de inicio | biwov",
  description: "Cuestionario privado de biwov para conocer el negocio y armar el plan de trabajo.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

/**
 * Cuestionario de inicio para CUALQUIER cliente: biwov.com/inicio/<id del prospecto>.
 * El enlace se copia desde la ficha del cliente en el panel. Las respuestas se guardan
 * en el Historial de ese mismo cliente (no se crea un registro nuevo).
 */
export default async function InicioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const propio = documentosPorProspecto(id);
  if (propio) redirect(`/documentos/${propio.slug}/cuestionario`);

  const supabase = getSupabaseClient();
  if (!supabase) notFound();
  const { data: p } = await supabase
    .from("prospectos")
    .select("id, nombre, empresa")
    .eq("id", id)
    .maybeSingle<{ id: string; nombre: string; empresa: string | null }>();
  if (!p) notFound();

  const nombre = p.nombre.trim();
  const d: DocumentosCliente = {
    slug: `inicio-${p.id}`,
    cliente: p.empresa?.trim() ? `${p.empresa.trim()} · ${nombre}` : nombre,
    nombrePila: nombre.split(/\s+/)[0],
    negocio: p.empresa?.trim() || "",
    fecha: "",
    prospectoId: p.id,
    cuestionario: CUESTIONARIO_GENERAL,
    analisis: { resumen: "", cifras: [], calificaciones: [], funciona: { titulo: "", items: [] }, oportunidades: [], proximos: [] },
  };
  const total = CUESTIONARIO_GENERAL.grupos.reduce((n, g) => n + g.preguntas.length, 0);

  return (
    <div className="min-h-screen overflow-x-clip bg-bg-deep text-white print:min-h-0 print:overflow-visible print:bg-white">
      <DocHeader />
      <section className="mx-auto max-w-3xl px-4 pt-12 md:px-8 md:pt-16 print:hidden">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">biwov_ · {d.cliente}</p>
        <h1 className="mt-3 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">
          Hola, {d.nombrePila}. Empecemos.
        </h1>
        <p className="mt-5 text-lg text-text-secondary">{CUESTIONARIO_GENERAL.intro}</p>
        <p className="mt-3 text-sm text-text-secondary">
          {total} preguntas · unos 30 minutos · puedes responder por partes.
        </p>
      </section>
      <CuestionarioCliente d={d} porProspecto />
    </div>
  );
}
