"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { TIPOS_CREATIVO_SUGERIDOS, TIPOS_EMBUDO_SUGERIDOS, type PlanCreativoEntrada } from "@/lib/panel/planCreativos";
import type { Reunion } from "@/lib/panel/reuniones";
import { PlanCreativos } from "./PlanCreativos";
import { ReunionesProspecto } from "./ReunionesProspecto";
import { PlanAccionImprimible } from "./PlanAccionImprimible";
import { cn } from "@/lib/utils";

const PESTANAS = ["Creativos", "Embudo y campaña", "Reuniones"] as const;
type Pestana = (typeof PESTANAS)[number];

export function PlanAccionTabs({
  prospectoId,
  prospectoNombre,
  empresa,
  creativosIniciales,
  embudoIniciales,
  reunionesIniciales,
}: {
  prospectoId: string;
  prospectoNombre: string;
  empresa: string | null;
  creativosIniciales: PlanCreativoEntrada[];
  embudoIniciales: PlanCreativoEntrada[];
  reunionesIniciales: Reunion[];
}) {
  const [activa, setActiva] = useState<Pestana>("Creativos");
  const [creativos, setCreativos] = useState(creativosIniciales);
  const [embudo, setEmbudo] = useState(embudoIniciales);

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

        <GlassCard className="mt-5 p-6">
          {activa === "Creativos" && (
            <PlanCreativos
              prospectoId={prospectoId}
              categoria="creativo"
              titulo="Creativos"
              descripcion="Ideas de contenido y referentes (pega el link + una referencia breve), historias numeradas, guiones, copys y textos de oferta. Agrega los que necesites."
              tiposSugeridos={TIPOS_CREATIVO_SUGERIDOS}
              entradas={creativos}
              onEntradasChange={setCreativos}
            />
          )}
          {activa === "Embudo y campaña" && (
            <PlanCreativos
              prospectoId={prospectoId}
              categoria="embudo"
              titulo="Embudo y campaña"
              descripcion="La estructura del embudo y de la campaña publicitaria, para mostrársela al cliente y que la apruebe antes de montar la campaña o de grabar/editar los videos."
              tiposSugeridos={TIPOS_EMBUDO_SUGERIDOS}
              entradas={embudo}
              onEntradasChange={setEmbudo}
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
        />
      </div>
    </>
  );
}
