import { createAdminClient } from './supabase-admin'
import { getSession } from './session'

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('allowed_users')
    .select('nim, name, role, active')
    .eq('nim', session.nim)
    .maybeSingle()

  if (error || !data || !data.active) return null

  return {
    nim: data.nim as string,
    name: (data.name || session.name || data.nim) as string,
    role: data.role as 'student' | 'admin',
  }
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) throw new Error('UNAUTHORIZED')
  return user
}

export async function requireAdmin() {
  const user = await requireUser()
  if (user.role !== 'admin') throw new Error('FORBIDDEN')
  return user
}
