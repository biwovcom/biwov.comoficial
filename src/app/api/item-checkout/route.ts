import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { esTipoContrato } from "@/lib/contrato";
import { registrarFirmas } from "@/lib/compras/firmaServer";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const tipo = body?.tipo === "combo" ? "combo" : "item";
  const itemId = String(body?.itemId ?? "").trim().slice(0, 200) || null;
  const itemNombre = String(body?.itemNombre ?? "").trim().slice(0, 300);
  const nombre = String(body?.nombre ?? "").trim().slice(0, 200);
  const email = String(body?.email ?? "").trim().slice(0, 200) || null;
  const whatsapp = String(body?.whatsapp ?? "").trim().slice(0, 50) || null;
  const empresa = String(body?.empresa ?? "").trim().slice(0, 200) || null;
  const moneda = body?.moneda === "USD" ? "USD" : "COP";
  const monto = Number(body?.monto ?? 0);
  const snapshot = body?.snapshot ?? {};
  const aceptaContrato = Boolean(body?.aceptaContrato);
  const aceptaDatos = Boolean(body?.aceptaDatos);
  const nombreFirmante = String(body?.nombreFirmante ?? "").trim().slice(0, 200);
  const firmaImagenBase64 = String(body?.firmaImagenBase64 ?? "");
  const tiposContrato = Array.isArray(body?.tiposContrato)
    ? body.tiposContrato.filter(esTipoContrato)
    : [];

  if (!itemNombre || !nombre || (!email && !whatsapp)) {
    return NextResponse.json({ error: "Escribe tu nombre y un correo o WhatsApp." }, { status: 400 });
  }
  if (!aceptaContrato || !aceptaDatos || tiposContrato.length === 0) {
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

  const { data, error } = await supabase
    .from("plan_compras")
    .insert({
      tipo,
      plan_id: null,
      item_id: itemId,
      item_nombre: itemNombre,
      nombre,
      email,
      whatsapp,
      empresa,
      moneda,
      monto,
      snapshot,
      acepta_contrato: aceptaContrato,
      acepta_datos: aceptaDatos,
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "No se pudo registrar. Intenta de nuevo." }, { status: 500 });
  }

  await registrarFirmas(
    supabase,
    data.id,
    { tiposContrato, nombreFirmante, firmaImagenBase64, email, whatsapp },
    request,
  );

  return NextResponse.json({ ok: true });
}
