import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { imovelSchema } from '@/lib/schemas'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const imovel = await prisma.imovel.findUnique({
    where: { id },
    include: { imagens: { orderBy: { ordem: 'asc' } }, corretor: true },
  })
  if (!imovel) return NextResponse.json({ erro: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(imovel)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { imagens, imagensRemover, ...rest } = body

  const result = imovelSchema.safeParse(rest)
  if (!result.success) {
    return NextResponse.json(
      { erro: result.error.issues.map((e) => e.message).join(', ') },
      { status: 400 }
    )
  }
  const data = result.data

  if (imagensRemover?.length) {
    await prisma.imovelImagem.deleteMany({
      where: { id: { in: imagensRemover }, imovelId: id },
    })
  }

  if (imagens?.length) {
    const count = await prisma.imovelImagem.count({ where: { imovelId: id } })
    await prisma.imovelImagem.createMany({
      data: (imagens as string[]).map((url, i) => ({
        url,
        imovelId: id,
        ordem: count + i,
        isCapa: count === 0 && i === 0,
      })),
    })
  }

  const imovel = await prisma.imovel.update({
    where: { id },
    data,
    include: { imagens: { orderBy: { ordem: 'asc' } } },
  })

  return NextResponse.json(imovel)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.imovel.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
