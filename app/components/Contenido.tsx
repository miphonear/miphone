'use client'
import React, { useMemo, useState, useEffect, useCallback } from 'react'
import type { Producto } from '@/app/types/Producto'
import ProductosGenericos from './ProductosGenericos'
import ProductosSeminuevos from './ProductosSeminuevos'
import ProductosAccesorios from './ProductosAccesorios'
import { ALERTAS } from '@/lib/constantes'
import { filtrarCategorias } from '@/lib/filtrarCategorias'
import ErrorMessage from '@ui/ErrorMessage'

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

// --- COMPONENTES AUXILIARES ---

interface NavButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  count?: number
  ariaLabel?: string
}

// Memoizar NavButton para evitar re-renders innecesarios
const NavButton = React.memo(function NavButton({
  active,
  onClick,
  children,
  count,
  ariaLabel,
}: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-3 py-1.5 text-sm font-semibold whitespace-nowrap snap-center transition
        focus:outline-none 
        focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset select-none cursor-pointer
        ${
          active
            ? 'bg-orange-500 text-white'
            : 'bg-white text-gray-700 hover:text-gray-800 hover:bg-gray-100'
        }
      `}
      aria-label={ariaLabel}
      aria-pressed={active}
    >
      {children}
      {count !== undefined && <span className="text-sm font-medium ml-1">({count})</span>}
    </button>
  )
})

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

    // --- LÓGICA 1: FILTRO "NEW" (Agrupa por Modelo) ---
    // Si un modelo tiene etiqueta NEW, mostramos TODAS sus variantes.
    if (queryUpper === 'NEW') {
      const modelosConNew = new Set<string>()
      productos.forEach((p) => {
        if (p.label?.trim().toUpperCase().includes('NEW')) {
          modelosConNew.add(p.modelo)
        }
      })

      const categoriasFiltradas = categoriasBase.map((cat) => {
        const subcategoriasFiltradas = cat.subcategorias
          .map((sub) => {
            // Filtramos si el modelo está en la lista "modelosConNew"
            const productosFiltrados = sub.productos.filter((p) => modelosConNew.has(p.modelo))

            if (productosFiltrados.length > 0) {
              return {
                ...sub,
                productos: productosFiltrados,
                lineas: Array.from(new Set(productosFiltrados.map((p) => p.linea))).filter(Boolean),
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

    // --- LÓGICA 2: FILTRO "SALE" (Filtra por Variante exacta) ---
    // Solo mostramos la variante específica que tiene la etiqueta SALE.
    if (queryUpper === 'SALE') {
      const categoriasFiltradas = categoriasBase.map((cat) => {
        const subcategoriasFiltradas = cat.subcategorias
          .map((sub) => {
            // Filtramos directo el producto: tiene que tener el label SALE
            const productosFiltrados = sub.productos.filter((p) =>
              p.label?.trim().toUpperCase().includes('SALE'),
            )

            if (productosFiltrados.length > 0) {
              return {
                ...sub,
                productos: productosFiltrados,
                lineas: Array.from(new Set(productosFiltrados.map((p) => p.linea))).filter(Boolean),
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

    // --- LÓGICA 3: FILTRO GENÉRICO DE BÚSQUEDA ---
    // (Por nombre, marca, modelo, etc.)
    return filtrarCategorias(
      categoriasBase as unknown as Parameters<typeof filtrarCategorias>[0],
      queryTrimmed,
    ) as unknown as CategoriaVista[]
  }, [categoriasBase, query, productos])

  // --- 2. ESTADOS DE NAVEGACIÓN Y ANIMACIÓN ---

  const [cat, setCat] = useState(categoriaActiva)
  const [sub, setSub] = useState('')
  const [linea, setLinea] = useState<string>('')

  const [showSubcategorias, setShowSubcategorias] = useState(false)
  const [showLineas, setShowLineas] = useState(false)

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

  // Sincronizar categoría inicial o fallback
  useEffect(() => {
    if (categorias.length === 0) {
      setCat('')
      return
    }
    const categoriaExiste = categorias.some((c) => c.nombre === cat)
    if (!categoriaExiste) {
      // Si hay query o datos, seleccionamos la primera categoría disponible
      setCat(query.trim() || categorias.length > 0 ? categorias[0].nombre : '')
    }
  }, [categorias, cat, query])

  // Seleccionar primera subcategoría automáticamente
  useEffect(() => {
    if (categoriaActual?.subcategorias?.length) {
      setSub(categoriaActual.subcategorias[0].nombre)
      setLinea('')
    } else {
      setSub('')
      setLinea('')
    }
  }, [categoriaActual])

  // Seleccionar primera línea automáticamente
  useEffect(() => {
    if (subcategoriaActual?.lineas?.length) {
      setLinea(subcategoriaActual.lineas[0])
    } else {
      setLinea('')
    }
  }, [subcategoriaActual])

  // Control de animación de entrada para barras de navegación
  useEffect(() => {
    if (!categoriaActual) {
      setShowSubcategorias(false)
      return
    }
    setShowSubcategorias(false)
    const timer = setTimeout(() => setShowSubcategorias(true), 50)
    return () => clearTimeout(timer)
  }, [categoriaActual])

  useEffect(() => {
    if (!subcategoriaActual?.lineas?.length) {
      setShowLineas(false)
      return
    }
    setShowLineas(false)
    const timer = setTimeout(() => setShowLineas(true), 50)
    return () => clearTimeout(timer)
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
          No se encontraron productos para &ldquo;<span className="text-orange-500">{query}</span>
          &rdquo; <br />
          Intentá con otra búsqueda o consultanos por WhatsApp.
        </p>
      </div>
    )
  }

  const showCategoryTabs = categorias.length > 1

  return (
    <main className={`max-w-6xl mx-auto ${disableAnimation ? 'no-slide' : ''}`} role="main">
      {/* A. NAVEGACIÓN: CATEGORÍAS */}
      {showCategoryTabs && (
        <nav aria-label="Categorías" className="mb-4">
          <div className="flex justify-start md:justify-center">
            <div
              className="flex overflow-x-auto no-scrollbar rounded-md border border-gray-300 divide-x divide-gray-300 max-w-full snap-x snap-mandatory scroll-smooth"
              role="tablist"
            >
              {categorias.map((c) => (
                <NavButton
                  key={c.nombre}
                  active={cat === c.nombre}
                  onClick={() => handleCategoryClick(c.nombre)}
                  count={c.totalProductos}
                  ariaLabel={`Ver ${c.totalProductos} productos de ${c.nombre}`}
                >
                  {c.nombre}
                </NavButton>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* B. NAVEGACIÓN: SUBCATEGORÍAS */}
      {categoriaActual && (
        <nav
          aria-label="Subcategorías"
          className={`mb-4 transition-opacity duration-400 ${
            showSubcategorias ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex justify-start md:justify-center">
            <div
              className="flex overflow-x-auto no-scrollbar rounded-md border border-gray-300 divide-x divide-gray-300 max-w-full snap-x snap-mandatory scroll-smooth"
              role="tablist"
            >
              {categoriaActual.subcategorias.map((s) => (
                <NavButton
                  key={s.nombre}
                  active={sub === s.nombre}
                  onClick={() => handleSubcategoriaClick(s.nombre)}
                  count={s.productos.length}
                  ariaLabel={`Ver ${s.productos.length} productos de ${s.nombre}`}
                >
                  {s.nombre}
                </NavButton>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* C. NAVEGACIÓN: LÍNEAS */}
      {subcategoriaActual?.lineas?.length ? (
        <nav
          aria-label="Líneas de productos"
          className={`mb-4 transition-opacity duration-400 ${
            showLineas ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex justify-start md:justify-center">
            <div
              className="flex overflow-x-auto no-scrollbar rounded-md border border-gray-200 divide-x divide-gray-300 max-w-full snap-x snap-mandatory scroll-smooth"
              role="tablist"
            >
              {subcategoriaActual.lineas.map((ln) => {
                const count = subcategoriaActual.productos.filter((p) => p.linea === ln).length
                return (
                  <NavButton
                    key={ln}
                    active={linea === ln}
                    onClick={() => handleLineaClick(ln)}
                    count={count}
                    ariaLabel={`Filtrar por línea ${ln}, ${count} productos`}
                  >
                    {ln}
                  </NavButton>
                )
              })}
            </div>
          </div>
        </nav>
      ) : null}

      {/* D. LISTADO DE PRODUCTOS */}
      <section aria-label="Lista de productos">
        {subcategoriaActual &&
          (() => {
            const alerta =
              ALERTAS[subcategoriaActual.nombre.toUpperCase() as keyof typeof ALERTAS] || null

            // Detectamos Seminuevos por Categoría o Subcategoría
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
              />
            )
          })()}
      </section>
    </main>
  )
}
