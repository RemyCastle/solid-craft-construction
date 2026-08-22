"use client"

import { createContext, useContext, useEffect, useState } from "react"

import {
  fallbackCopy,
  fallbackPairs,
  fallbackPhotos,
  fallbackReviews,
  fallbackServices,
  photoIsReady,
  type LiveCopy,
  type LivePair,
  type LivePhoto,
  type LiveReview,
  type LiveService,
} from "@/lib/public"

type Live = {
  copy: LiveCopy
  services: LiveService[]
  photos: LivePhoto[]
  pairs: LivePair[]
  reviews: LiveReview[]
  live: boolean
}

const LiveContext = createContext<Live>({
  copy: fallbackCopy,
  services: fallbackServices,
  photos: fallbackPhotos,
  pairs: fallbackPairs,
  reviews: fallbackReviews,
  live: false,
})

export function useLive() {
  return useContext(LiveContext)
}

export function LivePublicProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Live>({
    copy: fallbackCopy,
    services: fallbackServices,
    photos: fallbackPhotos,
    pairs: fallbackPairs,
    reviews: fallbackReviews,
    live: false,
  })

  useEffect(() => {
    let gone = false
    Promise.all([
      fetch("/api/public/site").then((res) => (res.ok ? res.json() : null)),
      fetch("/api/public/photos").then((res) => (res.ok ? res.json() : null)),
      fetch("/api/public/reviews").then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([siteRes, photoRes, reviewRes]) => {
        if (gone) return
        const copy = siteRes?.copy ? (siteRes.copy as LiveCopy) : fallbackCopy
        const services =
          Array.isArray(siteRes?.services) && siteRes.services.length
            ? (siteRes.services as LiveService[])
            : fallbackServices
        const photos = photoRes
          ? ((photoRes.photos as LivePhoto[]) || []).filter((photo) => photoIsReady(photo))
          : fallbackPhotos.filter((photo) => photoIsReady(photo))
        const pairs = photoRes
          ? ((photoRes.pairs as LivePair[]) || []).filter((pair) => pair.before && pair.after)
          : fallbackPairs.filter((pair) => pair.before && pair.after)
        const reviews = reviewRes
          ? ((reviewRes.reviews as LiveReview[]) || []).filter(
              (review) => review.name && review.text && review.stars >= 1 && review.stars <= 5,
            )
          : fallbackReviews
        setState({ copy, services, photos, pairs, reviews, live: Boolean(siteRes || photoRes || reviewRes) })
      })
      .catch(() => {
        // keep fallback so static export never goes blank
      })
    return () => {
      gone = true
    }
  }, [])

  return <LiveContext.Provider value={state}>{children}</LiveContext.Provider>
}
