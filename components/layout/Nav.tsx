'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/',              emoji: '🏠', label: 'Inicio' },
  { href: '/reporte',       emoji: '🆘', label: 'Necesito Ayuda' },
  { href: '/estoy-bien',    emoji: '✅', label: 'Estoy Bien' },
  { href: '/desaparecidos', emoji: '🔍', label: 'Desaparecidos' },
  { href: '/refugios',      emoji: '🏗️', label: 'Refugios' },
  { href: '/voluntarios',   emoji: '🤝', label: 'Voluntarios' },
  { href: '/mapa',          emoji: '🗺️', label: 'Mapa' },
]

export default function Nav() {
  const path = usePathname()
  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col z-50" style={{ background: 'var(--blue-deep)' }}>
        <div className="px-6 py-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(255,184,0,0.15)' }}>🇻🇪</div>
            <div>
              <p className="text-white font-black text-sm leading-tight">Venezuela</p>
              <p className="font-black text-sm leading-tight" style={{ color: 'var(--yellow)' }}>United</p>
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Red de ayuda nacional</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {LINKS.map(l => {
            const active = l.href === '/' ? path === '/' : path.startsWith(l.href)
            return (
              <Link key={l.href} href={l.href}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all"
                style={active ? { background: 'var(--yellow)', color: 'var(--blue-deep)' } : { color: 'rgba(255,255,255,0.65)' }}>
                <span className="text-xl">{l.emoji}</span>{l.label}
              </Link>
            )
          })}
        </nav>
        <div className="px-6 py-6"><p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>© 2025 Venezuela United</p></div>
      </aside>
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 py-3 px-4 rounded-3xl glass-dark">
        <div className="flex justify-around">
          {LINKS.map(l => {
            const active = l.href === '/' ? path === '/' : path.startsWith(l.href)
            return (
              <Link key={l.href} href={l.href}
                className="flex flex-col items-center gap-1 px-2 py-1 rounded-2xl transition-all"
                style={active ? { background: 'rgba(255,184,0,0.2)' } : {}}>
                <span className="text-xl leading-none">{l.emoji}</span>
                <span className="font-semibold leading-none" style={{ color: active ? 'var(--yellow)' : 'rgba(255,255,255,0.5)', fontSize: '0.6rem' }}>{l.label.split(' ')[0]}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
