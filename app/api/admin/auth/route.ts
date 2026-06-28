import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken, ADMIN_COOKIE } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const { email, senha } = await req.json()

  if (!email || !senha) {
    return NextResponse.json({ erro: 'Credenciais inválidas' }, { status: 401 })
  }

  const usuario = await prisma.usuario.findUnique({ where: { email: email.toLowerCase().trim() } })

  if (!usuario || !usuario.ativo) {
    return NextResponse.json({ erro: 'Credenciais inválidas' }, { status: 401 })
  }

  const senhaOk = await bcrypt.compare(senha, usuario.senha)
  if (!senhaOk) {
    return NextResponse.json({ erro: 'Credenciais inválidas' }, { status: 401 })
  }

  const token = await signToken({
    sub: usuario.id,
    email: usuario.email,
    nome: usuario.nome,
    role: usuario.role,
  })

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
    path: '/',
    sameSite: 'lax',
  })

  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(ADMIN_COOKIE)
  return res
}
