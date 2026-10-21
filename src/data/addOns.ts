import type { PrecioDual } from "@/lib/moneda";

export interface NivelProduccion {
  id: "start" | "professional" | "signature";
  nombre: string;
  precio: PrecioDual;
  camara: string;
  audio: string;
  iluminacion: string;
  estabilizacion: string;
  drone: string;
  direccionCreativa: string;
  tiempoProduccion: string;
  fotografias: number;
  reels: number;
  clipsBRoll: number;
}

export const PRODUCCION_CONTENIDO = {
  descripcion: "Producción integral de contenido para marcas.",
  idealPara:
    "Empresas que necesitan generar contenido profesional para varias semanas en una sola jornada.",
  incluye: [
    "Brief creativo y reunión de planeación",
    "Definición de objetivos y Shot List",
    "Construcción de guiones y copys",
    "Dirección creativa y de poses/talento",
    "Producción fotográfica y audiovisual",
    "Iluminación",
    "Edición profesional y corrección de color",
    "Optimización para redes y organización",
  ],
  noIncluye: ["La subida o publicación del contenido en tus redes sociales"],
};

export interface PaqueteProduccionVideo {
  id: string;
  cantidadVideos: number;
  precio: number; // COP
  esMensual?: boolean;
}

/**
 * Servicio aparte de los niveles Start/Professional/Signature: aquí solo se
 * va a grabar y editar, sin dirección creativa ni guiones. Se cotiza por
 * cantidad de videos, no por jornada de producción completa.
 */
export const PRODUCCION_VIDEO = {
  descripcion:
    "Grabación y edición de video, sin dirección creativa ni guiones — solo ir a grabar y editar.",
  minimoVideos: 3,
  reglaJornada: "Cada media jornada de grabación dura 4 horas y rinde hasta 3 videos.",
  notaPrecio: "Entre más videos, menor valor por video desde el cuarto.",
  paquetes: [
    { id: "3-videos", cantidadVideos: 3, precio: 360000 },
    { id: "6-videos", cantidadVideos: 6, precio: 696000 },
    { id: "12-videos-mes", cantidadVideos: 12, precio: 1344000, esMensual: true },
  ] satisfies PaqueteProduccionVideo[],
};

// Valores en USD son una referencia aproximada (tasa ~4.000 COP/USD).
export const NIVELES_PRODUCCION: NivelProduccion[] = [
  {
    id: "start",
    nombre: "Start",
    precio: { cop: 799000, usd: 200 },
    camara: "iPhone",
    audio: "Micrófono básico",
    iluminacion: "Luz natural / RGB portátil",
    estabilizacion: "Gimbal móvil",
    drone: "No incluido",
    direccionCreativa: "Básica",
    tiempoProduccion: "4 horas",
    fotografias: 15,
    reels: 3,
    clipsBRoll: 10,
  },
  {
    id: "professional",
    nombre: "Professional",
    precio: { cop: 1959000, usd: 490 },
    camara: "Sony + Lente",
    audio: "Hollyland",
    iluminacion: "Kit de iluminación",
    estabilizacion: "Hohem",
    drone: "Opcional",
    direccionCreativa: "Avanzada",
    tiempoProduccion: "8 horas",
    fotografias: 30,
    reels: 6,
    clipsBRoll: 20,
  },
  {
    id: "signature",
    nombre: "Signature",
    precio: { cop: 2999000, usd: 750 },
    camara: "Sony + Lente Cine",
    audio: "Hollyland + grabadora",
    iluminacion: "Iluminación completa",
    estabilizacion: "Hohem + accesorios",
    drone: "Incluido",
    direccionCreativa: "Completa",
    tiempoProduccion: "12 horas",
    fotografias: 50,
    reels: 10,
    clipsBRoll: 40,
  },
];
