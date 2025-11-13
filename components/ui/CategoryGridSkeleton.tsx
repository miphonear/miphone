/**
 * SkeletonCard: Muestra un placeholder visual para una única tarjeta de categoría en la grilla.
 * Su diseño cuadrado ('aspect-square') imita fielmente el de CategoryGrid.
 */
function SkeletonCard() {
  return (
    <div className="w-full aspect-square rounded-2xl bg-gray-200 flex flex-col items-center justify-center gap-4 p-4">
      {/* Cuadrado para el ícono */}
      <div className="w-1/2 aspect-square bg-gray-300 rounded-lg"></div>
      {/* Barra para el texto */}
      <div className="w-3/4 h-5 bg-gray-300 rounded"></div>
    </div>
  )
}

/**
 * CategoryGridSkeleton: Muestra una grilla de placeholders que coincide con el layout
 * de CategoryGrid.tsx, proporcionando una experiencia de carga fluida.
 */
export default function CategoryGridSkeleton() {
  return (
    // Usamos EXACTAMENTE las mismas clases de la grilla real para que coincidan.
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 my-6 animate-pulse">
      {/* Renderizamos varios esqueletos para llenar la vista inicial */}
      {Array.from({ length: 10 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}
