// --- Subcategorias en donde se muestra Alert.tsx ---
export type SubcategoriaConAlerta =
  | 'MACBOOK'
  | 'IPHONE'
  | 'WATCH'
  | 'SAMSUNG GALAXY'
  | 'SEMINUEVOS'
  | 'CABLES'
  | 'CARGADORES'

export const ALERTAS: Record<SubcategoriaConAlerta, string> = {
  MACBOOK:
    'Consultanos por versiones custom (Chip MAX, +RAM, etc). También traemos iMac, Mac mini, Mac Studio',
  IPHONE: '¡Con la compra de un iPhone + U$30, llevate un cargador 20W Apple ORIGINAL!',
  WATCH: 'Consultar por correas y colores. Las imágenes son a modo ilustrativo',
  'SAMSUNG GALAXY':
    'Por otros productos de la marca Samsung (Buds, Tabs, etc) consultanos por WhatsApp',
  SEMINUEVOS:
    'Todos los equipos fueron testeados y nunca reparados (piezas originales). Garantía escrita de 30 días por fallas.',
  CARGADORES: 'Cargadores certificados y seguros para tu equipo',
  CABLES: 'Cables certificados y seguros para tu equipo',
}

// --- Subcategorias en donde se muestra AccesoriosAlertCard.tsx ---
export const SUBCATEGORIAS_CON_ALERTA_ACCESORIOS = [
  'IPHONE',
  'AIRPODS',
  'WATCH',
  'MACBOOK',
  'IPAD',
  'XIAOMI',
  'SAMSUNG GALAXY',
  'PIXEL',
  'REALME',
  'SEMINUEVOS',
]
