import type { Env } from "../../../_lib/env"
import { json } from "../../../_lib/http"
import { readSession } from "../../../_lib/session"

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
  const row = await env.DB.prepare("SELECT photo_key FROM leads WHERE id = ?")
    .bind(Number(params.id))
    .first<{ photo_key: string | null }>()
  if (!row?.photo_key) return new Response("Not found", { status: 404 })
  const obj = await env.PHOTOS.get(row.photo_key)
  if (!obj) return new Response("Not found", { status: 404 })
  const headers = new Headers()
  headers.set("cache-control", "private, no-store")
  obj.writeHttpMetadata(headers)
  if (!headers.has("content-type")) headers.set("content-type", "image/jpeg")
  return new Response(obj.body, { headers })
}
