"use client";

import { useState } from "react";
import Link from "next/link";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { FirmaDigital, type DatosFirma } from "./FirmaDigital";
import { ReciboFirmado } from "@/components/propuestas/ReciboFirmado";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV } from "@/lib/contacto";
import { VERSION_CONTRATO, NOMBRE_TIPO_CONTRATO, type TipoContrato } from "@/lib/contrato";

const CONTACTO_INICIAL = { nombre: "", whatsapp: "", email: "", empresa: "" };

export interface ContactoCompra {
  nombre: string;
  whatsapp: string;
  email: string;
  empresa: string;
}

export function CompraFormulario({
  tiposContrato,
  nombreItem,
  montoFormateado,
  mensajeWhatsApp,
  onConfirmar,
}: {
  tiposContrato: TipoContrato[];
  nombreItem: string;
  montoFormateado: string;
  mensajeWhatsApp: string;
  onConfirmar: (datos: {
    contacto: ContactoCompra;
    aceptaContrato: boolean;
    aceptaDatos: boolean;
    nombreFirmante: string;
    firmaImagenBase64: string;
  }) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [contacto, setContacto] = useState(CONTACTO_INICIAL);
  const [aceptaContratos, setAceptaContratos] = useState<Record<string, boolean>>({});
  const [aceptaDatos, setAceptaDatos] = useState(false);
  const [firma, setFirma] = useState<DatosFirma>({ nombreFirmante: "", firmaImagenBase64: null });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const todosLosContratosAceptados = tiposContrato.every((t) => aceptaContratos[t]);

  const confirmar = async () => {
    if (!contacto.nombre.trim() || (!contacto.email.trim() && !contacto.whatsapp.trim())) {
      setError("Escribe tu nombre y un correo o WhatsApp.");
      return;
    }
    if (!todosLosContratosAceptados || !aceptaDatos) {
      setError("Debes aceptar el contrato y el tratamiento de tus datos para continuar.");
      return;
    }
    if (!firma.firmaImagenBase64 || !firma.nombreFirmante.trim()) {
      setError("Falta tu firma: escribe tu nombre y firma en el recuadro.");
      return;
    }
    setEnviando(true);
    setError(null);
    const ventanaWhatsApp = window.open("", "_blank");
    const resultado = await onConfirmar({
      contacto,
      aceptaContrato: true,
      aceptaDatos,
      nombreFirmante: firma.nombreFirmante,
      firmaImagenBase64: firma.firmaImagenBase64,
    });
    setEnviando(false);
    if (!resultado.ok) {
      ventanaWhatsApp?.close();
      setError(resultado.error ?? "No se pudo enviar. Intenta de nuevo.");
      return;
    }
    const urlWhatsApp = linkWhatsApp(contacto.whatsapp || WHATSAPP_BIWOV, mensajeWhatsApp);
    if (ventanaWhatsApp) {
      ventanaWhatsApp.location.href = urlWhatsApp;
    } else {
      window.open(urlWhatsApp, "_blank");
    }
    setEnviado(true);
  };

  if (enviado) {
    const fechaFirma = new Date().toLocaleString("es-CO", { dateStyle: "long", timeStyle: "short" });
    return (
      <div>
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 text-center print:hidden">
          <p className="text-2xl">✅</p>
          <p className="mt-2 text-sm text-white">
            ¡Gracias, {contacto.nombre.split(" ")[0]}! Quedó firmado digitalmente. Te abrimos
            WhatsApp para coordinar el pago — si no se abrió, dale clic aquí abajo.
          </p>
          <a
            href={linkWhatsApp(contacto.whatsapp || WHATSAPP_BIWOV, mensajeWhatsApp)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block"
          >
            <Button size="lg" className="w-full">
              Abrir WhatsApp
            </Button>
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border-glass py-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-white"
          >
            <Printer size={14} /> Descargar comprobante firmado (PDF)
          </button>
        </div>
        <div className="hidden print:block">
          <ReciboFirmado
            itemNombre={nombreItem}
            monto={montoFormateado}
            nombreFirmante={firma.nombreFirmante}
            empresa={contacto.empresa || undefined}
            firmaImagenBase64={firma.firmaImagenBase64 ?? ""}
            fechaFirma={fechaFirma}
            tipoContratoNombre={tiposContrato.map((t) => NOMBRE_TIPO_CONTRATO[t]).join(" + ")}
            versionContrato={tiposContrato.map((t) => VERSION_CONTRATO[t]).join(" / ")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 print:hidden">
      <p className="text-sm text-text-secondary">
        Déjanos tus datos, firma y confirmamos — te escribimos por WhatsApp para coordinar el pago.
      </p>
      <div>
        <Label htmlFor="compra-nombre">Nombre completo</Label>
        <Input
          id="compra-nombre"
          value={contacto.nombre}
          onChange={(e) => setContacto({ ...contacto, nombre: e.target.value })}
          autoComplete="name"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="compra-whatsapp">WhatsApp</Label>
          <Input
            id="compra-whatsapp"
            value={contacto.whatsapp}
            onChange={(e) => setContacto({ ...contacto, whatsapp: e.target.value })}
            autoComplete="tel"
          />
        </div>
        <div>
          <Label htmlFor="compra-email">Correo</Label>
          <Input
            id="compra-email"
            type="email"
            value={contacto.email}
            onChange={(e) => setContacto({ ...contacto, email: e.target.value })}
            autoComplete="email"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="compra-empresa">Empresa (opcional)</Label>
        <Input
          id="compra-empresa"
          value={contacto.empresa}
          onChange={(e) => setContacto({ ...contacto, empresa: e.target.value })}
          autoComplete="organization"
        />
      </div>

      <FirmaDigital nombreSugerido={contacto.nombre} onChange={setFirma} />

      {tiposContrato.map((tipo) => (
        <label key={tipo} className="flex items-start gap-2.5 text-xs text-text-secondary">
          <input
            type="checkbox"
            checked={Boolean(aceptaContratos[tipo])}
            onChange={(e) => setAceptaContratos({ ...aceptaContratos, [tipo]: e.target.checked })}
            className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
          />
          <span>
            He leído y acepto el{" "}
            <Link href={`/contrato?tipo=${tipo}`} target="_blank" className="text-accent underline hover:text-white">
              contrato de {NOMBRE_TIPO_CONTRATO[tipo].toLowerCase()}
            </Link>
            .
          </span>
        </label>
      ))}
      <label className="flex items-start gap-2.5 text-xs text-text-secondary">
        <input
          type="checkbox"
          checked={aceptaDatos}
          onChange={(e) => setAceptaDatos(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
        />
        <span>
          Autorizo el tratamiento de mis datos personales según la{" "}
          <Link href="/politica-datos" target="_blank" className="text-accent underline hover:text-white">
            política de datos
          </Link>
          .
        </span>
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button size="lg" className="w-full" onClick={confirmar} disabled={enviando}>
        {enviando ? "Enviando..." : `Firmar y confirmar — ${montoFormateado}`}
      </Button>
    </div>
  );
}
