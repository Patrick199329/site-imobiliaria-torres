import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { imovelSchema } from '@/lib/schemas'
import { uniqueSlug } from '@/lib/slugify'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get('q') ?? ''

  const imoveis = await prisma.imovel.findMany({
    where: q
      ? {
          OR: [
            { titulo: { contains: q, mode: 'insensitive' } },
            { bairro: { contains: q, mode: 'insensitive' } },
            { cidade: { contains: q, mode: 'insensitive' } },
            { corretor: { nome: { contains: q, mode: 'insensitive' } } },
          ],
        }
      : undefined,
    include: { imagens: { orderBy: { ordem: 'asc' }, take: 1 }, corretor: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(imoveis)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { imagens, ...rest } = body

  const result = imovelSchema.safeParse(rest)
  if (!result.success) {
    return NextResponse.json(
      { erro: result.error.issues.map((e) => e.message).join(', ') },
      { status: 400 }
    )
  }

  const data = result.data

  const slug = await uniqueSlug(data.slug || data.titulo, async (s) => {
    const found = await prisma.imovel.findUnique({ where: { slug: s } })
    return !!found
  })

  const imovel = await prisma.imovel.create({
    data: {
      ...data,
      slug,
      imagens: imagens?.length
        ? {
            create: (imagens as string[]).map((url, i) => ({
              url,
              ordem: i,
              isCapa: i === 0,
            })),
          }
        : undefined,
    },
  })

  return NextResponse.json(imovel, { status: 201 })
}
