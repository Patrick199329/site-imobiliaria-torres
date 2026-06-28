import { Suspense } from 'react'
import { Prisma } from '@prisma/client'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FilterBar } from '@/components/comprar/FilterBar'
import { Pagination } from '@/components/comprar/Pagination'
import { MapView } from '@/components/comprar/MapViewDynamic'
import { PropertyCard } from '@/components/home/PropertyCard'
import { EmptyState } from '@/components/ui'
import { prisma } from '@/lib/prisma'
import type { ComprarParams } from '@/types/search'
import { PER_PAGE } from '@/types/search'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Comprar imóvel',
  description:
    'Encontre apartamentos, casas, terrenos e imóveis comerciais em Belo Horizonte, Nova Lima e Grande BH.',
}

async function getImoveis(params: ComprarParams) {
  const where: Prisma.ImovelWhereInput = {}

  if (params.localidade) {
    where.OR = [
      { bairro: { contains: params.localidade, mode: 'insensitive' } },
      { cidade: { contains: params.localidade, mode: 'insensitive' } },
    ]
  }

  if (params.tipo && ['APARTAMENTO', 'CASA', 'TERRENO', 'COMERCIAL'].includes(params.tipo)) {
    where.tipo = params.tipo as Prisma.EnumTipoImovelFilter['equals']
  }

  if (params.precoMin || params.precoMax) {
    where.preco = {}
    if (params.precoMin) (where.preco as Prisma.DecimalFilter).gte = Number(params.precoMin)
    if (params.precoMax) (where.preco as Prisma.DecimalFilter).lte = Number(params.precoMax)
  }

  if (params.quartos) where.quartos = { gte: Number(params.quartos) }
  if (params.vagas) where.vagas = { gte: Number(params.vagas) }
  if (params.areaMin) where.areaUtil = { gte: Number(params.areaMin) }

  const ordenarMap: Record<string, Prisma.ImovelOrderByWithRelationInput> = {
    preco_asc: { preco: 'asc' },
    preco_desc: { preco: 'desc' },
    area_desc: { areaUtil: 'desc' },
  }
  const orderBy = ordenarMap[params.ordenar ?? ''] ?? { createdAt: 'desc' }

  const page = Math.max(1, Number(params.pagina ?? 1))

  const [imoveis, total] = await Promise.all([
    prisma.imovel.findMany({
      where,
      orderBy,
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: {
        imagens: { where: { isCapa: true }, take: 1 },
      },
    }),
    prisma.imovel.count({ where }),
  ])

  return { imoveis, total, page, totalPages: Math.ceil(total / PER_PAGE) }
}

export default async function ComprarPage({ searchParams }: { searchParams: ComprarParams }) {
  const { imoveis, total, page, totalPages } = await getImoveis(searchParams)
  const isMapView = searchParams.view === 'mapa'

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-navy pt-20">
        {/* Filtros */}
        <Suspense>
          <FilterBar defaults={searchParams} />
        </Suspense>

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          {/* Contagem de resultados */}
          <div className="mb-6 flex items-center gap-2">
            <p className="font-sans text-sm text-brand-cream/50">
              <span className="font-semibold text-brand-cream">{total}</span>{' '}
              {total === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
            </p>
            {searchParams.localidade && (
              <>
                <span className="text-brand-cream/20">·</span>
                <span className="font-sans text-sm text-brand-gold">{searchParams.localidade}</span>
              </>
            )}
          </div>

          {/* Conteúdo: mapa ou grade */}
          {imoveis.length === 0 ? (
            <EmptyState
              title="Nenhum imóvel encontrado"
              description="Tente ampliar a busca — remova alguns filtros ou explore outras regiões da Grande BH."
              action={{
                label: 'Limpar filtros',
                href: '/comprar',
              }}
            />
          ) : isMapView ? (
            <MapView
              imoveis={imoveis
                .filter((i) => i.latitude && i.longitude)
                .map((i) => ({
                  id: i.id,
                  slug: i.slug,
                  titulo: i.titulo,
                  preco: i.preco.toString(),
                  bairro: i.bairro,
                  cidade: i.cidade,
                  latitude: Number(i.latitude),
                  longitude: Number(i.longitude),
                }))}
            />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {imoveis.map((imovel) => (
                  <PropertyCard
                    key={imovel.id}
                    slug={imovel.slug}
                    codigo={imovel.codigo}
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

              <Pagination currentPage={page} totalPages={totalPages} params={searchParams} />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
