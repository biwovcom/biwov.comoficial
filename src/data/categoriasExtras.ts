import { Camera, Video, Globe2, Megaphone, Bot, Mail, Send, Workflow, type LucideIcon } from "lucide-react";
import type { CategoriaExtra } from "./extrasCotizables";

export interface ArteCategoria {
  icono: LucideIcon;
  imagen: string;
}

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=70`;

export const ARTE_CATEGORIA: Record<CategoriaExtra, ArteCategoria> = {
  "Producción audiovisual": { icono: Camera, imagen: img("photo-1452587925148-ce544e77e70d") },
  "Edición y guía de grabación": { icono: Video, imagen: img("photo-1574717024653-61fd2cf4d44d") },
  "Campañas en Meta": { icono: Megaphone, imagen: img("photo-1522071820081-009f0129c71c") },
  "WhatsApp y agentes de IA": { icono: Bot, imagen: img("photo-1611746872915-64382b5c76da") },
  "Email marketing": { icono: Mail, imagen: img("photo-1596526131083-e8c633c948d2") },
  "WhatsApp masivo": { icono: Send, imagen: img("photo-1556656793-08538906a9f8") },
  "Automatización de procesos": { icono: Workflow, imagen: img("photo-1551288049-bebda4e38f71") },
  "Páginas web y embudos": { icono: Globe2, imagen: img("photo-1517694712202-14dd9538aa97") },
};
