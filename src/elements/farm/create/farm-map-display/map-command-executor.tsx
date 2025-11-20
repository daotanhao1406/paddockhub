'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

import { usePaddockStore } from '@/stores/use-paddock-store'

/**
 * Component con thực thi các lệnh điều khiển map từ bên ngoài
 * (ví dụ: từ ô tìm kiếm).
 */
export default function MapCommandExecutor() {
  const map = useMap()
  const { mapCommand, clearMapCommand } = usePaddockStore()

  useEffect(() => {
    if (!mapCommand) return

    switch (mapCommand.id) {
      case 'setView':
        map.setView(mapCommand.payload.center, mapCommand.payload.zoom)
        break
      case 'fitBounds':
        map.fitBounds(mapCommand.payload)
        break
    }
    clearMapCommand() // Xóa lệnh sau khi thực thi
  }, [map, mapCommand, clearMapCommand])

  return null // Không render UI
}
