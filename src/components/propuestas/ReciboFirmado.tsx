export interface ReciboFirmadoProps {
  itemNombre: string;
  monto: string;
  nombreFirmante: string;
  empresa?: string;
  firmaImagenBase64: string;
  fechaFirma: string;
  tipoContratoNombre: string;
  versionContrato: string;
}

export function ReciboFirmado({
  itemNombre,
  monto,
  nombreFirmante,
  empresa,
  firmaImagenBase64,
  fechaFirma,
  tipoContratoNombre,
  versionContrato,
}: ReciboFirmadoProps) {
  return (
    <div className="bg-white px-2 py-2 text-[#111827]">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-logo text-2xl font-bold text-[#0f172a]">biwov_</span>
          <p className="mt-0.5 text-xs text-[#6b7280]">Agencia de Marketing Digital · Kathe Digital</p>
        </div>
        <p className="text-xs text-[#6b7280]">{fechaFirma}</p>
      </div>
      <div className="mt-3 h-1 w-full rounded-full bg-gradient-to-r from-[#1d4772] to-[#3d98cc]" />

      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-[#3d98cc]">
        Comprobante de compra y firma digital
      </p>
      <h1 className="mt-1 text-2xl font-bold text-[#0f172a]">{itemNombre}</h1>

      <div className="mt-5 rounded-2xl border border-[#e5e7eb] p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <p className="text-sm">
            <span className="text-[#6b7280]">Cliente: </span>
            <span className="font-medium text-[#111827]">{nombreFirmante}</span>
          </p>
          {empresa && (
            <p className="text-sm">
              <span className="text-[#6b7280]">Empresa: </span>
              <span className="font-medium text-[#111827]">{empresa}</span>
            </p>
          )}
          <p className="text-sm">
            <span className="text-[#6b7280]">Monto: </span>
            <span className="font-semibold text-[#1d4772]">{monto}</span>
          </p>
          <p className="text-sm">
            <span className="text-[#6b7280]">Contrato: </span>
            <span className="font-medium text-[#111827]">
              {tipoContratoNombre} (versión {versionContrato})
            </span>
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Firma digital</p>
        <div className="mt-2 rounded-2xl border border-[#e5e7eb] p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={firmaImagenBase64} alt={`Firma de ${nombreFirmante}`} className="h-28 w-full object-contain" />
          <p className="mt-2 text-xs text-[#6b7280]">
            Firmado digitalmente por {nombreFirmante} el {fechaFirma}.
          </p>
        </div>
      </div>

      <div className="mt-8 border-t border-[#e5e7eb] pt-3">
        <p className="text-[11px] text-[#9ca3af]">
          Este comprobante es evidencia de la aceptación electrónica del contrato (Ley 527 de 1999).
          biwov_ · Kathe Digital
        </p>
      </div>
    </div>
  );
}
