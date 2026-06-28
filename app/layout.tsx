import type { Metadata } from 'next'
import { Playfair_Display, Jost } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: {
    default: 'Tôrres Imobiliária — Confiança que constrói futuros',
    template: '%s | Tôrres Imobiliária',
  },
  description:
    'Imóveis de alto padrão em Belo Horizonte e Nova Lima. Segurança em cada negócio, excelência em cada detalhe.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    siteName: 'Tôrres Imobiliária',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/brand/logo.png', width: 512, height: 512, alt: 'Tôrres Imobiliária' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@torresimobiliaria',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${jost.variable}`}>
      <body className="bg-brand-navy text-brand-cream antialiased">{children}</body>
    </html>
  )
}
