'use client'
import { useMemo, useCallback } from 'react'
import { useSearchParams, useRouter, notFound } from 'next/navigation'
import { useProducts } from '@/app/context/ProductContext'
import Contenido from '@/app/components/Contenido'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { CategorySkeleton } from '@ui/CategorySkeleton'
import SearchBar from '@/app/components/SearchBar'

interface CategoriaClientPageProps {
  params: {
    categoria: string
  }
}

export default function CategoriaClientPage({ params }: CategoriaClientPageProps) {
  const router = useRouter() // Hook para actualizar la URL al buscar

  // Lee el parámetro de búsqueda (?q=) desde la URL.
  // Nota: no se filtra aquí; Contenido decide cómo usarlo.
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  // Normaliza la categoría proveniente de la URL:
  // - Decodifica caracteres escapados
  // - Convierte a MAYÚSCULAS para comparaciones case-insensitive
  // - Elimina espacios sobrantes
  // - Maneja URLs malformadas sin romper la UI
  const categoriaDeURL = useMemo(() => {
    try {
      if (!params?.categoria) return ''
      return decodeURIComponent(params.categoria).toUpperCase().trim()
    } catch (error) {
      console.error('Error decodificando categoría:', error)
      return ''
    }
  }, [params?.categoria])

  // Genera un nombre legible para UI a partir de la categoría normalizada:
  // - Pasa a minúsculas
  // - Reemplaza guiones por " + " (decisión de branding/UX)
  // - Capitaliza cada palabra
  const categoriaNombreAmigable = useMemo(() => {
    if (!categoriaDeURL) return 'Categoría'

    const nombreLimpio = categoriaDeURL
      .toLowerCase()
      .replace(/-/g, ' + ')
      .split(' ')
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ')

    return nombreLimpio
  }, [categoriaDeURL])

  // Obtiene productos y estados globales desde el contexto centralizado
  const { productos, loading, error } = useProducts()

  // Filtra productos por categoría:
  // - Evita trabajo mientras carga o no hay datos
  // - Normaliza la categoría del producto para comparación exacta
  const productosDeLaCategoria = useMemo(() => {
    if (loading || !productos.length || !categoriaDeURL) {
      return []
    }

    return productos.filter((producto) => {
      // OPTIMIZACIÓN: Usar campo pre-computado si está disponible, sino calcular
      const categoriaProducto =
        producto._categoriaNormalizada ?? producto.categoria?.toUpperCase()?.trim()
      return categoriaProducto === categoriaDeURL
    })
  }, [productos, categoriaDeURL, loading])

  // Handler para el SearchBar local (estable para evitar re-renders en SearchBar)
  const handleSearch = useCallback(
    (val: string) => {
      if (val.trim()) {
        router.push(`/${params.categoria}?q=${encodeURIComponent(val)}`)
      } else {
        router.push(`/${params.categoria}`)
      }
    },
    [router, params.categoria],
  )

  // Skeleton mientras cargan los datos
  if (loading) {
    return <CategorySkeleton />
  }

  // 404 cuando la categoría no existe (ej. /asadasd)
  if (categoriaDeURL && productosDeLaCategoria.length === 0) {
    notFound()
  }

  // Render principal de la página de categoría:
  // - Encabezado con título y botón de regreso alineados
  // - Listado de contenido filtrado por categoría
  // - Wrapper raíz idéntico al de Home para evitar “baile”: w-full max-w-6xl mx-auto px-4 py-6
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2 md:py-6">
      {/* Línea separadora sutil con el header global:
          MEJORA: La línea divisora ahora solo se muestra en Desktop (md:block).
          En móvil la quitamos para que el contenido suba.
      */}
      <div className="hidden md:block w-full border-t border-gray-100 mb-8" />

      {/* Header */}
      <div className="relative mb-6 mt-4 md:mt-0 w-full max-w-3xl mx-auto flex items-center justify-center">
        {/* Título centrado */}
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 text-center tracking-tight px-12 md:px-0">
          {categoriaNombreAmigable}
        </h1>

        {/* Botón Volver */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <Link
            href="/"
            title="Volver al inicio"
            className="
                group flex items-center justify-center gap-1.5
                /* Mobile: Cuadrado/Redondo solo icono */
                w-10 h-10 
                /* Desktop: Ancho automático para texto */
                sm:w-auto sm:h-auto sm:px-4 sm:py-2
                
                bg-white border border-gray-200 
                rounded-full 
                text-sm font-semibold text-gray-600 
                hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 
                transition-all duration-200
              "
          >
            <ChevronLeft
              size={20}
              className="transition-transform duration-200 sm:group-hover:-translate-x-1"
            />
            {/* Texto: Oculto en mobile (hidden), visible en desktop (sm:inline) */}
            <span className="hidden sm:inline">Regresar</span>
          </Link>
        </div>
      </div>

      {/* Search Bar Local */}
      <div className="mb-6 md:mb-8 w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500 mx-auto">
        <SearchBar
          initialValue={query}
          onSearch={handleSearch}
          placeholder={`Buscar en ${categoriaNombreAmigable}`}
          hideSuggestions={true}
        />
      </div>

      {/* Listado */}
      <Contenido
        productos={productosDeLaCategoria}
        loading={false}
        error={error}
        query={query}
        categoriaActiva={categoriaDeURL}
      />
    </div>
  )
}
