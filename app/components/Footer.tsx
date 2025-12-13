'use client'
import { Facebook, Instagram, Send, Mail } from 'lucide-react'
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
  return (
    <footer className="bg-white border-t shadow-[0_-1px_3px_0_rgba(0,0,0,0.04)] py-8 mt-12">
      <div className="container mx-auto px-4 text-center space-y-4">
        {/* Logo textual */}
        <p className="text-xl">
          <span className="font-medium text-gray-800">mi</span>
          <span className="font-bold text-gray-800">Phone™</span>
        </p>

        {/* Redes sociales */}
        <div className="flex justify-center items-center gap-8 text-xl">
          {SOCIAL_LINKS.map(({ href, label, icon: Icon }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-gray-700 hover:text-orange-500 transition-colors duration-400"
            >
              <Icon className="w-6 h-6 inline" />
            </a>
          ))}
        </div>

        {/* Email */}
        <div className="text-sm text-gray-500 mt-2">
          <a
            href="mailto:info@miphone.ar"
            className="hover:text-orange-500 transition-colors duration-400 underline"
            aria-label="Enviar un correo electrónico a info@miphone.ar"
          ></a>
        </div>
      </div>
    </footer>
  )
}
