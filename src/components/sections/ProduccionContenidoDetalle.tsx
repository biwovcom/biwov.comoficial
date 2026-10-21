import { PRODUCCION_CONTENIDO, NIVELES_PRODUCCION, PRODUCCION_VIDEO } from "@/data/addOns";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";
import { cn } from "@/lib/utils";

export function ProduccionContenidoDetalle({ moneda, trm }: { moneda: Moneda; trm: number }) {
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
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
            No incluye
          </p>
          <ul className="mt-1.5 space-y-1">
            {PRODUCCION_CONTENIDO.noIncluye.map((item) => (
              <li key={item} className="text-xs text-text-secondary">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        Paquete creativo completo (incluye guiones, copys y dirección)
      </p>

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
            <p className="mt-0.5 text-base font-bold text-accent">
              {formatCopEnMoneda(nivel.precio.cop, moneda, trm)}
            </p>

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
                B-Roll (videos de apoyo, no la toma principal): <span className="text-white/90">{nivel.clipsBRoll}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border-glass pt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Solo grabación y edición
        </p>
        <p className="mt-1 text-sm text-text-secondary">{PRODUCCION_VIDEO.descripcion}</p>

        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <ul className="space-y-1">
            {PRODUCCION_VIDEO.incluye.map((item) => (
              <li key={item} className="text-xs text-white/90">
                • {item}
              </li>
            ))}
          </ul>
          <ul className="space-y-1">
            {PRODUCCION_VIDEO.noIncluye.map((item) => (
              <li key={item} className="text-xs text-text-secondary">
                • {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-3 text-xs text-text-secondary">{PRODUCCION_VIDEO.reglaJornada}</p>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {PRODUCCION_VIDEO.paquetes.map((paquete) => (
            <div key={paquete.id} className="rounded-2xl border border-border-glass bg-white/[0.02] p-4">
              <p className="text-sm font-semibold text-white">
                {paquete.cantidadVideos} video{paquete.cantidadVideos === 1 ? "" : "s"}
                {paquete.esMensual && " / mes"}
              </p>
              <p className="mt-0.5 text-base font-bold text-accent">
                {formatCopEnMoneda(paquete.precio, moneda, trm)}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-text-secondary">
          Mínimo {PRODUCCION_VIDEO.minimoVideos} videos por pedido. {PRODUCCION_VIDEO.notaPrecio}
        </p>
      </div>
    </div>
  );
}
