import Image from "next/image"
import Link from "next/link"

import { workPhotos } from "@/lib/site"

export function WorkStack() {
  return (
    <div className="mx-auto mt-8 flex max-w-lg flex-col gap-6">
      {workPhotos.map((photo, index) => (
        <figure key={photo.src} className="overflow-hidden bg-card ring-1 ring-gold/50">
          <Link href={`/?job=${photo.slug}#quote`}>
            <Image
              src={photo.src}
              alt={photo.caption}
              width={photo.width}
              height={photo.height}
              className="h-auto w-full"
              unoptimized
              priority={index === 0}
            />
            <figcaption className="border-t border-gold/50 px-4 py-3 font-display text-2xl font-semibold uppercase tracking-[0.12em] text-ink">
              {photo.caption}
            </figcaption>
          </Link>
        </figure>
      ))}
    </div>
  )
}
