import type { Metadata } from "next"

import { ServicesView } from "@/components/services-view"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: site.workHeading,
  description: site.seoDescription,
  alternates: { canonical: "/services/" },
}

export default function ServicesPage() {
  return <ServicesView />
}
