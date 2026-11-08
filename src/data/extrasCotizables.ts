import { NIVELES_PRODUCCION, PRODUCCION_CONTENIDO, PRODUCCION_VIDEO, PRODUCCION_UGC } from "@/data/addOns";
import { formatCopEnMoneda } from "@/lib/moneda";
import { COMPLEMENTOS } from "@/data/complementos";
import type { TipoContrato } from "@/lib/contrato";

export type CategoriaExtra = "Producción de contenido" | "Grabación y edición de video" | "Páginas web" | "Campaña en Meta";

export interface ExtraCotizable {
  id: string;
  nombre: string;
  categoria: CategoriaExtra;
  tipoContrato: TipoContrato;
  precioCop: number;
  periodicidad: "único" | "mensual";
  descripcion?: string;
  incluye?: string[];
  noIncluye?: string[];
}

const TIPO_CONTRATO_POR_CATEGORIA: Record<CategoriaExtra, TipoContrato> = {
  "Producción de contenido": "produccion",
  "Grabación y edición de video": "produccion",
  "Páginas web": "sitio-web",
  "Campaña en Meta": "campana-meta",
};

const paginasWeb = COMPLEMENTOS.find((c) => c.titulo === "Páginas web y sitios web adicionales");
const campanaMeta = COMPLEMENTOS.find((c) => c.titulo === "Campaña publicitaria en Meta");

export const EXTRAS_COTIZABLES: ExtraCotizable[] = [
  ...NIVELES_PRODUCCION.map((nivel) => ({
    id: `produccion-${nivel.id}`,
    nombre: nivel.nombre,
    categoria: "Producción de contenido" as const,
    tipoContrato: TIPO_CONTRATO_POR_CATEGORIA["Producción de contenido"],
    precioCop: nivel.precio.cop,
    periodicidad: "único" as const,
    descripcion: `Jornada de producción de ${nivel.tiempoProduccion}, dirección creativa ${nivel.direccionCreativa.toLowerCase()}.`,
    incluye: [
      `${nivel.fotografias} fotografías profesionales editadas`,
      `${nivel.reels} reels (videos verticales) editados y listos para publicar`,
      `${nivel.clipsBRoll} clips de B-Roll (videos de apoyo, no la toma principal)`,
      `Tiempo de producción: ${nivel.tiempoProduccion}`,
      `Dirección creativa ${nivel.direccionCreativa.toLowerCase()}`,
      `Cámara: ${nivel.camara}`,
      `Audio: ${nivel.audio}`,
      `Iluminación: ${nivel.iluminacion}`,
      `Estabilización: ${nivel.estabilizacion}`,
      `Drone: ${nivel.drone}`,
      ...PRODUCCION_CONTENIDO.incluye,
    ],
    noIncluye: ["La subida o publicación del contenido en tus redes sociales"],
  })),
  ...PRODUCCION_VIDEO.paquetes.map((paquete) => ({
    id: `video-${paquete.id}`,
    nombre: paquete.nombre ?? `${paquete.cantidadVideos} videos${paquete.esMensual ? " al mes" : ""}`,
    categoria: "Grabación y edición de video" as const,
    tipoContrato: TIPO_CONTRATO_POR_CATEGORIA["Grabación y edición de video"],
    precioCop: paquete.precio,
    periodicidad: (paquete.esMensual ? "mensual" : "único") as "único" | "mensual",
    descripcion: PRODUCCION_VIDEO.descripcion,
    incluye: [
      `${paquete.cantidadVideos} videos terminados${paquete.esMensual ? " cada mes" : ""}`,
      `${Math.ceil(paquete.cantidadVideos / 3)} jornada${Math.ceil(paquete.cantidadVideos / 3) === 1 ? "" : "s"} de grabación de 4 horas${paquete.esMensual ? " al mes" : ""}`,
      ...PRODUCCION_VIDEO.incluye,
      `Equivale a ${formatCopEnMoneda(Math.round(paquete.precio / paquete.cantidadVideos), "COP", 1)} por video`,
    ],
    noIncluye: [
      "Guiones, copys y dirección creativa (están en los paquetes de Producción de contenido)",
      "La subida o publicación del contenido en tus redes sociales",
    ],
  })),
  ...PRODUCCION_UGC.paquetes.map((paquete) => ({
    id: `video-${paquete.id}`,
    nombre: paquete.nombre ?? `${paquete.cantidadVideos} videos UGC`,
    categoria: "Grabación y edición de video" as const,
    tipoContrato: TIPO_CONTRATO_POR_CATEGORIA["Grabación y edición de video"],
    precioCop: paquete.precio,
    periodicidad: (paquete.esMensual ? "mensual" : "único") as "único" | "mensual",
    descripcion: PRODUCCION_UGC.descripcion,
    incluye: [
      `${paquete.cantidadVideos} video${paquete.cantidadVideos === 1 ? "" : "s"} estilo UGC terminado${paquete.cantidadVideos === 1 ? "" : "s"}`,
      ...PRODUCCION_UGC.incluye,
      `Equivale a ${formatCopEnMoneda(Math.round(paquete.precio / paquete.cantidadVideos), "COP", 1)} por video`,
    ],
    noIncluye: ["La subida o publicación del contenido en tus redes sociales"],
  })),
  ...(paginasWeb?.items ?? [])
    .filter((item) => item.precioCop !== undefined)
    .map((item) => ({
      id: `web-${item.label}`,
      nombre: item.label,
      categoria: "Páginas web" as const,
      tipoContrato: TIPO_CONTRATO_POR_CATEGORIA["Páginas web"],
      precioCop: item.precioCop!,
      periodicidad: "único" as const,
      descripcion: paginasWeb?.detalle,
      incluye: item.label.includes("API")
        ? ["Integración técnica para pasar los leads de la página a la campaña"]
        : ["Hosting y dominio incluidos el primer año"],
    })),
  ...(campanaMeta?.items ?? [])
    .filter((item) => item.precioCop !== undefined)
    .map((item) => ({
      id: `meta-${item.label}`,
      nombre: "Gestión mensual",
      categoria: "Campaña en Meta" as const,
      tipoContrato: TIPO_CONTRATO_POR_CATEGORIA["Campaña en Meta"],
      precioCop: item.precioCop!,
      periodicidad: "mensual" as const,
      descripcion: campanaMeta?.detalle,
      incluye: [
        "Montaje de campaña, seguimiento, optimización y análisis",
        "Informe mensual de resultados",
        "Requisito: mínimo 6 piezas creativas para arrancar",
        "Permanencia mínima: 3 meses",
      ],
      noIncluye: ["La inversión en pauta publicitaria (se paga directo a Meta)"],
    })),
];
