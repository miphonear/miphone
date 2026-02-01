'use client'
import React, { useMemo } from 'react'
import Alert from '@ui/Alert'
import type { Producto } from '@/app/types/Producto'
import ProductModelCard from './ProductModelCard'
import AccesoriosAlertCard from './AccesoriosAlertCard'
import { SUBCATEGORIAS_CON_ALERTA_ACCESORIOS } from '@/lib/constantes'

// SECCIÓN: INTERFACES Y TIPOS
interface Props {
  productos: Producto[]
  alerta?: string
  /** Avatar por modelo (desde lista completa) para mostrar imagen aunque la variante filtrada no la tenga */
  avatarByModel?: Record<string, string>
}

// SECCIÓN: COMPONENTE PRINCIPAL
function ProductosGenericos({ productos, alerta, avatarByModel }: Props) {
  // SECCIÓN: FILTRADO
  const visibles = useMemo(
    () => productos.filter((p) => p.ocultar?.toLowerCase() !== 'x'),
    [productos],
  )

  // --- LÓGICA MODIFICADA PARA USAR LA LISTA DE SUBCATEGORÍAS ---
  const shouldShowAccesoriosAlert = useMemo(() => {
    // Si no hay productos visibles, no mostrar la alerta.
    if (visibles.length === 0) return false

    // Obtenemos la subcategoría del primer producto (todos tienen la misma en esta vista).
    const subcategoriaActual = visibles[0]?.subcategoria?.toUpperCase()

    // Solo mostramos la alerta si la subcategoría actual ESTÁ en nuestra lista de constantes.
    return SUBCATEGORIAS_CON_ALERTA_ACCESORIOS.includes(subcategoriaActual)
  }, [visibles])

  // SECCIÓN: AGRUPACIÓN POR MODELO (PRESERVANDO EL ORDEN DEL CSV)
  const agrupadosPorModelo = useMemo(() => {
    // Usamos un array para mantener el orden de aparición de los modelos.
    const ordenModelos: string[] = [] // Mantiene el orden de aparición
    // Optimización O(N): Usamos un Map para agrupar en una sola pasada
    const mapaModelos = new Map<string, { variantes: Producto[]; avatarUrl?: string }>()

    visibles.forEach((p) => {
      const modelo = p.modelo?.trim() || '-'

      if (!mapaModelos.has(modelo)) {
        ordenModelos.push(modelo) // Registramos orden
        mapaModelos.set(modelo, { variantes: [], avatarUrl: undefined })
      }

      const entry = mapaModelos.get(modelo)!
      entry.variantes.push(p)

      // Guardar el primer avatar válido que aparezca en las variantes
      if (!entry.avatarUrl && p.avatar?.trim()) {
        entry.avatarUrl = p.avatar.trim()
      }
    })

    // Reconstruir array final en orden; priorizar avatar de la lista completa (avatarByModel) para búsquedas
    return ordenModelos.map((modelo) => {
      const { variantes, avatarUrl } = mapaModelos.get(modelo)!
      return {
        modelo,
        variantes,
        avatarUrl: avatarByModel?.[modelo] ?? avatarUrl,
      }
    })
  }, [visibles, avatarByModel])

  // SECCIÓN: RENDERIZADO PRINCIPAL
  return (
    <div className="w-full flex flex-col gap-4 mt-6">
      {/* Alerta contextual si existe */}
      {alerta && (
        <div className="w-full max-w-3xl mx-auto">
          <Alert>{alerta}</Alert>
        </div>
      )}
      {/* Listado de tarjetas agrupadas */}{' '}
      <div className="w-full flex flex-col gap-4">
        {agrupadosPorModelo.map(({ modelo, variantes, avatarUrl }, i) => (
          <ProductModelCard
            key={modelo}
            modelo={modelo}
            variantes={variantes}
            avatar={avatarUrl}
            animationDelay={`${i * 150}ms`}
          />
        ))}
      </div>
      {/* Alerta CTA Accesorios */}
      {shouldShowAccesoriosAlert && <AccesoriosAlertCard />}
    </div>
  )
}

// Memoizar componente para evitar re-renders cuando las props no cambian
// IMPORTANTE: Si el array cambió (nueva referencia), siempre re-renderizar
// porque puede ser un filtrado diferente aunque contenga los mismos objetos
export default React.memo(ProductosGenericos, (prevProps, nextProps) => {
  // Si cambió la alerta, re-renderizar
  if (prevProps.alerta !== nextProps.alerta) return false

  // Si es el mismo array (misma referencia), no re-renderizar
  if (prevProps.productos === nextProps.productos) return true

  // Si el array cambió (nueva referencia), siempre re-renderizar
  // Esto asegura que los filtrados se muestren correctamente
  return false // false = re-renderizar
})
