/**
 * SkeletonCard: Placeholder visual idéntico a la tarjeta real.
 * Mantiene la altura fija (h-36 mobile / h-44 desktop), borde y radios.
 */
function SkeletonCard() {
  return (
    <div
      className="
        flex flex-col justify-between
        h-36 sm:h-44 w-full p-6
        bg-gray-200 rounded-3xl
      "
    >
      {/* HEADER: Placeholder para Icono (izq) */}
      <div className="flex justify-between items-start">
        {/* Cuadrado gris simulando el contenedor del ícono */}
        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gray-300"></div>
      </div>

      {/* FOOTER: Placeholder para el texto del título */}
      <div className="mt-auto pt-2 mb-1">
        <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
      </div>
    </div>
  )
}

/**
 * CategoryGridSkeleton: Muestra una grilla de carga que coincide con el layout
 * final (2 columnas mobile, 4 desktop, mismos gaps).
 */
export default function CategoryGridSkeleton() {
  return (
    // Wrapper coincidente: w-full my-8
    <section className="w-full my-8 animate-pulse" aria-hidden="true">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Renderizamos 8 esqueletos (2 filas completas en desktop) */}
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </section>
  )
}
