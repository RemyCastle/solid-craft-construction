import { people, services, site, workPhotos } from "@/lib/site"

export type LivePerson = {
  name: string
  phoneDisplay: string
  phoneFooter: string
  phoneTel: string
  cta: string
  dock: string
}

export type LiveService = {
  id?: number
  slug: string
  name: string
  line: string
}

export type LivePhoto = {
  id?: number
  src: string
  caption: string
  slug?: string
  width: number
  height: number
}

export type LivePair = {
  id: number
  before: string
  after: string
  caption: string
}

export type LiveCopy = {
  heroTitle: string
  heroLead: string
  about: string
  email: string
  emailMailto: string
  spanish: string
  ctaSecondary: string
  quoteHeading: string
  quoteSubmit: string
  quoteHelper: string
  quotePhotos: string
  freeEstimates: string
  workHeading: string
  aboutHeading: string
  legalName: string
  people: LivePerson[]
}

export type SiteRow = {
  hero_title: string
  hero_lead: string
  about: string
  joel_name: string
  joel_phone_display: string
  joel_phone_footer: string
  joel_phone_tel: string
  joel_cta: string
  ahren_name: string
  ahren_phone_display: string
  ahren_phone_footer: string
  ahren_phone_tel: string
  ahren_cta: string
  email: string
  spanish: string
  cta_secondary: string
  quote_heading: string
  quote_submit: string
  quote_helper: string
  quote_photos: string
}

export const JOB_PRESETS = ["Decks", "Fences", "Siding", "Drywall", "Windows", "Roofing"] as const

export function jobCaption(preset: string, custom: string) {
  return (preset || custom || "").trim()
}

export function aboutLines(about: string) {
  return about.replace(/\r\n/g, "\n").split("\n")
}

export function photoIsReady(photo: Pick<LivePhoto, "src">) {
  return Boolean(photo.src?.trim())
}

export function slugFromCaption(caption: string) {
  const hit = services.find((service) => service.name === caption)
  return hit?.slug || caption.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export function phoneTel(display: string) {
  const digits = display.replace(/\D/g, "")
  if (digits.length === 10) return `tel:+1${digits}`
  if (digits.length === 11 && digits.startsWith("1")) return `tel:+${digits}`
  return display.startsWith("tel:") ? display : ""
}

export function phoneFooter(display: string) {
  const digits = display.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "")
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return display.trim()
}

export function emailMailto(email: string) {
  return `mailto:${email}`
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || name
}

export function personFrom(
  name: string,
  display: string,
  footer: string,
  tel: string,
  cta: string,
): LivePerson {
  const first = firstName(name)
  return {
    name,
    phoneDisplay: display,
    phoneFooter: footer || phoneFooter(display),
    phoneTel: tel || phoneTel(display),
    cta: cta || `Call ${first} ${display}`.trim(),
    dock: `Call ${first}`,
  }
}

export function copyFromSiteRow(row: SiteRow): LiveCopy {
  return {
    heroTitle: row.hero_title,
    heroLead: row.hero_lead,
    about: row.about,
    email: row.email,
    emailMailto: emailMailto(row.email),
    spanish: row.spanish,
    ctaSecondary: row.cta_secondary,
    quoteHeading: row.quote_heading,
    quoteSubmit: row.quote_submit,
    quoteHelper: row.quote_helper,
    quotePhotos: row.quote_photos,
    freeEstimates: site.freeEstimates,
    workHeading: site.workHeading,
    aboutHeading: site.aboutHeading,
    legalName: site.legalName,
    people: [
      personFrom(row.joel_name, row.joel_phone_display, row.joel_phone_footer, row.joel_phone_tel, row.joel_cta),
      personFrom(row.ahren_name, row.ahren_phone_display, row.ahren_phone_footer, row.ahren_phone_tel, row.ahren_cta),
    ],
  }
}

export const fallbackCopy: LiveCopy = {
  heroTitle: site.heroTitle,
  heroLead: site.heroLead,
  about: site.about,
  email: site.email,
  emailMailto: site.emailMailto,
  spanish: site.spanish,
  ctaSecondary: site.ctaSecondary,
  quoteHeading: site.quoteHeading,
  quoteSubmit: site.quoteSubmit,
  quoteHelper: site.quoteHelper,
  quotePhotos: site.quotePhotos,
  freeEstimates: site.freeEstimates,
  workHeading: site.workHeading,
  aboutHeading: site.aboutHeading,
  legalName: site.legalName,
  people: people.map((person) => ({
    name: person.name,
    phoneDisplay: person.phoneDisplay,
    phoneFooter: person.phoneFooter,
    phoneTel: person.phoneTel,
    cta: person.cta,
    dock: person.dock,
  })),
}

export const fallbackServices: LiveService[] = services.map((service) => ({
  slug: service.slug,
  name: service.name,
  line: service.line,
}))

export const fallbackPhotos: LivePhoto[] = workPhotos.map((photo, index) => ({
  id: index + 1,
  src: photo.src,
  caption: photo.caption,
  slug: photo.slug,
  width: photo.width,
  height: photo.height,
}))

export const fallbackPairs: LivePair[] = []
