import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Artigos, dicas e novidades do mercado imobiliário de Belo Horizonte pela equipe Tôrres Imobiliária.',
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    orderBy: { publicadoEm: 'desc' },
    include: { autor: { select: { nome: true } } },
  })

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-navy pt-24">
        <div className="border-b border-brand-cream/10 bg-brand-navy-deep py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="label-caps mb-2 text-brand-gold">Conteúdo</p>
            <h1 className="font-serif text-3xl font-semibold text-brand-cream md:text-4xl">Blog</h1>
            <p className="mt-2 font-sans text-sm font-light text-brand-cream/50">
              Insights e análises do mercado imobiliário de BH.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          {posts.length === 0 ? (
            <p className="font-sans text-sm text-brand-cream/40">Nenhum artigo publicado ainda.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-md border border-brand-cream/10 bg-brand-navy-deep transition-all hover:border-brand-gold/30 hover:shadow-gold-glow"
                >
                  {/* Capa */}
                  <div className="aspect-video overflow-hidden bg-brand-navy">
                    {post.capa ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.capa}
                        alt={post.titulo}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 40 40"
                          fill="none"
                          aria-hidden="true"
                          className="text-brand-gold/15"
                        >
                          <path
                            d="M5 32h30M5 32V8h30v24"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M12 20h16M12 25h10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <rect
                            x="12"
                            y="12"
                            width="16"
                            height="4"
                            rx="0.5"
                            fill="currentColor"
                            opacity="0.4"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-center gap-2 font-sans text-xs text-brand-cream/40">
                      <span>
                        {new Date(post.publicadoEm).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <span>·</span>
                      <span>{post.autor.nome.split(' ')[0]}</span>
                    </div>

                    <h2 className="font-serif text-lg font-semibold leading-snug text-brand-cream transition-colors group-hover:text-brand-gold-light">
                      {post.titulo}
                    </h2>

                    <p className="line-clamp-3 font-sans text-sm font-light leading-relaxed text-brand-cream/60">
                      {post.conteudo.slice(0, 180)}…
                    </p>

                    <span className="label-caps mt-auto text-brand-gold">Ler artigo →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
