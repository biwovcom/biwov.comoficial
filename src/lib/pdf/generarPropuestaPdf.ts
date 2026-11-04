import { renderToBuffer } from "@react-pdf/renderer";
import { PropuestaPdfDocument } from "./PropuestaPdfDocument";
import type { PropuestaImprimibleProps } from "@/components/propuestas/PropuestaImprimible";

export async function generarPropuestaPdfBuffer(datos: PropuestaImprimibleProps): Promise<Buffer> {
  return renderToBuffer(PropuestaPdfDocument(datos));
}
