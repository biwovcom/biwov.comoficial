import { NIVELES_PRODUCCION, PRODUCCION_VIDEO } from "@/data/addOns";
import { COMPLEMENTOS } from "@/data/complementos";

export interface ExtraCotizable {
  id: string;
  nombre: string;
  precioCop: number;
  periodicidad: "único" | "mensual";
}

const paginasWeb = COMPLEMENTOS.find((c) => c.titulo === "Páginas web y sitios web adicionales");
const campanaMeta = COMPLEMENTOS.find((c) => c.titulo === "Campaña publicitaria en Meta");

export const EXTRAS_COTIZABLES: ExtraCotizable[] = [
  ...NIVELES_PRODUCCION.map((nivel) => ({
    id: `produccion-${nivel.id}`,
    nombre: `Producción de contenido ${nivel.nombre}`,
    precioCop: nivel.precio.cop,
    periodicidad: "único" as const,
  })),
  ...PRODUCCION_VIDEO.paquetes.map((paquete) => ({
    id: `video-${paquete.id}`,
    nombre: `Grabación y edición: ${paquete.cantidadVideos} videos${paquete.esMensual ? " al mes" : ""}`,
    precioCop: paquete.precio,
    periodicidad: (paquete.esMensual ? "mensual" : "único") as "único" | "mensual",
  })),
  ...(paginasWeb?.items ?? [])
    .filter((item) => item.precioCop !== undefined)
    .map((item) => ({
      id: `web-${item.label}`,
      nombre: item.label,
      precioCop: item.precioCop!,
      periodicidad: "único" as const,
    })),
  ...(campanaMeta?.items ?? [])
    .filter((item) => item.precioCop !== undefined)
    .map((item) => ({
      id: `meta-${item.label}`,
      nombre: "Campaña en Meta: gestión mensual",
      precioCop: item.precioCop!,
      periodicidad: "mensual" as const,
    })),
];
