// app/components/GoogleReviews.tsx
'use client'

export default function GoogleReviews() {
  return (
    <section className="mt-12">
      <div className="flex flex-col items-center justify-center mb-6">
        <span className="text-3xl mb-1">🤝</span>
        <h2 className="relative inline-block text-xl md:text-2xl font-bold text-gray-800 pb-2 text-center">
          {/* Texto responsivo */}
          <span className="sm:hidden">Nuestros clientes</span>
          <span className="hidden sm:inline">¿Qué opinan nuestros clientes?</span>

          {/* Subrayado decorativo */}
          <span
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 
                 bg-gradient-to-r from-orange-400 to-violet-500 rounded-full"
          ></span>
        </h2>
      </div>
      {/* Contenedor */}
      <div className="w-full h-[630px]">
        <iframe
          // Agregado: loading="lazy" para mejorar la performance
          loading="lazy"
          title="Reseñas de nuestros clientes en Google"
          src="https://widgets.commoninja.com/iframe/a6472b8d-55bc-479a-8c9c-ed8f29426be0"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="auto"
        ></iframe>
      </div>
    </section>
  )
}
