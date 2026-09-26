export type Moneda = "COP" | "USD";

export interface RangoPresupuestoPanel {
  id: string;
  etiqueta: string;
  /** true = este rango alcanza para el plan más económico (START). */
  calificaComoSuficiente: boolean;
}

/**
 * ⚠️ Pendiente de ajustar cuando definas los precios reales de tus planes:
 * marca calificaComoSuficiente en los rangos que sí alcanzan para tu plan
 * START. No hay conversión entre COP y USD, son dos escalas independientes.
 */
export const RANGOS_PRESUPUESTO: Record<Moneda, RangoPresupuestoPanel[]> = {
  COP: [
    { id: "menos-1m", etiqueta: "Menos de $1.000.000/mes", calificaComoSuficiente: false },
    { id: "1m-3m", etiqueta: "Entre $1.000.000 y $3.000.000/mes", calificaComoSuficiente: true },
    { id: "3m-5m", etiqueta: "Entre $3.000.000 y $5.000.000/mes", calificaComoSuficiente: true },
    { id: "mas-5m", etiqueta: "Más de $5.000.000/mes", calificaComoSuficiente: true },
  ],
  USD: [
    { id: "menos-300", etiqueta: "Menos de $300/mes", calificaComoSuficiente: false },
    { id: "300-800", etiqueta: "Entre $300 y $800/mes", calificaComoSuficiente: true },
    { id: "800-1500", etiqueta: "Entre $800 y $1.500/mes", calificaComoSuficiente: true },
    { id: "mas-1500", etiqueta: "Más de $1.500/mes", calificaComoSuficiente: true },
  ],
};

/** ⚠️ Pendiente: pega aquí tus links reales. */
export const LINKS_PANEL = {
  formulario: "",
  calendario: "",
  comunidad: "",
  contenidoGratuito: "",
};

interface ContextoMensaje {
  nombrePila: string;
}

function link(url: string, etiqueta: string): string {
  return url ? url : `[pendiente: ${etiqueta}]`;
}

export const MENSAJES_WHATSAPP = {
  verde: ({ nombrePila }: ContextoMensaje) =>
    `¡Hola ${nombrePila}! Gracias por tu interés en biwov 🙌\n\n` +
    `Antes de recomendarte algo, necesito conocer bien tu negocio — por ejemplo, una página web sola no vende: necesita tráfico y un objetivo claro detrás. Por eso hacemos un diagnóstico rápido primero.\n\n` +
    `Completa este formulario: ${link(LINKS_PANEL.formulario, "link del formulario")}\n` +
    `Y agenda aquí tu llamada de diagnóstico: ${link(LINKS_PANEL.calendario, "link del calendario")}\n\n` +
    `¡Nos vemos pronto!`,
  amarillo: ({ nombrePila }: ContextoMensaje) =>
    `¡Hola ${nombrePila}! Gracias por escribirnos 🙌\n\n` +
    `Por ahora te invito a unirte a nuestra comunidad gratuita "Escala tu negocio", ahí encontrarás contenido que te va a servir mientras terminas de definir tu proyecto: ${link(LINKS_PANEL.comunidad, "link de la comunidad")}\n\n` +
    `Cuando estés listo para dar el siguiente paso, escríbeme "LISTO" y seguimos. 🚀`,
  rojo: ({ nombrePila }: ContextoMensaje) =>
    `¡Hola ${nombrePila}! Gracias por tu interés en biwov 🙌\n\n` +
    `Siendo honesta, por ahora nuestros servicios probablemente no son lo que más te conviene. Te dejo este contenido gratuito que te puede ayudar en esta etapa: ${link(LINKS_PANEL.contenidoGratuito, "link de contenido gratuito")}\n\n` +
    `¡Éxitos con tu negocio!`,
} as const;
