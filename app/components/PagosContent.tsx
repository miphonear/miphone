import UsdtLogo from '@/public/images/payments/tether-usdt-logo.svg'
import PaypalLogo from '@/public/images/payments/paypal-logo.svg'
import WiseLogo from '@/public/images/payments/wise-logo.svg'
import GrabrfiLogo from '@/public/images/payments/grabrfi-logo.svg'
import WallbitLogo from '@/public/images/payments/wallbit-logo.svg'

interface MetodoPago {
  icon?: string
  titulo: string
  descripcion?: string
  nota?: string
}

const metodos: MetodoPago[] = [
  {
    titulo: '💵 Efectivo:',
    descripcion: 'USD y/o pesos argentinos',
    nota: 'No recibimos billetes rotos, escritos ni de cara chica (anteriores a 1996)',
  },
  {
    titulo: '💳 Cripto y billeteras:',
    descripcion: 'USDT, Wise, PayPal, Wallbit, GrabrFi',
    nota: 'Consultar comisiones',
  },
  {
    titulo: '🏦 Transferencia bancaria en pesos',
    nota: 'Comisión = 4,5%',
  },
  {
    titulo: '🏦 Transferencia internacional ACH-USA',
    nota: 'Comisión = 3%',
  },
  {
    titulo: '❌ No financiamos ni aceptamos tarjetas',
  },
  {
    titulo: 'ℹ️ Los precios publicados no incluyen IVA',
  },
]

const logos = [
  { Component: UsdtLogo, alt: 'USDT', className: 'h-4 w-auto' },
  { Component: PaypalLogo, alt: 'PayPal', className: 'h-4 w-auto' },
  { Component: WallbitLogo, alt: 'Wallbit', className: 'h-4 w-auto' },
  { Component: GrabrfiLogo, alt: 'GrabrFi', className: 'h-4 w-auto' },
  { Component: WiseLogo, alt: 'Wise', className: 'h-3 w-auto' }, // 👈 más chico
]

export default function PagosContent() {
  return (
    <div>
      <ul className="mb-4 list-inside space-y-2 text-sm md:text-base">
        {metodos.map((m) => (
          <li key={m.titulo}>
            <span className="font-semibold">{m.titulo}</span> {m.descripcion}
            {m.nota && <span className="block text-xs md:text-sm text-gray-600">{m.nota}</span>}
          </li>
        ))}
      </ul>

      <hr className="my-4 border-t border-gray-300" />

      <div className="flex flex-wrap items-center gap-4 justify-center">
        {logos.map(({ Component, alt, className }) => (
          <Component key={alt} className={className} aria-label={alt} role="img" />
        ))}
      </div>
    </div>
  )
}
