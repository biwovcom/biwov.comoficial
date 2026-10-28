export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <circle
        cx="16"
        cy="16"
        r="11"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="54 16"
      />
      <path d="M22 6.5L29 9.5L23.5 14.5Z" fill="currentColor" />
    </svg>
  );
}
