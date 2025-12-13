'use client'
import React, { useState, useMemo } from 'react'
import ProductLabel from '@ui/ProductLabel'
import Alert from '@ui/Alert'
import {
  BatteryCharging,
  Droplet,
  Image as ImageIcon,
  MemoryStick,
  Star,
  ArrowUpRight,
} from 'lucide-react'
import WhatsAppButton from './WhatsAppButton'
import { crearMensajeWhatsApp } from '@/lib/whatsappMessages'
import ModalFotos from './ModalFotos'
import type { Producto } from '@/app/types/Producto'

// --- CONFIGURACIÓN ---
const NUMERO_TELEFONO = '5491127737463'

// SECCIÓN: INTERFACES Y TIPOS
interface Props {
  productos: Producto[]
  alerta?: string
}

// SECCIÓN: COMPONENTE PRINCIPAL
function ProductosSeminuevos({ productos, alerta }: Props) {
  const [modalFotosOpen, setModalFotosOpen] = useState(false)
  const [fotos, setFotos] = useState<string[]>([])

  // SECCIÓN: FILTRADO Y FUNCIONES AUXILIARES
  const visibles = useMemo(() => {
    return productos.filter((p) => {
      if (p.ocultar?.toLowerCase() === 'x') return false
      // Filtramos productos "fantasma" que solo sirven para mostrar la categoría
      if (!p.modelo || p.modelo.trim() === '') return false

      const enCategoria = p.categoria?.toLowerCase().includes('seminuevo')
      const enSubcategoria = p.subcategoria?.toLowerCase().includes('seminuevo')

      return enCategoria || enSubcategoria
    })
  }, [productos])

  // Función para manejar visualización de fotos
  function handleVerFotos(fotoStr: string) {
    if (!fotoStr) return

    const cleanUrl = fotoStr.trim()

    if (
      cleanUrl.startsWith('http') ||
      cleanUrl.includes('drive.google.com') ||
      cleanUrl.includes('google.com') ||
      cleanUrl.includes('photos.app.goo.gl')
    ) {
      window.open(cleanUrl, '_blank', 'noopener,noreferrer')
      return
    }

    const lista = cleanUrl
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean)

    if (lista.length > 0) {
      setFotos(lista)
      setModalFotosOpen(true)
    }
  }

  // --- ESTADO VACÍO (EMPTY STATE) ---
  if (visibles.length === 0) {
    // Preparamos el link de WhatsApp para el texto
    const mensajeEmpty = '¡Hola! Quisiera información sobre el stock de equipos seminuevos.'
    const linkWa = `https://wa.me/${NUMERO_TELEFONO}?text=${encodeURIComponent(mensajeEmpty)}`

    return (
      <div className="flex flex-col items-center justify-center text-center py-12 mt-4">
        {/* Emoj */}
        <span className="block text-6xl mb-4" role="img" aria-label="Sin stock">
          📦
        </span>

        {/* Texto */}
        <p className="text-md text-gray-600 max-w-md px-4 leading-relaxed">
          No hay equipos seminuevos disponibles por el momento.
          <a
            href={linkWa}
            target="_blank"
            rel="noopener noreferrer"
            // CLASES CLAVE:
            // - inline-flex / items-center: Para alinear el ícono con el texto
            // - gap-0.5: Separación mínima
            // - hover:text-orange-600: Feedback de color
            className="group inline-flex items-center gap-0.5 font-semibold text-orange-500 hover:text-orange-600 transition-colors ml-1"
          >
            <span>Consultanos por WhatsApp</span>
            {/* El ícono se mueve un poquito al hacer hover para invitar al click */}
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>{' '}
          para saber cuándo ingresan.
        </p>
      </div>
    )
  }

  // SECCIÓN: RENDERIZADO PRINCIPAL
  return (
    <div className="w-full flex flex-col gap-4 mt-4">
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
          style={{ animationDelay: `${i * 150}ms` }}
          className="w-full max-w-3xl mx-auto border border-gray-200 rounded-lg bg-white/90 shadow-sm p-4 flex flex-col gap-2 opacity-0 animate-slideDown"
        >
          {/* Cabecera */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-gray-900">{p.modelo}</span>
              {/* Labels adicionales */}
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mt-2">
            {/* Specs */}
            <div className="flex flex-col gap-1 text-sm flex-1">
              {/* ITEM 1: CAPACIDAD */}
              <div className="flex items-center gap-1">
                <MemoryStick className="w-4 h-4 text-orange-500 shrink-0" />
                <span>
                  <b>Capacidad:</b> {p.capacidad || 'No especificada'}
                </span>
              </div>

              {/* ITEM 2: COLOR */}
              <div className="flex items-center gap-1">
                <Droplet className="w-4 h-4 text-orange-500 shrink-0" />
                <span>
                  <b>Color:</b> {p.color || 'No especificado'}
                </span>
              </div>

              {/* ITEM 3: BATERÍA */}
              <div className="flex items-center gap-1">
                <BatteryCharging className="w-4 h-4 text-orange-500 shrink-0" />
                <span>
                  <b>Batería:</b> {p.bateria || 'No especificado'}
                </span>
              </div>

              {/* ITEM 4: CONDICIÓN */}
              <div className="flex items-start gap-1">
                <Star className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>
                  <b>Condición:</b> {p.condicion || 'No especificada'}
                </span>
              </div>
            </div>

            {/* Precio + botón WhatsApp */}
            <div className="flex flex-col items-end justify-between min-w-[110px] text-sm gap-2 mt-2 sm:mt-0">
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
                mensaje={crearMensajeWhatsApp(p.subcategoria, `${p.modelo} (seminuevo)`)}
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
export default React.memo(ProductosSeminuevos, (prevProps, nextProps) => {
  // Si cambió la alerta, re-renderizar
  if (prevProps.alerta !== nextProps.alerta) return false

  // Si es el mismo array (misma referencia), no re-renderizar
  if (prevProps.productos === nextProps.productos) return true

  // Si el array cambió (nueva referencia), siempre re-renderizar
  // Esto asegura que los filtrados se muestren correctamente
  return false // false = re-renderizar
})
