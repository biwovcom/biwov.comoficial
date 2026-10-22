import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Table, TableHead, TableBody, Th, Tr, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { PLANES } from "@/data/planes";

interface PlanCompra {
  id: string;
  created_at: string;
  tipo: "plan" | "item" | "combo";
  plan_id: string | null;
  item_nombre: string | null;
  nombre: string;
  email: string | null;
  whatsapp: string | null;
  empresa: string | null;
  moneda: "COP" | "USD";
  monto: number;
  acepta_contrato: boolean;
  acepta_datos: boolean;
}

function nombrePlan(planId: string): string {
  return PLANES.find((p) => p.id === planId)?.nombre ?? planId;
}

function descripcionCompra(c: PlanCompra): string {
  if (c.tipo === "plan") return c.plan_id ? nombrePlan(c.plan_id) : "—";
  return c.item_nombre ?? "—";
}

const ETIQUETA_TIPO: Record<PlanCompra["tipo"], string> = {
  plan: "Plan",
  item: "Ítem suelto",
  combo: "Combo",
};

export default async function ComprasPage() {
  const supabase = await createSupabaseServerClient();
  const { data: compras } = await supabase
    .from("plan_compras")
    .select(
      "id, created_at, tipo, plan_id, item_nombre, nombre, email, whatsapp, empresa, moneda, monto, acepta_contrato, acepta_datos",
    )
    .order("created_at", { ascending: false })
    .returns<PlanCompra[]>();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Compras de planes</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Registro de cada &ldquo;Comprar ahora&rdquo; hecho desde el sitio público, con la aceptación del
        contrato y el tratamiento de datos. Esto es distinto del paquete que registras a mano en
        la ficha de cada cliente.
      </p>

      <div className="mt-6">
        <Table>
          <TableHead>
            <Th>Fecha</Th>
            <Th>Nombre</Th>
            <Th>Empresa</Th>
            <Th>Contacto</Th>
            <Th>Tipo</Th>
            <Th>Plan / ítem</Th>
            <Th>Monto</Th>
            <Th>Contrato</Th>
            <Th>Datos</Th>
          </TableHead>
          <TableBody>
            {(!compras || compras.length === 0) && (
              <Tr>
                <Td colSpan={9} className="py-8 text-center text-text-secondary">
                  Todavía no hay compras registradas.
                </Td>
              </Tr>
            )}
            {compras?.map((c) => (
              <Tr key={c.id}>
                <Td>{new Date(c.created_at).toLocaleString("es-CO")}</Td>
                <Td className="text-white">{c.nombre}</Td>
                <Td>{c.empresa ?? "—"}</Td>
                <Td>{c.whatsapp ?? c.email ?? "—"}</Td>
                <Td>{ETIQUETA_TIPO[c.tipo]}</Td>
                <Td>{descripcionCompra(c)}</Td>
                <Td>
                  {c.moneda === "USD" ? "US$" : "$"}
                  {Math.round(c.monto).toLocaleString(c.moneda === "USD" ? "en-US" : "es-CO")}{" "}
                  {c.moneda}
                </Td>
                <Td>
                  <Badge variant={c.acepta_contrato ? "verde" : "rojo"}>
                    {c.acepta_contrato ? "Sí" : "No"}
                  </Badge>
                </Td>
                <Td>
                  <Badge variant={c.acepta_datos ? "verde" : "rojo"}>
                    {c.acepta_datos ? "Sí" : "No"}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
