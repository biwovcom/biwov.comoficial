import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * La tienda y los planes con precios quedaron ocultos del público: solo los
 * abre el equipo con sesión del panel, para armar cotizaciones. Sin sesión,
 * se manda al login del panel.
 */
export async function soloEquipo() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/panel/login");
}
