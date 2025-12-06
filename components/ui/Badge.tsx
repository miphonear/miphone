'use client'
import React from 'react'

interface BadgeProps {
  emoji: string
  children: React.ReactNode
  className?: string
}

// Estilos base del Badge (etiqueta informativa, no interactiva)
// - inline-flex: alinea emoji y texto en fila
// - rounded-full: forma “pill” suave
// - bg-orange-50: fondo tenue
// - px-3 py-1: padding compacto de etiqueta
// - text-sm: tamaño legible
// - font-medium: peso moderado
// - text-orange-900: tono sobre tono (menos “botón”, más informativo)
// - ring-1 ring-inset ring-orange-600/20: borde interno sutil que define la forma
// - gap-1: pequeño espacio entre emoji y texto
// - shadow-sm: separación suave del fondo (sin volumen de botón)
// - cursor-default: comunica que no es clickeable
const BASE_CLASS =
  'inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-900 ring-1 ring-inset ring-orange-600/20 gap-1 shadow-sm cursor-default'

// Animación de entrada (sutil)
// - badgeFadeIn: leve fade + deslizamiento vertical
const FADE_IN_ANIMATION = `
@keyframes badgeFadeIn {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}
`

export function Badge({ emoji, children, className = '' }: BadgeProps) {
  return (
    <>
      {/* Inyecta la animación en el documento */}
      <style>{FADE_IN_ANIMATION}</style>

      {/* Componente Badge */}
      <span
        className={`${BASE_CLASS} ${className}`}
        style={{ animation: 'badgeFadeIn 1s ease-out' }}
      >
        {/* Emoji: tamaño ligeramente mayor en sm+ para mejor alineación visual */}
        <span className="text-sm mr-0.5 sm:text-base">{emoji}</span>

        {/* Contenido textual */}
        <span>{children}</span>
      </span>
    </>
  )
}
