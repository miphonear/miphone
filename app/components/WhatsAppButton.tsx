interface Props {
  mensaje: string
  className?: string
}

export default function WhatsAppButton({ mensaje, className }: Props) {
  const href = `https://wa.me/5491127737463?text=${encodeURIComponent(mensaje)}`
  const label = 'Consultar por WhatsApp'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={`inline-flex items-center gap-1 text-[#25d366] font-semibold text-xs ring-2 ring-[#25d366] rounded-lg px-2 py-1 hover:bg-green-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25d366]/40 transition ${
        className || ''
      }`}
    >
      Consultar
    </a>
  )
}
