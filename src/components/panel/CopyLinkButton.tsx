"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function CopyLinkButton({ path, label }: { path: string; label: string }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    const url = `${window.location.origin}${path}`;
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copiar}
      className="flex items-center gap-2 rounded-xl border border-border-glass bg-white/[0.03] px-4 py-2.5 text-sm text-white transition-colors hover:bg-white/[0.06]"
    >
      {copiado ? <Check size={16} className="text-accent" /> : <Link2 size={16} />}
      {copiado ? "¡Link copiado!" : label}
    </button>
  );
}
