import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const corretores = await prisma.corretor.findMany({
    orderBy: { nome: 'asc' },
    include: { _count: { select: { imoveis: true } } },
  })
  return NextResponse.json(corretores)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const corretor = await prisma.corretor.create({ data })
  return NextResponse.json(corretor, { status: 201 })
}
