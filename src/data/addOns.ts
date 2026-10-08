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
    "Dirección creativa y de poses/talento",
    "Producción fotográfica y audiovisual",
    "Iluminación",
    "Edición profesional y corrección de color",
    "Optimización para redes y organización",
  ],
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
