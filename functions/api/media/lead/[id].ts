import type { Env } from "../../../_lib/env"
import { json } from "../../../_lib/http"
import { readSession } from "../../../_lib/session"

function keysFrom(row: { photo_key: string | null; photo_keys: string | null }) {
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

export async function onRequestGet({
  request,
  env,
  params,
}: {
  request: Request
  env: Env
  params: { id: string }
}) {
  const admin = await readSession(request, env)
  if (!admin) return json({ error: "Sign in." }, 401)
  const row = await env.DB.prepare("SELECT photo_key, photo_keys FROM leads WHERE id = ?")
    .bind(Number(params.id))
    .first<{ photo_key: string | null; photo_keys: string | null }>()
  if (!row) return new Response("Not found", { status: 404 })
  const keys = keysFrom(row)
  const index = Math.max(0, Number(new URL(request.url).searchParams.get("n") || 0))
  const key = keys[index]
  if (!key) return new Response("Not found", { status: 404 })
  const obj = await env.PHOTOS.get(key)
  if (!obj) return new Response("Not found", { status: 404 })
  const headers = new Headers()
  headers.set("cache-control", "private, no-store")
  obj.writeHttpMetadata(headers)
  if (!headers.has("content-type")) headers.set("content-type", "image/jpeg")
  return new Response(obj.body, { headers })
}
