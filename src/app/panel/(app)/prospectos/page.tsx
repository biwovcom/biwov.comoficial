import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { FiltroNicho } from "@/components/panel/FiltroNicho";
import { BuscarProspecto } from "@/components/panel/BuscarProspecto";
import { TablaProspectos } from "@/components/panel/TablaProspectos";
import { type Categoria, type Prospecto } from "@/lib/panel/prospectos";
import { estaVencido } from "@/lib/panel/seguimiento";

export const dynamic = "force-dynamic";

const TABS: { id: Categoria | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "contacto", label: "Contactos" },
  { id: "lead", label: "Leads" },
  { id: "prospecto", label: "Prospectos" },
  { id: "cliente", label: "Clientes" },
];

export default async function ProspectosPage({
  searchParams,
}: {
  searchParams: Promise<{
    categoria?: string;
    nicho?: string;
    alerta?: string;
    vencido?: string;
    q?: string;
  }>;
}) {
  const { categoria, nicho, alerta, vencido, q } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: prospectos } = await supabase
    .from("prospectos")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Prospecto[]>();

  const { data: filtros } = await supabase
    .from("filtro_respuestas")
    .select("prospecto_id, razon, created_at")
    .order("created_at", { ascending: false })
    .returns<{ prospecto_id: string; razon: string; created_at: string }[]>();

  const razonPorProspecto: Record<string, string> = {};
  for (const f of filtros ?? []) {
    if (!(f.prospecto_id in razonPorProspecto)) {
      razonPorProspecto[f.prospecto_id] = f.razon;
    }
  }

  const todos = prospectos ?? [];
  const nichos = Array.from(
    new Set(todos.map((p) => p.nicho_mercado?.trim()).filter((n): n is string => Boolean(n))),
  ).sort((a, b) => a.localeCompare(b, "es"));

  const tabActiva: Categoria | "todos" =
    categoria === "contacto" ||
    categoria === "lead" ||
    categoria === "prospecto" ||
    categoria === "cliente"
      ? categoria
      : "todos";
  const soloAlerta = alerta === "1";
  const soloVencido = vencido === "1";
  const busqueda = q?.trim().toLowerCase() ?? "";
  const lista = todos
    .filter((p) => tabActiva === "todos" || p.categoria === tabActiva)
    .filter((p) => !nicho || p.nicho_mercado === nicho)
    .filter((p) => !soloAlerta || Boolean(p.seguimiento))
    .filter((p) => !soloVencido || estaVencido(p.seguimiento, p.fecha_ultimo_seguimiento))
    .filter(
      (p) =>
        !busqueda ||
        p.nombre.toLowerCase().includes(busqueda) ||
        (p.empresa?.toLowerCase().includes(busqueda) ?? false) ||
        (p.redes_sociales?.toLowerCase().includes(busqueda) ?? false),
    );
  const base = nicho ? todos.filter((p) => p.nicho_mercado === nicho) : todos;
  const conAlertaTotal = base.filter((p) => p.seguimiento).length;
  const vencidosTotal = base.filter((p) => estaVencido(p.seguimiento, p.fecha_ultimo_seguimiento)).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Embudo</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {lista.length} registro{lista.length === 1 ? "" : "s"} — filtra por etapa para no
            mezclar fríos con los que ya son clientes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <BuscarProspecto />
          <Link href="/panel/prospectos/nuevo">
            <Button>Nuevo prospecto</Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const base = nicho ? todos.filter((p) => p.nicho_mercado === nicho) : todos;
            const cantidad = tab.id === "todos" ? base.length : base.filter((p) => p.categoria === tab.id).length;
            const activa = tab.id === tabActiva;
            const params = new URLSearchParams();
            if (tab.id !== "todos") params.set("categoria", tab.id);
            if (nicho) params.set("nicho", nicho);
            const query = params.toString();
            return (
              <Link
                key={tab.id}
                href={`/panel/prospectos${query ? `?${query}` : ""}`}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition-colors",
                  activa
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : "border-border-glass bg-white/[0.03] text-text-secondary hover:text-white",
                )}
              >
                {tab.label} ({cantidad})
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          {conAlertaTotal > 0 && (
            <Link
              href={(() => {
                const params = new URLSearchParams();
                if (tabActiva !== "todos") params.set("categoria", tabActiva);
                if (nicho) params.set("nicho", nicho);
                if (!soloAlerta) params.set("alerta", "1");
                const query = params.toString();
                return `/panel/prospectos${query ? `?${query}` : ""}`;
              })()}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-colors",
                soloAlerta
                  ? "border-amber-500/50 bg-amber-500/15 text-amber-300"
                  : "border-border-glass bg-white/[0.03] text-text-secondary hover:text-white",
              )}
            >
              <AlertTriangle size={14} />
              Con alerta ({conAlertaTotal})
            </Link>
          )}
          {vencidosTotal > 0 && (
            <Link
              href={(() => {
                const params = new URLSearchParams();
                if (tabActiva !== "todos") params.set("categoria", tabActiva);
                if (nicho) params.set("nicho", nicho);
                if (!soloVencido) params.set("vencido", "1");
                const query = params.toString();
                return `/panel/prospectos${query ? `?${query}` : ""}`;
              })()}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-colors",
                soloVencido
                  ? "border-red-500/50 bg-red-500/15 text-red-300"
                  : "border-border-glass bg-white/[0.03] text-text-secondary hover:text-white",
              )}
            >
              <AlertTriangle size={14} />
              Vencidos ({vencidosTotal})
            </Link>
          )}
          {nichos.length > 0 && <FiltroNicho nichos={nichos} />}
        </div>
      </div>

      <div className="mt-6">
        <TablaProspectos lista={lista} razonPorProspecto={razonPorProspecto} />
      </div>
    </div>
  );
}
