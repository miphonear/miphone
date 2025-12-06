'use client'
import React, { useState, useMemo } from 'react'
import ProductLabel from '@ui/ProductLabel'
import Alert from '@ui/Alert'
import { Image as ImageIcon } from 'lucide-react'
import WhatsAppButton from './WhatsAppButton'
import { crearMensajeWhatsApp } from '@/lib/whatsappMessages'
import ModalFotos from './ModalFotos'
import type { Producto } from '@/app/types/Producto'

// SECCIÓN: INTERFACES Y TIPOS
interface Props {
  productos: Producto[]
  alerta?: string
}

// SECCIÓN: COMPONENTE PRINCIPAL
function ProductosAccesorios({ productos, alerta }: Props) {
  // SECCIÓN: ESTADOS
  const [modalFotosOpen, setModalFotosOpen] = useState(false)
  const [fotos, setFotos] = useState<string[]>([])

  // SECCIÓN: FILTRADO Y PROCESAMIENTO
  // Filtrar productos visibles (memoizado para optimización)
  const visibles = useMemo(
    () => productos.filter((p) => p.ocultar?.toLowerCase() !== 'x'),
    [productos],
  )

  // SECCIÓN: FUNCIONES AUXILIARES
  // Función para manejar visualización de fotos (modal o nueva pestaña)
  function handleVerFotos(fotoStr: string) {
    if (!fotoStr) return

    // Si es un link a Google Drive o similar → abrir en nueva pestaña
    if (
      fotoStr.includes('drive.google.com') ||
      fotoStr.includes('google.com') ||
      fotoStr.includes('photos.app.goo.gl')
    ) {
      window.open(fotoStr, '_blank')
      return
    }

    // Si son imágenes directas separadas por coma → abrir modal
    const lista = fotoStr
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean)

    if (lista.length > 0) {
      setFotos(lista)
      setModalFotosOpen(true)
    }
  }

  // SECCIÓN: RENDERIZADO PRINCIPAL
  return (
    <div className="w-full flex flex-col gap-6 mt-6">
      {/* Alerta */}
      {alerta && (
        <div className="w-full max-w-3xl mx-auto">
          <Alert type="success">{alerta}</Alert>
        </div>
      )}

      {/* Productos */}
      {visibles.map((p, i) => (
        <div
          key={i}
          style={{ animationDelay: `${i * 150}ms` }} // Delay en cascada
          // Card centrada: max-w-3xl + mx-auto
          className="w-full max-w-3xl mx-auto border border-gray-200 rounded-lg bg-white/90 shadow-sm p-4 flex flex-col gap-2 opacity-0 animate-slideDown"
        >
          {/* Cabecera */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-gray-900">{p.modelo}</span>
              {p.label && <ProductLabel value={p.label} />}
            </div>
            {p.fotos && (
              <button
                onClick={() => handleVerFotos(p.fotos!)}
                className="flex items-center gap-1 text-sm text-orange-500 hover:underline transition"
              >
                <ImageIcon className="w-4 h-4 inline mb-0.5" /> Ver fotos
              </button>
            )}
          </div>

          {/* Ficha */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            {/* Info */}
            <div className="flex flex-col gap-1 text-sm flex-1">
              {p.capacidad && (
                <div>
                  <b>Info:</b> {p.capacidad}
                </div>
              )}
              {p.color && (
                <div>
                  <b>Colores:</b> {p.color}
                </div>
              )}
            </div>

            {/* Precio + botón WhatsApp */}
            <div className="flex flex-col items-end justify-between min-w-[110px] text-sm gap-2 mt-2 sm:mt-6">
              <span className="text-gray-700 font-semibold">
                {p.precio ? (
                  p.precio
                ) : (
                  <span className="text-gray-500 font-semibold text-xs sm:text-sm">
                    Consultanos
                  </span>
                )}
              </span>
              <WhatsAppButton
                mensaje={crearMensajeWhatsApp(p.subcategoria, `${p.modelo} (accesorio)`)}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Modal de fotos */}
      {modalFotosOpen && (
        <ModalFotos open={modalFotosOpen} fotos={fotos} onClose={() => setModalFotosOpen(false)} />
      )}
    </div>
  )
}

// Memoizar componente para evitar re-renders cuando las props no cambian
// IMPORTANTE: Si el array cambió (nueva referencia), siempre re-renderizar
// porque puede ser un filtrado diferente aunque contenga los mismos objetos
export default React.memo(ProductosAccesorios, (prevProps, nextProps) => {
  // Si cambió la alerta, re-renderizar
  if (prevProps.alerta !== nextProps.alerta) return false

  // Si es el mismo array (misma referencia), no re-renderizar
  if (prevProps.productos === nextProps.productos) return true

  // Si el array cambió (nueva referencia), siempre re-renderizar
  // Esto asegura que los filtrados se muestren correctamente
  return false // false = re-renderizar
})
