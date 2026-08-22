import { JOB_PRESETS } from "./env"

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

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || name
}

export function jobCaption(preset: string, custom: string) {
  return (custom || preset || "").trim()
}

export function slugFromCaption(caption: string) {
  const presets: Record<string, string> = {
    Decks: "decks",
    Fences: "fences",
    Siding: "siding",
    Drywall: "drywall",
    Windows: "windows",
    Roofing: "roofing",
  }
  return presets[caption] || caption.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export function personFrom(name: string, display: string, footer: string, tel: string, cta: string) {
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

export function copyFromSiteRow(row: SiteRow) {
  return {
    heroTitle: row.hero_title,
    heroLead: row.hero_lead,
    about: row.about,
    email: row.email,
    emailMailto: `mailto:${row.email}`,
    spanish: row.spanish,
    ctaSecondary: row.cta_secondary,
    quoteHeading: row.quote_heading,
    quoteSubmit: row.quote_submit,
    quoteHelper: row.quote_helper,
    quotePhotos: row.quote_photos,
    freeEstimates: "Free estimates",
    workHeading: "Work",
    aboutHeading: "About",
    legalName: "Solid Craft Construction LLC",
    people: [
      personFrom(row.joel_name, row.joel_phone_display, row.joel_phone_footer, row.joel_phone_tel, row.joel_cta),
      personFrom(row.ahren_name, row.ahren_phone_display, row.ahren_phone_footer, row.ahren_phone_tel, row.ahren_cta),
    ],
  }
}

export function normalizeJob(preset: string, custom: string) {
  const jobPreset = JOB_PRESETS.includes(preset as (typeof JOB_PRESETS)[number]) ? preset : ""
  const jobCustom = custom.trim()
  if (!jobPreset && !jobCustom) return { error: "Pick a job kind or type a custom title." }
  return { jobPreset, jobCustom, caption: jobCaption(jobPreset, jobCustom) }
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "service"
}

export function fileKey(name: string) {
  return name.replace(/[^\w.\-]+/g, "_")
}
