import { rejectBanned } from "../../_lib/banned"
import type { Env } from "../../_lib/env"
import { json } from "../../_lib/http"

function normalizeStars(value: unknown) {
  const stars = Math.round(Number(value))
  if (!Number.isFinite(stars) || stars < 1 || stars > 5) return null
  return stars
}

export async function onRequestGet({ env }: { env: Env }) {
  const rows = await env.DB.prepare(
    "SELECT id, name, stars, text, featured, created_at FROM reviews ORDER BY featured DESC, stars DESC, id DESC",
  ).all()
  return json({ reviews: rows.results || [] })
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  const body = (await request.json()) as {
    name?: string
    stars?: number
    text?: string
    featured?: boolean | number
  }
  const name = String(body.name || "").trim()
  const text = String(body.text || "").trim()
  const stars = normalizeStars(body.stars)
  if (!name || !text || !stars) {
    return json({ error: "Name, the quote, and stars (1 to 5) from the real review." }, 400)
  }
  const banned = rejectBanned(name, text)
  if (banned) return json({ error: banned }, 400)
  const featured = body.featured ? 1 : 0
  await env.DB.prepare(
    "INSERT INTO reviews (name, stars, text, featured, created_at) VALUES (?, ?, ?, ?, datetime('now'))",
  )
    .bind(name, stars, text, featured)
    .run()
  return onRequestGet({ env })
}

export async function onRequestPatch({ request, env }: { request: Request; env: Env }) {
  const body = (await request.json()) as {
    id?: number
    featured?: boolean | number
    name?: string
    stars?: number
    text?: string
  }
  const id = Number(body.id)
  if (!id) return json({ error: "Missing review." }, 400)
  if (body.featured !== undefined && body.name === undefined && body.text === undefined && body.stars === undefined) {
    await env.DB.prepare("UPDATE reviews SET featured = ? WHERE id = ?")
      .bind(body.featured ? 1 : 0, id)
      .run()
    return json({ ok: true })
  }
  const name = String(body.name || "").trim()
  const text = String(body.text || "").trim()
  const stars = normalizeStars(body.stars)
  if (!name || !text || !stars) {
    return json({ error: "Name, the quote, and stars (1 to 5) from the real review." }, 400)
  }
  const banned = rejectBanned(name, text)
  if (banned) return json({ error: banned }, 400)
  const featured = body.featured ? 1 : 0
  await env.DB.prepare("UPDATE reviews SET name = ?, stars = ?, text = ?, featured = ? WHERE id = ?")
    .bind(name, stars, text, featured, id)
    .run()
  return json({ ok: true })
}

export async function onRequestDelete({ request, env }: { request: Request; env: Env }) {
  const id = Number(new URL(request.url).searchParams.get("id"))
  if (!id) return json({ error: "Missing review." }, 400)
  await env.DB.prepare("DELETE FROM reviews WHERE id = ?").bind(id).run()
  return onRequestGet({ env })
}
