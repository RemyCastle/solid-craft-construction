"use client"

import { useLive } from "@/components/live-public"

export function CallPair() {
  const { copy } = useLive()

  return (
    <div className="flex w-full flex-col gap-3 sm:max-w-md">
      {copy.people.map((person) => (
        <a key={person.phoneTel} href={person.phoneTel} className="cta cta-call">
          {person.cta}
        </a>
      ))}
    </div>
  )
}
