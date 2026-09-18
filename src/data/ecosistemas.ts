export interface EcosistemaContenido {
  id: "start" | "growth" | "enterprise";
  nombre: string;
  claim: string;
  descripcion: string;
  modulos: string[];
}

export const ECOSISTEMAS: EcosistemaContenido[] = [
  {
    id: "start",
    nombre: "START",
    claim: "Construye tu presencia digital",
    descripcion:
      "Para negocios que están construyendo su presencia digital desde cero. Primero lo básico: orden, estrategia, contenido, WhatsApp y un CRM inicial. La automatización avanzada llega después.",
    modulos: [
      "Estrategia y estructura de marca",
      "Contenido y campañas",
      "Gestión de redes sociales",
      "WhatsApp organizado",
      "CRM básico inicial",
    ],
  },
  {
    id: "growth",
    nombre: "GROWTH",
    claim: "Optimiza tu proceso comercial",
    descripcion:
      "Para empresas que ya tienen ventas y quieren ordenar y escalar su proceso comercial de punta a punta.",
    modulos: [
      "CRM y embudos de venta",
      "WhatsApp y agenda conectados",
      "Automatizaciones de seguimiento",
      "Publicidad (Meta Ads / Google Ads)",
      "Inteligencia artificial aplicada",
    ],
  },
  {
    id: "enterprise",
    nombre: "ENTERPRISE",
    claim: "Automatiza y escala con estrategia",
    descripcion:
      "Para organizaciones que necesitan automatizaciones avanzadas, IA y embudos complejos — todo configurado sobre herramientas ya probadas como GoHighLevel, no desarrollo de software desde cero.",
    modulos: [
      "Automatizaciones avanzadas e IA",
      "Embudos avanzados en GoHighLevel",
      "CRM avanzado y gestión de oportunidades",
      "Integraciones entre tus herramientas actuales",
      "Acompañamiento estratégico dedicado",
    ],
  },
];
