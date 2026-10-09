import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface BodyBase {
  prospectoId?: string;
  fechaInicio?: string | null;
  clientesLineaBase?: number | null;
  ventasMensualesLineaBase?: number | null;
  ticketPromedioLineaBase?: number | null;
  moneda?: "COP" | "USD" | null;
  notas?: string | null;
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body: BodyBase = await request.json().catch(() => ({}));
  const prospectoId = body.prospectoId?.trim();
  if (!prospectoId) {
    return NextResponse.json({ error: "Falta el prospecto" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("negocio_cliente")
    .upsert(
      {
        prospecto_id: prospectoId,
        fecha_inicio: body.fechaInicio || null,
        clientes_linea_base: body.clientesLineaBase ?? null,
        ventas_mensuales_linea_base: body.ventasMensualesLineaBase ?? null,
        ticket_promedio_linea_base: body.ticketPromedioLineaBase ?? null,
        moneda: body.moneda ?? null,
        notas: body.notas?.trim() || null,
      },
      { onConflict: "prospecto_id" },
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, base: data });
}
