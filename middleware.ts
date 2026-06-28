import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const COOKIE = 'torres-admin'
const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET ?? 'dev-secret')

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login') return NextResponse.next()

  const token = request.cookies.get(COOKIE)?.value

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    const { payload } = await jwtVerify(token, secret())

    // Áreas restritas a ADMIN
    const adminOnly = ['/admin/usuarios', '/admin/configuracoes']
    if (adminOnly.some((p) => pathname.startsWith(p)) && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
