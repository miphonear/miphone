'use client'
import { useState } from 'react'

const items = [
  {
    title: '🆚 Comparador de productos',
    links: [
      { href: 'https://www.gsmarena.com/compare.php3', text: 'Comparador de smartphones' },
      { href: 'https://www.apple.com/es/iphone/compare/', text: 'iPhone: comparador de modelos' },
      { href: 'https://www.apple.com/la/airpods/compare/', text: 'AirPods: comparador de modelos' },
      {
        href: 'https://www.apple.com/la/watch/compare/',
        text: 'Apple Watch: comparador de modelos',
      },
      { href: 'https://www.apple.com/la/ipad/compare/', text: 'iPad: comparador de modelos' },
      { href: 'https://www.apple.com/la/mac/compare/', text: 'MacBook: comparador de modelos' },
    ],
  },
  {
    title: '🔁 Traspaso de información',
    links: [
      { href: 'https://support.apple.com/es-es/118670', text: 'Pasar de Android a iPhone/iPad' },
      {
        href: 'https://www.youtube.com/shorts/5c1mjZ10Dtg',
        text: 'Pasar datos WhatsApp de Android a iOS',
      },
      {
        href: 'https://www.android.com/intl/es_es/switch-to-android/',
        text: 'Pasar de iPhone/iPad a Android',
      },
      {
        href: 'https://support.apple.com/es-lamr/119967/',
        text: 'Transferir datos entre dispositivos Apple',
      },
    ],
  },
  {
    title: 'ℹ️ Info útil',
    links: [
      {
        href: 'https://support.apple.com/es-lamr/120837',
        text: '¿Qué hago si me robaron el iPhone?',
      },
      { href: 'https://support.apple.com/es-lamr/118669', text: '¿Qué es eSIM en el iPhone?' },
      {
        href: 'https://support.apple.com/es-lamr/104989',
        text: '¿Cómo conectar los AirPods y AirPods Pro?',
      },
      { href: 'https://support.apple.com/es-lamr/108364', text: '¿Cómo conectar los AirPods Max?' },
      {
        href: 'https://support.apple.com/es-lamr/104956',
        text: '¿Cómo enlazar el Apple Watch con un iPhone nuevo?',
      },
      {
        href: 'https://www.apple.com/shop/Catalog/US/Images/bxxd/size-guide_CA.pdf',
        text: '¿Cómo conocer mi talle en Apple Watch?',
      },
      {
        href: 'https://www.mi.com/global/verify/#/en/tab/imei',
        text: '¿Cómo comprobar la autenticidad de un producto Xiaomi?',
      },
      {
        href: 'https://support.apple.com/es-lamr/102869',
        text: '¿Cómo identificar el modelo de tu MacBook Air?',
      },
      {
        href: 'https://support.apple.com/es-lamr/108052',
        text: '¿Cómo identificar el modelo de tu MacBook Pro?',
      },
      {
        href: 'https://support.apple.com/es-lamr/108043',
        text: '¿Cómo identificar el modelo de tu iPad?',
      },
      {
        href: 'https://support.apple.com/es-lamr/109509',
        text: '¿Cómo Identificar el adaptador de energía de la Mac?',
      },
      { href: 'https://support.apple.com/es-lamr/108937', text: 'Compatibilidad de Apple Pencil' },
    ],
  },
  {
    title: '📷 Fotografía',
    links: [
      {
        href: 'https://www.dpreview.com/products/cameras/',
        text: 'DPReview.com: Camera feature search',
      },
      {
        href: 'https://www.rtings.com/camera/tools/table',
        text: 'RTINGS.com: Comparador de cámaras',
      },
      {
        href: 'https://www.dxomark.com/camera-sensors/reviews/',
        text: 'DXOMARK.com: Camera sensor reviews',
      },
      {
        href: 'https://www.dxomark.com/camera-lenses/reviews/',
        text: 'DXOMARK.com: Camera lens reviews',
      },
      {
        href: 'https://www.decamaras.com/CMS/component/option,com_objetivos/Itemid,291/func,siglas/',
        text: 'Objetivos y Lentes - siglas de todas las marcas',
      },
    ],
  },
]

export default function FAQContent() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div>
      {items.map((item) => {
        const isOpen = open === item.title
        const contentId = `faq-content-${item.title.replace(/\s+/g, '-')}`

        return (
          <div key={item.title} className="border-b last:border-b-0">
            <button
              className={`flex w-full items-center justify-between py-3 text-left font-semibold text-gray-800 transition-colors hover:text-orange-500 focus:outline-none ${
                isOpen ? 'text-orange-600' : ''
              }`}
              onClick={() => setOpen(isOpen ? null : item.title)}
              aria-expanded={isOpen}
              aria-controls={contentId}
            >
              <span>{item.title}</span>
              <span className="text-base" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>

            <div
              id={contentId}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <ul className="space-y-1 pb-2 pl-2">
                {item.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-2 py-1 rounded hover:bg-orange-50 transition-colors text-sm"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}
    </div>
  )
}
