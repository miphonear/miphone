'use client'
import { memo, useState, useEffect } from 'react'
import Image from 'next/image'
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

// --- CONSTANTE PARA LA IMAGEN DE STOCK ---
const STOCK_AVATAR_URL = '/images/placeholder-avatar.png'

const ProductModelCard = memo(function ProductModelCard({
  modelo,
  variantes,
  avatar,
  animationDelay,
}: Props) {
  const [imageSrc, setImageSrc] = useState(avatar)

  // Sincroniza el estado si la prop 'avatar' cambia
  useEffect(() => {
    setImageSrc(avatar)
  }, [avatar])

  const handleError = () => {
    setImageSrc(STOCK_AVATAR_URL)
  }

  // --- CÁLCULOS DERIVADOS ---
  // Usamos .includes() en lugar de === para ser más flexibles con el CSV
  const hasNew = variantes.some((v) => v.label?.trim().toUpperCase().includes('NEW'))
  const specs = variantes[0].specs || null
  const hayVersiones = variantes.some((v) => v.version && v.version.trim() !== '')

  // --- FRAGMENTOS DE UI (Render Props) ---
  const titleContent = (
    <span className="font-bold text-base text-gray-900 flex items-center gap-2">
      {modelo}
      {hasNew && <ProductLabel value="NEW" />}
    </span>
  )

  const avatarContent = avatar ? (
    <div className="relative w-32 h-32 shrink-0 mx-auto">
      <Image
        src={imageSrc || STOCK_AVATAR_URL}
        alt={`Avatar de ${modelo}`}
        fill
        className="rounded-lg object-contain"
        sizes="128px"
        onError={handleError}
      />
    </div>
  ) : null

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <div
      style={{ animationDelay }}
      className="border border-gray-200 rounded-lg p-4 bg-white/90 flex shadow-sm max-w-3xl w-full mx-auto opacity-0 animate-slideDown"
    >
      <div className="flex w-full items-start gap-4">
        {/* --- 1. AVATAR DESKTOP (IZQUIERDA) --- */}
        <div className="hidden md:block">{avatarContent}</div>

        {/* --- 2. CONTENIDO (DERECHA) --- */}
        <div className="flex flex-col flex-grow">
          <div className="flex-grow">
            {hayVersiones ? (
              <>
                {/* Cabecera con versiones */}
                <div className="flex justify-between items-center px-1 gap-1">
                  {titleContent}
                  {specs && (
                    <a
                      href={specs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-orange-500 hover:underline transition flex-shrink-0"
                    >
                      Ver ficha
                    </a>
                  )}
                </div>

                {/* Avatar móvil */}
                <div className="md:hidden mt-2 flex justify-center">{avatarContent}</div>

                {/* Lista de variantes */}
                <div className="flex flex-col mt-2">
                  {variantes.map((v, j) => (
                    <div
                      key={`${modelo}-${j}`}
                      className="flex justify-between items-center border-t border-gray-200 first:border-t-0 py-1 px-1.5 text-sm hover:bg-purple-50"
                    >
                      <span className="text-gray-800">{v.version || ''}</span>
                      <span className="text-gray-800 font-semibold flex items-center gap-1">
                        {/* Usamos .includes() para SALE */}
                        {v.label?.trim().toUpperCase().includes('SALE') && (
                          <ProductLabel value="SALE" />
                        )}
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
                {/* Fila única (sin versiones) */}
                <div className="flex justify-between items-center">
                  {titleContent}
                  <span className="pl-4 text-gray-700 font-semibold text-sm flex items-center gap-1">
                    {/* CORRECCIÓN: Usamos .includes() para SALE */}
                    {variantes[0].label?.trim().toUpperCase().includes('SALE') && (
                      <ProductLabel value="SALE" />
                    )}
                    {variantes[0].precio || (
                      <span className="text-gray-500 font-semibold text-xs sm:text-sm">
                        Consultanos
                      </span>
                    )}
                  </span>
                </div>

                {/* Avatar móvil */}
                <div className="md:hidden mt-2 flex justify-center">{avatarContent}</div>
              </>
            )}
          </div>

          {/* Botón WhatsApp */}
          <div className="flex justify-end mt-4">
            <WhatsAppButton mensaje={crearMensajeWhatsApp(variantes[0].subcategoria, modelo)} />
          </div>
        </div>
      </div>
    </div>
  )
})

export default ProductModelCard
