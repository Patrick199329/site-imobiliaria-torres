import Link from 'next/link'
import { PropertyCard } from './PropertyCard'
import { prisma } from '@/lib/prisma'

async function getFeaturedProperties() {
  return prisma.imovel.findMany({
    where: { destaque: true, status: { not: 'VENDIDO' } },
    include: { imagens: { where: { isCapa: true }, take: 1 } },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })
}

export async function FeaturedProperties() {
  const imoveis = await getFeaturedProperties()

  return (
    <section className="bg-brand-navy py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Cabeçalho da seção */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="label-caps text-brand-gold">Seleção especial</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-brand-cream sm:text-4xl">
              Imóveis em destaque
            </h2>
          </div>
          <Link
            href="/comprar"
            className="label-caps flex items-center gap-2 text-brand-gold transition-colors hover:text-brand-gold-light"
          >
            Ver todos
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* Grid de imóveis */}
        {imoveis.length > 0 ? (
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
        ) : (
          <p className="font-sans text-sm text-brand-cream/40">
            Nenhum imóvel em destaque no momento.
          </p>
        )}
      </div>
    </section>
  )
}
