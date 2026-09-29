import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { cargarCotizacionPublica } from "@/lib/panel/cotizacionPublica";

/**
 * El cliente acepta la cotización: se registra la aceptación y se le devuelve
 * el link de pago de la moneda que eligió. El monto se recalcula aquí en el
 * servidor; nunca se confía en el que envía el navegador.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Servicio no disponible" }, { status: 503 });
  }

  const cotizacion = await cargarCotizacionPublica(supabase, id);
  if (!cotizacion) {
    return NextResponse.json({ error: "Cotización no encontrada" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const nombre = String(body?.nombre ?? "").trim().slice(0, 200);
  const email = String(body?.email ?? "").trim().slice(0, 200) || null;
  const whatsapp = String(body?.whatsapp ?? "").trim().slice(0, 50) || null;
  const empresa = String(body?.empresa ?? "").trim().slice(0, 200) || null;
  const moneda = body?.moneda === "USD" ? "USD" : "COP";

  if (!nombre || (!email && !whatsapp)) {
    return NextResponse.json({ error: "Escribe tu nombre y un correo o WhatsApp." }, { status: 400 });
  }

  const monto = moneda === "USD" ? cotizacion.usd.total : cotizacion.cop.total;

  const { error } = await supabase.from("cotizador_aceptaciones").insert({
    paquete_id: cotizacion.id,
    nombre,
    email,
    whatsapp,
    empresa,
    moneda,
    monto,
    snapshot: { nombre: cotizacion.nombre, items: cotizacion.items, cop: cotizacion.cop, usd: cotizacion.usd },
  });

  if (error) {
    return NextResponse.json({ error: "No se pudo registrar la aceptación. Intenta de nuevo." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    linkPago: moneda === "USD" ? cotizacion.linkPagoUsd : cotizacion.linkPagoCop,
  });
}
