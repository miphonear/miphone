'use client'
import Papa, { ParseResult } from 'papaparse'
import { useEffect, useState } from 'react'
import type { Producto } from '../types/Producto'

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

    setLoading(true)
    setError(null)

    Papa.parse<Record<string, string>>(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
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
            const normalizados: Producto[] = data
              .map((row) => {
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

                return {
                  categoria: categoria ? categoria.toUpperCase() : '',
                  subcategoria: subcategoria ? subcategoria.toUpperCase() : '',
                  linea: row['Linea']?.trim().toUpperCase() || '',
                  modelo: modelo || '',
                  precio: row['Precio']?.trim() || '',
                  ocultar: row['Ocultar']?.trim() || '',
                  version: row['Version']?.trim() || '',
                  specs: row['Specs']?.trim() || '',
                  label: row['Label']?.trim() || '',
                  capacidad: row['Capacidad']?.trim() || '',
                  condicion: row['Condicion']?.trim() || '',
                  color: row['Color']?.trim() || '',
                  bateria: row['Bateria']?.trim() || '',
                  fotos: row['Fotos']?.trim() || '',
                  avatar: row['Avatar']?.trim() || '',
                }
              })
              .filter((p): p is Producto => p !== null)

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
        setError(
          '📶 ¡Ups! No pudimos descargar el catálogo de productos. Verifica tu conexión e intenta de nuevo.',
        )
        setLoading(false)
      },
    })
  }, [url])

  return { productos, loading, error }
}
