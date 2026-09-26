export interface BloqueDiagnostico {
  id: string;
  titulo: string;
  preguntasGuia: string[];
}

export interface CampoRedSocial {
  id: string;
  label: string;
  placeholder: string;
}

/** Campos de una sola línea, no bloques de texto — para ubicar los perfiles reales del negocio. */
export const CAMPOS_REDES_SOCIALES: CampoRedSocial[] = [
  { id: "facebook", label: "Facebook", placeholder: "facebook.com/tu-negocio o @usuario" },
  { id: "instagram", label: "Instagram", placeholder: "@usuario" },
  { id: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/company/tu-negocio" },
  { id: "tiktok", label: "TikTok", placeholder: "@usuario" },
  { id: "youtube", label: "YouTube", placeholder: "youtube.com/@tu-canal" },
  { id: "google", label: "Google (perfil de negocio / Maps)", placeholder: "Nombre exacto en Google" },
  { id: "otra", label: "Otra red", placeholder: "Cuál y su usuario/link" },
];

/**
 * Un bloque = un cuadro de texto con dictado por voz. En vez de una pregunta
 * por campo, se agrupan por tema (así se toma nota igual que en una llamada
 * real) — las preguntas guía se muestran como referencia dentro del bloque.
 */
export const BLOQUES_DIAGNOSTICO: BloqueDiagnostico[] = [
  {
    id: "historia",
    titulo: "Historia del negocio",
    preguntasGuia: ["¿Cuándo empezó?", "¿Por qué lo creó y con qué fin?"],
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
    titulo: "Marketing actual (captación)",
    preguntasGuia: [
      "¿Por dónde llegan hoy los clientes: contactos que ya lo conocen, contenido, mensajes en frío o pauta?",
      "¿Cuál de esas vías trae los mejores clientes y cuál no está usando?",
      "¿Tiene algo gratis o de bajo costo que atraiga interesados (un regalo, una guía, un diagnóstico)?",
      "¿Cuántos interesados nuevos entran al mes?",
    ],
  },
  {
    id: "seguimiento-leads",
    titulo: "Seguimiento de leads (conversión)",
    preguntasGuia: [
      "De cada 100 interesados, ¿cuántos hablan con él o su equipo?",
      "De esos, ¿cuántos compran?",
      "¿En cuánto tiempo responde a un interesado nuevo?",
      "¿Cuántas veces hace seguimiento antes de rendirse?",
      "¿Quién vende? ¿Tiene un guion o improvisa?",
    ],
  },
  {
    id: "retencion",
    titulo: "Retención y fidelización (dinero después de la venta)",
    preguntasGuia: [
      "¿Qué le ofrece al cliente después de que compra? (algo más grande, algo complementario)",
      "¿Tiene algo que el cliente pague cada mes?",
      "Si alguien dice que no por precio, ¿tiene alguna alternativa de venta?",
      "¿Cuántos clientes vuelven a comprar y cuántos lo recomiendan?",
      "¿Por qué se van los clientes que se van?",
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
    id: "capacidad-escalar",
    titulo: "Capacidad de escalar (operación)",
    preguntasGuia: [
      "Si mañana le llegara el doble de clientes, ¿qué se rompería primero?",
      "¿Qué tareas dependen solo de él?",
      "¿Qué haría con más tiempo libre?",
      "¿Tiene procesos escritos o todo está en su cabeza?",
      "¿Su equipo puede atender sin que él esté presente?",
    ],
  },
  {
    id: "valor",
    titulo: "Valor de la oferta",
    preguntasGuia: [
      "¿Cuál es el resultado soñado de su cliente? ¿Lo dice su oferta de forma clara?",
      "¿Qué tan seguro está el cliente de que lo va a lograr con él? ¿Qué pruebas le da?",
      "¿Cuánto tarda en ver el primer resultado?",
      "¿Cuánto esfuerzo le cuesta al cliente? ¿Qué parte podría hacer él por su cliente?",
      "¿Por qué alguien no le compra? Lista de todas las objeciones.",
      "¿Su oferta se compara por precio con la competencia, o es tan distinta que no se puede comparar?",
    ],
  },
];

export type RespuestasDiagnosticoLargo = Record<string, string>;
