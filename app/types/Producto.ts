// app/types/Producto.ts

// SECCIÓN: INTERFACE PRINCIPAL
// Interface para definir la estructura de un producto en la app
export interface Producto {
  // Campos comunes a todos los productos
  categoria: string // Categoría principal (ej: 'APPLE', 'ANDROID')
  subcategoria: string // Subcategoría (ej: 'XIAOMI')
  linea?: string // Línea o variante (opcional, ej: 'POCO')
  modelo: string // Modelo del producto (ej: 'F7')
  precio?: string // Precio (opcional)
  ocultar?: string // Flag para ocultar (ej: 'x' para ocultar)
  label?: string // Etiqueta (opcional, ej: 'NEW', 'SALE')
  avatar?: string // Avatar

  // Campos para genéricos
  version?: string // Versión o variante (opcional, ej: '128GB')
  specs?: string // Enlace a ficha técnica (opcional)

  // Campos para seminuevos y accesorios
  capacidad?: string // Capacidad (opcional, ej: '128GB')
  condicion?: string // Condición (opcional, ej: 'Excelente')
  color?: string // Color (opcional, ej: 'Negro')
  bateria?: string // Estado de batería (opcional, ej: '85%')
  fotos?: string // Enlaces a fotos (opcional, ej: 'url1,url2')

  // Campos pre-computados para optimización (se calculan al parsear CSV)
  _categoriaNormalizada?: string // categoria.toUpperCase().trim()
  _modeloLimpio?: string // clean(modelo)
  _lineaLimpia?: string // clean(linea || '')
  _versionLimpia?: string // clean(version || '')
  _labelLimpio?: string // clean(label || '')
  _capacidadLimpia?: string // clean(capacidad || '')
  _colorLimpio?: string // clean(color || '')
  _subcategoriaLimpia?: string // clean(subcategoria)
}
