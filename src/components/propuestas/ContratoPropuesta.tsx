import type { ReactNode } from "react";
import { CONTRATISTA, copPropuesta, type PropuestaCliente } from "@/data/propuestasClientes";

export interface DatosClienteContrato {
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  empresa?: string;
}

export interface FirmaContrato {
  imagen: string;
  nombre: string;
  fecha: string;
  ip?: string | null;
}

/** Campo del contrato: muestra el dato o una línea para llenar. */
function Campo({ valor, vacio = "________________" }: { valor?: string; vacio?: string }) {
  const v = valor?.trim();
  return v ? (
    <strong className="font-semibold text-[#0f172a]">{v}</strong>
  ) : (
    <span className="text-[#94a3b8]">{vacio}</span>
  );
}

function Clausula({ n, titulo, children }: { n: number; titulo: string; children: ReactNode }) {
  return (
    <section className="break-inside-avoid-page">
      <h3 className="mb-2 text-[15px] font-bold text-[#0f172a]">
        {n}. {titulo}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Lista({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

/**
 * Contrato de una propuesta a la medida. Se usa en vivo mientras la clienta
 * llena el formulario y también en la copia firmada que se descarga.
 */
export function ContratoPropuesta({
  propuesta: p,
  cliente,
  fechaDiligenciamiento,
  firma,
}: {
  propuesta: PropuestaCliente;
  cliente: DatosClienteContrato;
  fechaDiligenciamiento: string;
  firma?: FirmaContrato;
}) {
  let n = 0;
  const sig = () => ++n;

  return (
    <article className="break-words bg-white text-[13.5px] leading-relaxed text-[#334155]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="font-logo text-2xl font-bold text-[#0f172a]">biwov_</span>
          <p className="text-xs text-[#64748b]">Marketing digital · Manizales, Colombia</p>
        </div>
        <div className="text-right text-xs text-[#64748b]">
          <p>Fecha de diligenciamiento</p>
          <p className="font-semibold text-[#0f172a]">{fechaDiligenciamiento}</p>
        </div>
      </div>
      <div className="mt-3 h-1 w-full rounded-full bg-gradient-to-r from-[#2e5b7e] to-[#00c2e8]" />

      <h2 className="mt-6 text-xl font-bold leading-tight text-[#0f172a] md:text-2xl">
        Contrato de prestación de servicios de marketing digital
      </h2>
      <p className="mt-1 text-xs text-[#64748b]">
        {p.titulo} · {p.sector} · Versión {p.version}
      </p>

      <div className="mt-6 space-y-6">
        <Clausula n={sig()} titulo="Partes">
          <p>
            <strong className="text-[#0f172a]">LA CONTRATISTA:</strong> {CONTRATISTA.nombre}, mayor de edad,
            domiciliada en {CONTRATISTA.ciudad}, identificada con cédula de ciudadanía No. {CONTRATISTA.cedula},
            quien actúa en nombre propio y bajo la marca <strong className="text-[#0f172a]">biwov</strong>. Celular{" "}
            {CONTRATISTA.celular} · correo {CONTRATISTA.correo}.
          </p>
          <p>
            <strong className="text-[#0f172a]">LA CONTRATANTE:</strong> <Campo valor={cliente.nombre} vacio="(nombre completo)" />,
            mayor de edad, identificada con cédula de ciudadanía No. <Campo valor={cliente.cedula} vacio="(cédula)" />,
            {cliente.empresa?.trim() ? (
              <>
                {" "}quien actúa en nombre propio y de <Campo valor={cliente.empresa} />,
              </>
            ) : null}{" "}
            con correo <Campo valor={cliente.email} vacio="(correo)" /> y teléfono{" "}
            <Campo valor={cliente.telefono} vacio="(teléfono)" />.
          </p>
          <p>Las partes acuerdan celebrar este contrato de prestación de servicios, que se rige por las siguientes cláusulas.</p>
        </Clausula>

        <Clausula n={sig()} titulo="Objeto">
          <p>
            LA CONTRATISTA prestará a LA CONTRATANTE el servicio de dirección y acompañamiento en marketing digital
            descrito en este contrato ({p.titulo.toLowerCase()}), con campañas publicitarias en Meta, lineamientos
            para generar comunidad, guiones de contenido, configuración de herramientas e implementación de
            inteligencia artificial, durante {p.duracionMeses} meses.
          </p>
        </Clausula>

        <Clausula n={sig()} titulo="Alcance: lo que incluye">
          {p.incluye.map((b) => (
            <div key={b.titulo}>
              <p className="font-semibold text-[#0f172a]">{b.titulo}</p>
              <Lista items={b.items} />
            </div>
          ))}
        </Clausula>

        <Clausula n={sig()} titulo="Plan de trabajo y metodología">
          <p>
            Primero se planea y después se ejecuta. Una vez firmado el contrato se inicia el diagnóstico, la
            revisión de redes sociales y de configuraciones, y se envía a LA CONTRATANTE el plan de trabajo con la
            planeación, la ejecución y los objetivos. La instalación de herramientas se hace de manera presencial
            y el acompañamiento continúa con una reunión virtual a la semana.
          </p>
          <Lista
            items={p.plan.map((e) => (
              <>
                <strong className="text-[#0f172a]">{e.cuando} — {e.titulo}:</strong> {e.detalle.join(" ")}
              </>
            ))}
          />
        </Clausula>

        <Clausula n={sig()} titulo="Compromisos de LA CONTRATANTE">
          <Lista items={p.compromisosCliente} />
          <p>
            La grabación y la edición de los videos son responsabilidad de LA CONTRATANTE. LA CONTRATISTA la guiará
            durante todo el proceso y le enseñará marketing digital para que pueda trabajarlo de la mejor manera
            posible. Los guiones o piezas que no se graben o publiquen en el mes no se acumulan.
          </p>
        </Clausula>

        <Clausula n={sig()} titulo="Lo que no incluye">
          <Lista items={p.noIncluye} />
        </Clausula>

        <Clausula n={sig()} titulo="Duración">
          <p>
            El contrato tiene una duración mínima de {p.duracionMeses} meses, desde el {p.fechaInicio} hasta el{" "}
            {p.fechaFin}. Al terminar se evalúan los resultados para decidir si se le da continuidad al proceso, lo
            cual se acordará por escrito entre las partes.
          </p>
        </Clausula>

        <Clausula n={sig()} titulo="Valor y forma de pago">
          <p>
            El valor del servicio es de <strong className="text-[#0f172a]">{copPropuesta(p.valorMensual)} COP mensuales</strong>,
            para un total de <strong className="text-[#0f172a]">{copPropuesta(p.pago.totalContrato)} COP</strong> por los{" "}
            {p.duracionMeses} meses. Se paga así:
          </p>
          <Lista
            items={[
              <>
                <strong className="text-[#0f172a]">Canje:</strong> {p.pago.canje.concepto}, valorado en{" "}
                {copPropuesta(p.pago.canje.valor)} COP, que se abona al valor de este contrato.
              </>,
              <>
                <strong className="text-[#0f172a]">Saldo en efectivo: {copPropuesta(p.pago.saldo.valor)} COP.</strong>{" "}
                {p.pago.saldo.condiciones.join(" ")}
              </>,
            ]}
          />
          <p>Los valores no incluyen la inversión en pauta ni el costo de herramientas de terceros.</p>
        </Clausula>

        <Clausula n={sig()} titulo="Herramientas y costos de terceros">
          <p>LA CONTRATANTE paga directamente las herramientas que necesita. LA CONTRATISTA la asesora y le instala el programa.</p>
          <Lista
            items={p.herramientas.map((h) => (
              <>
                <strong className="text-[#0f172a]">{h.nombre}</strong> — {h.uso}: {h.costoAprox}
              </>
            ))}
          />
          <p>
            Los costos son aproximados y pueden variar por decisión de cada proveedor, por la tasa de cambio del
            dólar o por cambios de plan. Estos cambios no son responsabilidad de LA CONTRATISTA.
          </p>
        </Clausula>

        <Clausula n={sig()} titulo="Políticas de Meta, plataformas y resultados">
          <p>
            Las campañas y herramientas dependen de plataformas de terceros (Meta, Instagram, Facebook, WhatsApp,
            Claude, ChatGPT, entre otras), que pueden cambiar sus políticas, costos y funcionamiento en cualquier
            momento. LA CONTRATISTA no se hace responsable por rechazos de anuncios, restricciones o bloqueos de
            cuentas, cambios de políticas o de precios de estas plataformas, ni por el contenido que LA CONTRATANTE
            grabe, edite o publique.
          </p>
          <p>
            Los anuncios de servicios de salud deben cumplir las políticas de publicidad de Meta y las normas
            colombianas sobre publicidad de servicios de salud; LA CONTRATANTE responde por la veracidad de lo que
            se anuncia de su consultorio. La obligación de LA CONTRATISTA es de medio y no de resultado: aplica su
            experiencia y buenas prácticas, pero no garantiza un número específico de seguidores, mensajes, citas o
            ventas.
          </p>
        </Clausula>

        <Clausula n={sig()} titulo="Confidencialidad y datos personales">
          <p>
            Las partes guardarán reserva sobre la información del negocio y de los pacientes a la que tengan acceso.
            LA CONTRATANTE autoriza a LA CONTRATISTA a tratar sus datos personales para ejecutar este contrato,
            conforme a la Ley 1581 de 2012 y a la política de tratamiento de datos de biwov (biwov.com/politica-datos).
            LA CONTRATANTE es dueña de su contenido y de sus cuentas.
          </p>
        </Clausula>

        <Clausula n={sig()} titulo="Terminación anticipada">
          <p>
            Si alguna de las partes quiere terminar antes del plazo mínimo, debe avisar por escrito con 15 días de
            anticipación. En ese caso se reconoce el valor proporcional de los servicios ya prestados.
          </p>
        </Clausula>

        <Clausula n={sig()} titulo="Firma electrónica y domicilio">
          <p>
            Las partes aceptan este contrato por medio de firma electrónica, válida según la Ley 527 de 1999. Queda
            registro de la fecha y hora, la firma, el nombre de quien firma, la dirección IP y la versión exacta del
            contrato. Para todos los efectos, el domicilio contractual es la ciudad de {CONTRATISTA.ciudad}.
          </p>
        </Clausula>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#e2e8f0] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748b]">La contratista</p>
          <p className="mt-6 font-logo text-xl text-[#2e5b7e]">{CONTRATISTA.nombre}</p>
          <div className="mt-2 border-t border-[#cbd5e1] pt-2 text-xs text-[#64748b]">
            {CONTRATISTA.nombre} · C.C. {CONTRATISTA.cedula}
            <br />
            biwov · emisora de la propuesta
          </div>
        </div>
        <div className="rounded-2xl border border-[#e2e8f0] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748b]">La contratante</p>
          {firma ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={firma.imagen} alt={`Firma de ${firma.nombre}`} className="h-20 w-full object-contain" />
          ) : (
            <div className="h-20" />
          )}
          <div className="mt-2 border-t border-[#cbd5e1] pt-2 text-xs text-[#64748b]">
            <Campo valor={firma?.nombre ?? cliente.nombre} vacio="(nombre)" /> · C.C. <Campo valor={cliente.cedula} vacio="(cédula)" />
            <br />
            {firma ? (
              <>
                Firmado electrónicamente el {firma.fecha}
                {firma.ip ? ` · IP ${firma.ip}` : ""}
              </>
            ) : (
              "Pendiente de firma"
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
