import { createHmac, timingSafeEqual } from 'crypto'

export const SESSION_COOKIE = 'materi_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7

type SessionPayload = {
  nim: string
  name: string
  role: 'student' | 'admin'
  exp: number
}

function getSecret() {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must be set and at least 32 characters long.')
  }
  return secret
}

function sign(value: string) {
  return createHmac('sha256', getSecret()).update(value).digest('base64url')
}

function encode(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${sign(body)}`
}

export function decodeSession(token: string): SessionPayload | null {
  const [body, signature] = token.split('.')
  if (!body || !signature) return null
  const expected = sign(body)
  try {
    if (signature.length !== expected.length) return null
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload
    if (!payload?.nim || !payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) return null
    if (payload.role !== 'student' && payload.role !== 'admin') return null
    return payload
  } catch {
    return null
  }
}

export function createSessionToken(payload: Omit<SessionPayload, 'exp'>) {
  return encode({ ...payload, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE })
}

export { SESSION_MAX_AGE }
