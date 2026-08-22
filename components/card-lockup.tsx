import Image from "next/image"

import { marks, site } from "@/lib/site"

export function CardLockup() {
  return (
    <Image
      src={marks.cardLockup}
      alt={site.legalName}
      width={832}
      height={620}
      className="h-auto w-full max-w-md bg-ground"
      unoptimized
      priority
    />
  )
}
