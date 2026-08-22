import { CallPair } from "@/components/call-pair"
import { CardLockup } from "@/components/card-lockup"
import { ServiceList } from "@/components/service-list"
import { site } from "@/lib/site"

export function HomeView() {
  return (
    <div className="bg-ground">
      <section className="border-b border-gold/50">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-10 text-center sm:py-14">
          <CardLockup />
          <h1 className="mt-10 max-w-xl text-4xl text-ink sm:text-5xl md:text-[3.4rem]">
            {site.heroTitle}
          </h1>
          <p className="mt-5 max-w-md text-lg font-medium text-mute sm:text-xl">{site.heroLead}</p>
          <div className="mt-8 flex w-full flex-col items-center gap-3">
            <CallPair />
            <a href={site.emailMailto} className="cta cta-mail w-full sm:max-w-md">
              {site.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      <section id="work" className="border-b border-gold/50">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-center text-4xl sm:text-5xl">{site.workHeading}</h2>
          <ServiceList />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-4xl sm:text-5xl">{site.aboutHeading}</h2>
          <p className="mt-6 max-w-xl text-xl font-medium">{site.about}</p>
        </div>
      </section>
    </div>
  )
}
