import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ImprimirButton } from "@/components/ui/ImprimirButton";
import { VERSION_CONTRATO } from "@/lib/contrato";

export const metadata: Metadata = {
  title: "Contrato y Términos y Condiciones | biwov",
  description:
    "Términos y condiciones del servicio de biwov para el diseño e implementación de soluciones digitales conectadas.",
};

export default function ContratoPage() {
  return (
    <div className="min-h-screen bg-bg-base py-24 text-white">
      <Container className="max-w-3xl">
        <div className="mb-10 flex items-center justify-between print:hidden">
          <Link href="/" className="text-sm text-text-secondary hover:text-white">
            ← Volver al inicio
          </Link>
          <ImprimirButton />
        </div>

        <div className="rounded-3xl border border-border-glass bg-white/[0.02] p-8 md:p-12">
          <p className="mb-2 rounded-full border border-border-glass bg-white/[0.03] px-4 py-1 text-xs font-semibold uppercase tracking-wide text-accent inline-block print:hidden">
            Borrador — pendiente revisión legal
          </p>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Contrato de Prestación de Servicios — biwov
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Versión del contrato: {VERSION_CONTRATO}
          </p>

          <div className="prose-invert mt-10 space-y-8 text-sm leading-relaxed text-white/85 md:text-base">
            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">1. Partes</h2>
              <p>
                El presente contrato se celebra entre <strong>biwov</strong>{" "}
                (&quot;el Proveedor&quot;), agencia de marketing digital dedicada al diseño e
                implementación de soluciones digitales conectadas para negocios, y el cliente que
                acepta estos términos al momento de adquirir un plan a través del sitio web de
                biwov (&quot;el Cliente&quot;).
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">2. Objeto</h2>
              <p>
                biwov prestará al Cliente los servicios correspondientes al plan seleccionado
                (Esencial, Crecimiento o Escala), según el alcance, módulos e inversión
                detallados en la cotización o propuesta aceptada por el Cliente, la cual forma
                parte integral de este contrato.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                3. Inversión, forma de pago y duración mínima
              </h2>
              <p>
                El valor del servicio corresponde al indicado en la propuesta aceptada por el
                Cliente. Los planes tienen un <strong>compromiso mínimo de 6 meses</strong>, por
                ser el tiempo real que toma ver resultados consistentes. El montaje inicial puede
                pagarse en 2 cuotas iguales, sin recargo, cuando el Cliente lo solicite: una al
                iniciar y otra al segundo mes.
              </p>
              <p className="mt-3">
                Sobre el pago inicial: en Colombia no existe una ley que obligue a cobrar un
                porcentaje específico por adelantado en contratos de prestación de servicios entre
                particulares — eso se define libremente entre las partes. Lo que sí aplica es el{" "}
                <strong>derecho de retracto</strong> de la Ley 1480 de 2011 (Estatuto del
                Consumidor) para ventas por internet, explicado en la sección 10. Los precios no
                incluyen IVA salvo que se indique lo contrario. El incumplimiento en el pago de dos
                (2) mensualidades consecutivas faculta a biwov para suspender los servicios hasta
                normalizar la cartera.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                4. Montaje inicial, herramienta de trabajo y dominio
              </h2>
              <p>
                Para el Plan Escala, el montaje inicial tiene un costo de $3.800.000 COP e
                incluye:
              </p>
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
                La suscripción mensual de GHL tiene un costo aproximado de{" "}
                <strong>USD $33 al mes</strong>, que el Cliente paga directamente al proveedor de
                la herramienta. Este valor es una referencia y puede variar según la tasa de
                cambio y los ajustes de precio que haga GHL; no depende de biwov. Enviar mensajes
                masivos adicionales por WhatsApp o correo, por encima de los flujos incluidos, y
                cualquier otra automatización fuera de lo descrito aquí, tiene un costo aparte que
                asume el Cliente.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                5. Plataformas, pauta publicitaria y mensajería (Meta y correo)
              </h2>
              <p>
                Los costos de pauta publicitaria en Meta (Facebook/Instagram), el envío de
                mensajes por WhatsApp Business Platform y el envío de correos masivos
                <strong> no están incluidos</strong> en los planes de biwov y corren por cuenta
                del Cliente, pagados directamente a Meta y a los proveedores correspondientes.
                Meta cobra el envío de mensajes de WhatsApp por categoría de conversación
                (marketing, utilidad, autenticación o servicio) y por país de destino, con tarifas
                que Meta puede actualizar en cualquier momento; biwov no tiene control sobre esas
                tarifas y solo da los lineamientos de uso de la plataforma. Es responsabilidad del
                Cliente mantener su cuenta de Meta/WhatsApp Business al día con las políticas
                vigentes de Meta.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                6. Herramientas de inteligencia artificial
              </h2>
              <p>
                Cuando biwov recomiende el uso de alguna herramienta de inteligencia artificial
                para optimizar los procesos del Cliente, la suscripción o el costo de dicha
                herramienta corre por cuenta del Cliente. biwov da la guía de implementación, pero
                la herramienta en sí no está incluida en el valor del plan.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">7. Proceso de trabajo</h2>
              <p>
                La prestación del servicio sigue el proceso de biwov: diagnóstico, diseño del
                plan, implementación, automatización y escalamiento. Los tiempos de entrega se
                acuerdan en el diagnóstico inicial y dependen de la entrega oportuna de
                información, accesos e insumos por parte del Cliente.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                8. Acceso a cuentas del Cliente
              </h2>
              <p>
                Para ejecutar el trabajo, el Cliente debe entregar a biwov la información y los
                accesos necesarios a sus cuentas (Facebook, Instagram, WhatsApp Business, correo,
                dominio, etc.). Sin estos accesos, biwov no puede realizar el trabajo contratado.
                biwov, representada legalmente por Katherine Usma Aristizábal, se compromete a usar
                esta información únicamente para la ejecución del servicio y a tratar los datos
                personales conforme a la{" "}
                <Link href="/politica-datos" className="text-accent underline hover:text-white">
                  política de tratamiento de datos
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                9. Landing pages del Plan Escala
              </h2>
              <p>
                El Plan Escala incluye la opción de trabajar hasta 3 landing pages distintas dentro
                de una misma campaña publicitaria, para identificar cuál rinde mejor y optimizarlas
                sobre la marcha. El costo se mantiene dentro del plan mientras se trabajen con GHL;
                si el flujo de alguna landing page requiere una herramienta adicional que no esté
                cubierta por GHL, ese costo aparte corre por cuenta del Cliente.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                10. Contenido audiovisual
              </h2>
              <p>
                Las jornadas de grabación y producción de contenido se cotizan según los niveles
                vigentes (Start, Professional, Signature) publicados en el sitio de biwov. Todo
                pedido de piezas individuales está sujeto a un monto mínimo de orden de $150.000
                COP.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                11. Propiedad intelectual
              </h2>
              <p>
                Los entregables finales (piezas gráficas, contenido, sitio web) serán propiedad
                del Cliente una vez se realice el pago completo acordado. biwov conserva el
                derecho de mostrar el trabajo realizado como parte de su portafolio, salvo acuerdo
                expreso en contrario.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">12. Confidencialidad</h2>
              <p>
                Ambas partes se comprometen a mantener confidencial la información comercial,
                técnica y de negocio compartida durante la ejecución del contrato, y a no
                divulgarla a terceros sin autorización previa por escrito.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                13. Cancelación y terminación por falta de respuesta
              </h2>
              <p>
                Cualquiera de las partes puede terminar el contrato con treinta (30) días de aviso
                previo por escrito. Los servicios y entregables ya ejecutados a la fecha de
                terminación serán facturados en proporción al avance realizado.
              </p>
              <p className="mt-3">
                Si biwov está ejecutando el trabajo contratado y el Cliente no responde ni entrega
                el material o la información que se le ha solicitado (accesos, contenido,
                aprobaciones, etc.) durante más de <strong>un (1) mes calendario</strong>, biwov
                podrá dar por terminado el contrato. En ese caso, no procede devolución del dinero
                ya pagado, dado que la falta de respuesta del Cliente impidió continuar con la
                ejecución del servicio ya iniciado.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                14. Derecho de retracto y devoluciones
              </h2>
              <p>
                Al tratarse de una venta por internet, aplica el derecho de retracto de la Ley
                1480 de 2011 (Estatuto del Consumidor): el Cliente puede desistir de la compra
                dentro de los cinco (5) días hábiles siguientes a la aceptación del plan, sin
                tener que justificar su decisión, y biwov reintegrará las sumas pagadas sin
                descuentos.
              </p>
              <p className="mt-3">
                Esta posibilidad aplica mientras el servicio todavía no ha comenzado a
                ejecutarse. Una vez biwov empieza el diagnóstico, el montaje o cualquier trabajo
                del plan con el consentimiento del Cliente, el retracto ya no cubre el valor del
                trabajo efectivamente realizado hasta ese momento, el cual se factura en
                proporción al avance. Fuera de este plazo y de lo indicado en la sección 13, no
                hay devoluciones de dinero.
              </p>
              <p className="mt-3 text-xs text-text-secondary">
                Esta sección resume la ley vigente de forma general y no reemplaza una asesoría
                legal; se recomienda que un abogado la revise antes de hacerla exigible a los
                clientes.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                15. Limitación de responsabilidad
              </h2>
              <p>
                biwov actúa con la diligencia propia de su actividad profesional, dando los
                lineamientos, la estrategia y la ejecución técnica acordada en el plan; sin
                embargo, <strong>no garantiza resultados comerciales específicos</strong> (número
                exacto de clientes, ventas o ingresos), dado que estos dependen de factores
                externos al servicio prestado — entre ellos, que el Cliente o su equipo sepan
                atender, cerrar y hacer seguimiento a las personas interesadas que le llegan. biwov
                no es responsable por las ventas que el Cliente no concrete.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">16. Aceptación</h2>
              <p>
                Al marcar la casilla &quot;Acepto el contrato y los términos y condiciones&quot; en
                el sitio web de biwov, el Cliente declara haber leído, entendido y aceptado
                íntegramente el presente contrato. Esta aceptación queda registrada digitalmente
                con fecha, hora, datos del Cliente y la versión del contrato vigente al momento de
                la aceptación.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
