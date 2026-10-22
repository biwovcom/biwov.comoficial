import type { SupabaseClient } from "@supabase/supabase-js";
import { VERSION_CONTRATO, type TipoContrato } from "@/lib/contrato";

export interface DatosFirmaServer {
  tiposContrato: TipoContrato[];
  nombreFirmante: string;
  firmaImagenBase64: string;
  email: string | null;
  whatsapp: string | null;
}

export async function registrarFirmas(
  supabase: SupabaseClient,
  referenciaId: string,
  datos: DatosFirmaServer,
  request: Request,
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent");

  const filas = datos.tiposContrato.map((tipo) => ({
    referencia_tipo: "plan_compra" as const,
    referencia_id: referenciaId,
    tipo_contrato: tipo,
    version_contrato: VERSION_CONTRATO[tipo],
    nombre_firmante: datos.nombreFirmante,
    firma_imagen: datos.firmaImagenBase64,
    email: datos.email,
    whatsapp: datos.whatsapp,
    ip,
    user_agent: userAgent,
  }));

  await supabase.from("contratos_firmados").insert(filas);
}
