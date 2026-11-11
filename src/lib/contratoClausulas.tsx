import type { ReactNode } from "react";
import Link from "next/link";
import type { TipoContrato } from "@/lib/contrato";
import { PLANES, DURACION_MINIMA_MESES, type Plan } from "@/data/planes";
import { lineaPorId } from "@/data/lineas";
import { EXTRAS_COTIZABLES, type CategoriaExtra, type ExtraCotizable } from "@/data/extrasCotizables";

export interface SeccionContrato {
  titulo: string;
  contenido: ReactNode;
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

const notaNoAsesoriaLegal = (
  <p className="mt-3 text-xs text-text-secondary">
    Esta sección resume la ley vigente de forma general y no reemplaza una asesoría legal; se
    recomienda que un abogado la revise antes de hacerla exigible a los clientes.
  </p>
);

const notaValoresNetos = (
  <p className="mt-3 text-xs text-text-secondary">
    Los valores no incluyen IVA; cuando aplique, se discrimina en la factura. Si el Cliente es agente
    retenedor, la retención en la fuente se asume sobre el valor pactado.
  </p>
);

const NOMBRE_SERVICIO: Record<TipoContrato, string> = {
  plan: "un plan mensual de Dirección estratégica o de Gestión de marketing",
  "sitio-web": "un servicio de ecosistemas digitales (página web, landing page o embudo)",
  produccion: "un servicio de producción de contenido, edición o guía de grabación",
  "campana-meta": "la gestión de campañas publicitarias en Meta",
  automatizacion: "un servicio de automatización e inteligencia artificial",
};

/* ───────────────────────── Partes y objeto ───────────────────────── */

export function seccionPartesYObjeto(tipo: TipoContrato): SeccionContrato[] {
  const objeto: Record<TipoContrato, ReactNode> = {
    plan: (
      <>
        <p>
          biwov prestará al Cliente los servicios del plan mensual que eligió, según el alcance
          detallado en este contrato y en la propuesta aceptada. Los planes se dividen en dos líneas
          que tienen responsabilidades distintas:
        </p>
        <Lista
          items={[
            <>
              <strong>Dirección estratégica</strong> (&quot;{lineaPorId("direccion").etiqueta}&quot;):
              biwov piensa, orienta, enseña, revisa y acompaña; el Cliente o su equipo ejecutan
              (diseñan, graban, editan, publican y responden).
            </>,
            <>
              <strong>Gestión de marketing</strong> (&quot;{lineaPorId("gestion").etiqueta}&quot;):
              biwov planea, crea, diseña, edita, publica y mide las actividades contratadas, con el
              material de fotos y videos que entrega el Cliente.
            </>,
          ]}
        />
      </>
    ),
    "sitio-web": (
      <p>
        biwov desarrollará para el Cliente la solución de ecosistema digital contratada (landing page,
        sitio web, embudo de conversión o ecosistema comercial), incluyendo diseño, maquetación,
        integraciones y publicación, según el alcance detallado en este contrato y en la propuesta
        aceptada.
      </p>
    ),
    produccion: (
      <p>
        biwov prestará el servicio de producción audiovisual (Start, Professional o Signature), de
        edición de material suministrado por el Cliente o de guía de grabación contratado, según el
        alcance, cantidades y especificaciones detallados en este contrato y en la propuesta aceptada.
      </p>
    ),
    "campana-meta": (
      <p>
        biwov prestará el servicio de configuración y/o gestión mensual de campañas publicitarias en
        Meta (Facebook e Instagram) contratado, según el alcance detallado en este contrato y en la
        propuesta aceptada.
      </p>
    ),
    automatizacion: (
      <p>
        biwov implementará y, si el Cliente lo contrata, mantendrá u operará la solución de
        automatización contratada (WhatsApp y agentes de IA, email marketing, campañas masivas por
        WhatsApp o automatización de procesos), según el alcance detallado en este contrato y en la
        propuesta aceptada.
      </p>
    ),
  };

  return [
    {
      titulo: "Partes",
      contenido: (
        <p>
          El presente contrato se celebra entre <strong>biwov</strong> (&quot;el Proveedor&quot;),
          agencia de marketing digital dedicada a ayudar a las empresas a estructurar, ejecutar y
          automatizar su crecimiento digital, y el cliente que acepta estos términos al adquirir{" "}
          {NOMBRE_SERVICIO[tipo]} a través del sitio web de biwov (&quot;el Cliente&quot;).
        </p>
      ),
    },
    { titulo: "Objeto", contenido: objeto[tipo] },
  ];
}

/* ───────────────────────── Bloques de alcance reutilizables ───────────────────────── */

function BloquePlan({ plan }: { plan: Plan }) {
  return (
    <Bloque
      titulo={
        <>
          {plan.nombre}: {cop(plan.precioDesde.cop)} al mes
        </>
      }
    >
      <p className="mt-1 text-sm text-white/60">{plan.paraQuien}</p>
      <p className="mt-3 text-sm font-semibold text-white">Incluye:</p>
      <ul className="mt-2 list-disc space-y-2 pl-5">
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
      <p className="mt-3 text-sm font-semibold text-white">No incluye:</p>
      <Lista items={plan.noIncluye} />
      <p className="mt-3 text-sm">
        Compromiso mínimo: {DURACION_MINIMA_MESES} meses. Valor del periodo mínimo:{" "}
        <strong>{cop(plan.precioDesde.cop * DURACION_MINIMA_MESES)}</strong>.
      </p>
    </Bloque>
  );
}

function BloqueExtra({ item }: { item: ExtraCotizable }) {
  return (
    <Bloque
      titulo={
        <>
          {item.nombre}: {item.desde ? "desde " : ""}
          {cop(item.precioCop)}
          {item.periodicidad === "mensual" ? " al mes" : ""}
        </>
      }
    >
      {item.descripcion && <p className="mt-1 text-sm text-white/60">{item.descripcion}</p>}
      {item.incluye && item.incluye.length > 0 && (
        <>
          <p className="mt-3 text-sm font-semibold text-white">Incluye:</p>
          <Lista items={item.incluye} />
        </>
      )}
      {item.noIncluye && item.noIncluye.length > 0 && (
        <>
          <p className="mt-3 text-sm font-semibold text-white">No incluye:</p>
          <Lista items={item.noIncluye} />
        </>
      )}
      {item.nota && <p className="mt-3 text-sm">{item.nota}.</p>}
    </Bloque>
  );
}

function alcanceCategorias(categorias: CategoriaExtra[]): ReactNode {
  return categorias.map((cat) => (
    <div key={cat} className="mt-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">{cat}</h3>
      {EXTRAS_COTIZABLES.filter((e) => e.categoria === cat).map((e) => (
        <BloqueExtra key={e.id} item={e} />
      ))}
    </div>
  ));
}

const introAlcance = (
  <p>
    El Cliente recibe únicamente el servicio y la modalidad que eligió en su compra o propuesta. A
    continuación se detalla todo lo que incluye y no incluye cada opción. Lo que no aparezca aquí
    no hace parte del servicio y se cotiza aparte.
  </p>
);

/* ───────────────────────── Secciones comunes reutilizables ───────────────────────── */

function seccionAccesoCuentas(): SeccionContrato {
  return {
    titulo: "Acceso a cuentas del Cliente",
    contenido: (
      <p>
        Para ejecutar el trabajo, el Cliente debe entregar a biwov la información y los accesos
        necesarios a sus cuentas (Facebook, Instagram, WhatsApp Business, correo, dominio, CRM, etc.).
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

function seccionEntregaInsumos(): SeccionContrato {
  return {
    titulo: "Entrega de insumos por el Cliente",
    contenido: (
      <p>
        El Cliente dispondrá de un plazo máximo de <strong>15 días calendario</strong> a partir de
        la aceptación de este contrato para entregar los insumos necesarios (textos, imágenes,
        videos, accesos, bases de datos, aprobaciones y demás información requerida). De no
        recibirse a tiempo, el proyecto entrará en estado de suspensión conforme a la sección de
        abandono del Cliente, y los tiempos de entrega se correrán en la misma proporción.
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
          Los servicios de pago único (implementaciones, proyectos y producciones) se pagan en dos
          partes: <strong>50% por anticipado</strong>, al confirmar el pedido, y{" "}
          <strong>50% contra entrega</strong> del trabajo terminado. Las mensualidades opcionales
          (mantenimiento, soporte o gestión mensual) se pagan por anticipado dentro de los{" "}
          <strong>primeros 5 días de cada mes</strong>.
        </p>
        {detalle}
        {notaValoresNetos}
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
            Una vez biwov inicia la ejecución del servicio (planeación, diseño, configuración,
            grabación, edición u otro trabajo concreto) con el consentimiento del Cliente, el
            anticipo del 50% <strong>no es reembolsable</strong>: cubre la reserva de agenda, la
            planeación, los compromisos adquiridos con aliados y el trabajo ya ejecutado, conforme
            al carácter recíproco de las obligaciones contractuales (Art. 1609 del Código Civil).
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

function seccionCancelacionUnico(): SeccionContrato {
  return {
    titulo: "Cancelación",
    contenido: (
      <p>
        Fuera de lo indicado en el derecho de retracto y en el abandono del Cliente, cualquiera de
        las partes puede terminar este contrato con treinta (30) días de aviso previo por escrito.
        El trabajo ya ejecutado a la fecha de terminación se factura en proporción al avance
        realizado. Las mensualidades opcionales pueden cancelarse con el mismo aviso, sin
        devolución del mes en curso.
      </p>
    ),
  };
}

/* ───────────────────────── Planes mensuales ───────────────────────── */

export function seccionesPlan(): SeccionContrato[] {
  const direccion = PLANES.filter((p) => p.linea === "direccion");
  const gestion = PLANES.filter((p) => p.linea === "gestion");
  return [
    {
      titulo: "Alcance detallado de cada plan",
      contenido: (
        <>
          {introAlcance}
          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
              Línea 01 · Dirección estratégica: {lineaPorId("direccion").etiqueta}
            </h3>
            <p className="mt-2 text-sm">
              En estos planes el Cliente ejecuta las actividades. biwov entrega dirección,
              documentos, guías, revisiones y acompañamiento, con sesiones de transferencia de
              conocimiento y tareas.
            </p>
            {direccion.map((p) => (
              <BloquePlan key={p.id} plan={p} />
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
              Línea 02 · Gestión de marketing: {lineaPorId("gestion").etiqueta}
            </h3>
            <p className="mt-2 text-sm">
              En estos planes biwov ejecuta las actividades contratadas. El Cliente suministra los
              videos y las fotografías; biwov los adapta y edita. Los planes de gestión no incluyen
              grabaciones presenciales: si el Cliente las necesita, se suma un paquete de producción
              audiovisual.
            </p>
            {gestion.map((p) => (
              <BloquePlan key={p.id} plan={p} />
            ))}
          </div>
        </>
      ),
    },
    {
      titulo: "Inversión, forma de pago y duración mínima",
      contenido: (
        <>
          <p>
            Los planes mensuales tienen un <strong>compromiso mínimo de {DURACION_MINIMA_MESES} meses</strong>,
            el tiempo que se necesita para diagnosticar, implementar, medir y ajustar. La
            mensualidad se paga <strong>por anticipado dentro de los primeros 5 días de cada mes</strong>.
            Los planes no tienen montaje inicial.
          </p>
          <p className="mt-3">
            En Colombia no existe una ley que obligue a cobrar un porcentaje específico por
            adelantado en contratos de prestación de servicios entre particulares; eso se define
            libremente entre las partes. El incumplimiento en el pago de dos (2) mensualidades
            consecutivas faculta a biwov para suspender los servicios hasta normalizar la cartera.
          </p>
          {notaValoresNetos}
        </>
      ),
    },
    {
      titulo: "Adicionales que se pueden sumar a un plan",
      contenido: (
        <p>
          A cualquier plan se le pueden sumar, con su propio precio y condiciones: gestión de
          campañas en Meta, producción audiovisual, edición adicional, automatizaciones y páginas
          web. Cada adicional se rige por la sección de este contrato que le corresponde (ver los
          contratos de cada línea en el sitio de biwov).
        </p>
      ),
    },
    {
      titulo: "Plataformas, pauta y herramientas",
      contenido: (
        <p>
          La inversión en pauta publicitaria en Meta, las licencias de plataformas (programadores de
          contenido, herramientas de diseño o de IA de pago, CRM) y cualquier otra herramienta de
          terceros <strong>no están incluidas</strong> en los planes y corren por cuenta del Cliente,
          pagadas directamente a cada proveedor. Cuando biwov recomiende una herramienta, da la guía
          de uso, pero la suscripción la paga el Cliente.
        </p>
      ),
    },
    seccionAccesoCuentas(),
    {
      titulo: "Cancelación y terminación por falta de respuesta",
      contenido: (
        <>
          <p>
            Cumplido el compromiso mínimo, cualquiera de las partes puede terminar el contrato con
            treinta (30) días de aviso previo por escrito. Los servicios ya ejecutados a la fecha de
            terminación serán facturados en proporción al avance realizado.
          </p>
          <p className="mt-3">
            Si el Cliente no responde ni entrega el material o la información solicitada (accesos,
            contenido, aprobaciones, etc.), biwov enviará un requerimiento escrito otorgando un
            plazo final de 5 a 8 días hábiles. Vencido ese plazo, y habiendo transcurrido en total
            más de <strong>un (1) mes calendario</strong> sin respuesta, biwov podrá dar por
            terminado el contrato, sin devolución del dinero ya pagado.
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
            vez biwov empieza el diagnóstico o cualquier trabajo del plan con el consentimiento del
            Cliente, el valor del trabajo realizado hasta ese momento se factura en proporción al
            avance. Fuera de este plazo y de lo indicado en la sección de cancelación, no hay
            devoluciones de dinero.
          </p>
          {notaNoAsesoriaLegal}
        </>
      ),
    },
  ];
}

/* ───────────────────────── Ecosistemas digitales ───────────────────────── */

export function seccionesSitioWeb(): SeccionContrato[] {
  return [
    {
      titulo: "Alcance detallado del servicio",
      contenido: (
        <>
          {introAlcance}
          {alcanceCategorias(["Páginas web y embudos"])}
        </>
      ),
    },
    seccionFormaPagoUnico(),
    {
      titulo: "Hosting, dominio, licencias y mantenimiento",
      contenido: (
        <p>
          El hosting y el dominio están incluidos durante el <strong>primer año</strong>. A partir
          del segundo año, la renovación corre por cuenta del Cliente; biwov avisará antes del
          vencimiento para que el sitio no quede fuera de línea. Las licencias, plantillas de pago y
          herramientas de terceros se cotizan aparte. El mantenimiento después de la entrega no está
          incluido, salvo que el Cliente contrate el mantenimiento web mensual, que tiene un límite
          de horas y solicitudes definido en su alcance.
        </p>
      ),
    },
    seccionEntregaInsumos(),
    seccionAccesoCuentas(),
    ...seccionRetractoYAbandonoUnico(),
    seccionCancelacionUnico(),
  ];
}

/* ───────────────────────── Producción y edición ───────────────────────── */

export function seccionesProduccion(): SeccionContrato[] {
  return [
    {
      titulo: "Alcance detallado del servicio",
      contenido: (
        <>
          {introAlcance}
          {alcanceCategorias(["Producción audiovisual", "Edición y guía de grabación"])}
        </>
      ),
    },
    {
      titulo: "Producción con aliados y responsabilidad de biwov",
      contenido: (
        <p>
          La producción audiovisual es dirigida por biwov y la grabación la realizan productores
          aliados seleccionados por biwov. biwov planea, coordina, dirige y{" "}
          <strong>responde ante el Cliente por la calidad y la entrega</strong> del trabajo
          contratado. El equipo técnico se acuerda con el Cliente según el nivel contratado.
        </p>
      ),
    },
    seccionFormaPagoUnico(
      <p className="mt-3">
        La fecha de la jornada de grabación se agenda con el Cliente; si el Cliente necesita
        cambiarla, debe avisar con un mínimo de 48 horas de anticipación. La grabación tiene la
        duración y la ubicación definidas en la propuesta. Los desplazamientos fuera de Manizales,
        el uso de drone (sujeto a permisos y condiciones del lugar) y el alquiler de locaciones,
        modelos o utilería se cobran aparte.
      </p>,
    ),
    seccionEntregaInsumos(),
    seccionAccesoCuentas(),
    ...seccionRetractoYAbandonoUnico(),
    seccionCancelacionUnico(),
  ];
}

/* ───────────────────────── Automatización e IA ───────────────────────── */

export function seccionesAutomatizacion(): SeccionContrato[] {
  return [
    {
      titulo: "Alcance detallado del servicio",
      contenido: (
        <>
          {introAlcance}
          {alcanceCategorias([
            "WhatsApp y agentes de IA",
            "Email marketing",
            "WhatsApp masivo",
            "Automatización de procesos",
          ])}
        </>
      ),
    },
    {
      titulo: "Implementación, mantenimiento y consumo",
      contenido: (
        <>
          <p>Estos servicios tienen tres componentes que se cobran por separado:</p>
          <Lista
            items={[
              <>
                <strong>Implementación:</strong> lo que cobra biwov por construir y entregar la
                solución funcionando, con pruebas y capacitación. Es un pago único.
              </>,
              <>
                <strong>Mantenimiento, soporte o gestión mensual (opcional):</strong> lo que cobra
                biwov por mantener, revisar, optimizar u operar la solución cada mes. Si el Cliente
                elige solo la implementación, biwov entrega el sistema funcionando y los ajustes
                posteriores se cotizan aparte.
              </>,
              <>
                <strong>Consumo:</strong> lo que el Cliente paga directamente a las plataformas
                (licencias de CRM o herramientas de correo, proveedor de WhatsApp, cargos de Meta por
                mensajes y consumo de IA). No está incluido en los valores de biwov.
              </>,
            ]}
          />
          <p className="mt-3">
            Cada proyecto incluye un número definido de flujos, integraciones y condiciones, que
            queda por escrito en este contrato o en la propuesta. No se venden automatizaciones
            ilimitadas: lo adicional se cotiza aparte. Los límites de conversaciones, contactos,
            mensajes y consumo dependen del plan que el Cliente tenga con cada plataforma.
          </p>
        </>
      ),
    },
    {
      titulo: "Bases de datos y mensajes comerciales",
      contenido: (
        <>
          <p>
            biwov solo trabaja con bases de datos obtenidas legalmente, en las que las personas
            hayan autorizado recibir comunicaciones comerciales, conforme a la Ley 1581 de 2012
            (protección de datos personales). El Cliente declara que su base de datos cumple esta
            condición y es el responsable del tratamiento de esos datos. Todas las campañas incluyen
            un mecanismo para que las personas puedan dejar de recibir mensajes.
          </p>
          <p className="mt-3">
            Las plantillas de WhatsApp deben ser aprobadas por Meta, y Meta cobra el envío de
            mensajes por categoría de conversación y por país, con tarifas que puede cambiar en
            cualquier momento. biwov no tiene control sobre esas tarifas, aprobaciones ni límites de
            envío, y no responde por bloqueos de cuenta causados por el uso de bases de datos no
            autorizadas o por el incumplimiento de las políticas de Meta por parte del Cliente.
          </p>
          {notaNoAsesoriaLegal}
        </>
      ),
    },
    seccionFormaPagoUnico(),
    seccionEntregaInsumos(),
    seccionAccesoCuentas(),
    ...seccionRetractoYAbandonoUnico(),
    seccionCancelacionUnico(),
  ];
}

/* ───────────────────────── Campañas en Meta ───────────────────────── */

export function seccionesCampanaMeta(): SeccionContrato[] {
  return [
    {
      titulo: "Alcance detallado del servicio",
      contenido: (
        <>
          {introAlcance}
          {alcanceCategorias(["Campañas en Meta"])}
        </>
      ),
    },
    {
      titulo: "Inversión, forma de pago y permanencia",
      contenido: (
        <>
          <p>
            La configuración inicial se paga una sola vez, por anticipado. La gestión mensual se
            paga <strong>por anticipado dentro de los primeros 5 días de cada mes</strong> y tiene
            una permanencia mínima de <strong>3 meses</strong>. Para iniciar, el Cliente debe
            entregar un mínimo de 6 piezas creativas (videos o imágenes). El incumplimiento en el
            pago de dos (2) mensualidades consecutivas faculta a biwov para suspender el servicio
            hasta normalizar la cartera.
          </p>
          {notaValoresNetos}
        </>
      ),
    },
    {
      titulo: "Inversión en pauta publicitaria",
      contenido: (
        <p>
          La inversión en pauta publicitaria en Meta <strong>no está incluida</strong> en el valor
          de la gestión y la paga el Cliente directamente a Meta. Meta puede actualizar sus tarifas
          y políticas en cualquier momento; biwov no tiene control sobre ellas.
        </p>
      ),
    },
    seccionAccesoCuentas(),
    {
      titulo: "Cancelación y terminación por falta de respuesta",
      contenido: (
        <>
          <p>
            Cumplida la permanencia mínima de 3 meses, cualquiera de las partes puede terminar el
            contrato con treinta (30) días de aviso previo por escrito. Los servicios ya ejecutados
            se facturan en proporción al avance realizado.
          </p>
          <p className="mt-3">
            Si el Cliente no responde ni entrega el material solicitado (piezas creativas, accesos,
            aprobaciones) por más de un (1) mes calendario, biwov podrá suspender o dar por
            terminado el contrato sin devolución del dinero ya pagado por el mes en curso.
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
            a la aceptación, siempre que biwov aún no haya iniciado la configuración o el montaje de
            la campaña; en ese caso se reintegra el valor pagado. Una vez iniciado, el valor del mes
            en curso no es reembolsable.
          </p>
          {notaNoAsesoriaLegal}
        </>
      ),
    },
  ];
}

/* ───────────────────────── Secciones finales (todos los contratos) ───────────────────────── */

export function seccionesComunesFinal(): SeccionContrato[] {
  return [
    {
      titulo: "Estándares de trabajo",
      contenido: (
        <>
          <p>Para que el trabajo sea ordenado y predecible, en todos los servicios aplica lo siguiente:</p>
          <Lista
            items={[
              "Planeación: el contenido y las actividades de cada mes se planean en la primera semana del mes.",
              "Aprobación: el Cliente aprueba las piezas antes de su publicación o entrega final.",
              <>
                Correcciones: se incluye <strong>1 ronda de ajustes por pieza o entrega</strong>. Las rondas adicionales o los cambios de fondo se cotizan aparte.
              </>,
              "Entrega de contenido: según el calendario acordado con el Cliente.",
              <>
                Piezas no utilizadas: las piezas, sesiones o reuniones de un mes que no se usen por causas del Cliente <strong>no se acumulan</strong> para el mes siguiente.
              </>,
              "Reels: duración de hasta 60 segundos, salvo que se acuerde otra cosa por escrito.",
              "Publicaciones gráficas: cada diseño cuenta como una pieza; un carrusel de hasta 5 diapositivas cuenta como una publicación.",
              "Historias: se cuentan de forma individual.",
              "Reuniones: las que indica el plan o servicio contratado.",
              "Soporte: en horario laboral (lunes a viernes).",
              "Publicar contenido no incluye responder mensajes comerciales ni cerrar ventas, salvo que esté contratado expresamente.",
              "Cambios de estrategia o solicitudes fuera del alcance contratado se cotizan aparte.",
              "Desplazamientos fuera de Manizales se cobran aparte.",
              "Pauta publicitaria, licencias y plataformas no están incluidas y se cobran aparte.",
            ]}
          />
        </>
      ),
    },
    {
      titulo: "Propiedad intelectual y uso del trabajo en el portafolio de biwov",
      contenido: (
        <>
          <p>
            Los entregables finales (piezas gráficas, contenido, fotos, videos, sitio web y flujos
            implementados) serán propiedad del Cliente una vez se realice el pago completo acordado.
            Las licencias de plataformas de terceros siguen siendo de su proveedor.
          </p>
          <p className="mt-3">
            biwov conserva el derecho de usar el trabajo realizado para el Cliente — incluyendo
            videos, piezas gráficas, capturas de pantalla de lo implementado y resultados obtenidos
            — en su publicidad y en sus redes sociales (biwov y Kathe Digital), con el fin de
            mostrar trabajos realizados, armar portafolio y compartir testimonios e historial de
            resultados. Este uso se limita a lo que no revele información interna o confidencial
            del negocio del Cliente; cuando el contenido incluya información sensible, biwov la omite
            o la difumina antes de publicarla.
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
          autorización previa por escrito. Esto incluye, de parte de biwov y de sus aliados, las
          contraseñas, accesos, credenciales y bases de datos que el Cliente entregue para ejecutar
          el servicio.
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
          prestado — entre ellos, que el Cliente o su equipo ejecuten lo acordado y sepan atender,
          cerrar y hacer seguimiento a las personas interesadas. biwov no es responsable por las
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
