import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHead, TableBody, Th, Tr, Td } from "@/components/ui/Table";
import { NOMBRES_PASO, type Prospecto } from "@/lib/panel/prospectos";

export const dynamic = "force-dynamic";

function celda(valor: string | null): string {
  return valor && valor.trim() !== "" ? valor : "—";
}

export default async function ProspectosPage() {
  const supabase = await createSupabaseServerClient();
  const { data: prospectos } = await supabase
    .from("prospectos")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Prospecto[]>();

  const lista = prospectos ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Prospectos</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {lista.length} prospecto{lista.length === 1 ? "" : "s"} registrado{lista.length === 1 ? "" : "s"}.
          </p>
        </div>
        <Link href="/panel/prospectos/nuevo">
          <Button>Nuevo prospecto</Button>
        </Link>
      </div>

      <div className="mt-8">
        <Table>
          <TableHead>
            <Th>Fecha</Th>
            <Th>Nombre</Th>
            <Th>Negocio</Th>
            <Th>WhatsApp</Th>
            <Th>País</Th>
            <Th>Semáforo</Th>
            <Th>Paso</Th>
          </TableHead>
          <TableBody>
            {lista.length === 0 && (
              <Tr>
                <Td colSpan={7} className="py-8 text-center text-text-secondary">
                  Todavía no hay prospectos registrados.
                </Td>
              </Tr>
            )}
            {lista.map((p) => (
              <Tr key={p.id} className="cursor-pointer hover:bg-white/[0.03]">
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
                <Td>{celda(p.whatsapp)}</Td>
                <Td>{celda(p.pais)}</Td>
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
