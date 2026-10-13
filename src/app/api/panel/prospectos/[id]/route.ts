import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Categoria } from "@/lib/panel/prospectos";

const CATEGORIAS_VALIDAS: Categoria[] = ["contacto", "lead", "prospecto", "cliente"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body: {
    categoria?: Categoria;
    nichoMercado?: string;
    seguimiento?: string | null;
    fechaUltimoSeguimiento?: string | null;
    paqueteAdquirido?: string | null;
    costoPaquete?: number | null;
    costoPaqueteMoneda?: "COP" | "USD" | null;
    contratoAceptado?: boolean;
    empresa?: string;
    tipoNegocio?: string;
    redesSociales?: string;
    linkRedesProspecto?: string;
    whatsapp?: string;
    email?: string;
    pais?: string;
    ciudad?: string;
    canalOrigen?: string;
    queQuiereResolver?: string;
    notas?: string;
  } = await request.json();
  const patch: Record<string, string | number | boolean | null> = {};

  if (body.empresa !== undefined) patch.empresa = body.empresa.trim() || null;
  if (body.tipoNegocio !== undefined) patch.tipo_negocio = body.tipoNegocio.trim() || null;
  if (body.redesSociales !== undefined) patch.redes_sociales = body.redesSociales.trim() || null;
  if (body.linkRedesProspecto !== undefined) patch.link_redes_prospecto = body.linkRedesProspecto.trim() || null;
  if (body.whatsapp !== undefined && body.whatsapp.trim()) patch.whatsapp = body.whatsapp.trim();
  if (body.email !== undefined) patch.email = body.email.trim() || null;
  if (body.pais !== undefined) patch.pais = body.pais.trim() || null;
  if (body.ciudad !== undefined) patch.ciudad = body.ciudad.trim() || null;
  if (body.canalOrigen !== undefined) patch.canal_origen = body.canalOrigen.trim() || null;
  if (body.queQuiereResolver !== undefined) patch.que_quiere_resolver = body.queQuiereResolver.trim() || null;
  if (body.notas !== undefined) patch.notas = body.notas.trim() || null;

  if (body.categoria !== undefined) {
    if (!CATEGORIAS_VALIDAS.includes(body.categoria)) {
      return NextResponse.json({ error: "Categoría inválida" }, { status: 400 });
    }
    patch.categoria = body.categoria;
  }
  if (body.nichoMercado !== undefined) {
    patch.nicho_mercado = body.nichoMercado.trim() || null;
  }
  if (body.seguimiento !== undefined) {
    patch.seguimiento = body.seguimiento?.trim() || null;
  }
  if (body.fechaUltimoSeguimiento !== undefined) {
    patch.fecha_ultimo_seguimiento = body.fechaUltimoSeguimiento || null;
  }
  if (body.paqueteAdquirido !== undefined) {
    patch.paquete_adquirido = body.paqueteAdquirido?.trim() || null;
  }
  if (body.costoPaquete !== undefined) {
    patch.costo_paquete = body.costoPaquete;
  }
  if (body.costoPaqueteMoneda !== undefined) {
    patch.costo_paquete_moneda = body.costoPaqueteMoneda;
  }
  if (body.contratoAceptado !== undefined) {
    patch.contrato_aceptado = body.contratoAceptado;
    patch.contrato_aceptado_en = body.contratoAceptado ? new Date().toISOString() : null;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("prospectos")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, prospecto: data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // El filtro rápido y el diagnóstico se borran solos por "on delete cascade".
  const { error } = await supabase.from("prospectos").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
