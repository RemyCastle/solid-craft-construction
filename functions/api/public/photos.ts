import { jobCaption, slugFromCaption } from "../../_lib/copy"
import type { Env } from "../../_lib/env"
import { json } from "../../_lib/http"
import { ready } from "../../_lib/ready"

export async function onRequestGet({ env }: { env: Env }) {
  try {
    await ready(env)
    const photos = await env.DB.prepare(
      "SELECT id, src, job_preset, job_custom, width, height, sort_order FROM photos ORDER BY sort_order, id",
    ).all()
    const pairs = await env.DB.prepare(
      `SELECT id, before_src, after_src, job_preset, job_custom, visible
       FROM comparisons ORDER BY sort_order, id`,
    ).all()
    const imaged = (photos.results || [])
      .map((row) => {
        const photo = row as {
          id: number
          src: string
          job_preset: string
          job_custom: string
          width: number
          height: number
        }
        const caption = jobCaption(photo.job_preset, photo.job_custom)
        return {
          id: photo.id,
          src: photo.src,
          caption,
          slug: slugFromCaption(caption),
          width: photo.width || 1080,
          height: photo.height || 1080,
        }
      })
      .filter((photo) => photo.src && photo.caption)
    const livePairs = (pairs.results || [])
      .map((row) => {
        const pair = row as {
          id: number
          before_src: string
          after_src: string
          job_preset: string
          job_custom: string
          visible: number
        }
        return {
          id: pair.id,
          before: pair.before_src,
          after: pair.after_src,
          caption: jobCaption(pair.job_preset, pair.job_custom),
          visible: pair.visible,
        }
      })
      .filter((pair) => pair.visible && pair.before && pair.after && pair.caption)
    return json({ photos: imaged, pairs: livePairs })
  } catch {
    return json({ error: "unavailable" }, 503)
  }
}
