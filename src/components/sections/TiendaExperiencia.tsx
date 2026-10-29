"use client";

import { useState } from "react";
import { TiendaCatalogo } from "./TiendaCatalogo";
import { Complementos } from "./Complementos";
import { useTRM } from "@/hooks/useTRM";
import type { Moneda } from "@/lib/moneda";

export function TiendaExperiencia() {
  const [moneda, setMoneda] = useState<Moneda>("COP");
  const { trm } = useTRM();

  return (
    <>
      <TiendaCatalogo moneda={moneda} setMoneda={setMoneda} trm={trm} />
      <Complementos moneda={moneda} trm={trm} />
    </>
  );
}
