"use client";

import { useEffect, useRef, useState } from "react";
import { Input, Label } from "@/components/ui/Input";

export interface DatosFirma {
  nombreFirmante: string;
  firmaImagenBase64: string | null;
}

export function FirmaDigital({
  nombreSugerido,
  onChange,
}: {
  nombreSugerido: string;
  onChange: (datos: DatosFirma) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dibujandoRef = useRef(false);
  const [nombreSobrescrito, setNombreSobrescrito] = useState<string | null>(null);
  const [vacio, setVacio] = useState(true);
  const nombreFirmante = nombreSobrescrito ?? nombreSugerido;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx?.scale(dpr, dpr);
  }, []);

  const emitir = () => {
    const canvas = canvasRef.current;
    onChange({
      nombreFirmante,
      firmaImagenBase64: canvas && !vacio ? canvas.toDataURL("image/png") : null,
    });
  };

  const posicion = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    dibujandoRef.current = true;
    const { x, y } = posicion(e);
    ctx.strokeStyle = "#1e3d52";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dibujandoRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = posicion(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (vacio) setVacio(false);
  };

  const onPointerUp = () => {
    if (!dibujandoRef.current) return;
    dibujandoRef.current = false;
    emitir();
  };

  const limpiar = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setVacio(true);
    onChange({ nombreFirmante, firmaImagenBase64: null });
  };

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="firma-nombre">Nombre completo de quien firma</Label>
        <Input
          id="firma-nombre"
          value={nombreFirmante}
          onChange={(e) => setNombreSobrescrito(e.target.value)}
          onBlur={emitir}
        />
      </div>
      <div>
        <Label>Firma (dibuja con el dedo o el mouse)</Label>
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          className="h-32 w-full touch-none rounded-xl border border-border-glass bg-white"
        />
        <button
          type="button"
          onClick={limpiar}
          className="mt-1.5 text-xs text-text-secondary underline hover:text-white"
        >
          Limpiar firma
        </button>
      </div>
    </div>
  );
}
