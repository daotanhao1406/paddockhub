// components/map-shared/auto-fit-bounds.tsx
'use client'
import L from 'leaflet'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

interface AutoFitBoundsProps {
  featureGroupRef: React.RefObject<L.FeatureGroup | null>
  dependencies?: any // Khi data này thay đổi thì zoom lại
}

export default function AutoFitBounds({
  featureGroupRef,
  dependencies,
}: AutoFitBoundsProps) {
  const map = useMap()

  useEffect(() => {
    const fg = featureGroupRef.current
    if (!fg || fg.getLayers().length === 0) return

    try {
      const bounds = fg.getBounds()
      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.1))
      }
    } catch {
      // Ignore bounds errors
    }
  }, [map, featureGroupRef, dependencies])

  return null
}
