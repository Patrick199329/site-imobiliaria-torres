import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LancamentoCard } from '@/components/lancamentos/LancamentoCard'
import { LancamentoFilterBar } from '@/components/lancamentos/LancamentoFilterBar'
import { EmptyState } from '@/components/ui'
import { prisma } from '@/lib/prisma'
import type { FaseObra } from '@prisma/client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Lançamentos',
  description:
    'Empreendimentos novos e em construção em Belo Horizonte, Nova Lima e Grande BH. Conheça os lançamentos da Tôrres Imobiliária.',
}

const FASES_VALIDAS: FaseObra[] = ['LANCAMENTO', 'EM_CONSTRUCAO', 'PRONTO']

interface PageProps {
  searchParams: { fase?: string; cidade?: string; construtora?: string }
}

async function getLancamentos(params: PageProps['searchParams']) {
  const where: Record<string, unknown> = {}

  if (params.fase && FASES_VALIDAS.includes(params.fase as FaseObra)) {
    where.faseObra = params.fase as FaseObra
  }
  if (params.cidade) where.cidade = params.cidade
  if (params.construtora) where.construtora = params.construtora

  const lancamentos = await prisma.lancamento.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      imagens: { where: { isCapa: true }, take: 1 },
      unidades: true,
    },
  })

  return lancamentos
}

async function getFilterOptions() {
  const [cidades, construtoras] = await Promise.all([
    prisma.lancamento.findMany({ select: { cidade: true }, distinct: ['cidade'] }),
    prisma.lancamento.findMany({ select: { construtora: true }, distinct: ['construtora'] }),
  ])
  return {
    cidades: cidades.map((c) => c.cidade),
    construtoras: construtoras.map((c) => c.construtora),
  }
}

export default async function LancamentosPage({ searchParams }: PageProps) {
  const [lancamentos, { cidades, construtoras }] = await Promise.all([
    getLancamentos(searchParams),
    getFilterOptions(),
  ])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-navy pt-20">
        {/* Hero compacto */}
        <div className="border-b border-brand-cream/10 bg-brand-navy-deep py-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="label-caps mb-2 text-brand-gold">Empreendimentos</p>
            <h1 className="font-serif text-3xl font-semibold text-brand-cream md:text-4xl">
              Lançamentos
            </h1>
            <p className="mt-2 font-sans text-sm font-light text-brand-cream/50">
              Empreendimentos novos e em construção na Grande BH.
            </p>
          </div>
        </div>

        {/* Filtros */}
        <Suspense>
          <LancamentoFilterBar
            cidades={cidades}
            construtoras={construtoras}
            defaults={searchParams}
          />
        </Suspense>

        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          {/* Contagem */}
          <p className="mb-6 font-sans text-sm text-brand-cream/50">
            <span className="font-semibold text-brand-cream">{lancamentos.length}</span>{' '}
            {lancamentos.length === 1 ? 'empreendimento encontrado' : 'empreendimentos encontrados'}
          </p>

          {lancamentos.length === 0 ? (
            <EmptyState
              title="Nenhum empreendimento encontrado"
              description="Tente remover os filtros para ver todos os lançamentos disponíveis."
              action={{ label: 'Ver todos', href: '/lancamentos' }}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {lancamentos.map((l) => {
                const disponiveisPrices = l.unidades
                  .filter((u) => u.status === 'DISPONIVEL')
                  .map((u) => Number(u.valor))

                const precoMin =
                  disponiveisPrices.length > 0 ? String(Math.min(...disponiveisPrices)) : null
                const precoMax =
                  disponiveisPrices.length > 0 ? String(Math.max(...disponiveisPrices)) : null

                return (
                  <LancamentoCard
                    key={l.id}
                    slug={l.slug}
                    nome={l.nome}
                    construtora={l.construtora}
                    bairro={l.bairro}
                    cidade={l.cidade}
                    uf={l.uf}
                    faseObra={l.faseObra}
                    capaUrl={l.imagens[0]?.url}
                    precoMin={precoMin}
                    precoMax={precoMax}
                    unidadesDisponiveis={l.unidades.filter((u) => u.status === 'DISPONIVEL').length}
                  />
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
