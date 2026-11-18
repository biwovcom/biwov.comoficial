/**
 * Documentos para enviar a cada cliente y que los vea en el navegador:
 * biwov.com/documentos/<slug> (índice), /cuestionario y /analisis.
 * El contrato es la propuesta firmable de /propuesta/<slug>.
 * Páginas privadas: no se indexan en Google.
 */

export interface PreguntaGrupo {
  titulo: string;
  preguntas: string[];
}

export interface BloqueAnalisis {
  titulo: string;
  intro?: string;
  items: string[];
}

/** Datos REALES de la cuenta de anuncios del cliente para la calculadora (de su auditoría de Meta). */
export interface CalculadoraMeta {
  /** Costo por mil impresiones: promedio histórico y rango visto mes a mes. */
  cpm: number;
  cpmMin: number;
  cpmMax: number;
  /** Conversaciones de WhatsApp por cada impresión (últimos 30 días). */
  tasaConversacion: number;
  /** Inversión mensual con la que se midió esa tasa (al subir la inversión, la eficiencia baja). */
  gastoBase: number;
  /** De cada 100 conversaciones, cuántas agendan (real). */
  pctAgenda: number;
  /** De cada 100 citas, cuántas asisten (supuesto si no se ha medido). */
  pctAsiste: number;
  pctAsisteMedido: boolean;
  /** De cada 100 que asisten, cuántas empiezan. */
  pctInicia: number;
  presupuestoActual: number;
  metaPacientes: number;
  servicios: { nombre: string; ticket: number; estimado?: boolean }[];
  datosMeta: { etiqueta: string; valor: string }[];
  fuente: string;
}

export interface DocumentosCliente {
  slug: string;
  cliente: string;
  nombrePila: string;
  negocio: string;
  fecha: string; // fecha del análisis, texto
  propuestaSlug?: string;
  /** Plan de contenido y calculadora (página /documentos/<slug>/plan). Los datos del calendario viven en la oficina. */
  plan?: {
    desde: string;
    hasta: string;
    calculadora: CalculadoraMeta;
  };
  /** Prospecto del panel donde se guardan las respuestas del cuestionario (Historial). */
  prospectoId?: string;
  cuestionario: {
    intro: string;
    grupos: PreguntaGrupo[];
  };
  analisis: {
    resumen: string;
    cifras: { etiqueta: string; valor: string; nota?: string }[];
    calificaciones: { canal: string; nota: string; texto: string }[];
    funciona: BloqueAnalisis;
    oportunidades: BloqueAnalisis[];
    proximos: string[];
  };
}

const ORTODONCIA: DocumentosCliente = {
  slug: "ortodoncia-bw26",
  cliente: "Dra. Ángela María Quintero Q.",
  nombrePila: "Ángela",
  negocio: "Ortodoncia y ortopedia maxilar · Manizales",
  fecha: "11 de noviembre de 2026",
  propuestaSlug: "ortodoncia-bw26",
  prospectoId: "6930774c-75c0-4547-8bc0-49cfaae5f3ad",
  plan: {
    desde: "24 de noviembre",
    hasta: "24 de diciembre de 2026",
    calculadora: {
      cpm: 6192,
      cpmMin: 5777,
      cpmMax: 7308,
      tasaConversacion: 30 / 21145,
      gastoBase: 240456,
      pctAgenda: 10,
      pctAsiste: 70,
      pctAsisteMedido: false,
      pctInicia: 80,
      presupuestoActual: 800000,
      metaPacientes: 60,
      servicios: [
        { nombre: "Higiene oral", ticket: 150000 },
        { nombre: "Ortodoncia", ticket: 1800000, estimado: true },
        { nombre: "Coronas en zirconio", ticket: 900000, estimado: true },
      ],
      datosMeta: [
        { etiqueta: "Invertido (12 oct – 10 nov)", valor: "$142.972" },
        { etiqueta: "Impresiones", valor: "21.145" },
        { etiqueta: "Conversaciones de WhatsApp", valor: "30" },
        { etiqueta: "Costo por conversación", valor: "$4.766" },
        { etiqueta: "Mejor anuncio (diastemas)", valor: "$4.378 por conversación" },
        { etiqueta: "Anuncio de ortodoncia", valor: "$5.831 por conversación" },
        { etiqueta: "Costo por mil impresiones (histórico)", valor: "$6.192" },
        { etiqueta: "Invertido en total desde abril 2025", valor: "$860.024" },
      ],
      fuente:
        "Tu cuenta de anuncios de Meta (auditoría del 11 nov 2026) y tu cuestionario (3 de 30 conversaciones agendaron; empieza el 80 % de quienes asisten). La asistencia a la cita todavía no se ha medido: usamos 70 % mientras la medimos.",
    },
  },
  cuestionario: {
    intro:
      "Este cuestionario es la base de todo el trabajo. Con tus respuestas terminamos el análisis de tus redes, definimos a quién le vamos a hablar, cuánto y cómo invertir en publicidad, qué contenido vamos a crear y armamos el plan de trabajo de los tres meses. Responde con la mayor claridad posible; si no sabes un dato exacto, un aproximado nos sirve.",
    grupos: [
      {
        titulo: "Tus sueños y metas",
        preguntas: [
          "Si tuvieras una lámpara mágica y pudieras pedir un deseo para tu consultorio, ¿qué pedirías?",
          "Al terminar estos 3 meses, ¿qué resultado haría que digas “valió la pena”? (por ejemplo: cuántos pacientes nuevos al mes, en qué tratamiento, cuántos seguidores o reseñas)",
        ],
      },
      {
        titulo: "Tus pacientes y tu mercado",
        preguntas: [
          "¿A quién le quieres llegar? Describe a las personas que más quieres atender: edad, si son adultos, jóvenes o niños (y en ese caso, si decide la mamá o el papá), a qué se dedican y qué tanto pueden invertir en su sonrisa.",
          "¿En qué zona los quieres atraer? ¿Solo en Manizales o también en Villamaría, Chinchiná, otros municipios de Caldas, otras ciudades o colombianos que viven en el exterior?",
          "Además de los espacios entre los dientes, los dientes torcidos, los brackets que se notan y el bruxismo, ¿qué otros problemas, molestias o inseguridades traen tus pacientes cuando llegan? ¿Qué es lo que más les preocupa o les da pena?",
          "¿Qué dudas o miedos te expresan antes de decidirse (precio, dolor, tiempo del tratamiento, que se note, financiación)?",
          "¿Por qué te eligen tus pacientes a ti? ¿Qué te dicen cuando terminan el tratamiento?",
        ],
      },
      {
        titulo: "Tus servicios y precios",
        preguntas: [
          "¿Cuál es tu servicio más económico, cuál le sigue y cuál es el más caro? Escribe el precio aproximado de cada uno y qué tipo de paciente lo compra (por ejemplo: jóvenes, adultos que trabajan, mamás que lo pagan para sus hijos). ¿Cuál te deja más ganancia?",
          "¿Qué servicios quieres posicionar primero y por qué? ¿Te interesa trabajar la ortopedia maxilar infantil con mamás y papás?",
          "¿La valoración de $60.000 se abona al tratamiento? ¿Qué incluye la valoración?",
          "Además de la financiación con Welli, ¿qué otras formas de pago o descuentos ofreces (cuotas, tarjetas, pago de contado)?",
          "¿Cuántos pacientes nuevos más puedes atender al mes? ¿Qué días y horarios tienes para valoraciones?",
          "¿Tienes temporadas o fechas fuertes en el año (vacaciones, primas, regreso a clases, fin de año)? ¿Tendrás cierres o vacaciones entre noviembre y enero?",
        ],
      },
      {
        titulo: "Tu propuesta de valor",
        preguntas: [
          "¿Cuál es tu propuesta de valor? Es decir, ¿qué le ofreces a tus pacientes que te hace diferente y por qué deberían elegirte a ti y no a otro especialista?",
          "¿Quiénes son tus competidores directos (nombres o cuentas de Instagram) y en qué te diferencias de cada uno?",
        ],
      },
      {
        titulo: "Mensajes, seguimiento y ventas",
        preguntas: [
          "Cuando pagabas publicidad, ¿cuántos mensajes o consultas te llegaban al mes? ¿Y cuántos te llegan ahora, sin publicidad? ¿Por dónde llegan (WhatsApp, Instagram, Facebook, llamadas, referidos, Google)?",
          "De esos mensajes, ¿cuántos agendan una valoración? ¿Y cuántos asisten?",
          "De los que asisten, ¿cuántos empiezan un tratamiento? ¿Cuánto paga en promedio un paciente nuevo?",
          "De las 30 conversaciones que llegaron por los anuncios en las últimas semanas, ¿recuerdas cuántas agendaron valoración y cuántas empezaron tratamiento?",
          "¿Quién responde los mensajes, en cuánto tiempo y qué se les dice? Si tienes un mensaje o guion de respuesta, cópialo aquí.",
          "¿Cómo responden las personas interesadas? ¿Muchas solo preguntan el precio y dejan de contestar? Más o menos, ¿cuántas de cada 10 se quedan sin respuesta? ¿Qué haces cuando alguien pregunta y no vuelve a escribir?",
          "¿Cada cuánto les haces seguimiento a las personas interesadas que no agendaron, y cómo (mensaje de WhatsApp, llamada, audio, promoción, ninguno)?",
          "¿Cómo llevas el registro de tus pacientes y de las personas interesadas (cuaderno, Excel, etiquetas de WhatsApp Business, software del consultorio)?",
        ],
      },
      {
        titulo: "Publicidad",
        preguntas: [
          "¿Cuánto puedes invertir al mes en publicidad en Facebook e Instagram (aparte del pago a la agencia)? ¿Quién recarga el saldo, con qué medio de pago y cada cuánto?",
          "En tu experiencia, ¿qué publicidad te ha funcionado y cuál no? ¿Quién manejaba antes tus anuncios?",
          "Meta está pidiendo verificar quién está detrás de tus anuncios: ¿tienes a la mano tu cédula y los datos del consultorio (o RUT)? ¿Nos autorizas a agregar a biwov_ como socia en tu portafolio comercial de Meta para manejar los anuncios sin usar tu sesión personal?",
        ],
      },
      {
        titulo: "Datos oficiales y marca",
        preguntas: [
          "En tus redes aparecen varios teléfonos y direcciones. Confírmanos los datos oficiales: WhatsApp (¿322 759 7848?), dirección (¿Cl 55 #55B-05, barrio Belén?), horario de atención y correo. ¿Cuál de tus dos páginas de Facebook es la oficial?",
          "¿Tienes logo y colores oficiales vigentes (archivos originales)? ¿Tienes perfil en Google Maps (Perfil de Empresa de Google) o página web?",
        ],
      },
      {
        titulo: "Grabación y agenda",
        preguntas: [
          "¿Qué días y en qué horarios de la semana puedes grabar los videos? ¿Con qué los grabas (celular, micrófono, luz) y quién los edita?",
          "¿Qué días y en qué horarios tienes disponibilidad en la semana para nuestra asesoría de marketing digital (reunión virtual semanal)? Danos dos o tres opciones.",
          "¿Tienes casos, fotos o testimonios de pacientes con autorización escrita para publicarlos? ¿Hay pacientes contentos a quienes les podamos pedir una reseña en Google o Facebook?",
          "¿Hay temas o cosas que NO quieres mostrar en tus redes? ¿Qué temas te gusta explicar y te salen naturales?",
        ],
      },
    ],
  },
  analisis: {
    resumen:
      "Revisamos tu Instagram, tus páginas de Facebook y tu cuenta publicitaria de Meta. Tienes una base valiosa: 15 años de experiencia, una imagen profesional cercana y un anuncio que ya demostró que trae conversaciones a buen costo. Lo que falta es ordenar el perfil, publicar con constancia, mostrarte más tú y medir cuántas conversaciones terminan en valoraciones y tratamientos.",
    cifras: [
      { etiqueta: "Seguidores en Instagram", valor: "339", nota: "157 publicaciones" },
      { etiqueta: "Páginas de Facebook", valor: "2", nota: "85 y 56 seguidores" },
      { etiqueta: "Conversaciones por WhatsApp", valor: "30", nota: "últimos 30 días de pauta" },
      { etiqueta: "Costo por conversación", valor: "$4.766", nota: "$142.972 invertidos" },
      { etiqueta: "Inversión histórica en Meta", valor: "$860.024", nota: "desde abril de 2025" },
      { etiqueta: "Reseñas", valor: "0", nota: "en Facebook" },
    ],
    calificaciones: [
      { canal: "Instagram", nota: "3,5 / 10", texto: "Buena foto de perfil y algunos reels con buenas vistas, pero el perfil no dice la ciudad, la biografía no invita a agendar y el feed está hecho casi todo de piezas tipo volante." },
      { canal: "Facebook · página principal", nota: "3,5 / 10", texto: "Está activa y conectada a Instagram y a la publicidad, pero publica muy poco, la portada está vencida y aparecen varios nombres y logos distintos." },
      { canal: "Facebook · página secundaria", nota: "2,5 / 10", texto: "Lleva casi dos años sin publicar, tiene un teléfono con prefijo de Estados Unidos y otra dirección. Divide a tu audiencia y confunde al paciente." },
    ],
    funciona: {
      titulo: "Lo que ya está funcionando",
      items: [
        "El anuncio “Cierra espacios, armoniza tu sonrisa” (diastemas y micro diseño) trajo 22 conversaciones a $4.378 cada una. Su fórmula sirve de molde: un problema concreto, qué incluye, precio “desde”, Manizales y WhatsApp con un mensaje ya escrito.",
        "Los mensajes que tocan un deseo o una objeción (“sin brackets”, “sin que nadie lo note”) y las preguntas sobre un problema (bruxismo, “no elijas tu ortodoncia sin conocer tu caso”).",
        "Los videos donde apareces tú hablando a cámara: generan más confianza que las piezas gráficas.",
        "Tu foto de perfil: profesional y cercana. Tu imagen es el activo más fuerte de la marca.",
      ],
    },
    oportunidades: [
      {
        titulo: "Perfil de Instagram",
        items: [
          "Agregar la ciudad al nombre (por ejemplo, “Ortodoncista en Manizales | Dra. Ángela Quintero”) para aparecer en las búsquedas.",
          "Biografía con promesa, ubicación e invitación a agendar la valoración.",
          "Enlace de WhatsApp que abra con un mensaje ya escrito.",
          "Ponerle nombre a las historias destacadas: Tratamientos · Resultados · Testimonios · Financiación · Ubicación · Conóceme.",
        ],
      },
      {
        titulo: "Contenido",
        items: [
          "Pasar de volantes con fotos de banco a reels contigo explicando tratamientos, procesos y casos reales (con autorización del paciente).",
          "Publicar con constancia: hubo pausas largas (de julio a septiembre no se publicó) y desde el 28 de octubre no hay publicaciones nuevas. La meta es mínimo 3 reels por semana.",
          "Equilibrar el contenido: hoy casi todo es oferta y precio. Proponemos 40 % contenido para atraer, 40 % para generar confianza y 20 % para vender.",
          "Abrir una línea de ortopedia maxilar infantil dirigida a mamás y papás, que hoy casi no se comunica.",
        ],
      },
      {
        titulo: "Facebook",
        items: [
          "Trabajar una sola página oficial (“Dra Angela M Quintero”) y fusionar o despublicar la secundaria.",
          "Unificar teléfono (WhatsApp 322 759 7848), dirección, nombre, logo y categoría “Ortodoncista”.",
          "Cambiar la portada y empezar a pedir reseñas: hoy hay cero.",
        ],
      },
      {
        titulo: "Publicidad en Meta",
        items: [
          "Hacer la verificación del anunciante que Meta está pidiendo, para que no se pausen los anuncios.",
          "La cuenta es prepagada y los anuncios se han detenido por falta de saldo: hay que definir el presupuesto del mes y recargar antes de activar.",
          "Ordenar la cuenta: hay campañas de prueba y 21 borradores. Dejaremos una campaña de mensajes a WhatsApp bien estructurada.",
          "Pasar la cuenta publicitaria al portafolio comercial del consultorio y agregar a biwov_ como socia, para no depender de tu sesión personal.",
          "Medir lo que importa: cuántas conversaciones terminan en valoración y cuántas en tratamiento. Para eso es clave el cuestionario.",
        ],
      },
    ],
    proximos: [
      "Responder el cuestionario: es la base para el plan de trabajo.",
      "Ajustes rápidos del perfil de Instagram y de la página de Facebook.",
      "Verificación del anunciante y orden de la cuenta publicitaria.",
      "Entrega del plan de trabajo de noviembre, diciembre y enero, con guiones y guía de grabación.",
    ],
  },
};

export const DOCUMENTOS_CLIENTES: DocumentosCliente[] = [ORTODONCIA];

export const documentosPorSlug = (slug: string) =>
  DOCUMENTOS_CLIENTES.find((d) => d.slug === slug);

/**
 * Cuestionario de inicio GENERAL: sirve para cualquier cliente que firme, sin programar nada.
 * Se abre en /inicio/<id del prospecto> (el enlace se copia desde su ficha en el panel) y las
 * respuestas quedan en el Historial de ese mismo prospecto (no se crea otro registro).
 */
export const CUESTIONARIO_GENERAL: DocumentosCliente["cuestionario"] = {
  intro:
    "Este cuestionario es la base de todo el trabajo. Con tus respuestas analizamos tu negocio y tus redes, definimos a quién le vamos a hablar, cuánto y cómo invertir en publicidad, qué contenido vamos a crear y armamos el plan de trabajo. Responde con la mayor claridad posible; si no sabes un dato exacto, un aproximado nos sirve.",
  grupos: [
    {
      titulo: "Tus sueños y metas",
      preguntas: [
        "Si tuvieras una lámpara mágica y pudieras pedir un deseo para tu negocio, ¿qué pedirías?",
        "Al terminar nuestro trabajo juntos, ¿qué resultado haría que digas “valió la pena”? (por ejemplo: cuántos clientes nuevos al mes, cuánto vender, cuántos seguidores o reseñas)",
      ],
    },
    {
      titulo: "Tu negocio",
      preguntas: [
        "Cuéntanos tu negocio en pocas palabras: qué vendes, desde cuándo y cómo empezó.",
        "¿Cuáles son tus redes, página web y datos oficiales de contacto (WhatsApp, dirección, horario)?",
      ],
    },
    {
      titulo: "Tus clientes y tu mercado",
      preguntas: [
        "¿A quién le quieres llegar? Describe a las personas que más quieres atender: edad, si son hombres o mujeres, a qué se dedican y qué tanto pueden invertir.",
        "¿En qué zona los quieres atraer? ¿Solo en tu ciudad, en otros municipios, en todo el país o fuera de Colombia?",
        "¿Qué problemas, molestias o necesidades tienen tus clientes cuando te buscan? ¿Qué es lo que más les preocupa?",
        "¿Qué dudas o miedos te expresan antes de comprar (precio, tiempo, confianza, forma de pago)?",
        "¿Por qué te eligen tus clientes a ti? ¿Qué te dicen después de comprar?",
      ],
    },
    {
      titulo: "Tus productos o servicios y precios",
      preguntas: [
        "¿Cuál es tu producto o servicio más económico, cuál le sigue y cuál es el más caro? Escribe el precio aproximado de cada uno y qué tipo de cliente lo compra. ¿Cuál te deja más ganancia?",
        "¿Qué productos o servicios quieres posicionar primero y por qué?",
        "¿Qué formas de pago, financiación o descuentos ofreces?",
        "¿Cuántos clientes nuevos más puedes atender al mes?",
        "¿Tienes temporadas o fechas fuertes en el año (vacaciones, primas, regreso a clases, fin de año)?",
      ],
    },
    {
      titulo: "Tu propuesta de valor",
      preguntas: [
        "¿Cuál es tu propuesta de valor? Es decir, ¿qué ofreces que te hace diferente y por qué deberían elegirte a ti y no a otro?",
        "¿Quiénes son tus competidores directos (nombres o cuentas de Instagram) y en qué te diferencias de cada uno?",
      ],
    },
    {
      titulo: "Mensajes, seguimiento y ventas",
      preguntas: [
        "Cuando pagabas publicidad, ¿cuántos mensajes o consultas te llegaban al mes? ¿Y cuántos te llegan ahora, sin publicidad? ¿Por dónde llegan (WhatsApp, Instagram, Facebook, llamadas, referidos, Google)?",
        "De esos mensajes, ¿cuántos terminan comprando? ¿Cuánto compra en promedio un cliente nuevo?",
        "¿Quién responde los mensajes, en cuánto tiempo y qué se les dice? Si tienes un mensaje o guion de respuesta, cópialo aquí.",
        "¿Cómo responden las personas interesadas? ¿Muchas solo preguntan el precio y dejan de contestar? Más o menos, ¿cuántas de cada 10 se quedan sin respuesta? ¿Qué haces cuando alguien pregunta y no vuelve a escribir?",
        "¿Cada cuánto les haces seguimiento a las personas interesadas que no compraron, y cómo (mensaje de WhatsApp, llamada, audio, promoción, ninguno)?",
        "¿Cómo llevas el registro de tus clientes y de las personas interesadas (cuaderno, Excel, etiquetas de WhatsApp Business, otro sistema)?",
      ],
    },
    {
      titulo: "Publicidad",
      preguntas: [
        "¿Cuánto puedes invertir al mes en publicidad (aparte del pago a la agencia)? ¿Quién recarga el saldo, con qué medio de pago y cada cuánto?",
        "En tu experiencia, ¿qué publicidad te ha funcionado y cuál no? ¿Quién manejaba antes tus anuncios?",
        "¿Tienes cuenta publicitaria y portafolio comercial en Meta? ¿Nos autorizas a agregar a biwov_ como socia para manejar los anuncios sin usar tu sesión personal?",
      ],
    },
    {
      titulo: "Marca, grabación y agenda",
      preguntas: [
        "¿Tienes logo, colores y tipografías oficiales (archivos originales)?",
        "¿Qué días y en qué horarios de la semana se puede grabar el contenido? ¿Quién aparecerá en los videos?",
        "¿Qué días y en qué horarios tienes disponibilidad en la semana para nuestras reuniones de seguimiento? Danos dos o tres opciones.",
        "¿Tienes fotos, videos o testimonios de clientes que podamos usar? ¿Hay clientes contentos a quienes les podamos pedir una reseña?",
        "¿Hay temas o cosas que NO quieres mostrar en tus redes? ¿Qué temas te gusta explicar y te salen naturales?",
      ],
    },
  ],
};

/** Documento propio (con análisis a la medida) si el prospecto ya lo tiene. */
export const documentosPorProspecto = (prospectoId: string) =>
  DOCUMENTOS_CLIENTES.find((d) => d.prospectoId === prospectoId);
