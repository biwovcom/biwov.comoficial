"use client";

import { useState } from "react";

export function CopiarEnlace({ ruta, titulo }: { ruta: string; titulo: string }) {
  const [ok, setOk] = useState(false);
  const url = () => `${window.location.origin}${ruta}`;
  return (
    <>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url());
            setOk(true);
            setTimeout(() => setOk(false), 2000);
          } catch {
            window.prompt("Copia el enlace:", url());
          }
        }}
        className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:border-accent"
      >
        {ok ? "¡Copiado!" : "Copiar enlace"}
      </button>
      <button
        type="button"
        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${titulo}: ${url()}`)}`, "_blank")}
        className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:border-accent"
      >
        Enviar por WhatsApp
      </button>
    </>
  );
}
