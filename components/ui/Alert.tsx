'use client'
import { ReactNode } from 'react'

interface AlertProps {
  children: ReactNode
  className?: string
  type?: 'info' | 'error' | 'success' | 'warning'
}

const ALERT_CONFIG = {
  info: {
    style: 'border-violet-400 bg-violet-100 text-violet-900',
    icon: '📣',
    label: 'Información',
  },
  error: {
    style: 'border-red-400 bg-red-100 text-red-800',
    icon: '❌',
    label: 'Error',
  },
  success: {
    style: 'border-green-400 bg-green-100 text-green-800',
    icon: '✅',
    label: 'Éxito',
  },
  warning: {
    style: 'border-yellow-400 bg-yellow-100 text-yellow-800',
    icon: '⚠️',
    label: 'Advertencia',
  },
} as const

const BASE_CLASS =
  'rounded-xl border-l-4 px-3 py-1.5 text-xs font-medium flex items-center gap-2 shadow-sm sm:text-sm'

// Animación CSS
const WORD_FADE = `
@keyframes wordFade {
  from { opacity: 0; transform: translateY(3px); }
  to { opacity: 1; transform: translateY(0); }
}
`

export default function Alert({ children, className = '', type = 'info' }: AlertProps) {
  const config = ALERT_CONFIG[type] || ALERT_CONFIG.info

  // Si el contenido es texto plano, animamos palabra por palabra
  if (typeof children === 'string') {
    const words = children.split(' ')

    return (
      <>
        <style>{WORD_FADE}</style>
        <div
          role="alert"
          aria-label={config.label}
          className={`${BASE_CLASS} ${config.style} ${className}`}
        >
          <span aria-hidden="true" className="text-base sm:text-lg">
            {config.icon}
          </span>
          <span style={{ whiteSpace: 'pre-wrap' }}>
            {words.map((word, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  animation: `wordFade 0.25s ease forwards`,
                  animationDelay: `${i * 0.08}s`, // más rápido
                  opacity: 0,
                }}
              >
                {word + ' '}
              </span>
            ))}
          </span>
        </div>
      </>
    )
  }

  // Si no es texto plano, mostramos normal
  return (
    <div
      role="alert"
      aria-label={config.label}
      className={`${BASE_CLASS} ${config.style} ${className}`}
    >
      <span aria-hidden="true" className="text-base sm:text-lg">
        {config.icon}
      </span>
      <span>{children}</span>
    </div>
  )
}
