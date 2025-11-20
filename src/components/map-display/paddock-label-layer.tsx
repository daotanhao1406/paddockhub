import { useEffect } from 'react'

import '@/components/map-display/index.css'

interface PaddockLabelLayerProps {
  featureGroupRef: React.RefObject<L.FeatureGroup | null>
  showLabels: boolean
  dependencies: any[]
}

/**
 * Component quản lý Label cho các Paddock đang vẽ/sửa.
 * Sử dụng bindTooltip thay vì tạo Marker riêng để tối ưu hiệu năng.
 */
export default function PaddockLabelLayer({
  featureGroupRef,
  showLabels,
  dependencies,
}: PaddockLabelLayerProps) {
  useEffect(() => {
    const fg = featureGroupRef.current
    if (!fg) return

    fg.eachLayer((layer: any) => {
      // Lấy tên từ feature đã gắn hoặc tên mặc định
      const name = layer.feature?.properties?.name

      if (showLabels && name) {
        // Nếu chưa có tooltip thì bind mới, nếu có rồi thì thôi
        if (!layer.getTooltip()) {
          layer.bindTooltip(name, {
            permanent: true,
            direction: 'center',
            className: 'paddock-label', // Class CSS tạo bóng chữ
          })
        } else {
          // Nếu tên thay đổi thì update content
          layer.setTooltipContent(name)
        }

        // Mở tooltip
        if (!layer.isTooltipOpen()) {
          layer.openTooltip()
        }
      } else {
        // Tắt label: unbind hoàn toàn để xóa khỏi bản đồ
        layer.unbindTooltip()
      }
    })
  }, [showLabels, dependencies, featureGroupRef]) // Chạy lại khi bật/tắt hoặc khi danh sách paddock thay đổi

  return null // Component này không render UI
}
