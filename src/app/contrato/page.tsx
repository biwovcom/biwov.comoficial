import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ImprimirButton } from "./ImprimirButton";
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
                (&quot;el Proveedor&quot;), empresa dedicada al diseño e
                implementación de soluciones digitales conectadas para
                negocios, y el cliente que acepta estos términos al
                momento de adquirir un plan a través del sitio web de biwov
                (&quot;el Cliente&quot;).
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">2. Objeto</h2>
              <p>
                biwov prestará al Cliente los servicios correspondientes al
                plan seleccionado (START, GROWTH o ENTERPRISE), según el
                alcance, módulos e inversión detallados en la
                cotización personalizada aceptada por el Cliente, la cual
                forma parte integral de este contrato.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                3. Inversión y forma de pago
              </h2>
              <p>
                El valor del servicio corresponde al indicado en la
                cotización aceptada por el Cliente, bajo la modalidad de pago
                seleccionada (pago único, mensual, o inicial + cuotas). Los
                precios no incluyen IVA salvo que se indique lo contrario. El
                incumplimiento en el pago de dos (2) mensualidades
                consecutivas faculta a biwov para suspender los servicios
                hasta normalizar la cartera.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                4. Proceso de trabajo
              </h2>
              <p>
                La prestación del servicio sigue el proceso de biwov:
                Diagnóstico, Diseño del plan, Implementación, Automatización
                y Escalamiento. Los tiempos de entrega se
                acuerdan en el diagnóstico inicial y dependen de la entrega
                oportuna de información e insumos por parte del Cliente.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                5. Contenido audiovisual
              </h2>
              <p>
                Las jornadas de grabación se cotizan y facturan por separado
                de la edición. Los productos individuales de imagen y
                carrusel solo se comercializan en paquetes (packs), no de
                forma unitaria. Todo pedido está sujeto a un monto mínimo de
                orden de $150.000 COP.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                6. Propiedad intelectual
              </h2>
              <p>
                Los entregables finales (piezas gráficas, contenido, sitio
                web) serán propiedad del Cliente una vez se realice el pago
                completo acordado. biwov conserva el derecho de mostrar el
                trabajo realizado como parte de su portafolio, salvo acuerdo
                expreso en contrario.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                7. Confidencialidad
              </h2>
              <p>
                Ambas partes se comprometen a mantener confidencial la
                información comercial, técnica y de negocio compartida
                durante la ejecución del contrato, y a no divulgarla a
                terceros sin autorización previa por escrito.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                8. Cancelación
              </h2>
              <p>
                Cualquiera de las partes puede terminar el contrato con
                treinta (30) días de aviso previo por escrito. Los servicios
                y entregables ya ejecutados a la fecha de terminación serán
                facturados en proporción al avance realizado.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                9. Limitación de responsabilidad
              </h2>
              <p>
                biwov actúa con la diligencia propia de su actividad
                profesional; sin embargo, no garantiza resultados comerciales
                específicos (número exacto de clientes, ventas o ingresos),
                dado que estos dependen de factores externos al servicio
                prestado.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                10. Aceptación
              </h2>
              <p>
                Al marcar la casilla &quot;He leído y acepto los términos y
                condiciones del contrato&quot; en el sitio web de biwov, el
                Cliente declara haber leído, entendido y aceptado
                íntegramente el presente contrato. Esta aceptación queda
                registrada digitalmente con fecha, hora, datos del Cliente y
                la versión del contrato vigente al momento de la aceptación.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
