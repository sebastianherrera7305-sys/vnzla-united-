'use client'
import { useState } from 'react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'

const TIPOS = [
  { emoji: '💧', label: 'Agua' },      { emoji: '🍽️', label: 'Comida' },
  { emoji: '🏥', label: 'Médica' },    { emoji: '🏠', label: 'Refugio' },
  { emoji: '⚡', label: 'Luz' },       { emoji: '📡', label: 'Comunicación' },
  { emoji: '👶', label: 'Niños' },     { emoji: '👴', label: 'Adultos mayores' },
]
const URGENCIAS = [
  { key: 'critico', emoji: '🔴', label: 'Crítico', desc: 'Riesgo de vida inmediato' },
  { key: 'alto',    emoji: '🟠', label: 'Alto',    desc: 'Necesito ayuda hoy' },
  { key: 'medio',   emoji: '🟡', label: 'Medio',   desc: 'En los próximos días' },
]

export default function ReportePage() {
  const [step, setStep] = useState(1)
  const [tipo, setTipo] = useState('')
  const [urgencia, setUrgencia] = useState('')
  const [form, setForm] = useState({ nombre: '', contacto: '', ubicacion: '', personas: '', mensaje: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await addDoc(collection(db, 'necesidades'), { ...form, personas: parseInt(form.personas) || 1, tipo, urgencia, timestamp: Timestamp.now() })
      setStatus('ok')
    } catch { setStatus('idle') }
  }

  if (status === 'ok') return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="text-7xl mb-6 animate-float">🙏</div>
      <h2 className="text-2xl font-black mb-3" style={{ color: 'var(--text)' }}>¡Reporte recibido!</h2>
      <p className="text-base mb-8" style={{ color: 'var(--muted)' }}>Coordinadores han sido notificados. Te contactarán pronto.</p>
      <Link href="/" className="btn-secondary" style={{ width: 'auto', padding: '14px 32px' }}>← Volver al inicio</Link>
    </div>
  )

  return (
    <div className="pb-28">
      <div className="px-5 pt-8 pb-6" style={{ background: 'linear-gradient(160deg, #7F1D1D, #DC2626)' }}>
        <Link href="/" className="text-white/50 text-sm mb-4 block">← Inicio</Link>
        <h1 className="text-white font-black text-3xl leading-tight">Pedir<br />Ayuda 🆘</h1>
        <div className="flex items-center gap-2 mt-4">
          {[1, 2].map(n => (
            <div key={n} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                style={step >= n ? { background: 'var(--yellow)', color: 'var(--blue-deep)' } : { background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)' }}>{n}</div>
              {n < 2 && <div className="w-8 h-0.5" style={{ background: step > n ? 'var(--yellow)' : 'rgba(255,255,255,0.2)' }} />}
            </div>
          ))}
          <p className="text-white/60 text-xs ml-2">Paso {step} de 2</p>
        </div>
      </div>
      <div className="px-4 mt-4">
        {step === 1 ? (
          <div className="space-y-4">
            <div className="card-premium p-5">
              <p className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>¿Qué necesitas? *</p>
              <div className="grid grid-cols-4 gap-2">
                {TIPOS.map(t => (
                  <button key={t.label} type="button" onClick={() => setTipo(t.label)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all"
                    style={tipo === t.label ? { background: '#FEE2E2', borderColor: '#DC2626' } : { background: 'var(--bg)', borderColor: 'var(--border-ui)' }}>
                    <span className="text-2xl">{t.emoji}</span>
                    <span className="text-xs font-medium text-center leading-tight">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="card-premium p-5">
              <p className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Nivel de urgencia *</p>
              <div className="space-y-2">
                {URGENCIAS.map(u => (
                  <button key={u.key} type="button" onClick={() => setUrgencia(u.key)}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left"
                    style={urgencia === u.key ? { background: '#FEE2E2', borderColor: '#DC2626' } : { background: 'var(--bg)', borderColor: 'var(--border-ui)' }}>
                    <span className="text-2xl">{u.emoji}</span>
                    <div>
                      <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{u.label}</p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>{u.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setStep(2)} disabled={!tipo || !urgencia} className="btn-primary"
              style={tipo && urgencia ? { background: '#DC2626', boxShadow: '0 4px 20px rgba(220,38,38,0.3)' } : {}}>
              Continuar →
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="card-premium p-5 space-y-4">
            <div className="space-y-1.5"><label>Nombre completo *</label>
              <input required value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Tu nombre" /></div>
            <div className="space-y-1.5"><label>Contacto (tel/WhatsApp) *</label>
              <input required type="tel" value={form.contacto} onChange={e => setForm(p => ({ ...p, contacto: e.target.value }))} placeholder="+58..." /></div>
            <div className="space-y-1.5"><label>¿Dónde estás? *</label>
              <input required value={form.ubicacion} onChange={e => setForm(p => ({ ...p, ubicacion: e.target.value }))} placeholder="Ciudad, sector, referencia" /></div>
            <div className="space-y-1.5"><label>Número de personas</label>
              <input type="number" min="1" value={form.personas} onChange={e => setForm(p => ({ ...p, personas: e.target.value }))} placeholder="1" /></div>
            <div className="space-y-1.5"><label>Mensaje adicional</label>
              <textarea rows={3} value={form.mensaje} onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))} placeholder="Describe tu situación..." /></div>
            <button type="submit" disabled={status === 'loading'} className="btn-primary"
              style={{ background: '#DC2626', boxShadow: '0 4px 20px rgba(220,38,38,0.3)' }}>
              {status === 'loading' ? 'Enviando...' : '🆘 Enviar Reporte'}
            </button>
            <button type="button" onClick={() => setStep(1)} className="btn-secondary">← Volver</button>
          </form>
        )}
      </div>
    </div>
  )
}
