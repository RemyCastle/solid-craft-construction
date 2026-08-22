import { BrandMark } from "@/components/brand-mark"
import { Wordmark } from "@/components/wordmark"
import { people, site } from "@/lib/site"

export function CardLockup() {
  return (
    <article className="w-full max-w-[22rem] bg-card px-5 py-6 text-ink ring-1 ring-gold">
      <div className="flex items-start justify-between gap-3">
        {people.map((person) => (
          <a
            key={person.phoneTel}
            href={person.phoneTel}
            className="text-left leading-tight"
          >
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.12em]">
              {person.name}
            </span>
            <span className="mt-1 block text-[0.7rem] font-medium tracking-wide text-mute">
              {person.phoneCard}
            </span>
          </a>
        ))}
      </div>

      <div className="mt-7 flex flex-col items-center">
        <BrandMark priority className="h-[4.5rem] w-auto sm:h-20" />
        <div className="mt-4">
          <Wordmark />
        </div>
      </div>

      <p className="mt-8 text-center text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ink">
        {site.spanish}
      </p>
      <a
        href={site.emailMailto}
        className="mt-2 block text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink"
      >
        {site.email}
      </a>
    </article>
  )
}
