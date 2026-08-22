import { people } from "@/lib/site"

export function CallPair() {
  return (
    <div className="flex w-full flex-col gap-3 sm:max-w-md">
      {people.map((person) => (
        <a key={person.phoneTel} href={person.phoneTel} className="cta cta-call">
          {person.cta}
        </a>
      ))}
    </div>
  )
}
