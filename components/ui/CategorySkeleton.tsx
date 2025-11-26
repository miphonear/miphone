export function CategorySkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* 1) Header: solo título (rectángulo centrado) */}
      <div className="max-w-3xl w-full mx-auto my-6">
        <div className="h-9 bg-gray-200 rounded mx-auto w-48 animate-pulse" />
      </div>

      {/* 2) Subcategorías: chips rectangulares centrados */}
      <div className="max-w-3xl w-full mx-auto mb-6">
        <div className="flex justify-center gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>

      {/* 3) Cards: rectángulos dentro de contenedor de card */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg bg-gray-200 max-w-3xl w-full mx-auto p-4 animate-pulse"
          >
            <div className="h-28 bg-gray-300 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
