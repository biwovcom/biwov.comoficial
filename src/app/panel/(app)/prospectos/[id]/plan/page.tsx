import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Prospecto } from "@/lib/panel/prospectos";
import type { PlanCreativoEntrada } from "@/lib/panel/planCreativos";
import type { Reunion } from "@/lib/panel/reuniones";
import { PlanAccionTabs } from "@/components/panel/PlanAccionTabs";

export default async function PlanAccionPage({ params }: { params: Promise<{ id: string }> }) {
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

  const { data: items } = await supabase
    .from("plan_creativos")
    .select("*")
    .eq("prospecto_id", id)
    .order("created_at", { ascending: false })
    .returns<PlanCreativoEntrada[]>();

  const { data: reuniones } = await supabase
    .from("reuniones")
    .select("*")
    .eq("prospecto_id", id)
    .order("fecha", { ascending: false })
    .returns<Reunion[]>();

  const creativos = (items ?? []).filter((i) => i.categoria === "creativo");
  const embudo = (items ?? []).filter((i) => i.categoria === "embudo");

  return (
    <div>
      <Link
        href={`/panel/prospectos/${id}`}
        className="text-sm text-text-secondary hover:text-white print:hidden"
      >
        ← Volver a {prospecto.nombre}
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-white print:hidden">Plan de acción</h1>
      <p className="mt-1 text-sm text-text-secondary print:hidden">
        La plantilla de trabajo de {prospecto.nombre}: creativos, la estructura de embudo y
        campaña para que el cliente la apruebe, y el registro de reuniones.
      </p>

      <div className="mt-6">
        <PlanAccionTabs
          prospectoId={id}
          prospectoNombre={prospecto.nombre}
          empresa={prospecto.empresa}
          creativosIniciales={creativos}
          embudoIniciales={embudo}
          reunionesIniciales={reuniones ?? []}
        />
      </div>
    </div>
  );
}
