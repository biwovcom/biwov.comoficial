export interface FaseRoadmap {
  fase: string;
  titulo: string;
  detalle: string[];
}

/**
 * Cómo evoluciona un cliente que arranca en START, mes a mes y luego por
 * ecosistema. Contenido operativo real (no marketing genérico) para que el
 * prospecto sepa exactamente qué recibe y cuándo.
 */
export const ROADMAP_START: FaseRoadmap[] = [
  {
    fase: "Mes 1 (primeros 15–20 días)",
    titulo: "Planeación, estrategia y montaje",
    detalle: [
      "Definimos estrategia, línea gráfica y organizamos la información de tu empresa.",
      "Optimizamos tus cuentas: se arranca con 2 redes (Instagram y Facebook) + WhatsApp.",
      "Mínimo 8 creativos iniciales para dejar todo montado: 4 videos + 4 imágenes.",
      "Grabación, edición y diseño incluidos en el proceso de montaje.",
    ],
  },
  {
    fase: "Desde el mes 1",
    titulo: "Producción y campañas activas",
    detalle: [
      "Entre 6 y 9 creativos al mes, en variantes A/B/C/D para poder optimizar campañas.",
      "El mismo contenido también se publica de forma orgánica para entrenar el algoritmo.",
      "Dos tipos de campaña desde el inicio: crecimiento de audiencia y ventas.",
      "Inversión publicitaria mínima de $500.000/mes, aparte del valor de biwov — se paga directo a Meta o Google.",
      "Recolección básica de datos de contactos e interesados desde estas primeras campañas.",
    ],
  },
  {
    fase: "Mes 3 en adelante",
    titulo: "Comunidad y remarketing",
    detalle: [
      "Se suman campañas de remarketing y de construcción de comunidad.",
      "Reporte mensual de resultados y ajuste de estrategia según lo que va funcionando.",
    ],
  },
  {
    fase: "A partir del mes 6",
    titulo: "Escala a GROWTH",
    detalle: [
      "CRM y GoHighLevel para ordenar todos tus contactos y oportunidades.",
      "Email marketing y mensajes masivos por WhatsApp para remarketing.",
    ],
  },
  {
    fase: "Etapa avanzada",
    titulo: "Landing pages y campañas 1 a 1",
    detalle: [
      "Mínimo 5 landing pages para filtrar y calificar mejor a tus clientes.",
      "Campañas 1 a 1 gestionadas desde GoHighLevel.",
      "Requiere aumentar el presupuesto de pauta publicitaria frente a las fases anteriores.",
    ],
  },
];
