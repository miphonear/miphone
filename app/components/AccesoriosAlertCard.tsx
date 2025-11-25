import Link from 'next/link'

/**
 * AccesoriosAlertCard: Un componente reutilizable que muestra un Call to Action (CTA)
 * para que los usuarios exploren la categoría de accesorios.
 */
type Props = {
  emoji?: string
  title?: string
  description?: string
  href?: string
  buttonText?: string
}

export default function AccesoriosAlertCard({
  emoji = '🙋',
  title = '¿Necesitás accesorios?',
  description = '¡No te olvides de las fundas, vidrios templados, cargadores y más! Consultanos o explorá la categoría.',
  href = '/accesorios',
  buttonText = 'Ver Accesorios',
}: Props) {
  return (
    <div className="max-w-3xl w-full mx-auto bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg shadow-md border border-orange-200 p-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-2xl" aria-hidden="true">
          {emoji}
        </span>
        <h3 className="font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 max-w-md">{description}</p>
        <Link
          href={href}
          className="mt-2 px-4 py-1.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors  focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:ring-offset-2"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  )
}
