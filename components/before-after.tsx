"use client"

import { useRef, useState } from "react"

import type { LivePair } from "@/lib/public"

export function pairIsComplete(pair: Pick<LivePair, "before" | "after">) {
  return Boolean(pair.before && pair.after)
}

export function BeforeAfter({ pair }: { pair: LivePair }) {
  const [pct, setPct] = useState(50)
  const [hidden, setHidden] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  if (!pairIsComplete(pair) || hidden) return null

  function setFromClientX(clientX: number) {
    const el = box.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.width <= 0) return
    const next = ((clientX - rect.left) / rect.width) * 100
    setPct(Math.min(99, Math.max(1, next)))
  }

  return (
    <figure className="overflow-hidden bg-card ring-1 ring-gold/50">
      <div
        ref={box}
        className="relative touch-none select-none"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          setFromClientX(event.clientX)
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            setFromClientX(event.clientX)
          }
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pair.after}
          alt=""
          draggable={false}
          className="pointer-events-none block h-auto w-full"
          onError={() => setHidden(true)}
        />
        <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pct}%` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pair.before}
            alt=""
            draggable={false}
            className="pointer-events-none absolute inset-y-0 left-0 h-full max-w-none"
            style={{ width: `${(100 / pct) * 100}%` }}
            onError={() => setHidden(true)}
          />
        </div>
        <div className="pointer-events-none absolute inset-y-0 z-10" style={{ left: `${pct}%` }}>
          <div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-gold" />
          <div className="absolute top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
        </div>
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
          className="sr-only"
        />
      </div>
      {pair.caption ? (
        <figcaption className="border-t border-gold/50 px-4 py-3 font-display text-2xl font-semibold uppercase tracking-[0.12em] text-ink">
          {pair.caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
