'use client'
import { Dialog as HDialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { Fragment, ReactNode, useRef } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  // Opcional: permitir desactivar el backdrop click
  closeOnBackdrop?: boolean
}

const PANEL_SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
} as const

export default function Dialog({
  open,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdrop = true,
}: Props) {
  // Tipado más específico del ref
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <Transition.Root show={open} as={Fragment}>
      <HDialog
        as="div"
        className="relative z-50"
        onClose={closeOnBackdrop ? onClose : () => {}}
        initialFocus={closeButtonRef}
      >
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        {/* Dialog content */}
        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <HDialog.Panel
              className={`
                relative w-full ${PANEL_SIZES[size]} 
                rounded-lg bg-white p-6 shadow-xl ring-1 ring-black/5
                max-h-[90vh] overflow-y-auto
              `}
            >
              {/* Botón Cerrar */}
              <div className="absolute right-4 top-4 z-10">
                <button
                  ref={closeButtonRef}
                  type="button"
                  className="
                    text-gray-500 hover:text-orange-500 transition-colors 
                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1
                    rounded-md p-1
                  "
                  onClick={onClose}
                  aria-label="Cerrar modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Título */}
              {title && (
                <HDialog.Title as="h2" className="text-lg font-semibold text-gray-800 pr-12">
                  {title}
                </HDialog.Title>
              )}

              {/* Contenido */}
              <div className={title ? 'mt-4' : ''}>{children}</div>
            </HDialog.Panel>
          </Transition.Child>
        </div>
      </HDialog>
    </Transition.Root>
  )
}
