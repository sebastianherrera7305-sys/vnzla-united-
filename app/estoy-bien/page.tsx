'use client'
import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, query, orderBy, limit, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'

export default function EstoyBienPage() {
  const [form, setForm] = useState({ nombre: '', ubicacion: '', mensaje: '' })
  const [status, setStatus] = useState<'idle'|'loading'|'ok'>('idle')
  const [lista, setLista] = useState<any[]>([])
  useEffect(() => onSnapshot(query(collection(db,'seguros'),orderBy('timestamp','desc'),limit(50)),
    s => setLista(s.docs.map(d => ({ id: d.id, ...d.data() })))), [])
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus('loading')
    try {
      await addDoc(collection(db,'seguros'), { ...form, timestamp: Timestamp.now() })
      setStatus('ok'); setForm({ nombre: '', ubicacion: '', mensaje: '' })
    } catch { setStatus('idle') }
  }
  return (
    <div className="pb-28">
      <div className="px-5 pt-8 pb-6" style={{ background: 'linear-gradient(160deg,#064E3B,#059669)' }}>
        <Link href="/" className="text-white/50 text-sm mb-4 block">← Inicio</Link>
        <h1 className="text-white font-black text-3xl leading-tight">Estoy<br/>Bien ✅</h1>
        <p className="text-white/60 mt-2 text-sm">Avisa a tu familia que estás a salvo.</p>
      </div>
      <div className="px-4 mt-4 space-y-4">
        {status === 'ok' ? (
          <div className="card-premium p-8 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 animate-float" style={{ background: '#D1FAE5' }}>✅</div>
            <h2 className="text-xl font-black mb-2" style={{ color: 'var(--text)' }}>¡Mensaje publicado!</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Tu familia puede verte en la lista.</p>
            <button className="btn-secondary" onClick={() => setStatus('idle')}>Publicar otro</button>
          </div>
        ) : (
          <form onSubmit={submit} className="card-premium p-5 space-y-4">
            <div className="space-y-1.5"><label>Tu nombre completo *</label>
              <input required value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Nombre y apellido"/></div>
            <div className="space-y-1.5"><label>¿Dónde estás?</label>
              <input value={form.ubicacion} onChange={e => setForm(p => ({ ...p, ubicacion: e.target.value }))} placeholder="Ciudad, refugio..."/></div>
            <div className="space-y-1.5"><label>Mensaje para tu familia</label>
              <textarea rows={3} value={form.mensaje} onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))} placeholder="Estamos bien..."/></div>
            <button type="submit" disabled={status === 'loading'} className="btn-primary"
              style={{ background: '#059669', boxShadow: '0 4px 20px rgba(5,150,105,0.3)' }}>
              {status === 'loading' ? 'Publicando...' : '✅ Estoy Bien — Publicar'}
            </button>
          </form>
        )}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Están a salvo</p>
            <span className="badge badge-safe">{lista.length} personas</span>
          </div>
          {lista.map((item: any) => (
            <div key={item.id} className="card-premium p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#D1FAE5' }}>✅</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{item.nombre}</p>
                {item.ubicacion && <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>📍 {item.ubicacion}</p>}
                {item.mensaje && <p className="text-sm mt-1" style={{ color: 'var(--text)' }}>"{item.mensaje}"</p>}
              </div>
            </div>
          ))}
          {!lista.length && <div className="card-premium p-8 text-center"><p className="text-3xl mb-2">🌟</p><p className="text-sm" style={{ color: 'var(--muted)' }}>Sé el primero en publicar</p></div>}
        </div>
      </div>
    </div>
  )
}
