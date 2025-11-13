'use client'

interface ErrorMessageProps {
  children: string // Recibe el string del error
}

export default function ErrorMessage({ children }: ErrorMessageProps) {
  // --- Accesibilidad ---
  // role="alert" + aria-live informan a lectores de pantalla cuando aparece un error.
  // aria-atomic asegura que se lea el mensaje completo.
  // aria-label proporciona un contexto adicional.
  // El emoji se marca aria-hidden para no interrumpir la lectura del mensaje.

  // --- Lógica para separar el emoji del texto ---
  // Los emojis pueden ocupar más de un carácter, así que tomamos los 2 primeros por seguridad.
  const emoji = children.substring(0, 2)
  const text = children.substring(2).trim() // El resto del texto

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Mensaje de error"
      className="flex flex-col items-center justify-center text-center text-gray-600 py-12"
    >
      <span className="text-6xl mb-4" aria-hidden="true">
        {emoji}
      </span>
      <p className="text-gray-600">{text}</p>
    </div>
  )
}
