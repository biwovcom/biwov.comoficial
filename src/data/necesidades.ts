export interface CaminoNecesidad {
  id: "clientes" | "ventas" | "tiempo" | "personalizada";
  titulo: string;
  incluye: string[];
  problema: string;
  solucion: string;
}

export const CAMINOS_NECESIDAD: CaminoNecesidad[] = [
  {
    id: "clientes",
    titulo: "Quiero conseguir más clientes",
    incluye: [
      "Estrategia",
      "Creación de contenido",
      "Redes Sociales",
      "Meta Ads",
      "Google Ads",
      "Landing Pages",
      "Automatizaciones",
    ],
    problema:
      "Publicas en redes, pero los clientes no llegan solos: sin estrategia ni pauta bien dirigida, el esfuerzo se diluye y no se traduce en contactos reales.",
    solucion:
      "Te ayudamos con estrategia, contenido, redes, pauta en Meta y Google, y una landing page que convierte visitas en clientes potenciales.",
  },
  {
    id: "ventas",
    titulo: "Quiero vender más",
    incluye: [
      "CRM",
      "Embudos",
      "Seguimiento",
      "WhatsApp",
      "Agenda",
      "Automatizaciones",
      "IA",
    ],
    problema:
      "Te escriben por WhatsApp o Instagram, pero muchos mensajes tardan en responderse o se pierden, y esos clientes se enfrían y compran en otro lado.",
    solucion:
      "Conectamos tu WhatsApp, un CRM y automatizaciones de seguimiento para que ningún cliente se quede sin respuesta ni se te olvide cerrar la venta.",
  },
  {
    id: "tiempo",
    titulo: "Quiero ahorrar tiempo",
    incluye: [
      "Automatizaciones",
      "CRM",
      "IA",
      "Integraciones",
      "Gestión comercial",
      "Procesos automáticos",
    ],
    problema:
      "Estás metida en todo: contenido, mensajes, agenda, seguimiento... y el negocio depende de que tú estés presente todo el tiempo.",
    solucion:
      "Automatizamos tareas repetitivas con IA y un CRM conectado, para que los procesos avancen aunque tú no estés detrás de cada uno.",
  },
  {
    id: "personalizada",
    titulo: "Necesito una solución más avanzada",
    incluye: [
      "CRM avanzado",
      "Embudos en GoHighLevel",
      "Automatizaciones avanzadas",
      "IA aplicada",
      "Integraciones entre tus herramientas",
      "Estrategia a la medida",
    ],
    problema:
      "Tu negocio ya tiene procesos propios y necesidades específicas que no encajan en un paquete genérico.",
    solucion:
      "Configuramos embudos, automatizaciones e IA sobre herramientas ya probadas (como GoHighLevel), diseñados de forma estratégica según lo que tu operación realmente necesita — sin desarrollar software desde cero.",
  },
];
