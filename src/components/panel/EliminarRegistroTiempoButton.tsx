"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function EliminarRegistroTiempoButton({ id }: { id: string }) {
  const router = useRouter();
  const [eliminando, setEliminando] = useState(false);

  const eliminar = async () => {
    if (!window.confirm("¿Eliminar este registro de tiempo?")) return;
    setEliminando(true);
    const res = await fetch(`/api/panel/tiempo/${id}`, { method: "DELETE" });
    setEliminando(false);

    if (!res.ok) {
      window.alert("No se pudo eliminar. Intenta de nuevo.");
      return;
    }
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={eliminar}
      disabled={eliminando}
      className="text-text-secondary transition-colors hover:text-red-400 disabled:opacity-50"
      aria-label="Eliminar registro"
      title="Eliminar registro"
    >
      <Trash2 size={16} />
    </button>
  );
}
