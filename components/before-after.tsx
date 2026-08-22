"use client"

import { useState } from "react"

import type { LivePair } from "@/lib/public"

export function BeforeAfter({ pair }: { pair: LivePair }) {
  const [pct, setPct] = useState(50)

  if (!pair.before || !pair.after || !pair.caption) return null

  return (
    <figure className="overflow-hidden bg-card ring-1 ring-gold/50">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pair.after} alt="" className="block h-auto w-full" />
        <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pct}%` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pair.before}
            alt=""
            className="absolute inset-y-0 left-0 h-full w-auto max-w-none"
            style={{ width: `${10000 / pct}%`, maxWidth: "none" }}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-gold"
          style={{ left: `${pct}%` }}
        />
        <label className="sr-only" htmlFor={`ba-${pair.id}`}>
          Compare before and after
        </label>
        <input
          id={`ba-${pair.id}`}
          type="range"
          min={1}
          max={99}
          value={pct}
          onChange={(event) => setPct(Number(event.target.value))}
          className="absolute inset-0 cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="border-t border-gold/50 px-4 py-3 font-display text-2xl font-semibold uppercase tracking-[0.12em] text-ink">
        {pair.caption}
      </figcaption>
    </figure>
  )
}
