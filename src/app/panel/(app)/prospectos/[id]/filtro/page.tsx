import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { monedaDesdePais } from "@/lib/panel/paises";
import type { Prospecto } from "@/lib/panel/prospectos";
import { FiltroWizard } from "./FiltroWizard";

export default async function FiltroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: prospecto } = await supabase
    .from("prospectos")
    .select("*")
    .eq("id", id)
    .maybeSingle<Prospecto>();

  if (!prospecto) {
    notFound();
  }

  return (
    <div>
      <Link
        href={`/panel/prospectos/${id}`}
        className="text-sm text-text-secondary hover:text-white"
      >
        ← Volver a {prospecto.nombre}
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-white">Filtro rápido</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Responde según lo que te cuente {prospecto.nombre} para saber si califica antes de agendar el diagnóstico.
      </p>

      <div className="mt-8">
        <FiltroWizard
          prospectoId={prospecto.id}
          nombre={prospecto.nombre}
          whatsapp={prospecto.whatsapp}
          moneda={monedaDesdePais(prospecto.pais)}
        />
      </div>
    </div>
  );
}
