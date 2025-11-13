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
            Resultados para: "{query}"
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
      <header className="flex flex-col items-center justify-center mt-6 mb-12">
        <span className="text-3xl mb-1">✨</span>
        <h2 className="relative inline-block text-xl md:text-2xl font-bold text-gray-800 pb-2">
          Explorá nuestro catálogo
          {/* Subrayado decorativo centrado */}
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-orange-400 to-violet-500 rounded-full"></span>
        </h2>
      </header>

      {/* Sección de categorías:
         - Skeleton mientras carga
         - Grid cuando hay datos
         - Mensaje vacío cuando no hay categorías */}
      <section className="mb-16">
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
      <section className="mb-16">
        <GoogleReviews />
      </section>

      {/* Carrusel de marcas (sección final del home) */}
      <section className="mb-8">
        <BrandsCarousel />
      </section>
    </div>
  )
}
