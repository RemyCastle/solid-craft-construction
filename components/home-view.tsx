"use client"

import { BrandMark } from "@/components/brand-mark"
import { CallPair } from "@/components/call-pair"
import { useLive } from "@/components/live-public"
import { ReviewList } from "@/components/review-list"
import { ServiceList } from "@/components/service-list"
import { WorkStack } from "@/components/work-stack"
import { aboutLines } from "@/lib/public"

export function HomeView() {
  const { copy } = useLive()

  return (
    <div className="bg-ground">
      <section>
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-10 text-center sm:py-14">
          <BrandMark priority className="h-28 w-auto sm:h-36" />
          <h1 className="mt-8 max-w-xl text-4xl text-ink sm:text-5xl md:text-[3.4rem]">
            {copy.heroTitle}
          </h1>
          <p className="mt-5 max-w-md text-lg font-medium text-mute sm:text-xl">{copy.heroLead}</p>
          <div className="mt-8 flex w-full flex-col items-center gap-3">
            <CallPair />
            <a href={copy.emailMailto} className="cta cta-mail w-full sm:max-w-md">
              {copy.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      <section id="work" className="border-t border-gold/40">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-center text-4xl sm:text-5xl">{copy.workHeading}</h2>
          <WorkStack />
          <ServiceList />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-4xl sm:text-5xl">{copy.aboutHeading}</h2>
          <div className="mt-6 flex max-w-xl flex-col text-xl font-medium leading-snug">
            {aboutLines(copy.about).map((line, index) => (
              <p key={`${index}-${line}`}>{line || "\u00a0"}</p>
            ))}
          </div>
        </div>
      </section>
      <ReviewList />
    </div>
  )
}
