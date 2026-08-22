import { QuoteForm } from "@/components/quote-form"
import { site } from "@/lib/site"

export function QuoteBlock() {
  return (
    <section id="quote" className="border-t border-gold/70 bg-ground">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-4xl sm:text-5xl">{site.quoteHeading}</h2>
        <div className="mt-8">
          <QuoteForm />
        </div>
      </div>
    </section>
  )
}
