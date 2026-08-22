export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <p className={compact ? "leading-none" : "text-center leading-none"}>
      <span className="font-display text-3xl font-extrabold uppercase tracking-[0.08em] sm:text-4xl">
        <span className="text-ink">Solid </span>
        <span className="text-gold">Craft</span>
      </span>
      <span className="rule mx-auto mt-2 max-w-[14rem] font-sans text-[0.7rem] font-medium uppercase tracking-[0.28em] text-ink">
        Construction
      </span>
      <span className="rule mx-auto mt-1 max-w-[10rem] font-sans text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-ink">
        LLC
      </span>
    </p>
  )
}
