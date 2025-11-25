'use client'
import { ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const THRESHOLD = 150

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Evita renders innecesarios comparando con un valor local
    let last = visible

    const update = () => {
      const next = window.scrollY > THRESHOLD
      if (next !== last) {
        last = next
        setVisible(next)
      }
    }

    // Estado correcto al montar
    update()

    // Listener passive + barato
    const onScroll = () => {
      // Si querés, podés cambiar a rAF si tenés contenido muy pesado
      // requestAnimationFrame(update)
      update()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = () => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      aria-label="Subir al inicio"
      title="Subir al inicio"
      onClick={handleClick}
      className={cn(
        'fixed right-4 bottom-20 sm:bottom-20 z-[60]',
        'flex items-center justify-center h-14 w-14',
        'rounded-full shadow-md border',
        'bg-orange-500 text-white hover:bg-orange-600',
        'transition-all duration-300 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/40',
        visible
          ? 'opacity-100 translate-x-0 pointer-events-auto'
          : 'opacity-0 translate-x-8 pointer-events-none',
      )}
    >
      <ChevronUp className="h-6 w-6" aria-hidden="true" />
    </button>
  )
}
