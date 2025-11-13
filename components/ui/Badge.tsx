'use client'
import React from 'react'

interface BadgeProps {
  emoji: string
  children: React.ReactNode
  className?: string
}

// Estilos base del Badge
// - inline-flex: para alinear emoji + texto
// - rounded-full: estilo pill
// - bg-orange-100: fondo naranja claro
// - px/py: padding
// - text-xs/sm: tamaño de fuente responsive
// - font-medium: peso medio
// - text-gray-900: color de texto
// - gap: espacio entre emoji y texto
// - shadow-sm: sombra suave en todo el contorno
const BASE_CLASS =
  'inline-flex items-center rounded-full bg-orange-50 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-900 gap-1 shadow-sm'

// Animación CSS
// - badgeFadeIn: aparece con fade + leve desplazamiento hacia arriba
const FADE_IN_ANIMATION = `
@keyframes badgeFadeIn {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}
`

export function Badge({ emoji, children, className = '' }: BadgeProps) {
  return (
    <>
      {/* Inyectamos la animación en el documento */}
      <style>{FADE_IN_ANIMATION}</style>

      {/* Badge */}
      <span
        className={`${BASE_CLASS} ${className}`}
        style={{
          animation: 'badgeFadeIn 1s ease-out',
        }}
      >
        {/* Emoji */}
        <span className="text-sm mr-0.5 sm:text-base">{emoji}</span>

        {/* Texto */}
        <span>{children}</span>
      </span>
    </>
  )
}
