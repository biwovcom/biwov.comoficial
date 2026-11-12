"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  Clock,
  FileSignature,
  Megaphone,
  Sparkles,
  Users,
  Video,
  Wallet,
  X,
} from "lucide-react";
import { LogoMark } from "@/components/layout/LogoMark";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import {
  FirmaDigital,
  type DatosFirma,
} from "@/components/compras/FirmaDigital";
import { ContratoPropuesta } from "@/components/propuestas/ContratoPropuesta";
import {
  copPropuesta,
  fechaLarga,
  type PropuestaCliente as Propuesta,
} from "@/data/propuestasClientes";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV } from "@/lib/contacto";

const ICONOS = [Megaphone, Users, Video, Sparkles, CalendarDays];

const fechaHoy = () =>
  new Intl.DateTimeFormat("es-CO", {
    dateStyle: "long",
    timeZone: "America/Bogota",
  }).format(new Date());

const fechaHora = (iso: string) =>
  new Intl.DateTimeFormat("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Bogota",
  }).format(new Date(iso));

const DATOS_INICIALES = {
  nombre: "",
  cedula: "",
  email: "",
  telefono: "",
  empresa: "",
  fechaInicio: "",
};

export function PropuestaCliente({ propuesta: p }: { propuesta: Propuesta }) {
  const [datos, setDatos] = useState(DATOS_INICIALES);
  const [aceptaContrato, setAceptaContrato] = useState(false);
  const [aceptaDatos, setAceptaDatos] = useState(false);
  const [firma, setFirma] = useState<DatosFirma>({
    nombreFirmante: "",
    firmaImagenBase64: null,
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{
    linkContrato: string;
    firmadoEn: string;
  } | null>(null);

  const campo = (k: keyof typeof DATOS_INICIALES) => ({
    value: datos[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setDatos({ ...datos, [k]: e.target.value }),
  });

  const firmar = async () => {
    if (
      !datos.nombre.trim() ||
      !datos.cedula.trim() ||
      !datos.email.trim() ||
      !datos.telefono.trim() ||
      !datos.fechaInicio
    ) {
      setError(
        "Completa tu nombre, cédula, correo, teléfono y la fecha de inicio.",
      );
      return;
    }
    if (!aceptaContrato || !aceptaDatos) {
      setError(
        "Para firmar debes aceptar el contrato y autorizar el tratamiento de tus datos.",
      );
      return;
    }
    if (!firma.firmaImagenBase64) {
      setError("Falta tu firma: dibújala en el recuadro.");
      return;
    }
    setEnviando(true);
    setError(null);
    const res = await fetch(`/api/propuesta/${p.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...datos,
        aceptaContrato,
        aceptaDatos,
        nombreFirmante: firma.nombreFirmante || datos.nombre,
        firmaImagenBase64: firma.firmaImagenBase64,
      }),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    setEnviando(false);
    if (!res?.ok || !data?.ok) {
      setError(
        data?.error ??
          "No se pudo enviar. Revisa tu conexión e intenta de nuevo.",
      );
      return;
    }
    setResultado({
      linkContrato: data.linkContrato,
      firmadoEn: data.firmadoEn,
    });
    window.scrollTo({
      top: document.getElementById("firmar")?.offsetTop ?? 0,
      behavior: "smooth",
    });
  };

  const mensajeWhatsApp = `¡Hola Kathe! Ya firmé el contrato del ${p.titulo.toLowerCase()}. Soy ${datos.nombre}.`;

  return (
    <div className="min-h-screen overflow-x-clip bg-bg-deep text-white">
      {/* Barra superior */}
      <header className="border-b border-border-glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-8">
          <span className="flex items-center gap-2 font-logo text-2xl font-bold">
            <LogoMark className="h-7 w-7 text-white" />
            biwov_
          </span>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-border-glass px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary sm:inline">
              Propuesta privada
            </span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#03101b] transition-transform hover:scale-[1.03]"
            >
              Conoce biwov →
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-14 md:px-8 md:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          {p.sector}
        </p>
        <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-7xl">
          {p.titulo}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-text-secondary md:text-xl">
          {p.subtitulo}
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {p.tarjetas
            .map((t, i) => ({
              ...t,
              icono: [Video, Clock, Wallet, Users][i % 4],
            }))
            .map((d) => (
              <div key={d.etiqueta} className="card-universo rounded-3xl p-5">
                <d.icono className="h-5 w-5 text-accent" />
                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-text-secondary">
                  {d.etiqueta}
                </p>
                <p className="mt-1 text-base font-semibold leading-snug md:text-lg">
                  {d.valor}
                </p>
              </div>
            ))}
        </div>

        <a href="#firmar" className="mt-10 inline-block">
          <Button size="lg">
            <FileSignature size={18} /> Revisar y firmar
          </Button>
        </a>
      </section>

      {/* Qué incluye */}
      <section className="border-t border-border-glass bg-bg-base/40">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Lo que vamos a hacer contigo
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
            Qué incluye
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {p.incluye.map((b, i) => {
              const Icono = ICONOS[i % ICONOS.length];
              return (
                <div
                  key={b.titulo}
                  className="card-universo rounded-[1.75rem] p-7"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent/10">
                      <Icono className="h-5 w-5 text-accent" />
                    </span>
                    <h3 className="text-xl font-semibold">{b.titulo}</h3>
                  </div>
                  <ul className="mt-5 space-y-2.5">
                    {b.items.map((it) => (
                      <li
                        key={it}
                        className="flex gap-2.5 text-sm leading-relaxed text-white/85"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Plan de trabajo */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Primero planeamos, después ejecutamos
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
          Plan de trabajo
        </h2>
        <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {p.plan.map((e, i) => (
            <li key={e.titulo} className="card-universo rounded-[1.75rem] p-6">
              <span className="font-logo text-3xl font-bold text-accent">
                0{i + 1}
              </span>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-text-secondary">
                {e.cuando}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{e.titulo}</h3>
              <ul className="mt-3 space-y-2">
                {e.detalle.map((d) => (
                  <li key={d} className="text-sm leading-relaxed text-white/80">
                    {d}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {/* Compromisos y herramientas */}
      <section className="border-t border-border-glass bg-bg-base/40">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Trabajo en equipo
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
              Tus compromisos
            </h2>
            <ul className="mt-6 space-y-3">
              {p.compromisosCliente.map((c) => (
                <li
                  key={c}
                  className="flex gap-2.5 text-sm leading-relaxed text-white/85"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {c}
                </li>
              ))}
            </ul>
            <h3 className="mt-10 text-lg font-semibold">No incluye</h3>
            <ul className="mt-3 space-y-2.5">
              {p.noIncluye.map((c) => (
                <li
                  key={c}
                  className="flex gap-2.5 text-sm leading-relaxed text-text-secondary"
                >
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              {p.herramientasSubtitulo}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
              {p.herramientasTitulo}
            </h2>
            <div className="mt-6 space-y-3">
              {p.herramientas.map((h) => (
                <div key={h.nombre} className="card-universo rounded-2xl p-5">
                  <p className="font-semibold">{h.nombre}</p>
                  <p className="mt-0.5 text-sm text-text-secondary">{h.uso}</p>
                  <p className="mt-2 text-sm font-medium text-accent">
                    {h.costoAprox}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-text-secondary">
              Los costos son aproximados y pueden cambiar según cada proveedor y
              la tasa del dólar. Las campañas dependen de las políticas de Meta,
              que también pueden cambiar.
            </p>
          </div>
        </div>
      </section>

      {/* Inversión */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Inversión
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
          {p.pago.titulo}{" "}
          <span className="text-text-secondary">{p.pago.subtitulo}</span>
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="card-universo rounded-[1.75rem] p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">
              Total {p.duracionMeses} meses
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {copPropuesta(p.pago.totalContrato)}
            </p>
          </div>
          {p.pago.lineas.map((l) => (
            <div key={l.titulo} className="card-universo rounded-[1.75rem] p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">
                {l.titulo}
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {copPropuesta(l.valor)}
              </p>
              <ul className="mt-2 space-y-1 text-sm text-text-secondary">
                {l.detalle.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Formulario + contrato + firma */}
      <section
        id="firmar"
        className="scroll-mt-6 border-t border-border-glass bg-bg-base/40"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Último paso
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
            Llena tus datos y firma
          </h2>
          <p className="mt-3 max-w-2xl text-text-secondary">
            Tus datos se escriben solos en el contrato. Léelo, acepta y firma
            con el dedo o el mouse. Al final puedes descargar tu copia firmada.
          </p>

          {resultado ? (
            <div className="mt-10 rounded-[2rem] border border-accent/30 bg-accent/5 p-8 text-center md:p-12">
              <p className="text-4xl">✅</p>
              <h3 className="mt-3 text-2xl font-semibold">
                ¡Listo, {datos.nombre.split(" ")[0]}! El contrato quedó firmado.
              </h3>
              <p className="mt-2 text-text-secondary">
                Firmado el {fechaHora(resultado.firmadoEn)}. Empezamos el{" "}
                {fechaLarga(datos.fechaInicio)}.
              </p>
              <div className="mx-auto mt-8 flex max-w-md flex-col gap-3">
                <a
                  href={resultado.linkContrato}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="w-full">
                    <FileSignature size={18} /> Ver y descargar mi contrato
                    firmado
                  </Button>
                </a>
                <a
                  href={linkWhatsApp(WHATSAPP_BIWOV, mensajeWhatsApp)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="secondary" className="w-full">
                    Avisarle a Kathe por WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
              <div className="card-universo space-y-4 rounded-[1.75rem] p-6 lg:col-start-1 lg:row-start-1 lg:self-start">
                <p className="text-sm font-semibold text-white">1. Tus datos</p>
                <div>
                  <Label htmlFor="p-nombre">Nombre completo *</Label>
                  <Input
                    id="p-nombre"
                    autoComplete="name"
                    {...campo("nombre")}
                  />
                </div>
                <div>
                  <Label htmlFor="p-cedula">Cédula *</Label>
                  <Input
                    id="p-cedula"
                    inputMode="numeric"
                    {...campo("cedula")}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div>
                    <Label htmlFor="p-email">Correo *</Label>
                    <Input
                      id="p-email"
                      type="email"
                      autoComplete="email"
                      {...campo("email")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="p-tel">Teléfono / WhatsApp *</Label>
                    <Input
                      id="p-tel"
                      type="tel"
                      autoComplete="tel"
                      {...campo("telefono")}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="p-empresa">{p.etiquetaEmpresa}</Label>
                  <Input
                    id="p-empresa"
                    autoComplete="organization"
                    {...campo("empresa")}
                  />
                </div>
                <div>
                  <Label htmlFor="p-inicio">Fecha de inicio *</Label>
                  <Input
                    id="p-inicio"
                    type="date"
                    className="[color-scheme:dark]"
                    {...campo("fechaInicio")}
                  />
                </div>
              </div>

              <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
                <p className="mb-3 text-sm font-semibold text-white">
                  2. Lee tu contrato
                </p>
                <div className="max-h-[70vh] overflow-y-auto rounded-[1.75rem] bg-white p-6 shadow-2xl md:p-10 lg:max-h-[85vh]">
                  <ContratoPropuesta
                    propuesta={p}
                    cliente={datos}
                    fechaDiligenciamiento={fechaHoy()}
                  />
                </div>
              </div>

              <div className="card-universo space-y-4 rounded-[1.75rem] p-6 lg:sticky lg:top-6 lg:col-start-1 lg:row-start-2 lg:self-start">
                <p className="text-sm font-semibold text-white">
                  3. Acepta y firma
                </p>
                <FirmaDigital
                  nombreSugerido={datos.nombre}
                  onChange={setFirma}
                />
                <label className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <input
                    type="checkbox"
                    checked={aceptaContrato}
                    onChange={(e) => setAceptaContrato(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
                  />
                  <span>
                    He leído y acepto el contrato de prestación de servicios.
                  </span>
                </label>
                <label className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <input
                    type="checkbox"
                    checked={aceptaDatos}
                    onChange={(e) => setAceptaDatos(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
                  />
                  <span>
                    Autorizo el tratamiento de mis datos personales según la{" "}
                    <Link
                      href="/politica-datos"
                      target="_blank"
                      className="text-accent underline hover:text-white"
                    >
                      política de datos
                    </Link>{" "}
                    (Ley 1581 de 2012).
                  </span>
                </label>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={firmar}
                  disabled={enviando}
                >
                  <FileSignature size={18} />{" "}
                  {enviando ? "Firmando..." : "Aceptar y firmar el contrato"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-border-glass">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-text-secondary md:flex-row md:justify-between md:px-8">
          <span>biwov_ · Katherine Usma Aristizábal · Manizales, Colombia</span>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-white"
          >
            Visita el sitio web de biwov →
          </a>
        </div>
      </footer>
    </div>
  );
}
