import { Camera, Video, Globe2, Megaphone, type LucideIcon } from "lucide-react";
import type { CategoriaExtra } from "./extrasCotizables";

export interface ArteCategoria {
  icono: LucideIcon;
  gradiente: string;
}

export const ARTE_CATEGORIA: Record<CategoriaExtra, ArteCategoria> = {
  "Producción de contenido": { icono: Camera, gradiente: "from-[#1d4772] to-[#3d98cc]" },
  "Grabación y edición de video": { icono: Video, gradiente: "from-[#3d2a72] to-[#8134af]" },
  "Páginas web": { icono: Globe2, gradiente: "from-[#0d6e4f] to-[#1fae7d]" },
  "Campaña en Meta": { icono: Megaphone, gradiente: "from-[#7a1d4a] to-[#c23b74]" },
};
