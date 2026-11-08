"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, CheckCheck, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Mensaje {
  de: "cliente" | "bot";
  texto: string;
}

/** Conversación de ejemplo con un negocio ficticio (no es un cliente real). */
const CONVERSACION: Mensaje[] = [
  { de: "cliente", texto: "Hola 👋 ¿tienen cupos para el curso de pestañas?" },
  { de: "bot", texto: "¡Hola! Sí, quedan 4 cupos este mes. ¿Es tu primera vez o ya tienes experiencia?" },
  { de: "cliente", texto: "Es mi primera vez" },
  { de: "bot", texto: "Perfecto 🙌 El nivel básico es ideal: incluye kit de materiales y certificado. ¿Te comparto precio y fechas?" },
  { de: "cliente", texto: "Sí, por favor" },
  { de: "bot", texto: "Listo ✅ Te paso con una asesora para reservar tu cupo." },
];

const PAUSA_ESCRIBIENDO = 1100;
const PAUSA_MENSAJE = 1300;
const PAUSA_FINAL = 3200;

/**
 * Simula, como si fuera un video, una conversación de WhatsApp atendida por
 * un asistente con IA: los mensajes aparecen uno a uno y se repite en bucle.
 */
export function ChatSimulacion({ activo = true }: { activo?: boolean }) {
  const [visibles, setVisibles] = useState(0);
  const [escribiendo, setEscribiendo] = useState(false);
  const terminado = visibles >= CONVERSACION.length;

  useEffect(() => {
    if (!activo) return;
    let t: number;
    if (terminado) {
      t = window.setTimeout(() => setVisibles(0), PAUSA_FINAL);
    } else if (CONVERSACION[visibles].de === "bot" && !escribiendo) {
      t = window.setTimeout(() => setEscribiendo(true), 300);
    } else if (escribiendo) {
      t = window.setTimeout(() => {
        setEscribiendo(false);
        setVisibles((v) => v + 1);
      }, PAUSA_ESCRIBIENDO);
    } else {
      t = window.setTimeout(() => setVisibles((v) => v + 1), visibles === 0 ? 500 : PAUSA_MENSAJE);
    }
    return () => window.clearTimeout(t);
  }, [activo, visibles, escribiendo, terminado]);

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0b141a]">
      {/* Barra superior estilo WhatsApp */}
      <div className="flex items-center gap-3 bg-[#1f2c34] px-4 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
          <Bot className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">Estudio Aurora</p>
          <p className="text-xs text-[#8696a0]">{escribiendo ? "escribiendo…" : "Asistente con IA · en línea"}</p>
        </div>
        <span className="ml-auto rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60">
          Simulación
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-end gap-2 overflow-hidden bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:14px_14px] px-3 py-4 md:px-5">
        <AnimatePresence initial={false}>
          {CONVERSACION.slice(0, visibles).map((m, i) => (
            <motion.div
              key={`${i}-${m.texto}`}
              layout
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "max-w-[82%] rounded-xl px-3 py-2 text-[13px] leading-snug shadow-sm md:text-sm",
                m.de === "cliente"
                  ? "self-end rounded-tr-sm bg-[#005c4b] text-white"
                  : "self-start rounded-tl-sm bg-[#1f2c34] text-[#e9edef]",
              )}
            >
              {m.texto}
              {m.de === "cliente" && <CheckCheck className="ml-1 inline h-3.5 w-3.5 text-[#53bdeb]" />}
            </motion.div>
          ))}

          {escribiendo && (
            <motion.div
              key="escribiendo"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-1 self-start rounded-xl rounded-tl-sm bg-[#1f2c34] px-3 py-3"
            >
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8696a0]"
                  style={{ animationDelay: `${d * 150}ms` }}
                />
              ))}
            </motion.div>
          )}

          {terminado && (
            <motion.div
              key="calificado"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-1 flex items-center gap-2 self-center rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-[#03101b]"
            >
              <UserCheck className="h-4 w-4" />
              Interesado calificado → enviado al CRM
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
