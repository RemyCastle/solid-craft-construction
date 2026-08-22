import Image from "next/image"

import { marks, site } from "@/lib/site"

export function CardLockup({
  className = "h-auto w-full max-w-md",
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <Image
      src={marks.cardLockup}
      alt={site.legalName}
      width={914}
      height={620}
      className={`bg-card object-contain ${className}`}
      unoptimized
      priority={priority}
    />
  )
}
