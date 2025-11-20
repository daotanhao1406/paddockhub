import { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface MapActionButtonProps {
  icon: LucideIcon
  label: string
  isActive?: boolean
  onClick: () => void
}

export function MapActionButton({
  icon: Icon,
  label,
  isActive,
  onClick,
}: MapActionButtonProps) {
  return (
    <div className='leaflet-bar !border-none !shadow-[0_1px_5px_rgba(0,0,0,0.65)] mb-2 ml-0.5'>
      {/* mb-2 để tạo khoảng cách giữa các nhóm nút */}
      <div
        role='button'
        className={cn(
          // Style chuẩn của nút Leaflet
          'flex items-center justify-center h-7.5 w-7.5 cursor-pointer transition-colors border-b-0',
          // Bo góc
          'first:rounded-t last:rounded-b',
          isActive
            ? 'text-foreground-100 bg-foreground'
            : 'bg-white text-black',
        )}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onClick()
        }}
        title={label}
        aria-label={label}
      >
        <Icon size={15} strokeWidth={2.5} />
      </div>
    </div>
  )
}
