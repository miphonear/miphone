/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Rutas a los archivos donde Tailwind debe escanear clases
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Tokens de marca (Header, gradientes, CTAs)
      colors: {
        brand: {
          orange: '#FF6D0C',
          violet: '#C051FF',
        },
        whatsapp: '#25d366',
      },
      // Keyframes + animación de scroll del carrusel
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        // Animación para desplazamiento infinito horizontal del carrusel
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      // Shorthands para usar las animaciones por clase
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        // Velocidad del carrusel (30s más rápido, 200s más lento)
        'infinite-scroll': 'scroll 120s linear infinite',
      },
    },
  },
  // Plugins
  plugins: [require('tailwindcss-animate')],
}
