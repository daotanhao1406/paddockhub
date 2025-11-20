'use client'
import L from 'leaflet'
import { forwardRef, useEffect } from 'react'
import { FeatureGroup } from 'react-leaflet'

import { PaddockFeature } from '@/lib/types'

interface Props {
  paddocks: { features: PaddockFeature[] }
  getStyle?: (feature: PaddockFeature) => L.PathOptions
}

export const PolygonPaddockLayer = forwardRef<L.FeatureGroup, Props>(
  ({ paddocks, getStyle }, ref) => {
    useEffect(() => {
      // Ép kiểu ref để truy cập FeatureGroup instance
      const fg = (ref as React.MutableRefObject<L.FeatureGroup>).current
      if (!fg) return

      fg.clearLayers()

      paddocks.features.forEach((feature) => {
        // Logic Style: Nếu có hàm getStyle thì dùng, không thì dùng mặc định
        const defaultStyle = { color: '#3b82f6', weight: 2, fillOpacity: 0.3 }
        const customStyle = getStyle ? getStyle(feature) : {}
        const finalStyle = { ...defaultStyle, ...customStyle }

        const layer = L.geoJSON(feature, {
          style: finalStyle,
        })

        // Lấy layer thực từ GeoJSON group
        const leafletLayer = layer.getLayers()[0] as L.Polygon & {
          feature?: PaddockFeature
        }

        if (leafletLayer) {
          leafletLayer.feature = feature // Gắn lại feature để LabelLayer đọc được
          fg.addLayer(leafletLayer)
        }
      })
    }, [paddocks, getStyle, ref])

    return <FeatureGroup ref={ref} />
  },
)
PolygonPaddockLayer.displayName = 'PolygonPaddockLayer'
