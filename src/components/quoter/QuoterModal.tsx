"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import { useQuoter } from "./QuoterProvider";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { PreguntasFiltro } from "@/components/panel/PreguntasFiltro";
import { respuestasCompletas, type RespuestasFiltro } from "@/lib/panel/filtroRapido";
import { PAISES, monedaDesdePais } from "@/lib/panel/paises";

interface Contacto {
  nombre: string;
  empresa: string;
  redesSociales: string;
  whatsapp: string;
  email: string;
  pais: string;
  ciudad: string;
}

const CONTACTO_INICIAL: Contacto = {
  nombre: "",
  empresa: "",
  redesSociales: "",
  whatsapp: "",
  email: "",
  pais: "",
  ciudad: "",
};

type Vista = "contacto" | "filtro" | "enviado";

export function QuoterModal() {
  const { isOpen, close } = useQuoter();
  const [vista, setVista] = useState<Vista>("contacto");
  const [contacto, setContacto] = useState<Contacto>(CONTACTO_INICIAL);
  const [codigoPais, setCodigoPais] = useState("+57");
  const [numero, setNumero] = useState("");
  const [respuestas, setRespuestas] = useState<RespuestasFiltro>({});
  const [prospectoId, setProspectoId] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setVista("contacto");
    setContacto(CONTACTO_INICIAL);
    setCodigoPais("+57");
    setNumero("");
    setRespuestas({});
    setProspectoId(null);
    setError(null);
  };

  const handleClose = () => {
    close();
    setTimeout(reset, 300);
  };

  const contactoValido = Boolean(contacto.nombre && numero.trim() && contacto.email);
  const moneda = monedaDesdePais(contacto.pais);

  const continuarDesdeContacto = async () => {
    if (!contactoValido || enviando) return;
    if (prospectoId) {
      setVista("filtro");
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch("/api/diagnostico/prospecto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contacto, whatsapp: `${codigoPais} ${numero.trim()}` }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "No se pudo continuar. Intenta de nuevo.");
        return;
      }
      const data = await res.json();
      setProspectoId(data.prospectoId);
      setVista("filtro");
    } finally {
      setEnviando(false);
    }
  };

  const enviarFiltro = async () => {
    if (!respuestasCompletas(respuestas) || !prospectoId || enviando) return;
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectoId, respuestas }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "No se pudo enviar. Intenta de nuevo.");
        return;
      }
      setVista("enviado");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto scrollbar-none rounded-3xl border border-border-glass bg-bg-base p-6 md:p-8"
            data-testid="quoter-modal"
          >
            <div className="mb-6 flex items-center justify-between">
              {vista === "filtro" ? (
                <button
                  onClick={() => setVista("contacto")}
                  className="text-text-secondary hover:text-white"
                >
                  <ArrowLeft size={20} />
                </button>
              ) : (
                <span />
              )}
              <button onClick={handleClose} className="text-text-secondary hover:text-white">
                <X size={20} />
              </button>
            </div>

            {vista === "contacto" && (
              <div>
                <ProgressBar step={0} total={2} />
                <h3 className="mt-6 mb-6 text-xl font-semibold text-white">Cuéntanos de ti</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="qm-nombre">Nombre</Label>
                    <Input
                      id="qm-nombre"
                      value={contacto.nombre}
                      onChange={(e) => setContacto((c) => ({ ...c, nombre: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="qm-empresa">Nombre de tu negocio</Label>
                    <Input
                      id="qm-empresa"
                      value={contacto.empresa}
                      onChange={(e) => setContacto((c) => ({ ...c, empresa: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="qm-redes-sociales">¿Cómo aparece en redes sociales?</Label>
                    <textarea
                      id="qm-redes-sociales"
                      rows={2}
                      placeholder="Ej: Instagram @minegocio, Facebook facebook.com/minegocio, TikTok @minegocio..."
                      className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-4 py-3 text-white placeholder:text-text-secondary/60 outline-none transition-colors focus:border-accent"
                      value={contacto.redesSociales}
                      onChange={(e) =>
                        setContacto((c) => ({ ...c, redesSociales: e.target.value }))
                      }
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="qm-pais">País</Label>
                      <Select
                        id="qm-pais"
                        value={contacto.pais}
                        onChange={(e) => setContacto((c) => ({ ...c, pais: e.target.value }))}
                      >
                        <option value="">Selecciona un país</option>
                        {PAISES.map((p) => (
                          <option key={p.pais} value={p.pais}>
                            {p.pais}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="qm-ciudad">Ciudad</Label>
                      <Input
                        id="qm-ciudad"
                        value={contacto.ciudad}
                        onChange={(e) => setContacto((c) => ({ ...c, ciudad: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="qm-whatsapp">WhatsApp</Label>
                    <PhoneInput
                      codigo={codigoPais}
                      numero={numero}
                      onCodigoChange={setCodigoPais}
                      onNumeroChange={setNumero}
                    />
                  </div>
                  <div>
                    <Label htmlFor="qm-email">Correo electrónico</Label>
                    <Input
                      id="qm-email"
                      type="email"
                      value={contacto.email}
                      onChange={(e) => setContacto((c) => ({ ...c, email: e.target.value }))}
                    />
                  </div>
                </div>

                {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

                <Button
                  size="lg"
                  className="mt-8 w-full"
                  disabled={!contactoValido || enviando}
                  onClick={continuarDesdeContacto}
                >
                  {enviando ? "Guardando..." : "Continuar"}
                </Button>
              </div>
            )}

            {vista === "filtro" && (
              <div>
                <ProgressBar step={1} total={2} />
                <h3 className="mt-6 mb-6 text-xl font-semibold text-white">
                  Cuéntanos sobre tu negocio
                </h3>
                <div className="space-y-6">
                  <PreguntasFiltro
                    respuestas={respuestas}
                    update={(patch) => setRespuestas((prev) => ({ ...prev, ...patch }))}
                    moneda={moneda}
                  />
                </div>

                {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

                <Button
                  size="lg"
                  className="mt-8 w-full"
                  disabled={!respuestasCompletas(respuestas) || enviando}
                  onClick={enviarFiltro}
                >
                  {enviando ? "Enviando..." : "Enviar mi información"}
                </Button>
              </div>
            )}

            {vista === "enviado" && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-8 text-center"
              >
                <GlassCard className="mx-auto max-w-md p-8">
                  <p className="text-2xl">📩</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">
                    ¡Gracias, {contacto.nombre.split(" ")[0]}!
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    Ya tenemos tu información. Nos estaremos contactando contigo por WhatsApp o
                    correo para conocer más sobre tu negocio y darte las mejores recomendaciones.
                  </p>
                  <Button size="lg" className="mt-6 w-full" onClick={handleClose}>
                    Cerrar
                  </Button>
                </GlassCard>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
