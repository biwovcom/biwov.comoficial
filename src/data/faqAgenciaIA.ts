import { MESES_MINIMOS } from "@/data/portafolioClientes";

/** Preguntas frecuentes de /agencia-ia (también salen como FAQPage en los datos estructurados). */
export const FAQ_AGENCIA = [
  { q: "¿En qué se diferencia de usar ChatGPT o Claude por mi cuenta?", a: "Un chat responde lo que le preguntas. La agencia de agentes ya sabe qué hacer: tiene la memoria de tu marca, especialistas con métodos probados y un coordinador que organiza el trabajo. Recibes entregables completos, listos para aprobar." },
  { q: "¿Necesito saber de marketing?", a: "No. Los agentes trabajan con la estrategia y los métodos de biwov. Tú decides y apruebas. En la instalación capacitamos a tu equipo." },
  { q: "¿Qué necesito para usarla?", a: "Un computador con internet y una suscripción de Claude a tu nombre (desde aprox. US$20 al mes según el uso), que pagas directo. Nosotros hacemos la instalación." },
  { q: "¿Los diseños los hace una IA de imágenes?", a: "No. Scher, la diseñadora de marca, estudia tu empresa y construye el logo y la identidad en vectores con criterio de diseño, sin generadores de imágenes de IA." },
  { q: "¿Los agentes publican o responden mensajes solos?", a: "No. Preparan el trabajo y lo dejan esperando tu aprobación. Publicar y responder a tus clientes sigue siendo decisión de tu equipo." },
  { q: "¿Qué pasa con mis datos?", a: "La memoria de tu marca es solo tuya y no se comparte con otras marcas. Si cancelas, te entregamos una copia de tu información." },
  { q: "¿Puedo cancelar?", a: `La permanencia mínima es de ${MESES_MINIMOS} meses; después es mes a mes. Al cancelar se desactiva el acceso a los agentes, las actualizaciones y el soporte, y te entregamos la copia de tu información.` },
];
