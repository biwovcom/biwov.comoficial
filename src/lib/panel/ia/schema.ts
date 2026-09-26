import { z } from "zod";

export type PaqueteId =
  | "ruta-clara"
  | "presencia-que-vende"
  | "motor-de-clientes"
  | "ventas-en-automatico"
  | "ecosistema-completo";

export const PAQUETES_INFO: Record<PaqueteId, { nombre: string; descripcion: string }> = {
  "ruta-clara": {
    nombre: "Ruta Clara",
    descripcion: "Asesoría de alineamiento y guía: diagnóstico, plan y acompañamiento.",
  },
  "presencia-que-vende": {
    nombre: "Presencia que Vende",
    descripcion: "Estrategia, guiones, copies, publicación y manejo de redes.",
  },
  "motor-de-clientes": {
    nombre: "Motor de Clientes",
    descripcion: "Campañas + landing page con objetivo definido + píxel.",
  },
  "ventas-en-automatico": {
    nombre: "Ventas en Automático",
    descripcion: "Chatbot + CRM + email marketing + seguimiento de leads.",
  },
  "ecosistema-completo": {
    nombre: "Ecosistema Completo",
    descripcion: "Combinación de Presencia que Vende, Motor de Clientes y Ventas en Automático.",
  },
};

const Puntaje = z.object({
  puntaje: z.number().min(1).max(10),
  justificacion: z.string(),
});

export const AnalisisIASchema = z.object({
  etapaNegocio: z.enum(["empezando", "vende-irregular", "vende-estable-escalar"]),
  etapaNegocioExplicacion: z.string(),

  diagnostico: z.object({
    queTiene: z.array(z.string()),
    queLeFalta: z.array(z.string()),
    porQueNoHaCrecido: z.string(),
  }),

  pideVsNecesita: z.object({
    pide: z.string(),
    necesita: z.string(),
  }),

  evaluacionMercado: z.object({
    dolor: Puntaje,
    capacidadDePago: Puntaje,
    facilidadParaEncontrarlo: Puntaje,
    crecimiento: Puntaje,
  }),

  cuelloDeBotella: z.object({
    tipo: z.enum(["captacion", "conversion", "oferta", "operacion"]),
    explicacion: z.string(),
  }),

  fugasDeLeads: z.array(
    z.object({
      fuga: z.string(),
      estimadoPerdidoMensual: z.number().nullable(),
      explicacion: z.string(),
    }),
  ),

  paqueteRecomendado: z.object({
    paquete: z.enum([
      "ruta-clara",
      "presencia-que-vende",
      "motor-de-clientes",
      "ventas-en-automatico",
      "ecosistema-completo",
    ]),
    justificacion: z.string(),
  }),

  noRecomendarPorAhora: z.array(z.string()),

  iconosEcosistemaActivos: z.array(z.string()).max(8),

  ideasContenido: z.array(z.string()).length(5),
});

export type AnalisisIA = z.infer<typeof AnalisisIASchema>;
