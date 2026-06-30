'use client'
import { useEffect, useState, useRef } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'

function useCount(target: number, duration = 1200) {
  const [val, setVal] = useState(0)
  const prev = useRef(0)
  useEffect(() => {
    const start = prev.current; const diff = target - start
    if (!diff) return
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(start + diff * eased))
      if (p < 1) requestAnimationFrame(tick)
      else prev.current = target
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return val
}

const ACTIONS = [
  { href: '/reporte',       emoji: '🆘', label: 'Pedir Ayuda',   bg: '#FEE2E2', color: '#DC2626' },
  { href: '/estoy-bien',    emoji: '✅', label: 'Estoy Bien',    bg: '#D1FAE5', color: '#059669' },
  { href: '/desaparecidos', emoji: '🔍', label: 'Desaparecidos', bg: '#DBEAFE', color: '#1540D4' },
  { href: '/refugios',      emoji: '🏗️', label: 'Refugios',      bg: '#FEF3C7', color: '#D97706' },
  { href: '/voluntarios',   emoji: '🤝', label: 'Voluntarios',   bg: '#EDE9FE', color: '#7C3AED' },
  { href: '/mapa',          emoji: '🗺️', label: 'Mapa Nacional', bg: '#E0F2FE', color: '#0891B2' },
]

export default function Home() {
  const [counts, setCounts] = useState({ reportes: 0, seguros: 0, voluntarios: 0 })
  useEffect(() => {
    const u1 = onSnapshot(collection(db, 'necesidades'), s => setCounts(p => ({ ...p, reportes: s.size })))
    const u2 = onSnapshot(collection(db, 'seguros'),    s => setCounts(p => ({ ...p, seguros: s.size })))
    const u3 = onSnapshot(collection(db, 'voluntarios'),s => setCounts(p => ({ ...p, voluntarios: s.size })))
    return () => { u1(); u2(); u3() }
  }, [])
  const r = useCount(counts.reportes); const s = useCount(counts.seguros); const v = useCount(counts.voluntarios)
  return (
    <div className="pb-32">
      <div className="relative overflow-hidden px-5 pt-12 pb-10" style={{ background: 'linear-gradient(160deg, #0B1D51 0%, #1540D4 60%, #0B3D8C 100%)' }}>
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #FFB800, transparent 70%)' }} />
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <span className="dot-live" />
          <span className="text-xs font-semibold text-white">EN VIVO — Actualizado ahora</span>
        </div>
        <h1 className="text-white font-black text-4xl leading-tight mb-2">No estás<br /><span className="text-gradient">solo.</span></h1>
        <p className="text-white/70 text-base mt-3 mb-8 max-w-xs">Venezuela United conecta a quienes necesitan ayuda con quienes pueden darla — en tiempo real.</p>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Reportes',    val: r, color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
            { label: 'A salvo',     val: s, color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
            { label: 'Voluntarios', val: v, color: '#FFB800', bg: 'rgba(255,184,0,0.15)' },
          ].map(st => (
            <div key={st.label} className="glass rounded-2xl p-3 text-center">
              <p className="text-2xl font-black" style={{ color: st.color }}>{st.val}</p>
              <p className="text-xs text-white/60 mt-0.5">{st.label}</p>
            </div>
          ))}
        </div>
        <Link href="/reporte" className="btn-hero">🆘 Necesito Ayuda Ahora</Link>
      </div>
      <div className="px-4 mt-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-4 px-1" style={{ color: 'var(--muted)' }}>¿Qué necesitas?</p>
        <div className="grid grid-cols-3 gap-3">
          {ACTIONS.map(a => (
            <Link key={a.href} href={a.href} className="action-chip">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: a.bg }}>{a.emoji}</div>
              <p className="text-xs font-semibold text-center leading-tight" style={{ color: a.color }}>{a.label}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="mx-4 mt-6 rounded-3xl p-6" style={{ background: 'linear-gradient(135deg, #0B1D51, #1540D4)' }}>
        <p className="text-white font-black text-lg mb-1">¿Emergencia activa?</p>
        <p className="text-white/60 text-sm mb-4">Reporta tu situación ahora y coordinadores te contactarán.</p>
        <Link href="/reporte" className="btn-hero" style={{ background: 'var(--yellow)' }}>Pedir Ayuda →</Link>
      </div>
      <div className="px-4 mt-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-4 px-1" style={{ color: 'var(--muted)' }}>¿Cómo funciona?</p>
        <div className="space-y-3">
          {[
            { n: '1', t: 'Reporta tu necesidad', d: 'Llena un breve formulario con tu ubicación y tipo de ayuda.' },
            { n: '2', t: 'Coordinadores lo ven',  d: 'Voluntarios y organizaciones reciben tu reporte en tiempo real.' },
            { n: '3', t: 'Recibe ayuda',          d: 'Un voluntario cercano te contacta y coordina la asistencia.' },
          ].map(step => (
            <div key={step.n} className="card-premium p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-base font-black flex-shrink-0" style={{ background: 'var(--blue-mid)', color: 'white' }}>{step.n}</div>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{step.t}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{step.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
