export interface Env {
  DB: D1Database
  PHOTOS: R2Bucket
  SESSION_SECRET?: string
}

export const COOKIE = "scc_session"
export const FORM_SUBMIT = "https://formsubmit.co/ajax/pnw@solidcraftbuilds.com"
export const STATUSES = ["unread", "read"] as const

export const JOB_PRESETS = ["Decks", "Fences", "Siding", "Drywall", "Windows", "Roofing"] as const
