'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ScrollButton({
  direction,
  onClick,
}: {
  direction: 'left' | 'right'
  onClick: () => void
}) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight
  const positionClass =
    direction === 'left' ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'

  return (
    <button
      onClick={onClick}
      aria-label={direction === 'left' ? 'Anterior' : 'Siguiente'}
      className={`hidden md:block absolute ${positionClass} top-1/2 -translate-y-1/2 p-2 rounded-full bg-white border shadow hover:transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 group z-30`}
    >
      <Icon className="w-8 h-8 text-gray-600 transition-colors group-hover:text-orange-500" />
    </button>
  )
}
