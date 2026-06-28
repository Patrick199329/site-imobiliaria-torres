import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const usuarios = await prisma.usuario.findMany({
    select: { id: true, nome: true, email: true, role: true, ativo: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(usuarios)
}

export async function POST(req: NextRequest) {
  const { nome, email, senha, role, ativo } = await req.json()

  if (!nome?.trim() || !email?.trim() || !senha) {
    return NextResponse.json({ erro: 'Nome, e-mail e senha são obrigatórios.' }, { status: 400 })
  }

  if (senha.length < 6) {
    return NextResponse.json({ erro: 'Senha precisa ter pelo menos 6 caracteres.' }, { status: 400 })
  }

  const existente = await prisma.usuario.findUnique({ where: { email: email.toLowerCase().trim() } })
  if (existente) {
    return NextResponse.json({ erro: 'Este e-mail já está em uso.' }, { status: 409 })
  }

  const hash = await bcrypt.hash(senha, 12)

  const usuario = await prisma.usuario.create({
    data: {
      nome: nome.trim(),
      email: email.toLowerCase().trim(),
      senha: hash,
      role: role === 'ADMIN' ? 'ADMIN' : 'CORRETOR',
      ativo: ativo !== false,
    },
    select: { id: true, nome: true, email: true, role: true, ativo: true, createdAt: true },
  })

  return NextResponse.json(usuario, { status: 201 })
}
