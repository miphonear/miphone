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
    bg: 'bg-red-100 text-red-700 border-red-200',
    text: 'Oferta',
    icon: '🔥',
    aria: 'Oferta',
    long: 'OFERTA',
    short: 'SALE',
  },
  NEW: {
    bg: 'bg-blue-100 text-blue-700 border-blue-200',
    text: 'Nuevo',
    icon: '✈️',
    aria: 'Nuevo ingreso',
    long: 'NUEVO',
    short: 'NEW',
  },
}

// Ajustado: px-1.5 para ser más compacto y text-[10px] para mayor elegancia responsiva
const BASE_CLASS =
  'inline-flex items-center justify-center rounded-md font-bold border ' +
  'px-1.5 h-5 text-[10px] leading-none gap-1 transition-all select-none'

export default function ProductLabel({ value }: ProductLabelProps) {
  const upper = normalizeLabel(value)
  if (!upper) return null

  const config = LABEL_CONFIG[upper]

  if (config) {
    return (
      <span
        className={`${BASE_CLASS} ${config.bg}`}
        title={config.text}
        role="status"
        aria-label={config.aria}
      >
        {config.icon && (
          <span aria-hidden="true" className="text-[11px]">
            {config.icon}
          </span>
        )}
        {/* LÓGICA RESPONSIVA: Oculta texto largo en mobile, muestra corto */}
        <span className="hidden sm:inline">{config.long}</span>
        <span className="inline sm:hidden">{config.short}</span>
      </span>
    )
  }

  // Fallback para etiquetas no configuradas (ej. OUT OF STOCK)
  return (
    <span
      className={`${BASE_CLASS} bg-gray-50 text-gray-500 border-gray-200 uppercase`}
      title={upper}
    >
      {upper}
    </span>
  )
}
