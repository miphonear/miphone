import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="text-6xl font-extrabold text-gray-200 select-none">404</h1>
      <h2 className="mt-4 text-xl md:text-2xl font-bold text-gray-900">Página no encontrada</h2>
      <p className="mt-2 text-gray-700 max-w-md">
        La categoría o la ruta a la que intentás acceder no existe.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
