import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CHAVES_PERMITIDAS = ['GOOGLE_MAPS_KEY'] as const
type ChavePermitida = (typeof CHAVES_PERMITIDAS)[number]

export async function GET() {
  const configs = await prisma.configuracaoSistema.findMany()
  const result: Record<string, string> = {}
  for (const c of configs) {
    if ((CHAVES_PERMITIDAS as readonly string[]).includes(c.chave)) {
      result[c.chave] = c.valor
    }
  }
  return NextResponse.json(result)
}

export async function PUT(req: NextRequest) {
  const body: Partial<Record<ChavePermitida, string>> = await req.json()

  const updates = Object.entries(body).filter(([chave]) =>
    (CHAVES_PERMITIDAS as readonly string[]).includes(chave)
  )

  if (updates.length === 0) {
    return NextResponse.json({ erro: 'Nenhuma configuração válida.' }, { status: 400 })
  }

  await Promise.all(
    updates.map(([chave, valor]) =>
      prisma.configuracaoSistema.upsert({
        where: { chave },
        update: { valor: valor ?? '' },
        create: { chave, valor: valor ?? '' },
      })
    )
  )

  return NextResponse.json({ ok: true })
}
