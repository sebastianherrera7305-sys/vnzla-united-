'use client'
import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'

const SKILLS = [
  {e:'🏥',l:'Médico/Enfermero'},{e:'🧠',l:'Psicólogo'},{e:'🚑',l:'Paramédico'},{e:'⚡',l:'Electricista'},
  {e:'🔧',l:'Mecánico/Técnico'},{e:'🏗️',l:'Constructor'},{e:'🚗',l:'Conductor'},{e:'🍳',l:'Cocina'},
  {e:'📦',l:'Logística'},{e:'📡',l:'Comunicaciones'},{e:'🔍',l:'Búsqueda y rescate'},{e:'🩹',l:'Primeros auxilios'},
  {e:'👶',l:'Cuidado infantil'},{e:'🔒',l:'Seguridad'},
]

export default function VoluntariosPage() {
  const [tab, setTab] = useState<'ver'|'registrar'>('ver')
  const [lista, setLista] = useState<any[]>([])
  const [form, setForm] = useState({ nombre: '', ubicacion: '', disponibilidad: '', contacto: '' })
  const [skills, setSkills] = useState<string[]>([])
  const [filtro, setFiltro] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'ok'>('idle')
  useEffect(() => onSnapshot(query(collection(db,'voluntarios'),orderBy('timestamp','desc')),
    s => setLista(s.docs.map(d => ({ id: d.id, ...d.data() })))), [])
  const toggle = (l: string) => setSkills(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l])
  const filtrados = lista.filter((v: any) => !filtro ||
    v.habilidades?.some((h: string) => h.toLowerCase().includes(filtro.toLowerCase())) ||
    v.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
    v.ubicacion?.toLowerCase().includes(filtro.toLowerCase()))
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!skills.length) return; setStatus('loading')
    try {
      await addDoc(collection(db,'voluntarios'), { ...form, habilidades: skills, timestamp: Timestamp.now() })
      setStatus('ok'); setForm({ nombre: '', ubicacion: '', disponibilidad: '', contacto: '' }); setSkills([])
    } catch { setStatus('idle') }
  }
  return (
    <div className="pb-28">
      <div className="px-5 pt-8 pb-6" style={{ background: 'linear-gradient(160deg,#2E1065,#7C3AED)' }}>
        <Link href="/" className="text-white/50 text-sm mb-4 block">← Inicio</Link>
        <h1 className="text-white font-black text-3xl leading-tight">Red de<br/>Voluntarios 🤝</h1>
        <p className="text-white/60 mt-2 text-sm">{lista.length} voluntarios listos para ayudar</p>
      </div>
      <div className="px-4 mt-4">
        <div className="flex gap-1 p-1 rounded-2xl mb-4" style={{ background: 'var(--border-ui)' }}>
          {(['ver','registrar'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={tab === t ? { background: 'var(--surface)', color: 'var(--text)', boxShadow: '0 1px 8px rgba(0,0,0,0.1)' } : { color: 'var(--muted)' }}>
              {t === 'ver' ? '👥 Ver voluntarios' : '🙋 Quiero ayudar'}
            </button>
          ))}
        </div>
        {tab === 'ver' ? (
          <div className="space-y-3">
            <input value={filtro} onChange={e => setFiltro(e.target.value)} placeholder="Buscar por habilidad, nombre o ciudad..."/>
            {filtrados.map((v: any) => (
              <div key={v.id} className="card-premium p-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: '#EDE9FE' }}>🤝</div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{v.nombre}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>📍 {v.ubicacion} · {v.disponibilidad}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">{v.habilidades?.map((h: string) => <span key={h} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#EDE9FE', color: '#7C3AED' }}>{h}</span>)}</div>
                    <p className="text-xs mt-1.5" style={{ color: 'var(--muted)' }}>📞 {v.contacto}</p>
                  </div>
                </div>
              </div>
            ))}
            {!filtrados.length && <div className="card-premium p-10 text-center"><p className="text-4xl mb-3">🤝</p><p style={{ color: 'var(--muted)' }}>{filtro ? 'Sin resultados' : 'Sé el primer voluntario registrado'}</p></div>}
          </div>
        ) : status === 'ok' ? (
          <div className="card-premium p-8 text-center">
            <p className="text-4xl mb-3 animate-float">🙌</p>
            <h2 className="text-xl font-black mb-2" style={{ color: 'var(--text)' }}>¡Gracias por ofrecerte!</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Un coordinador puede contactarte pronto.</p>
            <button className="btn-secondary" onClick={() => setStatus('idle')}>Registrar otro</button>
          </div>
        ) : (
          <form onSubmit={submit} className="card-premium p-5 space-y-4">
            <div className="space-y-1.5"><label>Nombre completo *</label><input required value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Tu nombre y apellido"/></div>
            <div className="space-y-1.5"><label>¿Dónde estás? *</label><input required value={form.ubicacion} onChange={e => setForm(p => ({ ...p, ubicacion: e.target.value }))} placeholder="Ciudad, sector"/></div>
            <div className="space-y-1.5"><label>Disponibilidad *</label>
              <select required value={form.disponibilidad} onChange={e => setForm(p => ({ ...p, disponibilidad: e.target.value }))}>
                <option value="">Selecciona...</option>
                <option value="Inmediata">Inmediata — puedo ir ahora</option>
                <option value="Esta semana">Esta semana</option>
                <option value="Fines de semana">Fines de semana</option>
                <option value="Solo remoto">Solo remoto / virtual</option>
              </select>
            </div>
            <div className="space-y-2"><label>Tus habilidades *</label>
              <div className="grid grid-cols-2 gap-2">{SKILLS.map(s => <button key={s.l} type="button" onClick={() => toggle(s.l)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs font-medium text-left transition-all" style={skills.includes(s.l)?{background:'#EDE9FE',borderColor:'#7C3AED',color:'#7C3AED'}:{background:'var(--bg)',borderColor:'var(--border-ui)',color:'var(--text)'}}><span>{s.e}</span>{s.l}</button>)}</div>
            </div>
            <div className="space-y-1.5"><label>Teléfono *</label><input required type="tel" value={form.contacto} onChange={e => setForm(p => ({ ...p, contacto: e.target.value }))} placeholder="+58..."/></div>
            <button type="submit" disabled={status === 'loading' || !skills.length} className="btn-primary" style={{ background: '#7C3AED', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}>
              {status === 'loading' ? 'Registrando...' : '🤝 Registrarme como Voluntario'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
