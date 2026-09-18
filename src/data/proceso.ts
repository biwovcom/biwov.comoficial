export interface PasoProceso {
  numero: number;
  titulo: string;
  descripcion: string;
}

export const PASOS_PROCESO: PasoProceso[] = [
  {
    numero: 1,
    titulo: "Diagnóstico",
    descripcion:
      "Analizamos tu negocio, tus herramientas actuales y tu objetivo real de crecimiento.",
  },
  {
    numero: 2,
    titulo: "Diseñamos el Ecosistema",
    descripcion:
      "Definimos qué piezas necesitas y cómo se van a conectar entre sí.",
  },
  {
    numero: 3,
    titulo: "Implementamos",
    descripcion:
      "Construimos cada componente: contenido, canales, CRM, sitio, publicidad.",
  },
  {
    numero: 4,
    titulo: "Automatizamos",
    descripcion:
      "Conectamos todo con automatizaciones e IA para que el sistema trabaje solo.",
  },
  {
    numero: 5,
    titulo: "Escalamos",
    descripcion:
      "Medimos, optimizamos y hacemos crecer el ecosistema junto con tu negocio.",
  },
];
