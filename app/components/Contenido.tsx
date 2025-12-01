'use client'
import { useMemo, useState, useEffect, useCallback } from 'react'
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

function NavButton({ active, onClick, children, count, ariaLabel }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-3 py-1.5 text-sm font-semibold whitespace-nowrap snap-center transition
        focus:outline-none 
        focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset
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

  const categorias = useMemo(() => {
    if (!productos?.length) return []

    const queryUpper = query.trim().toUpperCase()
    const esFiltroEtiqueta = queryUpper === 'NEW' || queryUpper === 'SALE'

    let productosAProcesar = productos

    // Lógica especial para filtros NEW/SALE: Buscar modelos que cumplan y traer todas sus variantes
    if (esFiltroEtiqueta) {
      const modelosQueCumplen = new Set<string>()
      productos.forEach((p) => {
        const labelNormalizado = p.label?.trim().toUpperCase() || ''
        if (labelNormalizado.includes(queryUpper)) {
          modelosQueCumplen.add(p.modelo)
        }
      })
      productosAProcesar = productos.filter((p) => modelosQueCumplen.has(p.modelo))
    }

    // Agrupación de datos
    const categoriasAgrupadas: CategoriaVista[] = []

    productosAProcesar.forEach((p) => {
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

    if (esFiltroEtiqueta) return categoriasAgrupadas

    // Transformación final usando la librería de filtrado (casteo para compatibilidad de tipos)
    return filtrarCategorias(
      categoriasAgrupadas as unknown as Parameters<typeof filtrarCategorias>[0],
      query,
    ) as unknown as CategoriaVista[]
  }, [productos, query])

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
      {/* A. NAVEGACIÓN: CATEGORÍAS (Visible solo si hay múltiples resultados) */}
      {showCategoryTabs && (
        <nav aria-label="Categorías" className="mb-4">
          <div className="flex justify-start md:justify-center">
            {/* Diseño unificado: border-gray-300 para coincidir con subcategorías */}
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

            if (subcategoriaActual.nombre.toLowerCase().includes('seminuevo')) {
              return (
                <ProductosSeminuevos
                  key={subcategoriaActual.nombre}
                  productos={productosFiltradosLinea}
                  alerta={alerta}
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
