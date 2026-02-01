// app/components/app/BackgroundBlobs.tsx
import { memo } from 'react'
import { cn } from '@/lib/utils'

const BackgroundBlobs = memo(function BackgroundBlobs() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-white"
      aria-hidden="true"
    >
      {/* 
          BLOB 1: VIOLETA (Superior Derecha)
      */}
      <div
        className={cn(
          'absolute top-[-10%] right-[-10%]',
          'w-[400px] h-[400px] md:w-[900px] md:h-[900px]',
          'bg-violet-500/[0.06] blur-[100px] md:blur-[140px]',
          'rounded-full',
        )}
      />

      {/* 
          BLOB 2: NARANJA (Inferior Izquierda)
      */}
      <div
        className={cn(
          'absolute bottom-[-10%] left-[-10%]',
          'w-[350px] h-[350px] md:w-[800px] md:h-[800px]',
          'bg-orange-500/[0.06] blur-[100px] md:blur-[140px]',
          'rounded-full',
        )}
      />

      {/* 
          OVERLAY DE GRANO (Noise): 
          Es fundamental que la opacidad sea baja (0.02 - 0.04) para que 
          no parezca "sucio" sino una textura de papel de alta gama.
      */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }}
      />
    </div>
  )
})

export default BackgroundBlobs
