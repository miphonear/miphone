interface Garantia {
  titulo: string
  periodo: string
  descripcion: string
  link?: {
    url: string
    texto: string
  }
}

const garantias: Garantia[] = [
  {
    titulo: 'Garantía Apple',
    periodo: '12 Meses',
    descripcion: 'Oficial, mediante proveedor de servicios autorizado por Apple',
    link: {
      url: 'https://support.apple.com/es-lamr/102607',
      texto: 'support.apple.com',
    },
  },
  {
    titulo: 'Garantía smartphones',
    periodo: '3 Meses',
    descripcion: 'Servicio técnico propio, opera en caso de fallas de hardware',
    link: {
      url: 'https://docs.google.com/document/d/1sD2YTAb0hpADEudYpXNPVmP48pfz2wajzTv6HUmZFwk/edit?usp=sharing',
      texto: 'ver documento',
    },
  },
  {
    titulo: 'Garantía otros productos',
    periodo: '3 Meses',
    descripcion: 'Garantía de importador, opera en caso de fallas de hardware',
  },
]

export default function GarantiasContent() {
  return (
    <div className="text-sm md:text-base">
      <ul className="space-y-4">
        {garantias.map((g) => (
          <li key={g.titulo} className="pb-4 border-b border-gray-300 last:border-none">
            <p className="mb-1">
              ➡️ <span className="font-semibold">{g.titulo}</span>
            </p>
            <p className="mb-1">Período de cobertura: {g.periodo}</p>
            <p className={g.link ? 'mb-1' : 'mb-0'}>{g.descripcion}</p>
            {g.link && (
              <p className="mt-2 text-sm">
                <em>
                  +info:{' '}
                  <a
                    href={g.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Más información sobre ${g.titulo}`}
                    className="text-orange-500 underline"
                  >
                    {g.link.texto}
                  </a>
                </em>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
