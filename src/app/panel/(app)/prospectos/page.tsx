import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHead, TableBody, Th, Tr, Td } from "@/components/ui/Table";
import { cn } from "@/lib/utils";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { FiltroNicho } from "@/components/panel/FiltroNicho";
import { BuscarProspecto } from "@/components/panel/BuscarProspecto";
import {
  BADGE_VARIANTE_CATEGORIA,
  ESTILO_SEGUIMIENTO,
  NOMBRES_CATEGORIA,
  NOMBRES_PASO,
  NOMBRES_SEGUIMIENTO,
  type Categoria,
  type Prospecto,
} from "@/lib/panel/prospectos";

export const dynamic = "force-dynamic";

function celda(valor: string | null): string {
  return valor && valor.trim() !== "" ? valor : "—";
}

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
  searchParams: Promise<{ categoria?: string; nicho?: string; alerta?: string; q?: string }>;
}) {
  const { categoria, nicho, alerta, q } = await searchParams;
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

  const razonPorProspecto = new Map<string, string>();
  for (const f of filtros ?? []) {
    if (!razonPorProspecto.has(f.prospecto_id)) {
      razonPorProspecto.set(f.prospecto_id, f.razon);
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
  const busqueda = q?.trim().toLowerCase() ?? "";
  const lista = todos
    .filter((p) => tabActiva === "todos" || p.categoria === tabActiva)
    .filter((p) => !nicho || p.nicho_mercado === nicho)
    .filter((p) => !soloAlerta || Boolean(p.seguimiento))
    .filter((p) => !busqueda || p.nombre.toLowerCase().includes(busqueda));
  const conAlertaTotal = (nicho ? todos.filter((p) => p.nicho_mercado === nicho) : todos).filter(
    (p) => p.seguimiento,
  ).length;

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
          {nichos.length > 0 && <FiltroNicho nichos={nichos} />}
        </div>
      </div>

      <div className="mt-6">
        <Table>
          <TableHead>
            <Th>Fecha</Th>
            <Th>Nombre</Th>
            <Th>Negocio</Th>
            <Th>Nicho</Th>
            <Th>WhatsApp</Th>
            <Th>Etiqueta</Th>
            <Th>Semáforo</Th>
            <Th>Resumen del filtro</Th>
            <Th>Paso</Th>
          </TableHead>
          <TableBody>
            {lista.length === 0 && (
              <Tr>
                <Td colSpan={9} className="py-8 text-center text-text-secondary">
                  No hay registros en esta categoría.
                </Td>
              </Tr>
            )}
            {lista.map((p) => (
              <Tr key={p.id} className="hover:bg-white/[0.03]">
                <Td>
                  <Link href={`/panel/prospectos/${p.id}`} className="block">
                    {new Date(p.created_at).toLocaleDateString("es-CO")}
                  </Link>
                </Td>
                <Td>
                  <Link href={`/panel/prospectos/${p.id}`} className="block">
                    <span className="font-medium text-white">{p.nombre}</span>
                    {p.seguimiento && (
                      <span
                        className={cn(
                          "mt-1 flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                          ESTILO_SEGUIMIENTO[p.seguimiento],
                        )}
                      >
                        <AlertTriangle size={11} />
                        {NOMBRES_SEGUIMIENTO[p.seguimiento]}
                      </span>
                    )}
                  </Link>
                </Td>
                <Td>{celda(p.empresa)}</Td>
                <Td>{celda(p.nicho_mercado)}</Td>
                <Td>
                  <a
                    href={linkWhatsApp(p.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {p.whatsapp}
                  </a>
                </Td>
                <Td>
                  {p.categoria ? (
                    <Badge variant={BADGE_VARIANTE_CATEGORIA[p.categoria]}>
                      {NOMBRES_CATEGORIA[p.categoria]}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td>
                  {p.semaforo ? (
                    <Badge variant={p.semaforo}>
                      {p.semaforo === "verde" ? "🟢" : p.semaforo === "amarillo" ? "🟡" : "🔴"}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td className="max-w-[240px]">
                  <span className="line-clamp-2 text-xs text-text-secondary">
                    {razonPorProspecto.get(p.id) ?? "—"}
                  </span>
                </Td>
                <Td>
                  <Badge>{NOMBRES_PASO[p.paso_actual]}</Badge>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
