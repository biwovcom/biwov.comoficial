import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ImprimirButton } from "@/components/ui/ImprimirButton";
import { VERSION_CONTRATO, NOMBRE_TIPO_CONTRATO, esTipoContrato, type TipoContrato } from "@/lib/contrato";
import {
  seccionPartesYObjeto,
  seccionesPlan,
  seccionesSitioWeb,
  seccionesProduccion,
  seccionesCampanaMeta,
  seccionesComunesFinal,
} from "@/lib/contratoClausulas";

export const metadata: Metadata = {
  title: "Contrato y Términos y Condiciones | biwov",
  description:
    "Términos y condiciones del servicio de biwov para el diseño e implementación de soluciones digitales conectadas.",
};

function seccionesEspecificas(tipo: TipoContrato) {
  switch (tipo) {
    case "sitio-web":
      return seccionesSitioWeb();
    case "produccion":
      return seccionesProduccion();
    case "campana-meta":
      return seccionesCampanaMeta();
    case "plan":
    default:
      return seccionesPlan();
  }
}

export default async function ContratoPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo: tipoParam } = await searchParams;
  const tipo: TipoContrato = esTipoContrato(tipoParam) ? tipoParam : "plan";

  const secciones = [
    ...seccionPartesYObjeto(tipo),
    ...seccionesEspecificas(tipo),
    ...seccionesComunesFinal(),
  ];

  return (
    <div className="min-h-screen bg-bg-base py-24 text-white">
      <Container className="max-w-3xl">
        <div className="mb-10 flex items-center justify-between print:hidden">
          <Link href="/" className="text-sm text-text-secondary hover:text-white">
            ← Volver al inicio
          </Link>
          <ImprimirButton />
        </div>

        <div className="rounded-3xl border border-border-glass bg-white/[0.02] p-8 md:p-12">
          <p className="mb-2 rounded-full border border-border-glass bg-white/[0.03] px-4 py-1 text-xs font-semibold uppercase tracking-wide text-accent inline-block print:hidden">
            Borrador — pendiente revisión legal
          </p>
          <span className="text-xs font-semibold uppercase tracking-wide text-accent">
            {NOMBRE_TIPO_CONTRATO[tipo]}
          </span>
          <h1 className="mt-1 text-3xl font-semibold text-white md:text-4xl">
            Contrato de Prestación de Servicios — biwov
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Versión del contrato: {VERSION_CONTRATO[tipo]}
          </p>

          <div className="prose-invert mt-10 space-y-8 text-sm leading-relaxed text-white/85 md:text-base">
            {secciones.map((seccion, i) => (
              <section key={seccion.titulo}>
                <h2 className="mb-2 text-lg font-semibold text-white">
                  {i + 1}. {seccion.titulo}
                </h2>
                {seccion.contenido}
              </section>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
