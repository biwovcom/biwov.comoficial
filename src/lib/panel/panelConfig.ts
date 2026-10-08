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
    { id: "menos-1m", etiqueta: "Menos de $1.000.000", calificaComoSuficiente: false },
    { id: "1m-2m", etiqueta: "Entre $1.000.000 y $2.000.000", calificaComoSuficiente: true },
    { id: "2m-3m", etiqueta: "Entre $2.000.000 y $3.000.000", calificaComoSuficiente: true },
    { id: "4m-5m", etiqueta: "Entre $4.000.000 a $5.000.000", calificaComoSuficiente: true },
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
  calendario: "https://calendar.app.google/axxmw4mjpv5YBCqBA",
  comunidad: "",
  contenidoGratuito: "",
};

export interface ContextoMensaje {
  nombrePila: string;
  empresa?: string | null;
  tipoNegocio?: string | null;
  /** Lo que quiere lograr (frase del "genio"), ya en texto listo para leer. */
  fraseMeta?: string;
  /** El desafío/objetivo del filtro, ya en texto listo para leer. */
  fraseDesafio?: string;
}

function link(url: string, etiqueta: string): string {
  return url ? url : `[pendiente: ${etiqueta}]`;
}

/** "en tu negocio de belleza", "en Clínica Sonrisa", "en Clínica Sonrisa, tu negocio de belleza". */
function fraseNegocio({ empresa, tipoNegocio }: ContextoMensaje): string {
  if (empresa && tipoNegocio) return `en ${empresa}, tu negocio de ${tipoNegocio}`;
  if (empresa) return `en ${empresa}`;
  if (tipoNegocio) return `en tu negocio de ${tipoNegocio}`;
  return "";
}

export const MENSAJES_WHATSAPP = {
  verde: (ctx: ContextoMensaje) => {
    const negocio = fraseNegocio(ctx);
    const meta = ctx.fraseMeta || "hacer crecer tu negocio";
    const desafio = ctx.fraseDesafio || "algunos desafíos en tu negocio";
    return (
      `Hola ${ctx.nombrePila}, ¿cómo vas? 🙌\n\n` +
      `Va a ser un placer ayudarte a generar más ventas${negocio ? ` ${negocio}` : ""}.\n\n` +
      `Vi en tus respuestas que tu objetivo es ${meta}, y que ahora mismo estás batallando con que no tienes ${desafio}.\n\n` +
      `Si te parece bien, agenda aquí el espacio que mejor te quede y nos reunimos para conocernos, que me cuentes un poco más de tu negocio y te dé algunas recomendaciones de lo que creo que te podría sumar: ${link(LINKS_PANEL.calendario, "link para agendar")}`
    );
  },
  amarillo: ({ nombrePila }: ContextoMensaje) =>
    `¡Hola ${nombrePila}! Gracias por escribirnos 🙌\n\n` +
    `Por ahora te invito a unirte a nuestra comunidad gratuita "Escala tu negocio", ahí encontrarás contenido que te va a servir mientras terminas de definir tu proyecto: ${link(LINKS_PANEL.comunidad, "link de la comunidad")}\n\n` +
    `Cuando estés listo para dar el siguiente paso, escríbeme "LISTO" y seguimos. 🚀`,
  rojo: ({ nombrePila }: ContextoMensaje) =>
    `¡Hola ${nombrePila}! Gracias por tu interés en biwov 🙌\n\n` +
    `Siendo honesta, por ahora nuestros servicios probablemente no son lo que más te conviene. Te dejo este contenido gratuito que te puede ayudar en esta etapa: ${link(LINKS_PANEL.contenidoGratuito, "link de contenido gratuito")}\n\n` +
    `¡Éxitos con tu negocio!`,
} as const;

/**
 * Guion para que Kathe lo lea en voz alta al grabar la nota de audio que
 * acompaña el mensaje de WhatsApp de los prospectos 🟢. WhatsApp no permite
 * adjuntar un audio automáticamente desde un link — esto es lo que se dice,
 * no un archivo que se envíe solo.
 */
export function guionAudioVerde(ctx: ContextoMensaje): string {
  const negocio = fraseNegocio(ctx);
  const meta = ctx.fraseMeta || "hacer crecer tu negocio";
  const desafio = ctx.fraseDesafio || "algunos desafíos en tu negocio";
  return (
    `Hola ${ctx.nombrePila}, ¿cómo estás? Te habla Kathe, de biwov.\n\n` +
    `Va a ser un placer ayudarte a generar más ventas${negocio ? ` ${negocio}` : ""}.\n\n` +
    `Por lo que me contaste, tu objetivo es ${meta}, y ahora mismo sientes que te está haciendo falta ${desafio}.\n\n` +
    `Si te parece bien, me encantaría que nos reunamos hoy en la tarde o mañana temprano para conocer un poco más de tu negocio y darte algunas recomendaciones concretas de lo que creo que te podría sumar. Ahí mismo te cuento cómo podríamos trabajar juntos.\n\n` +
    `¿Qué se te facilita más: hoy en la tarde o mañana temprano?`
  );
}
