// lib/cache.ts
// Utilidad para manejar caché con localStorage y TTL (Time To Live)

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // TTL en milisegundos
}

const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutos por defecto

/**
 * Guarda datos en localStorage con TTL
 */
export function setCache<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  if (typeof window === 'undefined') return // SSR safety

  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    }
    localStorage.setItem(key, JSON.stringify(entry))
  } catch (error) {
    // Si localStorage está lleno o no disponible, simplemente ignoramos
    console.warn('Error al guardar en caché:', error)
  }
}

/**
 * Obtiene datos del caché si aún son válidos
 */
export function getCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null // SSR safety

  try {
    const item = localStorage.getItem(key)
    if (!item) return null

    const entry: CacheEntry<T> = JSON.parse(item)
    const now = Date.now()
    const age = now - entry.timestamp

    // Si el caché expiró, lo eliminamos y retornamos null
    if (age > entry.ttl) {
      localStorage.removeItem(key)
      return null
    }

    return entry.data
  } catch (error) {
    // Si hay error al parsear o leer, limpiamos y retornamos null
    console.warn('Error al leer caché:', error)
    try {
      localStorage.removeItem(key)
    } catch {
      // Ignorar errores al limpiar
    }
    return null
  }
}

/**
 * Limpia un item específico del caché
 */
export function clearCache(key: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn('Error al limpiar caché:', error)
  }
}

/**
 * Limpia todo el caché relacionado con productos
 */
export function clearProductCache(): void {
  if (typeof window === 'undefined') return
  try {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith('csv_cache_')) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.warn('Error al limpiar caché de productos:', error)
  }
}
