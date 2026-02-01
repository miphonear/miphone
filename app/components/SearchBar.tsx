'use client'
import { Search, X, Tag, Sparkles } from 'lucide-react'
import { useRef, useEffect, useState, useCallback } from 'react'

/**
 * Props del buscador.
 * - initialValue: valor inicial (p.ej. tomado de la URL)
 * - onSearch: callback que se ejecuta luego del debounce o acciones rápidas (clear/shortcut)
 * - placeholder: placeholder del input
 * - autoFocus: enfoca el input al montar
 * - disabled: desactiva la UI del buscador (estilos + eventos)
 */
interface Props {
  initialValue?: string
  onSearch: (_value: string) => void // prefijo _ para silenciar ESLint si el tipo se analiza como uso
  placeholder?: string
  autoFocus?: boolean
  disabled?: boolean
  hideSuggestions?: boolean
}

/**
 * Botones sugeridos fijos:
 * - "Ofertas" dispara la búsqueda con "SALE"
 * - "Nuevos" dispara la búsqueda con "NEW"
 * Útiles para atajos de filtrado sin tipear.
 */
function SuggestionButtons({ onShortcut }: { onShortcut: (_s: string) => void }) {
  return (
    <div
      className="flex flex-wrap justify-start gap-2"
      role="group"
      aria-label="Búsquedas sugeridas"
    >
      <button
        type="button"
        onClick={() => onShortcut('SALE')}
        className="flex items-center gap-2 px-2.5 py-1.5 text-sm font-semibold rounded-xl
                   bg-orange-100 text-orange-700 hover:bg-orange-200 
                   focus:outline-none focus:ring-2 focus:ring-orange-500
                   transition-colors duration-150"
        aria-label="Buscar ofertas"
      >
        <Tag className="w-4 h-4" aria-hidden="true" />
        Ofertas
      </button>

      <button
        type="button"
        onClick={() => onShortcut('NEW')}
        className="flex items-center gap-2 px-2.5 py-1.5 text-sm font-semibold rounded-xl
                   bg-violet-100 text-violet-700 hover:bg-violet-200 
                   focus:outline-none focus:ring-2 focus:ring-violet-500
                   transition-colors duration-150"
        aria-label="Buscar nuevos"
      >
        <Sparkles className="w-4 h-4" aria-hidden="true" />
        Ingresos
      </button>
    </div>
  )
}

/**
 * Componente principal de SearchBar con:
 * - Sincronización de estado con initialValue proveniente de afuera (URL/router)
 * - Accesibilidad: role="search", aria-labels, tecla Escape limpia
 * - Acciones rápidas: limpiar búsqueda y shortcuts disparan onSearch de inmediato
 */
export default function SearchBar({
  initialValue = '',
  onSearch,
  placeholder = '¿Qué producto estás buscando?',
  autoFocus = false,
  disabled = false,
  hideSuggestions = false,
}: Props) {
  // Estado controlado del input
  const [inputValue, setInputValue] = useState(initialValue)

  // Ref para manejar foco (focus al montar, foco tras limpiar o usar shortcut)
  const inputRef = useRef<HTMLInputElement>(null)

  // Guardamos el timer de debounce para poder cancelarlo en submit (Enter)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Memoizamos el callback para evitar recrearlo en cada render
  const handleSearch = useCallback(
    (value: string) => {
      onSearch(value)
    },
    [onSearch],
  )

  /**
   * Debounce mejorado:
   * - Espera 300ms desde la última tecla antes de disparar onSearch (reducido de 500ms)
   * - Evita bucles si el input ya coincide con initialValue
   * - No dispara cuando está disabled
   * - Mejor UX: respuesta más rápida sin sacrificar rendimiento
   */
  useEffect(() => {
    if (inputValue === initialValue || disabled) return

    // Cancela cualquier timer previo antes de crear uno nuevo
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const handler = setTimeout(() => {
      handleSearch(inputValue)
    }, 300) // Reducido de 500ms a 300ms para mejor UX
    debounceRef.current = handler

    // Cleanup: cancela el timeout si el usuario sigue escribiendo
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [inputValue, initialValue, handleSearch, disabled])

  /**
   * Sync con initialValue:
   * - Si el valor externo cambia (p.ej. navegación o reset), reflejarlo en el input.
   */
  useEffect(() => {
    setInputValue(initialValue)
  }, [initialValue])

  /**
   * AutoFocus:
   * - Enfoca el input al montar si autoFocus es true y no está disabled.
   */
  useEffect(() => {
    if (autoFocus && !disabled) {
      inputRef.current?.focus()
    }
  }, [autoFocus, disabled])

  /**
   * UX con teclado:
   * - Escape limpia el input y dispara onSearch('') inmediatamente
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && inputValue) {
      e.preventDefault()
      setInputValue('')
      handleSearch('')
    }
  }

  /**
   * Shortcuts:
   * - Setean el valor, enfocan el input y disparan onSearch de inmediato
   */
  const handleShortcut = useCallback(
    (shortcut: string) => {
      setInputValue(shortcut)
      inputRef.current?.focus()
      handleSearch(shortcut)
    },
    [handleSearch],
  )

  /**
   * Limpiar:
   * - Vacía el input, devuelve foco y dispara onSearch('') de inmediato
   */
  const handleClear = useCallback(() => {
    setInputValue('')
    inputRef.current?.focus()
    handleSearch('')
  }, [handleSearch])

  /**
   * Submit (Enter):
   * - Evita esperar el debounce, busca al instante y cierra el teclado en móviles
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (disabled) return
    if (debounceRef.current) clearTimeout(debounceRef.current) // evita doble disparo
    handleSearch(inputValue)
    inputRef.current?.blur() // cierra teclado en mobile
  }

  // Render
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Contenedor principal del buscador */}
      {/* Mejora: envolver en form permite Enter inmediato y mejor UX móvil */}
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col rounded-3xl border-2 border-gray-200 bg-white/90
          transition-all duration-200 
          ${
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:border-orange-500 hover:ring-4 hover:ring-orange-500/20 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/20'
          }`}
        role="search"
        aria-label="Buscador de productos"
      >
        {/* Input con ícono de búsqueda */}
        <div className="relative">
          {/* Ícono Search (decorativo) */}
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            aria-hidden="true"
          >
            <Search className="w-5 h-5" />
          </span>

          <input
            ref={inputRef}
            type="search" // Mejora: teclado móvil muestra botón "Buscar/Ir"
            className="w-full pl-12 pr-10 py-2.5 bg-transparent 
                       text-sm md:text-base text-gray-800 placeholder-gray-500 
                       focus:outline-none disabled:cursor-not-allowed
                       [&::-webkit-search-cancel-button]:hidden" /* Oculta la 'X' nativa del input search */
            placeholder={placeholder}
            aria-label={`${placeholder}. Usa Enter para buscar, Escape para limpiar`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            autoComplete="off" // Evita autocompletado del navegador
            spellCheck="false" // Evita subrayado rojo en términos de marca/modelo
          />

          {/* Botón para limpiar el texto (aparece solo cuando hay contenido) */}
          {inputValue && !disabled && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 hover:bg-orange-500 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
              onClick={handleClear}
              aria-label="Limpiar búsqueda"
              type="button"
              title="Limpiar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Shortcuts fijos (Ofertas / Nuevos) */}
        {!disabled && !hideSuggestions && (
          <div className="p-3 pt-4">
            <SuggestionButtons onShortcut={handleShortcut} />
          </div>
        )}
      </form>
    </div>
  )
}
