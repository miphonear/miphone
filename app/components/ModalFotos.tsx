'use client'
import { Dialog as HDialog, Transition } from '@headlessui/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { Fragment, useCallback, useEffect, useState } from 'react'

interface ModalFotosProps {
  open: boolean
  fotos: string[]
  onClose: () => void
}

export default function ModalFotos({ open, fotos, onClose }: ModalFotosProps) {
  const [current, setCurrent] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    if (open) setCurrent(0)
  }, [open])

  const goPrev = useCallback(() => {
    if (fotos.length <= 1) return
    setFade(false)
    setTimeout(() => {
      setCurrent((prev) => (prev === 0 ? fotos.length - 1 : prev - 1))
      setFade(true)
    }, 150)
  }, [fotos.length])

  const goNext = useCallback(() => {
    if (fotos.length <= 1) return
    setFade(false)
    setTimeout(() => {
      setCurrent((prev) => (prev === fotos.length - 1 ? 0 : prev + 1))
      setFade(true)
    }, 150)
  }, [fotos.length])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, goPrev, goNext, onClose])

  if (!fotos || fotos.length === 0) return null

  return (
    <Transition.Root show={open} as={Fragment}>
      <HDialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <HDialog.Panel className="relative w-full max-w-2xl bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
              {/* HEADER DEL MODAL (Aísla la X de la imagen) */}
              <div className="flex justify-end p-3 md:p-4 border-b border-gray-50 md:border-none">
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  aria-label="Cerrar modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* ÁREA DEL CARRUSEL */}
              <div className="flex flex-col p-4 md:p-8 pt-0 md:pt-0">
                <div className="relative flex items-center justify-center min-h-[300px] md:min-h-[450px]">
                  {/* Botón Izquierdo */}
                  {fotos.length > 1 && (
                    <button
                      onClick={goPrev}
                      className="absolute left-0 z-10 p-2 md:p-3 bg-white/90 md:bg-white border border-gray-100 rounded-full text-gray-500 hover:text-orange-500 transition-all active:scale-95 shadow-sm"
                      aria-label="Anterior"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}

                  {/* Imagen Principal */}
                  <div className="w-full flex justify-center items-center px-2">
                    <Image
                      src={fotos[current]}
                      alt={`Vista del producto ${current + 1}`}
                      width={1000}
                      height={1000}
                      className={`max-h-[55vh] md:max-h-[65vh] object-contain transition-opacity duration-300 ${
                        fade ? 'opacity-100' : 'opacity-0'
                      }`}
                      unoptimized
                      priority
                    />
                  </div>

                  {/* Botón Derecho */}
                  {fotos.length > 1 && (
                    <button
                      onClick={goNext}
                      className="absolute right-0 z-10 p-2 md:p-3 bg-white/90 md:bg-white border border-gray-100 rounded-full text-gray-500 hover:text-orange-500 transition-all active:scale-95 shadow-sm"
                      aria-label="Siguiente"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}
                </div>

                {/* FOOTER DEL MODAL */}
                <div className="mt-4 md:mt-8 flex flex-col items-center gap-4">
                  {/* Dots */}
                  {fotos.length > 1 && (
                    <div className="flex gap-1.5">
                      {fotos.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === current ? 'w-6 bg-orange-500' : 'w-1.5 bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                    {current + 1} de {fotos.length}
                  </span>
                </div>
              </div>
            </HDialog.Panel>
          </Transition.Child>
        </div>
      </HDialog>
    </Transition.Root>
  )
}
