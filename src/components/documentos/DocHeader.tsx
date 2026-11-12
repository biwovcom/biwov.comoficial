import Link from "next/link";
import { LogoMark } from "@/components/layout/LogoMark";

/** Barra superior de los documentos privados que se le envían al cliente. */
export function DocHeader({ volver }: { volver?: { href: string; texto: string } }) {
  return (
    <header className="border-b border-border-glass print:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-5 md:px-8">
        <span className="flex items-center gap-2 font-logo text-2xl font-bold">
          <LogoMark className="h-7 w-7 text-white" />
          biwov_
        </span>
        <div className="flex items-center gap-2">
          {volver ? (
            <Link
              href={volver.href}
              className="rounded-full border border-border-glass px-4 py-2 text-xs font-semibold text-white/85 transition-colors hover:border-accent hover:text-white"
            >
              ← {volver.texto}
            </Link>
          ) : (
            <span className="rounded-full border border-border-glass px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
              Documento privado
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
