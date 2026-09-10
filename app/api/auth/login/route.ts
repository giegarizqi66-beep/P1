import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../lib/supabase-admin'
import { setSession } from '../../../../lib/session'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const nim = String(body?.nim ?? '').trim()

    if (!/^[0-9]{6,20}$/.test(nim)) {
      return NextResponse.json({ error: 'NIM tidak valid.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('allowed_users')
      .select('nim, name, role, active')
      .eq('nim', nim)
      .maybeSingle()

    if (error) {
  console.error('SUPABASE NIM ERROR:', error)

  return NextResponse.json(
    { error: 'Masukin NIM Yang Bener.' },
    { status: 500 }
  )
}
    if (!data || !data.active) {
      return NextResponse.json({ error: 'NIM belum terdaftar Maaf Ya' }, { status: 401 })
    }

    await setSession({
      nim: data.nim,
      name: data.name || data.nim,
      role: data.role,
    })

    return NextResponse.json({ ok: true, role: data.role })
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 })
  }
}
