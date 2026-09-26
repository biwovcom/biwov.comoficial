export interface BloqueDiagnostico {
  id: string;
  titulo: string;
  preguntasGuia: string[];
}

/**
 * Un bloque = un cuadro de texto con dictado por voz. En vez de una pregunta
 * por campo, se agrupan por tema (así se toma nota igual que en una llamada
 * real) — las preguntas guía se muestran como referencia dentro del bloque.
 */
export const BLOQUES_DIAGNOSTICO: BloqueDiagnostico[] = [
  {
    id: "historia",
    titulo: "Historia del negocio",
    preguntasGuia: [
      "¿Cuándo empezó?",
      "¿Por qué lo creó y con qué fin?",
      "¿Cuál ha sido el momento más difícil?",
      "¿Cuál ha sido el momento más bonito?",
    ],
  },
  {
    id: "lo-que-vende",
    titulo: "Lo que vende",
    preguntasGuia: [
      "Productos o servicios y precios",
      "Ticket promedio",
      "El que más dinero deja y el que más se vende",
      "¿Qué problema resuelve?",
    ],
  },
  {
    id: "cliente-ideal",
    titulo: "Cliente ideal",
    preguntasGuia: [
      "Edad, sexo, país, ciudad",
      "¿A qué se dedica? ¿Cuáles son sus hábitos?",
      "¿Qué le preocupa? ¿Cómo habla?",
      "Objeciones más comunes",
      "¿Quién es su mejor cliente?",
    ],
  },
  {
    id: "mercado",
    titulo: "Mercado",
    preguntasGuia: [
      "¿Qué busca su cliente? (más tiempo, dinero, salud, seguridad, amor o estatus)",
      "¿Su cliente tiene dinero para pagar?",
      "¿Dónde se le encuentra?",
      "¿El sector crece o baja?",
    ],
  },
  {
    id: "diferencial",
    titulo: "Diferencial",
    preguntasGuia: [
      "¿Por qué le compran a él y no a otros?",
      "3 competidores",
      "Testimonios o casos de éxito",
    ],
  },
  {
    id: "marketing-actual",
    titulo: "Marketing actual",
    preguntasGuia: [
      "Redes y seguidores",
      "¿Cómo hace el contenido hoy y cómo lo ve?",
      "¿Por dónde le llegan los clientes?",
      "¿Ha hecho pauta? ¿Con qué resultado?",
      "¿Qué cree que frenó su crecimiento?",
      "¿Qué tan importante ve el marketing digital?",
    ],
  },
  {
    id: "seguimiento-leads",
    titulo: "Seguimiento de leads",
    preguntasGuia: [
      "¿Cuántas personas le escriben al mes? ¿Cuántas compran?",
      "¿Quién responde y en cuánto tiempo?",
      "¿Qué pasa con los mensajes de noche o fin de semana?",
      "¿Dónde guarda los datos?",
      "¿Hace seguimiento a los que no compran? ¿Tiene mensajes preparados?",
      "¿Usa alguna herramienta? ¿Qué hace con los clientes que ya compraron?",
    ],
  },
  {
    id: "metas",
    titulo: "Metas",
    preguntasGuia: [
      "Clientes actuales al mes y meta a lograr",
      "¿En cuánto tiempo? ¿Qué resultados quiere ver?",
      "Proyección a 1 y 3 años",
      "Si tuviera una lámpara mágica, ¿qué pediría para su negocio?",
    ],
  },
  {
    id: "compromiso",
    titulo: "Compromiso",
    preguntasGuia: [
      "Disciplina del 1 al 10",
      "¿Está dispuesto a crear mínimo 3 contenidos por semana?",
      "¿Se siente cómodo saliendo en cámara?",
      "¿Está abierto a hacer cosas nuevas aunque le incomoden?",
    ],
  },
  {
    id: "valor",
    titulo: "Valor",
    preguntasGuia: [
      "Resultado soñado de su cliente",
      "¿Cuánto tarda en ver resultados?",
      "¿Qué esfuerzo le toca hacer a él?",
      "¿Qué miedo tiene de comprar?",
      "¿Podría ofrecer una garantía?",
    ],
  },
];

export type RespuestasDiagnosticoLargo = Record<string, string>;
