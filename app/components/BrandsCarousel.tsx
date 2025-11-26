// app/components/BrandsCarousel.tsx
'use client'
import Link from 'next/link'

// --- Logos (SVG optimizados) ---
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

// --- Marcas ---
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

// --- Carrusel con animación CSS ---
export default function BrandsCarousel() {
  const logos = [...MARCAS, ...MARCAS]

  return (
    <div className="w-full max-w-7xl mx-auto mt-8">
      <div className="flex flex-col items-center justify-center mb-8">
        <span className="text-3xl mb-2" role="img" aria-label="Etiqueta">
          🏷️
        </span>
        <h2 className="relative inline-block text-xl md:text-2xl font-bold text-gray-800 pb-2 text-center">
          <span className="sm:hidden">Las mejores marcas</span>
          <span className="hidden sm:inline">Productos de las mejores marcas</span>
          <span
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 
                 bg-gradient-to-r from-orange-400 to-violet-500 rounded-full"
          ></span>
        </h2>
      </div>

      {/* Pista con máscara */}
      <div
        className="relative w-full overflow-hidden group py-4 
                   [mask-image:_linear-gradient(to_right,transparent_0,_black_10%,_black_90%,transparent_100%)]"
      >
        <div className="flex w-max animate-infinite-scroll group-hover:[animation-play-state:paused]">
          {logos.map((m, i) => (
            <Link
              key={`${m.name}-${i}`}
              href={`/?q=${m.tag}`}
              className="mx-6 sm:mx-8 md:mx-12 flex items-center justify-center focus:outline-none"
              title={`Buscar productos de ${m.tag}`}
              role="listitem"
              aria-label={`Buscar productos de ${m.name}`}
            >
              {/* Contenedor único para todos con tamaños mínimos/máximos fijos */}
              <div className="h-9 md:h-11 w-auto min-w-[64px] md:min-w-[72px] max-w-[128px] flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <m.Logo
                  className="h-full w-auto object-contain text-gray-500 filter grayscale opacity-50 transition-transform duration-300"
                  aria-hidden="true"
                  focusable="false"
                  draggable={false}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
