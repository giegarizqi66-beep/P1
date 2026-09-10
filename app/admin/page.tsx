import { redirect } from 'next/navigation'
import { createAdminClient } from '../../lib/supabase-admin'
import { getCurrentUser } from '../../lib/auth'
import ThemeToggle from '../../components/theme-toggle'
import AdminManager from '../../components/admin-manager'

export default async function Admin() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin') redirect('/dashboard')

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('materials')
    .select('id,title,subject,file_name,file_size,created_at')
    .order('created_at', { ascending: false })

  return <main className="shell">
    <header className="topbar">
      <div><div className="brand"><span className="brand-mark">📚</span> Materi Kelas</div><div className="muted user-line">Admin · {user.name} · {user.nim}</div></div>
      <div className="actions"><ThemeToggle /><a className="button secondary" href="/dashboard">← Dashboard</a></div>
    </header>
    <section className="hero compact-hero">
      <div className="hero-copy"><span className="eyebrow">⚙ ADMIN PANEL</span><h1>Kelola materi.</h1><p className="muted">Tambah dan hapus file pembelajaran tanpa membuka akses langsung ke storage.</p></div>
    </section>
    <AdminManager materials={(data ?? []) as any} />
  </main>
}
