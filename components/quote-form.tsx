"use client"

import { useRouter } from "next/navigation"
import { useState, useSyncExternalStore } from "react"

import { useLive } from "@/components/live-public"

function subscribe() {
  return () => {}
}

export function QuoteForm() {
  const router = useRouter()
  const { copy, services } = useLive()
  const urlJob = useSyncExternalStore(
    subscribe,
    () => {
      const slug = new URLSearchParams(window.location.search).get("job")
      return services.find((service) => service.slug === slug)?.name ?? ""
    },
    () => "",
  )
  const [picked, setPicked] = useState<string | null>(null)
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle")
  const [message, setMessage] = useState("")
  const job = picked ?? urlJob

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("sending")
    setMessage("")
    const form = event.currentTarget
    const data = new FormData(form)
    try {
      const res = await fetch("/api/leads", { method: "POST", body: data })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus("err")
        setMessage(body.error || "Could not send.")
        return
      }
      form.reset()
      setPicked("")
      setStatus("ok")
      router.push("/thanks/")
    } catch {
      setStatus("err")
      setMessage("Could not send. Open the site with wrangler pages dev so the inbox is live.")
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-xl flex-col gap-4" encType="multipart/form-data">
      <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
        Name
        <input id="quote-name" name="name" autoComplete="name" required className="field-ink" />
      </label>
      <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
        Phone
        <input id="quote-phone" name="phone" type="tel" autoComplete="tel" className="field-ink" />
      </label>
      <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
        Email
        <input id="quote-email" name="email" type="email" autoComplete="email" className="field-ink" />
      </label>
      <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
        Job
        <select
          id="quote-job"
          name="job"
          value={job}
          onChange={(event) => setPicked(event.target.value)}
          className="field-ink"
        >
          <option value="">Pick one</option>
          {services.map((service) => (
            <option key={service.slug} value={service.name}>
              {service.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
        What you need
        <textarea id="quote-need" name="need" required rows={4} className="field-ink" />
      </label>
      <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
        {copy.quotePhotos}
        <input
          id="quote-photos"
          name="attachment"
          type="file"
          accept="image/*"
          multiple
          className="field-ink py-2"
        />
      </label>
      <button type="submit" className="cta cta-call w-fit" disabled={status === "sending"}>
        {status === "sending" ? "Sending" : copy.quoteSubmit}
      </button>
      <p className="text-sm font-medium text-mute">{copy.quoteHelper}</p>
      {message ? <p className="text-sm font-semibold text-gold">{message}</p> : null}
    </form>
  )
}
