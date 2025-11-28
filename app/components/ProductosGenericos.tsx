'use client'
import { useMemo } from 'react'
import Alert from '@ui/Alert'
import type { Producto } from '@/app/types/Producto'
import ProductModelCard from './ProductModelCard'
import AccesoriosAlertCard from './AccesoriosAlertCard'
import { SUBCATEGORIAS_CON_ALERTA_ACCESORIOS } from '@/lib/constantes'

// SECCIÓN: INTERFACES Y TIPOS
interface Props {
  productos: Producto[]
  alerta?: string
}

// SECCIÓN: COMPONENTE PRINCIPAL
export default function ProductosGenericos({ productos, alerta }: Props) {
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

      // Guardar el primer avatar válido que aparezca
      if (!entry.avatarUrl && p.avatar?.trim()) {
        entry.avatarUrl = p.avatar.trim()
      }
    })

    // Reconstruir array final en orden
    return ordenModelos.map((modelo) => {
      const { variantes, avatarUrl } = mapaModelos.get(modelo)!
      return { modelo, variantes, avatarUrl }
    })
  }, [visibles])

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
