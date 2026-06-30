'use client'
import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'

const SVCS = ['Agua potable','Comida','Electricidad','Internet','Atención médica','Baños','Sillas de ruedas','Área para niños']

export default function RefugiosPage() {
  const [tab, setTab] = useState<'ver'|'registrar'>('ver')
  const [lista, setLista] = useState<any[]>([])
  const [form, setForm] = useState({ nombre: '', direccion: '', capacidadTotal: '', ocupacionActual: '', contacto: '' })
  const [svcs, setSvcs] = useState<string[]>([])
  const [status, setStatus] = useState<'idle'|'loading'|'ok'>('idle')
  useEffect(() => onSnapshot(query(collection(db,'refugios'),orderBy('timestamp','desc')),
    s => setLista(s.docs.map(d => ({ id: d.id, ...d.data() })))), [])
  const toggle = (s: string) => setSvcs(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus('loading')
    try {
      await addDoc(collection(db,'refugios'), { ...form, capacidadTotal: parseInt(form.capacidadTotal)||0, ocupacionActual: parseInt(form.ocupacionActual)||0, servicios: svcs, activo: true, timestamp: Timestamp.now() })
      setStatus('ok'); setForm({ nombre: '', direccion: '', capacidadTotal: '', ocupacionActual: '', contacto: '' }); setSvcs([])
    } catch { setStatus('idle') }
  }
  return (
    <div className="pb-28">
      <div className="px-5 pt-8 pb-6" style={{ background: 'linear-gradient(160deg,#451A03,#D97706)' }}>
        <Link href="/" className="text-white/50 text-sm mb-4 block">← Inicio</Link>
        <h1 className="text-white font-black text-3xl leading-tight">Red de<br/>Refugios 🏗️</h1>
        <p className="text-white/60 mt-2 text-sm">{lista.filter((r: any) => r.activo && r.ocupacionActual < r.capacidadTotal).length} con espacio disponible</p>
      </div>
      <div className="px-4 mt-4">
        <div className="flex gap-1 p-1 rounded-2xl mb-4" style={{ background: 'var(--border-ui)' }}>
          {(['ver','registrar'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={tab === t ? { background: 'var(--surface)', color: 'var(--text)', boxShadow: '0 1px 8px rgba(0,0,0,0.1)' } : { color: 'var(--muted)' }}>
              {t === 'ver' ? '🏠 Ver refugios' : '➕ Registrar'}
            </button>
          ))}
        </div>
        {tab === 'ver' ? (
          <div className="space-y-3">
            {lista.map((r: any) => {
              const pct = r.capacidadTotal > 0 ? Math.round((r.ocupacionActual / r.capacidadTotal) * 100) : 0
              const libre = r.capacidadTotal - r.ocupacionActual
              return (
                <div key={r.id} className="card-premium p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="font-bold" style={{ color: 'var(--text)' }}>{r.nombre}</p><p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>📍 {r.direccion}</p></div>
                    <span className={\`badge flex-shrink-0 \${libre > 0 ? 'badge-safe' : 'badge-critico'}\`}>{libre > 0 ? \`\${libre} lugares\` : 'Lleno'}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--muted)' }}><span>{r.ocupacionActual}/{r.capacidadTotal} personas</span><span>{pct}%</span></div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: \`\${Math.min(pct,100)}%\`, background: pct>=90?'#EF4444':pct>=70?'#F59E0B':'#10B981' }}/>
                    </div>
                  </div>
                  {r.servicios?.length > 0 && <div className="flex flex-wrap gap-1.5">{r.servicios.map((s: string) => <span key={s} className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--bg)', color: 'var(--muted)' }}>{s}</span>)}</div>}
                  {r.contacto && <p className="text-xs" style={{ color: 'var(--muted)' }}>📞 {r.contacto}</p>}
                </div>
              )
            })}
            {!lista.length && <div className="card-premium p-10 text-center"><p className="text-4xl mb-3">🏗️</p><p style={{ color: 'var(--muted)' }}>No hay refugios registrados aún.</p></div>}
          </div>
        ) : status === 'ok' ? (
          <div className="card-premium p-8 text-center"><p className="text-4xl mb-3">🏠</p><h2 className="text-xl font-black mb-2" style={{ color: 'var(--text)' }}>¡Refugio registrado!</h2><button className="btn-secondary mt-4" onClick={() => setStatus('idle')}>Registrar otro</button></div>
        ) : (
          <form onSubmit={submit} className="card-premium p-5 space-y-4">
            <div className="space-y-1.5"><label>Nombre *</label><input required value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej: Escuela Simón Bolívar"/></div>
            <div className="space-y-1.5"><label>Dirección *</label><input required value={form.direccion} onChange={e => setForm(p => ({ ...p, direccion: e.target.value }))} placeholder="Dirección completa"/></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><label>Capacidad *</label><input required type="number" min="1" value={form.capacidadTotal} onChange={e => setForm(p => ({ ...p, capacidadTotal: e.target.value }))} placeholder="Personas"/></div>
              <div className="space-y-1.5"><label>Ocupación actual</label><input type="number" min="0" value={form.ocupacionActual} onChange={e => setForm(p => ({ ...p, ocupacionActual: e.target.value }))} placeholder="0"/></div>
            </div>
            <div className="space-y-2"><label>Servicios disponibles</label>
              <div className="grid grid-cols-2 gap-2">{SVCS.map(s => <button key={s} type="button" onClick={() => toggle(s)} className="px-3 py-2.5 rounded-xl text-xs font-medium border-2 text-left transition-all" style={svcs.includes(s)?{background:'#EEF2FF',borderColor:'var(--blue-mid)',color:'var(--blue-mid)'}:{background:'var(--bg)',borderColor:'var(--border-ui)',color:'var(--text)'}}>{s}</button>)}</div>
            </div>
            <div className="space-y-1.5"><label>Teléfono</label><input type="tel" value={form.contacto} onChange={e => setForm(p => ({ ...p, contacto: e.target.value }))} placeholder="+58..."/></div>
            <button type="submit" disabled={status === 'loading'} className="btn-primary">{status === 'loading' ? 'Registrando...' : '🏗️ Registrar Refugio'}</button>
          </form>
        )}
      </div>
    </div>
  )
}
