'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, startTransition } from 'react'

import AnnouncementBar from './AnnouncementBar'
import Nav from './Nav'
import Header from './Header'
import Footer from './Footer'
import ScrollToTopButton from './ScrollToTopButton'
import WhatsAppFloat from './WhatsAppFloat'
import BackgroundBlobs from './BackgroundBlobs'

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Query de búsqueda (?q=) sanitizada
  const query = useMemo(() => {
    const raw = searchParams.get('q')
    if (!raw) return ''
    return raw.trim().substring(0, 100).replace(/[<>]/g, '')
  }, [searchParams])

  // Path válido (para evitar pushes raros)
  const isValidPath = useMemo(() => {
    if (!pathname) return false
    return pathname.startsWith('/') && pathname.length > 0
  }, [pathname])

  // Handler de búsqueda (actualiza ?q= con transición suave)
  const handleSearch = useCallback(
    (newQuery: string) => {
      try {
        const trimmed = newQuery.trim().substring(0, 100).replace(/[<>]/g, '')
        const params = new URLSearchParams(searchParams.toString())

        if (trimmed) params.set('q', trimmed)
        else params.delete('q')

        if (!isValidPath) {
          router.push('/')
          return
        }

        startTransition(() => {
          const next = `${pathname}?${params.toString()}`
          router.push(next)
        })
      } catch (error) {
        console.error('Error durante la búsqueda:', error)
        router.push(pathname)
      }
    },
    [router, pathname, searchParams, isValidPath],
  )

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Título para lectores de pantalla (SEO/Accesibilidad) */}
      <div className="sr-only">
        <h1>miPhone™ - Descubrí los mejores precios en tecnología. ¡A un clic de distancia!</h1>
      </div>

      {/* Fondo decorativo */}
      <BackgroundBlobs />

      {/* Encabezado del sitio */}
      <header className="relative z-20">
        <AnnouncementBar />
        <Nav />
        {/* Barra de búsqueda (alineada a 6xl y centrada) */}
        <div className="w-full max-w-6xl mx-auto px-4">
          <Header initialValue={query} onSearch={handleSearch} />
        </div>
      </header>

      {/* Contenido principal (las páginas controlan su propio ancho/padding) */}
      <main className="flex-grow relative z-10 w-full" role="main">
        {children}
      </main>

      {/* Pie de página */}
      <footer className="relative z-20">
        <Footer />
      </footer>

      {/* Utilidades flotantes */}
      <ScrollToTopButton />
      <WhatsAppFloat />
    </div>
  )
}
