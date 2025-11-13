'use client'
import { useMemo, useState, useEffect, useCallback } from 'react'
import type { Producto } from '@/app/types/Producto'
import ProductosGenericos from './ProductosGenericos'
import ProductosSeminuevos from './ProductosSeminuevos'
import ProductosAccesorios from './ProductosAccesorios'
import { ALERTAS } from '@/lib/constantes'
import { filtrarCategorias } from '@/lib/filtrarCategorias'
import ErrorMessage from '@ui/ErrorMessage'

interface ContenidoProps {
  productos: Producto[]
  loading: boolean
  error: string | null
  query: string
  categoriaActiva?: string
}

// Componente reutilizable para botones de navegación (subcategorias y lineas)
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
            : 'bg-white text-gray-600 hover:text-gray-700 hover:bg-gray-100'
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

export default function Contenido({
  productos,
  loading,
  error,
  query,
  categoriaActiva = '',
}: ContenidoProps) {
  // 3. Optimización: memoizar cálculos pesados
  const categorias = useMemo(() => {
    if (!productos?.length) return [] // 8. Validación robusta

    const categoriasAgrupadas: {
      nombre: string
      subcategorias: {
        nombre: string
        productos: Producto[]
        lineas: string[]
      }[]
    }[] = []

    productos.forEach((p) => {
      // 8. Validaciones más robustas
      if (!p?.categoria?.trim()) return

      let cat = categoriasAgrupadas.find((c) => c.nombre === p.categoria)
      if (!cat) {
        cat = { nombre: p.categoria, subcategorias: [] }
        categoriasAgrupadas.push(cat)
      }

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

    return filtrarCategorias(categoriasAgrupadas, query)
  }, [productos, query])

  // Estados de navegación
  const [cat, setCat] = useState(categoriaActiva)
  const [sub, setSub] = useState('')
  const [linea, setLinea] = useState<string>('')

  // Estados de animación
  const [showSubcategorias, setShowSubcategorias] = useState(false)
  const [showLineas, setShowLineas] = useState(false)

  // 3. Memoizar cálculos que se usan múltiples veces
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

  // 9. Handlers con useCallback
  const handleSubcategoriaClick = useCallback((nombreSub: string) => {
    setSub(nombreSub)
    setLinea('')
  }, [])

  const handleLineaClick = useCallback((nombreLinea: string) => {
    setLinea(nombreLinea)
  }, [])

  // Efectos con cleanup (6. Memory leaks)
  useEffect(() => {
    if (categorias.length === 0) {
      setCat('')
      return
    }

    const categoriaExiste = categorias.some((c) => c.nombre === cat)
    if (!categoriaExiste) {
      if (query.trim() || categorias.length > 0) {
        setCat(categorias[0].nombre)
      } else {
        setCat('')
      }
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

  // 6. Efectos de animación con cleanup
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

  // Estados especiales
  if (loading) {
    return null
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>
  }

  // 4. No results
  if (categorias.length === 0 && query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-600 py-12">
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

  // 5. Semántica con nav y section
  return (
    <main className="max-w-6xl mx-auto" role="main">
      {/* 2/5. Navegación por subcategorías con accesibilidad */}
      {categoriaActual && (
        <nav
          aria-label="Subcategorías"
          className={`mb-4 transition-all duration-500 ease-out
            ${
              showSubcategorias
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2 pointer-events-none'
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

      {/* 2/5. Navegación por líneas con accesibilidad */}
      {subcategoriaActual?.lineas?.length ? (
        <nav
          aria-label="Líneas de productos"
          className={`mb-4 transition-all duration-500 ease-out
            ${
              showLineas
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2 pointer-events-none'
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

      {/* 5. Sección de productos con semántica */}
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
