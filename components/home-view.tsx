import { BrandMark } from "@/components/brand-mark"
import { CallPair } from "@/components/call-pair"
import { ServiceList } from "@/components/service-list"
import { Wordmark } from "@/components/wordmark"
import { site } from "@/lib/site"

export function HomeView() {
  return (
    <div className="bg-ground">
      <section className="border-b border-gold/50">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-12 text-center sm:py-16">
          <BrandMark priority className="h-28 w-auto sm:h-36" />
          <div className="mt-5">
            <Wordmark />
          </div>
          <h1 className="mt-10 max-w-xl text-4xl text-ink sm:text-5xl md:text-6xl">
            {site.heroTitle}
          </h1>
          <p className="mt-5 max-w-md text-lg font-medium text-mute sm:text-xl">{site.heroLead}</p>
          <div className="mt-8 flex w-full flex-col items-center gap-3">
            <CallPair />
            <a href="#quote" className="cta cta-mail w-full sm:max-w-sm">
              {site.ctaSecondary} {site.email}
            </a>
          </div>
        </div>
      </section>

      <section id="services" className="border-b border-gold/50">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-center text-4xl sm:text-5xl">Services</h2>
          <ServiceList />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-4xl sm:text-5xl">Who</h2>
          <p className="mt-6 max-w-xl text-xl font-medium">{site.about}</p>
          <p className="mt-3 text-lg font-semibold text-gold">{site.spanish}</p>
        </div>
      </section>
    </div>
  )
}
