'use client'
import React, { useEffect, useState } from 'react'
import type { Producto } from '@/app/types/Producto'

// --- INTERFACES INTERNAS ---
interface Subcategoria {
  nombre: string
  productos: Producto[]
  lineas: string[]
}

interface Categoria {
  nombre: string
  totalProductos: number
  subcategorias: Subcategoria[]
}

interface NavButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  count?: number
  ariaLabel?: string
}

interface NavigationTabsProps {
  categorias: Categoria[]
  categoriaActual?: Categoria
  subcategoriaActual?: Subcategoria
  seleccion: { cat: string; sub: string; linea: string }
  actions: {
    handleCategoryClick: (val: string) => void
    handleSubcategoriaClick: (val: string) => void
    handleLineaClick: (val: string) => void
  }
}

// --- SUB-COMPONENTE: NavButton ---
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
            : 'bg-white text-gray-800 hover:text-gray-900 hover:bg-gray-100'
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

// --- COMPONENTE PRINCIPAL: NavigationTabs ---
export default function NavigationTabs({
  categorias,
  categoriaActual,
  subcategoriaActual,
  seleccion,
  actions,
}: NavigationTabsProps) {
  // Control de animación de entrada para barras de navegación
  const [showSubcategorias, setShowSubcategorias] = useState(false)
  const [showLineas, setShowLineas] = useState(false)

  // Efecto para animar la aparición de subcategorías
  useEffect(() => {
    if (!categoriaActual) {
      setShowSubcategorias(false)
      return
    }
    setShowSubcategorias(false)
    const timer = setTimeout(() => setShowSubcategorias(true), 50)
    return () => clearTimeout(timer)
  }, [categoriaActual])

  // Efecto para animar la aparición de líneas
  useEffect(() => {
    if (!subcategoriaActual?.lineas?.length) {
      setShowLineas(false)
      return
    }
    setShowLineas(false)
    const timer = setTimeout(() => setShowLineas(true), 50)
    return () => clearTimeout(timer)
  }, [subcategoriaActual])

  const showCategoryTabs = categorias.length > 1

  return (
    <>
      {/* A. NAVEGACIÓN: CATEGORÍAS */}
      {showCategoryTabs && (
        <nav aria-label="Categorías" className="mb-2">
          <div className="flex justify-start md:justify-center">
            <div
              className="flex overflow-x-auto no-scrollbar rounded-xl border border-gray-200 divide-x divide-gray-300 max-w-full snap-x snap-mandatory scroll-smooth"
              role="tablist"
            >
              {categorias.map((c) => (
                <NavButton
                  key={c.nombre}
                  active={seleccion.cat === c.nombre}
                  onClick={() => actions.handleCategoryClick(c.nombre)}
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
          className={`mb-2 transition-opacity duration-400 ${
            showSubcategorias ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex justify-start md:justify-center">
            <div
              className="flex overflow-x-auto no-scrollbar rounded-xl border border-gray-200 divide-x divide-gray-300 max-w-full snap-x snap-mandatory scroll-smooth"
              role="tablist"
            >
              {categoriaActual.subcategorias.map((s) => (
                <NavButton
                  key={s.nombre}
                  active={seleccion.sub === s.nombre}
                  onClick={() => actions.handleSubcategoriaClick(s.nombre)}
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
          className={`mb-2 transition-opacity duration-400 ${
            showLineas ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex justify-start md:justify-center">
            <div
              className="flex overflow-x-auto no-scrollbar rounded-xl border border-gray-200 divide-x divide-gray-300 max-w-full snap-x snap-mandatory scroll-smooth"
              role="tablist"
            >
              {subcategoriaActual.lineas.map((ln) => {
                const count = subcategoriaActual.productos.filter((p) => p.linea === ln).length
                return (
                  <NavButton
                    key={ln}
                    active={seleccion.linea === ln}
                    onClick={() => actions.handleLineaClick(ln)}
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
    </>
  )
}
