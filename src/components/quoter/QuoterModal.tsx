"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import { useQuoter } from "./QuoterProvider";
import { ProgressBar } from "./ProgressBar";
import {
  StepContacto,
  StepNegocio,
  StepRedes,
  StepGestionLeads,
  StepBranding,
  StepObjetivo,
  StepPresupuesto,
  StepUrgencia,
} from "./FormSteps";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { clasificarNegocio, type RespuestasDiagnostico } from "@/lib/clasificacion";
import type { FormularioDiagnostico, VistaCotizador } from "./types";

const STEPS = [
  { title: "Cuéntanos de ti", Component: StepContacto },
  { title: "Tu negocio", Component: StepNegocio },
  { title: "¿Qué redes y canales manejas hoy?", Component: StepRedes },
  { title: "¿Cómo manejas hoy tus clientes y leads?", Component: StepGestionLeads },
  { title: "¿Ya tienes identidad de marca?", Component: StepBranding },
  { title: "¿Cuál es tu objetivo principal?", Component: StepObjetivo },
  { title: "Tu presupuesto de marketing digital", Component: StepPresupuesto },
  { title: "¿Qué necesitas con más urgencia?", Component: StepUrgencia },
];

function esValido(step: number, data: FormularioDiagnostico): boolean {
  switch (step) {
    case 0:
      return Boolean(data.nombre && data.whatsapp && data.email);
    case 1:
      return Boolean(data.trayectoria);
    case 2: {
      const redes = data.redes ?? [];
      if (redes.length === 0) return false;
      const seguidores = data.seguidores ?? {};
      return (["instagram", "facebook", "tiktok"] as const).every(
        (p) => !redes.includes(p) || Boolean(seguidores[p]),
      );
    }
    case 3:
      return Boolean(data.gestionLeads);
    case 4:
      return Boolean(data.brandingEstado);
    case 5:
      return Boolean(data.objetivo);
    case 6:
      return Boolean(data.presupuesto);
    default:
      return true;
  }
}

const DATA_INICIAL: FormularioDiagnostico = { redes: [], seguidores: {} };

export function QuoterModal() {
  const { isOpen, prefillObjetivo, close } = useQuoter();
  const [vista, setVista] = useState<VistaCotizador>("form");
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormularioDiagnostico>(DATA_INICIAL);
  const [enviandoLead, setEnviandoLead] = useState(false);

  useEffect(() => {
    if (isOpen && prefillObjetivo) {
      setData((prev) => ({ ...prev, objetivo: prefillObjetivo }));
    }
  }, [isOpen, prefillObjetivo]);

  const reset = () => {
    setVista("form");
    setStep(0);
    setData(DATA_INICIAL);
  };

  const handleClose = () => {
    close();
    setTimeout(reset, 300);
  };

  const update = (patch: Partial<FormularioDiagnostico>) =>
    setData((prev) => ({ ...prev, ...patch }));

  const enviarInformacion = async () => {
    if (enviandoLead) return;
    setEnviandoLead(true);
    try {
      const respuestas = data as RespuestasDiagnostico;
      const { ecosistema } = clasificarNegocio(respuestas);
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formulario: data,
          ecosistemaRecomendado: ecosistema,
          canal: "diagnostico",
        }),
      });
    } finally {
      setEnviandoLead(false);
      setVista("enviado");
    }
  };

  const irSiguiente = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    enviarInformacion();
  };

  const StepComponent = STEPS[step].Component;

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
              {vista === "form" && step > 0 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
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

            {vista === "form" && (
              <div>
                <ProgressBar step={step} total={STEPS.length} />
                <h3 className="mt-6 mb-6 text-xl font-semibold text-white">
                  {STEPS[step].title}
                </h3>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                  >
                    <StepComponent data={data} update={update} />
                  </motion.div>
                </AnimatePresence>
                <Button
                  size="lg"
                  className="mt-8 w-full"
                  disabled={!esValido(step, data) || enviandoLead}
                  onClick={irSiguiente}
                >
                  {step === STEPS.length - 1
                    ? enviandoLead
                      ? "Enviando..."
                      : "Enviar mi información"
                    : "Continuar"}
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
                    ¡Gracias, {data.nombre?.split(" ")[0] ?? ""}!
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    Ya tenemos tu información. Nos estaremos contactando
                    contigo por WhatsApp o correo para enviarte la propuesta y
                    la cotización de tu ecosistema.
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
