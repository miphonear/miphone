'use client'
import Papa, { ParseResult } from 'papaparse'
import { useEffect, useState } from 'react'
import type { Producto } from '../types/Producto'
import { getCache, setCache } from '@/lib/cache'
import { clean } from '@/lib/clean'

// TTL del caché: 5 minutos (300,000 ms)
const CACHE_TTL = 5 * 60 * 1000

// Genera una clave única para el caché basada en la URL
function getCacheKey(url: string): string {
  return `csv_cache_${url}`
}

// SECCIÓN: HOOK PRINCIPAL
export function useCSV(url: string) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // SECCIÓN: EFECTO PARA FETCH Y PARSEO
  useEffect(() => {
    if (!url) {
      // Se dispara cuando la URL no está definida o es una cadena vacía.
      // Casos: prop faltante, variable de entorno no seteada, bug al pasar el argumento.
      setError('URL no válida')
      setLoading(false)
      return
    }

    // Intentar obtener del caché primero
    const cacheKey = getCacheKey(url)
    const cachedData = getCache<Producto[]>(cacheKey)

    if (cachedData) {
      // Si hay datos en caché válidos, usarlos inmediatamente
      setProductos(cachedData)
      setLoading(false)
      setError(null)
      // Continuar en background para actualizar el caché si es necesario
      // (opcional: podrías hacer esto solo si el caché es viejo)
    } else {
      setLoading(true)
      setError(null)
    }

    // Función para normalizar y pre-computar campos
    const normalizeProduct = (row: Record<string, string>): Producto | null => {
      const categoria = row['Categoria']?.trim()
      const subcategoria = row['Subcategoria']?.trim()
      const modelo = row['Modelo']?.trim()

      // Ignorar filas vacías
      if (!categoria && !subcategoria && !modelo) return null

      // Ignorar filas que son encabezados repetidos
      if (
        categoria?.toUpperCase() === 'CATEGORIA' &&
        subcategoria?.toUpperCase() === 'SUBCATEGORIA'
      ) {
        return null
      }

      const categoriaNormalizada = categoria ? categoria.toUpperCase().trim() : ''
      const subcategoriaNormalizada = subcategoria ? subcategoria.toUpperCase().trim() : ''
      const linea = row['Linea']?.trim().toUpperCase() || ''
      const version = row['Version']?.trim() || ''
      const label = row['Label']?.trim() || ''
      const capacidad = row['Capacidad']?.trim() || ''
      const color = row['Color']?.trim() || ''

      // Pre-computar campos normalizados para optimizar búsquedas
      return {
        categoria: categoriaNormalizada,
        subcategoria: subcategoriaNormalizada,
        linea,
        modelo: modelo || '',
        precio: row['Precio']?.trim() || '',
        ocultar: row['Ocultar']?.trim() || '',
        version,
        specs: row['Specs']?.trim() || '',
        label,
        capacidad,
        condicion: row['Condicion']?.trim() || '',
        color,
        bateria: row['Bateria']?.trim() || '',
        fotos: row['Fotos']?.trim() || '',
        avatar: row['Avatar']?.trim() || '',
        // Campos pre-computados para optimización
        _categoriaNormalizada: categoriaNormalizada,
        _modeloLimpio: clean(modelo || ''),
        _lineaLimpia: clean(linea),
        _versionLimpia: clean(version),
        _labelLimpio: clean(label),
        _capacidadLimpia: clean(capacidad),
        _colorLimpio: clean(color),
        _subcategoriaLimpia: clean(subcategoria || ''),
      }
    }

    // Si ya tenemos datos del caché, hacer fetch en background para actualizar
    const shouldFetch = !cachedData

    if (!shouldFetch) {
      // Hacer fetch en background para actualizar caché (sin bloquear UI)
      Papa.parse<Record<string, string>>(url, {
        download: true,
        header: true,
        skipEmptyLines: true,
        worker: true,
        complete: ({ data, errors }: ParseResult<Record<string, string>>) => {
          if (errors.length === 0) {
            try {
              const normalizados = data
                .map(normalizeProduct)
                .filter((p): p is Producto => p !== null)
              setCache(cacheKey, normalizados, CACHE_TTL)
              // Actualizar estado solo si no hay datos actuales (por si acaso)
              setProductos((prev) => (prev.length === 0 ? normalizados : prev))
            } catch (error) {
              console.error('Error al normalizar datos en background:', error)
            }
          }
        },
      })
      return
    }

    // Fetch principal (cuando no hay caché)
    Papa.parse<Record<string, string>>(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      worker: true, // usa web worker para no bloquear UI en CSVs grandes
      complete: ({ data, errors }: ParseResult<Record<string, string>>) => {
        if (errors.length > 0) {
          console.error('CSV Parse errors:', errors)
          // Se dispara cuando PapaParse pudo descargar el archivo pero encontró
          // errores al interpretarlo.
          // Casos típicos:
          // - Estructura de columnas distinta a la esperada (headers cambiados).
          // - Filas con cantidad de columnas inconsistente.
          // - Archivo CSV corrupto o con caracteres/encoding inválido.
          // - Celdas con comillas sin cerrar que rompen el parseo.
          setError(
            '🔄 ¡Ups! Hubo un problema al leer el catálogo de productos. Intenta refrescar la página.',
          )
        } else {
          try {
            const normalizados = data.map(normalizeProduct).filter((p): p is Producto => p !== null)

            // Guardar en caché
            setCache(cacheKey, normalizados, CACHE_TTL)

            setProductos(normalizados)
          } catch (normalizationError) {
            console.error('Error al normalizar datos:', normalizationError)
            // Se dispara cuando el mapeo/normalización falla, aun cuando el CSV
            // haya sido parseado correctamente.
            // Casos típicos:
            // - Tipos inesperados en campos (ej.: objeto en vez de string).
            // - Acceso a propiedades inexistentes que asumes que están.
            // - Lógica de normalización que arroja una excepción.
            setError('🔄 Error al procesar los datos del catálogo.')
          }
        }
        setLoading(false)
      },
      error: (parseError) => {
        console.error('Papa parse error:', parseError)
        // Se dispara cuando PapaParse no puede DESCARGAR el archivo (antes de parsear).
        // Casos típicos:
        // - URL mal escrita o recurso inexistente (404).
        // - Problemas de red del usuario (sin conexión, timeout).
        // - El servidor rechaza la solicitud (5xx) o CORS bloquea la petición.
        // - Google Sheets temporalmente no disponible.

        // Si hay caché, usarlo como fallback
        const cachedData = getCache<Producto[]>(cacheKey)
        if (cachedData) {
          setProductos(cachedData)
          setLoading(false)
          setError(null)
          return
        }

        setError(
          '📶 ¡Ups! No pudimos descargar el catálogo de productos. Verifica tu conexión e intenta de nuevo.',
        )
        setLoading(false)
      },
    })
  }, [url])

  return { productos, loading, error }
}
