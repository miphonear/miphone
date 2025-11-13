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

  // 1/5. Sanitización y validación del query
  const query = useMemo(() => {
    const rawQuery = searchParams.get('q')
    if (!rawQuery) return ''

    // Sanitización básica: elimina caracteres peligrosos y limita longitud
    return rawQuery
      .trim()
      .substring(0, 100) // Límite de 100 caracteres
      .replace(/[<>]/g, '') // Elimina caracteres HTML básicos
  }, [searchParams])

  // 8. Validación de pathname
  const isValidPath = useMemo(() => {
    if (!pathname) return false
    return pathname.startsWith('/') && pathname.length > 0
  }, [pathname])

  // 5/10. Manejo optimizado de búsqueda con error handling
  const handleSearch = useCallback(
    (newQuery: string) => {
      try {
        // Validación del input
        if (newQuery.length > 100) {
          console.warn('Query demasiado largo, truncando')
          newQuery = newQuery.substring(0, 100)
        }

        // Sanitización
        const sanitizedQuery = newQuery.trim().replace(/[<>]/g, '')

        const params = new URLSearchParams(searchParams.toString())

        if (sanitizedQuery) {
          params.set('q', sanitizedQuery)
        } else {
          params.delete('q')
        }

        if (!isValidPath) {
          console.error('Pathname inválido:', pathname)
          router.push('/')
          return
        }

        // 7. Transición suave usando React 18
        startTransition(() => {
          const newUrl = `${pathname}?${params.toString()}`
          router.push(newUrl)
        })
      } catch (error) {
        console.error('Error durante la búsqueda:', error)
        // Fallback: navegar sin query
        router.push(pathname)
      }
    },
    [router, pathname, searchParams, isValidPath],
  )

  // 4/6. Estructura semántica y meta mejorada
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* 6. Metadatos estructurales para SEO */}
      <div className="sr-only">
        <h1>miPhone™ - Descubrí los mejores precios en tecnología. ¡A un clic de distancia!</h1>
      </div>

      {/* Elementos de fondo y UI flotante */}
      <BackgroundBlobs />

      {/* 4. Header con estructura semántica */}
      <header className="relative z-20">
        <AnnouncementBar />
        <Nav />
        <Header initialValue={query} onSearch={handleSearch} />
      </header>

      {/* 4. Main content con semántica apropiada */}
      <main className="flex-grow px-2 relative z-10" role="main" aria-label="Contenido principal">
        {children}
      </main>

      {/* 4. Footer semántico */}
      <footer className="relative z-20">
        <Footer />
      </footer>

      {/* Elementos flotantes/accesorios */}
      <ScrollToTopButton />
      <WhatsAppFloat />
    </div>
  )
}
