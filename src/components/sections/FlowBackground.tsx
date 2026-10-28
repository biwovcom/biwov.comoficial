/** Fondo con franjas de luz que fluyen lento, en los azules de biwov — mismo
 * efecto de movimiento que bluecell.es, con la paleta propia de la marca. */
export function FlowBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="animate-flow-1 absolute -left-1/4 top-[-15%] h-[700px] w-[900px] rounded-full bg-gradient-to-br from-[#3299cc] via-[#0d3b66] to-transparent opacity-40 blur-[120px]" />
      <div className="animate-flow-2 absolute -right-1/4 bottom-[-20%] h-[600px] w-[800px] rounded-full bg-gradient-to-tr from-[#0d3b66] via-[#3299cc] to-transparent opacity-30 blur-[130px]" />
      <div className="animate-flow-3 absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-accent/15 blur-[150px]" />
    </div>
  );
}
