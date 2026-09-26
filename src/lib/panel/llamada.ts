import type { BloqueDiagnostico } from "./diagnosticoLargo";

/**
 * Las 10 preguntas que más revelan el cuello de botella, para usar EN VIVO
 * durante la llamada de 45 minutos — no reemplazan el diagnóstico profundo
 * (ese se usa después, en el onboarding, cuando el cliente ya pagó).
 */
export const PREGUNTAS_CLAVE_LLAMADA: BloqueDiagnostico[] = [
  { id: "p1", titulo: "¿Cómo empezó tu negocio y qué vendes?", preguntasGuia: [] },
  { id: "p2", titulo: "¿Cuánto es tu ticket promedio y qué producto te deja más?", preguntasGuia: [] },
  { id: "p3", titulo: "¿Por dónde te llegan hoy los clientes?", preguntasGuia: [] },
  { id: "p4", titulo: "¿Cuántas personas te escriben al mes y cuántas te compran?", preguntasGuia: [] },
  {
    id: "p5",
    titulo: "¿Quién responde los mensajes y en cuánto tiempo? ¿Haces seguimiento?",
    preguntasGuia: [],
  },
  { id: "p6", titulo: "¿Qué pasa con tus clientes después de que compran?", preguntasGuia: [] },
  { id: "p7", titulo: "¿Qué tareas dependen solo de ti?", preguntasGuia: [] },
  { id: "p8", titulo: "¿Qué has intentado antes y qué resultado tuvo?", preguntasGuia: [] },
  {
    id: "p9",
    titulo: "Si tuvieras una lámpara mágica, ¿cómo verías tu negocio en 6 meses?",
    preguntasGuia: [],
  },
  { id: "p10", titulo: "¿Qué pasa si todo sigue igual un año más?", preguntasGuia: [] },
];

export interface FaseLlamada {
  minutos: number;
  titulo: string;
  descripcion: string;
}

export const GUION_LLAMADA: FaseLlamada[] = [
  { minutos: 5, titulo: "Conexión", descripcion: "Saludo de amigo — que te cuente su historia." },
  { minutos: 15, titulo: "Diagnóstico", descripcion: "Escuchas y analizas con tu conocimiento (usa las 10 preguntas)." },
  {
    minutos: 10,
    titulo: "Tu lectura",
    descripcion: "Lo que tiene, lo que le falta, el porqué, y tus sugerencias.",
  },
  {
    minutos: 10,
    titulo: "El programa",
    descripcion:
      '"Nuestro programa incluye esto, esto y esto, y te ayudaría a esto, esto y esto."',
  },
  {
    minutos: 5,
    titulo: "Cierre",
    descripcion:
      'Rango de inversión en voz alta y la pregunta: "¿Sientes que esto te puede dar resultado?"',
  },
];

export type RespuestasLlamada = Record<string, string>;
