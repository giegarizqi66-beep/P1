import './style.css'

export const metadata = { title: 'Materi Kelas', description: 'Perpustakaan materi belajar kelas' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body>{children}</body></html>
}
