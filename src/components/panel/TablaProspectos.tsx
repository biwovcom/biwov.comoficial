"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHead, TableBody, Th, Tr, Td } from "@/components/ui/Table";
import { cn } from "@/lib/utils";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import {
  BADGE_VARIANTE_CATEGORIA,
  ESTILO_SEGUIMIENTO,
  NOMBRES_CATEGORIA,
  NOMBRES_PASO,
  type Prospecto,
} from "@/lib/panel/prospectos";
import { diasDesde, estaVencido } from "@/lib/panel/seguimiento";

function celda(valor: string | null): string {
  return valor && valor.trim() !== "" ? valor : "—";
}

export function TablaProspectos({
  lista,
  razonPorProspecto,
}: {
  lista: Prospecto[];
  razonPorProspecto: Record<string, string>;
}) {
  const router = useRouter();
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());
  const [eliminando, setEliminando] = useState(false);

  const todosSeleccionados = lista.length > 0 && seleccionados.size === lista.length;

  const alternarTodos = () => {
    setSeleccionados(todosSeleccionados ? new Set() : new Set(lista.map((p) => p.id)));
  };

  const alternarUno = (id: string) => {
    setSeleccionados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const eliminarSeleccionados = async () => {
    const cantidad = seleccionados.size;
    if (cantidad === 0) return;
    const confirmado = window.confirm(
      `¿Eliminar ${cantidad} prospecto${cantidad === 1 ? "" : "s"}? Esto borra también su filtro y diagnóstico. No se puede deshacer.`,
    );
    if (!confirmado) return;

    setEliminando(true);
    const res = await fetch("/api/panel/prospectos/eliminar-varios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(seleccionados) }),
    });
    setEliminando(false);

    if (!res.ok) {
      window.alert("No se pudo eliminar. Intenta de nuevo.");
      return;
    }
    setSeleccionados(new Set());
    router.refresh();
  };

  return (
    <div>
      {seleccionados.size > 0 && (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3">
          <span className="text-sm text-white">
            {seleccionados.size} seleccionado{seleccionados.size === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            onClick={eliminarSeleccionados}
            disabled={eliminando}
            className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-50"
          >
            <Trash2 size={16} />
            {eliminando ? "Eliminando..." : "Eliminar seleccionados"}
          </button>
        </div>
      )}

      <Table>
        <TableHead>
          <Th className="w-8">
            <input
              type="checkbox"
              checked={todosSeleccionados}
              onChange={alternarTodos}
              aria-label="Seleccionar todos"
              className="h-4 w-4 accent-accent"
            />
          </Th>
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
              <Td colSpan={10} className="py-8 text-center text-text-secondary">
                No hay registros en esta categoría.
              </Td>
            </Tr>
          )}
          {lista.map((p) => (
            <Tr key={p.id} className={cn("hover:bg-white/[0.03]", seleccionados.has(p.id) && "bg-accent/5")}>
              <Td>
                <input
                  type="checkbox"
                  checked={seleccionados.has(p.id)}
                  onChange={() => alternarUno(p.id)}
                  aria-label={`Seleccionar a ${p.nombre}`}
                  className="h-4 w-4 accent-accent"
                />
              </Td>
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
                        "mt-1 flex max-w-[170px] items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
                        estaVencido(p.seguimiento, p.fecha_ultimo_seguimiento)
                          ? "border-red-500/50 bg-red-500/15 text-red-300"
                          : ESTILO_SEGUIMIENTO,
                      )}
                      title={p.seguimiento}
                    >
                      <AlertTriangle size={10} className="shrink-0" />
                      <span className="min-w-0 truncate">{p.seguimiento}</span>
                      {(() => {
                        const dias = diasDesde(p.fecha_ultimo_seguimiento);
                        return dias !== null ? (
                          <span className="shrink-0 whitespace-nowrap">· {dias}d</span>
                        ) : null;
                      })()}
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
                  {razonPorProspecto[p.id] ?? "—"}
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
  );
}
