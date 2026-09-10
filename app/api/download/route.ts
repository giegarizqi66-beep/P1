import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '../../../lib/supabase-admin'
import { getCurrentUser } from '../../../lib/auth'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = createAdminClient()
  const { data: file } = await supabase.from('materials').select('file_path').eq('id', id).maybeSingle()
  if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data, error } = await supabase.storage.from('materials').createSignedUrl(file.file_path, 60)
  if (error || !data) return NextResponse.json({ error: error?.message || 'Failed to create signed URL' }, { status: 500 })
  return NextResponse.redirect(data.signedUrl)
}
