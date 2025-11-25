// app/components/app/BackgroundBlobs.tsx
import { memo } from 'react'
import { cn } from '@/lib/utils'

// Usamos React.memo para evitar re-renders innecesarios, ya que este
// componente es puramente decorativo y no necesita actualizarse.
const BackgroundBlobs = memo(function BackgroundBlobs() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true" // Es decorativo, lo ocultamos a lectores de pantalla
    >
      {/* Blob único, posicionado en la parte inferior */}
      <svg
        className={cn(
          'absolute top-2/3 left-1/2 -translate-x-1/2',
          'w-[1000px] h-[1000px]' /* Tamaño base (mobile) */,
          'md:w-[5000px] md:h-[5000px]' /* Tamaño en desktop */,
          'opacity-15 blur-3xl',
        )}
        viewBox="0 0 800 800"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-violet-500" // Corresponde a tu color #8B5CF6
          d="M400,0C500,0,600,100,600,200C600,300,500,400,400,400C300,400,200,300,200,200C200,100,300,0,400,0Z"
        />
      </svg>
    </div>
  )
})

export default BackgroundBlobs
