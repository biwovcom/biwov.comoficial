"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { PAQUETES_INFO, type AnalisisIA } from "@/lib/panel/ia/schema";
import { AnalisisImprimible } from "./AnalisisImprimible";

interface FilaAnalisis {
  id: string;
  version: number;
  origen: "ia" | "manual";
  generado_por_ia: AnalisisIA | null;
  contenido_editado: AnalisisIA | null;
  texto_manual: string | null;
  modelo: string | null;
  estado: "borrador" | "aprobado";
  creado_en: string;
}

const inputClass =
  "w-full rounded-xl border border-border-glass bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-accent";
const textareaClass = `${inputClass} resize-y`;

function CampoTexto({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-text-secondary">{label}</p>
      <textarea rows={rows} className={textareaClass} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function CampoLista({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  rows?: number;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-text-secondary">{label} (una por línea)</p>
      <textarea
        rows={rows}
        className={textareaClass}
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
      />
    </div>
  );
}

function CampoPuntaje({
  label,
  value,
  onChange,
}: {
  label: string;
  value: { puntaje: number; justificacion: string };
  onChange: (v: { puntaje: number; justificacion: string }) => void;
}) {
  return (
    <div className="rounded-xl bg-white/[0.03] p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-text-secondary">{label}</p>
        <input
          type="number"
          min={1}
          max={10}
          className="w-16 rounded-lg border border-border-glass bg-white/[0.03] px-2 py-1 text-center text-sm text-white outline-none focus:border-accent"
          value={value.puntaje}
          onChange={(e) => onChange({ ...value, puntaje: Number(e.target.value) })}
        />
      </div>
      <textarea
        rows={2}
        className={textareaClass}
        value={value.justificacion}
        onChange={(e) => onChange({ ...value, justificacion: e.target.value })}
      />
    </div>
  );
}

function BotonDescargarPDF() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-xl border border-border-glass px-4 py-2.5 text-sm text-text-secondary transition-colors hover:border-accent/40 hover:text-white"
    >
      <Download size={16} /> Descargar en PDF
    </button>
  );
}

export function AnalisisForm({
  prospectoId,
  prospectoNombre,
  empresa,
  analisisInicial,
  diagnosticoDisponible,
}: {
  prospectoId: string;
  prospectoNombre: string;
  empresa: string | null;
  analisisInicial: FilaAnalisis | null;
  diagnosticoDisponible: boolean;
}) {
  const [analisisFila, setAnalisisFila] = useState<FilaAnalisis | null>(analisisInicial);
  const [contenido, setContenido] = useState<AnalisisIA | null>(analisisInicial?.contenido_editado ?? null);
  const [textoManual, setTextoManual] = useState(analisisInicial?.texto_manual ?? "");
  const [generando, setGenerando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generar = async () => {
    setGenerando(true);
    setError(null);
    try {
      const res = await fetch("/api/panel/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectoId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "No se pudo generar el análisis.");
        return;
      }
      setAnalisisFila(data.analisis);
      setContenido(data.analisis.contenido_editado);
    } finally {
      setGenerando(false);
    }
  };

  const guardarManualNuevo = async () => {
    if (!textoManual.trim()) return;
    setGuardando(true);
    setError(null);
    try {
      const res = await fetch("/api/panel/analisis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectoId, textoManual }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "No se pudo guardar el análisis.");
        return;
      }
      setAnalisisFila(data.analisis);
    } finally {
      setGuardando(false);
    }
  };

  const guardar = async (aprobar = false) => {
    if (!analisisFila) return;
    setGuardando(true);
    setError(null);
    try {
      const res = await fetch("/api/panel/analisis", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body:
          analisisFila.origen === "manual"
            ? JSON.stringify({ analisisId: analisisFila.id, textoManual, aprobar })
            : JSON.stringify({ analisisId: analisisFila.id, contenidoEditado: contenido, aprobar }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "No se pudo guardar.");
        return;
      }
      setAnalisisFila((prev) => (prev ? { ...prev, estado: aprobar ? "aprobado" : "borrador" } : prev));
    } finally {
      setGuardando(false);
    }
  };

  const update = (patch: Partial<AnalisisIA>) => setContenido((prev) => (prev ? { ...prev, ...patch } : prev));

  if (!diagnosticoDisponible) {
    return (
      <GlassCard className="max-w-xl p-6">
        <p className="text-sm text-text-secondary">
          Este prospecto todavía no tiene un Diagnóstico guardado. Llena el Diagnóstico primero
          para poder generar el análisis con IA.
        </p>
      </GlassCard>
    );
  }

  if (!analisisFila) {
    return (
      <div className="max-w-xl space-y-5">
        <GlassCard className="p-6">
          <p className="mb-4 text-sm text-text-secondary">
            Todavía no se ha generado un análisis para este prospecto.
          </p>
          <Button size="lg" onClick={generar} disabled={generando}>
            {generando ? "Analizando (puede tardar unos segundos)..." : "Generar análisis con IA"}
          </Button>
        </GlassCard>

        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <div className="h-px flex-1 bg-border-glass" />O<div className="h-px flex-1 bg-border-glass" />
        </div>

        <GlassCard className="p-6">
          <p className="mb-1 text-sm font-semibold text-white">Pegar análisis hecho en claude.ai</p>
          <p className="mb-4 text-xs text-text-secondary">
            Usa el botón &ldquo;Copiar todo para analizar en claude.ai&rdquo; de la ficha del
            prospecto, pégalo allá, y luego pega aquí la respuesta que te dio.
          </p>
          <textarea
            rows={10}
            className="w-full resize-y rounded-xl border border-border-glass bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-text-secondary/50 outline-none focus:border-accent"
            placeholder="Pega aquí el análisis completo que te dio claude.ai..."
            value={textoManual}
            onChange={(e) => setTextoManual(e.target.value)}
          />
          <Button size="lg" className="mt-4 w-full" onClick={guardarManualNuevo} disabled={guardando || !textoManual.trim()}>
            {guardando ? "Guardando..." : "Guardar análisis pegado"}
          </Button>
        </GlassCard>

        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }

  if (analisisFila.origen === "manual") {
    return (
      <>
        <div className="max-w-3xl space-y-5 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge variant={analisisFila.estado === "aprobado" ? "verde" : "neutral"}>
              {analisisFila.estado === "aprobado" ? "Aprobado" : "Borrador"} — versión {analisisFila.version} (pegado a mano)
            </Badge>
            <BotonDescargarPDF />
          </div>

          <GlassCard className="p-5">
            <p className="mb-2 text-sm font-semibold text-white">Análisis</p>
            <textarea
              rows={16}
              className="w-full resize-y rounded-xl border border-border-glass bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-accent"
              value={textoManual}
              onChange={(e) => setTextoManual(e.target.value)}
            />
          </GlassCard>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary" size="lg" onClick={() => guardar(false)} disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar cambios"}
            </Button>
            <Button size="lg" onClick={() => guardar(true)} disabled={guardando}>
              {guardando ? "Guardando..." : "Aprobar análisis"}
            </Button>
          </div>
        </div>
        <div className="hidden print:block">
          <AnalisisImprimible
            prospectoNombre={prospectoNombre}
            empresa={empresa}
            contenido={null}
            textoManual={textoManual}
          />
        </div>
      </>
    );
  }

  if (!contenido) {
    return null;
  }

  return (
    <>
    <div className="max-w-3xl space-y-5 print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge variant={analisisFila?.estado === "aprobado" ? "verde" : "neutral"}>
          {analisisFila?.estado === "aprobado" ? "Aprobado" : "Borrador"} — versión {analisisFila?.version}
        </Badge>
        <div className="flex items-center gap-3">
          <BotonDescargarPDF />
          <Button variant="secondary" onClick={generar} disabled={generando}>
            {generando ? "Generando..." : "Generar de nuevo (nueva versión)"}
          </Button>
        </div>
      </div>

      <GlassCard className="space-y-4 p-5">
        <p className="text-sm font-semibold text-white">Etapa del negocio</p>
        <Select
          value={contenido.etapaNegocio}
          onChange={(e) => update({ etapaNegocio: e.target.value as AnalisisIA["etapaNegocio"] })}
        >
          <option value="empezando">Empezando</option>
          <option value="vende-irregular">Vende irregular</option>
          <option value="vende-estable-escalar">Vende estable y quiere escalar</option>
        </Select>
        <CampoTexto
          label="Explicación"
          value={contenido.etapaNegocioExplicacion}
          onChange={(v) => update({ etapaNegocioExplicacion: v })}
        />
      </GlassCard>

      <GlassCard className="space-y-4 p-5">
        <p className="text-sm font-semibold text-white">Diagnóstico</p>
        <CampoLista
          label="Qué tiene"
          value={contenido.diagnostico.queTiene}
          onChange={(v) => update({ diagnostico: { ...contenido.diagnostico, queTiene: v } })}
        />
        <CampoLista
          label="Qué le falta"
          value={contenido.diagnostico.queLeFalta}
          onChange={(v) => update({ diagnostico: { ...contenido.diagnostico, queLeFalta: v } })}
        />
        <CampoTexto
          label="Por qué no ha crecido"
          value={contenido.diagnostico.porQueNoHaCrecido}
          onChange={(v) => update({ diagnostico: { ...contenido.diagnostico, porQueNoHaCrecido: v } })}
        />
      </GlassCard>

      <GlassCard className="space-y-4 p-5">
        <p className="text-sm font-semibold text-white">Lo que pide vs. lo que necesita</p>
        <CampoTexto
          label="Lo que pide"
          value={contenido.pideVsNecesita.pide}
          onChange={(v) => update({ pideVsNecesita: { ...contenido.pideVsNecesita, pide: v } })}
          rows={2}
        />
        <CampoTexto
          label="Lo que necesita"
          value={contenido.pideVsNecesita.necesita}
          onChange={(v) => update({ pideVsNecesita: { ...contenido.pideVsNecesita, necesita: v } })}
          rows={2}
        />
      </GlassCard>

      <GlassCard className="space-y-3 p-5">
        <p className="text-sm font-semibold text-white">Evaluación del mercado (1 a 10)</p>
        <CampoPuntaje
          label="Dolor"
          value={contenido.evaluacionMercado.dolor}
          onChange={(v) => update({ evaluacionMercado: { ...contenido.evaluacionMercado, dolor: v } })}
        />
        <CampoPuntaje
          label="Capacidad de pago"
          value={contenido.evaluacionMercado.capacidadDePago}
          onChange={(v) => update({ evaluacionMercado: { ...contenido.evaluacionMercado, capacidadDePago: v } })}
        />
        <CampoPuntaje
          label="Facilidad para encontrarlo"
          value={contenido.evaluacionMercado.facilidadParaEncontrarlo}
          onChange={(v) =>
            update({ evaluacionMercado: { ...contenido.evaluacionMercado, facilidadParaEncontrarlo: v } })
          }
        />
        <CampoPuntaje
          label="Crecimiento del sector"
          value={contenido.evaluacionMercado.crecimiento}
          onChange={(v) => update({ evaluacionMercado: { ...contenido.evaluacionMercado, crecimiento: v } })}
        />
      </GlassCard>

      <GlassCard className="space-y-4 border-accent/30 bg-accent/5 p-5">
        <p className="text-sm font-semibold text-white">Cuello de botella</p>
        <Select
          value={contenido.cuelloDeBotella.tipo}
          onChange={(e) =>
            update({
              cuelloDeBotella: {
                ...contenido.cuelloDeBotella,
                tipo: e.target.value as AnalisisIA["cuelloDeBotella"]["tipo"],
              },
            })
          }
        >
          <option value="captacion">Captación — entran pocos interesados</option>
          <option value="conversion">Conversión — entran muchos pero compran pocos</option>
          <option value="oferta">Oferta — vende pero cada cliente deja poco</option>
          <option value="operacion">Operación — vende bien pero no da abasto</option>
        </Select>
        <CampoTexto
          label="Explicación"
          value={contenido.cuelloDeBotella.explicacion}
          onChange={(v) => update({ cuelloDeBotella: { ...contenido.cuelloDeBotella, explicacion: v } })}
        />
      </GlassCard>

      <GlassCard className="space-y-4 p-5">
        <p className="text-sm font-semibold text-white">Paquete recomendado</p>
        <Select
          value={contenido.paqueteRecomendado.paquete}
          onChange={(e) =>
            update({
              paqueteRecomendado: {
                ...contenido.paqueteRecomendado,
                paquete: e.target.value as AnalisisIA["paqueteRecomendado"]["paquete"],
              },
            })
          }
        >
          {Object.entries(PAQUETES_INFO).map(([id, info]) => (
            <option key={id} value={id}>
              {info.nombre}
            </option>
          ))}
        </Select>
        <p className="text-xs text-text-secondary">
          {PAQUETES_INFO[contenido.paqueteRecomendado.paquete].descripcion}
        </p>
        <CampoTexto
          label="Justificación"
          value={contenido.paqueteRecomendado.justificacion}
          onChange={(v) => update({ paqueteRecomendado: { ...contenido.paqueteRecomendado, justificacion: v } })}
        />
      </GlassCard>

      <GlassCard className="space-y-4 p-5">
        <CampoLista
          label="Qué NO recomendar por ahora"
          value={contenido.noRecomendarPorAhora}
          onChange={(v) => update({ noRecomendarPorAhora: v })}
        />
        <CampoLista
          label="Íconos del ecosistema que se activan"
          value={contenido.iconosEcosistemaActivos}
          onChange={(v) => update({ iconosEcosistemaActivos: v })}
          rows={2}
        />
        <CampoLista
          label="5 ideas de contenido"
          value={contenido.ideasContenido}
          onChange={(v) => update({ ideasContenido: v })}
          rows={5}
        />
      </GlassCard>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" size="lg" onClick={() => guardar(false)} disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar cambios"}
        </Button>
        <Button size="lg" onClick={() => guardar(true)} disabled={guardando}>
          {guardando ? "Guardando..." : "Aprobar análisis"}
        </Button>
      </div>
    </div>
    <div className="hidden print:block">
      <AnalisisImprimible
        prospectoNombre={prospectoNombre}
        empresa={empresa}
        contenido={contenido}
        textoManual={null}
      />
    </div>
    </>
  );
}
