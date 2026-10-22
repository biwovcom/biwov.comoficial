import { NIVELES_PRODUCCION, PRODUCCION_VIDEO } from "@/data/addOns";
import { COMPLEMENTOS } from "@/data/complementos";

export type CategoriaExtra = "Producción de contenido" | "Grabación y edición de video" | "Páginas web" | "Campaña en Meta";

export interface ExtraCotizable {
  id: string;
  nombre: string;
  categoria: CategoriaExtra;
  precioCop: number;
  periodicidad: "único" | "mensual";
}

const paginasWeb = COMPLEMENTOS.find((c) => c.titulo === "Páginas web y sitios web adicionales");
const campanaMeta = COMPLEMENTOS.find((c) => c.titulo === "Campaña publicitaria en Meta");

export const EXTRAS_COTIZABLES: ExtraCotizable[] = [
  ...NIVELES_PRODUCCION.map((nivel) => ({
    id: `produccion-${nivel.id}`,
    nombre: nivel.nombre,
    categoria: "Producción de contenido" as const,
    precioCop: nivel.precio.cop,
    periodicidad: "único" as const,
  })),
  ...PRODUCCION_VIDEO.paquetes.map((paquete) => ({
    id: `video-${paquete.id}`,
    nombre: `${paquete.cantidadVideos} videos${paquete.esMensual ? " al mes" : ""}`,
    categoria: "Grabación y edición de video" as const,
    precioCop: paquete.precio,
    periodicidad: (paquete.esMensual ? "mensual" : "único") as "único" | "mensual",
  })),
  ...(paginasWeb?.items ?? [])
    .filter((item) => item.precioCop !== undefined)
    .map((item) => ({
      id: `web-${item.label}`,
      nombre: item.label,
      categoria: "Páginas web" as const,
      precioCop: item.precioCop!,
      periodicidad: "único" as const,
    })),
  ...(campanaMeta?.items ?? [])
    .filter((item) => item.precioCop !== undefined)
    .map((item) => ({
      id: `meta-${item.label}`,
      nombre: "Gestión mensual",
      categoria: "Campaña en Meta" as const,
      precioCop: item.precioCop!,
      periodicidad: "mensual" as const,
    })),
];
