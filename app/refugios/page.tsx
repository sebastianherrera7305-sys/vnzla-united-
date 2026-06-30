'use client'
import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Home, MapPin, Users, CheckCircle } from 'lucide-react'

interface Refugio {
  id: string
  nombre: string
  direccion: string
  capacidad: number
  ocupados: number
  servicios: string
  contacto: string
  createdAt: any
}

export default function RefugiosPage() {
  const [lista, setLista] = useState<Refugio[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState(false)
  const [form, setForm] = useState({ nombre: '', direccion: '', capacidad: '', ocupados: '', servicios: '', contacto: '' })

  useEffect(() => {
    const q = query(collection(db, 'refugios'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, snap => setLista(snap.docs.map(d => ({ id: d.id, ...d.data() } as Refugio))))
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addDoc(collection(db, 'refugios'), {
        ...form, capacidad: Number(form.capacidad), ocupados: Number(form.ocupados), createdAt: serverTimestamp()
      })
      setOk(true)
      setForm({ nombre: '', direccion: '', capacidad: '', ocupados: '', servicios: '', contacto: '' })
    } finally { setLoading(false) }
  }

  return (
    <div className="pb-28">
      <div className="relative overflow-hidden rounded-3xl mb-8 p-8" style={{ background: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)' }}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(251,146,60,0.2)' }}>
              <Home className="w-6 h-6 text-orange-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Refugios</h1>
              <p className="text-orange-200 text-sm">{lista.length} refugios activos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-600 font-medium">{lista.length} refugios disponibles</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm px-4 py-2">
          {showForm ? 'Ver lista' : '+ Registrar Refugio'}
        </button>
      </div>

      {showForm ? (
        <div className="card-premium p-6">
          {ok ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Refugio Registrado</h3>
              <button onClick={() => { setOk(false); setShowForm(false) }} className="btn-primary">Ver refugios</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800">Registrar Refugio</h2>
              {[
                { key: 'nombre', label: 'Nombre del refugio', type: 'text' },
                { key: 'direccion', label: 'Dirección', type: 'text' },
                { key: 'capacidad', label: 'Capacidad total', type: 'number' },
                { key: 'ocupados', label: 'Personas actuales', type: 'number' },
                { key: 'servicios', label: 'Servicios disponibles', type: 'text' },
                { key: 'contacto', label: 'Teléfono de contacto', type: 'tel' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{f.label}</label>
                  <input type={f.type} required value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-orange-400 bg-white text-slate-800" />
                </div>
              ))}
              <button type="submit" disabled={loading} className="btn-hero w-full">
                {loading ? 'Guardando...' : 'Registrar Refugio'}
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {lista.length === 0 && <p className="text-center text-slate-500 py-12">No hay refugios registrados</p>}
          {lista.map(r => {
            const pct = r.capacidad > 0 ? Math.round((r.ocupados / r.capacidad) * 100) : 0
            const libre = r.capacidad - r.ocupados
            const badgeClass = libre > 10 ? 'badge-safe' : libre > 0 ? 'badge-alerta' : 'badge-critico'
            const barColor = pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#22c55e'
            return (
              <div key={r.id} className="card-premium p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c2d12, #c2410c)' }}>
                      <Home className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{r.nombre}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{r.direccion}</p>
                    </div>
                  </div>
                  <span className={'badge flex-shrink-0 ' + badgeClass}>
                    {libre > 0 ? libre + ' libres' : 'Lleno'}
                  </span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{r.ocupados}/{r.capacidad} personas</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: Math.min(pct, 100) + '%', background: barColor }} />
                  </div>
                </div>
                <p className="text-xs text-slate-500">Servicios: {r.servicios}</p>
                <p className="text-xs text-slate-500">Contacto: {r.contacto}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
