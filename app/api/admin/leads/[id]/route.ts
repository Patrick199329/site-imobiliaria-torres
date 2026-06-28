import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      imovel: { select: { id: true, titulo: true, bairro: true } },
      imoveisInteresse: { select: { id: true, titulo: true, bairro: true, cidade: true } },
    },
  })
  if (!lead) return NextResponse.json({ erro: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(lead)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const { nome, email, telefone, mensagem, tipo, origem, status, imovelId, imoveisInteresse } = body

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      ...(nome !== undefined && { nome }),
      ...(email !== undefined && { email }),
      ...(telefone !== undefined && { telefone }),
      ...(mensagem !== undefined && { mensagem }),
      ...(tipo !== undefined && { tipo }),
      ...(origem !== undefined && { origem }),
      ...(status !== undefined && { status }),
      ...(imovelId !== undefined && { imovelId: imovelId || null }),
      ...(Array.isArray(imoveisInteresse) && {
        imoveisInteresse: {
          set: imoveisInteresse.map((iid: string) => ({ id: iid })),
        },
      }),
    },
    include: {
      imovel: { select: { titulo: true, slug: true } },
      imoveisInteresse: { select: { id: true, titulo: true, bairro: true, cidade: true } },
    },
  })

  return NextResponse.json(lead)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.lead.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
