'use client'
import { Facebook, Instagram, Send, Mail, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const SOCIAL_LINKS = [
  {
    href: 'https://instagram.com/miphone.ar/',
    label: 'Instagram miPhone',
    icon: Instagram,
  },
  {
    href: 'https://www.facebook.com/miphone.argentina/',
    label: 'Facebook miPhone',
    icon: Facebook,
  },
]

const CONTACT_LINKS = [
  {
    href: 'https://wa.me/5491127737463?text=%C2%A1Hola!',
    label: 'WhatsApp miPhone',
    icon: MessageCircle,
  },
  {
    href: 'https://t.me/miphone_ar/',
    label: 'Telegram miPhone',
    icon: Send,
  },
  {
    href: 'mailto:info@miphone.ar',
    label: 'Email miPhone',
    icon: Mail,
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-100 mt-8">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 
            CLAVE: Cambiamos 'flex-col md:flex-row' por solo 'flex flex-row' 
            para que siempre sean dos columnas laterales.
        */}
        <div className="flex flex-row justify-between items-start gap-4">
          {/* BLOQUE 1: MARCA Y PERSONAJE */}
          <div className="flex flex-col items-start space-y-3">
            <Link href="/" className="text-xl md:text-2xl tracking-tight select-none">
              <span className="font-medium text-gray-800">mi</span>
              <span className="font-bold text-gray-800">Phone™</span>
            </Link>

            {/* Contenedor relativo para el hover y la burbuja */}
            <div className="group relative flex items-center">
              {/* SPEECH BUBBLE (Solo Desktop) */}
              <div
                className="
                  absolute
                  left-full
                  ml-4
                  whitespace-nowrap
                  rounded-2xl
                  bg-orange-100
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-orange-900
                  opacity-0
                  -translate-x-3
                  transition-all
                  duration-300
                  group-hover:opacity-100
                  group-hover:translate-x-0
                  pointer-events-none
                  z-50
                  hidden md:block
                "
              >
                ¡Estoy para ayudarte!
              </div>

              {/* Mifonito */}
              <div className="flex items-center justify-center p-3 rounded-2xl bg-gray-50 hover:bg-orange-50 transition-all duration-300 cursor-help">
                <Image
                  src="/images/mifonito/mifonito_f.png"
                  alt="Mifonito"
                  width={120}
                  height={120}
                  className="w-16 h-16 md:w-24 md:h-24 object-contain select-none"
                  unoptimized
                  priority={false}
                />
              </div>
            </div>
          </div>

          {/* BLOQUE 2: SOCIALES Y CONTACTO */}
          <div className="flex flex-col items-end space-y-5">
            {/* Seguinos */}
            <div className="flex flex-col items-end space-y-1.5">
              <h3 className="font-bold text-gray-800 text-xs uppercase tracking-[0.2em]">
                Seguinos
              </h3>
              <div className="flex gap-1.5 md:gap-2">
                {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="
  flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-2xl 
  bg-gray-50 text-gray-700 
  hover:bg-orange-50 hover:text-orange-600 
  transition-all duration-200 active:scale-95
  focus:outline-none 
  focus-visible:ring-2 
  focus-visible:ring-orange-400 
"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Contacto */}
            <div className="flex flex-col items-end space-y-1.5">
              <h3 className="font-bold text-gray-800 text-xs uppercase tracking-[0.2em]">
                Contacto
              </h3>
              <div className="flex gap-1.5 md:gap-2">
                {CONTACT_LINKS.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="
  flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-2xl 
  bg-gray-50 text-gray-700 
  hover:bg-orange-50 hover:text-orange-600 
  transition-all duration-200 active:scale-95
  focus:outline-none 
  focus-visible:ring-2 
  focus-visible:ring-orange-400 
                    "
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BARRA INFERIOR */}
        <div className="border-t border-gray-100 mt-8 pt-6">
          <p className="text-xs text-gray-400 uppercase tracking-[0.1em] text-center md:text-left opacity-70">
            © {currentYear} miPhone
            <span className="hidden md:inline">. Todos los derechos reservados.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
