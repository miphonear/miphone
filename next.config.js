/** @type {import('next').NextConfig} */
const nextConfig = {
  // Redirigir www -> sin www para consistencia con metadata (miphone.ar)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.miphone.ar' }],
        destination: 'https://miphone.ar/:path*',
        permanent: true,
      },
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  images: {
    // Formatos modernos para mejor compresión
    formats: ['image/avif', 'image/webp'],
    // Tamaños de dispositivos comunes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Tamaños de imágenes (para srcset)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Dominios permitidos (Actualizado a remotePatterns por seguridad y compatibilidad)
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google
      { protocol: 'https', hostname: 'm.media-amazon.com' }, // Amazon
      { protocol: 'https', hostname: 'fdn2.gsmarena.com' }, // GSMarena
      { protocol: 'https', hostname: 'ibb.co' }, // ImgBB
      { protocol: 'https', hostname: 'www.apple.com' }, // Apple
    ],

    // Configuración adicional
    minimumCacheTTL: 60, // Cache mínimo de 60 segundos
  },
}

module.exports = nextConfig
