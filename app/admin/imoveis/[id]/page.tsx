import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ImovelForm from '@/components/admin/ImovelForm'

export default async function EditarImovelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const imovel = await prisma.imovel.findUnique({
    where: { id },
    include: { imagens: { orderBy: { ordem: 'asc' } } },
  })

  if (!imovel) notFound()

  const { imagens, ...rest } = imovel

  return (
    <ImovelForm
      id={id}
      inicial={Object.fromEntries(
        Object.entries(rest).map(([k, v]) => [k, v === null ? '' : String(v)])
      )}
      imagensIniciais={imagens.map((img) => ({ id: img.id, url: img.url }))}
    />
  )
}
