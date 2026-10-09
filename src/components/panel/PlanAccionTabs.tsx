"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  TIPOS_ANALISIS_SUGERIDOS,
  TIPOS_CREATIVO_SUGERIDOS,
  TIPOS_EMBUDO_SUGERIDOS,
  type PlanCreativoEntrada,
} from "@/lib/panel/planCreativos";
import { primerDiaDelMes, type PlanCampana } from "@/lib/panel/planCampanas";
import type { Reunion } from "@/lib/panel/reuniones";
import type { RedHistorialEntrada } from "@/lib/panel/redesHistorial";
import { PlanCreativos } from "./PlanCreativos";
import { CalendarioMes } from "./CalendarioMes";
import { TableroCreativos } from "./TableroCreativos";
import { BriefCampana } from "./BriefCampana";
import { RedesHistorialProspecto } from "./RedesHistorialProspecto";
import { ReunionesProspecto } from "./ReunionesProspecto";
import { PlanAccionImprimible } from "./PlanAccionImprimible";
import { SelectorMes } from "./SelectorMes";
import { cn } from "@/lib/utils";

const PESTANAS = ["Creativos", "Embudo y campaña", "Redes y crecimiento", "Análisis y resultados", "Reuniones"] as const;
type Pestana = (typeof PESTANAS)[number];

const VISTAS_CREATIVOS = ["Calendario", "Tablero", "Lista"] as const;
type VistaCreativos = (typeof VISTAS_CREATIVOS)[number];

const HOY = new Date();

export function PlanAccionTabs({
  prospectoId,
  prospectoNombre,
  empresa,
  creativosIniciales,
  embudoIniciales,
  analisisIniciales,
  campanasIniciales,
  redesIniciales,
  reunionesIniciales,
}: {
  prospectoId: string;
  prospectoNombre: string;
  empresa: string | null;
  creativosIniciales: PlanCreativoEntrada[];
  embudoIniciales: PlanCreativoEntrada[];
  analisisIniciales: PlanCreativoEntrada[];
  campanasIniciales: PlanCampana[];
  redesIniciales: RedHistorialEntrada[];
  reunionesIniciales: Reunion[];
}) {
  const [activa, setActiva] = useState<Pestana>("Creativos");
  const [vistaCreativos, setVistaCreativos] = useState<VistaCreativos>("Calendario");
  const [anio, setAnio] = useState(HOY.getFullYear());
  const [mes, setMes] = useState(HOY.getMonth() + 1);

  const [creativos, setCreativos] = useState(creativosIniciales);
  const [embudo, setEmbudo] = useState(embudoIniciales);
  const [analisis, setAnalisis] = useState(analisisIniciales);
  const [campanas, setCampanas] = useState(campanasIniciales);

  const mesTexto = primerDiaDelMes(anio, mes);
  const creativosDelMes = creativos.filter((c) => c.fecha?.startsWith(mesTexto.slice(0, 7)));
  const embudoDelMes = embudo.filter((e) => !e.fecha || e.fecha.startsWith(mesTexto.slice(0, 7)));
  const campanaDelMes = campanas.find((c) => c.mes === mesTexto) ?? null;

  const actualizarCampana = (actualizada: PlanCampana) => {
    setCampanas((prev) => {
      const existe = prev.some((c) => c.id === actualizada.id);
      return existe ? prev.map((c) => (c.id === actualizada.id ? actualizada : c)) : [...prev, actualizada];
    });
  };

  return (
    <>
      <div className="print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex flex-wrap gap-1 rounded-full border border-border-glass bg-white/[0.02] p-1">
            {PESTANAS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setActiva(p)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                  activa === p ? "bg-gradient-brand text-white" : "text-text-secondary hover:text-white",
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl border border-border-glass px-4 py-2.5 text-sm text-text-secondary transition-colors hover:border-accent/40 hover:text-white"
          >
            <Download size={16} /> Descargar en PDF
          </button>
        </div>

        {(activa === "Creativos" || activa === "Embudo y campaña") && (
          <div className="mt-4">
            <SelectorMes anio={anio} mes={mes} onChange={(a, m) => { setAnio(a); setMes(m); }} />
          </div>
        )}

        <GlassCard className="mt-5 p-6">
          {activa === "Creativos" && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">Creativos</h2>
              <p className="mt-1 text-xs text-text-secondary">
                Ideas de contenido y referentes, historias, guiones, copys y textos de oferta — organizados por
                mes y por estado, en Historias o en Feed.
              </p>
              <div className="mt-4 flex gap-1.5">
                {VISTAS_CREATIVOS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVistaCreativos(v)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      vistaCreativos === v
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border-glass text-text-secondary hover:text-white",
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                {vistaCreativos === "Calendario" && (
                  <CalendarioMes
                    prospectoId={prospectoId}
                    anio={anio}
                    mes={mes}
                    tiposSugeridos={TIPOS_CREATIVO_SUGERIDOS}
                    entradas={creativos}
                    onEntradasChange={setCreativos}
                  />
                )}
                {vistaCreativos === "Tablero" && (
                  <TableroCreativos
                    tiposSugeridos={TIPOS_CREATIVO_SUGERIDOS}
                    entradas={creativos}
                    onEntradasChange={setCreativos}
                  />
                )}
                {vistaCreativos === "Lista" && (
                  <PlanCreativos
                    prospectoId={prospectoId}
                    categoria="creativo"
                    titulo="Todos los creativos"
                    descripcion="Lista completa, sin filtrar por mes."
                    tiposSugeridos={TIPOS_CREATIVO_SUGERIDOS}
                    entradas={creativos}
                    onEntradasChange={setCreativos}
                  />
                )}
              </div>
            </div>
          )}

          {activa === "Embudo y campaña" && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
                Embudo y campaña
              </h2>
              <p className="mt-1 text-xs text-text-secondary">
                El brief de la campaña de este mes, para mostrárselo al cliente y que lo apruebe antes de
                montar la campaña o de grabar/editar los videos.
              </p>
              <div className="mt-4">
                <BriefCampana
                  prospectoId={prospectoId}
                  anio={anio}
                  mes={mes}
                  campana={campanaDelMes}
                  creativosDelMes={creativosDelMes}
                  onGuardado={actualizarCampana}
                />
              </div>
              <div className="mt-6 border-t border-border-glass pt-5">
                <PlanCreativos
                  prospectoId={prospectoId}
                  categoria="embudo"
                  titulo="Notas adicionales de estructura"
                  descripcion="Para lo que no entre en un campo fijo del brief (estrategia de contenido, aclaraciones, etc.)."
                  tiposSugeridos={TIPOS_EMBUDO_SUGERIDOS}
                  entradas={embudoDelMes}
                  onEntradasChange={(nuevas) => {
                    const otrosMeses = embudo.filter((e) => e.fecha && !e.fecha.startsWith(mesTexto.slice(0, 7)));
                    setEmbudo([...nuevas, ...otrosMeses]);
                  }}
                />
              </div>
            </div>
          )}

          {activa === "Redes y crecimiento" && (
            <RedesHistorialProspecto prospectoId={prospectoId} entradasIniciales={redesIniciales} />
          )}

          {activa === "Análisis y resultados" && (
            <PlanCreativos
              prospectoId={prospectoId}
              categoria="analisis"
              titulo="Análisis y resultados"
              descripcion="Estudio de la campaña y de los creativos finales una vez publicados: qué funcionó, qué no, y por qué."
              tiposSugeridos={TIPOS_ANALISIS_SUGERIDOS}
              entradas={analisis}
              onEntradasChange={setAnalisis}
            />
          )}

          {activa === "Reuniones" && (
            <ReunionesProspecto prospectoId={prospectoId} reunionesIniciales={reunionesIniciales} />
          )}
        </GlassCard>
      </div>

      <div className="hidden print:block">
        <PlanAccionImprimible
          prospectoNombre={prospectoNombre}
          empresa={empresa}
          creativos={creativos}
          embudo={embudo}
          campana={campanaDelMes}
        />
      </div>
    </>
  );
}
