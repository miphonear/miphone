'use client'
import Link from 'next/link'

// --- 1. IMPORTAMOS LOS ÍCONOS ---
import AppleIcon from '@/public/images/categories/apple.svg'
import AndroidIcon from '@/public/images/categories/android.svg'
import ConsolasIcon from '@/public/images/categories/consolas.svg'
import WearablesIcon from '@/public/images/categories/wearables.svg'
import FotoVideoIcon from '@/public/images/categories/foto-video.svg'
import AccesoriosIcon from '@/public/images/categories/accesorios.svg'
import DroneIcon from '@/public/images/categories/drone.svg'
import DefaultIcon from '@/public/images/categories/default.svg'

// --- 2. MAPEAMOS LOS ÍCONOS A LAS CATEGORÍAS ---
const ICONOS_CATEGORIAS: Record<string, React.ElementType> = {
  APPLE: AppleIcon,
  ANDROID: AndroidIcon,
  CONSOLAS: ConsolasIcon,
  WEARABLES: WearablesIcon,
  'FOTO-VIDEO': FotoVideoIcon,
  DRONE: DroneIcon,
  ACCESORIOS: AccesoriosIcon,
}

// --- 3. DEFINIMOS LAS PROPS QUE NECESITA EL COMPONENTE ---
interface Categoria {
  nombre: string
}

interface Props {
  categorias: Categoria[]
}

/**
 * CategoryGrid: Muestra un directorio visual de categorías en una grilla responsive,
 * utilizando el diseño de alta calidad del componente de tabs original.
 */
export default function CategoryGrid({ categorias }: Props) {
  // --- RENDERIZAMOS LA GRILLA con mejoras de accesibilidad, semántica,
  // focus states, manejo de overflow y fallbacks de datos/íconos.
  return (
    <section aria-label="Categorías de productos" className="my-6">
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
        role="grid"
        aria-label="Categorías de productos"
      >
        {categorias.map((c) => {
          const nombreSeguro = c?.nombre?.trim() || 'Categoría'
          const Icon = ICONOS_CATEGORIAS[nombreSeguro.toUpperCase()] || DefaultIcon
          const categoriaSlug = nombreSeguro.toLowerCase()

          return (
            // role="row" requerido para que los hijos role="gridcell" sean válidos
            // className="contents" evita introducir caja visual extra y mantiene el layout de CSS Grid
            <div key={nombreSeguro} role="row" className="contents">
              <Link
                href={`/${categoriaSlug}`}
                // Accesibilidad: rol de celda y etiqueta descriptiva
                role="gridcell"
                aria-label={`Ver productos de ${nombreSeguro}`}
                // Focus visible para navegación por teclado
                className={`group relative flex flex-col items-center justify-center 
                w-full h-full aspect-square rounded-3xl border-2
                transition-all duration-300 transform
                bg-white text-gray-800 border-gray-200 
                hover:border-orange-500 hover:ring-4 hover:ring-orange-500/20 hover:shadow-md md:hover:-translate-y-1
                focus:outline-none focus-visible:border-orange-500 focus-visible:ring-4 focus-visible:ring-orange-500/20`}
              >
                {/* Icono SVG dinámico */}
                <div className="w-1/2 h-1/2 mb-2 flex items-center justify-center">
                  <Icon
                    className={`w-full h-full object-contain transition-transform duration-300
                             text-gray-700 group-hover:scale-110`}
                    aria-hidden="true"
                  />
                </div>

                {/* Texto con clamp para nombres largos */}
                <div className="px-2 w-full flex items-center justify-center">
                  <span className="text-sm md:text-base font-bold text-center break-words leading-tight line-clamp-2">
                    {nombreSeguro}
                  </span>
                </div>

                {/* CTA decorativa sólo en hover (oculta a lectores de pantalla) */}
                <div
                  className={`absolute bottom-3 items-center gap-1 text-xs font-bold 
                           transition-opacity duration-300
                           opacity-0 group-hover:opacity-100 group-hover:text-orange-600
                           hidden md:flex`}
                  aria-hidden="true"
                >
                  <span>Ver Productos</span>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}
