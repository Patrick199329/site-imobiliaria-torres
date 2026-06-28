import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Retorna apenas se a chave existe (não a expõe publicamente)
// A chave é passada server-side pela página de detalhe do imóvel
export async function GET() {
  const config = await prisma.configuracaoSistema.findUnique({
    where: { chave: 'GOOGLE_MAPS_KEY' },
  })
  return NextResponse.json({ configured: !!config?.valor })
}
