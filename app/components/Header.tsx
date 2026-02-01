'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()

  // Detectamos si estamos en la raíz (Home)
  const isHome = pathname === '/'

  useEffect(() => {
    // Reducimos el timeout para que la animación termine justo cuando el usuario termina de leer
    const timeout = setTimeout(() => setAnim(false), 1300)
    return () => clearTimeout(timeout)
  }, [])

  return (
    // MEJORA: Ocultamos todo el header en mobile si no es el Home
    // Usamos 'hidden md:block' condicionado por isHome para que en categorías
    // el espacio blanco desaparezca totalmente en pantallas pequeñas.
    <header className={`bg-transparent ${!isHome ? 'hidden md:block' : 'block'}`}>
      <div className="container mx-auto px-4 pt-8 md:pt-12 pb-2 flex flex-col items-center">
        {/* SLOGAN */}
        <h1 className="mb-4 max-w-3xl cursor-default select-none text-center text-5xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-6xl">
          Lo bueno se{' '}
          <span
            className={`bg-gradient-to-r from-brand-orange to-brand-violet bg-clip-text text-transparent ${
              anim ? 'bounce-up-once' : ''
            }`}
          >
            recomienda.
          </span>
        </h1>

        {/* BADGES */}
        <ul className="mb-4 flex flex-wrap justify-center gap-2">
          {BADGES.map((badge, i) => (
            <li key={i}>
              <Badge emoji={badge.emoji}>{badge.text}</Badge>
            </li>
          ))}
        </ul>

        {/* 
            Search bar: 
            CONDICIÓN VISUAL
            Solo se renderiza si isHome es true.
            Esto evita que aparezca duplicado cuando entras a una categoría.
        */}
        {isHome && (
          <div className="w-full max-w-2xl mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SearchBar initialValue={initialValue} onSearch={onSearch} />
          </div>
        )}
      </div>
    </header>
  )
}
