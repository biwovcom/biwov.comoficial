import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHead, TableBody, Th, Tr, Td } from "@/components/ui/Table";
import { cn } from "@/lib/utils";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import {
  BADGE_VARIANTE_CATEGORIA,
  NOMBRES_CATEGORIA,
  NOMBRES_PASO,
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
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: prospectos } = await supabase
    .from("prospectos")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Prospecto[]>();

  const todos = prospectos ?? [];
  const tabActiva: Categoria | "todos" =
    categoria === "contacto" ||
    categoria === "lead" ||
    categoria === "prospecto" ||
    categoria === "cliente"
      ? categoria
      : "todos";
  const lista = tabActiva === "todos" ? todos : todos.filter((p) => p.categoria === tabActiva);

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
        <Link href="/panel/prospectos/nuevo">
          <Button>Nuevo prospecto</Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const cantidad =
            tab.id === "todos" ? todos.length : todos.filter((p) => p.categoria === tab.id).length;
          const activa = tab.id === tabActiva;
          return (
            <Link
              key={tab.id}
              href={tab.id === "todos" ? "/panel/prospectos" : `/panel/prospectos?categoria=${tab.id}`}
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
            <Th>Paso</Th>
          </TableHead>
          <TableBody>
            {lista.length === 0 && (
              <Tr>
                <Td colSpan={8} className="py-8 text-center text-text-secondary">
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
                  <Link href={`/panel/prospectos/${p.id}`} className="block font-medium text-white">
                    {p.nombre}
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
