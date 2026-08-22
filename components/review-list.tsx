"use client"

import { useLive } from "@/components/live-public"

export function ReviewList() {
  const { copy, reviews } = useLive()
  if (reviews.length === 0) return null

  return (
    <section id="reviews" className="border-t border-gold/40">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-4xl sm:text-5xl">{copy.reviewsHeading}</h2>
        <ul className="mt-8 flex max-w-xl flex-col gap-5">
          {reviews.map((review) => (
            <li key={review.id} className="bg-card p-5 ring-1 ring-gold/50">
              <p className="text-gold" aria-label={`${review.stars} stars`}>
                {"★".repeat(review.stars)}
              </p>
              <p className="mt-3 whitespace-pre-line text-lg font-medium">{review.text}</p>
              <p className="mt-3 text-sm font-semibold text-mute">{review.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
