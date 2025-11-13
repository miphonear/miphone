// Componente de Servidor (sin 'use client') para la ruta dinámica /[categoria]
import type { Metadata } from 'next'
import CategoriaClientPage from './CategoriaClientPage'

interface CategoriaPageProps {
  // En App Router, params puede resolverse de forma asíncrona
  params: Promise<{
    categoria: string
  }>
}

/**
 * Genera metadatos de la página (SEO) en el servidor.
 * - Decodifica y capitaliza el nombre de la categoría para el título.
 * - Mantiene la descripción genérica pero relevante para la categoría.
 */
export async function generateMetadata(props: CategoriaPageProps): Promise<Metadata> {
  const params = await props.params
  const categoriaNombre = decodeURIComponent(params.categoria)
  const titulo = categoriaNombre.charAt(0).toUpperCase() + categoriaNombre.slice(1)

  return {
    title: `${titulo} | miPhone™`,
    description:
      `Encontrá los mejores productos de la categoría ${titulo} en miPhone. ` +
      'Productos nuevos, sellados y con garantía escrita.',
  }
}

/**
 * Render principal de la página de categoría.
 * - Resuelve params en el servidor y los pasa al Client Component.
 * - Mantiene la lógica de datos/SEO en el servidor y la UI en el cliente.
 */
export default async function CategoriaPage({ params }: CategoriaPageProps) {
  const resolvedParams = await params
  return <CategoriaClientPage params={resolvedParams} />
}
