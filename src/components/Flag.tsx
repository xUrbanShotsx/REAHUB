export function Flag({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path
        d="M3 15V1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M3.5 1.5 14 5 3.5 8.5Z" fill="var(--accent)" />
    </svg>
  );
}
