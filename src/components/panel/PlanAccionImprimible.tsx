import { ETAPAS_EMBUDO, type EtapaEmbudo, type PlanCreativoEntrada } from "@/lib/panel/planCreativos";
import type { PlanCampana } from "@/lib/panel/planCampanas";
import { filasFormulas, type RedHistorialEntrada } from "@/lib/panel/redesHistorial";

export type ModoImprimible = "todo" | "creativos" | "embudo" | "redes" | "analisis";

function SeccionTemperatura({ items }: { items: PlanCreativoEntrada[] }) {
  const clasificados = items.filter((i) => i.etapa_embudo);
  if (clasificados.length === 0) return null;

  const conteos: Record<EtapaEmbudo, number> = { tofu: 0, mofu: 0, bofu: 0 };
  for (const item of clasificados) {
    if (item.etapa_embudo) conteos[item.etapa_embudo]++;
  }
  const total = clasificados.length;

  return (
    <div className="mb-6 break-inside-avoid">
      <h2 className="text-sm font-bold uppercase tracking-wide text-[#0d3b66]">Temperatura del embudo</h2>
      <p className="mt-1 text-xs text-[#5b6677]">
        Mezcla ideal: 60-70% TOFU, 20-30% MOFU, ~10% BOFU.
      </p>
      <div className="mt-2 grid grid-cols-3 gap-3">
        {(Object.keys(ETAPAS_EMBUDO) as EtapaEmbudo[]).map((etapa) => {
          const pct = (conteos[etapa] / total) * 100;
          return (
            <div key={etapa} className="text-xs text-[#111827]">
              <p className="font-semibold">
                {ETAPAS_EMBUDO[etapa].label}: {pct.toFixed(0)}% ({conteos[etapa]})
              </p>
              <p className="text-[#5b6677]">
                Ideal {ETAPAS_EMBUDO[etapa].idealMin}-{ETAPAS_EMBUDO[etapa].idealMax}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SeccionCampana({ campana }: { campana: PlanCampana }) {
  const filas: [string, string | null][] = [
    ["Objetivo de conversión", campana.objetivo_conversion],
    [
      "Presupuesto",
      campana.presupuesto_mensual
        ? `${campana.presupuesto_mensual} ${campana.moneda ?? ""} al mes (${campana.presupuesto_diario ?? "—"} diario)`
        : null,
    ],
    ["CPA máximo", campana.cpa_maximo ? `${campana.cpa_maximo} ${campana.moneda ?? ""}` : null],
    ["Conjuntos / creativos objetivo", `${campana.num_conjuntos ?? "—"} conjuntos / ${campana.num_creativos_objetivo ?? "—"} creativos`],
    ["Público", campana.publico],
    ["Evento de calificación", campana.evento_calificacion],
    ["Oferta principal", campana.oferta_principal],
    ["Objetivo del mes", campana.objetivo_mes],
    ["Resultado del mes", campana.resultado_mes],
  ];

  return (
    <div className="mb-6 break-inside-avoid">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#0d3b66]">Brief de la campaña</h2>
        {campana.aprobado && (
          <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-semibold text-[#15803d]">
            ✓ Aprobado{campana.aprobado_en ? ` el ${new Date(campana.aprobado_en).toLocaleDateString("es-CO")}` : ""}
          </span>
        )}
      </div>
      <dl className="mt-2 space-y-1 text-sm text-[#111827]">
        {filas
          .filter(([, valor]) => valor)
          .map(([label, valor]) => (
            <p key={label}>
              <span className="font-semibold">{label}:</span> {valor}
            </p>
          ))}
      </dl>
    </div>
  );
}

function Seccion({ titulo, items }: { titulo: string; items: PlanCreativoEntrada[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6 break-inside-avoid">
      <h2 className="text-sm font-bold uppercase tracking-wide text-[#0d3b66]">{titulo}</h2>
      <div className="mt-2 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="break-inside-avoid border-t border-[#e5e7eb] pt-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#0d3b66]">{item.tipo}</span>
              {item.etapa_embudo && (
                <span className="rounded-full bg-[#eef2ff] px-2 py-0.5 text-[10px] font-semibold text-[#3730a3]">
                  {ETAPAS_EMBUDO[item.etapa_embudo].label}
                </span>
              )}
              {item.fecha && (
                <span className="text-[10px] text-[#5b6677]">
                  {new Date(`${item.fecha}T00:00:00`).toLocaleDateString("es-CO")}
                </span>
              )}
              {item.aprobado && (
                <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-semibold text-[#15803d]">
                  ✓ Aprobado{item.aprobado_en ? ` el ${new Date(item.aprobado_en).toLocaleDateString("es-CO")}` : ""}
                </span>
              )}
            </div>
            {item.titulo && <p className="mt-1 text-sm font-semibold text-[#111827]">{item.titulo}</p>}
            {item.link && (
              <p className="mt-0.5 text-xs text-[#1d4772] underline">{item.link}</p>
            )}
            {item.contenido && (
              <p className="mt-1 whitespace-pre-line text-sm text-[#111827]">{item.contenido}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SeccionRedes({ items }: { items: RedHistorialEntrada[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6 break-inside-avoid">
      <h2 className="text-sm font-bold uppercase tracking-wide text-[#0d3b66]">Redes y crecimiento</h2>
      <div className="mt-2 space-y-4">
        {items.map((e) => (
          <div key={e.id} className="break-inside-avoid border-t border-[#e5e7eb] pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0d3b66]">
              {e.red_social} · {new Date(`${e.fecha}T00:00:00`).toLocaleDateString("es-CO")} · periodo de{" "}
              {e.periodo_dias} días
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {filasFormulas(e)
                .filter((f) => f.valor !== null)
                .map((f) => (
                  <div key={f.label} className="text-xs text-[#111827]">
                    <p className="font-semibold">
                      {f.valor!.toLocaleString("es-CO", { maximumFractionDigits: 1 })} {f.unidad}
                    </p>
                    <p className="text-[#5b6677]">{f.label}</p>
                    {f.medidor && (
                      <p className="text-[#5b6677]">
                        {f.medidor.nivel === "verde"
                          ? "✓ Cumple"
                          : f.medidor.nivel === "rojo"
                            ? "✗ Bajo"
                            : "~ Promedio"}
                      </p>
                    )}
                  </div>
                ))}
            </div>
            {e.notas && <p className="mt-2 whitespace-pre-line text-xs text-[#111827]">{e.notas}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

const TITULO_MODO: Record<ModoImprimible, string> = {
  todo: "Plan de acción completo",
  creativos: "Creativos",
  embudo: "Embudo y campaña",
  redes: "Redes y crecimiento",
  analisis: "Análisis y resultados",
};

export function PlanAccionImprimible({
  prospectoNombre,
  empresa,
  modo = "todo",
  creativos,
  embudo,
  campana,
  redes,
  analisis,
}: {
  prospectoNombre: string;
  empresa: string | null;
  modo?: ModoImprimible;
  creativos: PlanCreativoEntrada[];
  embudo: PlanCreativoEntrada[];
  campana?: PlanCampana | null;
  redes: RedHistorialEntrada[];
  analisis: PlanCreativoEntrada[];
}) {
  const fecha = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });

  const mostrarCreativos = modo === "todo" || modo === "creativos";
  const mostrarEmbudo = modo === "todo" || modo === "embudo";
  const mostrarRedes = modo === "todo" || modo === "redes";
  const mostrarAnalisis = modo === "todo" || modo === "analisis";

  const vacio =
    (!mostrarCreativos || creativos.length === 0) &&
    (!mostrarEmbudo || (!campana?.aprobado && embudo.length === 0)) &&
    (!mostrarRedes || redes.length === 0) &&
    (!mostrarAnalisis || analisis.length === 0);

  return (
    <div className="bg-white p-8 text-[#111827]">
      <span className="font-logo text-2xl font-bold">biwov_</span>
      <p className="mt-0.5 text-xs text-[#4b5563]">Agencia de Marketing Digital</p>
      <div className="mt-3 h-1 w-full rounded-full bg-gradient-to-r from-[#1d4772] to-[#3d98cc]" />

      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-[#0d3b66]">
        {TITULO_MODO[modo]} · biwov_
      </p>
      <h1 className="mt-1 text-2xl font-bold text-[#0d1420]">{empresa || prospectoNombre}</h1>
      <p className="mt-1 text-xs text-[#5b6677]">{fecha}</p>

      <div className="mt-6 border-t border-[#d1d5db] pt-6">
        {mostrarCreativos && <SeccionTemperatura items={creativos} />}
        {mostrarCreativos && <Seccion titulo="Creativos" items={creativos} />}
        {mostrarEmbudo && campana?.aprobado && <SeccionCampana campana={campana} />}
        {mostrarEmbudo && <Seccion titulo="Notas de embudo y campaña" items={embudo} />}
        {mostrarRedes && <SeccionRedes items={redes} />}
        {mostrarAnalisis && <Seccion titulo="Análisis y resultados" items={analisis} />}
        {vacio && <p className="text-sm text-[#4b5563]">Todavía no hay información para mostrar aquí.</p>}
      </div>
    </div>
  );
}
