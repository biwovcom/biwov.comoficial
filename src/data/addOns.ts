import type { PrecioDual } from "@/lib/moneda";

export interface AddOn {
  id: string;
  nombre: string;
  descripcion: string;
  incluye: string[];
  precio: PrecioDual;
}

export const GRABACION_EDICION: AddOn = {
  id: "grabacion-edicion",
  nombre: "Grabación y edición de contenido",
  descripcion:
    "Para cuando quieres contenido grabado y editado profesionalmente, sin tener que aprender a hacerlo tú misma.",
  incluye: [
    "Sesión de grabación en tu negocio o producto",
    "Edición profesional de los videos para redes",
    "Entrega lista para publicar, formato vertical y horizontal",
  ],
  precio: { cop: 2000000, usd: 500 },
};
