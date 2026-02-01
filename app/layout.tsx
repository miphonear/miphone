// app/layout.tsx
import 'styles/globals.css'
import { Suspense } from 'react'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import PageWrapper from './components/PageWrapper'

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? 'G-VTHYM5J1V2'

// =====================
// CONSTANTES
// =====================
const SITE_CONFIG = {
  name: 'miPhone',
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
  applicationName: SITE_CONFIG.name,
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
    'insta360',
    'ofertas online',
    'capital federal',
    'buenos aires',
  ],
  authors: [{ name: 'miPhone', url: SITE_CONFIG.url }],
  creator: 'miPhone',
  publisher: 'miPhone',
  category: 'technology',

  // Manifest para PWA
  manifest: '/site.webmanifest',

  // Icons completos
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },

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
    countryName: 'Argentina',
  },

  // Twitter Cards para mejor sharing
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.url}/images/preview.jpg`],
    creator: '@miphonear', // Ajustá si tenés Twitter
  },

  metadataBase: new URL(SITE_CONFIG.url),

  // URL canónica para evitar contenido duplicado
  alternates: {
    canonical: SITE_CONFIG.url,
    languages: {
      'es-AR': SITE_CONFIG.url,
      es: SITE_CONFIG.url,
    },
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

  // Opcional: verificación para Search Console
  // verification: {
  //   google: 'tu-codigo-de-verificacion',
  // },

  // Formato JSON-LD para rich snippets (opcional)
  other: {
    'format-detection': 'telephone=no', // Evita que iOS detecte números como teléfonos
  },
}

// =====================
// VIEWPORT CONFIG
// =====================
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }, // Si implementás dark mode
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Accesibilidad: permite zoom hasta 500%
  userScalable: true, // Accesibilidad: permite zoom manual
  colorScheme: 'light', // o 'light dark' si soportás dark mode
}

// =====================
// FUENTE
// =====================
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'], // Agregué 500 y 600 para más variedad
  display: 'swap', // Evita FOIT (Flash of Invisible Text)
  preload: true, // Precarga la fuente para mejor performance
})

// =====================
// LAYOUT
// =====================
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={inter.className}>
      <body>
        {/* Skip link para accesibilidad - usuarios de teclado/lectores de pantalla */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                     bg-blue-600 text-white px-4 py-2 rounded z-50 
                     focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Saltar al contenido principal
        </a>

        {/* 
           IMPORTANTE: Suspense es obligatorio aquí porque PageWrapper usa useSearchParams().
           Sin esto, el build falla en páginas estáticas (404, etc).
        */}
        <Suspense
          fallback={
            // Podés dejar este div vacío o usar un spinner minimalista para que no moleste
            <div className="flex items-center justify-center min-h-screen bg-white" />
          }
        >
          <PageWrapper>
            <main id="main-content">{children}</main>
          </PageWrapper>
        </Suspense>

        <SpeedInsights />

        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}
