"use client"

import { createContext, useContext, useEffect, useState } from "react"

import {
  fallbackCopy,
  fallbackPairs,
  fallbackPhotos,
  fallbackServices,
  photoIsReady,
  type LiveCopy,
  type LivePair,
  type LivePhoto,
  type LiveService,
} from "@/lib/public"

type Live = {
  copy: LiveCopy
  services: LiveService[]
  photos: LivePhoto[]
  pairs: LivePair[]
  live: boolean
}

const LiveContext = createContext<Live>({
  copy: fallbackCopy,
  services: fallbackServices,
  photos: fallbackPhotos,
  pairs: fallbackPairs,
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
    live: false,
  })

  useEffect(() => {
    let gone = false
    Promise.all([
      fetch("/api/public/site").then((res) => (res.ok ? res.json() : null)),
      fetch("/api/public/photos").then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([siteRes, photoRes]) => {
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
        setState({ copy, services, photos, pairs, live: Boolean(siteRes || photoRes) })
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
