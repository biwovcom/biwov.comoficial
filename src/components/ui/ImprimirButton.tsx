"use client";

import { Button } from "@/components/ui/Button";

export function ImprimirButton() {
  return (
    <Button variant="secondary" onClick={() => window.print()}>
      Descargar en PDF
    </Button>
  );
}
