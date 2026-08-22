import type { Env } from "./env"

const SCHEMA = `
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS site (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  hero_title TEXT NOT NULL,
  hero_lead TEXT NOT NULL,
  about TEXT NOT NULL,
  joel_name TEXT NOT NULL,
  joel_phone_display TEXT NOT NULL,
  joel_phone_footer TEXT NOT NULL,
  joel_phone_tel TEXT NOT NULL,
  joel_cta TEXT NOT NULL,
  ahren_name TEXT NOT NULL,
  ahren_phone_display TEXT NOT NULL,
  ahren_phone_footer TEXT NOT NULL,
  ahren_phone_tel TEXT NOT NULL,
  ahren_cta TEXT NOT NULL,
  email TEXT NOT NULL,
  spanish TEXT NOT NULL,
  cta_secondary TEXT NOT NULL,
  quote_heading TEXT NOT NULL,
  quote_submit TEXT NOT NULL,
  quote_helper TEXT NOT NULL,
  quote_photos TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  line TEXT NOT NULL,
  sort_order INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  src TEXT NOT NULL,
  r2_key TEXT,
  job_preset TEXT NOT NULL DEFAULT '',
  job_custom TEXT NOT NULL DEFAULT '',
  width INTEGER,
  height INTEGER,
  sort_order INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS comparisons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  before_src TEXT NOT NULL DEFAULT '',
  before_key TEXT,
  after_src TEXT NOT NULL DEFAULT '',
  after_key TEXT,
  job_preset TEXT NOT NULL DEFAULT '',
  job_custom TEXT NOT NULL DEFAULT '',
  visible INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  job TEXT NOT NULL DEFAULT '',
  need TEXT NOT NULL,
  photo_key TEXT,
  photo_keys TEXT,
  status TEXT NOT NULL DEFAULT 'unread'
);
`

const SITE_SEED = {
  hero_title: "Decks, fences, siding, drywall, windows, roofing.",
  hero_lead: "Free estimates. Call Joel or Ahren.",
  about: "Joel and Ahren Paz.\nSolid Craft Construction LLC.\nEstimates are free.\nWe speak Spanish.",
  joel_name: "Joel Paz",
  joel_phone_display: "(541) 653-6793",
  joel_phone_footer: "541-653-6793",
  joel_phone_tel: "tel:+15416536793",
  joel_cta: "Call Joel (541) 653-6793",
  ahren_name: "Ahren Paz",
  ahren_phone_display: "(541) 255-9111",
  ahren_phone_footer: "541-255-9111",
  ahren_phone_tel: "tel:+15412559111",
  ahren_cta: "Call Ahren (541) 255-9111",
  email: "pnw@solidcraftbuilds.com",
  spanish: "Hablamos español",
  cta_secondary: "Email us",
  quote_heading: "Email a job",
  quote_submit: "Send",
  quote_helper: "Or call Joel or Ahren.",
  quote_photos: "Job photos, optional",
}

const SERVICE_SEED = [
  { slug: "decks", name: "Decks", line: "New deck or a repair." },
  { slug: "fences", name: "Fences", line: "We put them up. We fix them." },
  { slug: "siding", name: "Siding", line: "Siding on the house." },
  { slug: "drywall", name: "Drywall", line: "Hang it or patch it." },
  { slug: "windows", name: "Windows", line: "We install windows." },
  { slug: "roofing", name: "Roofing", line: "Roof work. Call first." },
]

const PHOTO_SEED = [
  { src: "/work/decks.jpg", job_preset: "Decks", width: 810, height: 1080 },
  { src: "/work/siding.jpg", job_preset: "Siding", width: 810, height: 1080 },
  { src: "/work/stairs.jpg", job_preset: "Decks", width: 810, height: 1080 },
]

export async function ready(env: Env) {
  for (const statement of SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) {
    await env.DB.prepare(statement).run()
  }
  try {
    await env.DB.prepare("ALTER TABLE leads ADD COLUMN photo_keys TEXT").run()
  } catch {
    // already present
  }
  const site = await env.DB.prepare("SELECT id FROM site WHERE id = 1").first()
  if (!site) {
    await env.DB.prepare(
      `INSERT INTO site (
        id, hero_title, hero_lead, about,
        joel_name, joel_phone_display, joel_phone_footer, joel_phone_tel, joel_cta,
        ahren_name, ahren_phone_display, ahren_phone_footer, ahren_phone_tel, ahren_cta,
        email, spanish, cta_secondary,
        quote_heading, quote_submit, quote_helper, quote_photos, updated_at
      ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    )
      .bind(
        SITE_SEED.hero_title,
        SITE_SEED.hero_lead,
        SITE_SEED.about,
        SITE_SEED.joel_name,
        SITE_SEED.joel_phone_display,
        SITE_SEED.joel_phone_footer,
        SITE_SEED.joel_phone_tel,
        SITE_SEED.joel_cta,
        SITE_SEED.ahren_name,
        SITE_SEED.ahren_phone_display,
        SITE_SEED.ahren_phone_footer,
        SITE_SEED.ahren_phone_tel,
        SITE_SEED.ahren_cta,
        SITE_SEED.email,
        SITE_SEED.spanish,
        SITE_SEED.cta_secondary,
        SITE_SEED.quote_heading,
        SITE_SEED.quote_submit,
        SITE_SEED.quote_helper,
        SITE_SEED.quote_photos,
      )
      .run()
  }
  const serviceCount = await env.DB.prepare("SELECT COUNT(*) AS n FROM services").first<{ n: number }>()
  if (!serviceCount || serviceCount.n === 0) {
    for (const [i, row] of SERVICE_SEED.entries()) {
      await env.DB.prepare("INSERT INTO services (slug, name, line, sort_order) VALUES (?, ?, ?, ?)")
        .bind(row.slug, row.name, row.line, i)
        .run()
    }
  }
  const photoCount = await env.DB.prepare("SELECT COUNT(*) AS n FROM photos").first<{ n: number }>()
  if (!photoCount || photoCount.n === 0) {
    for (const [i, row] of PHOTO_SEED.entries()) {
      await env.DB.prepare(
        "INSERT INTO photos (src, job_preset, job_custom, width, height, sort_order) VALUES (?, ?, '', ?, ?, ?)",
      )
        .bind(row.src, row.job_preset, row.width, row.height, i)
        .run()
    }
  }
}
