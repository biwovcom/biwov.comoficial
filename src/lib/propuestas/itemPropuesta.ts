import type { ExtraCotizable } from "@/data/extrasCotizables";
import type { ItemPropuesta } from "@/components/propuestas/PropuestaImprimible";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";

export function extraAItemPropuesta(extra: ExtraCotizable, moneda: Moneda, trm: number): ItemPropuesta {
  return {
    nombre: extra.nombre,
    descripcion: extra.descripcion,
    incluye: extra.incluye,
    noIncluye: extra.noIncluye,
    precio: formatCopEnMoneda(extra.precioCop, moneda, trm),
    periodicidad: extra.periodicidad,
  };
}
