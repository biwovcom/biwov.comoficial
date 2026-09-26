"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function EliminarProspectoButton({ prospectoId, nombre }: { prospectoId: string; nombre: string }) {
  const router = useRouter();
  const [eliminando, setEliminando] = useState(false);

  const eliminar = async () => {
    const confirmado = window.confirm(
      `¿Eliminar a ${nombre}? Esto borra también su filtro y diagnóstico. No se puede deshacer.`,
    );
    if (!confirmado) return;

    setEliminando(true);
    const res = await fetch(`/api/panel/prospectos/${prospectoId}`, { method: "DELETE" });
    setEliminando(false);

    if (!res.ok) {
      window.alert("No se pudo eliminar el prospecto. Intenta de nuevo.");
      return;
    }

    router.push("/panel/prospectos");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={eliminar}
      disabled={eliminando}
      className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
    >
      <Trash2 size={16} />
      {eliminando ? "Eliminando..." : "Eliminar prospecto"}
    </button>
  );
}
