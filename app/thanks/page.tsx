import type { Metadata } from "next"
import Link from "next/link"

import { CallPair } from "@/components/call-pair"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Sent",
  robots: { index: false, follow: false },
}

export default function ThanksPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-16">
      <h1 className="text-5xl">Sent</h1>
      <p className="text-xl font-medium">{site.quoteThanks}</p>
      <CallPair />
      <Link href="/" className="cta cta-mail w-fit">
        Home
      </Link>
    </div>
  )
}
