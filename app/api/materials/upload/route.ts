import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../lib/supabase-admin'
import { getCurrentUser } from '../../../../lib/auth'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const form = await request.formData()
    const title = String(form.get('title') || '').trim()
    const subject = String(form.get('subject') || '').trim()
    const file = form.get('file')

    if (!(file instanceof File)) return NextResponse.json({ error: 'Pilih file terlebih dahulu.' }, { status: 400 })
    if (!title || !subject) return NextResponse.json({ error: 'Judul dan mata pelajaran wajib diisi.' }, { status: 400 })
    if (file.size > 50 * 1024 * 1024) return NextResponse.json({ error: 'Maksimal 50 MB per file.' }, { status: 400 })

    const supabase = createAdminClient()
    const ext = file.name.split('.').pop()?.toLowerCase() || 'file'
    const path = `${crypto.randomUUID()}.${ext}`

    const upload = await supabase.storage.from('materials').upload(path, file, {
      upsert: false,
      contentType: file.type || 'application/octet-stream',
    })
    if (upload.error) return NextResponse.json({ error: upload.error.message }, { status: 500 })

    const insert = await supabase.from('materials').insert({
      title,
      subject,
      file_name: file.name,
      file_path: path,
      file_type: ext,
      file_size: file.size,
    })

    if (insert.error) {
      await supabase.storage.from('materials').remove([path])
      return NextResponse.json({ error: insert.error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Upload gagal.' }, { status: 500 })
  }
}
