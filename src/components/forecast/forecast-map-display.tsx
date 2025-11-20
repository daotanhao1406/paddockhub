// components/paddock-forecast/forecast-map-display.tsx
'use client'

import L from 'leaflet'
import { Tag } from 'lucide-react'
import { useRef, useState } from 'react'
import { MapContainer } from 'react-leaflet'

import AutoFitBounds from '@/components/map-display/auto-fit-bounds'
import BaseMapLayer from '@/components/map-display/base-map-layer'
import { LeafletControl } from '@/components/map-display/leaflet-control'
import { MapActionButton } from '@/components/map-display/map-action-button'
import PaddockLabelLayer from '@/components/map-display/paddock-label-layer'
import { PolygonPaddockLayer } from '@/components/map-display/polygon-paddock-layer'

import { usePaddockBuilderStore } from '@/stores/use-paddock-builder-store'

// Import các component tái sử dụng

export function ForecastMapDisplay({
  selectedPaddockName,
}: {
  selectedPaddockName: string | null
}) {
  const { paddocks } = usePaddockBuilderStore()
  const [showLabels, setShowLabels] = useState(false)
  const featureGroupRef = useRef<L.FeatureGroup>(null)

  // Hàm style tùy chỉnh cho Forecast (Logic highlight/dim)
  const getForecastStyle = (feature: any) => {
    const isSelected = feature.properties.name === selectedPaddockName
    const showAll = selectedPaddockName === null

    if (showAll || isSelected) {
      return {
        color: feature.properties.color || '#3b82f6',
        weight: 2,
        fillOpacity: 0.4,
      }
    } else {
      return {
        color: '#9ca3af',
        weight: 1,
        fillOpacity: 0.1,
        fillColor: '#9ca3af',
      }
    }
  }

  return (
    <div className='h-full w-full relative'>
      <MapContainer
        center={[-25.3, 135.1]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
      >
        <BaseMapLayer />

        {/* Render Paddocks với Style tùy chỉnh */}
        <PolygonPaddockLayer
          ref={featureGroupRef}
          paddocks={paddocks}
          getStyle={getForecastStyle}
        />

        <LeafletControl position='topleft'>
          <MapActionButton
            icon={Tag}
            label='Show paddock name'
            isActive={showLabels}
            onClick={() => setShowLabels((prev) => !prev)}
          />
        </LeafletControl>

        {/* Logic phụ trợ (Labels & Zoom) */}
        <PaddockLabelLayer
          featureGroupRef={featureGroupRef}
          showLabels={showLabels}
          dependencies={[paddocks, selectedPaddockName]} // Re-scan label khi data đổi
        />
        <AutoFitBounds
          featureGroupRef={featureGroupRef}
          dependencies={selectedPaddockName} // Zoom khi data đổi
        />
      </MapContainer>
    </div>
  )
}
