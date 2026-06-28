import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ role: null }, { status: 401 })
  return NextResponse.json({ role: session.role, nome: session.nome, email: session.email })
}
