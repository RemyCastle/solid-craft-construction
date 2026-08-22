"use client"

import { CallPair } from "@/components/call-pair"
import { useLive } from "@/components/live-public"
import { QuoteForm } from "@/components/quote-form"

export function QuoteBlock() {
  const { copy } = useLive()

  return (
    <section id="quote" className="border-t border-gold/70 bg-ground">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-4xl sm:text-5xl">{copy.quoteHeading}</h2>
        <p className="mt-4 text-lg font-medium text-mute">{copy.heroLead}</p>
        <div className="mt-6">
          <CallPair />
        </div>
        <div className="mt-10">
          <QuoteForm />
        </div>
      </div>
    </section>
  )
}
