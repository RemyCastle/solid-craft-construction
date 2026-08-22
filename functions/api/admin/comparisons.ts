import { rejectJobTitle } from "../../_lib/banned"
import { fileKey, jobCaption, normalizeJob } from "../../_lib/copy"
import type { Env } from "../../_lib/env"
import { json } from "../../_lib/http"

export async function onRequestGet({ env }: { env: Env }) {
  const rows = await env.DB.prepare(
    `SELECT id, before_src, after_src, job_preset, job_custom, visible, sort_order
     FROM comparisons ORDER BY sort_order, id`,
  ).all()
  const pairs = (rows.results || []).map((row) => {
    const pair = row as {
      id: number
      before_src: string
      after_src: string
      job_preset: string
      job_custom: string
      visible: number
      sort_order: number
    }
    return {
      ...pair,
      caption: jobCaption(pair.job_preset, pair.job_custom),
    }
  })
  return json({ pairs })
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  const form = await request.formData()
  const before = form.get("before")
  const after = form.get("after")
  const job = normalizeJob(String(form.get("job_preset") || ""), String(form.get("job_custom") || ""))
  if ("error" in job) return json({ error: job.error }, 400)
  const banned = rejectJobTitle(job.jobPreset, job.jobCustom)
  if (banned) return json({ error: banned }, 400)
  if (!(before instanceof File) || !before.size || !(after instanceof File) || !after.size) {
    return json({ error: "Upload a Before photo and an After photo." }, 400)
  }
  const max = await env.DB.prepare("SELECT COALESCE(MAX(sort_order), -1) AS n FROM comparisons").first<{
    n: number
  }>()
  const sort = (max?.n ?? -1) + 1
  const created = await env.DB.prepare(
    `INSERT INTO comparisons (before_src, after_src, job_preset, job_custom, visible, sort_order)
     VALUES ('', '', ?, ?, 0, ?)`,
  )
    .bind(job.jobPreset, job.jobCustom, sort)
    .run()
  const id = Number(created.meta.last_row_id)
  const beforeKey = `pairs/${id}-before-${fileKey(before.name)}`
  const afterKey = `pairs/${id}-after-${fileKey(after.name)}`
  await env.PHOTOS.put(beforeKey, await before.arrayBuffer(), {
    httpMetadata: { contentType: before.type || "image/jpeg" },
  })
  await env.PHOTOS.put(afterKey, await after.arrayBuffer(), {
    httpMetadata: { contentType: after.type || "image/jpeg" },
  })
  const beforeSrc = `/api/media/pair/${id}?side=before`
  const afterSrc = `/api/media/pair/${id}?side=after`
  await env.DB.prepare(
    "UPDATE comparisons SET before_src = ?, before_key = ?, after_src = ?, after_key = ? WHERE id = ?",
  )
    .bind(beforeSrc, beforeKey, afterSrc, afterKey, id)
    .run()
  return json({
    id,
    before: beforeSrc,
    after: afterSrc,
    caption: job.caption,
    visible: 0,
  })
}

export async function onRequestPatch({ request, env }: { request: Request; env: Env }) {
  const body = (await request.json()) as {
    id?: number
    visible?: boolean | number
    job_preset?: string
    job_custom?: string
  }
  const id = Number(body.id)
  if (!id) return json({ error: "Missing pair." }, 400)
  if (body.visible !== undefined) {
    const row = await env.DB.prepare("SELECT before_src, after_src FROM comparisons WHERE id = ?")
      .bind(id)
      .first<{ before_src: string; after_src: string }>()
    if (!row?.before_src || !row.after_src) {
      return json({ error: "Both images are required before a pair can be visible." }, 400)
    }
    const visible = body.visible ? 1 : 0
    await env.DB.prepare("UPDATE comparisons SET visible = ? WHERE id = ?").bind(visible, id).run()
    return json({ ok: true, visible })
  }
  const job = normalizeJob(String(body.job_preset || ""), String(body.job_custom || ""))
  if ("error" in job) return json({ error: job.error }, 400)
  const banned = rejectJobTitle(job.jobPreset, job.jobCustom)
  if (banned) return json({ error: banned }, 400)
  await env.DB.prepare("UPDATE comparisons SET job_preset = ?, job_custom = ? WHERE id = ?")
    .bind(job.jobPreset, job.jobCustom, id)
    .run()
  return json({ ok: true, caption: job.caption })
}

export async function onRequestDelete({ request, env }: { request: Request; env: Env }) {
  const id = Number(new URL(request.url).searchParams.get("id"))
  if (!id) return json({ error: "Missing pair." }, 400)
  const row = await env.DB.prepare("SELECT before_key, after_key FROM comparisons WHERE id = ?")
    .bind(id)
    .first<{ before_key: string | null; after_key: string | null }>()
  for (const key of [row?.before_key, row?.after_key]) {
    if (!key) continue
    try {
      await env.PHOTOS.delete(key)
    } catch {
      // keep going
    }
  }
  await env.DB.prepare("DELETE FROM comparisons WHERE id = ?").bind(id).run()
  return json({ ok: true })
}
