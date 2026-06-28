import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import CorretorForm from '@/components/admin/CorretorForm'

export default async function EditarCorretorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const corretor = await prisma.corretor.findUnique({ where: { id } })
  if (!corretor) notFound()

  return (
    <CorretorForm
      id={id}
      inicial={Object.fromEntries(
        Object.entries(corretor).map(([k, v]) => [k, v === null ? '' : String(v)])
      )}
    />
  )
}
