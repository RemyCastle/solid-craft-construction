import Link from "next/link"

import { BrandMark } from "@/components/brand-mark"
import { people, site } from "@/lib/site"

const nav = [
  { href: "/", label: "Home" },
  { href: "/services/", label: site.workHeading },
  { href: site.emailMailto, label: site.ctaSecondary },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gold/70 bg-ground">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2">
        <Link href="/" className="flex min-h-12 items-center gap-2">
          <BrandMark priority className="h-12 w-auto" />
          <span className="sr-only">{site.legalName}</span>
        </Link>
        <p className="min-w-0 flex-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold sm:text-xs">
          {site.spanish}
        </p>
        <div className="hidden items-center gap-2 md:flex">
          {people.map((person) => (
            <a
              key={person.phoneTel}
              href={person.phoneTel}
              className="cta cta-call px-3"
              style={{ minHeight: "2.6rem", fontSize: "1.05rem" }}
            >
              {person.cta}
            </a>
          ))}
        </div>
      </div>
      <nav className="flex items-center justify-around border-t border-gold/40 px-2 py-2 text-[11px] font-bold uppercase tracking-[0.16em] md:justify-center md:gap-10">
        {nav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
