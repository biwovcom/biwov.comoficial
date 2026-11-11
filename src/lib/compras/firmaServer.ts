import type { SupabaseClient } from "@supabase/supabase-js";
import { VERSION_CONTRATO, esTipoContrato } from "@/lib/contrato";
import { marcarComoCliente } from "@/lib/compras/marcarCliente";
import { guardarFirmas } from "@/lib/compras/guardarCompra";

export interface DatosFirmaServer {
  /** Tipos del catálogo ("plan", "produccion"…) o el slug de una propuesta a la medida. */
  tiposContrato: string[];
  /** Versión para los tipos que no son del catálogo (propuestas a la medida). */
  versionPersonalizada?: string;
  nombreFirmante: string;
  firmaImagenBase64: string;
  email: string | null;
  whatsapp: string | null;
  empresa?: string | null;
  ciudad?: string | null;
  /** Qué firmó, para el historial del cliente en el panel. */
  detalle: string;
}

export function linkContratoFirmado(request: Request, referenciaId: string) {
  return `${new URL(request.url).origin}/contrato-firmado/${referenciaId}`;
}

/**
 * Guarda la firma (Ley 527 de 1999: nombre, imagen, IP, navegador, fecha y
 * versión exacta del contrato) y deja a la persona marcada como cliente en el
 * panel. Devuelve el link a la copia firmada que pueden descargar las dos partes.
 */
export async function registrarFirmas(
  supabase: SupabaseClient,
  referenciaId: string,
  datos: DatosFirmaServer,
  request: Request,
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent");
  const ahora = new Date().toISOString();

  await guardarFirmas(
    supabase,
    referenciaId,
    datos.tiposContrato.map((tipo) => ({
      tipo_contrato: tipo,
      version_contrato: esTipoContrato(tipo) ? VERSION_CONTRATO[tipo] : (datos.versionPersonalizada ?? tipo),
      nombre_firmante: datos.nombreFirmante,
      firma_imagen: datos.firmaImagenBase64,
      ip,
      user_agent: userAgent,
      created_at: ahora,
    })),
  );

  const linkContrato = linkContratoFirmado(request, referenciaId);
  await marcarComoCliente(supabase, {
    nombre: datos.nombreFirmante,
    email: datos.email,
    whatsapp: datos.whatsapp,
    empresa: datos.empresa,
    ciudad: datos.ciudad,
    detalle: datos.detalle,
    linkContrato,
  });

  return linkContrato;
}
