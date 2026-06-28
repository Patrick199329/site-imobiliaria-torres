import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const lancamentos = await prisma.lancamento.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      imagens: { orderBy: { ordem: 'asc' }, take: 1 },
      _count: { select: { unidades: true } },
    },
  })
  return NextResponse.json(lancamentos)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { imagens, unidades, codigo, ...data } = body

  const lancamento = await prisma.lancamento.create({
    data: {
      ...data,
      codigo: codigo || null,
      latitude: data.latitude ? Number(data.latitude) : null,
      longitude: data.longitude ? Number(data.longitude) : null,
      dataPrevistaEntrega: data.dataPrevistaEntrega ? new Date(data.dataPrevistaEntrega) : null,
      imagens: imagens?.length
        ? { create: (imagens as string[]).map((url, i) => ({ url, ordem: i, isCapa: i === 0 })) }
        : undefined,
      unidades: unidades?.length
        ? {
            create: unidades.map((u: Record<string, unknown>) => ({
              tipologia: u.tipologia,
              areaPrivativa: Number(u.areaPrivativa),
              valor: Number(u.valor),
              status: u.status ?? 'DISPONIVEL',
              bloco: u.bloco ?? null,
              andar: u.andar ? Number(u.andar) : null,
            })),
          }
        : undefined,
    },
  })

  return NextResponse.json(lancamento, { status: 201 })
}
