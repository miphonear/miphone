// app/components/BrandsCarousel.tsx
'use client'
import { useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'

// Logos
import AppleLogo from '@/public/images/brands/apple-logo.svg'
import CanonLogo from '@/public/images/brands/canon-logo.svg'
import TamronLogo from '@/public/images/brands/tamron-logo.svg'
import DjiLogo from '@/public/images/brands/dji-logo.svg'
import GalaxyLogo from '@/public/images/brands/galaxy-logo.svg'
import GoproLogo from '@/public/images/brands/gopro-logo.svg'
import Insta360Logo from '@/public/images/brands/Insta360-logo.svg'
import MetaLogo from '@/public/images/brands/meta-logo.svg'
import NikonLogo from '@/public/images/brands/nikon-logo.svg'
import NintendoLogo from '@/public/images/brands/nintendo-logo.svg'
import PixelLogo from '@/public/images/brands/pixel-logo.svg'
import PlaystationLogo from '@/public/images/brands/playstation-logo.svg'
import RealmeLogo from '@/public/images/brands/realme-logo.svg'
import SigmaLogo from '@/public/images/brands/sigma-logo.svg'
import SonyLogo from '@/public/images/brands/sony-logo.svg'
import XboxLogo from '@/public/images/brands/xbox-logo.svg'
import XiaomiLogo from '@/public/images/brands/xiaomi-logo.svg'

interface BrandsCarouselProps {
  onSearch?: (value: string) => void
}

const MARCAS = [
  { name: 'Apple', Logo: AppleLogo, tag: 'iPhone' },
  { name: 'Xiaomi', Logo: XiaomiLogo, tag: 'Xiaomi' },
  { name: 'Samsung', Logo: GalaxyLogo, tag: 'Samsung' },
  { name: 'Pixel', Logo: PixelLogo, tag: 'Pixel' },
  { name: 'Realme', Logo: RealmeLogo, tag: 'Realme' },
  { name: 'PlayStation', Logo: PlaystationLogo, tag: 'PlayStation' },
  { name: 'Nintendo', Logo: NintendoLogo, tag: 'Nintendo' },
  { name: 'Xbox', Logo: XboxLogo, tag: 'Xbox' },
  { name: 'Meta', Logo: MetaLogo, tag: 'Meta' },
  { name: 'GoPro', Logo: GoproLogo, tag: 'GoPro' },
  { name: 'Insta360', Logo: Insta360Logo, tag: 'Insta360' },
  { name: 'Canon', Logo: CanonLogo, tag: 'Canon' },
  { name: 'Nikon', Logo: NikonLogo, tag: 'Nikon' },
  { name: 'Sony', Logo: SonyLogo, tag: 'Sony' },
  { name: 'Sigma', Logo: SigmaLogo, tag: 'Sigma' },
  { name: 'Tamron', Logo: TamronLogo, tag: 'Tamron' },
  { name: 'DJI', Logo: DjiLogo, tag: 'Dji' },
]

const SCROLL_SPEED = 0.3 // Velocidad

export default function BrandsCarousel({ onSearch }: BrandsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const isHoveringRef = useRef(false)
  const currentScrollRef = useRef(0) // Acumulador de scroll
  const marcasLoop = [...MARCAS, ...MARCAS]

  const scrollAnimation = useCallback(() => {
    if (containerRef.current && !isHoveringRef.current) {
      const el = containerRef.current
      // Incrementamos el acumulador con precisión decimal
      currentScrollRef.current += SCROLL_SPEED
      // Aplicamos el valor redondeado al DOM
      el.scrollLeft = Math.round(currentScrollRef.current)

      const maxScroll = el.scrollWidth - el.clientWidth
      const halfScroll = maxScroll / 2

      if (el.scrollLeft >= halfScroll) {
        // Reseteamos el acumulador y el scrollLeft
        currentScrollRef.current -= halfScroll
        el.scrollLeft -= halfScroll
      }
    }
    animationFrameRef.current = requestAnimationFrame(scrollAnimation)
  }, [])

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(scrollAnimation)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [scrollAnimation])

  const handleMouseEnter = () => {
    isHoveringRef.current = true
  }
  const handleMouseLeave = () => {
    isHoveringRef.current = false
  }

  return (
    <div className="max-w-6xl mx-auto mt-6">
      <div className="flex flex-col items-center justify-center mb-6">
        <span className="text-3xl mb-1">🏷️</span>
        <h2 className="relative inline-block text-xl md:text-2xl font-bold text-gray-800 pb-2 text-center">
          {/* Texto responsivo */}
          <span className="sm:hidden">Las mejores marcas</span>
          <span className="hidden sm:inline">Productos de las mejores marcas</span>

          {/* Subrayado decorativo */}
          <span
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 
                 bg-gradient-to-r from-orange-400 to-violet-500 rounded-full"
          ></span>
        </h2>
      </div>
      <div
        ref={containerRef}
        className="flex gap-12 md:gap-24 overflow-x-auto no-scrollbar"
        role="list"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {marcasLoop.map((m, i) => (
          <Link
            key={`${m.name}-${i}`}
            href={`/?q=${m.tag}`} // El Link apunta directamente a la URL de búsqueda.
            className="flex-shrink-0 focus:outline-none bg-transparent transition-transform duration-200 hover:scale-110"
            title={`Buscar productos de ${m.tag}`}
            role="listitem"
          >
            <div className="w-[90px] h-[45px] md:w-[120px] md:h-[60px] flex items-center justify-center p-1 sm:p-2">
              <m.Logo
                className="max-h-full max-w-full filter grayscale opacity-70 transition duration-200 hover:filter-none hover:opacity-100"
                aria-label={m.name}
                draggable={false}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
