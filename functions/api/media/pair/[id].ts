import type { Env } from "../../../_lib/env"

export async function onRequestGet({
  request,
  env,
  params,
}: {
  request: Request
  env: Env
  params: { id: string }
}) {
  const side = new URL(request.url).searchParams.get("side")
  if (side !== "before" && side !== "after") {
    return new Response("Need side=before or side=after", { status: 400 })
  }
  const row = await env.DB.prepare("SELECT before_key, after_key FROM comparisons WHERE id = ?")
    .bind(Number(params.id))
    .first<{ before_key: string | null; after_key: string | null }>()
  const key = side === "before" ? row?.before_key : row?.after_key
  if (!key) return new Response("Not found", { status: 404 })
  const obj = await env.PHOTOS.get(key)
  if (!obj) return new Response("Not found", { status: 404 })
  const headers = new Headers()
  headers.set("cache-control", "public, max-age=86400")
  obj.writeHttpMetadata(headers)
  if (!headers.has("content-type")) headers.set("content-type", "image/jpeg")
  return new Response(obj.body, { headers })
}
