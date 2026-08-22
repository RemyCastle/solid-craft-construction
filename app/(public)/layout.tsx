import { JsonLd } from "@/components/json-ld"
import { LivePublicProvider } from "@/components/live-public"
import { QuoteBlock } from "@/components/quote-block"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThumbDock } from "@/components/thumb-dock"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <LivePublicProvider>
      <JsonLd />
      <div className="flex min-h-full flex-col pb-28 md:pb-0">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <QuoteBlock />
        <SiteFooter />
        <ThumbDock />
      </div>
    </LivePublicProvider>
  )
}
