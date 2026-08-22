import { STATUSES, type Env } from "../../_lib/env"
import { json } from "../../_lib/http"

function photoKeys(row: { photo_key: string | null; photo_keys?: string | null }) {
  if (row.photo_keys) {
    try {
      const parsed = JSON.parse(row.photo_keys) as unknown
      if (Array.isArray(parsed)) {
        return parsed.filter((key): key is string => typeof key === "string" && key.length > 0)
      }
    } catch {
      // fall through
    }
  }
  return row.photo_key ? [row.photo_key] : []
}

export async function onRequestGet({ env }: { env: Env }) {
  const rows = await env.DB.prepare(
    "SELECT id, created_at, name, phone, email, job, need, photo_key, photo_keys, status FROM leads ORDER BY id DESC",
  ).all()
  const leads = (rows.results || []).map((row) => {
    const lead = row as {
      id: number
      created_at: string
      name: string
      phone: string
      email: string
      job: string
      need: string
      photo_key: string | null
      photo_keys: string | null
      status: string
    }
    const keys = photoKeys(lead)
    return {
      ...lead,
      photos: keys.map((_, index) => `/api/media/lead/${lead.id}?n=${index}`),
    }
  })
  return json({ leads })
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
