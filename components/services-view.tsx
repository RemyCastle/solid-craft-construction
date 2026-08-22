import { CallPair } from "@/components/call-pair"
import { ServiceList } from "@/components/service-list"
import { site } from "@/lib/site"

export function ServicesView() {
  return (
    <div className="bg-ground">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-center font-display text-5xl uppercase tracking-[0.04em] sm:text-6xl">
          {site.workHeading}
        </h1>
        <ServiceList />
        <div className="mx-auto mt-12 flex max-w-md flex-col items-center gap-3">
          <CallPair />
          <a href={site.emailMailto} className="cta cta-mail w-full">
            {site.ctaSecondary}
          </a>
        </div>
      </div>
    </div>
  )
}
