/**
 * Artículos del blog de biwov. Cada artículo está escrito para SEO (Google) y
 * GEO (buscadores de IA como ChatGPT, Perplexity, Gemini o Google AI
 * Overviews): respuesta corta al inicio, encabezados en forma de pregunta,
 * listas concretas y preguntas frecuentes que se publican como FAQPage.
 *
 * Para agregar un artículo nuevo basta con sumar un objeto a ARTICULOS: la
 * página, el sitemap, el RSS y llms.txt lo toman solos.
 */

export type CategoriaBlog =
  | "Estrategia"
  | "WhatsApp y ventas"
  | "Publicidad"
  | "Páginas web"
  | "SEO y GEO"
  | "Automatización"
  | "Contenido";

export interface SeccionArticulo {
  titulo: string;
  parrafos: string[];
  lista?: string[];
}

export interface PreguntaArticulo {
  pregunta: string;
  respuesta: string;
}

export interface Articulo {
  slug: string;
  titulo: string;
  /** Meta descripción (≈150 caracteres). */
  descripcion: string;
  categoria: CategoriaBlog;
  /** Fecha ISO de publicación. */
  publicado: string;
  actualizado: string;
  minutosLectura: number;
  imagen: string;
  imagenAlt: string;
  palabrasClave: string[];
  /** Respuesta directa de 2–3 frases: es lo que suelen citar los buscadores de IA. */
  enResumen: string;
  secciones: SeccionArticulo[];
  preguntas: PreguntaArticulo[];
}

export const AUTOR_BLOG = {
  nombre: "Katherine Usma Aristizábal",
  cargo: "Fundadora de biwov_ · Implementadora de ecosistemas digitales",
  url: "https://biwov.com/kathe",
  imagen: "/kathe-fundadora.png",
};

export const ARTICULOS: Articulo[] = [
  {
    slug: "que-es-un-ecosistema-digital",
    titulo: "Qué es un ecosistema digital y por qué tu negocio lo necesita",
    descripcion:
      "Un ecosistema digital conecta redes, publicidad, WhatsApp, página web y CRM para que tu negocio atraiga, venda y haga seguimiento sin depender de ti.",
    categoria: "Estrategia",
    publicado: "2026-11-08",
    actualizado: "2026-11-08",
    minutosLectura: 6,
    imagen: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=70",
    imagenAlt: "Tablero digital con métricas de un negocio conectado",
    palabrasClave: [
      "ecosistema digital",
      "marketing digital para negocios",
      "transformación digital pymes",
      "embudo de ventas",
    ],
    enResumen:
      "Un ecosistema digital es el conjunto de herramientas de un negocio (redes sociales, publicidad, WhatsApp, página web, CRM y automatizaciones) conectadas entre sí para llevar a una persona desde que te descubre hasta que te compra. Lo necesitas cuando publicas y pautas, pero los interesados se pierden en el camino.",
    secciones: [
      {
        titulo: "¿Qué es exactamente un ecosistema digital?",
        parrafos: [
          "Es la forma en que todas las piezas digitales de tu negocio trabajan juntas. No se trata de tener muchas herramientas, sino de que cada una le pase la información a la siguiente: el contenido atrae, la publicidad amplía, la página web convierte, WhatsApp conversa y el CRM recuerda a cada cliente.",
          "Cuando esas piezas funcionan sueltas pasa lo típico: publicas todos los días, te escriben, respondes tarde, no sabes quién compró ni por qué, y el mes siguiente empiezas de cero.",
        ],
      },
      {
        titulo: "¿Qué piezas lo componen?",
        parrafos: ["Un ecosistema básico para un negocio pequeño o mediano tiene seis piezas:"],
        lista: [
          "Contenido en redes sociales: hace que te conozcan y te recuerden.",
          "Publicidad en Meta (Facebook e Instagram): lleva tu mensaje a la gente correcta.",
          "Página web o landing page: convierte visitas en contactos.",
          "WhatsApp Business: donde ocurre la conversación de venta.",
          "CRM: la lista organizada de tus clientes con su etapa de compra.",
          "Automatizaciones e inteligencia artificial: responden, filtran y hacen seguimiento sin que estés presente.",
        ],
      },
      {
        titulo: "¿Cómo saber si tu negocio necesita uno?",
        parrafos: ["Estas señales indican que tus herramientas están desconectadas:"],
        lista: [
          "Te escriben por WhatsApp y no alcanzas a responder a todos a tiempo.",
          "Pagas publicidad pero no sabes cuántas ventas trajo.",
          "No tienes una lista de clientes con su historial.",
          "Tu página web existe, pero nadie te contacta desde ella.",
          "Todo depende de que tú estés pendiente.",
        ],
      },
      {
        titulo: "¿Por dónde empezar?",
        parrafos: [
          "No hace falta montarlo todo el mismo mes. El orden que mejor funciona es: primero un diagnóstico de lo que ya tienes, luego ordenar WhatsApp y el contenido, después activar la publicidad con una página que convierta y, por último, automatizar el seguimiento.",
          "En biwov trabajamos así con planes mensuales por etapas (Esencial, Crecimiento y Escala), para que cada pieza nueva se sume a lo que ya funciona.",
        ],
      },
    ],
    preguntas: [
      {
        pregunta: "¿Un ecosistema digital es solo para empresas grandes?",
        respuesta:
          "No. Los negocios pequeños son los que más lo necesitan, porque el dueño suele hacerlo todo. Un ecosistema sencillo con WhatsApp ordenado, contenido con objetivo y una campaña bien medida ya marca la diferencia.",
      },
      {
        pregunta: "¿Cuánto tiempo toma montarlo?",
        respuesta:
          "Depende de lo que ya tengas. Lo habitual es ver la base funcionando en el primer mes y los resultados más estables entre el tercer y el sexto mes, cuando ya hay datos para optimizar.",
      },
      {
        pregunta: "¿Qué diferencia hay entre un ecosistema digital y una agencia de redes?",
        respuesta:
          "Una agencia de redes suele encargarse de publicar contenido. Un ecosistema digital conecta ese contenido con la publicidad, la página web, WhatsApp y el CRM para que el interés termine en ventas medibles.",
      },
    ],
  },
  {
    slug: "como-vender-por-whatsapp-business",
    titulo: "Cómo vender más por WhatsApp Business: guía práctica paso a paso",
    descripcion:
      "Guía práctica para ordenar tu WhatsApp Business: catálogo, etiquetas, respuestas rápidas, seguimiento y asistentes con IA para no perder clientes.",
    categoria: "WhatsApp y ventas",
    publicado: "2026-11-08",
    actualizado: "2026-11-08",
    minutosLectura: 7,
    imagen: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1600&q=70",
    imagenAlt: "Celular con conversaciones de WhatsApp Business",
    palabrasClave: [
      "WhatsApp Business",
      "vender por WhatsApp",
      "etiquetas WhatsApp Business",
      "chatbot WhatsApp",
    ],
    enResumen:
      "Para vender más por WhatsApp Business necesitas un perfil completo, un catálogo actualizado, etiquetas para clasificar a cada contacto según su etapa, respuestas rápidas para las preguntas frecuentes y un seguimiento a quienes no compraron. Cuando el volumen crece, un asistente con IA filtra a los curiosos y te pasa a los interesados.",
    secciones: [
      {
        titulo: "1. Completa tu perfil de empresa",
        parrafos: [
          "Es lo primero que ve un cliente nuevo. Incluye foto o logo nítido, descripción clara de lo que vendes, horario de atención, dirección o ciudad, correo y enlace a tu página web o tienda.",
        ],
      },
      {
        titulo: "2. Arma el catálogo con tus productos o servicios",
        parrafos: [
          "El catálogo evita la pregunta “¿qué precio tiene?” repetida cien veces. Pon foto, nombre, precio (o “desde”), descripción corta y enlace. Mantenlo actualizado: un precio viejo genera desconfianza.",
        ],
      },
      {
        titulo: "3. Usa etiquetas para saber en qué va cada cliente",
        parrafos: ["Las etiquetas son tu CRM básico dentro de WhatsApp. Una estructura sencilla que funciona:"],
        lista: [
          "Nuevo interesado",
          "Cotización enviada",
          "Pendiente de pago",
          "Cliente (ya compró)",
          "Seguimiento (no respondió)",
        ],
      },
      {
        titulo: "4. Configura respuestas rápidas y mensajes automáticos",
        parrafos: [
          "Crea respuestas rápidas para precios, medios de pago, envíos y horarios. Activa el mensaje de bienvenida y el de ausencia para que nadie se quede sin respuesta fuera de tu horario.",
        ],
      },
      {
        titulo: "5. Haz seguimiento a quienes no compraron",
        parrafos: [
          "La mayoría de las ventas no se cierran en el primer mensaje. Revisa cada semana la etiqueta “Seguimiento” y escribe con un motivo concreto: una duda que quedó abierta, una novedad o una fecha límite real.",
        ],
      },
      {
        titulo: "6. Cuándo dar el paso a un asistente con IA",
        parrafos: [
          "Si recibes más mensajes de los que puedes atender, o respondes lo mismo todo el día, es momento de un asistente con inteligencia artificial conectado a la API de WhatsApp. Responde al instante, hace las preguntas de filtro y te pasa solo a las personas listas para comprar, con su información ya organizada en el CRM.",
        ],
      },
    ],
    preguntas: [
      {
        pregunta: "¿Cuál es la diferencia entre WhatsApp Business y la API de WhatsApp?",
        respuesta:
          "WhatsApp Business es la app gratuita para atender desde el celular. La API de WhatsApp permite conectar el número a un CRM, a varios asesores y a asistentes con IA; Meta cobra por conversación según la categoría y el país.",
      },
      {
        pregunta: "¿Un chatbot reemplaza la atención humana?",
        respuesta:
          "No debería. Lo ideal es que el asistente resuelva lo repetitivo y filtre, y que una persona cierre la venta con quienes ya mostraron intención de compra.",
      },
      {
        pregunta: "¿Cada cuánto debo hacer seguimiento a un cliente?",
        respuesta:
          "Una referencia práctica es un primer seguimiento a las 24–48 horas y otro a la semana, siempre con un motivo útil para el cliente y sin insistir de forma invasiva.",
      },
    ],
  },
  {
    slug: "campanas-meta-ads-negocios-pequenos",
    titulo: "Campañas en Meta Ads para negocios pequeños: cómo empezar y cuánto invertir",
    descripcion:
      "Cómo montar tu primera campaña en Facebook e Instagram Ads: objetivo, público, creativos, presupuesto de referencia y qué medir para no perder dinero.",
    categoria: "Publicidad",
    publicado: "2026-11-08",
    actualizado: "2026-11-08",
    minutosLectura: 8,
    imagen: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=70",
    imagenAlt: "Equipo revisando resultados de una campaña publicitaria",
    palabrasClave: [
      "Meta Ads",
      "publicidad en Facebook e Instagram",
      "cuánto invertir en Meta Ads",
      "campañas para pymes",
    ],
    enResumen:
      "Para empezar en Meta Ads define un solo objetivo (mensajes, clientes potenciales o ventas), prepara varias piezas creativas, conecta el píxel o la API de conversiones y arranca con un presupuesto que puedas sostener al menos tres meses. Como referencia para Colombia, una inversión desde unos $500.000 COP al mes permite reunir datos para optimizar.",
    secciones: [
      {
        titulo: "¿Qué objetivo elegir en tu primera campaña?",
        parrafos: [
          "Elige según dónde se cierra tu venta. Si vendes conversando, usa el objetivo de mensajes hacia WhatsApp. Si necesitas datos para llamar o agendar, usa clientes potenciales con una landing page. Si tienes tienda virtual con el píxel bien instalado, usa ventas.",
          "Evita mezclar objetivos en una misma campaña: Meta optimiza para lo que le pides.",
        ],
      },
      {
        titulo: "¿Cuántos creativos necesito?",
        parrafos: [
          "Más de uno. Los algoritmos actuales de Meta encuentran el público a partir del creativo, así que conviene probar varias piezas con ángulos distintos: un video mostrando el producto, un testimonio, una pieza que responda una objeción y una oferta clara. En biwov pedimos mínimo seis piezas para arrancar una campaña.",
        ],
      },
      {
        titulo: "¿Cuánto debo invertir?",
        parrafos: [
          "No hay una cifra mágica, pero sí una regla: el presupuesto tiene que permitir que la campaña salga de la fase de aprendizaje y que puedas sostenerlo varios meses. Como punto de partida en Colombia, desde unos $500.000 COP al mes en pauta, pagados directamente a Meta.",
          "Antes de subir el presupuesto, calcula cuánto puedes pagar como máximo por cliente (tu costo por adquisición) según el margen de lo que vendes.",
        ],
      },
      {
        titulo: "¿Qué medir para saber si funciona?",
        parrafos: ["Mira estos indicadores en orden:"],
        lista: [
          "Costo por resultado (mensaje, registro o compra).",
          "Tasa de respuesta y de cierre en WhatsApp o en tu CRM.",
          "Costo por cliente real, no solo por clic.",
          "Retorno sobre la inversión publicitaria (ventas ÷ inversión).",
        ],
      },
      {
        titulo: "Errores comunes que hacen perder dinero",
        parrafos: [],
        lista: [
          "Usar el botón “Promocionar” sin estrategia ni medición.",
          "Cambiar la campaña todos los días antes de que tenga datos.",
          "Llevar tráfico a un perfil o página que no invita a escribir.",
          "No responder rápido a quienes escriben desde el anuncio.",
        ],
      },
    ],
    preguntas: [
      {
        pregunta: "¿Es mejor el botón Promocionar o el Administrador de anuncios?",
        respuesta:
          "El Administrador de anuncios. Te deja elegir el objetivo correcto, segmentar, probar varios creativos y medir conversiones, cosas que el botón Promocionar limita.",
      },
      {
        pregunta: "¿Cuánto tarda una campaña en dar resultados?",
        respuesta:
          "Los primeros datos útiles aparecen en una o dos semanas. Para optimizar con criterio conviene darle al menos un mes, y planear tres meses para ver la tendencia real.",
      },
      {
        pregunta: "¿La gestión de la campaña incluye la inversión en pauta?",
        respuesta:
          "Normalmente no. La gestión es el trabajo de montar, optimizar y reportar; la inversión publicitaria se paga directamente a Meta con la tarjeta del negocio.",
      },
    ],
  },
  {
    slug: "landing-page-o-sitio-web",
    titulo: "Landing page o sitio web: cuál necesita tu negocio",
    descripcion:
      "Diferencias entre landing page y sitio web, cuándo conviene cada uno y qué debe tener una página para convertir visitas en clientes por WhatsApp.",
    categoria: "Páginas web",
    publicado: "2026-11-08",
    actualizado: "2026-11-08",
    minutosLectura: 6,
    imagen: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=70",
    imagenAlt: "Diseño de una página web en un computador portátil",
    palabrasClave: [
      "landing page",
      "diferencia entre landing page y sitio web",
      "página web para negocio",
      "página web que convierte",
    ],
    enResumen:
      "Una landing page es una sola página enfocada en una acción (escribir por WhatsApp, agendar o dejar datos) y es ideal para campañas pagas. Un sitio web tiene varias páginas y sirve para presentar toda la marca y posicionarse en Google. Muchos negocios empiezan con una landing para vender y luego crecen a un sitio completo.",
    secciones: [
      {
        titulo: "¿Qué es una landing page?",
        parrafos: [
          "Es una página de una sola pantalla larga, diseñada para una única acción. No tiene menú que distraiga: explica el problema, muestra la solución, da pruebas y termina en un botón claro. Por eso convierte mejor el tráfico que llega desde un anuncio.",
        ],
      },
      {
        titulo: "¿Qué es un sitio web?",
        parrafos: [
          "Es la casa digital completa de tu marca: inicio, servicios, quiénes somos, blog y contacto. Su fuerza está en la confianza y en el posicionamiento orgánico, porque cada página puede aparecer en Google para búsquedas distintas.",
        ],
      },
      {
        titulo: "¿Cuál te conviene?",
        parrafos: [],
        lista: [
          "Vas a pautar en Meta o Google para un servicio puntual: landing page.",
          "Quieres aparecer en Google con varios servicios: sitio web.",
          "Lanzas un curso, evento o promoción con fecha: landing page.",
          "Necesitas credibilidad para clientes corporativos: sitio web.",
        ],
      },
      {
        titulo: "¿Qué debe tener una página que convierte?",
        parrafos: [],
        lista: [
          "Un titular que diga qué resuelves y para quién.",
          "Un botón visible para escribir por WhatsApp o agendar.",
          "Pruebas reales: casos, testimonios, cifras verificables.",
          "Carga rápida en celular (la mayoría de visitas llegan desde ahí).",
          "Píxel de Meta y analítica para medir cada contacto.",
        ],
      },
      {
        titulo: "¿Cuánto cuesta?",
        parrafos: [
          "Como referencia, en biwov una landing page de una página arranca en $1.129.000 COP y un sitio de cinco páginas en $1.799.000 COP, ambos con hosting y dominio el primer año. Los precios actualizados están en la tienda.",
        ],
      },
    ],
    preguntas: [
      {
        pregunta: "¿Puedo usar mi perfil de Instagram en vez de una página web?",
        respuesta:
          "Sirve para empezar, pero no es tuyo: dependes del algoritmo y no puedes medir bien las conversiones. Una página propia te da control, datos y posicionamiento en Google.",
      },
      {
        pregunta: "¿Una landing page sirve para SEO?",
        respuesta:
          "Puede posicionar para una búsqueda muy concreta, pero un sitio con varias páginas y un blog tiene muchas más oportunidades de aparecer en Google y en los buscadores con IA.",
      },
      {
        pregunta: "¿Qué es la conexión por API con la campaña?",
        respuesta:
          "Es la integración técnica que envía los contactos de la página a la campaña o al CRM, para que Meta aprenda quién sí se convirtió y optimice mejor.",
      },
    ],
  },
  {
    slug: "seo-y-geo-buscadores-de-ia",
    titulo: "SEO y GEO: cómo aparecer en Google y en los buscadores de inteligencia artificial",
    descripcion:
      "Qué es el GEO (optimización para motores generativos), en qué se diferencia del SEO y qué hacer para que ChatGPT, Perplexity y Google te recomienden.",
    categoria: "SEO y GEO",
    publicado: "2026-11-08",
    actualizado: "2026-11-08",
    minutosLectura: 8,
    imagen: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=70",
    imagenAlt: "Representación de inteligencia artificial respondiendo búsquedas",
    palabrasClave: [
      "SEO",
      "GEO",
      "posicionamiento en buscadores de IA",
      "aparecer en ChatGPT",
      "Google AI Overviews",
    ],
    enResumen:
      "El SEO busca que tu página aparezca en los resultados de Google; el GEO (Generative Engine Optimization) busca que los buscadores con IA, como ChatGPT, Perplexity, Gemini o los resúmenes de Google, te citen en sus respuestas. Ambos se trabajan con contenido útil y claro, datos estructurados, autoría visible y una presencia de marca consistente en internet.",
    secciones: [
      {
        titulo: "¿Qué es el SEO?",
        parrafos: [
          "Es la optimización de tu sitio para que Google lo entienda y lo muestre cuando alguien busca lo que ofreces. Incluye aspectos técnicos (velocidad, versión móvil, sitemap), de contenido (responder lo que la gente busca) y de autoridad (que otros sitios te mencionen).",
        ],
      },
      {
        titulo: "¿Qué es el GEO y por qué importa ahora?",
        parrafos: [
          "Cada vez más personas preguntan directamente a una inteligencia artificial: “¿qué agencia me ayuda a vender por WhatsApp en Colombia?”. Esas herramientas leen la web y arman una respuesta citando fuentes. El GEO consiste en que tu negocio sea una de esas fuentes.",
          "La diferencia clave: en SEO compites por un puesto en una lista; en GEO compites por ser mencionado dentro de la respuesta.",
        ],
      },
      {
        titulo: "Qué hacer para aparecer en ambos",
        parrafos: [],
        lista: [
          "Responde la pregunta en las primeras líneas, de forma directa, y luego amplía.",
          "Usa títulos en forma de pregunta, como las busca la gente.",
          "Incluye listas, pasos y datos concretos que se puedan citar.",
          "Agrega preguntas frecuentes con datos estructurados (schema FAQPage).",
          "Muestra quién escribe: autor con nombre, cargo y experiencia real.",
          "Mantén el mismo nombre, ciudad y servicios de tu negocio en todas partes.",
          "Publica un archivo llms.txt que resuma tu negocio para los modelos de IA.",
          "Permite el acceso de los rastreadores de IA en tu robots.txt.",
        ],
      },
      {
        titulo: "Lo técnico que no puede faltar",
        parrafos: [
          "Sitio rápido y adaptable a celular, sitemap actualizado, URLs claras, etiquetas de título y descripción únicas por página, datos estructurados de organización, artículo y preguntas frecuentes, e imágenes con texto alternativo.",
        ],
      },
      {
        titulo: "¿Cuánto tarda en verse?",
        parrafos: [
          "El SEO es un trabajo de mediano plazo: lo normal es ver movimiento entre tres y seis meses de publicar contenido de forma constante. En los buscadores con IA el efecto puede ser más rápido cuando el contenido responde muy bien una pregunta concreta, pero tampoco hay garantías de aparición.",
        ],
      },
    ],
    preguntas: [
      {
        pregunta: "¿El GEO reemplaza al SEO?",
        respuesta:
          "No. Se complementan: los buscadores con IA suelen apoyarse en páginas que ya están bien posicionadas y bien estructuradas, así que un buen SEO es la base del GEO.",
      },
      {
        pregunta: "¿Qué es el archivo llms.txt?",
        respuesta:
          "Es un archivo de texto en la raíz del sitio que resume en lenguaje claro quién eres, qué ofreces y cuáles son tus páginas importantes, pensado para que los modelos de lenguaje lo lean con facilidad.",
      },
      {
        pregunta: "¿Puedo pagar para aparecer en ChatGPT?",
        respuesta:
          "No existe una forma de pagar para que un modelo de IA te recomiende en sus respuestas orgánicas. La vía es tener contenido útil, verificable y una marca consistente que esas herramientas consideren confiable.",
      },
    ],
  },
  {
    slug: "que-es-un-crm-y-cuando-lo-necesitas",
    titulo: "Qué es un CRM y cuándo lo necesita un negocio pequeño",
    descripcion:
      "Qué es un CRM, para qué sirve, señales de que tu negocio ya lo necesita y cómo conectarlo con WhatsApp y tus campañas para no perder clientes.",
    categoria: "Automatización",
    publicado: "2026-11-08",
    actualizado: "2026-11-08",
    minutosLectura: 6,
    imagen: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=70",
    imagenAlt: "Persona organizando clientes en un CRM",
    palabrasClave: [
      "qué es un CRM",
      "CRM para pymes",
      "CRM con WhatsApp",
      "embudo de ventas",
    ],
    enResumen:
      "Un CRM es un sistema que guarda a todos tus clientes y contactos, en qué etapa de compra va cada uno y qué conversaciones han tenido. Un negocio pequeño lo necesita cuando ya no puede recordar a quién le cotizó, a quién debe hacerle seguimiento o de dónde llegó cada venta.",
    secciones: [
      {
        titulo: "¿Para qué sirve un CRM?",
        parrafos: ["En la práctica, un CRM te ayuda a:"],
        lista: [
          "Tener a todos tus contactos en un solo lugar, no repartidos en chats y libretas.",
          "Ver en qué etapa va cada persona: nuevo, cotizado, pendiente de pago, cliente.",
          "Programar recordatorios y seguimientos automáticos.",
          "Saber de qué campaña o canal llegó cada cliente.",
          "Volver a venderle a quien ya te compró.",
        ],
      },
      {
        titulo: "Señales de que ya lo necesitas",
        parrafos: [],
        lista: [
          "Pierdes ventas porque olvidas responder o hacer seguimiento.",
          "Tienes más de una persona atendiendo el WhatsApp.",
          "Inviertes en publicidad y no sabes qué canal trae clientes.",
          "Tus clientes antiguos no vuelven a comprar.",
        ],
      },
      {
        titulo: "¿Cómo se conecta con WhatsApp y las campañas?",
        parrafos: [
          "Cuando alguien escribe desde un anuncio o llena un formulario, el CRM crea su ficha automáticamente con el origen. Desde ahí se disparan flujos: mensaje de bienvenida, recordatorio si no respondió, remarketing a quien no compró y campañas de recompra para clientes.",
          "Herramientas como GoHighLevel integran CRM, WhatsApp, correo y embudos en un solo lugar, lo que facilita que un negocio pequeño funcione como uno grande.",
        ],
      },
      {
        titulo: "¿Por dónde empezar?",
        parrafos: [
          "Antes de comprar una herramienta, define tus etapas de venta y qué pasa en cada una. Si aún no estás listo para un CRM, las etiquetas de WhatsApp Business son un primer paso para ordenar la información.",
        ],
      },
    ],
    preguntas: [
      {
        pregunta: "¿Puedo usar Excel como CRM?",
        respuesta:
          "Para empezar sí, pero se vuelve difícil de mantener: no se actualiza solo, no envía recordatorios y no se conecta con WhatsApp ni con tus campañas.",
      },
      {
        pregunta: "¿Cuánto cuesta un CRM?",
        respuesta:
          "Hay opciones gratuitas con funciones básicas y plataformas completas con suscripción mensual en dólares. El costo real depende de cuántos usuarios, contactos y automatizaciones necesites.",
      },
      {
        pregunta: "¿Qué es un flujo de seguimiento automático?",
        respuesta:
          "Es una secuencia de mensajes que se envía sola según lo que haga el cliente, por ejemplo un recordatorio por WhatsApp si no respondió en 24 horas o un correo de recompra a los 30 días.",
      },
    ],
  },
  {
    slug: "cuantos-videos-publicar-al-mes",
    titulo: "Cuántos videos publicar al mes y cómo planear tu contenido",
    descripcion:
      "Frecuencia recomendada de reels para un negocio, cómo planear el contenido del mes y cómo grabar varios videos en una sola jornada de producción.",
    categoria: "Contenido",
    publicado: "2026-11-08",
    actualizado: "2026-11-08",
    minutosLectura: 6,
    imagen: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=70",
    imagenAlt: "Edición de video para redes sociales",
    palabrasClave: [
      "cuántos videos publicar",
      "calendario de contenido",
      "reels para negocios",
      "producción de contenido",
    ],
    enResumen:
      "Para la mayoría de negocios, publicar entre 2 y 3 videos por semana (8 a 12 al mes) es una frecuencia sostenible que mantiene presencia sin sacrificar calidad. Lo más importante no es la cantidad sino la constancia y que cada video tenga un objetivo: atraer, generar confianza o vender.",
    secciones: [
      {
        titulo: "¿Cuántos videos al mes son suficientes?",
        parrafos: [
          "Depende de tu capacidad de producción, pero la constancia pesa más que el volumen. Un negocio que publica 8 videos bien pensados cada mes suele avanzar más que uno que publica 30 sin estrategia y luego desaparece.",
        ],
      },
      {
        titulo: "Los tres tipos de video que necesitas",
        parrafos: [],
        lista: [
          "Atracción: tips, errores comunes, tendencias de tu sector. Hacen que te descubran.",
          "Confianza: detrás de cámaras, casos, testimonios, tu proceso. Hacen que te crean.",
          "Venta: oferta, beneficios, respuesta a objeciones y llamado a escribir. Hacen que te compren.",
        ],
      },
      {
        titulo: "Cómo planear el mes en una hora",
        parrafos: [],
        lista: [
          "Define el objetivo comercial del mes (un producto, una fecha, una promoción).",
          "Escribe 8 a 12 ideas repartidas entre atracción, confianza y venta.",
          "Convierte cada idea en un guion corto: gancho, desarrollo y llamado a la acción.",
          "Agrupa los videos por locación y vestuario para grabarlos el mismo día.",
        ],
      },
      {
        titulo: "Grabar varios videos en una sola jornada",
        parrafos: [
          "La forma más eficiente es producir por bloques. Como referencia, una jornada de grabación de 4 horas rinde hasta 3 videos terminados con buena calidad, incluyendo cambios de plano y tomas de apoyo (B-Roll).",
          "En biwov ofrecemos paquetes de grabación y edición de 3, 6 y 8 videos al mes, o jornadas completas de producción con fotos, reels y B-Roll según el nivel.",
        ],
      },
    ],
    preguntas: [
      {
        pregunta: "¿Qué es el B-Roll?",
        respuesta:
          "Son las tomas de apoyo que acompañan la toma principal: el producto en detalle, manos trabajando, el lugar. Hacen que el video sea más dinámico y profesional.",
      },
      {
        pregunta: "¿Es mejor grabar con celular o con cámara?",
        respuesta:
          "Un celular reciente con buena luz y buen audio es suficiente para empezar. Una cámara con lentes y kit de iluminación eleva la calidad cuando la marca lo necesita.",
      },
      {
        pregunta: "¿Debo publicar el mismo video en Instagram y TikTok?",
        respuesta:
          "Puedes reutilizarlo, idealmente sin marcas de agua de otra plataforma y ajustando el texto y los primeros segundos al estilo de cada red.",
      },
    ],
  },
];

export function articuloPorSlug(slug: string): Articulo | undefined {
  return ARTICULOS.find((a) => a.slug === slug);
}

export function articulosOrdenados(): Articulo[] {
  return [...ARTICULOS].sort((a, b) => b.publicado.localeCompare(a.publicado));
}

export function formatoFechaBlog(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  return `${d} de ${meses[m - 1]} de ${y}`;
}

export function slugSeccion(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
