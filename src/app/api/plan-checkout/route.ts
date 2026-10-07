import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const planId = String(body?.planId ?? "").trim();
  const nombre = String(body?.nombre ?? "").trim().slice(0, 200);
  const email = String(body?.email ?? "").trim().slice(0, 200) || null;
  const whatsapp = String(body?.whatsapp ?? "").trim().slice(0, 50) || null;
  const empresa = String(body?.empresa ?? "").trim().slice(0, 200) || null;
  const moneda = body?.moneda === "USD" ? "USD" : "COP";
  const monto = Number(body?.monto ?? 0);
  const snapshot = body?.snapshot ?? {};

  if (!planId || !nombre || (!email && !whatsapp)) {
    return NextResponse.json({ error: "Escribe tu nombre y un correo o WhatsApp." }, { status: 400 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Servicio no disponible" }, { status: 503 });
  }

  const { error } = await supabase.from("plan_compras").insert({
    plan_id: planId,
    nombre,
    email,
    whatsapp,
    empresa,
    moneda,
    monto,
    snapshot,
  });

  if (error) {
    return NextResponse.json({ error: "No se pudo registrar. Intenta de nuevo." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
