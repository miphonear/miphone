'use client'
import { memo, useState, useEffect } from 'react'
import Image from 'next/image' // Usamos next/image para optimización
import type { Producto } from '@/app/types/Producto'
import ProductLabel from '@ui/ProductLabel'
import WhatsAppButton from './WhatsAppButton'
import { crearMensajeWhatsApp } from '@/lib/whatsappMessages'

// --- INTERFAZ DE PROPS ---
interface Props {
  modelo: string
  variantes: Producto[]
  avatar?: string
  animationDelay: string
}

/**
 * ProductModelCard: Componente optimizado para mostrar una tarjeta de producto.
 * Utiliza React.memo para evitar re-renders innecesarios si las props no cambian.
 * Presenta un layout responsivo:
 * - Desktop: Avatar a la izquierda, contenido a la derecha.
 * - Mobile: Avatar centrado entre el título y las variantes.
 * Migrado a next/image para mejor LCP y optimización de imágenes.
 * Incluye un fallback a una imagen de stock si la URL del avatar está corrupta.
 */

// --- CONSTANTE PARA LA IMAGEN DE STOCK ---
const STOCK_AVATAR_URL = '/images/placeholder-avatar.png'

const ProductModelCard = memo(function ProductModelCard({
  modelo,
  variantes,
  avatar,
  animationDelay,
}: Props) {
  const [imageSrc, setImageSrc] = useState(avatar)

  // Sincroniza el estado si la prop 'avatar' cambia.
  // Esencial para que el componente se actualice correctamente en listas.
  useEffect(() => {
    setImageSrc(avatar)
  }, [avatar])

  // Función que se dispara si la carga de la imagen falla,
  // cambiando la fuente a la imagen de stock.
  const handleError = () => {
    setImageSrc(STOCK_AVATAR_URL)
  }

  // --- CÁLCULOS DERIVADOS ---
  const hasNew = variantes.some((v) => v.label?.trim().toUpperCase() === 'NEW')
  const specs = variantes[0].specs || null
  const hayVersiones = variantes.some((v) => v.version && v.version.trim() !== '')

  // --- SUBCOMPONENTES REUTILIZABLES ---
  // Componente para el título del modelo, incluyendo el label "NEW".
  const Title = () => (
    <span className="font-bold text-base text-gray-900 flex items-center gap-2">
      {modelo}
      {hasNew && <ProductLabel value="NEW" />}
    </span>
  )

  // Componente para el avatar (móvil y desktop).
  // Avatar 128x128 con next/image (sin warnings y sin recortes)
  const Avatar = () =>
    avatar ? (
      <div className="relative w-32 h-32 shrink-0 mx-auto">
        <Image
          src={imageSrc || STOCK_AVATAR_URL}
          alt={`Avatar de ${modelo}`}
          fill
          className="rounded-lg object-contain"
          sizes="128px"
          onError={handleError} // Fallback a imagen de stock si falla
          // Nota: Si la imagen es externa, asegurate de tener el dominio en next.config.js
        />
      </div>
    ) : null

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <div
      // Delay para la animación de entrada (slideDown)
      style={{ animationDelay }}
      className="border border-gray-200 rounded-lg p-4 bg-white/90 flex shadow-sm max-w-3xl w-full mx-auto opacity-0 animate-slideDown"
    >
      <div className="flex w-full items-start gap-4">
        {/* --- 1. AVATAR DESKTOP (IZQUIERDA) --- */}
        <div className="hidden md:block">
          {/* Visible solo en >= md */}
          <Avatar />
        </div>

        {/* --- 2. CONTENIDO (DERECHA) --- */}
        <div className="flex flex-col flex-grow">
          <div className="flex-grow">
            {hayVersiones ? (
              <>
                {/* Cabecera para vista con versiones */}
                <div className="flex justify-between items-center px-1 gap-1">
                  <Title />
                  {specs && (
                    <a
                      href={specs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-orange-500 hover:underline transition flex-shrink-0" // flex-shrink-0 evita que el texto se rompa
                    >
                      Ver ficha
                    </a>
                  )}
                </div>

                {/* Avatar centrado en móvil */}
                <div className="md:hidden mt-2 flex justify-center">
                  <Avatar />
                </div>

                {/* Contenedor de variantes */}
                <div className="flex flex-col mt-2">
                  {variantes.map((v, j) => (
                    <div
                      key={`${modelo}-${j}`}
                      className="flex justify-between items-center border-t border-gray-200 first:border-t-0 py-1 px-1.5 text-sm hover:bg-purple-50"
                    >
                      <span className="text-gray-700">{v.version || ''}</span>
                      <span className="text-gray-700 font-semibold flex items-center gap-1">
                        {v.label?.trim().toUpperCase() === 'SALE' && <ProductLabel value="SALE" />}
                        {v.precio || (
                          <span className="text-gray-500 font-semibold text-xs sm:text-sm">
                            Consultanos
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Fila única para vista sin versiones */}
                <div className="flex justify-between items-center">
                  <Title />
                  <span className="pl-4 text-gray-700 font-semibold text-sm flex items-center gap-1">
                    {variantes[0].label?.trim().toUpperCase() === 'SALE' && (
                      <ProductLabel value="SALE" />
                    )}
                    {variantes[0].precio || (
                      <span className="text-gray-500 font-semibold text-xs sm:text-sm">
                        Consultanos
                      </span>
                    )}
                  </span>
                </div>

                {/* Avatar centrado en móvil */}
                <div className="md:hidden mt-2 flex justify-center">
                  <Avatar />
                </div>
              </>
            )}
          </div>

          {/* Botón WhatsApp (Consultar) */}
          <div className="flex justify-end mt-4">
            <WhatsAppButton mensaje={crearMensajeWhatsApp(variantes[0].subcategoria, modelo)} />
          </div>
        </div>
      </div>
    </div>
  )
})

export default ProductModelCard
