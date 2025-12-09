'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

// --- 1. IMPORTAMOS LOS ÍCONOS ---
import AppleIcon from '@/public/images/categories/apple.svg'
import AndroidIcon from '@/public/images/categories/android.svg'
import ConsolasIcon from '@/public/images/categories/consolas.svg'
import WearablesIcon from '@/public/images/categories/wearables.svg'
import FotoVideoIcon from '@/public/images/categories/foto-video.svg'
import AccesoriosIcon from '@/public/images/categories/accesorios.svg'
import DroneIcon from '@/public/images/categories/drone.svg'
import DefaultIcon from '@/public/images/categories/default.svg'

// --- 2. MAPEAMOS LOS ÍCONOS ---
const ICONOS_CATEGORIAS: Record<string, React.ElementType> = {
  APPLE: AppleIcon,
  ANDROID: AndroidIcon,
  CONSOLAS: ConsolasIcon,
  WEARABLES: WearablesIcon,
  'FOTO-VIDEO': FotoVideoIcon,
  DRONE: DroneIcon,
  ACCESORIOS: AccesoriosIcon,
}

// --- 3. TYPES ---
interface Categoria {
  nombre: string
}

interface Props {
  categorias: Categoria[]
}

/**
 * CategoryGrid
 * Tarjetas amplias, alineación izquierda, micro-interacción con flecha diagonal.
 */
function CategoryGrid({ categorias }: Props) {
  return (
    // w-full y my-8 para alinear con el resto
    <section aria-label="Categorías de productos" className="w-full my-8">
      <div
        // grid-cols-2 en móvil para que no sea infinita. 4 en desktop.
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        role="grid"
      >
        {categorias.map((c) => {
          const nombreSeguro = c?.nombre?.trim() || 'Categoría'
          const Icon = ICONOS_CATEGORIAS[nombreSeguro.toUpperCase()] || DefaultIcon
          const categoriaSlug = nombreSeguro.toLowerCase()

          return (
            <div key={nombreSeguro} role="row" className="contents">
              <Link
                href={`/${categoriaSlug}`}
                role="gridcell"
                aria-label={`Explorar ${nombreSeguro}`}
                // Mata el borde azul nativo (Chrome/Safari)
                style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                className="
                  group relative flex flex-col justify-between
                  /* Altura con presencia (h-36 móvil, h-44 desktop) */
                  h-36 sm:h-44 w-full p-6 
                  bg-white rounded-3xl
                  
                  /* Borde base de 2px sólido */
                  border-2 border-gray-200
                  
                  transition-all duration-300 ease-out
                  overflow-hidden
                  
                  /* Eliminar outline azul y activar Ring Naranja en Hover */
                  outline-none focus:outline-none active:outline-none
                  hover:border-transparent hover:ring-2 hover:ring-orange-500 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1
                  focus:border-transparent focus:ring-2 focus:ring-orange-500
                "
              >
                {/* 
                   FONDO DECORATIVO: 
                   Un degradado muy sutil que aparece en hover para dar "luz" 
                */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-transparent to-orange-50/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                  aria-hidden="true"
                />

                {/* HEADER: Icono + Flecha */}
                <div className="relative z-10 flex w-full items-start justify-between">
                  {/* Icono de la categoría */}
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-700 transition-colors duration-500 group-hover:bg-orange-50 group-hover:text-orange-600">
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 object-contain" aria-hidden="true" />
                  </div>

                  {/* 
                     MICRO-INTERACCIÓN DE FLECHA
                  */}
                  <ArrowUpRight className="h-6 w-6 text-gray-300 transition-all duration-500 group-hover:text-orange-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>

                {/* FOOTER: Texto y Animación Hover */}
                <div className="relative z-10 mt-auto pt-2">
                  <div className="flex flex-col transition-transform duration-500 ease-out group-hover:-translate-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                      {nombreSeguro}
                    </h3>

                    {/* AJUSTE: "Ver productos" aparece suavemente desde abajo */}
                    <div
                      className="h-0 opacity-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:h-5 group-hover:opacity-100 group-hover:mt-1"
                      aria-hidden="true"
                    >
                      <span className="text-xs font-semibold text-orange-600">Ver productos</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// Memoizar componente para evitar re-renders cuando las props no cambian
export default React.memo(CategoryGrid)
