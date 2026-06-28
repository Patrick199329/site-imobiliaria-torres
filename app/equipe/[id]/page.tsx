import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PropertyCard } from '@/components/home/PropertyCard'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const c = await prisma.corretor.findUnique({ where: { id: params.id } })
  if (!c) return { title: 'Corretor não encontrado' }
  return {
    title: `${c.nome} — Corretor Tôrres Imobiliária`,
    description: c.bio ?? `Conheça o perfil de ${c.nome}, corretor da Tôrres Imobiliária.`,
  }
}

export default async function CorretorPage({ params }: { params: { id: string } }) {
  const corretor = await prisma.corretor.findUnique({
    where: { id: params.id },
    include: {
      imoveis: {
        where: { status: { not: 'VENDIDO' } },
        orderBy: { createdAt: 'desc' },
        include: { imagens: { where: { isCapa: true }, take: 1 } },
      },
    },
  })
  if (!corretor) notFound()

  const waUrl = `https://wa.me/${corretor.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${corretor.nome}, vi seu perfil na Tôrres Imobiliária e gostaria de conversar.`)}`

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-navy pt-24">
        <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 font-sans text-sm text-brand-cream/40">
            <Link href="/" className="transition-colors hover:text-brand-cream">
              Início
            </Link>
            <span>/</span>
            <Link href="/equipe" className="transition-colors hover:text-brand-cream">
              Equipe
            </Link>
            <span>/</span>
            <span className="text-brand-cream/70">{corretor.nome}</span>
          </nav>

          {/* Perfil */}
          <div className="mb-12 flex flex-col items-start gap-8 sm:flex-row">
            <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-brand-gold/20">
              {corretor.foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={corretor.foto}
                  alt={corretor.nome}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-serif text-4xl font-bold text-brand-gold">
                  {corretor.nome.charAt(0)}
                </span>
              )}
            </div>

            <div className="flex-1">
              <h1 className="font-serif text-3xl font-semibold text-brand-cream">
                {corretor.nome}
              </h1>
              <p className="label-caps mt-1 text-brand-cream/40">CRECI {corretor.creci}</p>

              {corretor.bio && (
                <p className="mt-4 max-w-xl font-sans text-sm font-light leading-relaxed text-brand-cream/70">
                  {corretor.bio}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded bg-brand-gold px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-brand-navy-deep transition-opacity hover:opacity-90"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={`mailto:${corretor.email}`}
                  className="inline-flex items-center gap-2 rounded border border-brand-cream/20 px-5 py-2.5 font-sans text-xs uppercase tracking-widest text-brand-cream/70 transition-colors hover:border-brand-cream hover:text-brand-cream"
                >
                  {corretor.email}
                </a>
              </div>
            </div>
          </div>

          {/* Imóveis do corretor */}
          {corretor.imoveis.length > 0 && (
            <div>
              <h2 className="mb-6 font-serif text-2xl font-semibold text-brand-cream">
                Imóveis em carteira
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {corretor.imoveis.map((imovel) => (
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
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
