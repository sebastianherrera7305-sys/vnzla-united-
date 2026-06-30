'use client'
import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'

export default function DesaparecidosPage() {
  const [tab, setTab] = useState<'buscar'|'reportar'>('buscar')
  const [q, setQ] = useState('')
  const [lista, setLista] = useState<any[]>([])
  const [form, setForm] = useState({ nombre: '', edad: '', descripcion: '', ultimaUbicacion: '', contactoReportante: '' })
  const [status, setStatus] = useState<'idle'|'loading'|'ok'>('idle')
  useEffect(() => onSnapshot(query(collection(db,'desaparecidos'),orderBy('timestamp','desc')),
    s => setLista(s.docs.map(d => ({ id: d.id, ...d.data() })))), [])
  const filtered = lista.filter((d: any) => d.status === 'buscado' && (!q ||
    d.nombre.toLowerCase().includes(q.toLowerCase()) ||
    d.ultimaUbicacion?.toLowerCase().includes(q.toLowerCase())))
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus('loading')
    try {
      await addDoc(collection(db,'desaparecidos'), { ...form, edad: parseInt(form.edad)||0, status: 'buscado', timestamp: Timestamp.now() })
      setStatus('ok'); setForm({ nombre: '', edad: '', descripcion: '', ultimaUbicacion: '', contactoReportante: '' })
    } catch { setStatus('idle') }
  }
  return (
    <div className="pb-28">
      <div className="px-5 pt-8 pb-6" style={{ background: 'linear-gradient(160deg,#1E1B4B,#1540D4)' }}>
        <Link href="/" className="text-white/50 text-sm mb-4 block">← Inicio</Link>
        <h1 className="text-white font-black text-3xl leading-tight">Personas<br/>Desaparecidas 🔍</h1>
        <p className="text-white/60 mt-2 text-sm">{lista.filter((d: any) => d.status === 'buscado').length} personas siendo buscadas</p>
      </div>
      <div className="px-4 mt-4">
        <div className="flex gap-1 p-1 rounded-2xl mb-4" style={{ background: 'var(--border-ui)' }}>
          {(['buscar','reportar'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={tab === t ? { background: 'var(--surface)', color: 'var(--text)', boxShadow: '0 1px 8px rgba(0,0,0,0.1)' } : { color: 'var(--muted)' }}>
              {t === 'buscar' ? '🔍 Buscar' : '⚠️ Reportar'}
            </button>
          ))}
        </div>
        {tab === 'buscar' ? (
          <div className="space-y-3">
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre o ubicación..."/>
            {filtered.map((p: any) => (
              <div key={p.id} className="card-premium p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: '#DBEAFE' }}>🔍</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{p.nombre}{p.edad ? \`, \${p.edad} años\` : ''}</p>
                      <span className="badge badge-alto">Buscado</span>
                    </div>
                    {p.ultimaUbicacion && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>📍 {p.ultimaUbicacion}</p>}
                    {p.descripcion && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{p.descripcion}</p>}
                    <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>📞 {p.contactoReportante}</p>
                  </div>
                </div>
              </div>
            ))}
            {!filtered.length && <div className="card-premium p-10 text-center"><p className="text-4xl mb-3">🔍</p><p style={{ color: 'var(--muted)' }}>{q ? 'Sin resultados' : 'No hay reportes activos'}</p></div>}
          </div>
        ) : status === 'ok' ? (
          <div className="card-premium p-8 text-center">
            <p className="text-4xl mb-3">📋</p>
            <h2 className="text-xl font-black mb-2" style={{ color: 'var(--text)' }}>Reporte publicado</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Los coordinadores fueron notificados.</p>
            <button className="btn-secondary" onClick={() => setStatus('idle')}>Reportar otra persona</button>
          </div>
        ) : (
          <form onSubmit={submit} className="card-premium p-5 space-y-4">
            <div className="space-y-1.5"><label>Nombre completo *</label><input required value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Nombre y apellido"/></div>
            <div className="space-y-1.5"><label>Edad aproximada</label><input type="number" min="0" max="120" value={form.edad} onChange={e => setForm(p => ({ ...p, edad: e.target.value }))} placeholder="Años"/></div>
            <div className="space-y-1.5"><label>Descripción física *</label><textarea required rows={2} value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} placeholder="Ropa, características físicas..."/></div>
            <div className="space-y-1.5"><label>Última ubicación *</label><input required value={form.ultimaUbicacion} onChange={e => setForm(p => ({ ...p, ultimaUbicacion: e.target.value }))} placeholder="Lugar específico"/></div>
            <div className="space-y-1.5"><label>Tu teléfono *</label><input required type="tel" value={form.contactoReportante} onChange={e => setForm(p => ({ ...p, contactoReportante: e.target.value }))} placeholder="+58..."/></div>
            <button type="submit" disabled={status === 'loading'} className="btn-primary">{status === 'loading' ? 'Publicando...' : 'Publicar reporte'}</button>
          </form>
        )}
      </div>
    </div>
  )
}
