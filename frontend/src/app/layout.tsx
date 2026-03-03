import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = { title: 'EMS — Employee Management' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#fff', color: '#0a0a0a',
            border: '1px solid #e0e0e0', borderRadius: '8px',
            fontFamily: 'Inter, sans-serif', fontSize: '13px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
          success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
        }} />
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main className="grid-bg" style={{ marginLeft: '220px', flex: 1, minHeight: '100vh' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
