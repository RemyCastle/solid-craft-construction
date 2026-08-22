import { STATUSES, type Env } from "../../_lib/env"
import { json } from "../../_lib/http"

export async function onRequestGet({ env }: { env: Env }) {
  const rows = await env.DB.prepare(
    "SELECT id, created_at, name, phone, email, job, need, photo_key, status FROM leads ORDER BY id DESC",
  ).all()
  return json({ leads: rows.results || [] })
}

export async function onRequestPatch({ request, env }: { request: Request; env: Env }) {
  const body = (await request.json()) as { id?: number; status?: string }
  const id = Number(body.id)
  const status = String(body.status || "")
  if (!id || !STATUSES.includes(status as (typeof STATUSES)[number])) {
    return json({ error: "Mark unread or read." }, 400)
  }
  await env.DB.prepare("UPDATE leads SET status = ? WHERE id = ?").bind(status, id).run()
  return json({ ok: true })
}
