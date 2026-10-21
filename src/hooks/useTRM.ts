"use client";

import { useEffect, useState } from "react";
import { TRM_FALLBACK } from "@/lib/moneda";

/**
 * TRM del día para convertir COP -> USD en vivo. Arranca con el valor de
 * respaldo (se ve bien de inmediato) y se actualiza apenas responde /api/trm.
 */
export function useTRM() {
  const [trm, setTrm] = useState(TRM_FALLBACK);
  const [fecha, setFecha] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    fetch("/api/trm")
      .then((res) => res.json())
      .then((data: { trm?: number; fecha?: string | null }) => {
        if (!activo) return;
        if (typeof data.trm === "number" && Number.isFinite(data.trm)) {
          setTrm(data.trm);
          setFecha(data.fecha ?? null);
        }
      })
      .catch(() => {
        // Se queda con el valor de respaldo.
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  return { trm, fecha, cargando };
}
