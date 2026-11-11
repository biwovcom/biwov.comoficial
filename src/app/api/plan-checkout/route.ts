import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { registrarFirmas } from "@/lib/compras/firmaServer";
import { insertarCompra } from "@/lib/compras/guardarCompra";
import { PLANES } from "@/data/planes";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const planId = String(body?.planId ?? "").trim();
  const nombre = String(body?.nombre ?? "").trim().slice(0, 200);
  const email = String(body?.email ?? "").trim().slice(0, 200) || null;
  const whatsapp = String(body?.whatsapp ?? "").trim().slice(0, 50) || null;
  const empresa = String(body?.empresa ?? "").trim().slice(0, 200) || null;
  const moneda = body?.moneda === "USD" ? "USD" : "COP";
  const monto = Number(body?.monto ?? 0);
  const cedula = String(body?.cedula ?? "").trim().slice(0, 30);
  const snapshot = { ...(body?.snapshot ?? {}), cedula, telefono: whatsapp };
  const aceptaContrato = Boolean(body?.aceptaContrato);
  const aceptaDatos = Boolean(body?.aceptaDatos);
  const nombreFirmante = String(body?.nombreFirmante ?? "").trim().slice(0, 200);
  const firmaImagenBase64 = String(body?.firmaImagenBase64 ?? "");

  if (!planId || !nombre || (!email && !whatsapp)) {
    return NextResponse.json({ error: "Escribe tu nombre y un correo o WhatsApp." }, { status: 400 });
  }
  if (!aceptaContrato || !aceptaDatos) {
    return NextResponse.json(
      { error: "Debes aceptar el contrato y el tratamiento de datos." },
      { status: 400 },
    );
  }
  if (!nombreFirmante || !firmaImagenBase64.startsWith("data:image/")) {
    return NextResponse.json({ error: "Falta tu firma." }, { status: 400 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Servicio no disponible" }, { status: 503 });
  }

  const compraId = await insertarCompra(supabase, {
      tipo: "plan",
      plan_id: planId,
      nombre,
      email,
      whatsapp,
      empresa,
      moneda,
      monto,
      snapshot,
      acepta_contrato: aceptaContrato,
      acepta_datos: aceptaDatos,
    });

  if (!compraId) {
    return NextResponse.json({ error: "No se pudo registrar. Intenta de nuevo." }, { status: 500 });
  }

  const linkContrato = await registrarFirmas(
    supabase,
    compraId,
    {
      tiposContrato: ["plan"],
      nombreFirmante,
      firmaImagenBase64,
      email,
      whatsapp,
      empresa,
      detalle: `Plan ${PLANES.find((p) => p.id === planId)?.nombre ?? planId}`,
    },
    request,
  );

  return NextResponse.json({ ok: true, id: compraId, linkContrato });
}
