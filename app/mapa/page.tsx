'use client'
import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'

interface Punto { id: string; tipo: 'reporte'|'refugio'; nombre: string; urgencia?: string; ocupacionActual?: number; capacidadTotal?: number }
const LAYERS = [{key:'todos',label:'Todo',emoji:'🗺️'},{key:'reporte',label:'Necesidades',emoji:'⚠️'},{key:'refugio',label:'Refugios',emoji:'🏠'}]

export default function MapaPage() {
  const [puntos, setPuntos] = useState<Punto[]>([])
  const [layer, setLayer] = useState('todos')
  useEffect(() => {
    const u1 = onSnapshot(collection(db,'necesidades'), s =>
      setPuntos(p => [...p.filter(x => x.tipo !== 'reporte'), ...s.docs.map(d => ({ id: d.id, tipo: 'reporte' as const, nombre: d.data().ubicacion, urgencia: d.data().urgencia }))]))
    const u2 = onSnapshot(collection(db,'refugios'), s =>
      setPuntos(p => [...p.filter(x => x.tipo !== 'refugio'), ...s.docs.map(d => ({ id: d.id, tipo: 'refugio' as const, nombre: d.data().nombre, ocupacionActual: d.data().ocupacionActual, capacidadTotal: d.data().capacidadTotal }))]))
    return () => { u1(); u2() }
  }, [])
  const visible = layer === 'todos' ? puntos : puntos.filter(p => p.tipo === layer)
  return (
    <div className="pb-28">
      <div className="px-5 pt-8 pb-6" style={{ background: 'linear-gradient(160deg,#0C4A6E,#0891B2)' }}>
        <Link href="/" className="text-white/50 text-sm mb-4 block">← Inicio</Link>
        <h1 className="text-white font-black text-3xl leading-tight">Mapa<br/>Nacional 🗺️</h1>
        <p className="text-white/60 mt-2 text-sm">{puntos.length} puntos en Venezuela</p>
      </div>
      <div className="px-4 mt-4 space-y-4">
        <div className="flex gap-2">
          {LAYERS.map(l => (
            <button key={l.key} onClick={() => setLayer(l.key)} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all"
              style={layer === l.key ? { background: 'var(--blue-mid)', borderColor: 'var(--blue-mid)', color: '#fff' } : { background: 'var(--surface)', borderColor: 'var(--border-ui)', color: 'var(--muted)' }}>
              {l.emoji} {l.label}
            </button>
          ))}
        </div>
        <div className="card-premium overflow-hidden" style={{ height: '300px' }}>
          <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg,#EEF2FF,#E0E7FF)' }}>
            <div className="text-6xl mb-4 animate-float">🗺️</div>
            <p className="font-bold text-base" style={{ color: 'var(--blue-mid)' }}>Mapa interactivo</p>
            <p className="text-xs mt-1 mb-4" style={{ color: 'var(--muted)' }}>Próximamente</p>
            <a href="https://www.google.com/maps/place/Venezuela" target="_blank" rel="noopener noreferrer"
              className="btn-primary" style={{ width: 'auto', padding: '10px 20px', fontSize: '0.875rem' }}>Abrir en Google Maps →</a>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{label:'Reportes',count:puntos.filter(p=>p.tipo==='reporte').length,bg:'#FEE2E2',color:'#DC2626',e:'⚠️'},
            {label:'Refugios',count:puntos.filter(p=>p.tipo==='refugio').length,bg:'#FEF3C7',color:'#D97706',e:'🏠'},
            {label:'Total',count:puntos.length,bg:'#EEF2FF',color:'#1540D4',e:'📍'}].map(s => (
            <div key={s.label} className="card-premium p-4 text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mx-auto mb-2" style={{ background: s.bg }}>{s.e}</div>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.count}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 px-1" style={{ color: 'var(--muted)' }}>Puntos ({visible.length})</p>
          {visible.slice(0,40).map(p => (
            <div key={p.id} className="card-premium p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: p.tipo === 'reporte' ? '#FEE2E2' : '#FEF3C7' }}>{p.tipo === 'reporte' ? '⚠️' : '🏠'}</div>
              <p className="text-sm font-medium flex-1 truncate" style={{ color: 'var(--text)' }}>{p.nombre}</p>
              {p.urgencia && <span className={\`badge badge-\${p.urgencia} flex-shrink-0\`}>{p.urgencia}</span>}
              {p.tipo === 'refugio' && p.capacidadTotal && <span className="text-xs flex-shrink-0" style={{ color: 'var(--muted)' }}>{p.ocupacionActual}/{p.capacidadTotal}</span>}
            </div>
          ))}
          {!visible.length && <div className="card-premium p-10 text-center"><p className="text-3xl mb-2">📍</p><p style={{ color: 'var(--muted)' }}>No hay puntos para mostrar</p></div>}
        </div>
      </div>
    </div>
  )
}
