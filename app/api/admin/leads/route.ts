import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const status = searchParams.get('status')
  const origem = searchParams.get('origem')

  const leads = await prisma.lead.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(origem ? { origem: origem as never } : {}),
    },
    include: {
      imovel: { select: { titulo: true, slug: true } },
      imoveisInteresse: { select: { id: true, titulo: true, bairro: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(leads)
}

const adminLeadSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(8, 'Telefone inválido'),
  mensagem: z.string().optional(),
  tipo: z.enum(['INTERESSE_COMPRA', 'AVALIACAO_VENDA']).default('INTERESSE_COMPRA'),
  origem: z
    .enum(['SITE', 'WHATSAPP', 'PORTAL_ZAP', 'PORTAL_VIVAREAL', 'PORTAL_OLX', 'MANUAL'])
    .default('MANUAL'),
  status: z.enum(['NOVO', 'EM_ANDAMENTO', 'CONVERTIDO', 'PERDIDO']).default('NOVO'),
  imovelId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = adminLeadSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { erro: result.error.issues.map((e) => e.message).join(', ') },
      { status: 400 }
    )
  }

  const { nome, email, telefone, mensagem, tipo, origem, status, imovelId } = result.data

  const lead = await prisma.lead.create({
    data: {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      telefone: telefone.trim(),
      mensagem: mensagem?.trim() || null,
      tipo,
      origem,
      status,
      imovelId: imovelId || null,
    },
    include: { imovel: { select: { titulo: true, slug: true } } },
  })

  return NextResponse.json(lead, { status: 201 })
}
