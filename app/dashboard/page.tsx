import { redirect } from 'next/navigation'
import { createAdminClient } from '../../lib/supabase-admin'
import { getCurrentUser } from '../../lib/auth'
import Logout from './logout'
import ThemeToggle from '../../components/theme-toggle'
import MaterialBrowser from '../../components/material-browser'

export default async function Dashboard() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const supabase = createAdminClient()
  const { data: files } = await supabase
    .from('materials')
    .select('id,title,subject,file_name,file_type,file_size,created_at')
    .order('created_at', { ascending: false })

  const materials = files ?? []
  const subjects = [...new Set(materials.map((file: any) => file.subject).filter(Boolean))].sort()

  return <main className="shell">
    <header className="topbar">
      <div>
        <div className="brand"><span className="brand-mark">📚</span> Materi Kelas</div>
        <div className="muted user-line">Halo, {user.name} · NIM {user.nim}</div>
      </div>
      <div className="actions"><ThemeToggle />{user.role === 'admin' && <a className="button secondary" href="/admin">Kelola materi</a>}<Logout /></div>
    </header>

    <section className="hero">
      <div className="hero-copy"><span className="eyebrow">✦ PRIVATE CLASSROOM</span><h1>Semua materi,<br/>satu tempat.</h1><p className="muted">Semangat ya belajarnya guysss.</p></div>
      <div className="stat"><strong>{materials.length}</strong><span>materi tersedia</span></div>
    </section>

    <div className="toolbar"><div className="section-label">Temukan materi</div></div>
    <MaterialBrowser materials={materials as any} subjects={subjects} />
  </main>
}
