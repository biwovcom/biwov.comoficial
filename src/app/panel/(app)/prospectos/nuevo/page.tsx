import { NuevoProspectoForm } from "./NuevoProspectoForm";

export default function NuevoProspectoPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Nuevo prospecto</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Registra los datos básicos. Luego podrás hacerle el filtro rápido y el diagnóstico.
      </p>
      <div className="mt-8">
        <NuevoProspectoForm />
      </div>
    </div>
  );
}
