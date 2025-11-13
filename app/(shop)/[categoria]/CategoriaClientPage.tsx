'use client'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useProducts } from '@/app/context/ProductContext'
import Contenido from '@/app/components/Contenido'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CategorySkeleton } from '@ui/CategorySkeleton'

interface CategoriaClientPageProps {
  params: {
    categoria: string
  }
}

export default function CategoriaClientPage({ params }: CategoriaClientPageProps) {
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
      const categoriaProducto = producto.categoria?.toUpperCase()?.trim()
      return categoriaProducto === categoriaDeURL
    })
  }, [productos, categoriaDeURL, loading])

  // Agregar el skeleton al loading
  if (loading) {
    return <CategorySkeleton categoriaNombre={categoriaNombreAmigable} />
  }

  // Render principal de la página de categoría:
  // - Encabezado con título y botón de regreso alineados
  // - Listado de contenido filtrado por categoría
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header alineado al ancho de las cards */}
      <div className="max-w-3xl w-full mx-auto">
        <div className="relative my-6">
          {/* Título centrado */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
            {categoriaNombreAmigable}
          </h1>

          {/* Botón a la derecha dentro del mismo ancho */}
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-base text-orange-500 hover:text-orange-600 font-semibold transition-colors p-2 rounded-md"
            >
              <ArrowLeft size={16} />
              <span className="sm:hidden">Volver</span>
              <span className="hidden sm:inline">Ver todas las categorías</span>
            </Link>
          </div>
        </div>
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
