import { prisma } from '@/lib/prisma'
import { PropertyCard } from '@/components/home/PropertyCard'
import type { TipoImovel } from '@prisma/client'

interface RelatedPropertiesProps {
  currentId: string
  tipo: TipoImovel
  cidade: string
}

export async function RelatedProperties({ currentId, tipo, cidade }: RelatedPropertiesProps) {
  const imoveis = await prisma.imovel.findMany({
    where: {
      id: { not: currentId },
      status: { not: 'VENDIDO' },
      OR: [{ tipo }, { cidade }],
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: { imagens: { where: { isCapa: true }, take: 1 } },
  })

  if (imoveis.length === 0) return null

  return (
    <section className="border-t border-brand-cream/10 pt-12">
      <h2 className="mb-6 font-serif text-2xl font-semibold text-brand-cream">Imóveis similares</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {imoveis.map((imovel) => (
          <PropertyCard
            key={imovel.id}
            slug={imovel.slug}
            titulo={imovel.titulo}
            preco={imovel.preco.toString()}
            areaUtil={imovel.areaUtil?.toString() ?? null}
            quartos={imovel.quartos}
            vagas={imovel.vagas}
            bairro={imovel.bairro}
            cidade={imovel.cidade}
            uf={imovel.uf}
            status={imovel.status}
            tipo={imovel.tipo}
            capaUrl={imovel.imagens[0]?.url}
          />
        ))}
      </div>
    </section>
  )
}
