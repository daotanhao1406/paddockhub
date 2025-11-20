'use client'

import L from 'leaflet'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useMap } from 'react-leaflet'

interface LeafletControlProps {
  position: 'topleft' | 'topright' | 'bottomleft' | 'bottomright'
  children: React.ReactNode
  className?: string
}

export function LeafletControl({
  position,
  children,
  className,
}: LeafletControlProps) {
  const map = useMap()

  // Tạo một thẻ div để chứa nội dung của chúng ta
  // useRef để giữ nguyên element này suốt vòng đời component
  const containerRef = useRef(document.createElement('div'))

  useEffect(() => {
    const container = containerRef.current

    // Thêm class để styling nếu cần (ví dụ: leaflet-bar để gom nhóm)
    if (className) {
      container.className = className
    }

    // Ngăn sự kiện click xuyên qua bản đồ (quan trọng!)
    L.DomEvent.disableClickPropagation(container)
    L.DomEvent.disableScrollPropagation(container)

    // Tạo một class L.Control tùy chỉnh
    const ControlClass = L.Control.extend({
      onAdd: () => container,
      onRemove: () => {
        // Cleanup nếu cần
      },
    })

    // Khởi tạo và thêm vào bản đồ
    const control = new ControlClass({ position })
    control.addTo(map)

    // Cleanup khi unmount
    return () => {
      control.remove()
    }
  }, [map, position, className])

  // Dùng Portal để render React Children vào trong div của Leaflet
  return createPortal(children, containerRef.current)
}
