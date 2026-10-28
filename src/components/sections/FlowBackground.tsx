/** Fondo con franjas de luz que fluyen muy lento, en los azules de biwov —
 * movimiento sutil y contenido (no neón), pensado para leerse elegante. */
export function FlowBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="animate-flow-1 absolute -left-1/4 top-[-15%] h-[700px] w-[900px] rounded-full bg-gradient-to-br from-[#00c2e8] via-[#2e5b7e] to-transparent opacity-[0.16] blur-[140px]" />
      <div className="animate-flow-2 absolute -right-1/4 bottom-[-20%] h-[600px] w-[800px] rounded-full bg-gradient-to-tr from-[#2e5b7e] via-[#00c2e8] to-transparent opacity-[0.12] blur-[150px]" />
      <div className="animate-flow-3 absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-[160px]" />
    </div>
  );
}
