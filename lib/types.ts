export interface Reporte {
  id: string; tipo: string; urgencia: 'critico' | 'alto' | 'medio'
  nombre: string; contacto: string; ubicacion: string
  personas?: number; mensaje?: string; timestamp: { seconds: number }
}
export interface CheckSeguro {
  id: string; nombre: string; ubicacion?: string
  mensaje?: string; timestamp: { seconds: number }
}
export interface Desaparecido {
  id: string; nombre: string; edad?: number; descripcion?: string
  ultimaUbicacion?: string; contactoReportante: string
  status: 'buscado' | 'encontrado'; timestamp: { seconds: number }
}
export interface Refugio {
  id: string; nombre: string; direccion: string
  capacidadTotal: number; ocupacionActual: number
  servicios?: string[]; contacto?: string; activo: boolean; timestamp: { seconds: number }
}
export interface Voluntario {
  id: string; nombre: string; ubicacion: string; disponibilidad: string
  habilidades: string[]; contacto: string; timestamp: { seconds: number }
}
