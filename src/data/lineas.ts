/**
 * Las 5 líneas de negocio de biwov. Cada producto de la tienda pertenece a una
 * línea, y la tienda arranca preguntando "¿qué necesitas?" para que el cliente
 * llegue directo a la línea que le sirve.
 */
export type LineaId = "direccion" | "gestion" | "produccion" | "automatizacion" | "ecosistemas";

export interface Linea {
  id: LineaId;
  numero: string;
  nombre: string;
  /** Lo que hace biwov en esta línea. */
  promesa: string;
  /** Etiqueta corta para que el cliente sepa quién ejecuta. */
  etiqueta: string;
  /** La necesidad dicha como la diría el cliente. */
  necesidad: string;
  imagen: string;
}

export const LINEAS: Linea[] = [
  {
    id: "direccion",
    numero: "01",
    nombre: "Dirección estratégica",
    promesa: "Pensamos, enseñamos y te acompañamos. Tú o tu equipo ejecutan.",
    etiqueta: "Tú ejecutas, nosotros te dirigimos",
    necesidad: "Quiero saber qué hacer y cómo hacerlo, y ejecutarlo yo o mi equipo",
    imagen: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=70",
  },
  {
    id: "gestion",
    numero: "02",
    nombre: "Gestión de marketing",
    promesa: "Planeamos, creamos, diseñamos, publicamos y medimos por ti.",
    etiqueta: "Nosotros lo hacemos por ti",
    necesidad: "No tengo tiempo: quiero que manejen mis redes por mí",
    imagen: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=70",
  },
  {
    id: "produccion",
    numero: "03",
    nombre: "Producción de contenido",
    promesa: "Fotografía, video y edición profesional, dirigidos por biwov.",
    etiqueta: "Fotos y videos de tu marca",
    necesidad: "Necesito fotos y videos profesionales de mi marca",
    imagen: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=70",
  },
  {
    id: "automatizacion",
    numero: "04",
    nombre: "Automatización e IA",
    promesa: "WhatsApp, chatbots, CRM, email y flujos que trabajan solos.",
    etiqueta: "Ahorra tiempo y no pierdas clientes",
    necesidad: "Me escriben mucho y no doy abasto, quiero que el seguimiento se haga solo",
    imagen: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=600&q=70",
  },
  {
    id: "ecosistemas",
    numero: "05",
    nombre: "Ecosistemas digitales",
    promesa: "Landing pages, sitios web, embudos e integraciones que convierten.",
    etiqueta: "Tu estructura para vender en internet",
    necesidad: "Necesito una página web o un embudo que me traiga clientes",
    imagen: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=70",
  },
];

export function lineaPorId(id: LineaId): Linea {
  return LINEAS.find((l) => l.id === id)!;
}
