import Link from 'next/link'
import Image from 'next/image'

const navColumns = [
  {
    title: 'Imóveis',
    links: [
      { href: '/comprar', label: 'Comprar imóvel' },
      { href: '/lancamentos', label: 'Lançamentos' },
      { href: '/vender', label: 'Avaliar meu imóvel' },
      { href: '/comprar?tipo=APARTAMENTO', label: 'Apartamentos' },
      { href: '/comprar?tipo=CASA', label: 'Casas' },
    ],
  },
  {
    title: 'A empresa',
    links: [
      { href: '/sobre', label: 'Quem somos' },
      { href: '/equipe', label: 'Nossa equipe' },
      { href: '/blog', label: 'Blog' },
      { href: '/contato', label: 'Contato' },
    ],
  },
  {
    title: 'Jurídico',
    links: [
      { href: '/politica-de-privacidade', label: 'Política de privacidade' },
      { href: '/termos', label: 'Termos de uso' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-brand-cream/10 bg-brand-navy-deep">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Identidade */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3" aria-label="Tôrres Imobiliária">
              <Image src="/brand/logo.png" alt="" width={60} height={60} aria-hidden="true" />
            </Link>

            <p className="max-w-xs font-sans text-sm font-light leading-relaxed text-brand-cream/50">
              Confiança que constrói futuros. Especialistas em imóveis de Itabirito e região.
            </p>

            {/* Redes sociais */}
            <div className="flex items-center gap-4">
              {[
                {
                  href: 'https://instagram.com',
                  label: 'Instagram',
                  path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                },
                {
                  href: 'https://linkedin.com',
                  label: 'LinkedIn',
                  path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded border border-brand-cream/15 text-brand-cream/40 transition-all hover:border-brand-gold hover:text-brand-gold"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Colunas de navegação */}
          {navColumns.map((col) => (
            <div key={col.title}>
              <h3 className="label-caps mb-4 text-brand-gold">{col.title}</h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm font-light text-brand-cream/50 transition-colors hover:text-brand-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Rodapé inferior */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-brand-cream/10 pt-8 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <p className="font-sans text-xs text-brand-cream/30">
              © {new Date().getFullYear()} Tôrres Imobiliária. Todos os direitos reservados.
            </p>
            <p className="font-sans text-xs text-brand-cream/20">CRECI-MG J-XXXXX</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-brand-gold/40" />
            <span className="font-sans text-xs italic text-brand-cream/20">
              Confiança que constrói futuros.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
