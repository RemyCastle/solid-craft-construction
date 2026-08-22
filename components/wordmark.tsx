export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <p className={compact ? "leading-none" : "text-center leading-none"}>
      <span className="font-display text-2xl font-semibold uppercase tracking-[0.12em] sm:text-3xl">
        <span className="text-ink">Solid </span>
        <span className="text-gold">Craft</span>
      </span>
      <span className="rule mx-auto mt-2 max-w-[13rem] text-[0.7rem] font-medium uppercase tracking-[0.28em] text-ink">
        Construction
      </span>
      <span className="mt-1 block text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-gold">
        LLC
      </span>
    </p>
  )
}
