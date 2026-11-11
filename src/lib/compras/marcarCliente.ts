import type { SupabaseClient } from "@supabase/supabase-js";

export interface DatosNuevoCliente {
  nombre: string;
  email: string | null;
  whatsapp: string | null;
  empresa?: string | null;
  ciudad?: string | null;
  /** Qué firmó, para la nota del historial (ej: "Gestión Crecimiento"). */
  detalle: string;
  /** Link a la copia del contrato firmado. */
  linkContrato: string;
  monto?: number;
  moneda?: "COP" | "USD";
  cedula?: string | null;
}

const soloDigitos = (v: string) => v.replace(/\D/g, "");

/**
 * Quien firma un contrato pasa a ser cliente en el panel: si ya estaba en
 * Prospectos (mismo correo o mismo WhatsApp) se le cambia la etiqueta a
 * "Cliente"; si no, se crea. En los dos casos queda una nota en su historial
 * con lo que firmó y el link al contrato. Nunca rompe la compra si falla.
 */
export async function marcarComoCliente(
  supabase: SupabaseClient,
  datos: DatosNuevoCliente,
) {
  try {
    const email = datos.email?.trim().toLowerCase() || null;
    const digitos = datos.whatsapp
      ? soloDigitos(datos.whatsapp).slice(-10)
      : "";

    let existente: { id: string } | null = null;
    if (email) {
      const { data } = await supabase
        .from("prospectos")
        .select("id")
        .ilike("email", email)
        .limit(1);
      existente = data?.[0] ?? null;
    }
    if (!existente && digitos.length >= 7) {
      const { data } = await supabase
        .from("prospectos")
        .select("id, whatsapp")
        .ilike("whatsapp", `%${digitos.slice(-7)}%`)
        .limit(20);
      existente =
        data?.find((p) => soloDigitos(p.whatsapp ?? "").endsWith(digitos)) ??
        null;
    }

    const ahora = new Date().toISOString();
    const paquete = {
      paquete_adquirido: datos.detalle.slice(0, 300),
      ...(datos.monto
        ? {
            costo_paquete: datos.monto,
            costo_paquete_moneda: datos.moneda ?? "COP",
          }
        : {}),
      contrato_aceptado: true,
      contrato_aceptado_en: ahora,
    };

    let prospectoId: string | null = existente?.id ?? null;
    if (prospectoId) {
      const cambios = {
        categoria: "cliente",
        paso_actual: "ganado",
        updated_at: ahora,
      };
      const { error } = await supabase
        .from("prospectos")
        .update({ ...cambios, ...paquete })
        .eq("id", prospectoId);
      if (error)
        await supabase.from("prospectos").update(cambios).eq("id", prospectoId);
    } else {
      const { data } = await supabase
        .from("prospectos")
        .insert({
          nombre: datos.nombre,
          email,
          whatsapp: datos.whatsapp ?? "",
          empresa: datos.empresa ?? null,
          ciudad: datos.ciudad ?? null,
          canal_origen: "Firma de contrato en línea",
          categoria: "cliente",
          paso_actual: "ganado",
          notas: datos.cedula ? `C.C. ${datos.cedula}` : null,
          ...paquete,
        })
        .select("id")
        .single();
      prospectoId = data?.id ?? null;
    }

    if (prospectoId) {
      await supabase.from("prospecto_historial").insert({
        prospecto_id: prospectoId,
        tipo: "Contrato firmado",
        contenido: `Firmó en línea: ${datos.detalle}.${datos.cedula ? `\nCédula: ${datos.cedula}` : ""}${datos.monto ? `\nValor: $${datos.monto.toLocaleString("es-CO")} ${datos.moneda ?? "COP"}` : ""}\nCopia del contrato firmado: ${datos.linkContrato}`,
      });
    }
  } catch {
    // La firma ya quedó guardada; si esto falla, Kathe la ve igual en Compras.
  }
}
