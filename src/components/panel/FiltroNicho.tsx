"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";

export function FiltroNicho({ nichos }: { nichos: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const cambiar = (nicho: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nicho) {
      params.set("nicho", nicho);
    } else {
      params.delete("nicho");
    }
    const query = params.toString();
    router.push(`/panel/prospectos${query ? `?${query}` : ""}`);
  };

  return (
    <div className="w-full sm:w-64">
      <Select value={searchParams.get("nicho") ?? ""} onChange={(e) => cambiar(e.target.value)}>
        <option value="">Todos los nichos</option>
        {nichos.map((nicho) => (
          <option key={nicho} value={nicho}>
            {nicho}
          </option>
        ))}
      </Select>
    </div>
  );
}
