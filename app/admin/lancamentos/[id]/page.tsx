import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import LancamentoForm from '@/components/admin/LancamentoForm'

export default async function EditarLancamentoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lancamento = await prisma.lancamento.findUnique({
    where: { id },
    include: { imagens: { orderBy: { ordem: 'asc' } }, unidades: true },
  })
  if (!lancamento) notFound()

  const { imagens, unidades, ...rest } = lancamento

  return (
    <LancamentoForm
      id={id}
      inicial={Object.fromEntries(
        Object.entries(rest).map(([k, v]) => [
          k,
          v instanceof Date ? v.toISOString().split('T')[0] : v === null ? '' : String(v),
        ])
      )}
      imagensIniciais={imagens.map((i) => ({ id: i.id, url: i.url }))}
      unidadesIniciais={unidades.map((u) => ({
        id: u.id,
        tipologia: u.tipologia,
        areaPrivativa: String(u.areaPrivativa),
        valor: String(u.valor),
        status: u.status,
        bloco: u.bloco ?? '',
        andar: u.andar !== null ? String(u.andar) : '',
      }))}
    />
  )
}
