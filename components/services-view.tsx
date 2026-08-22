"use client"

import { CallPair } from "@/components/call-pair"
import { useLive } from "@/components/live-public"
import { ServiceList } from "@/components/service-list"
import { WorkStack } from "@/components/work-stack"

export function ServicesView() {
  const { copy } = useLive()

  return (
    <div className="bg-ground">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-center font-display text-5xl uppercase tracking-[0.04em] sm:text-6xl">
          {copy.workHeading}
        </h1>
        <WorkStack />
        <ServiceList />
        <div className="mx-auto mt-12 flex max-w-md flex-col items-center gap-3">
          <CallPair />
          <a href={copy.emailMailto} className="cta cta-mail w-full">
            {copy.ctaSecondary}
          </a>
        </div>
      </div>
    </div>
  )
}
