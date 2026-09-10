'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ThemeToggle from '../../components/theme-toggle'

export default function LoginPage() {
  const router = useRouter()
  const [nim, setNim] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nim }),
      })
      const result = await response.json()
      if (!response.ok) {
        setError(result.error || 'Login gagal.')
        setLoading(false)
        return
      }
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Tidak bisa terhubung ke server.')
      setLoading(false)
    }
  }

  return (
    <main className="center">
      <form className="card auth" onSubmit={login}>
        <div className="auth-top">
          <div className="brand"><span className="brand-mark">📚</span> Materi Kelas</div>
          <ThemeToggle />
        </div>

        <h1>Selamat datang.</h1>
        <p className="muted auth-subtitle">Masuk ke perpustakaan materi dengan NIM mahasiswa yang sudah didaftarkan admin.</p>

        <div className="domain-note">🎓 Login pake <strong>NIM</strong>. Btw angka aja I ga usah di tulis.</div>

        <label>NIM mahasiswa
          <input
            inputMode="numeric"
            pattern="[0-9]{6,20}"
            required
            value={nim}
            onChange={e => setNim(e.target.value.replace(/\D/g, ''))}
            placeholder="Contoh: 2320xxxxxxxx"
            autoComplete="username"
          />
        </label>

        {error && <div className="error">{error}</div>}
        <button disabled={loading}>{loading ? 'Memeriksa NIM...' : 'Masuk →'}</button>

        <p className="auth-footer">NIM belum bisa masuk? Hubungi admin G ya Btw semangat kuliahnya guyss keep strong.</p>
      </form>
    </main>
  )
}
