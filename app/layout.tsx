// app/layout.tsx
import 'styles/globals.css'
import { Inter } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import PageWrapper from './components/PageWrapper'

// =====================
// CONSTANTES
// =====================
const SITE_CONFIG = {
  name: 'miPhone™',
  url: 'https://miphone.ar',
  description:
    'Descubrí los mejores precios en tecnología: iPhone, Apple, Samsung, Xiaomi, Consolas, Gaming, Fotografía y más. ¡A un clic de distancia!',
} as const

// =====================
// METADATA SEO
// =====================
export const metadata: Metadata = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  keywords: [
    'precios celulares Argentina',
    'comprar iphone',
    'importados',
    'macbook',
    'samsung',
    'xiaomi',
    'consolas',
    'gaming',
    'playstation',
    'nintendo',
    'fotografía',
    'ofertas online',
    'capital federal',
    'buenos aires',
  ],
  authors: [{ name: 'miPhone', url: SITE_CONFIG.url }],
  openGraph: {
    title: SITE_CONFIG.name,
    description: 'Los mejores precios en tecnología: Apple, Samsung, Xiaomi, consolas y más.',
    url: SITE_CONFIG.url,
    type: 'website',
    images: [
      {
        url: `${SITE_CONFIG.url}/images/preview.jpg`,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
    siteName: SITE_CONFIG.name,
    locale: 'es_AR',
  },
  // Twitter Cards para mejor sharing
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.url}/images/preview.jpg`],
  },
  metadataBase: new URL(SITE_CONFIG.url),
  // URL canónica para evitar contenido duplicado
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png', // Para iOS
  },
}

// =====================
// VIEWPORT CONFIG
// =====================
export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Accesibilidad: permite zoom hasta 500%
  userScalable: true, // Accesibilidad: permite zoom manual
}

// =====================
// FUENTE
// =====================
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap', // Evita FOIT (Flash of Invisible Text)
  preload: true, // Precarga la fuente para mejor performance
})

// =====================
// LAYOUT
// =====================
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={inter.className}>
      {/* DNS prefetch para mejor performance si usás servicios externos */}
      <head>
        <link rel="dns-prefetch" href="//docs.google.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      </head>

      <body>
        {/* Skip link para accesibilidad - usuarios de teclado/lectores de pantalla */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                     bg-blue-600 text-white px-4 py-2 rounded z-50"
        >
          Saltar al contenido principal
        </a>

        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando...</p>
              </div>
            </div>
          }
        >
          <PageWrapper>
            <main id="main-content">{children}</main>
          </PageWrapper>
        </Suspense>

        <SpeedInsights />
      </body>
    </html>
  )
}
