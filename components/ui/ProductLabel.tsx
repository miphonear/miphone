'use client'

interface ProductLabelProps {
  value?: string
}

function normalizeLabel(value?: string) {
  return (value || '').trim().toUpperCase()
}

// Configuración centralizada para cada tipo de label
const LABEL_CONFIG: Record<
  string,
  {
    bg: string
    text: string
    icon?: string
    aria: string
    long: string
    short: string
  }
> = {
  SALE: {
    bg: 'bg-red-100 text-red-800',
    text: 'Oferta',
    icon: '🔥',
    aria: 'Oferta',
    long: '¡OFERTA!',
    short: 'SALE!',
  },
  NEW: {
    bg: 'bg-blue-100 text-blue-700',
    text: 'Nuevo',
    icon: '✈️',
    aria: 'Nuevo',
    long: '¡NUEVO!',
    short: 'NEW!',
  },
}

const BASE_CLASS =
  'inline-flex items-center justify-center rounded-md font-semibold px-1 h-5 min-w-[32px] text-xs leading-none gap-0.5 sm:px-1.5 sm:h-5 sm:min-w-[38px]'

export default function ProductLabel({ value }: ProductLabelProps) {
  const upper = normalizeLabel(value)
  if (!upper) return null

  const config = LABEL_CONFIG[upper]

  if (config) {
    return (
      <span className={`${BASE_CLASS} ${config.bg}`} title={config.text}>
        {config.icon && (
          <span aria-hidden="true" className="select-none">
            {config.icon}
          </span>
        )}
        <span className="hidden sm:inline">{config.long}</span>
        <span className="inline sm:hidden">{config.short}</span>
      </span>
    )
  }

  // Fallback para etiquetas no configuradas
  return (
    <span className={`${BASE_CLASS} bg-gray-100 text-gray-800`} title={upper}>
      {upper}
    </span>
  )
}
