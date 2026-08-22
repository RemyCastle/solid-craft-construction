"use client"

import Link from "next/link"

import { BrandMark } from "@/components/brand-mark"
import { useLive } from "@/components/live-public"

export function SiteFooter() {
  const { copy } = useLive()

  return (
    <footer className="border-t border-gold/70 bg-ground">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-10">
        <BrandMark className="h-16 w-auto" />
        <p className="max-w-xl text-base font-medium leading-relaxed">
          {copy.legalName}
          <br />
          {copy.people.map((person) => (
            <span key={person.phoneTel}>
              {person.name}{" "}
              <a href={person.phoneTel} className="underline decoration-gold underline-offset-4">
                {person.phoneFooter}
              </a>
              <br />
            </span>
          ))}
          <a href={copy.emailMailto} className="underline decoration-gold underline-offset-4">
            {copy.email}
          </a>
          <br />
          {copy.spanish}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold uppercase tracking-wide">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <Link href="/services/" className="hover:text-gold">
            {copy.workHeading}
          </Link>
          <a href={copy.emailMailto} className="hover:text-gold">
            {copy.ctaSecondary}
          </a>
        </div>
      </div>
    </footer>
  )
}
