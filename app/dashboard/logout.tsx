'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Logout() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function logout() {
    setLoading(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return <button className="secondary" onClick={logout} disabled={loading}>{loading ? 'Keluar...' : 'Keluar'}</button>
}
