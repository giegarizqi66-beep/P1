'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Material = { id: string; title: string; subject: string; file_name: string; file_size: number | null }

function formatSize(size: number | null) {
  if (!size) return '—'
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export default function AdminManager({ materials }: { materials: Material[] }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function upload(e: React.FormEvent) {
    e.preventDefault()
    setMsg(''); setOk(false)
    if (!file) return setMsg('Pilih file dulu.')
    setLoading(true)
    const form = new FormData()
    form.append('title', title)
    form.append('subject', subject)
    form.append('file', file)
    const response = await fetch('/api/materials/upload', { method: 'POST', body: form })
    const result = await response.json()
    setLoading(false)
    if (!response.ok) { setMsg(result.error || 'Upload gagal.'); return }
    setOk(true); setMsg('Materi berhasil ditambahkan.'); setTitle(''); setSubject(''); setFile(null)
    const input = document.getElementById('material-file') as HTMLInputElement | null
    if (input) input.value = ''
    router.refresh()
  }

  async function remove(id: string) {
    if (!confirm('Hapus materi ini? File di storage juga akan dihapus.')) return
    setDeleting(id)
    const response = await fetch(`/api/materials/${id}`, { method: 'DELETE' })
    const result = await response.json()
    setDeleting(null)
    if (!response.ok) { setMsg(result.error || 'Gagal menghapus materi.'); setOk(false); return }
    setMsg('Materi berhasil dihapus.'); setOk(true); router.refresh()
  }

  return <>
    <div className="admin-layout">
      <section className="card admin-panel">
        <div className="section-label">Tambah materi</div>
        <h2>Upload file baru</h2>
        <p className="muted">File akan tersimpan di bucket private dan hanya bisa diunduh setelah login.</p>
        <form onSubmit={upload}>
          <label>Judul materi<input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Rangkuman Bab 3" /></label>
          <label>Mata pelajaran<input required value={subject} onChange={e => setSubject(e.target.value)} placeholder="Contoh: Matematika" /></label>
          <label>File<input id="material-file" required type="file" onChange={e => setFile(e.target.files?.[0] || null)} /></label>
          {msg && <div className={ok ? 'success' : 'error'}>{msg}</div>}
          <button disabled={loading}>{loading ? 'Mengunggah...' : 'Upload materi →'}</button>
        </form>
      </section>

      <section className="card admin-panel">
        <div className="section-label">Perpustakaan</div>
        <h2>Materi yang sudah ada</h2>
        <p className="muted">{materials.length} materi tersimpan.</p>
        <div className="admin-list">
          {materials.length === 0 ? <div className="empty compact"><div className="empty-icon">📂</div><h3>Belum ada materi</h3><p className="muted">Upload materi pertama dari panel sebelah.</p></div> : materials.map(item => <div className="admin-row" key={item.id}>
            <div className="grow"><strong>{item.title}</strong><div className="muted admin-meta">{item.subject} · {item.file_name} · {formatSize(item.file_size)}</div></div>
            <button className="danger-button" onClick={() => remove(item.id)} disabled={deleting === item.id}>{deleting === item.id ? '...' : 'Hapus'}</button>
          </div>)}
        </div>
      </section>
    </div>
  </>
}
