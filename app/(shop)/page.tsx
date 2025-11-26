'use client'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useProducts } from '@/app/context/ProductContext'

import CategoryGrid from '@/app/components/CategoryGrid'
import CategoryGridSkeleton from '@ui/CategoryGridSkeleton'
import Contenido from '@/app/components/Contenido'
import GoogleReviews from '@/app/components/GoogleReviews'
import BrandsCarousel from '@/app/components/BrandsCarousel'

export default function HomePage() {
  // Lee el parámetro de búsqueda ?q= y elimina espacios laterales
  const searchParams = useSearchParams()
  const query = searchParams.get('q')?.trim() || ''

  // Estado global de productos (lista, carga y error)
  const { productos, loading, error } = useProducts()

  // Construye la lista de categorías únicas a partir de los productos
  // Nota: cuando loading es true devolvemos [], para evitar renders innecesarios
  const categorias = useMemo(() => {
    if (loading) return []
    const categoriasUnicas = new Set<string>()
    productos.forEach((p) => {
      if (p.categoria) categoriasUnicas.add(p.categoria)
    })
    return Array.from(categoriasUnicas).map((nombre) => ({ nombre }))
  }, [productos, loading])

  // Vista de resultados cuando existe una búsqueda (?q=...)
  if (query) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="my-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center">
            {`Resultados para: "${query}"`}
          </h1>
        </div>

        {/* Muestra la grilla de productos filtrada por query.
           - Pasamos loading y error para que Contenido maneje estados. */}
        <Contenido
          productos={productos}
          loading={loading}
          error={error}
          query={query}
          categoriaActiva=""
        />
      </div>
    )
  }

  // Vista principal (sin búsqueda): muestra catálogo, reseñas y marcas
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Encabezado de la página con título destacado */}
      <header className="mt-6 mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Explorá nuestro catálogo
        </h2>
        {/* Línea divisoria con gradiente */}
        <div className="mx-auto mt-2 h-1 w-40 bg-gradient-to-r from-orange-500 to-violet-500 rounded-full" />
      </header>

      {/* Sección de categorías:
         - Skeleton mientras carga
         - Grid cuando hay datos
         - Mensaje vacío cuando no hay categorías */}
      <section>
        {loading ? (
          <CategoryGridSkeleton />
        ) : categorias.length > 0 ? (
          <CategoryGrid categorias={categorias} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay categorías disponibles en este momento.</p>
          </div>
        )}
      </section>

      {/* Reseñas de Google (sección independiente para facilitar reordenamiento futuro) */}
      <section>
        <GoogleReviews />
      </section>

      {/* Carrusel de marcas (sección final del home) */}
      <section>
        <BrandsCarousel />
      </section>
    </div>
  )
}
