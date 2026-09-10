import { cookies } from 'next/headers'
import { createSessionToken, decodeSession, SESSION_COOKIE, SESSION_MAX_AGE } from './session-core'

export async function setSession(payload: Parameters<typeof createSessionToken>[0]) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, createSessionToken(payload), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0 })
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return token ? decodeSession(token) : null
}
