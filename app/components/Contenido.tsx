'use client'
import React, { useMemo, useState, useEffect, useCallback } from 'react'
import type { Producto } from '@/app/types/Producto'
import ProductosGenericos from './ProductosGenericos'
import ProductosSeminuevos from './ProductosSeminuevos'
import ProductosAccesorios from './ProductosAccesorios'
import { ALERTAS } from '@/lib/constantes'
import { filtrarCategorias } from '@/lib/filtrarCategorias'
import ErrorMessage from '@ui/ErrorMessage'
import NavigationTabs from './NavigationTabs'

// --- TIPOS Y PROPS ---

interface ContenidoProps {
  productos: Producto[]
  loading: boolean
  error: string | null
  query: string
  categoriaActiva?: string
  disableAnimation?: boolean
}

interface CategoriaVista {
  nombre: string
  totalProductos: number
  subcategorias: {
    nombre: string
    productos: Producto[]
    lineas: string[]
  }[]
}

/** Filtra categorías por label (NEW, SALE, etc.). porModelo = todo el modelo si alguna variante tiene el label; porProducto = solo productos con el label. */
function filtrarCategoriasPorLabel(
  categoriasBase: CategoriaVista[],
  productos: Producto[],
  label: string,
  modo: 'porModelo' | 'porProducto',
): CategoriaVista[] {
  const labelUpper = label.toUpperCase().trim()

  const modelosConLabel =
    modo === 'porModelo'
      ? (() => {
          const set = new Set<string>()
          productos.forEach((p) => {
            if (p.label?.trim().toUpperCase().includes(labelUpper)) set.add(p.modelo)
          })
          return set
        })()
      : null

  const categoriasFiltradas = categoriasBase.map((cat) => {
    const subcategoriasFiltradas = cat.subcategorias
      .map((sub) => {
        const productosFiltrados =
          modo === 'porModelo'
            ? sub.productos.filter((p) => modelosConLabel!.has(p.modelo))
            : sub.productos.filter((p) =>
                p.label?.trim().toUpperCase().includes(labelUpper),
              )
        if (productosFiltrados.length > 0) {
          return {
            ...sub,
            productos: productosFiltrados,
            lineas: Array.from(
              new Set(productosFiltrados.map((p) => p.linea).filter(Boolean)),
            ) as string[],
          }
        }
        return null
      })
      .filter((sub): sub is NonNullable<typeof sub> => sub !== null)

    if (subcategoriasFiltradas.length > 0) {
      return {
        ...cat,
        subcategorias: subcategoriasFiltradas,
        totalProductos: subcategoriasFiltradas.reduce(
          (sum, sub) => sum + sub.productos.length,
          0,
        ),
      }
    }
    return null
  })

  return categoriasFiltradas.filter((cat): cat is CategoriaVista => cat !== null)
}

// --- COMPONENTE PRINCIPAL ---

export default function Contenido({
  productos,
  loading,
  error,
  query,
  categoriaActiva = '',
  disableAnimation = false,
}: ContenidoProps) {
  // --- 1. PROCESAMIENTO Y FILTRADO DE DATOS ---

  // Avatar por modelo desde la lista completa (para que la búsqueda muestre avatar aunque la variante filtrada no lo tenga)
  const avatarByModel = useMemo(() => {
    const map: Record<string, string> = {}
    productos.forEach((p) => {
      const m = p.modelo?.trim()
      if (m && p.avatar?.trim() && !map[m]) map[m] = p.avatar.trim()
    })
    return map
  }, [productos])

  // Agrupación base: se recalcula solo cuando cambian los productos
  const categoriasBase = useMemo(() => {
    if (!productos?.length) return []

    const categoriasAgrupadas: CategoriaVista[] = []

    productos.forEach((p) => {
      if (!p?.categoria?.trim()) return

      let cat = categoriasAgrupadas.find((c) => c.nombre === p.categoria)
      if (!cat) {
        cat = { nombre: p.categoria, totalProductos: 0, subcategorias: [] }
        categoriasAgrupadas.push(cat)
      }

      cat.totalProductos++

      const subcategoriaNombre = p.subcategoria?.trim() || 'General'
      let sub = cat.subcategorias.find((s) => s.nombre === subcategoriaNombre)
      if (!sub) {
        sub = { nombre: subcategoriaNombre, productos: [], lineas: [] }
        cat.subcategorias.push(sub)
      }
      sub.productos.push(p)

      if (p.linea?.trim() && !sub.lineas.includes(p.linea.trim())) {
        sub.lineas.push(p.linea.trim())
      }
    })

    return categoriasAgrupadas
  }, [productos])

  // Aplicar filtrado sobre la agrupación base (solo se recalcula cuando cambia query)
  const categorias = useMemo(() => {
    if (!categoriasBase.length) return []

    const queryTrimmed = query.trim()
    if (!queryTrimmed) return categoriasBase

    const queryUpper = queryTrimmed.toUpperCase()

    // --- FILTRO POR LABEL (NEW, SALE, etc.) ---
    if (queryUpper === 'NEW') {
      return filtrarCategoriasPorLabel(categoriasBase, productos, 'NEW', 'porModelo')
    }
    if (queryUpper === 'SALE') {
      return filtrarCategoriasPorLabel(categoriasBase, productos, 'SALE', 'porProducto')
    }

    // --- FILTRO GENÉRICO DE BÚSQUEDA ---
    return filtrarCategorias(
      categoriasBase as unknown as CategoriaVista[],
      queryTrimmed,
    ) as unknown as CategoriaVista[]
  }, [categoriasBase, query, productos])

  // --- 2. ESTADOS DE NAVEGACIÓN Y ANIMACIÓN ---

  const [cat, setCat] = useState(categoriaActiva)
  const [sub, setSub] = useState('')
  const [linea, setLinea] = useState<string>('')

  // --- 3. SELECCIÓN ACTUAL (Memoized) ---

  const categoriaActual = useMemo(() => categorias.find((c) => c.nombre === cat), [categorias, cat])

  const subcategoriaActual = useMemo(
    () => categoriaActual?.subcategorias.find((s) => s.nombre === sub),
    [categoriaActual, sub],
  )

  const productosFiltradosLinea = useMemo(() => {
    if (!subcategoriaActual) return []
    return linea
      ? subcategoriaActual.productos.filter((p) => p.linea === linea)
      : subcategoriaActual.productos
  }, [subcategoriaActual, linea])

  // --- 4. MANEJADORES DE EVENTOS ---

  const handleCategoryClick = useCallback((nombreCat: string) => {
    setCat(nombreCat)
    setSub('')
    setLinea('')
  }, [])

  const handleSubcategoriaClick = useCallback((nombreSub: string) => {
    setSub(nombreSub)
    setLinea('')
  }, [])

  const handleLineaClick = useCallback((nombreLinea: string) => {
    setLinea(nombreLinea)
  }, [])

  // --- 5. EFECTOS (Sincronización y Animación) ---

  useEffect(() => {
    if (categorias.length === 0) {
      setCat('')
      return
    }
    const categoriaExiste = categorias.some((c) => c.nombre === cat)
    if (!categoriaExiste) {
      setCat(query.trim() || categorias.length > 0 ? categorias[0].nombre : '')
    }
  }, [categorias, cat, query])

  useEffect(() => {
    if (categoriaActual?.subcategorias?.length) {
      setSub(categoriaActual.subcategorias[0].nombre)
      setLinea('')
    } else {
      setSub('')
      setLinea('')
    }
  }, [categoriaActual])

  useEffect(() => {
    if (subcategoriaActual?.lineas?.length) {
      setLinea(subcategoriaActual.lineas[0])
    } else {
      setLinea('')
    }
  }, [subcategoriaActual])

  // --- 6. RENDERIZADO ---

  if (loading) return null
  if (error) return <ErrorMessage>{error}</ErrorMessage>

  if (categorias.length === 0 && query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-700 py-12">
        <span className="block text-6xl mb-4" role="img" aria-label="Pensando">
          🤔
        </span>
        <p className="text-md mb-2">
          No se encontraron productos para &ldquo;
          <span className="text-orange-500 font-bold">{query}</span>&rdquo;
          <br /> Intentá con otra búsqueda o consultanos por WhatsApp.
        </p>
      </div>
    )
  }

  return (
    <main className={`max-w-6xl mx-auto ${disableAnimation ? 'no-slide' : ''}`} role="main">
      {/* SECCIÓN DE NAVEGACIÓN EXTRAÍDA */}
      <NavigationTabs
        categorias={categorias}
        categoriaActual={categoriaActual}
        subcategoriaActual={subcategoriaActual}
        seleccion={{ cat, sub, linea }}
        actions={{ handleCategoryClick, handleSubcategoriaClick, handleLineaClick }}
      />

      {/* D. LISTADO DE PRODUCTOS */}
      <section aria-label="Lista de productos">
        {subcategoriaActual &&
          (() => {
            const alerta =
              ALERTAS[subcategoriaActual.nombre.toUpperCase() as keyof typeof ALERTAS] || null
            const esSeminuevo =
              categoriaActual?.nombre.toLowerCase().includes('seminuevo') ||
              subcategoriaActual.nombre.toLowerCase().includes('seminuevo')

            if (esSeminuevo) {
              return (
                <ProductosSeminuevos
                  key={subcategoriaActual.nombre}
                  productos={productosFiltradosLinea}
                  alerta={ALERTAS['SEMINUEVOS']}
                />
              )
            }
            if (categoriaActual?.nombre.toLowerCase().includes('accesorio')) {
              return (
                <ProductosAccesorios
                  key={subcategoriaActual.nombre}
                  productos={productosFiltradosLinea}
                  alerta={alerta}
                />
              )
            }
            return (
              <ProductosGenericos
                key={subcategoriaActual.nombre}
                productos={productosFiltradosLinea}
                alerta={alerta}
                avatarByModel={avatarByModel}
              />
            )
          })()}
      </section>
    </main>
  )
}
