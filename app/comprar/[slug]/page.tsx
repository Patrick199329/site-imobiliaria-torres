import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ImageGallery } from '@/components/imovel/ImageGallery'
import { LeadForm } from '@/components/imovel/LeadForm'
import { PropertyMap } from '@/components/imovel/PropertyMapDynamic'
import { RelatedProperties } from '@/components/imovel/RelatedProperties'
import { Badge } from '@/components/ui'
import { prisma } from '@/lib/prisma'
import { getConfig } from '@/lib/config'
import { formatCurrency, formatArea } from '@/lib/format'

const TIPO_LABEL: Record<string, string> = {
  APARTAMENTO: 'Apartamento',
  CASA: 'Casa',
  TERRENO: 'Terreno',
  COMERCIAL: 'Comercial',
}

async function getImovel(slug: string) {
  return prisma.imovel.findUnique({
    where: { slug },
    include: {
      imagens: { orderBy: { ordem: 'asc' } },
      caracteristicas: { orderBy: { nome: 'asc' } },
      corretor: true,
    },
  })
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const imovel = await getImovel(params.slug)
  if (!imovel) return { title: 'Imóvel não encontrado' }

  const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const capa = imovel.imagens[0]?.url
  const desc = imovel.descricao.slice(0, 160)
  const title = `${imovel.titulo} — ${imovel.bairro}, ${imovel.cidade}`

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `${BASE}/comprar/${imovel.slug}`,
      siteName: 'Tôrres Imobiliária',
      type: 'website',
      images: capa
        ? [
            {
              url: capa.startsWith('http') ? capa : `${BASE}${capa}`,
              width: 1200,
              height: 630,
              alt: imovel.titulo,
            },
          ]
        : [],
    },
    twitter: { card: 'summary_large_image', title, description: desc },
  }
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-md border border-brand-cream/10 bg-brand-navy-deep px-4 py-4 text-center">
      <div className="text-brand-gold/70">{icon}</div>
      <span className="font-sans text-lg font-semibold text-brand-cream">{value}</span>
      <span className="label-caps text-brand-cream/40">{label}</span>
    </div>
  )
}

function ImovelJsonLd({ imovel }: { imovel: NonNullable<Awaited<ReturnType<typeof getImovel>>> }) {
  const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const capa = imovel.imagens[0]?.url

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: imovel.titulo,
    description: imovel.descricao,
    url: `${BASE}/comprar/${imovel.slug}`,
    image: capa ? (capa.startsWith('http') ? capa : `${BASE}${capa}`) : undefined,
    offers: {
      '@type': 'Offer',
      price: Number(imovel.preco),
      priceCurrency: 'BRL',
      availability:
        imovel.status === 'DISPONIVEL'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: imovel.cidade,
      addressRegion: imovel.uf,
      addressCountry: 'BR',
    },
    numberOfRooms: imovel.quartos ?? undefined,
    floorSize: imovel.areaUtil
      ? { '@type': 'QuantitativeValue', value: Number(imovel.areaUtil), unitCode: 'MTK' }
      : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default async function ImovelPage({ params }: { params: { slug: string } }) {
  const [imovel, googleMapsKey] = await Promise.all([
    getImovel(params.slug),
    getConfig('GOOGLE_MAPS_KEY'),
  ])
  if (!imovel) notFound()

  const specs = [
    imovel.areaUtil && {
      label: 'Área útil',
      value: formatArea(imovel.areaUtil.toString()),
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.3" />
          <path d="M3 8h14M8 3v14" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2 2" />
        </svg>
      ),
    },
    imovel.areaTotal && {
      label: 'Área total',
      value: formatArea(imovel.areaTotal.toString()),
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 17V3h14v14H3z" stroke="currentColor" strokeWidth="1.3" />
          <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2 2" />
        </svg>
      ),
    },
    imovel.quartos != null && {
      label: imovel.quartos === 1 ? 'Quarto' : 'Quartos',
      value: String(imovel.quartos),
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M2 14V9a2 2 0 012-2h12a2 2 0 012 2v5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M2 14h16M5 7V5a1 1 0 011-1h8a1 1 0 011 1v2"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    imovel.suites != null &&
      imovel.suites > 0 && {
        label: imovel.suites === 1 ? 'Suíte' : 'Suítes',
        value: String(imovel.suites),
        icon: (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M2 14V9a2 2 0 012-2h12a2 2 0 012 2v5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <circle cx="10" cy="11" r="2" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        ),
      },
    imovel.vagas != null && {
      label: imovel.vagas === 1 ? 'Vaga' : 'Vagas',
      value: String(imovel.vagas),
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="2" y="7" width="16" height="9" rx="1" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M6 7V5a4 4 0 018 0v2"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <circle cx="6.5" cy="13" r="1.5" fill="currentColor" />
          <circle cx="13.5" cy="13" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
  ].filter(Boolean) as { label: string; value: string; icon: React.ReactNode }[]

  return (
    <>
      <ImovelJsonLd imovel={imovel} />
      <Header
        mobileCenter={
          <a
            href={`https://wa.me/${imovel.corretor.whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel: ${imovel.titulo}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded border border-brand-gold/40 bg-brand-gold/10 px-3 py-1.5 font-sans text-xs font-semibold text-brand-gold transition-all hover:bg-brand-gold hover:text-brand-navy-deep"
            aria-label="Falar com o corretor pelo WhatsApp"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            Falar com corretor
          </a>
        }
      />
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
            <Link href="/comprar" className="transition-colors hover:text-brand-cream">
              Comprar
            </Link>
            <span>/</span>
            <span className="line-clamp-1 text-brand-cream/70">{imovel.titulo}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            {/* ── Coluna principal ── */}
            <div className="min-w-0">
              {/* Galeria */}
              <ImageGallery
                images={imovel.imagens.map((img) => ({ url: img.url, ordem: img.ordem }))}
                titulo={imovel.titulo}
              />

              {/* Título + badges */}
              <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="label-caps rounded border border-brand-gold/30 px-2 py-0.5 text-brand-gold">
                      {TIPO_LABEL[imovel.tipo]}
                    </span>
                    {imovel.codigo != null && (
                      <span className="rounded bg-brand-gold/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-brand-gold/80">
                        Ref. #{String(imovel.codigo).padStart(4, '0')}
                      </span>
                    )}
                    {imovel.status !== 'DISPONIVEL' && (
                      <Badge variant={imovel.status.toLowerCase() as 'reservado' | 'vendido'} />
                    )}
                  </div>
                  <h1 className="font-serif text-2xl font-semibold text-brand-cream md:text-3xl">
                    {imovel.titulo}
                  </h1>
                  <p className="mt-1 font-sans text-sm text-brand-cream/50">
                    {imovel.bairro} · {imovel.cidade}, {imovel.uf}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-serif text-3xl font-bold text-brand-gold">
                    {formatCurrency(imovel.preco.toString())}
                  </p>
                  {imovel.valorCondominio && (
                    <p className="mt-0.5 font-sans text-xs text-brand-cream/40">
                      Cond. {formatCurrency(imovel.valorCondominio.toString())}/mês
                    </p>
                  )}
                  {imovel.valorIptu && (
                    <p className="font-sans text-xs text-brand-cream/40">
                      IPTU {formatCurrency(imovel.valorIptu.toString())}/ano
                    </p>
                  )}
                </div>
              </div>

              {/* Specs */}
              {specs.length > 0 && (
                <div
                  className={`mt-6 grid gap-3 ${specs.length <= 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}
                >
                  {specs.map((s) => (
                    <Spec key={s.label} icon={s.icon} label={s.label} value={s.value} />
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="my-8 h-px bg-brand-cream/10" />

              {/* Descrição */}
              <div>
                <h2 className="mb-3 font-serif text-xl font-semibold text-brand-cream">
                  Sobre o imóvel
                </h2>
                <p className="whitespace-pre-line font-sans text-sm font-light leading-relaxed text-brand-cream/70">
                  {imovel.descricao}
                </p>
              </div>


              {/* Características */}
              {imovel.caracteristicas.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-4 font-serif text-xl font-semibold text-brand-cream">
                    Diferenciais
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {imovel.caracteristicas.map((c) => (
                      <span
                        key={c.id}
                        className="rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-1.5 font-sans text-xs text-brand-cream/70"
                      >
                        {c.nome}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Localização */}
              <div className="mt-8">
                <h2 className="mb-4 font-serif text-xl font-semibold text-brand-cream">
                  Localização
                </h2>

                {/* Endereço em texto — sempre visível */}
                <div className="mb-4 flex items-start gap-3 rounded-md border border-brand-cream/10 bg-brand-navy-deep px-4 py-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#BD8338" className="mt-0.5 flex-shrink-0" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <div>
                    <p className="font-sans text-sm text-brand-cream">
                      {imovel.bairro} — {imovel.cidade}/{imovel.uf}
                    </p>
                    <p className="mt-0.5 font-sans text-xs text-brand-cream/40">
                      Endereço completo fornecido após contato com o corretor.
                    </p>
                  </div>
                </div>

                {/* Mapa interativo — quando coordenadas disponíveis */}
                {imovel.latitude && imovel.longitude ? (
                  <>
                    <p className="mb-3 font-sans text-xs text-brand-cream/30">
                      Localização aproximada — raio de ~200 m.
                    </p>
                    <PropertyMap
                      latitude={Number(imovel.latitude)}
                      longitude={Number(imovel.longitude)}
                      titulo={imovel.titulo}
                      googleMapsKey={googleMapsKey}
                    />
                  </>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-md border border-brand-cream/8 bg-brand-navy-deep">
                    <p className="font-sans text-xs text-brand-cream/20">
                      Mapa em breve
                    </p>
                  </div>
                )}
              </div>

              {/* Imóveis similares */}
              <div className="mt-12">
                <RelatedProperties
                  currentId={imovel.id}
                  tipo={imovel.tipo}
                  cidade={imovel.cidade}
                />
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <LeadForm
                imovelId={imovel.id}
                titulo={imovel.titulo}
                corretorNome={imovel.corretor.nome}
                corretorWhatsapp={imovel.corretor.whatsapp}
              />

              {/* Info do corretor */}
              <div className="mt-4 flex items-center gap-3 rounded-md border border-brand-cream/10 bg-brand-navy-deep p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10 font-serif text-sm font-bold text-brand-gold">
                  {imovel.corretor.nome.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-sans text-sm font-semibold text-brand-cream">
                    {imovel.corretor.nome}
                  </p>
                  <p className="font-sans text-xs text-brand-cream/40">
                    CRECI {imovel.corretor.creci}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
