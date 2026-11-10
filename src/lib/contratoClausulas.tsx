import type { ReactNode } from "react";
import Link from "next/link";
import type { TipoContrato } from "@/lib/contrato";
import { PLANES, DURACION_MINIMA_MESES } from "@/data/planes";
import { NIVELES_PRODUCCION, PRODUCCION_CONTENIDO, PRODUCCION_UGC, PRODUCCION_VIDEO } from "@/data/addOns";
import { COMPLEMENTOS } from "@/data/complementos";

export interface SeccionContrato {
  titulo: string;
  contenido: ReactNode;
}

const NOMBRE_SERVICIO: Record<TipoContrato, string> = {
  plan: "un plan de biwov (Esencial, Crecimiento o Escala)",
  "sitio-web": "un sitio web o landing page",
  produccion: "un servicio de producción de contenido o video",
  "campana-meta": "la gestión de una campaña publicitaria en Meta",
};

export function seccionPartesYObjeto(tipo: TipoContrato): SeccionContrato[] {
  const objeto: Record<TipoContrato, ReactNode> = {
    plan: (
      <p>
        biwov prestará al Cliente los servicios correspondientes al plan seleccionado (Esencial,
        Crecimiento o Escala), según el alcance, módulos e inversión detallados en la cotización o
        propuesta aceptada por el Cliente, la cual forma parte integral de este contrato.
      </p>
    ),
    "sitio-web": (
      <p>
        biwov desarrollará para el Cliente el sitio web o landing page contratado (landing page de
        1 página, sitio de 5 páginas, sitio de 10 páginas y/o la conexión por API a la campaña
        publicitaria, según lo indicado en la cotización aceptada), incluyendo diseño, maquetación,
        publicación y configuración de hosting y dominio según el alcance contratado.
      </p>
    ),
    produccion: (
      <p>
        biwov prestará el servicio de producción de contenido o de grabación y edición de video
        contratado (nivel Start, Professional o Signature, o el paquete de videos sueltos), según
        el alcance, la cantidad de piezas y las especificaciones técnicas detalladas en la
        cotización aceptada por el Cliente.
      </p>
    ),
    "campana-meta": (
      <p>
        biwov prestará el servicio de gestión mensual de campaña publicitaria en Meta (montaje,
        seguimiento, optimización y reporte mensual), según el alcance detallado en la cotización
        aceptada por el Cliente.
      </p>
    ),
  };

  return [
    {
      titulo: "Partes",
      contenido: (
        <p>
          El presente contrato se celebra entre <strong>biwov</strong> (&quot;el Proveedor&quot;),
          agencia de marketing digital dedicada al diseño e implementación de soluciones digitales
          conectadas para negocios, y el cliente que acepta estos términos al momento de adquirir{" "}
          {NOMBRE_SERVICIO[tipo]} a través del sitio web de biwov (&quot;el Cliente&quot;).
        </p>
      ),
    },
    { titulo: "Objeto", contenido: objeto[tipo] },
  ];
}


const cop = (valor: number) => `$${valor.toLocaleString("es-CO")} COP`;

function Lista({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-2 list-disc space-y-1.5 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Bloque({ titulo, children }: { titulo: ReactNode; children: ReactNode }) {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 print:border-black/20">
      <h3 className="text-base font-semibold text-white">{titulo}</h3>
      {children}
    </div>
  );
}

function seccionAlcancePlanes(): SeccionContrato {
  return {
    titulo: "Alcance detallado de cada plan",
    contenido: (
      <>
        <p>
          El Cliente recibe lo que corresponde al plan que eligió. A continuación se detalla, plan
          por plan, todo lo que incluye. Lo que no aparezca en esta lista no hace parte del plan y
          se cotiza aparte.
        </p>
        {PLANES.map((plan) => (
          <Bloque
            key={plan.id}
            titulo={
              <>
                Plan {plan.nombre}: {cop(plan.precioDesde.cop)} al mes · montaje inicial{" "}
                {cop(plan.montajeInicial.cop)}
              </>
            }
          >
            <p className="mt-1 text-sm text-white/60">{plan.paraQuien}</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {plan.incluye.map((item) => (
                <li key={item.label}>
                  <strong className="font-semibold text-white">{item.label}</strong>
                  {item.subitems && (
                    <ul className="mt-1.5 list-[circle] space-y-1 pl-5">
                      {item.subitems.map((sub) => (
                        <li key={sub}>{sub}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm">
              Compromiso mínimo: {DURACION_MINIMA_MESES} meses. Inversión mínima del periodo:{" "}
              <strong>{cop(plan.precioDesde.cop * DURACION_MINIMA_MESES + plan.montajeInicial.cop)}</strong>{" "}
              ({DURACION_MINIMA_MESES} mensualidades más el montaje inicial).
            </p>
          </Bloque>
        ))}
        <Bloque titulo="Videos incluidos en los planes Crecimiento y Escala">
          <Lista
            items={[
              <>
                <strong>Plan Crecimiento:</strong> 8 videos y 2 imágenes de contenido al mes, en 3
                jornadas de grabación de 4 horas.
              </>,
              <>
                <strong>Plan Escala:</strong> 12 videos y 2 imágenes de contenido al mes, en 4
                jornadas de grabación de 4 horas.
              </>,
              PRODUCCION_VIDEO.reglaJornada,
              "Los videos se graban con equipo profesional (cámara, audio e iluminación), se editan con corrección de color y se entregan en formato vertical, listos para publicar.",
              "Las ideas y los guiones de los videos salen del plan de trabajo semanal del plan.",
              "Las jornadas se agendan con el Cliente; si necesita cambiar la fecha, debe avisar con mínimo 48 horas de anticipación.",
              "Si el Cliente necesita más videos en el mes, puede sumar 4 videos adicionales por $900.000 COP.",
              "Las jornadas de producción completas (Start, Professional y Signature) no hacen parte de los planes y se cotizan aparte.",
            ]}
          />
        </Bloque>
        <Bloque titulo="Lo que no incluye ningún plan">
          <Lista
            items={[
              "La inversión en pauta publicitaria, que el Cliente paga directamente a Meta.",
              "El costo de los mensajes por la API de WhatsApp y de los correos masivos.",
              "Las suscripciones de herramientas de IA o de otras plataformas de pago que se usen.",
              "En el Plan Escala, la suscripción de GoHighLevel (aprox. USD $33 al mes), que paga el Cliente.",
              "Un sitio web completo de varias páginas: los planes incluyen páginas de una sola pantalla (landing pages).",
              "La renovación del dominio a partir del segundo año.",
            ]}
          />
        </Bloque>
      </>
    ),
  };
}

function seccionAlcanceSitioWeb(): SeccionContrato {
  const web = COMPLEMENTOS.find((c) => c.titulo === "Páginas web y sitios web adicionales");
  return {
    titulo: "Alcance detallado del servicio",
    contenido: (
      <>
        <p>
          El Cliente recibe la opción que eligió en su cotización. Estas son las opciones y lo que
          incluye cada una:
        </p>
        <Bloque titulo={`Landing page (1 página): ${cop(1129000)}`}>
          <Lista
            items={[
              "Una sola pantalla enfocada en una acción puntual: que la persona escriba, agende una cita o deje sus datos.",
              "Diseño, maquetación y publicación de la página.",
              "Hosting y dominio incluidos durante el primer año.",
              "No incluye conexión por API a la campaña publicitaria (se puede sumar como add-on).",
            ]}
          />
        </Bloque>
        <Bloque titulo={`Sitio web de 5 páginas: ${cop(1799000)}`}>
          <Lista
            items={[
              "Hasta 5 páginas internas (por ejemplo: inicio, nosotros, servicios, blog o portafolio y contacto).",
              "Diseño, maquetación y publicación del sitio.",
              "Hosting y dominio incluidos durante el primer año.",
            ]}
          />
        </Bloque>
        <Bloque titulo={`Sitio web de 10 páginas: ${cop(2499000)}`}>
          <Lista
            items={[
              "Hasta 10 páginas internas, según la estructura acordada con el Cliente.",
              "Diseño, maquetación y publicación del sitio.",
              "Hosting y dominio incluidos durante el primer año.",
            ]}
          />
        </Bloque>
        <Bloque titulo={`Conexión por API a la campaña publicitaria (add-on): ${cop(350000)}`}>
          <Lista
            items={[
              "Integración técnica para pasar los datos de las personas que llegan por la página a la campaña.",
              "Se suma a cualquiera de las opciones anteriores.",
              "No incluye el montaje completo de GoHighLevel ni la gestión de la campaña.",
            ]}
          />
        </Bloque>
        {web?.nota && <p className="mt-4 text-sm text-white/70">{web.nota}</p>}
        <p className="mt-3 text-sm">
          Los textos, imágenes, logos y demás contenido del sitio los entrega el Cliente, salvo que
          se haya cotizado aparte la producción de ese contenido.
        </p>
      </>
    ),
  };
}

function seccionAlcanceProduccion(): SeccionContrato {
  return {
    titulo: "Alcance detallado del servicio",
    contenido: (
      <>
        <p>
          El Cliente recibe el servicio que eligió en su cotización. Estas son las opciones y lo
          que incluye cada una:
        </p>
        {NIVELES_PRODUCCION.map((nivel) => (
          <Bloque key={nivel.id} titulo={`Producción de contenido ${nivel.nombre}: ${cop(nivel.precio.cop)}`}>
            <Lista
              items={[
                `${nivel.fotografias} fotografías profesionales editadas`,
                `${nivel.reels} reels (videos verticales) editados y listos para publicar`,
                `${nivel.clipsBRoll} clips de B-Roll (videos de apoyo)`,
                `Tiempo de producción: ${nivel.tiempoProduccion}`,
                `Dirección creativa: ${nivel.direccionCreativa.toLowerCase()}`,
                `Cámara: ${nivel.camara} · Audio: ${nivel.audio}`,
                `Iluminación: ${nivel.iluminacion} · Estabilización: ${nivel.estabilizacion}`,
                `Drone: ${nivel.drone.toLowerCase()}`,
              ]}
            />
          </Bloque>
        ))}
        <Bloque titulo="Todos los niveles de producción incluyen">
          <Lista items={PRODUCCION_CONTENIDO.incluye} />
        </Bloque>
        <Bloque titulo="Grabación y edición de video">
          <p className="mt-1 text-sm text-white/70">{PRODUCCION_VIDEO.descripcion}</p>
          <Lista
            items={PRODUCCION_VIDEO.paquetes.map((p) => {
              const jornadas = Math.ceil(p.cantidadVideos / 3);
              return (
                <>
                  <strong>{p.nombre ?? `${p.cantidadVideos} videos`}:</strong> {cop(p.precio)}
                  {p.esMensual ? " al mes" : ""} · {jornadas} jornada{jornadas === 1 ? "" : "s"} de
                  4 horas · {cop(Math.round(p.precio / p.cantidadVideos))} por video
                </>
              );
            })}
          />
          <p className="mt-3 text-sm">Cada paquete incluye:</p>
          <Lista items={[...PRODUCCION_VIDEO.incluye, PRODUCCION_VIDEO.reglaJornada]} />
          <p className="mt-3 text-sm">
            No incluye guiones, copys ni dirección creativa (están en los niveles de producción de
            contenido).
          </p>
        </Bloque>
        <Bloque titulo="Videos estilo UGC">
          <p className="mt-1 text-sm text-white/70">{PRODUCCION_UGC.descripcion}</p>
          <Lista
            items={PRODUCCION_UGC.paquetes.map((p) => (
              <>
                <strong>{p.nombre}:</strong> {cop(p.precio)} ·{" "}
                {cop(Math.round(p.precio / p.cantidadVideos))} por video
              </>
            ))}
          />
          <p className="mt-3 text-sm">Cada paquete incluye:</p>
          <Lista items={PRODUCCION_UGC.incluye} />
        </Bloque>
        <Bloque titulo="Lo que no incluye ningún servicio de producción">
          <Lista items={PRODUCCION_CONTENIDO.noIncluye} />
        </Bloque>
      </>
    ),
  };
}

function seccionAlcanceCampanaMeta(): SeccionContrato {
  return {
    titulo: "Alcance detallado del servicio",
    contenido: (
      <>
        <Bloque titulo={`Gestión mensual de campaña en Meta: ${cop(400000)} al mes`}>
          <Lista
            items={[
              "Montaje de la campaña en Meta (Facebook e Instagram): estructura, públicos y anuncios.",
              "Seguimiento y optimización de la campaña durante el mes.",
              "Análisis de resultados.",
              "Informe mensual de resultados.",
            ]}
          />
        </Bloque>
        <Bloque titulo="Requisitos y condiciones">
          <Lista
            items={[
              "Para arrancar, el Cliente entrega mínimo 6 piezas creativas (videos o imágenes).",
              "Permanencia mínima de 3 meses.",
              "El Cliente da acceso a su cuenta publicitaria y a su página de Facebook e Instagram.",
            ]}
          />
        </Bloque>
        <Bloque titulo="No incluye">
          <Lista
            items={[
              "La inversión en pauta publicitaria, que el Cliente paga directamente a Meta.",
              "La creación de las piezas creativas (se pueden cotizar aparte en producción de contenido).",
              "Páginas web o landing pages (se cotizan aparte).",
            ]}
          />
        </Bloque>
      </>
    ),
  };
}

export function seccionesPlan(): SeccionContrato[] {
  return [
    seccionAlcancePlanes(),
    {
      titulo: "Inversión, forma de pago y duración mínima",
      contenido: (
        <>
          <p>
            El valor del servicio corresponde al indicado en la propuesta aceptada por el Cliente.
            Los planes tienen un <strong>compromiso mínimo de 6 meses</strong>, por ser el tiempo
            real que toma ver resultados consistentes. El montaje inicial puede pagarse en 2 cuotas
            iguales, sin recargo, cuando el Cliente lo solicite: una al iniciar y otra al segundo
            mes.
          </p>
          <p className="mt-3">
            Sobre el pago inicial: en Colombia no existe una ley que obligue a cobrar un porcentaje
            específico por adelantado en contratos de prestación de servicios entre particulares —
            eso se define libremente entre las partes. Lo que sí aplica es el{" "}
            <strong>derecho de retracto</strong> de la Ley 1480 de 2011 (Estatuto del Consumidor)
            para ventas por internet, explicado más adelante. El incumplimiento en el pago de dos
            (2) mensualidades consecutivas faculta a biwov para suspender los servicios hasta
            normalizar la cartera.
          </p>
          <p className="mt-3 text-xs text-text-secondary">
            Valores netos. Si el Cliente es agente retenedor, la retención en la fuente se asume
            sobre el valor pactado.
          </p>
        </>
      ),
    },
    {
      titulo: "Montaje inicial, herramienta de trabajo y dominio",
      contenido: (
        <>
          <p>Para el Plan Escala, el montaje inicial tiene un costo de $3.800.000 COP e incluye:</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              El dominio web del Cliente durante el <strong>primer año</strong>. A partir del
              segundo año, la renovación del dominio corre por cuenta del Cliente.
            </li>
            <li>
              La configuración de GoHighLevel (GHL) como herramienta de trabajo, incluyendo 2
              flujos de correo electrónico, 2 flujos de mensajería masiva por WhatsApp, y la
              verificación de la cuenta de WhatsApp Business.
            </li>
          </ul>
          <p className="mt-3">
            <strong>
              Las herramientas de trabajo del Plan Escala corren por cuenta del Cliente y no están
              incluidas en la mensualidad de biwov.
            </strong>{" "}
            Esto incluye la suscripción de GoHighLevel, el costo de los mensajes enviados por la API de
            WhatsApp, el envío de correos masivos y cualquier otra plataforma de pago que se use para
            operar el sistema. El Cliente las paga directamente a cada proveedor.
          </p>
          <p className="mt-3">
            La suscripción mensual de GHL tiene un costo aproximado de <strong>USD $33 al mes</strong>,
            que el Cliente paga directamente al proveedor de la herramienta. Este valor es una
            referencia y puede variar según la tasa de cambio y los ajustes de precio que haga GHL;
            no depende de biwov. Enviar mensajes masivos adicionales por WhatsApp o correo, por
            encima de los flujos incluidos, y cualquier otra automatización fuera de lo descrito
            aquí, tiene un costo aparte que asume el Cliente.
          </p>
        </>
      ),
    },
    {
      titulo: "Plataformas, pauta publicitaria y mensajería (Meta y correo)",
      contenido: (
        <p>
          Los costos de pauta publicitaria en Meta (Facebook/Instagram), el envío de mensajes por
          WhatsApp Business Platform y el envío de correos masivos <strong>no están incluidos</strong>{" "}
          en los planes de biwov y corren por cuenta del Cliente, pagados directamente a Meta y a
          los proveedores correspondientes. Meta cobra el envío de mensajes de WhatsApp por
          categoría de conversación (marketing, utilidad, autenticación o servicio) y por país de
          destino, con tarifas que Meta puede actualizar en cualquier momento; biwov no tiene
          control sobre esas tarifas y solo da los lineamientos de uso de la plataforma. Es
          responsabilidad del Cliente mantener su cuenta de Meta/WhatsApp Business al día con las
          políticas vigentes de Meta.
        </p>
      ),
    },
    {
      titulo: "Herramientas de inteligencia artificial",
      contenido: (
        <p>
          Cuando biwov recomiende el uso de alguna herramienta de inteligencia artificial para
          optimizar los procesos del Cliente, la suscripción o el costo de dicha herramienta corre
          por cuenta del Cliente. biwov da la guía de implementación, pero la herramienta en sí no
          está incluida en el valor del plan.
        </p>
      ),
    },
    {
      titulo: "Proceso de trabajo",
      contenido: (
        <p>
          La prestación del servicio sigue el proceso de biwov: diagnóstico, diseño del plan,
          implementación, automatización y escalamiento. Los tiempos de entrega se acuerdan en el
          diagnóstico inicial y dependen de la entrega oportuna de información, accesos e insumos
          por parte del Cliente.
        </p>
      ),
    },
    seccionAccesoCuentas(),
    {
      titulo: "Landing pages del Plan Escala",
      contenido: (
        <p>
          El Plan Escala incluye la opción de trabajar hasta 3 landing pages distintas dentro de
          una misma campaña publicitaria, para identificar cuál rinde mejor y optimizarlas sobre la
          marcha. El costo se mantiene dentro del plan mientras se trabajen con GHL; si el flujo de
          alguna landing page requiere una herramienta adicional que no esté cubierta por GHL, ese
          costo aparte corre por cuenta del Cliente.
        </p>
      ),
    },
    {
      titulo: "Contenido audiovisual",
      contenido: (
        <p>
          Las jornadas de grabación y producción de contenido se cotizan según los niveles vigentes
          (Start, Professional, Signature) publicados en el sitio de biwov. Todo pedido de piezas
          individuales está sujeto a un monto mínimo de orden de $150.000 COP.
        </p>
      ),
    },
    {
      titulo: "Cancelación y terminación por falta de respuesta",
      contenido: (
        <>
          <p>
            Cualquiera de las partes puede terminar el contrato con treinta (30) días de aviso
            previo por escrito. Los servicios y entregables ya ejecutados a la fecha de terminación
            serán facturados en proporción al avance realizado.
          </p>
          <p className="mt-3">
            Si biwov está ejecutando el trabajo contratado y el Cliente no responde ni entrega el
            material o la información que se le ha solicitado (accesos, contenido, aprobaciones,
            etc.), biwov enviará un requerimiento escrito otorgando un plazo final de 5 a 8 días
            hábiles para recibir respuesta. Vencido ese plazo sin respuesta, y habiendo transcurrido
            en total más de <strong>un (1) mes calendario</strong> sin respuesta del Cliente, biwov
            podrá dar por terminado el contrato. En ese caso, no procede devolución del dinero ya
            pagado, dado que la falta de respuesta del Cliente impidió continuar con la ejecución
            del servicio ya iniciado.
          </p>
        </>
      ),
    },
    {
      titulo: "Derecho de retracto y devoluciones",
      contenido: (
        <>
          <p>
            Al tratarse de una venta por internet, aplica el derecho de retracto de la Ley 1480 de
            2011 (Estatuto del Consumidor): el Cliente puede desistir de la compra dentro de los
            cinco (5) días hábiles siguientes a la aceptación del plan, sin tener que justificar su
            decisión, y biwov reintegrará las sumas pagadas sin descuentos.
          </p>
          <p className="mt-3">
            Esta posibilidad aplica mientras el servicio todavía no ha comenzado a ejecutarse. Una
            vez biwov empieza el diagnóstico, el montaje o cualquier trabajo del plan con el
            consentimiento del Cliente, el retracto ya no cubre el valor del trabajo efectivamente
            realizado hasta ese momento, el cual se factura en proporción al avance. Fuera de este
            plazo y de lo indicado en la sección de cancelación, no hay devoluciones de dinero.
          </p>
          {notaNoAsesoriaLegal}
        </>
      ),
    },
  ];
}

function seccionAccesoCuentas(): SeccionContrato {
  return {
    titulo: "Acceso a cuentas del Cliente",
    contenido: (
      <p>
        Para ejecutar el trabajo, el Cliente debe entregar a biwov la información y los accesos
        necesarios a sus cuentas (Facebook, Instagram, WhatsApp Business, correo, dominio, etc.).
        Sin estos accesos, biwov no puede realizar el trabajo contratado. biwov, representada
        legalmente por Katherine Usma Aristizábal, se compromete a usar esta información
        únicamente para la ejecución del servicio, a no compartir ni divulgar las contraseñas o
        credenciales recibidas, y a tratar los datos personales conforme a la{" "}
        <Link href="/politica-datos" className="text-accent underline hover:text-white">
          política de tratamiento de datos
        </Link>
        .
      </p>
    ),
  };
}

const notaNoAsesoriaLegal = (
  <p className="mt-3 text-xs text-text-secondary">
    Esta sección resume la ley vigente de forma general y no reemplaza una asesoría legal; se
    recomienda que un abogado la revise antes de hacerla exigible a los clientes.
  </p>
);

function seccionEntregaInsumos(): SeccionContrato {
  return {
    titulo: "Entrega de insumos por el Cliente",
    contenido: (
      <p>
        El Cliente dispondrá de un plazo máximo de <strong>15 días calendario</strong> a partir de
        la firma de este contrato para entregar la totalidad de los insumos necesarios (textos,
        imágenes, accesos, aprobaciones y demás información requerida). De no recibirse a tiempo,
        el proyecto entrará en estado de suspensión conforme a lo indicado en la sección de
        abandono del Cliente.
      </p>
    ),
  };
}

function seccionFormaPagoUnico(detalle?: ReactNode): SeccionContrato {
  return {
    titulo: "Forma de pago",
    contenido: (
      <>
        <p>
          El valor del servicio se paga en dos partes: <strong>50% por anticipado</strong>, al
          confirmar el pedido, y <strong>50% contra entrega</strong> del trabajo terminado. Al
          tratarse de un servicio puntual (no recurrente), no aplica mensualidad ni compromiso de
          permanencia.
        </p>
        {detalle}
        <p className="mt-3 text-xs text-text-secondary">
          Valores netos. Si el Cliente es agente retenedor, la retención en la fuente se asume
          sobre el valor pactado.
        </p>
      </>
    ),
  };
}

function seccionRetractoYAbandonoUnico(): SeccionContrato[] {
  return [
    {
      titulo: "Derecho de retracto y devoluciones",
      contenido: (
        <>
          <p>
            Al tratarse de una venta por internet, aplica el derecho de retracto de la Ley 1480 de
            2011 (Estatuto del Consumidor): si el trabajo <strong>todavía no ha comenzado</strong>,
            el Cliente puede desistir de la compra dentro de los cinco (5) días hábiles siguientes
            al pago del anticipo, sin tener que justificar su decisión; biwov reintegrará el valor
            pagado en un plazo máximo de 30 días calendario.
          </p>
          <p className="mt-3">
            Una vez biwov inicia la ejecución del servicio (diseño de estructura, wireframes,
            configuración, grabación, edición u otro trabajo concreto) con el consentimiento del
            Cliente, el anticipo del 50% <strong>no es reembolsable</strong>: cubre la reserva de
            agenda, la planeación y el trabajo ya ejecutado, conforme al carácter recíproco de las
            obligaciones contractuales (Art. 1609 del Código Civil).
          </p>
          {notaNoAsesoriaLegal}
        </>
      ),
    },
    {
      titulo: "Abandono del Cliente y cierre del proyecto",
      contenido: (
        <>
          <p>
            Si transcurren entre 15 y 30 días calendario sin que el Cliente entregue los insumos
            pendientes o responda a lo solicitado, biwov enviará un requerimiento escrito (por
            correo o WhatsApp) otorgando un plazo final de 5 a 8 días hábiles para recibir
            respuesta.
          </p>
          <p className="mt-3">
            Vencido ese plazo sin respuesta, el proyecto pasará a estado{" "}
            <strong>suspendido / cancelado por inactividad del Cliente</strong>. El anticipo del
            50% ya pagado se toma como indemnización por la reserva de agenda, la planeación y los
            hitos iniciales trabajados, sin derecho a reembolso.
          </p>
          <p className="mt-3">
            Si el Cliente decide retomar el proyecto más adelante, su reactivación quedará sujeta
            al pago de una tarifa adicional equivalente al <strong>15%–20%</strong> del valor total
            del contrato, además de las tarifas vigentes de biwov en ese momento.
          </p>
        </>
      ),
    },
  ];
}

export function seccionesSitioWeb(): SeccionContrato[] {
  return [
    seccionAlcanceSitioWeb(),
    seccionFormaPagoUnico(),
    {
      titulo: "Dominio y hosting",
      contenido: (
        <p>
          El dominio y el hosting del sitio web están incluidos durante el{" "}
          <strong>primer año</strong>. A partir del segundo año, la renovación de ambos corre por
          cuenta del Cliente; biwov avisará con anticipación antes del vencimiento para que el
          Cliente gestione la renovación y el sitio no quede fuera de línea.
        </p>
      ),
    },
    seccionEntregaInsumos(),
    seccionAccesoCuentas(),
    ...seccionRetractoYAbandonoUnico(),
    {
      titulo: "Cancelación",
      contenido: (
        <p>
          Fuera de lo indicado en el derecho de retracto y en el abandono del Cliente, cualquiera
          de las partes puede terminar este contrato con treinta (30) días de aviso previo por
          escrito. El trabajo ya ejecutado a la fecha de terminación se factura en proporción al
          avance realizado.
        </p>
      ),
    },
  ];
}

export function seccionesProduccion(): SeccionContrato[] {
  return [
    seccionAlcanceProduccion(),
    seccionFormaPagoUnico(
      <p className="mt-3">
        Todo pedido está sujeto a un monto mínimo de orden de $150.000 COP. La fecha de la jornada
        de grabación se agenda con el Cliente; si el Cliente necesita cambiarla, debe avisar con un
        mínimo de 48 horas de anticipación.
      </p>,
    ),
    seccionEntregaInsumos(),
    seccionAccesoCuentas(),
    ...seccionRetractoYAbandonoUnico(),
    {
      titulo: "Cancelación",
      contenido: (
        <p>
          Fuera de lo indicado en el derecho de retracto y en el abandono del Cliente, cualquiera
          de las partes puede terminar este contrato con treinta (30) días de aviso previo por
          escrito. El trabajo ya ejecutado a la fecha de terminación se factura en proporción al
          avance realizado.
        </p>
      ),
    },
  ];
}

export function seccionesCampanaMeta(): SeccionContrato[] {
  return [
    seccionAlcanceCampanaMeta(),
    {
      titulo: "Inversión, forma de pago y permanencia",
      contenido: (
        <>
          <p>
            El valor de la gestión mensual corresponde al indicado en la propuesta aceptada por el
            Cliente. Para iniciar, el Cliente debe entregar un mínimo de 6 piezas creativas (videos
            o imágenes); la permanencia mínima del servicio es de <strong>3 meses</strong>. El
            incumplimiento en el pago de dos (2) mensualidades consecutivas faculta a biwov para
            suspender el servicio hasta normalizar la cartera.
          </p>
          <p className="mt-3 text-xs text-text-secondary">
            Valores netos. Si el Cliente es agente retenedor, la retención en la fuente se asume
            sobre el valor pactado.
          </p>
        </>
      ),
    },
    {
      titulo: "Inversión en pauta publicitaria",
      contenido: (
        <p>
          La inversión en pauta publicitaria en Meta <strong>no está incluida</strong> en el valor
          de la gestión y la paga el Cliente directamente a Meta. Meta puede actualizar sus tarifas
          en cualquier momento; biwov no tiene control sobre ellas y solo da los lineamientos de
          uso de la plataforma.
        </p>
      ),
    },
    seccionAccesoCuentas(),
    {
      titulo: "Cancelación y terminación por falta de respuesta",
      contenido: (
        <>
          <p>
            Cualquiera de las partes puede terminar el contrato con treinta (30) días de aviso
            previo por escrito, una vez cumplida la permanencia mínima de 3 meses. Los servicios ya
            ejecutados a la fecha de terminación se facturan en proporción al avance realizado.
          </p>
          <p className="mt-3">
            Si el Cliente no responde ni entrega el material solicitado (piezas creativas, accesos,
            aprobaciones) por más de un (1) mes calendario, biwov podrá suspender o dar por
            terminado el contrato sin devolución del dinero ya pagado por la gestión del mes en
            curso.
          </p>
        </>
      ),
    },
    {
      titulo: "Derecho de retracto",
      contenido: (
        <>
          <p>
            El Cliente puede desistir del servicio dentro de los cinco (5) días hábiles siguientes
            a la aceptación, siempre que biwov aún no haya iniciado el montaje de la campaña del
            primer mes; en ese caso se reintegra el valor pagado. Una vez iniciado el montaje, el
            valor del mes en curso no es reembolsable.
          </p>
          {notaNoAsesoriaLegal}
        </>
      ),
    },
  ];
}

export function seccionesComunesFinal(): SeccionContrato[] {
  return [
    {
      titulo: "Propiedad intelectual y uso del trabajo en el portafolio de biwov",
      contenido: (
        <>
          <p>
            Los entregables finales (piezas gráficas, contenido, sitio web) serán propiedad del
            Cliente una vez se realice el pago completo acordado.
          </p>
          <p className="mt-3">
            biwov conserva el derecho de usar el trabajo realizado para el Cliente — incluyendo
            videos, piezas gráficas, capturas de pantalla de lo implementado y resultados obtenidos
            — en su publicidad y en sus redes sociales (biwov y Kathe Digital), con el fin de
            mostrar trabajos realizados, armar portafolio y compartir testimonios e historial de
            resultados. Este uso se limita a lo que no revele información interna o confidencial
            del negocio del Cliente (cifras financieras, estrategias internas, datos de sus propios
            clientes, accesos o credenciales); cuando el contenido sí incluya información sensible,
            biwov la omite o la difumina antes de publicarla.
          </p>
          <p className="mt-3">
            Si el Cliente prefiere que su proyecto no se use con fines de portafolio o publicidad,
            debe indicarlo por escrito a biwov; en ese caso no se publicará.
          </p>
        </>
      ),
    },
    {
      titulo: "Confidencialidad",
      contenido: (
        <p>
          Ambas partes se comprometen a mantener confidencial la información comercial, técnica y
          de negocio compartida durante la ejecución del contrato, y a no divulgarla a terceros sin
          autorización previa por escrito. Esto incluye, de parte de biwov, las contraseñas,
          accesos y credenciales que el Cliente le entregue para ejecutar el servicio.
        </p>
      ),
    },
    {
      titulo: "Limitación de responsabilidad",
      contenido: (
        <p>
          biwov actúa con la diligencia propia de su actividad profesional, dando los lineamientos,
          la estrategia y la ejecución técnica acordada; sin embargo,{" "}
          <strong>no garantiza resultados comerciales específicos</strong> (número exacto de
          clientes, ventas o ingresos), dado que estos dependen de factores externos al servicio
          prestado — entre ellos, que el Cliente o su equipo sepan atender, cerrar y hacer
          seguimiento a las personas interesadas que le llegan. biwov no es responsable por las
          ventas que el Cliente no concrete.
        </p>
      ),
    },
    {
      titulo: "Aceptación y firma digital",
      contenido: (
        <p>
          El Cliente acepta este contrato escribiendo su nombre completo, firmando con el dedo o el
          mouse en el recuadro de firma del formulario de compra, y marcando las casillas &quot;He
          leído y acepto el contrato&quot; y &quot;Autorizo el tratamiento de mis datos
          personales&quot; en el sitio web de biwov. Esta aceptación queda registrada
          digitalmente con la fecha, la hora, los datos del Cliente, la imagen de la firma y la
          versión de este contrato vigente al momento de la aceptación, como firma electrónica
          válida conforme a la Ley 527 de 1999.
        </p>
      ),
    },
  ];
}
