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
  heroTitle: "Decks, fences, siding, drywall, windows, roofing.",
  heroLead: "Free estimates. Call Joel or Ahren.",
  seoTitle: "Solid Craft Construction LLC | Decks, fences, siding, drywall, windows, roofing",
  seoDescription:
    "Decks, fences, siding, drywall, windows, roofing. Free estimates. Call Joel or Ahren. Hablamos español.",
  about: "Joel and Ahren Paz. Solid Craft Construction LLC. Estimates are free. We speak Spanish.",
  quoteHeading: "Email a job",
  quoteSubmit: "Send",
  quoteHelper: "Or call Joel or Ahren.",
  quoteThanks: "Sent. They will call or email you back.",
  freeEstimates: "Free estimates",
  ctaSecondary: "Email us",
  workHeading: "Work",
  aboutHeading: "About",
  notFound: "That page is not on this site.",
} as const

export const people = [
  {
    name: "Joel Paz",
    first: "Joel",
    phoneDisplay: "(541) 653-6793",
    phoneFooter: "541-653-6793",
    phoneCard: "541.653.6793",
    phoneTel: "tel:+15416536793",
    cta: "Call Joel (541) 653-6793",
    dock: "Call Joel",
  },
  {
    name: "Ahren Paz",
    first: "Ahren",
    phoneDisplay: "(541) 255-9111",
    phoneFooter: "541-255-9111",
    phoneCard: "541.255.9111",
    phoneTel: "tel:+15412559111",
    cta: "Call Ahren (541) 255-9111",
    dock: "Call Ahren",
  },
] as const

export const services = [
  { slug: "decks", name: "Decks", line: "New deck or a repair." },
  { slug: "fences", name: "Fences", line: "We put them up. We fix them." },
  { slug: "siding", name: "Siding", line: "Siding on the house." },
  { slug: "drywall", name: "Drywall", line: "Hang it or patch it." },
  { slug: "windows", name: "Windows", line: "We install windows." },
  { slug: "roofing", name: "Roofing", line: "Roof work. Call first." },
] as const

export const workPhotos = [
  { src: "/work/decks.jpg", caption: "Decks", slug: "decks", width: 810, height: 1080 },
  { src: "/work/siding.jpg", caption: "Siding", slug: "siding", width: 810, height: 1080 },
  { src: "/work/stairs.jpg", caption: "Decks", slug: "decks", width: 810, height: 1080 },
] as const

export const marks = {
  logoMark: "/logo-mark.png",
  logoTile: "/logo-tile.png",
  cardLockup: "/card-lockup.jpg",
  og: "/og.png",
} as const
