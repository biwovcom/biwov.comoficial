import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import { cargarCompraFirmada, type CompraNormalizada, type FirmaGuardada } from "@/lib/compras/guardarCompra";
import { ImprimirButton } from "@/components/ui/ImprimirButton";
import { ContratoPropuesta } from "@/components/propuestas/ContratoPropuesta";
import { CONTRATISTA, propuestaPorSlug } from "@/data/propuestasClientes";
import { NOMBRE_TIPO_CONTRATO, esTipoContrato, type TipoContrato } from "@/lib/contrato";
import {
  seccionPartesYObjeto,
  seccionesPlan,
  seccionesSitioWeb,
  seccionesProduccion,
  seccionesCampanaMeta,
  seccionesAutomatizacion,
  seccionesComunesFinal,
} from "@/lib/contratoClausulas";

export const metadata: Metadata = {
  title: "Contrato firmado | biwov",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

type Compra = CompraNormalizada;
type Firma = FirmaGuardada;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const fechaHora = (iso: string) =>
  new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeStyle: "short", timeZone: "America/Bogota" }).format(
    new Date(iso),
  );

function seccionesEspecificas(tipo: TipoContrato) {
  switch (tipo) {
    case "sitio-web":
      return seccionesSitioWeb();
    case "produccion":
      return seccionesProduccion();
    case "campana-meta":
      return seccionesCampanaMeta();
    case "automatizacion":
      return seccionesAutomatizacion();
    default:
      return seccionesPlan();
  }
}

/**
 * Copia del contrato firmado: la abre la clienta desde el link que recibe al
 * firmar y Kathe desde el panel (Compras). Se descarga en PDF con el botón.
 */
export default async function ContratoFirmadoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const supabase = getSupabaseClient();
  if (!supabase) notFound();

  const compra = await cargarCompraFirmada(supabase, id);
  const firmas = compra?.firmas ?? [];

  if (!compra || !firmas || firmas.length === 0) notFound();
  const firma = firmas[0];
  const snap = compra.snapshot ?? {};
  const propuesta = typeof snap.propuestaSlug === "string" ? propuestaPorSlug(snap.propuestaSlug) : undefined;

  return (
    <div className="min-h-screen bg-bg-deep px-4 py-10 text-white md:py-16 print:bg-white print:p-0">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <p className="text-sm text-text-secondary">Copia del contrato firmado · guárdala como PDF</p>
          <ImprimirButton />
        </div>

        {propuesta ? (
          <div className="rounded-[1.75rem] bg-white p-6 md:p-12 print:rounded-none print:p-0">
            <ContratoPropuesta
              propuesta={propuesta}
              cliente={{
                nombre: compra.nombre,
                cedula: String(snap.cedula ?? ""),
                email: compra.email ?? "",
                telefono: String(snap.telefono ?? compra.whatsapp ?? ""),
                empresa: compra.empresa ?? undefined,
                fechaInicio: typeof snap.fechaInicio === "string" ? snap.fechaInicio : undefined,
              }}
              fechaDiligenciamiento={fechaHora(compra.created_at)}
              firma={{
                imagen: firma.firma_imagen,
                nombre: firma.nombre_firmante,
                fecha: fechaHora(firma.created_at),
                ip: firma.ip,
              }}
            />
          </div>
        ) : (
          <ContratoCatalogo compra={compra} firmas={firmas} />
        )}
      </div>
    </div>
  );
}

function ContratoCatalogo({ compra, firmas }: { compra: Compra; firmas: Firma[] }) {
  const firma = firmas[0];
  const tipos = firmas.map((f) => f.tipo_contrato).filter(esTipoContrato);
  const snap = compra.snapshot ?? {};
  const cliente = {
    nombre: compra.nombre,
    cedula: typeof snap.cedula === "string" ? snap.cedula : "",
    email: compra.email,
    telefono: compra.whatsapp,
    empresa: compra.empresa,
  };
  const moneda = compra.moneda === "USD" ? "US$" : "$";

  return (
    <div className="rounded-[1.75rem] bg-white p-6 text-[13.5px] leading-relaxed text-[#334155] md:p-12 print:rounded-none print:p-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="font-logo text-2xl font-bold text-[#0f172a]">biwov_</span>
          <p className="text-xs text-[#64748b]">Marketing digital · Manizales, Colombia</p>
        </div>
        <div className="text-right text-xs text-[#64748b]">
          <p>Fecha de diligenciamiento y firma</p>
          <p className="font-semibold text-[#0f172a]">{fechaHora(firma.created_at)}</p>
        </div>
      </div>
      <div className="mt-3 h-1 w-full rounded-full bg-gradient-to-r from-[#2e5b7e] to-[#00c2e8]" />

      <h1 className="mt-6 text-2xl font-bold text-[#0f172a]">Contrato de prestación de servicios — biwov</h1>
      <div className="mt-4 grid gap-2 rounded-2xl border border-[#e2e8f0] p-5 sm:grid-cols-2">
        <p><span className="text-[#64748b]">Cliente: </span><strong className="text-[#0f172a]">{compra.nombre}</strong></p>
        {cliente.cedula && <p><span className="text-[#64748b]">Cédula: </span>{cliente.cedula}</p>}
        {compra.empresa && <p><span className="text-[#64748b]">Empresa: </span><strong className="text-[#0f172a]">{compra.empresa}</strong></p>}
        {compra.email && <p><span className="text-[#64748b]">Correo: </span>{compra.email}</p>}
        {compra.whatsapp && <p><span className="text-[#64748b]">WhatsApp: </span>{compra.whatsapp}</p>}
        <p className="sm:col-span-2"><span className="text-[#64748b]">Servicio: </span><strong className="text-[#0f172a]">{compra.item_nombre ?? compra.plan_id}</strong></p>
        <p><span className="text-[#64748b]">Valor: </span><strong className="text-[#2e5b7e]">{moneda}{Math.round(compra.monto).toLocaleString("es-CO")} {compra.moneda}</strong></p>
        <p><span className="text-[#64748b]">Versión: </span>{firmas.map((f) => f.version_contrato).join(" / ")}</p>
      </div>

      {tipos.map((tipo) => {
        const secciones = [...seccionPartesYObjeto(tipo, cliente), ...seccionesEspecificas(tipo), ...seccionesComunesFinal()];
        return (
          <div key={tipo} className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00a3c4]">{NOMBRE_TIPO_CONTRATO[tipo]}</p>
            <div className="contrato-claro mt-4 space-y-6">
              {secciones.map((s, i) => (
                <section key={s.titulo} className="break-inside-avoid-page">
                  <h2 className="mb-2 text-[15px] font-bold text-[#0f172a]">{i + 1}. {s.titulo}</h2>
                  {s.contenido}
                </section>
              ))}
            </div>
          </div>
        );
      })}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#e2e8f0] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748b]">El proveedor</p>
          <p className="mt-6 font-logo text-xl text-[#2e5b7e]">{CONTRATISTA.nombre}</p>
          <p className="mt-2 border-t border-[#cbd5e1] pt-2 text-xs text-[#64748b]">
            {CONTRATISTA.nombre} · C.C. {CONTRATISTA.cedula}
            <br />
            biwov · Manizales
          </p>
        </div>
        <div className="rounded-2xl border border-[#e2e8f0] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748b]">El cliente</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={firma.firma_imagen} alt={`Firma de ${firma.nombre_firmante}`} className="h-20 w-full object-contain" />
          <p className="mt-2 border-t border-[#cbd5e1] pt-2 text-xs text-[#64748b]">
            {firma.nombre_firmante}
            {cliente.cedula ? ` · C.C. ${cliente.cedula}` : ""}
            <br />
            Firmado electrónicamente el {fechaHora(firma.created_at)}
            {firma.ip ? ` · IP ${firma.ip}` : ""} · Ley 527 de 1999
          </p>
        </div>
      </div>
    </div>
  );
}
