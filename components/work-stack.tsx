"use client"

import Link from "next/link"
import { useState } from "react"

import { BeforeAfter, pairIsComplete } from "@/components/before-after"
import { useLive } from "@/components/live-public"
import { photoIsReady, slugFromCaption, type LivePhoto } from "@/lib/public"

export function WorkStack() {
  const { photos, pairs } = useLive()
  const imaged = photos.filter((photo) => photoIsReady(photo))
  const sliders = pairs.filter((pair) => pairIsComplete(pair))

  if (imaged.length === 0 && sliders.length === 0) return null

  return (
    <div className="mx-auto mt-8 flex max-w-lg flex-col gap-6">
      {imaged.map((photo, index) => (
        <WorkPhoto key={`${photo.src}-${photo.id ?? index}`} photo={photo} priority={index === 0} />
      ))}
      {sliders.map((pair) => (
        <BeforeAfter key={pair.id} pair={pair} />
      ))}
    </div>
  )
}

function WorkPhoto({ photo, priority }: { photo: LivePhoto; priority: boolean }) {
  const [hidden, setHidden] = useState(!photoIsReady(photo))
  if (hidden) return null
  const slug = photo.slug || slugFromCaption(photo.caption)

  return (
    <figure className="overflow-hidden bg-card ring-1 ring-gold/50">
      <Link href={slug ? `/?job=${slug}#quote` : "/#quote"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={photo.caption}
          width={photo.width}
          height={photo.height}
          className="h-auto w-full"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setHidden(true)}
        />
        {photo.caption ? (
          <figcaption className="border-t border-gold/50 px-4 py-3 font-display text-2xl font-semibold uppercase tracking-[0.12em] text-ink">
            {photo.caption}
          </figcaption>
        ) : null}
      </Link>
    </figure>
  )
}
