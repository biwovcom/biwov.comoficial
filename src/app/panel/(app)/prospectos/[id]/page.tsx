import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { NOMBRES_PASO, type Prospecto } from "@/lib/panel/prospectos";
import { resumenRespuestasFiltro, type RespuestasFiltro } from "@/lib/panel/filtroRapido";
import { monedaDesdePais } from "@/lib/panel/paises";
import { CopyLinkButton } from "@/components/panel/CopyLinkButton";
import { MensajeSugeridoWhatsApp } from "@/components/panel/MensajeSugeridoWhatsApp";
import { EliminarProspectoButton } from "@/components/panel/EliminarProspectoButton";
import { CopiarParaIABoton } from "@/components/panel/CopiarParaIABoton";
import type { RespuestasDiagnosticoLargo } from "@/lib/panel/diagnosticoLargo";

interface FiltroRespuestaFila {
  respuestas: RespuestasFiltro;
  semaforo: "verde" | "amarillo" | "rojo";
  razon: string;
  created_at: string;
}

const PROXIMOS_PASOS = [
  { label: "Filtro rápido", ruta: "filtro" },
  { label: "Diagnóstico", ruta: "diagnostico" },
  { label: "Análisis con IA", ruta: "analisis" },
  { label: "Propuesta", ruta: null },
];

export default async function ProspectoPage({ params }: { params: Promise<{ id: string }> }) {
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

  const { data: filtro } = await supabase
    .from("filtro_respuestas")
    .select("respuestas, semaforo, razon, created_at")
    .eq("prospecto_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<FiltroRespuestaFila>();

  const resumenFiltro = filtro
    ? resumenRespuestasFiltro(filtro.respuestas, monedaDesdePais(prospecto.pais))
    : null;

  const { data: diagnostico } = await supabase
    .from("diagnostico_respuestas")
    .select("completado, respuestas")
    .eq("prospecto_id", id)
    .maybeSingle<{ completado: boolean; respuestas: RespuestasDiagnosticoLargo }>();

  return (
    <div>
      <Link href="/panel/prospectos" className="text-sm text-text-secondary hover:text-white">
        ← Volver a prospectos
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-white">{prospecto.nombre}</h1>
        <Badge>{NOMBRES_PASO[prospecto.paso_actual]}</Badge>
        {prospecto.semaforo && (
          <Badge variant={prospecto.semaforo}>
            {prospecto.semaforo === "verde" ? "🟢" : prospecto.semaforo === "amarillo" ? "🟡" : "🔴"}
          </Badge>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <CopyLinkButton
          path={`/diagnostico/${prospecto.id}`}
          label="Copiar link del diagnóstico para compartir"
        />
        <EliminarProspectoButton prospectoId={prospecto.id} nombre={prospecto.nombre} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <GlassCard className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
            Datos de contacto
          </h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">Negocio</dt>
              <dd className="text-white">{prospecto.empresa ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">Tipo de negocio</dt>
              <dd className="text-white">{prospecto.tipo_negocio ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">WhatsApp</dt>
              <dd className="text-white">{prospecto.whatsapp}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">Correo</dt>
              <dd className="text-white">{prospecto.email ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">País / Ciudad</dt>
              <dd className="text-white">
                {[prospecto.pais, prospecto.ciudad].filter(Boolean).join(" / ") || "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">Origen</dt>
              <dd className="text-white">{prospecto.canal_origen ?? "—"}</dd>
            </div>
          </dl>
          {prospecto.notas && (
            <p className="mt-4 rounded-xl bg-white/[0.03] p-3 text-sm text-text-secondary">
              {prospecto.notas}
            </p>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
            Siguientes pasos del embudo
          </h2>
          <ul className="mt-4 space-y-2">
            {PROXIMOS_PASOS.map((paso) =>
              paso.ruta ? (
                <li key={paso.label}>
                  <Link
                    href={`/panel/prospectos/${prospecto.id}/${paso.ruta}`}
                    className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 text-sm text-white transition-colors hover:bg-white/[0.06]"
                  >
                    {paso.label}
                    <span className="text-xs text-accent">
                      {paso.ruta === "filtro" && resumenFiltro
                        ? "Ver de nuevo →"
                        : paso.ruta === "diagnostico" && diagnostico
                          ? diagnostico.completado
                            ? "Ver de nuevo →"
                            : "Continuar →"
                          : "Abrir →"}
                    </span>
                  </Link>
                </li>
              ) : (
                <li
                  key={paso.label}
                  className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 text-sm text-text-secondary"
                >
                  {paso.label}
                  <span className="text-xs">Próximamente</span>
                </li>
              ),
            )}
          </ul>
          {diagnostico && (
            <div className="mt-4 border-t border-border-glass pt-4">
              <CopiarParaIABoton
                nombreProspecto={prospecto.nombre}
                empresa={prospecto.empresa}
                tipoNegocio={prospecto.tipo_negocio}
                resumenFiltro={resumenFiltro ?? []}
                respuestasDiagnostico={diagnostico.respuestas}
              />
            </div>
          )}
        </GlassCard>
      </div>

      {resumenFiltro && filtro && (
        <GlassCard className="mt-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
              Lo que dijo en el filtro rápido
            </h2>
            <Badge variant={filtro.semaforo}>
              {filtro.semaforo === "verde" ? "🟢" : filtro.semaforo === "amarillo" ? "🟡" : "🔴"}{" "}
              {new Date(filtro.created_at).toLocaleDateString("es-CO")}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-text-secondary">{filtro.razon}</p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {resumenFiltro.map((r) => (
              <div key={r.pregunta} className="rounded-xl bg-white/[0.03] p-3">
                <dt className="text-xs text-text-secondary">{r.pregunta}</dt>
                <dd className="mt-0.5 text-sm text-white">{r.respuesta}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 border-t border-border-glass pt-6">
            <MensajeSugeridoWhatsApp
              semaforo={filtro.semaforo}
              nombre={prospecto.nombre}
              whatsapp={prospecto.whatsapp}
              empresa={prospecto.empresa}
              tipoNegocio={prospecto.tipo_negocio}
              respuestasFiltro={filtro.respuestas}
            />
          </div>
        </GlassCard>
      )}
    </div>
  );
}
