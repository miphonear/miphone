'use client'
import { ProductProvider } from '@/app/context/ProductContext'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    // Envolvemos todas las páginas de la tienda con el ProductProvider.
    // La carga de datos se hará una sola vez aquí, y estará disponible
    // para todas las páginas hijas.
    <ProductProvider>{children}</ProductProvider>
  )
}
