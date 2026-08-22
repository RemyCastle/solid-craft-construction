"use client"

import Link from "next/link"

import { BrandMark } from "@/components/brand-mark"
import { useLive } from "@/components/live-public"

export function SiteHeader() {
  const { copy } = useLive()
  const [joel, ahren] = copy.people
  const nav = [
    { href: "/", label: "Home" },
    { href: "/services/", label: copy.workHeading },
    { href: copy.emailMailto, label: copy.ctaSecondary },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-gold/70 bg-ground">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2">
        <Link href="/" className="flex h-11 shrink-0 items-center">
          <BrandMark priority className="h-10 w-auto" />
          <span className="sr-only">{copy.legalName}</span>
        </Link>
        <div className="flex min-w-0 items-center justify-end gap-2">
          {joel ? (
            <a
              href={joel.phoneTel}
              className="cta cta-call px-3 whitespace-nowrap"
              style={{ minHeight: "2.6rem", fontSize: "1.05rem" }}
            >
              {joel.cta}
            </a>
          ) : null}
          {ahren ? (
            <div className="header-ahren hidden md:block">
              <a
                href={ahren.phoneTel}
                className="cta cta-call px-3 whitespace-nowrap"
                style={{ minHeight: "2.6rem", fontSize: "1.05rem" }}
              >
                {ahren.cta}
              </a>
            </div>
          ) : null}
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
