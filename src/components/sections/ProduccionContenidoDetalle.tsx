import { PRODUCCION_CONTENIDO, NIVELES_PRODUCCION } from "@/data/addOns";
import { formatMoneda } from "@/lib/moneda";
import { cn } from "@/lib/utils";

export function ProduccionContenidoDetalle() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-text-secondary">{PRODUCCION_CONTENIDO.descripcion}</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">Ideal para</p>
          <p className="mt-1.5 text-sm text-white/90">{PRODUCCION_CONTENIDO.idealPara}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">Incluye</p>
          <ul className="mt-1.5 space-y-1">
            {PRODUCCION_CONTENIDO.incluye.map((item) => (
              <li key={item} className="text-xs text-white/90">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {NIVELES_PRODUCCION.map((nivel) => (
          <div
            key={nivel.id}
            className={cn(
              "rounded-2xl border p-4",
              nivel.id === "professional"
                ? "border-accent/50 bg-accent/5"
                : "border-border-glass bg-white/[0.02]",
            )}
          >
            <p className="text-sm font-semibold text-white">{nivel.nombre}</p>
            <p className="mt-0.5 text-base font-bold text-accent">{formatMoneda(nivel.precio, "COP")}</p>

            <dl className="mt-3 space-y-1.5 text-xs">
              <div className="flex justify-between gap-2">
                <dt className="text-text-secondary">Cámara</dt>
                <dd className="text-right text-white/90">{nivel.camara}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-text-secondary">Audio</dt>
                <dd className="text-right text-white/90">{nivel.audio}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-text-secondary">Iluminación</dt>
                <dd className="text-right text-white/90">{nivel.iluminacion}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-text-secondary">Estabilización</dt>
                <dd className="text-right text-white/90">{nivel.estabilizacion}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-text-secondary">Drone</dt>
                <dd className="text-right text-white/90">{nivel.drone}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-text-secondary">Dirección creativa</dt>
                <dd className="text-right text-white/90">{nivel.direccionCreativa}</dd>
              </div>
            </dl>

            <div className="mt-3 grid grid-cols-2 gap-1.5 border-t border-border-glass pt-3 text-xs">
              <p className="text-text-secondary">
                Producción: <span className="text-white/90">{nivel.tiempoProduccion}</span>
              </p>
              <p className="text-text-secondary">
                Fotos: <span className="text-white/90">{nivel.fotografias}</span>
              </p>
              <p className="text-text-secondary">
                Reels: <span className="text-white/90">{nivel.reels}</span>
              </p>
              <p className="text-text-secondary">
                B-Roll: <span className="text-white/90">{nivel.clipsBRoll}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
