"use client"

import { useState, useSyncExternalStore } from "react"

import { services, site } from "@/lib/site"

function subscribe() {
  return () => {}
}

function jobFromUrl() {
  const slug = new URLSearchParams(window.location.search).get("job")
  return services.find((service) => service.slug === slug)?.name ?? ""
}

export function QuoteForm() {
  const urlJob = useSyncExternalStore(subscribe, jobFromUrl, () => "")
  const [picked, setPicked] = useState<string | null>(null)
  const job = picked ?? urlJob

  return (
    <form action={site.formSubmit} method="POST" className="flex max-w-xl flex-col gap-4">
      <input type="hidden" name="_subject" value={`Estimate — ${site.legalName}`} />
      <input type="hidden" name="_next" value={`${site.siteUrl}/thanks/`} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" />

      <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
        Name
        <input id="quote-name" name="name" autoComplete="name" required className="field-ink" />
      </label>
      <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
        Phone
        <input
          id="quote-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          className="field-ink"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
        Email
        <input
          id="quote-email"
          name="email"
          type="email"
          autoComplete="email"
          className="field-ink"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
        Job
        <select
          id="quote-job"
          name="job"
          required
          value={job}
          onChange={(event) => setPicked(event.target.value)}
          className="field-ink"
        >
          <option value="" disabled>
            Pick one
          </option>
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
      <button type="submit" className="cta cta-call w-fit">
        {site.quoteSubmit}
      </button>
      <p className="text-sm font-medium text-mute">{site.quoteHelper}</p>
    </form>
  )
}
