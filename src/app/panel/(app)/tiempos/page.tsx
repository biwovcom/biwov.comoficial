import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { Table, TableHead, TableBody, Th, Tr, Td } from "@/components/ui/Table";
import { NuevoRegistroTiempoForm } from "@/components/panel/NuevoRegistroTiempoForm";
import { EliminarRegistroTiempoButton } from "@/components/panel/EliminarRegistroTiempoButton";
import { resumenPorCategoria, type RegistroTiempo } from "@/lib/panel/tiempo";

export const dynamic = "force-dynamic";

function celda(valor: string | null): string {
  return valor && valor.trim() !== "" ? valor : "—";
}

function formatoHoras(horas: number): string {
  return `${horas.toFixed(2).replace(/\.00$/, "")} h`;
}

export default async function TiemposPage() {
  const supabase = await createSupabaseServerClient();
  const { data: registros } = await supabase
    .from("registros_tiempo")
    .select("*")
    .order("fecha", { ascending: false })
    .order("created_at", { ascending: false })
    .returns<RegistroTiempo[]>();

  const lista = registros ?? [];
  const resumen = resumenPorCategoria(lista);
  const totalHoras = lista.reduce((acc, r) => acc + r.horas, 0);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold text-white">Tiempos</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {lista.length} registro{lista.length === 1 ? "" : "s"} — {formatoHoras(totalHoras)} en
          total. Así vas a saber cuánto te demoras en cada tipo de trabajo.
        </p>
      </div>

      <div className="mt-6">
        <NuevoRegistroTiempoForm />
      </div>

      {resumen.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
            Promedio por tipo de trabajo
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumen.map((r) => (
              <GlassCard key={r.categoria} className="p-5">
                <p className="text-sm font-medium text-white">{r.categoria}</p>
                <p className="mt-2 text-2xl font-semibold text-accent">
                  {formatoHoras(r.promedioHoras)}
                </p>
                <p className="text-xs text-text-secondary">
                  promedio · {r.cantidad} registro{r.cantidad === 1 ? "" : "s"} ·{" "}
                  {formatoHoras(r.totalHoras)} en total
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
          Historial
        </h2>
        <div className="mt-4">
          <Table>
            <TableHead>
              <Th>Fecha</Th>
              <Th>Tipo de trabajo</Th>
              <Th>Proyecto</Th>
              <Th>Horas</Th>
              <Th>Notas</Th>
              <Th></Th>
            </TableHead>
            <TableBody>
              {lista.length === 0 && (
                <Tr>
                  <Td colSpan={6} className="py-8 text-center text-text-secondary">
                    Todavía no hay registros de tiempo.
                  </Td>
                </Tr>
              )}
              {lista.map((r) => (
                <Tr key={r.id}>
                  <Td>{new Date(`${r.fecha}T00:00:00`).toLocaleDateString("es-CO")}</Td>
                  <Td className="text-white">{r.categoria}</Td>
                  <Td>{celda(r.proyecto)}</Td>
                  <Td className="text-white">{formatoHoras(r.horas)}</Td>
                  <Td className="max-w-[240px]">
                    <span className="line-clamp-2 text-xs text-text-secondary">
                      {celda(r.notas)}
                    </span>
                  </Td>
                  <Td>
                    <EliminarRegistroTiempoButton id={r.id} />
                  </Td>
                </Tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
