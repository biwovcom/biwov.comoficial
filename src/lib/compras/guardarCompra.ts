import type { SupabaseClient } from "@supabase/supabase-js";

export interface FilaCompra {
  tipo: "plan" | "item" | "combo";
  plan_id: string | null;
  item_id?: string | null;
  item_nombre?: string | null;
  nombre: string;
  email: string | null;
  whatsapp: string | null;
  empresa: string | null;
  moneda: "COP" | "USD";
  monto: number;
  snapshot: Record<string, unknown>;
  acepta_contrato: boolean;
  acepta_datos: boolean;
}

export interface FirmaGuardada {
  tipo_contrato: string;
  version_contrato: string;
  nombre_firmante: string;
  firma_imagen: string;
  ip: string | null;
  user_agent?: string | null;
  created_at: string;
}

/** Compra tal como la leen el panel y la copia firmada, venga de la tabla nueva o de la vieja. */
export interface CompraNormalizada {
  id: string;
  created_at: string;
  tipo: "plan" | "item" | "combo";
  plan_id: string | null;
  item_nombre: string | null;
  nombre: string;
  email: string | null;
  whatsapp: string | null;
  empresa: string | null;
  moneda: "COP" | "USD";
  monto: number;
  acepta_contrato: boolean;
  acepta_datos: boolean;
  snapshot: Record<string, unknown>;
  firmas: FirmaGuardada[];
}

/**
 * Guarda la compra. Si la base de datos todavía no tiene las columnas nuevas
 * (tipo, item_id, item_nombre), la guarda con las columnas básicas y deja esos
 * datos dentro de "snapshot", para que la firma nunca falle por eso.
 */
export async function insertarCompra(supabase: SupabaseClient, fila: FilaCompra): Promise<string | null> {
  const completa = await supabase.from("plan_compras").insert(fila).select("id").single();
  if (!completa.error && completa.data) return completa.data.id as string;

  const basica = await supabase
    .from("plan_compras")
    .insert({
      plan_id: fila.plan_id ?? fila.item_id ?? fila.tipo,
      nombre: fila.nombre,
      email: fila.email,
      whatsapp: fila.whatsapp,
      empresa: fila.empresa,
      moneda: fila.moneda,
      monto: fila.monto,
      snapshot: { ...fila.snapshot, tipo: fila.tipo, item_id: fila.item_id ?? null, item_nombre: fila.item_nombre ?? null },
      acepta_contrato: fila.acepta_contrato,
      acepta_datos: fila.acepta_datos,
    })
    .select("id")
    .single();
  if (basica.error || !basica.data) {
    console.error("No se pudo guardar la compra", completa.error?.message, basica.error?.message);
    return null;
  }
  return basica.data.id as string;
}

/** Guarda las firmas en la tabla de firmas y, siempre, también dentro de la compra. */
export async function guardarFirmas(supabase: SupabaseClient, compraId: string, firmas: FirmaGuardada[]) {
  await supabase.from("contratos_firmados").insert(
    firmas.map((f) => ({ ...f, referencia_tipo: "plan_compra", referencia_id: compraId })),
  );
  const { data } = await supabase.from("plan_compras").select("snapshot").eq("id", compraId).maybeSingle();
  const snapshot = (data?.snapshot as Record<string, unknown> | null) ?? {};
  await supabase.from("plan_compras").update({ snapshot: { ...snapshot, firmas } }).eq("id", compraId);
}

function normalizar(fila: Record<string, unknown>): CompraNormalizada {
  const snap = (fila.snapshot as Record<string, unknown> | null) ?? {};
  const tipo = (fila.tipo ?? snap.tipo ?? "plan") as CompraNormalizada["tipo"];
  return {
    id: String(fila.id),
    created_at: String(fila.created_at),
    tipo,
    plan_id: tipo === "plan" ? ((fila.plan_id as string | null) ?? null) : null,
    item_nombre: ((fila.item_nombre ?? snap.item_nombre) as string | null) ?? null,
    nombre: String(fila.nombre ?? ""),
    email: (fila.email as string | null) ?? null,
    whatsapp: (fila.whatsapp as string | null) ?? null,
    empresa: (fila.empresa as string | null) ?? null,
    moneda: fila.moneda === "USD" ? "USD" : "COP",
    monto: Number(fila.monto ?? 0),
    acepta_contrato: Boolean(fila.acepta_contrato),
    acepta_datos: Boolean(fila.acepta_datos),
    snapshot: snap,
    firmas: Array.isArray(snap.firmas) ? (snap.firmas as FirmaGuardada[]) : [],
  };
}

/** Lista de compras para el panel (sin la imagen de la firma, para que cargue rápido). */
export async function listarCompras(supabase: SupabaseClient): Promise<CompraNormalizada[]> {
  const { data } = await supabase.from("plan_compras").select("*").order("created_at", { ascending: false });
  return (data ?? []).map((f) => normalizar(f as Record<string, unknown>));
}

/** Una compra con sus firmas (de la tabla de firmas o, si no existe, de la propia compra). */
export async function cargarCompraFirmada(supabase: SupabaseClient, id: string): Promise<CompraNormalizada | null> {
  const { data } = await supabase.from("plan_compras").select("*").eq("id", id).maybeSingle();
  if (!data) return null;
  const compra = normalizar(data as Record<string, unknown>);
  const { data: firmas, error } = await supabase
    .from("contratos_firmados")
    .select("tipo_contrato, version_contrato, nombre_firmante, firma_imagen, ip, created_at")
    .eq("referencia_id", id);
  if (!error && firmas && firmas.length > 0) compra.firmas = firmas as FirmaGuardada[];
  return compra;
}
