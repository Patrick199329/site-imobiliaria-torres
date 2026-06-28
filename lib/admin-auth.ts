import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const COOKIE = 'torres-admin'
const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET ?? 'dev-secret')

export interface AdminPayload {
  sub: string
  email: string
  nome: string
  role: 'ADMIN' | 'CORRETOR'
}

export async function signToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(secret())
}

export async function verifyToken(token: string): Promise<AdminPayload> {
  const { payload } = await jwtVerify(token, secret())
  return payload as unknown as AdminPayload
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  const store = await cookies()
  const token = store.get(COOKIE)?.value
  if (!token) return null
  try {
    return await verifyToken(token)
  } catch {
    return null
  }
}

export { COOKIE as ADMIN_COOKIE }
