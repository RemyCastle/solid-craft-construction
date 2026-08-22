import Link from "next/link"

import { BrandMark } from "@/components/brand-mark"
import { people, site } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="border-t border-gold/70 bg-ground">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-10">
        <BrandMark className="h-16 w-auto" />
        <p className="max-w-xl text-base font-medium leading-relaxed">
          {site.legalName}
          <br />
          {site.spanish}
          <br />
          {people.map((person, index) => (
            <span key={person.phoneTel}>
              {index > 0 ? <br /> : null}
              {person.name}{" "}
              <a href={person.phoneTel} className="underline decoration-gold underline-offset-4">
                {person.phoneDisplay}
              </a>
            </span>
          ))}
          <br />
          <a href={site.emailMailto} className="underline decoration-gold underline-offset-4">
            {site.email}
          </a>
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold uppercase tracking-wide">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <Link href="/services/" className="hover:text-gold">
            Services
          </Link>
          <a href="#quote" className="hover:text-gold">
            {site.ctaSecondary}
          </a>
        </div>
      </div>
    </footer>
  )
}
