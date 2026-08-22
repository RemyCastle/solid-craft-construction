"use client"

import Link from "next/link"

import { useLive } from "@/components/live-public"

export function ServiceList() {
  const { copy, services } = useLive()

  return (
    <ul className="mx-auto mt-8 flex max-w-lg flex-col gap-3">
      {services.map((service) => (
        <li key={service.slug}>
          <Link
            href={`/?job=${service.slug}#quote`}
            className="block bg-card px-5 py-4 ring-1 ring-gold/50 hover:ring-gold"
          >
            <span className="font-display text-2xl font-semibold uppercase tracking-[0.12em] text-ink">
              {service.name}
            </span>
            <span className="mt-1 block text-base font-medium text-mute">{service.line}</span>
          </Link>
        </li>
      ))}
      <li className="pt-3 text-center font-display text-xl font-semibold uppercase tracking-[0.16em] text-gold">
        <Link href="/#quote">{copy.freeEstimates}</Link>
      </li>
    </ul>
  )
}
