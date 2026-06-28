import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { corretorSchema } from '@/lib/schemas'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const corretor = await prisma.corretor.findUnique({ where: { id } })
  if (!corretor) return NextResponse.json({ erro: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(corretor)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const result = corretorSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { erro: result.error.issues.map((e) => e.message).join(', ') },
      { status: 400 }
    )
  }

  const corretor = await prisma.corretor.update({ where: { id }, data: result.data })
  return NextResponse.json(corretor)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [imoveis, posts] = await Promise.all([
    prisma.imovel.count({ where: { corretorId: id } }),
    prisma.post.count({ where: { autorId: id } }),
  ])

  const bloqueios: string[] = []
  if (imoveis > 0) bloqueios.push(`${imoveis} imóvel(is)`)
  if (posts > 0) bloqueios.push(`${posts} post(s) no blog`)

  if (bloqueios.length > 0) {
    return NextResponse.json(
      {
        erro: `Não é possível excluir: este corretor possui ${bloqueios.join(' e ')} vinculado(s). Reatribua ou exclua esses registros antes.`,
      },
      { status: 409 }
    )
  }

  await prisma.corretor.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
