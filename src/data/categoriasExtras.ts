import { Camera, Video, Globe2, Megaphone, type LucideIcon } from "lucide-react";
import type { CategoriaExtra } from "./extrasCotizables";

export interface ArteCategoria {
  icono: LucideIcon;
  imagen: string;
}

export const ARTE_CATEGORIA: Record<CategoriaExtra, ArteCategoria> = {
  "Producción de contenido": {
    icono: Camera,
    imagen:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=600&q=70",
  },
  "Grabación y edición de video": {
    icono: Video,
    imagen:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=70",
  },
  "Páginas web": {
    icono: Globe2,
    imagen:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=70",
  },
  "Campaña en Meta": {
    icono: Megaphone,
    imagen:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=70",
  },
};
