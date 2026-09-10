import { NextResponse, type NextRequest } from 'next/server'
import { decodeSession, SESSION_COOKIE } from './lib/session-core'

export function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const session = token ? decodeSession(token) : null
  const path = request.nextUrl.pathname

  if (!session && (path.startsWith('/dashboard') || path.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (session && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
