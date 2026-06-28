import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { nome, email, senha, role, ativo } = await req.json()
  const { id } = params

  if (!nome?.trim() || !email?.trim()) {
    return NextResponse.json({ erro: 'Nome e e-mail são obrigatórios.' }, { status: 400 })
  }

  if (senha && senha.length < 6) {
    return NextResponse.json({ erro: 'Senha precisa ter pelo menos 6 caracteres.' }, { status: 400 })
  }

  const existente = await prisma.usuario.findFirst({
    where: { email: email.toLowerCase().trim(), NOT: { id } },
  })
  if (existente) {
    return NextResponse.json({ erro: 'Este e-mail já está em uso.' }, { status: 409 })
  }

  // Impede remover o último ADMIN
  if (role === 'CORRETOR') {
    const atual = await prisma.usuario.findUnique({ where: { id } })
    if (atual?.role === 'ADMIN') {
      const totalAdmins = await prisma.usuario.count({ where: { role: 'ADMIN' } })
      if (totalAdmins <= 1) {
        return NextResponse.json({ erro: 'Não é possível remover o último administrador.' }, { status: 400 })
      }
    }
  }

  const updateData: Record<string, unknown> = {
    nome: nome.trim(),
    email: email.toLowerCase().trim(),
    role: role === 'ADMIN' ? 'ADMIN' : 'CORRETOR',
    ativo: ativo !== false,
  }

  if (senha) {
    updateData.senha = await bcrypt.hash(senha, 12)
  }

  const usuario = await prisma.usuario.update({
    where: { id },
    data: updateData,
    select: { id: true, nome: true, email: true, role: true, ativo: true, createdAt: true },
  })

  return NextResponse.json(usuario)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const session = await getAdminSession()

  // Impede excluir a si mesmo
  if (session?.sub === id) {
    return NextResponse.json({ erro: 'Você não pode excluir sua própria conta.' }, { status: 400 })
  }

  // Impede excluir o último ADMIN
  const alvo = await prisma.usuario.findUnique({ where: { id } })
  if (alvo?.role === 'ADMIN') {
    const totalAdmins = await prisma.usuario.count({ where: { role: 'ADMIN' } })
    if (totalAdmins <= 1) {
      return NextResponse.json({ erro: 'Não é possível excluir o último administrador.' }, { status: 400 })
    }
  }

  await prisma.usuario.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
