import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Prospecto } from "@/lib/panel/prospectos";
import type { PlanCreativoEntrada } from "@/lib/panel/planCreativos";
import type { PlanCampana } from "@/lib/panel/planCampanas";
import type { Reunion } from "@/lib/panel/reuniones";
import type { RedHistorialEntrada } from "@/lib/panel/redesHistorial";
import type { NegocioCliente, NegocioHistorialEntrada } from "@/lib/panel/negocioCliente";
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

  const { data: campanas } = await supabase
    .from("plan_campanas")
    .select("*")
    .eq("prospecto_id", id)
    .returns<PlanCampana[]>();

  const { data: redes } = await supabase
    .from("redes_historial")
    .select("*")
    .eq("prospecto_id", id)
    .order("fecha", { ascending: false })
    .returns<RedHistorialEntrada[]>();

  const { data: negocioBase } = await supabase
    .from("negocio_cliente")
    .select("*")
    .eq("prospecto_id", id)
    .maybeSingle<NegocioCliente>();

  const { data: negocioHistorial } = await supabase
    .from("negocio_historial")
    .select("*")
    .eq("prospecto_id", id)
    .order("fecha", { ascending: false })
    .returns<NegocioHistorialEntrada[]>();

  const { data: reuniones } = await supabase
    .from("reuniones")
    .select("*")
    .eq("prospecto_id", id)
    .order("fecha", { ascending: false })
    .returns<Reunion[]>();

  const creativos = (items ?? []).filter((i) => i.categoria === "creativo");
  const embudo = (items ?? []).filter((i) => i.categoria === "embudo");
  const analisis = (items ?? []).filter((i) => i.categoria === "analisis");

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
        La plantilla de trabajo de {prospecto.nombre}: creativos por mes, el brief de campaña para
        que el cliente lo apruebe, el crecimiento de redes, el análisis de resultados y el
        registro de reuniones.
      </p>

      <div className="mt-6">
        <PlanAccionTabs
          prospectoId={id}
          prospectoNombre={prospecto.nombre}
          empresa={prospecto.empresa}
          creativosIniciales={creativos}
          embudoIniciales={embudo}
          analisisIniciales={analisis}
          campanasIniciales={campanas ?? []}
          redesIniciales={redes ?? []}
          negocioBaseInicial={negocioBase ?? null}
          negocioHistorialInicial={negocioHistorial ?? []}
          reunionesIniciales={reuniones ?? []}
        />
      </div>
    </div>
  );
}
