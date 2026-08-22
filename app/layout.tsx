import type { Metadata } from "next"

import { JsonLd } from "@/components/json-ld"
import { QuoteBlock } from "@/components/quote-block"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThumbDock } from "@/components/thumb-dock"
import { marks, site } from "@/lib/site"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: site.seoTitle,
    template: `%s | ${site.shortName}`,
  },
  description: site.seoDescription,
  applicationName: site.legalName,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: site.seoTitle,
    description: site.seoDescription,
    url: site.siteUrl,
    siteName: site.legalName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: marks.og,
        alt: "Solid Craft Construction house mark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seoTitle,
    description: site.seoDescription,
    images: [marks.og],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-ground text-ink">
        <JsonLd />
        <div className="flex min-h-full flex-col pb-28 md:pb-0">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <QuoteBlock />
          <SiteFooter />
          <ThumbDock />
        </div>
      </body>
    </html>
  )
}
