/**
 * Prompt fijo de Kathe para auditar manualmente un perfil de red social en
 * claude.ai (no pasa por la API, es solo para copiar y pegar). Los datos del
 * prospecto que ya tenemos se rellenan solos; el resto (red social, objetivo,
 * antigüedad, métricas) lo completa ella a mano según lo que vea en el perfil.
 */
export function construirPromptAuditoriaRedes({
  nombreProspecto,
  empresa,
  nichoMercado,
  redesSociales,
  linkRedesProspecto,
  queQuiereResolver,
}: {
  nombreProspecto: string;
  empresa: string | null;
  nichoMercado: string | null;
  redesSociales: string | null;
  linkRedesProspecto: string | null;
  queQuiereResolver: string | null;
}): string {
  const nombreCuenta = empresa || nombreProspecto;
  const enlace = linkRedesProspecto || redesSociales || "[@usuario o URL]";
  const nicho = nichoMercado || "[Nicho / industria]";
  const objetivo = queQuiereResolver || "[Objetivo comercial del canal]";

  return `Actúa como un Director de Marketing Digital Senior, Growth Marketer, Project Manager de Ecosistemas Digitales y Analista de Datos especializado en psicología del consumidor y neuromarketing.

Tu objetivo es realizar una **Auditoría y Diagnóstico Táctico-Estratégico 360°** de la siguiente red social / canal: [Insertar Red Social, e.g., Instagram / LinkedIn / YouTube].

---

### 1. DATOS DE CONTEXTO DE LA CUENTA A ANALIZAR
- **Nombre de la Cuenta / Marca:** ${nombreCuenta}
- **Enlace o Usuario:** ${enlace}
- **Nicho / Industria:** ${nicho}
- **Objetivo Comercial del Canal:** ${objetivo}
- **Antigüedad estimada:** [Fecha de creación aproximada o tiempo activo]
- **Métricas cuantitativas actuales (si se conocen o se estiman):**
  - Número de seguidores/suscriptores: [...]
  - Promedio de alcance / impresiones por publicación: [...]
  - Engagement rate estimado (interacciones/seguidores): [...]
  - Frecuencia de publicación actual: [...]

---

### 2. EJES DE EVALUACIÓN MILIMÉTRICA
Realiza un desglose detallado y crítico de los siguientes apartados:

#### A. Identidad Visual, Branding y Primera Impresión (Optimización de Perfil)
- **Foto de perfil / Isotipo:** ¿Transmite autoridad, claridad y encaja con la propuesta de valor a 1 segundo de vista?
- **Biografía (Bio) / Cabecera:** ¿Utiliza fórmula de copywriting de respuesta directa? Evalúa la claridad del gancho, la propuesta de valor y el Llamado a la Acción (CTA) con su respectivo enlace.
- **Coherencia Visual (Feed / Portadas / Elementos Gráficos):** Análisis de paleta de colores, tipografías, jerarquía visual y estilo estético (¿es un catálogo estéril, genera confianza o satura visualmente?).

#### B. Arquitectura de Contenidos y Comunicación (El Mensaje)
- **Claridad del Mensaje:** ¿El usuario entiende en menos de 3 segundos a qué se dedica la cuenta y por qué debería importarle?
- **Estrategia de Formatos:** Analiza cómo se trabajan los formatos principales de esta red (ej. Reels/Shorts vs. Carruseles vs. Posts estáticos / Videos largos vs. Newsletters/Posts de texto en LinkedIn).
- **Psicología y Neuromarketing:** Identifica qué sesgos cognitivos, puntos de dolor (*pain points*), deseos aspiracionales o activadores de urgencia/autoridad está utilizando (o dejando de usar) en sus copys y guiones.
- **Estrategia de Historias / Contenido Efímero / Interacción Diaria (si aplica):** ¿Hay secuencia narrativa (storytelling), puntos de contacto con la comunidad o venta encubierta?

#### C. Rendimiento, Algoritmo y Datos (Visión Analítica)
- **Lectura del Algoritmo:** Evalúa qué optimizaciones de retención, tiempo de visualización, guardados, compartidos o CTR exige el algoritmo actual de esta plataforma específica para este tipo de contenido.
- **Madurez de Funnel (Embudo):** ¿El contenido está diseñado puramente para *Top of Funnel* (atracción/masividad), *Middle of Funnel* (nutrición/autoridad) o *Bottom of Funnel* (conversión)? ¿Dónde hay un cuello de botella?
- **Estrategia Publicitaria (Tráfico Pago):** Basándote en la organicidad de la cuenta, señales visuales de pauta previa (anuncios activos en bibliotecas de anuncios si aplica) o estructura de crecimiento, deduce si ha implementado campañas de pauta publicitaria y qué tan dependiente es del tráfico orgánico.

---

### 3. FORMATO DE ENTREGA DEL DIAGNÓSTICO
Por favor, estructura tu respuesta final estrictamente bajo los siguientes apartados profesionales:

1. **Executive Summary (Diagnóstico Ejecutivo):** Calificación global del estado de la cuenta (de 1 a 10) y veredicto general en 3 líneas desde la perspectiva de un Project Manager.
2. **Matriz de Fortalezas (Lo Bueno) vs. Debilidades (Lo Malo):** Desglose en tabla o viñetas de lo que sí está funcionando y los errores críticos que están frenando el crecimiento.
3. **Análisis de Ventajas y Desventajas Competitivas:** Qué oportunidades del mercado está aprovechando la cuenta y cuáles está cediendo a su competencia directa.
4. **Auditoría Psicológica y de Comunicación:** Cómo percibe el cliente ideal (*buyer persona*) este perfil y qué fricciones mentales o barreras de confianza existen.
5. **Plan de Acción Táctico (Roadmap a 30-60-90 días):**
   - Acciones correctivas de carácter urgente (Quick wins).
   - Ajustes estructurales de branding y copy.
   - Recomendaciones técnicas para alinear el contenido con el algoritmo actual de la plataforma y el embudo de conversión.`;
}
