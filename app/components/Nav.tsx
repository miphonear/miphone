'use client'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { ScrollText, CreditCard, HelpCircle } from 'lucide-react'
import Dialog from '@ui/Dialog'
import GarantiasContent from './GarantiasContent'
import PagosContent from './PagosContent'
import FAQContent from './FAQContent'
import Imagotipo from '@/public/images/imagotipo-miphone.svg'
import Isotipo from '@/public/images/isotipo-miphone.svg'

// --- CONSTANTES ---
const TABS = [
  {
    id: 'garantias' as const,
    label: 'Garantías',
    icon: ScrollText,
    component: GarantiasContent,
  },
  {
    id: 'pagos' as const,
    label: { mobile: 'Pagos', desktop: 'Medios de pago' },
    icon: CreditCard,
    component: PagosContent,
  },
  {
    id: 'faq' as const,
    label: { mobile: 'Links', desktop: 'Links útiles' },
    icon: HelpCircle,
    component: FAQContent,
  },
] as const

type TabId = (typeof TABS)[number]['id']

// --- ESTILOS ---
const styles = {
  nav: 'w-full bg-white shadow-sm sticky top-0 z-50',
  container: 'container mx-auto px-4 py-2',
  mobileContainer: 'flex items-center justify-between md:hidden',
  desktopContainer: 'hidden md:grid grid-cols-[1fr_auto_1fr] items-center',
  logoLink: 'block group',
  logoTransition: 'transition-transform duration-200 group-hover:scale-105',
  faqButton: `inline-flex items-center justify-center gap-2 px-3.5 py-2.5 
             text-base font-semibold text-white bg-orange-500 rounded-full 
             transition-all duration-200 hover:bg-orange-600 hover:scale-105
             focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:ring-offset-2`,
  tabsContainer: 'flex gap-4 border-b border-gray-200 mb-4',
  tabButton: 'flex items-center gap-2 pb-2 text-base font-medium transition-colors duration-150',
  tabActive: 'text-orange-600 border-b-2 border-orange-600',
  tabInactive: 'text-gray-600 hover:text-gray-800 focus:text-gray-800',
} as const

// --- COMPONENTE FAQ BUTTON ---
interface FAQButtonProps {
  onClick: () => void
}

function FAQButton({ onClick }: FAQButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={styles.faqButton}
      aria-label="Abrir menú de ayuda y enlaces útiles"
    >
      <HelpCircle className="w-6 h-6" aria-hidden="true" />
      <span className="hidden sm:inline">FAQ — Links</span>
      <span className="sm:hidden">FAQ</span>
    </button>
  )
}

// --- COMPONENTE TAB BUTTON ---
interface TabButtonProps {
  tab: (typeof TABS)[number]
  isActive: boolean
  onClick: () => void
}

function TabButton({ tab, isActive, onClick }: TabButtonProps) {
  const Icon = tab.icon
  const label = typeof tab.label === 'string' ? tab.label : tab.label

  return (
    <button
      onClick={onClick}
      className={`${styles.tabButton} ${isActive ? styles.tabActive : styles.tabInactive}`}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tab-panel-${tab.id}`}
      id={`tab-${tab.id}`}
    >
      <Icon className="w-4 h-4" aria-hidden="true" />
      {typeof label === 'string' ? (
        <span>{label}</span>
      ) : (
        <>
          <span className="sm:hidden">{label.mobile}</span>
          <span className="hidden sm:inline">{label.desktop}</span>
        </>
      )}
    </button>
  )
}

// --- COMPONENTE PRINCIPAL ---
export default function Nav() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('faq')

  const handleOpenModal = useCallback(() => {
    setOpen(true)
    setActiveTab('pagos') // Reset al tab por defecto al abrir
  }, [])

  const handleCloseModal = useCallback(() => {
    setOpen(false)
  }, [])

  const handleTabChange = useCallback((tabId: TabId) => {
    setActiveTab(tabId)
  }, [])

  const ActiveComponent = TABS.find((tab) => tab.id === activeTab)?.component

  return (
    <nav className={styles.nav} role="navigation" aria-label="Navegación principal">
      {/* --- MOBILE NAV --- */}
      <div className={`${styles.container} ${styles.mobileContainer}`}>
        <Link href="/" className={styles.logoLink} aria-label="Ir a la página de inicio">
          <Isotipo
            className={`w-[70px] h-auto ${styles.logoTransition}`}
            draggable={false}
            alt="miPhone"
          />
        </Link>

        <FAQButton onClick={handleOpenModal} />
      </div>

      {/* --- DESKTOP NAV --- */}
      <div className={`${styles.container} ${styles.desktopContainer}`}>
        {/* Columna izquierda vacía para balance */}
        <div />

        {/* Logo centrado */}
        <div className="flex justify-center">
          <Link href="/" className={styles.logoLink} aria-label="Ir a la página de inicio">
            <Imagotipo
              className={`w-[280px] lg:w-[340px] h-auto ${styles.logoTransition}`}
              draggable={false}
              alt="miPhone"
            />
          </Link>
        </div>

        {/* FAQ a la derecha */}
        <div className="flex justify-end">
          <FAQButton onClick={handleOpenModal} />
        </div>
      </div>

      {/* --- MODAL FAQ --- */}
      <Dialog
        open={open}
        onClose={handleCloseModal}
        title="FAQ — Links útiles"
        aria-describedby="modal-description"
      >
        <p id="modal-description" className="sr-only">
          Información sobre garantías, medios de pago y enlaces útiles
        </p>

        {/* Tabs */}
        <div className={styles.tabsContainer} role="tablist" aria-label="Categorías de información">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
            />
          ))}
        </div>

        {/* Contenido del tab activo */}
        <div
          role="tabpanel"
          id={`tab-panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="mt-2"
        >
          {ActiveComponent && <ActiveComponent />}
        </div>
      </Dialog>
    </nav>
  )
}
