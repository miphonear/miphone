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

interface HeaderProps {
  initialValue: string
  onSearch: (_value: string) => void
}

export default function Header({ initialValue, onSearch }: HeaderProps) {
  const [anim, setAnim] = useState(true)

  useEffect(() => {
    // Reducimos el timeout para que la animación termine justo cuando el usuario termina de leer
    const timeout = setTimeout(() => setAnim(false), 1300)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <header className="bg-transparent">
      {/* Ajuste: pt-8 en móvil para ganar espacio, pt-12 en desktop */}
      <div className="container mx-auto px-4 pt-8 md:pt-12 pb-4 flex flex-col items-center">
        {/* SLOGAN
            - Eliminado el div wrapper innecesario.
            - mb-4: Menos separación con los badges.
            - cursor-default select-none: Sensación de UI nativa/Premium.
        */}
        <h1 className="mb-4 max-w-3xl cursor-default select-none text-center text-5xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-6xl">
          Lo bueno se{' '}
          <span
            className={`bg-gradient-to-r from-[#FF6D0C] to-[#C051FF] bg-clip-text text-transparent ${
              anim ? 'bounce-up-once' : ''
            }`}
          >
            recomienda.
          </span>
        </h1>

        {/* BADGES
            - mb-8: Separación justa con el buscador (antes era mb-12).
            - Semántica: Usamos <ul/> para accesibilidad (screen readers saben que es una lista).
        */}
        <ul className="mb-8 flex flex-wrap justify-center gap-2">
          {BADGES.map((badge, i) => (
            <li key={i}>
              <Badge emoji={badge.emoji}>{badge.text}</Badge>
            </li>
          ))}
        </ul>

        {/* Search bar */}
        <div className="w-full max-w-2xl">
          <SearchBar initialValue={initialValue} onSearch={onSearch} />
        </div>
      </div>
    </header>
  )
}
