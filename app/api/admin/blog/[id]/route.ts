import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { postSchema } from '@/lib/schemas'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) return NextResponse.json({ erro: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const result = postSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { erro: result.error.issues.map((e) => e.message).join(', ') },
      { status: 400 }
    )
  }

  const post = await prisma.post.update({ where: { id }, data: result.data })
  return NextResponse.json(post)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.post.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
