import { services, site } from "@/lib/site"

export function ServiceList() {
  return (
    <ul className="mx-auto mt-10 flex max-w-sm flex-col items-center gap-5 text-center">
      {services.map((service) => (
        <li
          key={service.slug}
          className="font-display text-3xl font-medium uppercase tracking-[0.18em] text-ink"
        >
          {service.name}
        </li>
      ))}
      <li className="mt-4 font-display text-2xl font-medium uppercase tracking-[0.16em] text-gold">
        {site.freeEstimates}
      </li>
    </ul>
  )
}
