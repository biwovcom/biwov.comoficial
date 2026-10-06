import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ImprimirButton } from "@/components/ui/ImprimirButton";
import { VERSION_POLITICA_DATOS } from "@/lib/politicaDatos";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV } from "@/lib/contacto";

export const metadata: Metadata = {
  title: "Política de tratamiento de datos | biwov",
  description:
    "Cómo biwov recolecta, usa y protege los datos personales que dejas en sus formularios, según la Ley 1581 de 2012 de Colombia.",
};

export default function PoliticaDatosPage() {
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
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Política de tratamiento de datos personales
          </h1>
          <p className="mt-2 text-sm text-text-secondary">Versión: {VERSION_POLITICA_DATOS}</p>

          <div className="prose-invert mt-10 space-y-8 text-sm leading-relaxed text-white/85 md:text-base">
            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">1. Responsable del tratamiento</h2>
              <p>
                <strong>biwov</strong>, agencia dirigida por Katherine Usma Aristizábal, es la
                responsable del tratamiento de los datos personales que recolecta a través de sus
                formularios, de acuerdo con la Ley 1581 de 2012 y el Decreto 1377 de 2013 de
                Colombia (régimen de protección de datos personales / Habeas Data).
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">2. Qué datos recolectamos</h2>
              <p>
                Nombre, nombre del negocio, cómo apareces en redes sociales, país y ciudad, número
                de WhatsApp, correo electrónico, y las respuestas que das en el diagnóstico de
                negocio (desafíos, metas, presupuesto y demás preguntas del formulario).
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">3. Para qué los usamos</h2>
              <p>
                Para contactarte por WhatsApp o correo, entender tu negocio y recomendarte el plan
                que más se ajusta, prepararte una propuesta comercial, dar seguimiento a tu
                proceso, y —si lo autorizas al escribirnos— enviarte contenido o novedades de
                biwov. No usamos tus datos para ningún otro fin.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">4. Dónde se almacenan</h2>
              <p>
                Tus datos se guardan en Supabase (nuestro proveedor de base de datos), con acceso
                restringido únicamente al equipo de biwov. No vendemos ni compartimos tus datos
                con terceros para fines publicitarios ajenos a biwov.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">
                5. Tus derechos como titular de los datos
              </h2>
              <p>Como titular, en cualquier momento puedes:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Conocer, actualizar y rectificar tus datos.</li>
                <li>Solicitar prueba de la autorización otorgada.</li>
                <li>
                  Ser informado sobre el uso que se ha dado a tus datos, previa solicitud.
                </li>
                <li>Revocar esta autorización y/o solicitar la supresión de tus datos.</li>
                <li>Acceder de forma gratuita a tus datos personales.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">6. Cómo ejercer tus derechos</h2>
              <p>
                Escríbenos por{" "}
                <a
                  href={linkWhatsApp(
                    WHATSAPP_BIWOV,
                    "Hola, quiero ejercer mis derechos sobre los datos que le di a biwov (conocer, actualizar, rectificar o eliminar mi información).",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline hover:text-white"
                >
                  WhatsApp
                </a>{" "}
                indicando tu nombre y qué quieres hacer con tus datos (conocerlos, corregirlos o
                eliminarlos). Atenderemos tu solicitud en los tiempos que establece la ley.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">7. Autorización</h2>
              <p>
                Al marcar la casilla &quot;Autorizo el tratamiento de mis datos personales&quot;
                en cualquier formulario de biwov, declaras haber leído y aceptado esta política.
                Esa aceptación queda registrada digitalmente con fecha y hora.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-white">8. Cambios a esta política</h2>
              <p>
                Si actualizamos esta política, publicaremos la nueva versión en esta misma página
                con su fecha correspondiente.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
