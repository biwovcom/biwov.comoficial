"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { CampoConMicrofono } from "@/components/panel/CampoConMicrofono";
import {
  BLOQUES_DIAGNOSTICO,
  CAMPOS_REDES_SOCIALES,
  type RespuestasDiagnosticoLargo,
} from "@/lib/panel/diagnosticoLargo";

function idCampoRed(campoId: string) {
  return `red_${campoId}`;
}

type EstadoGuardado = "guardado" | "guardando" | "sin-guardar" | "error";

export function DiagnosticoForm({
  prospectoId,
  respuestasIniciales,
}: {
  prospectoId: string;
  respuestasIniciales: RespuestasDiagnosticoLargo;
}) {
  const router = useRouter();
  const [respuestas, setRespuestas] = useState<RespuestasDiagnosticoLargo>(respuestasIniciales);
  const [estado, setEstado] = useState<EstadoGuardado>("guardado");
  const [finalizando, setFinalizando] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const guardar = async (datos: RespuestasDiagnosticoLargo, completado = false) => {
    setEstado("guardando");
    try {
      const res = await fetch("/api/panel/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectoId, respuestas: datos, completado }),
      });
      setEstado(res.ok ? "guardado" : "error");
      return res.ok;
    } catch {
      setEstado("error");
      return false;
    }
  };

  const actualizarBloque = (bloqueId: string, texto: string) => {
    const nuevas = { ...respuestas, [bloqueId]: texto };
    setRespuestas(nuevas);
    setEstado("sin-guardar");

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      guardar(nuevas);
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const finalizar = async () => {
    setFinalizando(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const ok = await guardar(respuestas, true);
    setFinalizando(false);
    if (ok) {
      router.push(`/panel/prospectos/${prospectoId}`);
    }
  };

  const etiquetaEstado: Record<EstadoGuardado, string> = {
    guardado: "Guardado ✓",
    guardando: "Guardando...",
    "sin-guardar": "Escribiendo...",
    error: "No se pudo guardar — revisa tu conexión",
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-end">
        <span
          className={`text-xs ${estado === "error" ? "text-red-400" : "text-text-secondary"}`}
        >
          {etiquetaEstado[estado]}
        </span>
      </div>

      <GlassCard className="p-5">
        <p className="mb-1 text-sm font-semibold text-white">Redes sociales del negocio</p>
        <p className="mb-4 text-xs text-text-secondary">
          Cómo aparece o se llama en cada plataforma, para poder ubicar sus perfiles reales.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {CAMPOS_REDES_SOCIALES.map((campo) => (
            <div key={campo.id}>
              <Label htmlFor={idCampoRed(campo.id)}>{campo.label}</Label>
              <Input
                id={idCampoRed(campo.id)}
                placeholder={campo.placeholder}
                value={respuestas[idCampoRed(campo.id)] ?? ""}
                onChange={(e) => actualizarBloque(idCampoRed(campo.id), e.target.value)}
              />
            </div>
          ))}
        </div>
      </GlassCard>

      {BLOQUES_DIAGNOSTICO.map((bloque) => (
        <CampoConMicrofono
          key={bloque.id}
          bloque={bloque}
          value={respuestas[bloque.id] ?? ""}
          onChange={(texto) => actualizarBloque(bloque.id, texto)}
        />
      ))}

      <GlassCard className="flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="text-sm text-text-secondary">
          El avance se guarda solo. Cuando termines, márcalo como completo para pasar al análisis.
        </p>
        <Button size="lg" onClick={finalizar} disabled={finalizando}>
          {finalizando ? "Guardando..." : "Marcar diagnóstico como completo"}
        </Button>
      </GlassCard>
    </div>
  );
}
