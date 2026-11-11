import type { PrecioDual } from "@/lib/moneda";

export interface NivelProduccion {
  id: "start" | "professional" | "signature";
  nombre: string;
  precio: PrecioDual;
  idealPara: string;
  /** Equipo y nivel de producción. */
  equipo: string;
  direccionCreativa: string;
  guiones: string;
  tiempoProduccion: string;
  /** Duración máxima de cada video, en segundos. */
  duracionReel: number;
  reels: number;
  fotografias: number;
  clipsBRoll: number;
}

/**
 * Producción audiovisual dirigida por biwov: la grabación la hace un productor
 * aliado y biwov dirige, coordina y responde por la calidad del resultado.
 */
export const PRODUCCION_CONTENIDO = {
  descripcion:
    "Producción audiovisual dirigida por biwov: planeamos, dirigimos y respondemos por el resultado; la grabación la hace nuestro equipo de productores aliados.",
  incluye: [
    "Brief creativo y reunión de planeación",
    "Shot list (lista de tomas) y guiones",
    "Dirección creativa en la grabación",
    "Grabación presencial y fotografía",
    "Edición profesional y corrección de color",
    "Entrega organizada y optimizada para redes",
    "1 ronda de ajustes sobre el material entregado",
  ],
  noIncluye: [
    "La publicación del contenido en tus redes sociales",
    "Desplazamientos fuera de Manizales (se cotizan aparte)",
    "Locaciones, modelos, vestuario o utilería que se alquilen",
  ],
};

// Valores en USD son una referencia aproximada (tasa ~4.000 COP/USD).
export const NIVELES_PRODUCCION: NivelProduccion[] = [
  {
    id: "start",
    nombre: "Start",
    precio: { cop: 1890000, usd: 475 },
    idealPara: "Para marcas que necesitan videos constantes para sus redes.",
    equipo: "Audio e iluminación según la producción contratada",
    direccionCreativa: "Básica",
    guiones: "Planificación de contenidos y guiones",
    tiempoProduccion: "Hasta 4 horas",
    duracionReel: 60,
    reels: 6,
    fotografias: 0,
    clipsBRoll: 0,
  },
  {
    id: "professional",
    nombre: "Professional",
    precio: { cop: 2490000, usd: 625 },
    idealPara: "Para marcas que necesitan videos y fotos profesionales para varias semanas.",
    equipo: "Producción audiovisual profesional",
    direccionCreativa: "Avanzada",
    guiones: "Guiones y planificación",
    tiempoProduccion: "Hasta 6 horas",
    duracionReel: 60,
    reels: 8,
    fotografias: 15,
    clipsBRoll: 10,
  },
  {
    id: "signature",
    nombre: "Signature",
    precio: { cop: 3490000, usd: 875 },
    idealPara: "Para empresas que necesitan una producción de alto nivel y un banco amplio de contenido.",
    equipo: "Producción audiovisual avanzada",
    direccionCreativa: "Completa",
    guiones: "Conceptualización de contenidos y guiones",
    tiempoProduccion: "Hasta 8 horas",
    duracionReel: 60,
    reels: 12,
    fotografias: 30,
    clipsBRoll: 20,
  },
];
