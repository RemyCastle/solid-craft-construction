import { rejectJobTitle } from "../../_lib/banned"
import { fileKey, jobCaption, normalizeJob } from "../../_lib/copy"
import type { Env } from "../../_lib/env"
import { json } from "../../_lib/http"

export async function onRequestGet({ env }: { env: Env }) {
  const photos = await env.DB.prepare(
    "SELECT id, src, r2_key, job_preset, job_custom, width, height, sort_order FROM photos ORDER BY sort_order, id",
  ).all()
  const rows = (photos.results || []).map((row) => {
    const photo = row as {
      id: number
      src: string
      job_preset: string
      job_custom: string
      width: number
      height: number
      sort_order: number
    }
    return {
      ...photo,
      caption: jobCaption(photo.job_preset, photo.job_custom),
    }
  })
  return json({ photos: rows })
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  const form = await request.formData()
  const file = form.get("file")
  const job = normalizeJob(String(form.get("job_preset") || ""), String(form.get("job_custom") || ""))
  if ("error" in job) return json({ error: job.error }, 400)
  const banned = rejectJobTitle(job.jobPreset, job.jobCustom)
  if (banned) return json({ error: banned }, 400)
  if (!(file instanceof File) || !file.size) return json({ error: "Add a photo." }, 400)
  const max = await env.DB.prepare("SELECT COALESCE(MAX(sort_order), -1) AS n FROM photos").first<{ n: number }>()
  const sort = (max?.n ?? -1) + 1
  const created = await env.DB.prepare(
    "INSERT INTO photos (src, job_preset, job_custom, width, height, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
  )
    .bind("", job.jobPreset, job.jobCustom, 1080, 1080, sort)
    .run()
  const id = Number(created.meta.last_row_id)
  const key = `work/${id}-${fileKey(file.name)}`
  await env.PHOTOS.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "image/jpeg" },
  })
  const src = `/api/media/work/${id}`
  await env.DB.prepare("UPDATE photos SET src = ?, r2_key = ? WHERE id = ?")
    .bind(src, key, id)
    .run()
  return json({ id, src, caption: job.caption, job_preset: job.jobPreset, job_custom: job.jobCustom })
}

export async function onRequestPatch({ request, env }: { request: Request; env: Env }) {
  const body = (await request.json()) as {
    id?: number
    job_preset?: string
    job_custom?: string
    order?: number[]
  }
  if (Array.isArray(body.order)) {
    for (const [i, id] of body.order.entries()) {
      await env.DB.prepare("UPDATE photos SET sort_order = ? WHERE id = ?").bind(i, id).run()
    }
    return json({ ok: true })
  }
  const id = Number(body.id)
  if (!id) return json({ error: "Missing photo." }, 400)
  const job = normalizeJob(String(body.job_preset || ""), String(body.job_custom || ""))
  if ("error" in job) return json({ error: job.error }, 400)
  const banned = rejectJobTitle(job.jobPreset, job.jobCustom)
  if (banned) return json({ error: banned }, 400)
  await env.DB.prepare("UPDATE photos SET job_preset = ?, job_custom = ? WHERE id = ?")
    .bind(job.jobPreset, job.jobCustom, id)
    .run()
  return json({ ok: true, caption: job.caption })
}

export async function onRequestDelete({ request, env }: { request: Request; env: Env }) {
  const url = new URL(request.url)
  const id = Number(url.searchParams.get("id"))
  if (!id) return json({ error: "Missing photo." }, 400)
  const row = await env.DB.prepare("SELECT r2_key FROM photos WHERE id = ?")
    .bind(id)
    .first<{ r2_key: string | null }>()
  if (row?.r2_key) {
    try {
      await env.PHOTOS.delete(row.r2_key)
    } catch {
      // keep going
    }
  }
  await env.DB.prepare("DELETE FROM photos WHERE id = ?").bind(id).run()
  return json({ ok: true })
}
