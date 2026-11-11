import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { registrarFirmas } from "@/lib/compras/firmaServer";
import { insertarCompra } from "@/lib/compras/guardarCompra";
import {
  fechaLarga,
  propuestaPorSlug,
  sumarMeses,
} from "@/data/propuestasClientes";

const texto = (v: unknown, max = 200) =>
  String(v ?? "")
    .trim()
    .slice(0, max);

/**
 * La clienta llena sus datos, acepta y firma la propuesta a la medida. Todo
 * queda en "Compras" del panel (con la firma), y ella pasa a ser Cliente.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const propuesta = propuestaPorSlug(slug);
  if (!propuesta) {
    return NextResponse.json(
      { error: "Propuesta no encontrada" },
      { status: 404 },
    );
  }

  const body = await request.json().catch(() => null);
  const nombre = texto(body?.nombre);
  const cedula = texto(body?.cedula, 30);
  const email = texto(body?.email).toLowerCase();
  const telefono = texto(body?.telefono, 50);
  const empresa = texto(body?.empresa) || null;
  const fechaInicio = texto(body?.fechaInicio, 10);
  const nombreFirmante = texto(body?.nombreFirmante) || nombre;
  const firmaImagenBase64 = String(body?.firmaImagenBase64 ?? "");

  if (!nombre || !cedula || !email || !telefono || !fechaLarga(fechaInicio)) {
    return NextResponse.json(
      {
        error:
          "Completa tu nombre, cédula, correo, teléfono y la fecha de inicio.",
      },
      { status: 400 },
    );
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Revisa tu correo." }, { status: 400 });
  }
  if (!body?.aceptaContrato || !body?.aceptaDatos) {
    return NextResponse.json(
      {
        error:
          "Debes aceptar el contrato y autorizar el tratamiento de tus datos.",
      },
      { status: 400 },
    );
  }
  if (
    !firmaImagenBase64.startsWith("data:image/") ||
    firmaImagenBase64.length > 600_000
  ) {
    return NextResponse.json({ error: "Falta tu firma." }, { status: 400 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Servicio no disponible" },
      { status: 503 },
    );
  }

  const firmadoEn = new Date().toISOString();
  const compraId = await insertarCompra(supabase, {
    tipo: "item",
    plan_id: null,
    item_id: `propuesta:${propuesta.slug}`,
    item_nombre: `Propuesta a la medida — ${propuesta.titulo} (${propuesta.sector})`,
    nombre,
    email,
    whatsapp: telefono,
    empresa,
    moneda: "COP",
    monto: propuesta.pago.totalContrato,
    snapshot: {
      propuestaSlug: propuesta.slug,
      version: propuesta.version,
      cedula,
      telefono,
      firmadoEn,
      valorMensual: propuesta.valorMensual,
      canje: propuesta.pago.canje,
      saldo: propuesta.pago.saldo,
      fechaInicio,
      fechaFin: sumarMeses(fechaInicio, propuesta.duracionMeses),
    },
    acepta_contrato: true,
    acepta_datos: true,
  });

  if (!compraId) {
    return NextResponse.json(
      { error: "No se pudo registrar. Intenta de nuevo." },
      { status: 500 },
    );
  }

  const linkContrato = await registrarFirmas(
    supabase,
    compraId,
    {
      tiposContrato: [`propuesta:${propuesta.slug}`],
      versionPersonalizada: propuesta.version,
      nombreFirmante,
      firmaImagenBase64,
      email,
      whatsapp: telefono,
      empresa,
      monto: propuesta.pago.totalContrato,
      moneda: "COP",
      cedula,
      detalle: `${propuesta.titulo} (${propuesta.sector}), ${propuesta.duracionMeses} meses desde el ${fechaLarga(fechaInicio)}`,
    },
    request,
  );

  return NextResponse.json({ ok: true, id: compraId, linkContrato, firmadoEn });
}
