"use client";

import { useEffect, useState } from "react";
import { Play, Square, X } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { CATEGORIAS_TIEMPO_SUGERIDAS } from "@/lib/panel/tiempo";

const STORAGE_KEY = "biwov_cronometro_tiempo";

interface EstadoCronometro {
  startedAt: number;
  categoria: string;
  proyecto: string;
}

function leerEstadoGuardado(): EstadoCronometro | null {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    return guardado ? JSON.parse(guardado) : null;
  } catch {
    return null;
  }
}

function guardarEstado(estado: EstadoCronometro | null) {
  try {
    if (estado) localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage no disponible — el cronómetro sigue funcionando en memoria.
  }
}

function formatoDuracion(ms: number): string {
  const totalSeg = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeg / 3600);
  const m = Math.floor((totalSeg % 3600) / 60);
  const s = totalSeg % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

/**
 * Cronómetro para registrar tiempo en vivo. El tiempo transcurrido siempre
 * se calcula como Date.now() - startedAt (guardado en localStorage), nunca
 * acumulando segundo a segundo — así no se desincroniza ni pierde precisión
 * si cambias de pestaña, minimizas la ventana o el navegador frena el
 * temporizador en segundo plano: en cuanto vuelves, el tiempo mostrado ya
 * está correcto.
 */
export function CronometroTiempo({
  onFinalizar,
}: {
  onFinalizar: (datos: { categoria: string; proyecto: string; horas: number }) => void;
}) {
  // Se lee localStorage en el valor inicial (no en un efecto) para que, si
  // ya había un cronómetro corriendo, aparezca desde el primer render sin
  // parpadeo ni disparar un setState extra después de montar.
  const [estado, setEstado] = useState<EstadoCronometro | null>(() =>
    typeof window === "undefined" ? null : leerEstadoGuardado(),
  );
  const [categoria, setCategoria] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [ahora, setAhora] = useState(() => Date.now());

  useEffect(() => {
    if (!estado) return;
    const id = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(id);
  }, [estado]);

  const iniciar = () => {
    if (!categoria.trim()) return;
    const nuevo: EstadoCronometro = { startedAt: Date.now(), categoria: categoria.trim(), proyecto: proyecto.trim() };
    guardarEstado(nuevo);
    setAhora(Date.now());
    setEstado(nuevo);
  };

  const finalizar = () => {
    if (!estado) return;
    const ms = Date.now() - estado.startedAt;
    const horas = Math.max(0.01, Math.round((ms / 1000 / 60 / 60) * 100) / 100);
    guardarEstado(null);
    setEstado(null);
    setCategoria("");
    setProyecto("");
    onFinalizar({ categoria: estado.categoria, proyecto: estado.proyecto, horas });
  };

  const cancelar = () => {
    guardarEstado(null);
    setEstado(null);
  };

  if (estado) {
    return (
      <GlassCard className="flex flex-wrap items-center justify-between gap-4 border-accent/40 bg-accent/5 p-5">
        <div>
          <p className="flex items-center gap-2 text-xs text-accent">
            <span className="h-2 w-2 animate-pulse-glow rounded-full bg-accent" />
            Cronómetro corriendo
          </p>
          <p className="mt-1 text-sm text-white">
            {estado.categoria}
            {estado.proyecto ? ` · ${estado.proyecto}` : ""}
          </p>
          <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-white">
            {formatoDuracion(ahora - estado.startedAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={cancelar}
            className="text-text-secondary hover:text-white"
            title="Cancelar sin guardar"
          >
            <X size={18} />
          </button>
          <Button size="lg" onClick={finalizar}>
            <Square size={16} />
            Finalizar
          </Button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-5">
      <p className="mb-3 text-sm font-semibold text-white">Cronómetro</p>
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <Label htmlFor="cron-categoria">Tipo de trabajo *</Label>
          <Input
            id="cron-categoria"
            list="categorias-tiempo-cron"
            placeholder="Ej: Sitio web"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
          <datalist id="categorias-tiempo-cron">
            {CATEGORIAS_TIEMPO_SUGERIDAS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div>
          <Label htmlFor="cron-proyecto">Proyecto / cliente</Label>
          <Input
            id="cron-proyecto"
            placeholder="Ej: FashionLash"
            value={proyecto}
            onChange={(e) => setProyecto(e.target.value)}
          />
        </div>
        <Button size="lg" disabled={!categoria.trim()} onClick={iniciar}>
          <Play size={16} />
          Iniciar
        </Button>
      </div>
    </GlassCard>
  );
}
