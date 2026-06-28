import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function getLatestPosts() {
  return prisma.post.findMany({
    orderBy: { publicadoEm: 'desc' },
    take: 3,
    include: { autor: { select: { nome: true } } },
  })
}

export async function BlogPreview() {
  const posts = await getLatestPosts()

  if (posts.length === 0) return null

  return (
    <section className="bg-brand-navy-deep py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="label-caps text-brand-gold">Mercado imobiliário</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-brand-cream sm:text-4xl">
              Conteúdo e análises
            </h2>
          </div>
          <Link
            href="/blog"
            className="label-caps flex items-center gap-2 text-brand-gold hover:text-brand-gold-light"
          >
            Ver todos os artigos
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-md border border-brand-cream/10 bg-brand-navy shadow-navy-card transition-all duration-300 hover:border-brand-gold/30 hover:shadow-gold-glow"
            >
              {/* Imagem de capa */}
              <div className="relative aspect-video overflow-hidden bg-brand-navy-deep">
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
                      viewBox="0 0 70 74"
                      className="h-10 w-10 opacity-15"
                      fill="none"
                      aria-hidden="true"
                    >
                      <rect x="24" y="10" width="6" height="52" fill="#BD8338" rx="1" />
                      <rect x="32" y="2" width="6" height="60" fill="#BD8338" rx="1" />
                      <rect x="40" y="10" width="6" height="52" fill="#BD8338" rx="1" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-deep/60 to-transparent" />
              </div>

              {/* Conteúdo */}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center gap-2">
                  <span className="label-caps text-brand-gold/70">
                    {new Date(post.publicadoEm).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-brand-cream/20">·</span>
                  <span className="label-caps text-brand-cream/40">
                    {post.autor.nome.split(' ')[0]}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-semibold leading-snug text-brand-cream transition-colors group-hover:text-brand-gold">
                  {post.titulo}
                </h3>

                <p className="mt-auto font-sans text-xs text-brand-gold/60 transition-colors group-hover:text-brand-gold">
                  Ler artigo →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
