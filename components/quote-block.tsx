import { CallPair } from "@/components/call-pair"
import { QuoteForm } from "@/components/quote-form"
import { site } from "@/lib/site"

export function QuoteBlock() {
  return (
    <section id="quote" className="border-t border-gold/70 bg-ground">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-4xl sm:text-5xl">{site.quoteHeading}</h2>
        <p className="mt-4 text-lg font-medium text-mute">{site.heroLead}</p>
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
