"use client";

import { cn } from "@/lib/utils";
import { CAMINOS_NECESIDAD } from "@/data/necesidades";
import {
  ESTADOS_BRANDING,
  GESTIONES_LEADS,
  RANGOS_PRESUPUESTO,
  RANGOS_SEGUIDORES,
  REDES_SOCIALES,
  TRAYECTORIAS,
} from "@/lib/clasificacion";
import type {
  EstadoBranding,
  GestionLeads,
  ObjetivoPrincipal,
  PlataformaConSeguidores,
  RangoPresupuesto,
  RangoSeguidores,
  RedSocial,
  Trayectoria,
} from "@/lib/clasificacion";
import type { FormularioDiagnostico } from "./types";

function OptionCard({
  selected,
  onClick,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border p-5 text-left transition-all duration-200",
        selected
          ? "border-accent bg-accent/10 shadow-[0_0_24px_-8px_rgba(50,153,204,0.7)]"
          : "border-border-glass bg-white/[0.02] hover:border-accent/40 hover:bg-white/[0.05]",
      )}
    >
      <p className="font-medium text-white">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      )}
    </button>
  );
}

function Chip({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition-colors",
        selected
          ? "border-accent bg-accent/15 text-white"
          : "border-border-glass text-text-secondary hover:text-white",
      )}
    >
      {label}
    </button>
  );
}

const inputClass =
  "w-full rounded-xl border border-border-glass bg-white/[0.03] px-4 py-3 text-white placeholder:text-text-secondary/60 outline-none transition-colors focus:border-accent";

type StepProps = {
  data: FormularioDiagnostico;
  update: (patch: Partial<FormularioDiagnostico>) => void;
};

export function StepContacto({ data, update }: StepProps) {
  return (
    <div className="space-y-4">
      <input
        className={inputClass}
        placeholder="Tu nombre"
        value={data.nombre ?? ""}
        onChange={(e) => update({ nombre: e.target.value })}
      />
      <input
        className={inputClass}
        placeholder="Nombre de tu empresa"
        value={data.empresa ?? ""}
        onChange={(e) => update({ empresa: e.target.value })}
      />
      <input
        className={inputClass}
        placeholder="WhatsApp (con indicativo)"
        value={data.whatsapp ?? ""}
        onChange={(e) => update({ whatsapp: e.target.value })}
      />
      <input
        className={inputClass}
        type="email"
        placeholder="Correo electrónico"
        value={data.email ?? ""}
        onChange={(e) => update({ email: e.target.value })}
      />
    </div>
  );
}

const TRAYECTORIA_IDS: Trayectoria[] = ["nueva", "uno-tres", "mas-tres"];

export function StepNegocio({ data, update }: StepProps) {
  return (
    <div className="space-y-5">
      <input
        className={inputClass}
        placeholder="¿A qué se dedica tu negocio? (opcional)"
        value={data.tipoNegocio ?? ""}
        onChange={(e) => update({ tipoNegocio: e.target.value })}
      />
      <div className="space-y-3">
        {TRAYECTORIA_IDS.map((id) => (
          <OptionCard
            key={id}
            title={TRAYECTORIAS[id]}
            selected={data.trayectoria === id}
            onClick={() => update({ trayectoria: id })}
          />
        ))}
      </div>
    </div>
  );
}

const BRANDING_IDS: EstadoBranding[] = ["completo", "incompleto", "nada"];

export function StepBranding({ data, update }: StepProps) {
  return (
    <div className="space-y-3">
      {BRANDING_IDS.map((id) => (
        <OptionCard
          key={id}
          title={ESTADOS_BRANDING[id]}
          selected={data.brandingEstado === id}
          onClick={() => update({ brandingEstado: id })}
        />
      ))}
    </div>
  );
}

const PLATAFORMAS_CON_SEGUIDORES: PlataformaConSeguidores[] = [
  "instagram",
  "facebook",
  "tiktok",
];

export function StepRedes({ data, update }: StepProps) {
  const redes = data.redes ?? [];
  const seguidores = data.seguidores ?? {};

  const toggleRed = (id: RedSocial) => {
    if (id === "ninguna") {
      update({
        redes: redes.includes("ninguna") ? [] : ["ninguna"],
        seguidores: {},
      });
      return;
    }
    const sinNinguna = redes.filter((r) => r !== "ninguna");
    const yaEstaba = sinNinguna.includes(id);
    const nuevasRedes = yaEstaba ? sinNinguna.filter((r) => r !== id) : [...sinNinguna, id];

    let nuevosSeguidores = seguidores;
    if (yaEstaba && (id === "instagram" || id === "facebook" || id === "tiktok")) {
      const { [id]: _omit, ...resto } = seguidores;
      nuevosSeguidores = resto;
    }

    update({ redes: nuevasRedes, seguidores: nuevosSeguidores });
  };

  const plataformasActivas = PLATAFORMAS_CON_SEGUIDORES.filter((p) => redes.includes(p));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {REDES_SOCIALES.map((r) => (
          <OptionCard
            key={r.id}
            title={r.label}
            selected={redes.includes(r.id)}
            onClick={() => toggleRed(r.id)}
          />
        ))}
      </div>

      {plataformasActivas.map((plataforma) => (
        <div key={plataforma}>
          <p className="mb-2 text-sm font-medium text-white">
            Seguidores aproximados en{" "}
            {plataforma === "tiktok"
              ? "TikTok"
              : plataforma === "instagram"
                ? "Instagram"
                : "Facebook"}
          </p>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(RANGOS_SEGUIDORES) as [RangoSeguidores, string][]).map(
              ([id, label]) => (
                <Chip
                  key={id}
                  label={label}
                  selected={seguidores[plataforma] === id}
                  onClick={() =>
                    update({ seguidores: { ...seguidores, [plataforma]: id } })
                  }
                />
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const GESTION_LEADS_IDS: GestionLeads[] = ["nada", "excel", "crm-basico", "crm-avanzado"];

export function StepGestionLeads({ data, update }: StepProps) {
  return (
    <div className="space-y-3">
      {GESTION_LEADS_IDS.map((id) => (
        <OptionCard
          key={id}
          title={GESTIONES_LEADS[id]}
          selected={data.gestionLeads === id}
          onClick={() => update({ gestionLeads: id })}
        />
      ))}
    </div>
  );
}

export function StepObjetivo({ data, update }: StepProps) {
  return (
    <div className="space-y-3">
      {CAMINOS_NECESIDAD.map((camino) => (
        <OptionCard
          key={camino.id}
          title={camino.titulo}
          selected={data.objetivo === camino.id}
          onClick={() => update({ objetivo: camino.id as ObjetivoPrincipal })}
        />
      ))}
    </div>
  );
}

export function StepPresupuesto({ data, update }: StepProps) {
  return (
    <div className="space-y-3">
      <p className="-mt-2 mb-4 text-sm text-text-secondary">
        Nos referimos a lo que destinarías al mes a marketing digital: pauta
        publicitaria, contenido y las herramientas que hacen crecer tu marca
        en digital.
      </p>
      {(Object.entries(RANGOS_PRESUPUESTO) as [RangoPresupuesto, { etiqueta: string }][]).map(
        ([id, info]) => (
          <OptionCard
            key={id}
            title={info.etiqueta}
            selected={data.presupuesto === id}
            onClick={() => update({ presupuesto: id })}
          />
        ),
      )}
    </div>
  );
}

export function StepUrgencia({ data, update }: StepProps) {
  return (
    <textarea
      className={cn(inputClass, "min-h-32 resize-none")}
      placeholder="¿Qué necesitas con más urgencia? (opcional)"
      value={data.urgencia ?? ""}
      onChange={(e) => update({ urgencia: e.target.value })}
    />
  );
}
