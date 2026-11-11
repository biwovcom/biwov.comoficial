import type { LineaId } from "@/data/lineas";

export interface SituacionNegocio {
  id: string;
  situacion: string;
  tecnica: string;
  linea: LineaId;
}

export const SITUACIONES_NEGOCIO: SituacionNegocio[] = [
  {
    id: "contenido",
    situacion: "Publico contenido, pero no sé si estoy haciendo lo correcto",
    tecnica: "Diagnóstico · calendario · guiones · acompañamiento",
    linea: "direccion",
  },
  {
    id: "equipo",
    situacion: "Tengo equipo de marketing o ventas, pero les falta dirección",
    tecnica: "Planeación · supervisión · tablero de indicadores",
    linea: "direccion",
  },
  {
    id: "tiempo",
    situacion: "No tengo tiempo de manejar mis redes y quiero que lo hagan por mí",
    tecnica: "Diseños · edición de reels · historias · publicación",
    linea: "gestion",
  },
  {
    id: "conocimiento",
    situacion: "Quiero que más gente me conozca y me escriba",
    tecnica: "Campañas en Meta · gestión mensual",
    linea: "gestion",
  },
  {
    id: "videos",
    situacion: "Necesito videos y fotos profesionales de mi marca",
    tecnica: "Producción Start, Professional o Signature",
    linea: "produccion",
  },
  {
    id: "grabo-yo",
    situacion: "Yo grabo con mi celular, pero necesito que me lo editen",
    tecnica: "Guiones · asesoría de grabación · edición de reels",
    linea: "produccion",
  },
  {
    id: "curiosos",
    situacion: "Me escriben muchos curiosos y pierdo tiempo con quien no va a comprar",
    tecnica: "WhatsApp con IA · calificación de prospectos",
    linea: "automatizacion",
  },
  {
    id: "seguimiento-automatico",
    situacion: "Quiero que el seguimiento se haga solo y que mis clientes vuelvan a comprar",
    tecnica: "Email marketing · WhatsApp masivo · CRM",
    linea: "automatizacion",
  },
  {
    id: "pagina",
    situacion: "Necesito una página hecha para que me escriban, agenden o dejen sus datos",
    tecnica: "Landing page · formulario · embudo",
    linea: "ecosistemas",
  },
  {
    id: "lista-clientes",
    situacion: "Quiero todo conectado: página, CRM, WhatsApp y seguimiento",
    tecnica: "Ecosistema comercial integrado",
    linea: "ecosistemas",
  },
];
