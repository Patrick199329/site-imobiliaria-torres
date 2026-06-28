import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    select: { titulo: true, metaTitle: true, metaDescription: true, conteudo: true, capa: true },
  })
  if (!post) return { title: 'Post não encontrado' }

  const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const title = post.metaTitle ?? post.titulo
  const desc = post.metaDescription ?? post.conteudo.slice(0, 160)

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `${BASE}/blog/${params.slug}`,
      siteName: 'Tôrres Imobiliária',
      type: 'article',
      images: post.capa
        ? [
            {
              url: post.capa.startsWith('http') ? post.capa : `${BASE}${post.capa}`,
              width: 1200,
              height: 630,
              alt: post.titulo,
            },
          ]
        : [],
    },
    twitter: { card: 'summary_large_image', title, description: desc },
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { autor: true },
  })
  if (!post) notFound()

  const paragrafos = post.conteudo.split('\n\n').filter(Boolean)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-navy pt-24">
        <div className="mx-auto max-w-3xl px-6 pb-20 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 font-sans text-sm text-brand-cream/40">
            <Link href="/" className="transition-colors hover:text-brand-cream">
              Início
            </Link>
            <span>/</span>
            <Link href="/blog" className="transition-colors hover:text-brand-cream">
              Blog
            </Link>
            <span>/</span>
            <span className="line-clamp-1 text-brand-cream/70">{post.titulo}</span>
          </nav>

          {/* Cabeçalho */}
          <header className="mb-8">
            <div className="mb-4 flex items-center gap-3 font-sans text-sm text-brand-cream/40">
              <span>
                {new Date(post.publicadoEm).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span>·</span>
              <Link
                href={`/equipe/${post.autorId}`}
                className="transition-colors hover:text-brand-cream"
              >
                {post.autor.nome}
              </Link>
            </div>

            <h1 className="font-serif text-3xl font-semibold leading-snug text-brand-cream md:text-4xl">
              {post.titulo}
            </h1>
          </header>

          {/* Capa */}
          {post.capa && (
            <div className="relative mb-8 aspect-video overflow-hidden rounded-md border border-brand-cream/10">
              <Image
                src={post.capa}
                alt={post.titulo}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          {/* Conteúdo */}
          <article className="prose-brand space-y-4">
            {paragrafos.map((p, i) => (
              <p
                key={i}
                className="font-sans text-sm font-light leading-relaxed text-brand-cream/75"
              >
                {p}
              </p>
            ))}
          </article>

          {/* Autor */}
          <div className="mt-12 flex items-center gap-4 border-t border-brand-cream/10 pt-8">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-brand-gold/20 bg-brand-gold/5 font-serif text-lg font-bold text-brand-gold">
              {post.autor.nome.charAt(0)}
            </div>
            <div>
              <Link
                href={`/equipe/${post.autorId}`}
                className="font-sans text-sm font-semibold text-brand-cream transition-colors hover:text-brand-gold-light"
              >
                {post.autor.nome}
              </Link>
              <p className="label-caps text-brand-cream/40">CRECI {post.autor.creci}</p>
            </div>
          </div>

          {/* Voltar */}
          <div className="mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-sans text-sm text-brand-cream/50 transition-colors hover:text-brand-cream"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M9 2L4 7l5 5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Voltar ao blog
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
