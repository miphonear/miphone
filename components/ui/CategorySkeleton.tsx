export function CategorySkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2 md:py-6">
      {/* Línea divisora sutil (solo desktop) */}
      <div className="hidden md:block w-full border-t border-gray-100 mb-8" />

      {/* 1) Título */}
      <div className="w-full max-w-3xl mx-auto mb-6 mt-4 md:mt-0 flex justify-center">
        <div className="h-10 md:h-12 bg-gray-200 rounded-lg w-48 md:w-64 animate-pulse" />
      </div>

      {/* 3) Navigation Tabs (Sintetizado) */}
      <div className="mb-4 flex justify-center">
        <div className="w-full max-w-md h-9 bg-gray-100 rounded-xl flex animate-pulse overflow-hidden">
          <div className="flex-1 border-r border-gray-200" />
          <div className="flex-1 border-r border-gray-200" />
          <div className="flex-1 border-r border-gray-200" />
          <div className="flex-1" />
        </div>
      </div>

      {/* 4) Cards */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-full max-w-3xl mx-auto p-4 border border-gray-200 rounded-xl bg-gray-50/50 animate-pulse"
          >
            <div className="h-24 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
