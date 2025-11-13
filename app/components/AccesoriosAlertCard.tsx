'use client'
import Link from 'next/link'

/**
 * AccesoriosAlertCard: Un componente reutilizable que muestra un Call to Action (CTA)
 * para que los usuarios exploren la categoría de accesorios.
 */
export default function AccesoriosAlertCard() {
  return (
    <div className="max-w-3xl w-full mx-auto bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg shadow-md border border-orange-200 p-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-2xl">🙋</span>
        <h3 className="font-bold text-gray-800">¿Necesitás accesorios?</h3>
        <p className="text-sm text-gray-600 max-w-md">
          ¡No te olvides de las fundas, vidrios templados, cargadores y más! Consultanos o explorá
          la categoría.
        </p>
        <Link
          href="/accesorios"
          className="mt-2 px-4 py-1.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
        >
          Ver Accesorios
        </Link>
      </div>
    </div>
  )
}
