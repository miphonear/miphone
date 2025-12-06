// lib/filtrarCategorias.ts
import { Producto } from '@/app/types/Producto'
import { clean } from './clean'

// SECCIÓN: TIPOS (ajusta según tu app)
interface Categoria {
  nombre: string
  subcategorias: { nombre: string; productos: Producto[]; lineas: string[] }[]
}

// SECCIÓN: CACHÉ DE RESULTADOS DE BÚSQUEDA
// Cachea resultados de búsqueda por query para evitar recalcular
const searchCache = new Map<string, Categoria[]>()
const MAX_SEARCH_CACHE_SIZE = 100

function pruneSearchCache() {
  if (searchCache.size > MAX_SEARCH_CACHE_SIZE) {
    const entries = Array.from(searchCache.entries())
    const toDelete = entries.slice(0, Math.floor(MAX_SEARCH_CACHE_SIZE / 2))
    toDelete.forEach(([key]) => searchCache.delete(key))
  }
}

// SECCIÓN: FUNCIÓN PRINCIPAL
// Filtra categorías basadas en una query, buscando en múltiples campos de Producto (categoria, subcategoria, linea, modelo, version, label, etc.).
// OPTIMIZADO: Usa campos pre-computados cuando están disponibles y cachea resultados.
export function filtrarCategorias(categorias: Categoria[], query: string): Categoria[] {
  if (!query.trim()) return categorias

  // Verificar caché de búsqueda
  const cacheKey = `${query.trim().toLowerCase()}_${categorias.length}`
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!
  }

  const words = clean(query).split(' ').filter(Boolean)
  const catNombreLimpio = clean(categorias[0]?.nombre || '') // Pre-computar una vez

  const result = categorias
    .map((cat) => {
      // Pre-computar nombre de categoría limpio una vez por categoría
      const catNombreLimpio = clean(cat.nombre)

      const subcategoriasFiltradas = cat.subcategorias
        .map((sub) => {
          // Pre-computar nombre de subcategoría limpio una vez por subcategoría
          const subNombreLimpio = clean(sub.nombre)

          const productosFiltrados = sub.productos.filter((p) => {
            // OPTIMIZACIÓN: Usar campos pre-computados si están disponibles, sino calcular
            const campos = [
              catNombreLimpio,
              subNombreLimpio,
              p._lineaLimpia ?? clean(p.linea || ''),
              p._modeloLimpio ?? clean(p.modelo || ''),
              p._versionLimpia ?? clean(p.version || ''),
              p._labelLimpio ?? clean(p.label || ''),
              p._capacidadLimpia ?? clean(p.capacidad || ''),
              p._colorLimpio ?? clean(p.color || ''),
              // Agrega más campos si es necesario (ej: clean(p.marca || ''), clean(p.tipo || ''))
            ]
            return words.every((word) => campos.some((campo) => campo.includes(word)))
          })

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
        return { ...cat, subcategorias: subcategoriasFiltradas }
      }
      return null
    })
    .filter((cat): cat is Categoria => cat !== null) // Type guarding final

  // Guardar en caché y podar si es necesario
  searchCache.set(cacheKey, result)
  pruneSearchCache()

  return result
}

/**
 * Limpia el caché de búsqueda (útil para testing o liberar memoria)
 */
export function clearSearchCache(): void {
  searchCache.clear()
}
