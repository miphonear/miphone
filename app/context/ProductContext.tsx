'use client'
import { createContext, useContext, useMemo, ReactNode } from 'react'
import { useCSV } from '@/app/hooks/useCSV'
import type { Producto } from '@/app/types/Producto'

// 1. Constantes para URLs
const CSV_URLS = {
  GENERICOS:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRr62BlKCzICpC0ctnU2mRB8cq_SOCcsgydXQJXD5pQvasO1b1iT0Wp_L7sFxH8UGJCepaMjng1GUO0/pub?gid=1062531966&single=true&output=csv',
  ESPECIALES:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRr62BlKCzICpC0ctnU2mRB8cq_SOCcsgydXQJXD5pQvasO1b1iT0Wp_L7sFxH8UGJCepaMjng1GUO0/pub?gid=1307357173&single=true&output=csv',
} as const

// 2. Interface más robusta con opciones adicionales
interface ProductContextType {
  productos: Producto[]
  loading: boolean
  error: string | null
  // Propiedades útiles adicionales
  totalProductos: number
  hasError: boolean
  isReady: boolean
}

// 3. Valor por defecto para el contexto
const defaultContextValue: ProductContextType = {
  productos: [],
  loading: true,
  error: null,
  totalProductos: 0,
  hasError: false,
  isReady: false,
}

// 4. Context con valor por defecto
const ProductContext = createContext<ProductContextType>(defaultContextValue)

interface ProductProviderProps {
  children: ReactNode
  // Opcional: permitir URLs customizadas para testing
  urls?: {
    genericos?: string
    especiales?: string
  }
}

export function ProductProvider({ children, urls = {} }: ProductProviderProps) {
  // 5. URLs con fallback a las constantes
  const urlGenericos = urls.genericos ?? CSV_URLS.GENERICOS
  const urlEspeciales = urls.especiales ?? CSV_URLS.ESPECIALES

  const { productos: genericos, loading: loadingGen, error: errorGen } = useCSV(urlGenericos)

  const { productos: especiales, loading: loadingEsp, error: errorEsp } = useCSV(urlEspeciales)

  // 6. Memoización más específica y valores computados
  const value = useMemo((): ProductContextType => {
    const productos = [...genericos, ...especiales]
    const loading = loadingGen || loadingEsp
    const error = errorGen || errorEsp

    return {
      productos,
      loading,
      error,
      totalProductos: productos.length,
      hasError: Boolean(error),
      isReady: !loading && !error,
    }
  }, [genericos, especiales, loadingGen, loadingEsp, errorGen, errorEsp])

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

// 7. Hook más descriptivo y con mejor manejo de errores
export function useProducts() {
  const context = useContext(ProductContext)

  // 8. Con valor por defecto ya no necesitamos este check, pero lo mantenemos por seguridad
  if (context === undefined) {
    throw new Error(
      'useProducts debe ser usado dentro de un ProductProvider. ' +
        'Asegúrate de envolver tu componente con <ProductProvider>.',
    )
  }

  return context
}

// 9. Hooks especializados opcionales para casos específicos
export function useProductsReady() {
  const { isReady } = useProducts()
  return isReady
}

export function useProductCount() {
  const { totalProductos } = useProducts()
  return totalProductos
}
