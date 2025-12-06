/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
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
    // Dominios permitidos
    domains: [
      'lh3.googleusercontent.com', // Google
      'm.media-amazon.com', // Amazon
      'fdn2.gsmarena.com', // GSMarena
      'ibb.co', // ImgBB
    ],
    // Configuración adicional
    minimumCacheTTL: 60, // Cache mínimo de 60 segundos
  },
}

module.exports = nextConfig
