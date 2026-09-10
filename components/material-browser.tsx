'use client'

import { useMemo, useState } from 'react'

type Material = {
  id: string
  title: string
  subject: string
  file_name: string
  file_type: string | null
  file_size: number | null
  created_at: string
}

function formatSize(size: number | null) {
  if (!size) return 'Ukuran tidak tersedia'
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export default function MaterialBrowser({ materials, subjects }: { materials: Material[]; subjects: string[] }) {
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('Semua')

  const filtered = useMemo(() => materials.filter(item => {
    const q = query.trim().toLowerCase()
    const matchesSearch = !q || `${item.title} ${item.file_name} ${item.subject}`.toLowerCase().includes(q)
    const matchesSubject = subject === 'Semua' || item.subject === subject
    return matchesSearch && matchesSubject
  }), [materials, query, subject])

  return (
    <>
      <div className="browser-tools">
        <div className="search-wrap">
          <span>⌕</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari judul, file, atau mata pelajaran..." aria-label="Cari materi" />
        </div>
      </div>

      <div className="chips">
        <button className={`chip ${subject === 'Semua' ? 'active' : ''}`} onClick={() => setSubject('Semua')}>Semua</button>
        {subjects.map(item => <button className={`chip ${subject === item ? 'active' : ''}`} key={item} onClick={() => setSubject(item)}>{item}</button>)}
      </div>

      <section className="grid">
        {filtered.length === 0 ? (
          <div className="card empty"><div className="empty-icon">🔎</div><h3>Tidak ada materi yang cocok</h3><p className="muted">Coba ubah kata pencarian atau pilih mata pelajaran lain.</p></div>
        ) : filtered.map(file => (
          <article className="card file" key={file.id}>
            <div className="fileicon">{(file.file_type || 'FILE').toUpperCase().slice(0, 4)}</div>
            <div className="grow">
              <h3 className="file-title">{file.title}</h3>
              <p className="muted file-meta">{file.subject} · {file.file_name} · {formatSize(file.file_size)}</p>
            </div>
            <a className="button" href={`/api/download?id=${encodeURIComponent(file.id)}`}>Download ↓</a>
          </article>
        ))}
      </section>
    </>
  )
}
