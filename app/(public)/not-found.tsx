import Link from "next/link"

import { site } from "@/lib/site"

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-16">
      <h1 className="text-6xl">Wrong turn</h1>
      <p className="text-lg text-mute">{site.notFound}</p>
      <Link href="/" className="cta cta-call w-fit">
        Home
      </Link>
    </div>
  )
}
