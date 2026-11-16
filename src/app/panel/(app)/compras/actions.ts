"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Elimina una compra del registro (y su contrato firmado, si lo tiene). Solo para el equipo con sesión. */
export async function eliminarCompra(id: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Tu sesión expiró. Vuelve a entrar al panel." };
  if (!id) return { ok: false, error: "Falta la compra" };

  const firmas = await supabase.from("contratos_firmados").delete().eq("referencia_id", id);
  if (firmas.error) return { ok: false, error: firmas.error.message };
  const compra = await supabase.from("plan_compras").delete().eq("id", id).select("id");
  if (compra.error) return { ok: false, error: compra.error.message };
  if (!compra.data?.length) return { ok: false, error: "No se pudo borrar (permiso de la base de datos)." };

  revalidatePath("/panel/compras");
  return { ok: true };
}
