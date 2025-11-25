const WHATSAPP_NUMBER = '5491127737463'
const WHATSAPP_MESSAGE = '¡Hola!'

export default function WhatsAppFloat() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <div className="fixed z-50 bottom-4 right-4 flex items-center group">
      {/* Bubble solo en desktop, sin JS */}
      <span
        className="
          hidden md:inline-flex pointer-events-none select-none
          mr-4 px-4 py-2 rounded-full bg-white text-[#25d366] font-semibold text-sm
          shadow-lg
          opacity-0 scale-95 translate-x-4
          group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0
          group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:translate-x-0
          transition-all duration-200 ease-out
        "
        style={{ boxShadow: '0 2px 24px 0 rgba(39, 174, 96, 0.12)' }}
      >
        ¡Chateá con nosotros!
      </span>

      {/* Botón WhatsApp */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        title="Contactar por WhatsApp"
        className="
          flex items-center justify-center
          bg-[#25d366] text-white rounded-full shadow-lg
          w-14 h-14
          transition-transform duration-200 hover:scale-110
          focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25d366]/40
        "
      >
        {/* SVG inline (decorativo) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={28}
          height={28}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.52 3.48A11.938 11.938 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.19 1.58 6.02L0 24l6.21-1.59A11.99 11.99 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22.04a10.06 10.06 0 0 1-5.08-1.38l-.36-.21-3.69.95.98-3.6-.23-.37A10.01 10.01 0 1 1 12 22.04zm5.38-7.43c-.3-.15-1.78-.88-2.05-.99-.27-.1-.47-.15-.66.16-.19.3-.76.98-.94 1.18-.17.2-.35.22-.65.08-.3-.15-1.27-.47-2.42-1.51-.9-.8-1.51-1.79-1.69-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.34.44-.51.15-.17.19-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.59-.91-2.18-.24-.59-.49-.5-.66-.51-.17-.01-.37-.01-.57-.01s-.52.07-.8.36c-.27.29-1.05 1.02-1.05 2.48 0 1.46 1.08 2.88 1.23 3.09.15.21 2.13 3.24 5.17 4.42.72.27 1.28.43 1.72.55.72.18 1.37.16 1.88.1.57-.07 1.78-.73 2.04-1.44.26-.7.26-1.31.18-1.44-.09-.13-.27-.2-.57-.34z" />
        </svg>
      </a>
    </div>
  )
}
