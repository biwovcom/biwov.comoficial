import { RANGOS_PRESUPUESTO, type Moneda } from "./panelConfig";
import type { Semaforo } from "./prospectos";
import type { Plan } from "@/data/planes";

export type Objetivo = "sin-resultados" | "no-calificados" | "sin-presencia" | "otro";
export type Meta = "mas-clientes" | "favorito-industria" | "proceso-automatizado" | "otro";
export type CumplimientoVentas = "cumple-constante" | "inestable" | "por-debajo";
export type CanalLlegada =
  | "redes-organicas"
  | "recomendaciones"
  | "publicidad-tradicional"
  | "ugc-influencers"
  | "pauta-paga"
  | "otro";
export type CuandoEmpezar = "inmediatamente" | "proximas-semanas" | "proximos-meses";

export interface RespuestasFiltro {
  objetivo?: Objetivo;
  /** Solo aplica cuando objetivo === "otro". */
  objetivoOtro?: string;
  meta?: Meta;
  /** Solo aplica cuando meta === "otro". */
  metaOtro?: string;
  cumplimientoVentas?: CumplimientoVentas;
  canalLlegada?: CanalLlegada[];
  /** Solo aplica cuando canalLlegada incluye "otro". */
  canalLlegadaOtro?: string;
  cuandoEmpezar?: CuandoEmpezar;
  presupuesto?: string; // id de RANGOS_PRESUPUESTO[moneda]
}

export const OPCIONES_OBJETIVO: { id: Objetivo; label: string }[] = [
  { id: "sin-resultados", label: "Ya hago contenido pero no tengo buenos resultados" },
  { id: "no-calificados", label: "Me llega gente pero no calificada" },
  { id: "sin-presencia", label: "Aún no tengo presencia digital" },
  { id: "otro", label: "Otra" },
];

export const OPCIONES_META: { id: Meta; label: string }[] = [
  { id: "mas-clientes", label: "Recibir más clientes" },
  { id: "favorito-industria", label: "Ser el favorito en mi industria" },
  { id: "proceso-automatizado", label: "Tener un proceso automatizado" },
  { id: "otro", label: "Otro" },
];

export const OPCIONES_CUMPLIMIENTO_VENTAS: { id: CumplimientoVentas; label: string }[] = [
  { id: "cumple-constante", label: "Sí, las alcanzamos o superamos constantemente" },
  { id: "inestable", label: "A veces sí, a veces no (estamos muy inestables)" },
  { id: "por-debajo", label: "No, la verdad estamos por debajo de lo que necesitamos vender" },
];

export const OPCIONES_CANAL_LLEGADA: { id: CanalLlegada; label: string }[] = [
  { id: "redes-organicas", label: "Redes sociales orgánicas (Instagram, TikTok, Facebook, etc.)" },
  { id: "recomendaciones", label: "Recomendaciones / Voz a voz" },
  { id: "publicidad-tradicional", label: "Publicidad tradicional (vallas, volantes, pendones, etc.)" },
  { id: "ugc-influencers", label: "Estrategia con Creadores de Contenido (UGC) o Influencers" },
  { id: "pauta-paga", label: "Campañas de pauta paga / Anuncios digitales" },
  { id: "otro", label: "Otro" },
];

export const OPCIONES_CUANDO_EMPEZAR: { id: CuandoEmpezar; label: string }[] = [
  { id: "inmediatamente", label: "Inmediatamente (estamos listos para arrancar ya)" },
  { id: "proximas-semanas", label: "En las próximas semanas" },
  { id: "proximos-meses", label: "En los próximos meses" },
];

/** Fragmentos para encajar en "ahora mismo estás batallando con que no tienes ___". */
const FRASES_DESAFIO: Record<Objetivo, string> = {
  "sin-resultados": "buenos resultados con tu contenido",
  "no-calificados": "gente calificada llegando por tus redes",
  "sin-presencia": "presencia digital",
  otro: "",
};

/** Fragmentos para encajar en "tu objetivo es ___". */
const FRASES_META: Record<Meta, string> = {
  "mas-clientes": "recibir más clientes",
  "favorito-industria": "ser el favorito en tu industria",
  "proceso-automatizado": "tener un proceso automatizado",
  otro: "",
};

/** Frase lista para el mensaje de WhatsApp/guion de audio. */
export function fraseDesafio(r: RespuestasFiltro): string {
  if (r.objetivo === "otro") return r.objetivoOtro?.trim() || "algunos desafíos en tu negocio";
  return r.objetivo ? FRASES_DESAFIO[r.objetivo] : "algunos desafíos en tu negocio";
}

/** Frase lista para el mensaje de WhatsApp/guion de audio. */
export function fraseMeta(r: RespuestasFiltro): string {
  if (r.meta === "otro") return r.metaOtro?.trim() || "hacer crecer tu negocio";
  return r.meta ? FRASES_META[r.meta] : "hacer crecer tu negocio";
}

export interface RespuestaLegible {
  pregunta: string;
  respuesta: string;
}

/** Traduce las respuestas guardadas (ids) a texto legible para mostrar en la ficha del prospecto. */
export function resumenRespuestasFiltro(r: RespuestasFiltro, moneda: Moneda): RespuestaLegible[] {
  const buscar = <T extends string>(opciones: { id: T; label: string }[], id: T | undefined) =>
    opciones.find((o) => o.id === id)?.label ?? "—";

  const rangoPresupuesto = RANGOS_PRESUPUESTO[moneda].find((x) => x.id === r.presupuesto)?.etiqueta ?? "—";

  const canales = (r.canalLlegada ?? []).map((c) =>
    c === "otro" && r.canalLlegadaOtro ? `Otro: ${r.canalLlegadaOtro}` : buscar(OPCIONES_CANAL_LLEGADA, c),
  );

  return [
    {
      pregunta: "Desafíos actuales de la empresa",
      respuesta:
        r.objetivo === "otro" && r.objetivoOtro
          ? `Otra: ${r.objetivoOtro}`
          : buscar(OPCIONES_OBJETIVO, r.objetivo),
    },
    {
      pregunta: "Deseo para su negocio (si un genio se lo concediera)",
      respuesta: r.meta === "otro" && r.metaOtro ? `Otro: ${r.metaOtro}` : buscar(OPCIONES_META, r.meta),
    },
    {
      pregunta: "¿Cumple sus metas mensuales de ventas?",
      respuesta: buscar(OPCIONES_CUMPLIMIENTO_VENTAS, r.cumplimientoVentas),
    },
    {
      pregunta: "¿Por dónde llegan sus clientes nuevos?",
      respuesta: canales.length > 0 ? canales.join(", ") : "—",
    },
    {
      pregunta: "¿Cuándo quiere empezar a implementar la estrategia?",
      respuesta: buscar(OPCIONES_CUANDO_EMPEZAR, r.cuandoEmpezar),
    },
    { pregunta: `Presupuesto mensual para invertir (${moneda})`, respuesta: rangoPresupuesto },
  ];
}

export function respuestasCompletas(r: RespuestasFiltro): boolean {
  return Boolean(
    r.objetivo &&
      r.meta &&
      r.cumplimientoVentas &&
      r.canalLlegada &&
      r.canalLlegada.length > 0 &&
      r.cuandoEmpezar &&
      r.presupuesto,
  );
}

export interface ResultadoFiltro {
  semaforo: Semaforo;
  razon: string;
}

/**
 * Reglas de negocio definidas por Kathe:
 * 🟢 Caliente: cumple sus metas de ventas (constante o inestable) + presupuesto suficiente + quiere empezar pronto.
 * 🔴 No califica: presupuesto insuficiente + solo está cotizando, o está muy por debajo de sus metas sin presupuesto suficiente.
 * 🟡 Tibio: todo lo demás.
 */
export function calcularSemaforo(r: RespuestasFiltro, moneda: Moneda): ResultadoFiltro {
  const rango = RANGOS_PRESUPUESTO[moneda].find((x) => x.id === r.presupuesto);
  const presupuestoSuficiente = Boolean(rango?.calificaComoSuficiente);

  const yaVendeActivo = r.cumplimientoVentas === "cumple-constante" || r.cumplimientoVentas === "inestable";
  const estaPorDebajo = r.cumplimientoVentas === "por-debajo";
  const esUrgente = r.cuandoEmpezar === "inmediatamente" || r.cuandoEmpezar === "proximas-semanas";
  const quiereEmpezarEnMeses = r.cuandoEmpezar === "proximos-meses";

  if (yaVendeActivo && presupuestoSuficiente && esUrgente) {
    return {
      semaforo: "verde",
      razon: "Cumple sus metas de ventas, tiene presupuesto suficiente y quiere empezar pronto.",
    };
  }

  if ((!presupuestoSuficiente && quiereEmpezarEnMeses) || (estaPorDebajo && !presupuestoSuficiente)) {
    return {
      semaforo: "rojo",
      razon: estaPorDebajo
        ? "Está muy por debajo de sus metas de ventas y su presupuesto todavía no alcanza para el plan más económico."
        : "Su presupuesto no alcanza para el plan más económico y quiere empezar hasta dentro de unos meses, sin urgencia.",
    };
  }

  return {
    semaforo: "amarillo",
    razon: "No cumple todas las condiciones para 🟢, pero tampoco descalifica del todo.",
  };
}

/**
 * Qué plan (Esencial/Crecimiento/Escala) le mostramos al visitante como
 * sugerencia al terminar el diagnóstico público. Es una sugerencia visible
 * para cualquiera, así que nunca se basa en el semáforo interno (eso es
 * solo para la lectura de Kathe) — se basa en qué tan avanzado está el
 * negocio, no en qué tan buen prospecto es.
 */
export function planSugerido(r: RespuestasFiltro): Plan["id"] {
  if (r.objetivo === "sin-presencia") return "esencial";
  if (r.cumplimientoVentas === "cumple-constante") return "escala";
  if (r.objetivo === "no-calificados" || r.meta === "proceso-automatizado") return "crecimiento";
  return "esencial";
}
