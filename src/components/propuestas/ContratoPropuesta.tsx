import type { ReactNode } from "react";
import {
  CONTRATISTA,
  copPropuesta,
  fechaLarga,
  sumarMeses,
  type PropuestaCliente,
} from "@/data/propuestasClientes";

export interface DatosClienteContrato {
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  empresa?: string;
  /** Fecha de inicio en formato AAAA-MM-DD. */
  fechaInicio?: string;
}

export interface FirmaContrato {
  imagen: string;
  nombre: string;
  fecha: string;
  ip?: string | null;
}

/** Campo del contrato: muestra el dato o una línea para llenar. */
function Campo({
  valor,
  vacio = "________________",
}: {
  valor?: string;
  vacio?: string;
}) {
  const v = valor?.trim();
  return v ? (
    <strong className="font-semibold text-[#0f172a]">{v}</strong>
  ) : (
    <span className="text-[#94a3b8]">{vacio}</span>
  );
}

function Clausula({
  n,
  titulo,
  children,
}: {
  n: number;
  titulo: string;
  children: ReactNode;
}) {
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
          <span className="font-logo text-2xl font-bold text-[#0f172a]">
            biwov_
          </span>
          <p className="text-xs text-[#64748b]">
            Marketing digital · Manizales, Colombia
          </p>
        </div>
        <div className="text-right text-xs text-[#64748b]">
          <p>Fecha de diligenciamiento</p>
          <p className="font-semibold text-[#0f172a]">
            {fechaDiligenciamiento}
          </p>
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
            <strong className="text-[#0f172a]">LA CONTRATISTA:</strong>{" "}
            {CONTRATISTA.nombre}, mayor de edad, domiciliada en{" "}
            {CONTRATISTA.ciudad}, identificada con cédula de ciudadanía No.{" "}
            {CONTRATISTA.cedula}, quien actúa en nombre propio y bajo la marca{" "}
            <strong className="text-[#0f172a]">biwov</strong>. Celular{" "}
            {CONTRATISTA.celular} · correo {CONTRATISTA.correo}.
          </p>
          <p>
            <strong className="text-[#0f172a]">LA CONTRATANTE:</strong>{" "}
            <Campo valor={cliente.nombre} vacio="(nombre completo)" />, mayor de
            edad, identificada con cédula de ciudadanía No.{" "}
            <Campo valor={cliente.cedula} vacio="(cédula)" />,
            {cliente.empresa?.trim() ? (
              <>
                {" "}
                quien actúa en nombre propio y de{" "}
                <Campo valor={cliente.empresa} />,
              </>
            ) : null}{" "}
            con correo <Campo valor={cliente.email} vacio="(correo)" /> y
            teléfono <Campo valor={cliente.telefono} vacio="(teléfono)" />.
          </p>
          <p>
            Las partes acuerdan celebrar este contrato de prestación de
            servicios, que se rige por las siguientes cláusulas.
          </p>
        </Clausula>

        <Clausula n={sig()} titulo="Objeto">
          <p>{p.objeto}</p>
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
          <p>{p.metodologia}</p>
          <Lista
            items={p.plan.map((e) => (
              <>
                <strong className="text-[#0f172a]">
                  {e.cuando} — {e.titulo}:
                </strong>{" "}
                {e.detalle.join(" ")}
              </>
            ))}
          />
        </Clausula>

        <Clausula n={sig()} titulo="Compromisos de LA CONTRATANTE">
          <Lista items={p.compromisosCliente} />
          <p>{p.notaCompromisos}</p>
        </Clausula>

        <Clausula n={sig()} titulo="Lo que no incluye">
          <Lista items={p.noIncluye} />
        </Clausula>

        <Clausula n={sig()} titulo="Duración">
          <p>
            El contrato tiene una duración mínima de {p.duracionMeses} meses,
            desde el{" "}
            <Campo
              valor={fechaLarga(cliente.fechaInicio ?? "")}
              vacio="(fecha de inicio)"
            />{" "}
            hasta el{" "}
            <Campo
              valor={
                cliente.fechaInicio
                  ? fechaLarga(sumarMeses(cliente.fechaInicio, p.duracionMeses))
                  : ""
              }
              vacio="(fecha de cierre)"
            />
            . Al terminar se evalúan los resultados para decidir si se le da
            continuidad al proceso, lo cual se acordará por escrito entre las
            partes.
          </p>
        </Clausula>

        <Clausula n={sig()} titulo="Valor y forma de pago">
          <p>{p.pago.clausula}</p>
          <Lista
            items={p.pago.lineas.map((l) => (
              <>
                <strong className="text-[#0f172a]">
                  {l.titulo}: {copPropuesta(l.valor)} COP.
                </strong>{" "}
                {l.detalle.join(" ")}
              </>
            ))}
          />
          <p>
            Los valores no incluyen la inversión en pauta ni el costo de
            herramientas de terceros.
          </p>
        </Clausula>

        <Clausula n={sig()} titulo="Herramientas y costos de terceros">
          <p>{p.herramientasIntro}</p>
          <Lista
            items={p.herramientas.map((h) => (
              <>
                <strong className="text-[#0f172a]">{h.nombre}</strong> — {h.uso}
                : {h.costoAprox}
              </>
            ))}
          />
          <p>
            Los costos son aproximados y pueden variar por decisión de cada
            proveedor, por la tasa de cambio del dólar o por cambios de plan.
            Estos cambios no son responsabilidad de LA CONTRATISTA.
          </p>
        </Clausula>

        <Clausula
          n={sig()}
          titulo="Políticas de Meta, plataformas y resultados"
        >
          <p>
            Las campañas y herramientas dependen de plataformas de terceros (
            {p.plataformas}), que pueden cambiar sus políticas, costos y
            funcionamiento en cualquier momento. LA CONTRATISTA no se hace
            responsable por rechazos de anuncios, restricciones o bloqueos de
            cuentas, cambios de políticas o de precios de estas plataformas, ni
            por el contenido que LA CONTRATANTE grabe, edite o publique.
          </p>
          {p.parrafoSector && <p>{p.parrafoSector}</p>}
          <p>
            La obligación de LA CONTRATISTA es de medio y no de resultado:
            aplica su experiencia y buenas prácticas, pero no garantiza un
            número específico de seguidores, mensajes, citas o ventas.
          </p>
        </Clausula>

        <Clausula n={sig()} titulo="Confidencialidad de claves y accesos">
          <Lista
            items={[
              "Las claves, contraseñas, códigos de verificación y accesos que LA CONTRATANTE entregue son información confidencial.",
              "LA CONTRATISTA las usa únicamente para ejecutar el servicio contratado. No las comparte, no las vende y no las divulga a terceros; si un aliado de LA CONTRATISTA necesita un acceso para cumplir el servicio, lo recibe con la misma obligación de reserva.",
              "Siempre que la plataforma lo permita, se trabajará con accesos por rol o invitación (por ejemplo, el administrador comercial de Meta) en lugar de la contraseña principal.",
              "Las claves se guardan de forma segura y no se piden ni se envían por canales públicos o abiertos.",
              "LA CONTRATISTA no cambia contraseñas, correos de recuperación ni la titularidad de las cuentas sin autorización escrita de LA CONTRATANTE. LA CONTRATANTE sigue siendo la única dueña de sus cuentas.",
              "Al terminar el contrato, LA CONTRATISTA retira sus accesos y LA CONTRATANTE debe cambiar las contraseñas que haya compartido.",
              "LA CONTRATANTE es responsable de activar la verificación en dos pasos y de la seguridad general de sus cuentas. LA CONTRATISTA no responde por accesos indebidos de terceros ajenos a LA CONTRATISTA.",
              "Esta obligación de confidencialidad sigue vigente después de terminado el contrato.",
            ]}
          />
        </Clausula>

        <Clausula n={sig()} titulo="Confidencialidad y datos personales">
          <p>
            Las partes guardarán reserva sobre {p.reservaSobre} a la que tengan
            acceso. LA CONTRATANTE autoriza a LA CONTRATISTA a tratar sus datos
            personales para ejecutar este contrato, conforme a la Ley 1581 de
            2012 y a la política de tratamiento de datos de biwov
            (biwov.com/politica-datos). LA CONTRATANTE es dueña de su contenido
            y de sus cuentas.
          </p>
        </Clausula>

        <Clausula n={sig()} titulo="Terminación anticipada">
          <p>
            Si alguna de las partes quiere terminar antes del plazo mínimo, debe
            avisar por escrito con 15 días de anticipación. En ese caso se
            reconoce el valor proporcional de los servicios ya prestados.
          </p>
        </Clausula>

        <Clausula n={sig()} titulo="Firma electrónica y domicilio">
          <p>
            Las partes aceptan este contrato por medio de firma electrónica,
            válida según la Ley 527 de 1999. Queda registro de la fecha y hora,
            la firma, el nombre de quien firma, la dirección IP y la versión
            exacta del contrato. Para todos los efectos, el domicilio
            contractual es la ciudad de {CONTRATISTA.ciudad}.
          </p>
        </Clausula>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#e2e8f0] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748b]">
            La contratista
          </p>
          <p className="mt-6 font-logo text-xl text-[#2e5b7e]">
            {CONTRATISTA.nombre}
          </p>
          <div className="mt-2 border-t border-[#cbd5e1] pt-2 text-xs text-[#64748b]">
            {CONTRATISTA.nombre} · C.C. {CONTRATISTA.cedula}
            <br />
            biwov · emisora de la propuesta
          </div>
        </div>
        <div className="rounded-2xl border border-[#e2e8f0] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748b]">
            La contratante
          </p>
          {firma ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={firma.imagen}
              alt={`Firma de ${firma.nombre}`}
              className="h-20 w-full object-contain"
            />
          ) : (
            <div className="h-20" />
          )}
          <div className="mt-2 border-t border-[#cbd5e1] pt-2 text-xs text-[#64748b]">
            <Campo valor={firma?.nombre ?? cliente.nombre} vacio="(nombre)" /> ·
            C.C. <Campo valor={cliente.cedula} vacio="(cédula)" />
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
