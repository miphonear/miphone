// app/components/GoogleReviews.tsx
'use client'
import { useState, useEffect, useRef } from 'react'

export default function GoogleReviews() {
  const [showWidget, setShowWidget] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowWidget(true)
          observer.disconnect() // Deja de observar una vez cargado
        }
      },
      { rootMargin: '200px' }, // Cargar 200px antes de que aparezca en pantalla
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="mt-12" ref={containerRef}>
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          <span className="sm:hidden">Nuestros clientes</span>
          <span className="hidden sm:inline">¿Qué opinan nuestros clientes?</span>
        </h2>
        <div className="mx-auto mt-2 h-1 w-40 bg-gradient-to-r from-orange-500 to-violet-500 rounded-full" />
      </div>

      {/* Contenedor con placeholder para evitar layout shift */}
      <div className="w-full h-[630px] rounded-lg overflow-hidden relative">
        {showWidget && (
          <iframe
            loading="lazy"
            title="Reseñas de nuestros clientes en Google"
            src="https://widgets.commoninja.com/iframe/a6472b8d-55bc-479a-8c9c-ed8f29426be0"
            width="100%"
            height="100%"
            className="border-0" // Reemplaza frameBorder="0"
            style={{ border: 0, backgroundColor: 'transparent' }}
            allow="clipboard-read; clipboard-write"
            scrolling="yes" // "yes" o "no" es standard, "auto" es deprecated en HTML5
          />
        )}
      </div>
    </section>
  )
}
