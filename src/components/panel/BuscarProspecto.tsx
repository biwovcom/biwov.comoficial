"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function BuscarProspecto() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [valor, setValor] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const actual = searchParams.get("q") ?? "";
    if (valor === actual) return;

    const id = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (valor.trim()) {
        params.set("q", valor.trim());
      } else {
        params.delete("q");
      }
      const query = params.toString();
      router.push(`/panel/prospectos${query ? `?${query}` : ""}`);
    }, 350);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);

  return (
    <div className="relative w-full sm:w-64">
      <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
      <Input
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Buscar por nombre..."
        className="pl-10"
      />
    </div>
  );
}
