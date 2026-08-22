import { rejectBanned } from "../_lib/banned"
import { fileKey } from "../_lib/copy"
import { FORM_SUBMIT, type Env } from "../_lib/env"
import { json } from "../_lib/http"
import { ready } from "../_lib/ready"

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  await ready(env)
  const incoming = await request.formData()
  const name = String(incoming.get("name") || "").trim()
  const phone = String(incoming.get("phone") || "").trim()
  const email = String(incoming.get("email") || "").trim()
  const job = String(incoming.get("job") || "").trim()
  const need = String(incoming.get("need") || incoming.get("What you need") || "").trim()
  const banned = rejectBanned(name, phone, email, job, need)
  if (banned) return json({ error: banned }, 400)
  if (!name || !need || (!phone && !email)) {
    return json({ error: "Name, what you need, and a phone or email." }, 400)
  }

  const files = [
    ...incoming.getAll("attachment"),
    incoming.get("photo"),
  ].filter((item): item is File => item instanceof File && item.size > 0)

  const created = await env.DB.prepare(
    `INSERT INTO leads (created_at, name, phone, email, job, need, status)
     VALUES (datetime('now'), ?, ?, ?, ?, ?, 'unread')`,
  )
    .bind(name, phone, email, job, need)
    .run()
  const leadId = Number(created.meta.last_row_id)

  const file = files[0]
  if (file) {
    const key = `leads/${leadId}-${fileKey(file.name)}`
    try {
      await env.PHOTOS.put(key, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type || "image/jpeg" },
      })
      await env.DB.prepare("UPDATE leads SET photo_key = ? WHERE id = ?")
        .bind(key, leadId)
        .run()
    } catch {
      // R2 may be off; keep the lead
    }
  }

  const outbound = new FormData()
  outbound.set("_subject", "Solid Craft Construction — job")
  outbound.set("_template", "table")
  outbound.set("_captcha", "false")
  outbound.set("name", name)
  if (phone) outbound.set("phone", phone)
  if (email) outbound.set("email", email)
  if (job) outbound.set("job", job)
  outbound.set("What you need", need)
  for (const item of files) outbound.append("attachment", item)

  let emailed = false
  try {
    const mail = await fetch(FORM_SUBMIT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: outbound,
    })
    emailed = mail.ok
  } catch {
    emailed = false
  }

  return json({ ok: true, emailed, id: leadId })
}
