import { rejectBanned } from "../../_lib/banned"
import { copyFromSiteRow, phoneFooter, phoneTel, slugify, type SiteRow } from "../../_lib/copy"
import type { Env } from "../../_lib/env"
import { json } from "../../_lib/http"

type ServiceIn = { id?: number; slug?: string; name: string; line?: string }

export async function onRequestGet({ env }: { env: Env }) {
  const site = await env.DB.prepare("SELECT * FROM site WHERE id = 1").first<SiteRow>()
  const services = await env.DB.prepare(
    "SELECT id, slug, name, line, sort_order FROM services ORDER BY sort_order, id",
  ).all()
  return json({ site, services: services.results || [], copy: site ? copyFromSiteRow(site) : null })
}

export async function onRequestPut({ request, env }: { request: Request; env: Env }) {
  const body = (await request.json()) as {
    site?: Record<string, string>
    services?: ServiceIn[]
  }
  const s = body.site || {}
  const hero_title = String(s.hero_title || "").trim()
  const hero_lead = String(s.hero_lead || "").trim()
  const about = String(s.about || "").replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n")
  const joel_name = String(s.joel_name || "").trim()
  const joel_phone_display = String(s.joel_phone_display || "").trim()
  const joel_cta = String(s.joel_cta || "").trim()
  const ahren_name = String(s.ahren_name || "").trim()
  const ahren_phone_display = String(s.ahren_phone_display || "").trim()
  const ahren_cta = String(s.ahren_cta || "").trim()
  const email = String(s.email || "").trim()
  const spanish = String(s.spanish || "").trim()
  const cta_secondary = String(s.cta_secondary || "").trim()
  const quote_heading = String(s.quote_heading || "").trim()
  const quote_submit = String(s.quote_submit || "").trim()
  const quote_helper = String(s.quote_helper || "").trim()
  const quote_photos = String(s.quote_photos || "").trim()

  const required = [
    hero_title,
    hero_lead,
    about,
    joel_name,
    joel_phone_display,
    joel_cta,
    ahren_name,
    ahren_phone_display,
    ahren_cta,
    email,
    spanish,
    cta_secondary,
    quote_heading,
    quote_submit,
    quote_helper,
    quote_photos,
  ]
  if (required.some((value) => !value.trim())) return json({ error: "Fill every site field." }, 400)

  const banned = rejectBanned(
    hero_title,
    hero_lead,
    about,
    joel_name,
    joel_phone_display,
    joel_cta,
    ahren_name,
    ahren_phone_display,
    ahren_cta,
    email,
    spanish,
    cta_secondary,
    quote_heading,
    quote_submit,
    quote_helper,
    quote_photos,
    ...(body.services || []).flatMap((row) => [row.name, row.line || ""]),
  )
  if (banned) return json({ error: banned }, 400)

  const joel_phone_footer = phoneFooter(joel_phone_display)
  const joel_phone_tel = phoneTel(joel_phone_display)
  const ahren_phone_footer = phoneFooter(ahren_phone_display)
  const ahren_phone_tel = phoneTel(ahren_phone_display)
  if (!joel_phone_tel || !ahren_phone_tel) {
    return json({ error: "Use a full 10-digit phone for Joel and Ahren." }, 400)
  }

  await env.DB.prepare(
    `UPDATE site SET
      hero_title=?, hero_lead=?, about=?,
      joel_name=?, joel_phone_display=?, joel_phone_footer=?, joel_phone_tel=?, joel_cta=?,
      ahren_name=?, ahren_phone_display=?, ahren_phone_footer=?, ahren_phone_tel=?, ahren_cta=?,
      email=?, spanish=?, cta_secondary=?,
      quote_heading=?, quote_submit=?, quote_helper=?, quote_photos=?,
      updated_at=datetime('now')
     WHERE id = 1`,
  )
    .bind(
      hero_title,
      hero_lead,
      about,
      joel_name,
      joel_phone_display,
      joel_phone_footer,
      joel_phone_tel,
      joel_cta,
      ahren_name,
      ahren_phone_display,
      ahren_phone_footer,
      ahren_phone_tel,
      ahren_cta,
      email,
      spanish,
      cta_secondary,
      quote_heading,
      quote_submit,
      quote_helper,
      quote_photos,
    )
    .run()

  if (Array.isArray(body.services)) {
    await env.DB.prepare("DELETE FROM services").run()
    for (const [i, row] of body.services.entries()) {
      const name = String(row.name || "").trim()
      const line = String(row.line || "").trim()
      if (!name || !line) continue
      await env.DB.prepare("INSERT INTO services (slug, name, line, sort_order) VALUES (?, ?, ?, ?)")
        .bind(row.slug || slugify(name), name, line, i)
        .run()
    }
  }
  return onRequestGet({ env })
}
