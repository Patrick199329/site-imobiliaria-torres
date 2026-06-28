import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { leadSchema } from '@/lib/schemas'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const result = leadSchema.safeParse(body)

  if (!result.success) {
    const mensagens = result.error.issues.map((e) => e.message).join(', ')
    return NextResponse.json({ erro: mensagens }, { status: 400 })
  }

  const { nome, email, telefone, mensagem, imovelId, tipo } = result.data

  const lead = await prisma.lead.create({
    data: {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      telefone: telefone.trim(),
      mensagem: mensagem?.trim() || null,
      imovelId: imovelId || null,
      tipo,
      origem: 'SITE',
    },
  })

  return NextResponse.json({ success: true, id: lead.id })
}
