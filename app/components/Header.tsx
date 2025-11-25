'use client'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import SearchBar from './SearchBar'

const BADGES = [
  { emoji: '🛒', text: 'Tienda Online' },
  { emoji: '✅', text: 'Productos originales' },
  { emoji: '🚗', text: 'Entregas en CABA y GBA' },
  { emoji: '📦', text: 'Envíos a todo el país' },
]

// SECCIÓN: INTERFACES Y TIPOS
interface HeaderProps {
  initialValue: string
  onSearch: (_value: string) => void
}

// SECCIÓN: COMPONENTE PRINCIPAL
export default function Header({ initialValue, onSearch }: HeaderProps) {
  const [anim, setAnim] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setAnim(false), 1300)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <header className="bg-transparent">
      <div className="container mx-auto px-4 pt-12 pb-4 flex flex-col items-center">
        {/* Slogan */}
        <div className="w-full flex justify-center mb-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-center leading-tight tracking-tight max-w-3xl">
            Lo bueno se{' '}
            <span
              className={`bg-gradient-to-r from-[#FF6D0C] to-[#C051FF] text-transparent bg-clip-text ${
                anim ? 'bounce-up-once' : ''
              }`}
            >
              recomienda.
            </span>
          </h1>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-12">
          {BADGES.map((badge, i) => (
            <Badge key={i} emoji={badge.emoji}>
              {badge.text}
            </Badge>
          ))}
        </div>

        {/* Search bar */}
        <SearchBar initialValue={initialValue} onSearch={onSearch} />
      </div>
    </header>
  )
}
