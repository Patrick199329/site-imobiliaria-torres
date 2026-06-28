import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ImageGallery } from '@/components/imovel/ImageGallery'
import { PropertyMap } from '@/components/imovel/PropertyMapDynamic'
import { FaseObraTimeline } from '@/components/lancamentos/FaseObraTimeline'
import { UnidadesTable } from '@/components/lancamentos/UnidadesTable'
import { LancamentoLeadForm } from '@/components/lancamentos/LancamentoLeadForm'
import { Badge } from '@/components/ui'
import { prisma } from '@/lib/prisma'
import type { BadgeVariant } from '@/components/ui'

const FASE_BADGE: Record<string, BadgeVariant> = {
  LANCAMENTO: 'lancamento',
  EM_CONSTRUCAO: 'construcao',
  PRONTO: 'pronto',
}

const FASE_LABEL: Record<string, string> = {
  LANCAMENTO: 'Lançamento',
  EM_CONSTRUCAO: 'Em construção',
  PRONTO: 'Pronto para morar',
}

async function getLancamento(slug: string) {
  return prisma.lancamento.findUnique({
    where: { slug },
    include: {
      imagens: { orderBy: { ordem: 'asc' } },
      unidades: { orderBy: [{ tipologia: 'asc' }, { andar: 'asc' }] },
    },
  })
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const l = await getLancamento(params.slug)
  if (!l) return { title: 'Empreendimento não encontrado' }

  const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const capa = l.imagens[0]?.url
  const title = `${l.nome} — ${l.bairro}, ${l.cidade}`
  const desc = l.descricao.slice(0, 160)

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `${BASE}/lancamentos/${l.slug}`,
      siteName: 'Tôrres Imobiliária',
      type: 'website',
      images: capa
        ? [
            {
              url: capa.startsWith('http') ? capa : `${BASE}${capa}`,
              width: 1200,
              height: 630,
              alt: l.nome,
            },
          ]
        : [],
    },
    twitter: { card: 'summary_large_image', title, description: desc },
  }
}

export default async function LancamentoPage({ params }: { params: { slug: string } }) {
  const lancamento = await getLancamento(params.slug)
  if (!lancamento) notFound()

  const disponiveisPrices = lancamento.unidades
    .filter((u) => u.status === 'DISPONIVEL')
    .map((u) => Number(u.valor))
  const precoMin = disponiveisPrices.length > 0 ? Math.min(...disponiveisPrices) : null
  const totalDisp = lancamento.unidades.filter((u) => u.status === 'DISPONIVEL').length
  const totalUnid = lancamento.unidades.length

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-navy pt-24">
        <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
          {/* Breadcrumb */}
          <nav
            className="mb-6 flex items-center gap-2 font-sans text-sm text-brand-cream/40"
            aria-label="Navegação"
          >
            <Link href="/" className="transition-colors hover:text-brand-cream">
              Início
            </Link>
            <span>/</span>
            <Link href="/lancamentos" className="transition-colors hover:text-brand-cream">
              Lançamentos
            </Link>
            <span>/</span>
            <span className="line-clamp-1 text-brand-cream/70">{lancamento.nome}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            {/* ── Coluna principal ── */}
            <div className="min-w-0">
              {/* Galeria */}
              <ImageGallery
                images={lancamento.imagens.map((img) => ({ url: img.url, ordem: img.ordem }))}
                titulo={lancamento.nome}
              />

              {/* Cabeçalho */}
              <div className="mt-6">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant={FASE_BADGE[lancamento.faseObra] ?? 'neutral'} dot>
                    {FASE_LABEL[lancamento.faseObra]}
                  </Badge>
                  {totalDisp > 0 && (
                    <span className="label-caps rounded border border-brand-cream/15 px-2 py-0.5 text-brand-cream/50">
                      {totalDisp} de {totalUnid} disponíveis
                    </span>
                  )}
                </div>

                <h1 className="font-serif text-2xl font-semibold text-brand-cream md:text-3xl">
                  {lancamento.nome}
                </h1>
                <p className="mt-1 font-sans text-sm text-brand-cream/50">
                  {lancamento.construtora} · {lancamento.bairro}, {lancamento.cidade} —{' '}
                  {lancamento.uf}
                </p>

                {precoMin && (
                  <p className="mt-3 font-sans text-xs text-brand-cream/40">
                    Unidades a partir de{' '}
                    <span className="font-serif text-xl font-bold text-brand-gold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        maximumFractionDigits: 0,
                      }).format(precoMin)}
                    </span>
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="my-8 h-px bg-brand-cream/10" />

              {/* Descrição */}
              <div>
                <h2 className="mb-3 font-serif text-xl font-semibold text-brand-cream">
                  Sobre o empreendimento
                </h2>
                <p className="whitespace-pre-line font-sans text-sm font-light leading-relaxed text-brand-cream/70">
                  {lancamento.descricao}
                </p>
              </div>

              {/* Endereço */}
              <div className="mt-6 flex items-start gap-2 rounded-md border border-brand-cream/10 bg-brand-navy-deep p-4">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="mt-0.5 flex-shrink-0 text-brand-gold"
                  aria-hidden="true"
                >
                  <path
                    d="M8 1C5.8 1 4 2.8 4 5c0 3 4 9 4 9s4-6 4-9c0-2.2-1.8-4-4-4z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <circle cx="8" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                <div>
                  <p className="font-sans text-sm text-brand-cream">{lancamento.endereco}</p>
                  <p className="font-sans text-xs text-brand-cream/50">
                    {lancamento.bairro} · {lancamento.cidade}, {lancamento.uf}
                  </p>
                </div>
              </div>

              {/* Fase da obra */}
              <div className="mt-8">
                <FaseObraTimeline
                  fase={lancamento.faseObra}
                  dataPrevistaEntrega={lancamento.dataPrevistaEntrega?.toISOString() ?? null}
                />
              </div>

              {/* Unidades */}
              <div className="mt-8">
                <h2 className="mb-4 font-serif text-xl font-semibold text-brand-cream">
                  Tipologias disponíveis
                </h2>
                <UnidadesTable
                  unidades={lancamento.unidades.map((u) => ({
                    id: u.id,
                    tipologia: u.tipologia,
                    areaPrivativa: u.areaPrivativa.toString(),
                    valor: u.valor.toString(),
                    status: u.status,
                    bloco: u.bloco,
                    andar: u.andar,
                  }))}
                />
              </div>

              {/* Mapa */}
              {lancamento.latitude && lancamento.longitude && (
                <div className="mt-8">
                  <h2 className="mb-4 font-serif text-xl font-semibold text-brand-cream">
                    Localização
                  </h2>
                  <p className="mb-3 font-sans text-xs text-brand-cream/40">
                    Localização aproximada — endereço exato fornecido após contato.
                  </p>
                  <PropertyMap
                    latitude={Number(lancamento.latitude)}
                    longitude={Number(lancamento.longitude)}
                    titulo={lancamento.nome}
                  />
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <LancamentoLeadForm
                lancamentoNome={lancamento.nome}
                lancamentoSlug={lancamento.slug}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
