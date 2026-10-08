import { GlassCard } from "@/components/ui/GlassCard";
import { ETAPAS_SEGUIMIENTO } from "@/lib/panel/seguimiento";
import { CopiarMensajeEnganche } from "@/components/panel/CopiarMensajeEnganche";
import { CopyLinkButton } from "@/components/panel/CopyLinkButton";
import { BloqueMensajeCopiable } from "@/components/panel/BloqueMensajeCopiable";

const PASOS_CIERRE = [
  {
    numero: 1,
    titulo: "Agenda primero, con día y hora fijos",
    detalle:
      'Cuando alguien muestre interés, agenda la reunión en ese mismo momento — no mandes el formulario todavía. Ofrece dos opciones de horario ("¿martes a las 10 o jueves a las 3?"): se responde en una palabra. "¿Cuándo puedes?" abre una conversación eterna y ahí se pierde la gente.',
  },
  {
    numero: 2,
    titulo: "El formulario, como preparación para la reunión",
    detalle:
      'Apenas quede agendada la cita, manda el formulario con una fecha límite real: "Para llegar con tu plan listo, llénalo antes de la reunión." Así la reunión ya existe aunque el formulario no llegue, y el formulario tiene un motivo claro para responderlo ya.',
  },
];

export default function GuiaPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Guía rápida del embudo</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Del primer contacto a la venta cerrada: flujo, tiempos y mensajes. Llegar a la reunión con
        el análisis hecho y un plan listo te pone como experta, no como cotizadora.
      </p>

      <GlassCard className="mt-6 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
          Link para enviar manualmente
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Si alguien te escribe por fuera del sitio (WhatsApp, Instagram, correo), copia este link
          y mándaselo: al abrirlo le aparece el formulario del diagnóstico gratis de una vez, sin
          que tenga que buscar el botón.
        </p>
        <div className="mt-3">
          <CopyLinkButton path="/?diagnostico=1" label="Copiar link del diagnóstico gratis" />
        </div>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
          La corrección principal
        </span>
        <h2 className="mt-4 text-lg font-semibold text-white">Primero la fecha, después el formulario</h2>
        <p className="mt-2 text-sm text-text-secondary">
          El error que cuesta ventas es mandar el formulario antes de agendar: sin fecha se vuelve
          una tarea pendiente, y el empresario ocupado no hace tareas pendientes.
        </p>

        <div className="mt-4 space-y-4">
          {PASOS_CIERRE.map((paso) => (
            <div key={paso.numero} className="flex gap-4 rounded-xl bg-white/[0.03] p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-sm font-semibold text-white">
                {paso.numero}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">{paso.titulo}</h3>
                <p className="mt-1 text-sm text-text-secondary">{paso.detalle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-border-glass pt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Mensaje para el enganche inicial
          </p>
          <CopiarMensajeEnganche />
        </div>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <span className="rounded-full border border-border-glass bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Etapa 0
        </span>
        <h2 className="mt-4 text-lg font-semibold text-white">Tu base de contactos fríos</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Son los contactos con los que nunca has hablado. A ellos no les mandas propuesta ni
          formulario: les mandas una sola pregunta para reactivarlos. Hoy funciona lo corto,
          personal y por WhatsApp — las cadenas largas de presentación ya no funcionan.
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          Antes de enviar, divide la base en grupos según lo que sabes de cada uno (sector y si ya
          factura) y personaliza la primera línea. Un audio de 20 segundos con su nombre multiplica
          las respuestas frente al texto plano, sobre todo en Colombia.
        </p>

        <div className="mt-4 space-y-3">
          <BloqueMensajeCopiable
            titulo="Mensaje de reactivación (sin link, sin vender)"
            mensaje="Hola [nombre], ¿cómo estás? Te escribo rápido: ¿sigues buscando que tu negocio venda más sin tener que estar tú en todo?"
          />
          <BloqueMensajeCopiable
            titulo="Si no responde, a los 7 días (una sola vez más, con valor)"
            mensaje="Vi esto y pensé en tu negocio."
          />
        </div>
        <p className="mt-3 text-xs text-text-secondary">
          Al que responde &ldquo;sí&rdquo;, lo pasas a la Etapa 1. Al que sigue sin responder, lo
          dejas en tu lista de contenido y no le escribes más.
        </p>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <span className="rounded-full border border-border-glass bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Etapa 1
        </span>
        <h2 className="mt-4 text-lg font-semibold text-white">Dijo que sí, pero no agenda o no llena el formulario</h2>
        <p className="mt-2 text-sm text-text-secondary">Regla de seguimiento con límite:</p>

        <div className="mt-4 space-y-3">
          <BloqueMensajeCopiable
            titulo="A las 24 horas"
            mensaje="Hola [nombre], te dejo de nuevo los horarios por si se te pasó: martes 10am o jueves 3pm. ¿Cuál te sirve?"
          />
          <BloqueMensajeCopiable
            titulo="A las 72 horas"
            mensaje="[Nombre], sé que andas a mil. Si ahora no es el momento, no pasa nada, me dices y lo retomamos más adelante. Si sí, respóndeme solo con el día que te sirve."
          />
          <BloqueMensajeCopiable
            titulo="A los 7 días: cierre amable (el que más respuestas genera)"
            mensaje="Voy a cerrar tu solicitud por ahora para no llenarte de mensajes. Cuando quieras retomarlo, aquí estoy. 🤍"
          />
          <BloqueMensajeCopiable
            titulo="Si agendó pero no llenó el formulario (24h antes de la reunión)"
            mensaje="Mañana nos vemos 🙌 Si alcanzas, llena esto: [link]. Si no, tranquilo, lo vemos en la llamada."
          />
        </div>
        <p className="mt-3 text-xs text-text-secondary">
          Ese último mensaje de cierre amable solo funciona si de verdad cierras. Y si agendó pero
          no llenó el formulario, no cancelas la reunión por eso: haces el diagnóstico en vivo.
        </p>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <span className="rounded-full border border-border-glass bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Etapa 2
        </span>
        <h2 className="mt-4 text-lg font-semibold text-white">Confirmación para reducir el &ldquo;no show&rdquo;</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-text-secondary">
          <li>• Al agendar: confirmación con fecha, hora y link.</li>
          <li>• 24 horas antes: el recordatorio de la Etapa 1.</li>
          <li>• 1 hora antes: el mensaje de abajo, que genera curiosidad — la mejor razón para que aparezca.</li>
        </ul>
        <div className="mt-4">
          <BloqueMensajeCopiable
            titulo="1 hora antes"
            mensaje="Nos vemos en una hora. Ya revisé tu información y tengo cosas interesantes para mostrarte."
          />
        </div>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
          Etapa 3 — reunión de entrega de propuesta / cierre en vivo
        </span>
        <h2 className="mt-4 text-lg font-semibold text-white">La reunión, donde se cierra</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Antes de entrar: haz una radiografía rápida del formulario (20-30 min) y prepara 2 o 3
          hallazgos clave. No abras presentando el plan: si presentas de una, la persona no llegó
          sola a la conclusión y el plan se siente impuesto. Primero confirma lo que leíste.
        </p>

        <div className="mt-4 space-y-3">
          {[
            { t: "1. Conexión", d: "3 minutos." },
            {
              t: "2. Confirmar",
              d: '10 minutos. "Vi que tu mayor reto es X y que te gustaría Y. ¿Sigue siendo así? Cuéntame un poco más." Aquí van la pregunta de la lámpara y la de consecuencia: "¿Y qué pasa si esto sigue igual un año más?"',
            },
            {
              t: "3. Las fugas de dinero",
              d: "Si puedes, calcula en voz alta lo que pierde hoy en seguimiento. Ese número vende más que cualquier paquete.",
            },
            { t: "4. El río y el puente", d: "" },
            {
              t: "5. Presentar el plan",
              d: 'Comparte pantalla con lo que ya preparaste y conecta cada entregable con algo que la persona dijo: "Esto es porque me dijiste que…".',
            },
            {
              t: "6. Rango de inversión en voz alta y luego silencio",
              d: "No rellenes el silencio. Quien habla primero después del precio, pierde.",
            },
            {
              t: "7. Cierre directo",
              d: '"¿Sientes que esto te puede dar resultado? Si estás de acuerdo, arrancamos el lunes. Te mando el link de pago o la reserva ahora mismo."',
            },
          ].map((paso) => (
            <div key={paso.t} className="rounded-xl bg-white/[0.03] p-4">
              <h3 className="text-sm font-semibold text-white">{paso.t}</h3>
              {paso.d && <p className="mt-1 text-sm text-text-secondary">{paso.d}</p>}
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-border-glass pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Para cerrar ahí mismo, ten listo antes de entrar a la llamada:
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-text-secondary">
            <li>• El link de pago o los datos de transferencia.</li>
            <li>• Un pago de reserva para quien necesita unos días, que se descuenta del total.</li>
            <li>• Una fecha de inicio concreta.</li>
            <li>
              • Un beneficio real por decidir ese día (un entregable adicional o fecha de inicio
              prioritaria). Tiene que ser real; si no lo es, no se usa.
            </li>
          </ul>
        </div>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <span className="rounded-full border border-border-glass bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Etapa 4
        </span>
        <h2 className="mt-4 text-lg font-semibold text-white">Si no cerró en la llamada</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Nunca termines con &ldquo;te mando la propuesta y me cuentas&rdquo;: esa frase lleva
          directo al silencio. Termina siempre con un próximo paso que tenga fecha. La pregunta
          &ldquo;¿qué necesitas para decidir?&rdquo; te dice cuál es la objeción real antes de colgar.
        </p>
        <div className="mt-4">
          <BloqueMensajeCopiable
            titulo="Cierre de la llamada sin decisión"
            mensaje="Perfecto, entiendo que lo quieres revisar. ¿Qué necesitas para tomar la decisión? … Listo, te envío la propuesta hoy y hablamos el jueves a las 10 por 15 minutos para resolver dudas. ¿Te parece?"
          />
        </div>

        <div className="mt-5 border-t border-border-glass pt-5">
          <p className="text-sm font-semibold text-white">
            Seguimiento después de enviar la propuesta (vigencia de 7 días):
          </p>
          <div className="mt-3 space-y-3">
            <BloqueMensajeCopiable
              titulo="Día 0 — junto con la propuesta: un video corto (Loom, 2 min) recorriéndola"
              mensaje="Te comparto tu propuesta y un video corto recorriéndola para que quede todo claro: [link propuesta] / [link Loom]."
            />
            <BloqueMensajeCopiable
              titulo="Día 2 — valor, no presión"
              mensaje="Pensando en tu negocio vi esto: [idea concreta o caso]. Es justo lo que haríamos en el mes 1."
            />
            <BloqueMensajeCopiable
              titulo="Día 5"
              mensaje="[Nombre], la propuesta está vigente hasta el [fecha]. ¿Te quedó alguna duda que pueda resolverte?"
            />
            <BloqueMensajeCopiable
              titulo="Día 8 — cierre"
              mensaje="Como no alcanzamos a hablar, doy por cerrada esta propuesta. Si más adelante quieres retomarlo, lo revisamos de nuevo con gusto."
            />
          </div>
          <p className="mt-3 text-xs text-text-secondary">
            Después de eso, la persona pasa a la lista de nutrición: comunidad, contenido y un
            recontacto a los 60-90 días. Nada de perseguir.
          </p>
        </div>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <span className="rounded-full border border-border-glass bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Etapa 5
        </span>
        <h2 className="mt-4 text-lg font-semibold text-white">Cuando dice &ldquo;no me es factible&rdquo;</h2>
        <p className="mt-2 text-sm text-text-secondary">
          No saltes directo a la asesoría de US$97. &ldquo;No me es factible&rdquo; puede significar
          tres cosas distintas, y cada una tiene una respuesta diferente. Primero pregunta:
        </p>
        <div className="mt-3">
          <BloqueMensajeCopiable
            titulo="Para diagnosticar la objeción real"
            mensaje="Te agradezco la sinceridad. Para entenderte bien: ¿es por el monto, por el momento, o porque no estás segura de que te vaya a funcionar?"
          />
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-white/[0.03] p-4">
            <h3 className="text-sm font-semibold text-white">Si es por el monto</h3>
            <p className="mt-1 text-sm text-text-secondary">
              No bajes el precio, reduce el alcance por fases: &ldquo;Empecemos solo con [la pieza
              que más dinero le deja] y cuando eso esté dando resultado sumamos lo demás.&rdquo;
              Bajar el precio del mismo paquete le enseña al cliente que tus precios son
              negociables. Ofrecer menos por menos, no.
            </p>
          </div>
          <div className="rounded-xl bg-white/[0.03] p-4">
            <h3 className="text-sm font-semibold text-white">Si es por el momento</h3>
            <p className="mt-1 text-sm text-text-secondary">
              &ldquo;¿Cuándo sería un buen momento?&rdquo; Agenda ese recontacto con fecha y
              cúmplelo.
            </p>
          </div>
          <div className="rounded-xl bg-white/[0.03] p-4">
            <h3 className="text-sm font-semibold text-white">Si es por confianza</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Es lo más común y nadie lo dice. Responde con prueba (un caso de cliente, un antes y
              un después) y con la garantía de proceso que tengas. Nunca se garantizan ventas.
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-border-glass pt-5">
          <p className="text-sm font-semibold text-white">
            La asesoría de US$97, como downsell bien pensado (plan B, no premio de consolación):
          </p>
          <ul className="mt-2 space-y-2 text-sm text-text-secondary">
            <li>
              1. Preséntala como el primer paso: &ldquo;Si hoy no es el momento del paquete
              completo, hay un primer paso: una sesión de 90 minutos donde salimos con tu plan de
              trabajo para que arranques tú.&rdquo;
            </li>
            <li>
              2. Abónala al paquete: &ldquo;Si en los próximos 30 días decides tomar el plan
              completo, los US$97 se descuentan.&rdquo; Así se vuelve la puerta de entrada al
              high-ticket, no un techo.
            </li>
            <li>3. Ponle precio en COP para Colombia — se define por mercado, no por conversión directa.</li>
          </ul>
        </div>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <h2 className="text-lg font-semibold text-white">Lo que debes medir desde ya</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Cada semana: cuántos interesados llegan, cuántos agendan, cuántos asisten, cuántos
          cierran en la llamada y cuántos cierran en el seguimiento. Con un mes de datos sabrás
          exactamente dónde se va la plata — casi siempre el problema está entre &ldquo;agendó&rdquo;
          y &ldquo;asistió&rdquo;, o entre &ldquo;propuesta enviada&rdquo; y silencio, y no en que
          falten prospectos.
        </p>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <h2 className="text-lg font-semibold text-white">
          Protocolo operativo de seguimiento post-propuesta (el que marcas en el panel)
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Esta es la secuencia simplificada que ves y marcas en &ldquo;Alerta / etapa de
          seguimiento&rdquo; en cada prospecto — la versión con timers de la Etapa 4 de arriba.
        </p>
        <div className="mt-4 space-y-3">
          {ETAPAS_SEGUIMIENTO.map((etapa) => (
            <div key={etapa.nombre} className="rounded-xl bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{etapa.nombre}</h3>
                <span className="text-xs font-medium text-accent">{etapa.plazo}</span>
              </div>
              <dl className="mt-2 space-y-1 text-xs text-text-secondary">
                <p>
                  <span className="font-medium text-white/80">Objetivo:</span> {etapa.objetivo}
                </p>
                <p>
                  <span className="font-medium text-white/80">Canal:</span> {etapa.canal}
                </p>
                <p>
                  <span className="font-medium text-white/80">Enfoque:</span> {etapa.enfoque}
                </p>
              </dl>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
