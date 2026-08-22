import Image from "next/image"

import { marks, site } from "@/lib/site"

export function BrandMark({
  className = "h-14 w-auto",
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <Image
      src={marks.logoMark}
      alt={site.legalName}
      width={479}
      height={340}
      className={`object-contain ${className}`}
      unoptimized
      priority={priority}
    />
  )
}
