export const site = {
  name: "Solid Craft Construction LLC",
  legalName: "Solid Craft Construction LLC",
  shortName: "Solid Craft",
  domain: "solidcraftbuilds.com",
  siteUrl: "https://solidcraftbuilds.com",
  email: "pnw@solidcraftbuilds.com",
  emailMailto: "mailto:pnw@solidcraftbuilds.com",
  formSubmit: "https://formsubmit.co/pnw@solidcraftbuilds.com",
  spanish: "Hablamos español",
  heroTitle: "Decks, fences, siding. Call for a free estimate.",
  heroLead: "Drywall, windows, roofing. Hablamos español.",
  seoTitle: "Solid Craft Construction LLC | Decks, fences, siding",
  seoDescription:
    "Decks, fences, siding, drywall, windows, roofing. Free estimates. Hablamos español. Call Joel or Ahren.",
  about: "Joel Paz and Ahren Paz. Solid Craft Construction LLC.",
  quoteHeading: "Email a job",
  quoteSubmit: "Send",
  quoteHelper: "Or call Joel or Ahren.",
  quoteThanks: "Sent. They will call or email you back.",
  freeEstimates: "Free estimates",
  ctaSecondary: "Email",
  notFound: "That page is not on this site.",
} as const

export const people = [
  {
    name: "Joel Paz",
    first: "Joel",
    phoneDisplay: "(541) 653-6793",
    phoneTel: "tel:+15416536793",
    cta: "Call Joel",
  },
  {
    name: "Ahren Paz",
    first: "Ahren",
    phoneDisplay: "(541) 255-9111",
    phoneTel: "tel:+15412559111",
    cta: "Call Ahren",
  },
] as const

export const services = [
  { slug: "decks", name: "Decks" },
  { slug: "fences", name: "Fences" },
  { slug: "siding", name: "Siding" },
  { slug: "drywall", name: "Drywall" },
  { slug: "windows", name: "Windows" },
  { slug: "roofing", name: "Roofing" },
] as const

export const marks = {
  logoMark: "/logo-mark.png",
  logoTile: "/logo-tile.png",
  og: "/og.png",
} as const
