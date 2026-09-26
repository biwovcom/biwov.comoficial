import { RANGOS_PRESUPUESTO, type Moneda } from "./panelConfig";
import type { Semaforo } from "./prospectos";

export type Objetivo = "sin-resultados" | "no-calificados" | "sin-presencia" | "otro";
export type Importancia = "muy-importante" | "importante-no-urgente" | "poco-importante";
export type Meta = "mas-clientes" | "favorito-industria" | "proceso-automatizado" | "otro";
export type YaVende = "cada-mes" | "irregular" | "empezando";
export type ComoLlegan = "recomendados" | "redes" | "publicidad" | "local" | "casi-no-llegan";
export type Urgencia = "ya" | "1-3-meses" | "solo-averiguo";

export interface RespuestasFiltro {
  objetivo?: Objetivo;
  /** Solo aplica cuando objetivo === "otro". */
  objetivoOtro?: string;
  importancia?: Importancia;
  meta?: Meta;
  /** Solo aplica cuando meta === "otro". */
  metaOtro?: string;
  yaVende?: YaVende;
  comoLlegan?: ComoLlegan;
  presupuesto?: string; // id de RANGOS_PRESUPUESTO[moneda]
  urgencia?: Urgencia;
}

export const OPCIONES_OBJETIVO: { id: Objetivo; label: string }[] = [
  { id: "sin-resultados", label: "Ya hago contenido pero no tengo buenos resultados" },
  { id: "no-calificados", label: "Me llegan clientes por redes pero no están calificados" },
  { id: "sin-presencia", label: "Aún no tengo presencia digital" },
  { id: "otro", label: "Otra" },
];

export const OPCIONES_IMPORTANCIA: { id: Importancia; label: string }[] = [
  { id: "muy-importante", label: "Muy importante — es mi prioridad ahora" },
  { id: "importante-no-urgente", label: "Importante, pero no urgente" },
  { id: "poco-importante", label: "Poco importante por ahora" },
];

export const OPCIONES_META: { id: Meta; label: string }[] = [
  { id: "mas-clientes", label: "Recibir más clientes" },
  { id: "favorito-industria", label: "Ser el favorito en mi industria" },
  { id: "proceso-automatizado", label: "Tener un proceso automatizado" },
  { id: "otro", label: "Otro" },
];

export const OPCIONES_YA_VENDE: { id: YaVende; label: string }[] = [
  { id: "cada-mes", label: "Sí, cada mes" },
  { id: "irregular", label: "Poco o irregular" },
  { id: "empezando", label: "Estoy empezando" },
];

export const OPCIONES_COMO_LLEGAN: { id: ComoLlegan; label: string }[] = [
  { id: "recomendados", label: "Recomendados" },
  { id: "redes", label: "Redes" },
  { id: "publicidad", label: "Publicidad" },
  { id: "local", label: "Local físico" },
  { id: "casi-no-llegan", label: "Casi no llegan" },
];

export const OPCIONES_URGENCIA: { id: Urgencia; label: string }[] = [
  { id: "ya", label: "Ya, este mes" },
  { id: "1-3-meses", label: "En 1 a 3 meses" },
  { id: "solo-averiguo", label: "Solo averiguo" },
];

/** Fragmentos para encajar en "ahora mismo estás batallando con que no tienes ___". */
const FRASES_DESAFIO: Record<Objetivo, string> = {
  "sin-resultados": "buenos resultados con tu contenido",
  "no-calificados": "clientes calificados llegando por tus redes",
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

  return [
    {
      pregunta: "Desafíos actuales del negocio",
      respuesta:
        r.objetivo === "otro" && r.objetivoOtro
          ? `Otra: ${r.objetivoOtro}`
          : buscar(OPCIONES_OBJETIVO, r.objetivo),
    },
    {
      pregunta: "Deseo para su negocio (si un genio se lo concediera)",
      respuesta: r.meta === "otro" && r.metaOtro ? `Otro: ${r.metaOtro}` : buscar(OPCIONES_META, r.meta),
    },
    { pregunta: "Qué tan importante es para él vender más", respuesta: buscar(OPCIONES_IMPORTANCIA, r.importancia) },
    { pregunta: "¿Ya vende?", respuesta: buscar(OPCIONES_YA_VENDE, r.yaVende) },
    { pregunta: "¿Cómo le llegan los clientes?", respuesta: buscar(OPCIONES_COMO_LLEGAN, r.comoLlegan) },
    { pregunta: "¿Para cuándo quiere empezar?", respuesta: buscar(OPCIONES_URGENCIA, r.urgencia) },
    { pregunta: `Presupuesto para invertir ahora (${moneda})`, respuesta: rangoPresupuesto },
  ];
}

export function respuestasCompletas(r: RespuestasFiltro): boolean {
  return Boolean(
    r.objetivo && r.importancia && r.meta && r.yaVende && r.comoLlegan && r.presupuesto && r.urgencia,
  );
}

export interface ResultadoFiltro {
  semaforo: Semaforo;
  razon: string;
}

/**
 * Reglas de negocio definidas por Kathe:
 * 🟢 Caliente: ya vende (cada mes o irregular) + presupuesto suficiente + lo necesita ya o en 1-3 meses.
 * 🔴 No califica: presupuesto insuficiente + solo averigua, o está empezando sin presupuesto suficiente.
 * 🟡 Tibio: todo lo demás.
 */
export function calcularSemaforo(r: RespuestasFiltro, moneda: Moneda): ResultadoFiltro {
  const rango = RANGOS_PRESUPUESTO[moneda].find((x) => x.id === r.presupuesto);
  const presupuestoSuficiente = Boolean(rango?.calificaComoSuficiente);

  const yaVendeActivo = r.yaVende === "cada-mes" || r.yaVende === "irregular";
  const estaEmpezando = r.yaVende === "empezando";
  const esUrgente = r.urgencia === "ya" || r.urgencia === "1-3-meses";
  const soloAverigua = r.urgencia === "solo-averiguo";

  if (yaVendeActivo && presupuestoSuficiente && esUrgente) {
    return {
      semaforo: "verde",
      razon: "Ya vende, tiene presupuesto suficiente y lo necesita pronto.",
    };
  }

  if ((!presupuestoSuficiente && soloAverigua) || (estaEmpezando && !presupuestoSuficiente)) {
    return {
      semaforo: "rojo",
      razon: estaEmpezando
        ? "Está empezando y su presupuesto todavía no alcanza para el plan más económico."
        : "Su presupuesto no alcanza para el plan más económico y solo está averiguando, sin urgencia.",
    };
  }

  return {
    semaforo: "amarillo",
    razon: "No cumple todas las condiciones para 🟢, pero tampoco descalifica del todo.",
  };
}
