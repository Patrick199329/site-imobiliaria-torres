import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { lancamentoSchema } from '@/lib/schemas'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lancamento = await prisma.lancamento.findUnique({
    where: { id },
    include: {
      imagens: { orderBy: { ordem: 'asc' } },
      unidades: true,
    },
  })
  if (!lancamento) return NextResponse.json({ erro: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(lancamento)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const b = body as { imagens?: string[]; imagensRemover?: string[]; [key: string]: unknown }
  const imagens = b.imagens
  const imagensRemover = b.imagensRemover
  const OMIT = new Set(['imagens', 'imagensRemover', 'unidades'])
  const rest = Object.fromEntries(Object.entries(b).filter(([k]) => !OMIT.has(k)))

  const result = lancamentoSchema.safeParse(rest)
  if (!result.success) {
    return NextResponse.json(
      { erro: result.error.issues.map((e) => e.message).join(', ') },
      { status: 400 }
    )
  }
  const data = result.data

  if (imagensRemover?.length) {
    await prisma.lancamentoImagem.deleteMany({
      where: { id: { in: imagensRemover }, lancamentoId: id },
    })
  }

  if (imagens?.length) {
    const count = await prisma.lancamentoImagem.count({ where: { lancamentoId: id } })
    await prisma.lancamentoImagem.createMany({
      data: imagens.map((url, i) => ({
        url,
        lancamentoId: id,
        ordem: count + i,
        isCapa: count === 0 && i === 0,
      })),
    })
  }

  const lancamento = await prisma.lancamento.update({
    where: { id },
    data: {
      ...data,
      dataPrevistaEntrega: data.dataPrevistaEntrega ? new Date(data.dataPrevistaEntrega) : null,
    },
    include: { imagens: { orderBy: { ordem: 'asc' } }, unidades: true },
  })

  return NextResponse.json(lancamento)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.lancamento.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
