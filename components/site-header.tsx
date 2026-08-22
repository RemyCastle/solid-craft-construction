import Link from "next/link"

import { BrandMark } from "@/components/brand-mark"
import { people, site } from "@/lib/site"

const nav = [
  { href: "/", label: "Home" },
  { href: "/services/", label: "Services" },
  { href: "#quote", label: site.ctaSecondary },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gold/70 bg-ground">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2">
        <Link href="/" className="flex min-h-12 items-center gap-2">
          <BrandMark priority className="h-12 w-auto" />
          <span className="sr-only">{site.legalName}</span>
        </Link>
        <nav className="hidden items-center gap-5 text-xs font-bold uppercase tracking-[0.16em] md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-gold">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {people.map((person) => (
            <a
              key={person.phoneTel}
              href={person.phoneTel}
              className="cta cta-call"
              style={{ minHeight: "2.6rem", fontSize: "1.15rem" }}
            >
              {person.cta}
            </a>
          ))}
        </div>
        <p className="text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-gold md:hidden">
          {site.spanish}
        </p>
      </div>
      <nav className="flex items-center justify-around border-t border-gold/40 px-2 py-2 text-[11px] font-bold uppercase tracking-[0.16em] md:hidden">
        {nav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
