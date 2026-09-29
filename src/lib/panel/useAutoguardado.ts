"use client";

import { useEffect, useRef, useState } from "react";

export type EstadoGuardado = "idle" | "guardando" | "guardado" | "error";
type Accion = () => PromiseLike<{ error: { message: string } | null }>;

/**
 * Guardado automático del cotizador: `ejecutar` escribe ya, `guardarLuego`
 * espera a que el usuario deje de teclear (una escritura por clave).
 */
export function useAutoguardado() {
  const [estado, setEstado] = useState<EstadoGuardado>("idle");
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const temporizadores = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const pendientes = useRef(0);

  useEffect(() => {
    const mapa = temporizadores.current;
    return () => mapa.forEach((t) => clearTimeout(t));
  }, []);

  async function ejecutar(accion: Accion) {
    pendientes.current += 1;
    setEstado("guardando");
    const { error } = await accion();
    pendientes.current -= 1;
    if (error) {
      setEstado("error");
      setMensajeError(error.message);
    } else if (pendientes.current === 0) {
      setEstado("guardado");
      setMensajeError(null);
    }
  }

  function guardarLuego(clave: string, accion: Accion) {
    const previo = temporizadores.current.get(clave);
    if (previo) clearTimeout(previo);
    setEstado("guardando");
    temporizadores.current.set(
      clave,
      setTimeout(() => {
        temporizadores.current.delete(clave);
        void ejecutar(accion);
      }, 600),
    );
  }

  function fallo(mensaje: string) {
    setEstado("error");
    setMensajeError(mensaje);
  }

  return { estado, mensajeError, setEstado, ejecutar, guardarLuego, fallo };
}
