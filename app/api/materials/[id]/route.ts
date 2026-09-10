import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../lib/supabase-admin'
import { getCurrentUser } from '../../../../lib/auth'

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await context.params
  const supabase = createAdminClient()
  const { data: material } = await supabase.from('materials').select('file_path').eq('id', id).maybeSingle()
  if (!material) return NextResponse.json({ error: 'Materi tidak ditemukan.' }, { status: 404 })

  const removeFile = await supabase.storage.from('materials').remove([material.file_path])
  if (removeFile.error) return NextResponse.json({ error: removeFile.error.message }, { status: 500 })

  const removeRow = await supabase.from('materials').delete().eq('id', id)
  if (removeRow.error) return NextResponse.json({ error: removeRow.error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
