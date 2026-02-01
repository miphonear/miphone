// Componente de Servidor (sin 'use client') para la ruta dinámica /[categoria]
import type { Metadata } from 'next'
import CategoriaClientPage from './CategoriaClientPage'

const SITE_URL = 'https://miphone.ar'

interface CategoriaPageProps {
  // En App Router, params puede resolverse de forma asíncrona
  params: Promise<{
    categoria: string
  }>
}

/** Misma lógica que categoriaNombreAmigable en el cliente: legible para título y OG */
function nombreAmigableCategoria(slug: string): string {
  if (!slug?.trim()) return 'Categoría'
  const decoded = decodeURIComponent(slug).trim()
  const amigable = decoded
    .toLowerCase()
    .replace(/-/g, ' + ')
    .split(' ')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
  return amigable || 'Categoría'
}

/**
 * Genera metadatos de la página (SEO) en el servidor.
 * - Título alineado con el h1 que ve el usuario (nombre amigable).
 * - Open Graph y Twitter para compartir con título y URL de la categoría.
 */
export async function generateMetadata(props: CategoriaPageProps): Promise<Metadata> {
  const params = await props.params
  const titulo = nombreAmigableCategoria(params.categoria)
  const title = `${titulo} | miPhone`
  const description =
    `Encontrá los mejores productos de la categoría ${titulo} en miPhone. ` +
    'Productos nuevos, sellados y con garantía escrita.'
  const url = `${SITE_URL}/${encodeURIComponent(params.categoria)}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'miPhone',
      locale: 'es_AR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
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
