import { people } from "@/lib/site"

export function CallPair() {
  return (
    <div className="flex w-full flex-col gap-3 sm:max-w-sm">
      {people.map((person) => (
        <a key={person.phoneTel} href={person.phoneTel} className="cta cta-call">
          {person.cta}
          <span className="ml-2 text-base tracking-normal"> {person.phoneDisplay}</span>
        </a>
      ))}
    </div>
  )
}
