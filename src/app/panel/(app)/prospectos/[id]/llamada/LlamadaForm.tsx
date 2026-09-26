"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { CampoConMicrofono } from "@/components/panel/CampoConMicrofono";
import { PREGUNTAS_CLAVE_LLAMADA, GUION_LLAMADA, type RespuestasLlamada } from "@/lib/panel/llamada";

type EstadoGuardado = "guardado" | "guardando" | "sin-guardar" | "error";

export function LlamadaForm({
  prospectoId,
  linkRedesInicial,
  queQuiereResolverInicial,
  respuestasIniciales,
}: {
  prospectoId: string;
  linkRedesInicial: string;
  queQuiereResolverInicial: string;
  respuestasIniciales: RespuestasLlamada;
}) {
  const router = useRouter();
  const [linkRedes, setLinkRedes] = useState(linkRedesInicial);
  const [queResolver, setQueResolver] = useState(queQuiereResolverInicial);
  const [respuestas, setRespuestas] = useState<RespuestasLlamada>(respuestasIniciales);
  const [estado, setEstado] = useState<EstadoGuardado>("guardado");
  const [finalizando, setFinalizando] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const guardar = async (
    datos: { linkRedes: string; queResolver: string; respuestas: RespuestasLlamada },
    completado = false,
  ) => {
    setEstado("guardando");
    try {
      const res = await fetch("/api/panel/llamada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectoId,
          respuestas: datos.respuestas,
          linkRedesProspecto: datos.linkRedes,
          queQuiereResolver: datos.queResolver,
          completado,
        }),
      });
      setEstado(res.ok ? "guardado" : "error");
      return res.ok;
    } catch {
      setEstado("error");
      return false;
    }
  };

  const programarGuardado = (linkRedesNuevo: string, queResolverNuevo: string, respuestasNuevas: RespuestasLlamada) => {
    setEstado("sin-guardar");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      guardar({ linkRedes: linkRedesNuevo, queResolver: queResolverNuevo, respuestas: respuestasNuevas });
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
    const ok = await guardar({ linkRedes, queResolver, respuestas }, true);
    setFinalizando(false);
    if (ok) router.push(`/panel/prospectos/${prospectoId}`);
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
        <span className={`text-xs ${estado === "error" ? "text-red-400" : "text-text-secondary"}`}>
          {etiquetaEstado[estado]}
        </span>
      </div>

      <GlassCard className="space-y-4 p-5">
        <p className="text-sm font-semibold text-white">Antes de la llamada (Ajuste 1)</p>
        <p className="text-xs text-text-secondary">
          Pídele esto al confirmar la cita. Antes de la reunión, revisa tú misma su perfil, su web
          y 2 competidores — así llegas con observaciones reales.
        </p>
        <div>
          <Label htmlFor="link-redes">Link de Instagram o página web</Label>
          <Input
            id="link-redes"
            value={linkRedes}
            onChange={(e) => {
              setLinkRedes(e.target.value);
              programarGuardado(e.target.value, queResolver, respuestas);
            }}
          />
        </div>
        <div>
          <Label htmlFor="que-resolver">¿Qué le gustaría resolver en esta llamada?</Label>
          <textarea
            id="que-resolver"
            rows={2}
            className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-accent"
            value={queResolver}
            onChange={(e) => {
              setQueResolver(e.target.value);
              programarGuardado(linkRedes, e.target.value, respuestas);
            }}
          />
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <p className="mb-3 text-sm font-semibold text-white">Guion de la llamada (45 min)</p>
        <ol className="space-y-2">
          {GUION_LLAMADA.map((fase) => (
            <li key={fase.titulo} className="rounded-xl bg-white/[0.03] p-3">
              <p className="text-sm text-white">
                <span className="text-accent">{fase.minutos} min</span> — {fase.titulo}
              </p>
              <p className="mt-0.5 text-xs text-text-secondary">{fase.descripcion}</p>
            </li>
          ))}
        </ol>
      </GlassCard>

      <p className="text-sm font-semibold text-white">Las 10 preguntas clave (Ajuste 2)</p>
      {PREGUNTAS_CLAVE_LLAMADA.map((pregunta) => (
        <CampoConMicrofono
          key={pregunta.id}
          bloque={pregunta}
          value={respuestas[pregunta.id] ?? ""}
          onChange={(texto) => {
            const nuevas = { ...respuestas, [pregunta.id]: texto };
            setRespuestas(nuevas);
            programarGuardado(linkRedes, queResolver, nuevas);
          }}
        />
      ))}

      <GlassCard className="flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="text-sm text-text-secondary">
          Cuando termines la llamada, márcala como completa para avanzar en el embudo.
        </p>
        <Button size="lg" onClick={finalizar} disabled={finalizando}>
          {finalizando ? "Guardando..." : "Marcar llamada como completa"}
        </Button>
      </GlassCard>
    </div>
  );
}
