import { Input } from "./Input";
import { Select } from "./Select";
import { PAISES } from "@/lib/panel/paises";

const INDICATIVOS = Array.from(new Set(PAISES.filter((p) => p.indicativo).map((p) => p.indicativo)));

export function PhoneInput({
  codigo,
  numero,
  onCodigoChange,
  onNumeroChange,
}: {
  codigo: string;
  numero: string;
  onCodigoChange: (codigo: string) => void;
  onNumeroChange: (numero: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <div className="w-28 shrink-0">
        <Select
          value={codigo}
          onChange={(e) => onCodigoChange(e.target.value)}
          aria-label="Indicativo"
        >
          {INDICATIVOS.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </Select>
      </div>
      <div className="min-w-0 flex-1">
        <Input
          placeholder="300 000 0000"
          value={numero}
          onChange={(e) => onNumeroChange(e.target.value)}
        />
      </div>
    </div>
  );
}
