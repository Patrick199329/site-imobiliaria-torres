import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Nossa equipe',
  description:
    'Conheça os corretores da Tôrres Imobiliária — especialistas em imóveis de alto padrão em BH e Grande BH.',
}

export default async function EquipePage() {
  const corretores = await prisma.corretor.findMany({
    orderBy: { nome: 'asc' },
    include: { _count: { select: { imoveis: true } } },
  })

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-navy pt-24">
        <div className="border-b border-brand-cream/10 bg-brand-navy-deep py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="label-caps mb-2 text-brand-gold">Quem somos</p>
            <h1 className="font-serif text-3xl font-semibold text-brand-cream md:text-4xl">
              Nossa equipe
            </h1>
            <p className="mt-2 font-sans text-sm font-light text-brand-cream/50">
              Especialistas dedicados a encontrar o imóvel certo para você.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {corretores.map((c) => (
              <Link
                key={c.id}
                href={`/equipe/${c.id}`}
                className="group flex flex-col items-center rounded-md border border-brand-cream/10 bg-brand-navy-deep p-8 text-center transition-all hover:border-brand-gold/30 hover:shadow-gold-glow"
              >
                {/* Avatar */}
                <div className="mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-brand-gold/20">
                  {c.foto ? (
                    <Image
                      src={c.foto}
                      alt={c.nome}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-serif text-3xl font-bold text-brand-gold">
                      {c.nome.charAt(0)}
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-lg font-semibold text-brand-cream transition-colors group-hover:text-brand-gold-light">
                  {c.nome}
                </h2>
                <p className="label-caps mt-1 text-brand-cream/40">CRECI {c.creci}</p>

                {c.bio && (
                  <p className="mt-3 line-clamp-3 font-sans text-sm font-light leading-relaxed text-brand-cream/60">
                    {c.bio}
                  </p>
                )}

                <div className="mt-4 flex w-full items-center justify-center gap-4 border-t border-brand-cream/10 pt-4">
                  <span className="font-sans text-xs text-brand-cream/40">
                    {c._count.imoveis} {c._count.imoveis === 1 ? 'imóvel' : 'imóveis'}
                  </span>
                  <span className="h-px w-4 bg-brand-cream/20" />
                  <span className="label-caps text-brand-gold">Ver perfil →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
