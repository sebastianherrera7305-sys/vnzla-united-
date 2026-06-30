import type { Metadata, Viewport } from 'next'
import './globals.css'
import Nav from '@/components/layout/Nav'

export const metadata: Metadata = {
  title: 'Venezuela United — Red de Ayuda Nacional',
  description: 'Plataforma humanitaria para conectar a venezolanos en momentos de crisis.',
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0B1D51' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="md:flex">
          <Nav />
          <main className="flex-1 md:ml-64 min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  )
}
