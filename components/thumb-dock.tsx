"use client"

import { useLive } from "@/components/live-public"

export function ThumbDock() {
  const { copy } = useLive()

  return (
    <nav
      aria-label="Call Joel, call Ahren, or email"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gold bg-ground pb-[env(safe-area-inset-bottom,0px)] md:hidden"
    >
      <div className="grid grid-cols-3">
        {copy.people.map((person) => (
          <a
            key={person.phoneTel}
            href={person.phoneTel}
            className="flex min-h-16 flex-col items-center justify-center bg-gold px-1 py-2 text-center text-ground first:border-r first:border-ground"
          >
            <span className="font-display text-lg uppercase leading-none">{person.dock}</span>
            <span className="mt-1 text-[10px] font-bold">{person.phoneDisplay}</span>
          </a>
        ))}
        <a
          href={copy.emailMailto}
          className="flex min-h-16 flex-col items-center justify-center border-l border-gold px-1 py-2 text-center"
        >
          <span className="font-display text-lg uppercase leading-none">{copy.ctaSecondary}</span>
        </a>
      </div>
    </nav>
  )
}
