import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body: { ids?: string[] } = await request.json();
  const ids = body.ids?.filter(Boolean) ?? [];

  if (ids.length === 0) {
    return NextResponse.json({ error: "No se enviaron prospectos para eliminar" }, { status: 400 });
  }

  // El filtro rápido y el diagnóstico de cada uno se borran solos por "on delete cascade".
  const { error } = await supabase.from("prospectos").delete().in("id", ids);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, eliminados: ids.length });
}
