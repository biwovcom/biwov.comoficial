"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { eliminarCompra } from "./actions";

export function BotonEliminar({ id, nombre }: { id: string; nombre: string }) {
  const [enCurso, start] = useTransition();
  return (
    <button
      type="button"
      disabled={enCurso}
      title="Eliminar esta compra"
      onClick={() => {
        if (!window.confirm(`¿Eliminar la compra de "${nombre}"? También se borra su contrato firmado del registro. No se puede deshacer.`)) return;
        start(async () => {
          const r = await eliminarCompra(id);
          if (!r.ok) window.alert(`No se pudo eliminar: ${r.error}`);
        });
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
      {enCurso ? "Eliminando…" : "Eliminar"}
    </button>
  );
}
