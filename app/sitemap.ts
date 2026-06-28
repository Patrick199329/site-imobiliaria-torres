import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [imoveis, lancamentos, posts] = await Promise.all([
    prisma.imovel.findMany({
      where: { status: { not: 'VENDIDO' } },
      select: { slug: true, updatedAt: true },
    }),
    prisma.lancamento.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.post.findMany({ select: { slug: true, updatedAt: true } }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/comprar`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    {
      url: `${BASE}/lancamentos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    { url: `${BASE}/vender`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/equipe`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    {
      url: `${BASE}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const imovelRoutes: MetadataRoute.Sitemap = imoveis.map((i) => ({
    url: `${BASE}/comprar/${i.slug}`,
    lastModified: i.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const lancamentoRoutes: MetadataRoute.Sitemap = lancamentos.map((l) => ({
    url: `${BASE}/lancamentos/${l.slug}`,
    lastModified: l.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...imovelRoutes, ...lancamentoRoutes, ...postRoutes]
}
