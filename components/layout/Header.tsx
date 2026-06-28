'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { href: '/comprar', label: 'Comprar' },
  { href: '/lancamentos', label: 'Lançamentos' },
  { href: '/vender', label: 'Vender' },
  { href: '/sobre', label: 'A empresa' },
  { href: '/blog', label: 'Blog' },
]

interface HeaderProps {
  mobileCenter?: React.ReactNode
}

export function Header({ mobileCenter }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-brand-cream/10 bg-brand-navy/95 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Tôrres Imobiliária — página inicial"
        >
          <Image src="/brand/logo.png" alt="Tôrres Imobiliária" width={52} height={52} priority />
        </Link>

        {/* Slot central — apenas mobile, apenas quando fornecido */}
        {mobileCenter && (
          <div className="flex flex-1 justify-center px-3 lg:hidden">
            {mobileCenter}
          </div>
        )}

        {/* Navegação desktop */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="label-caps text-brand-cream/70 transition-colors hover:text-brand-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + menu mobile */}
        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/5531991234567"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded border border-brand-gold bg-brand-gold/10 px-4 py-2 font-sans text-xs font-medium tracking-widest text-brand-gold transition-all hover:bg-brand-gold hover:text-brand-navy-deep sm:flex"
            aria-label="Falar pelo WhatsApp"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            WhatsApp
          </a>

          {/* Botão menu mobile */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded border border-brand-cream/15 text-brand-cream/70 transition-colors hover:border-brand-gold hover:text-brand-gold lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                  d="M1 1l16 16M17 1L1 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
                <path
                  d="M0 1h18M0 6h18M0 11h18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <nav
          className="border-t border-brand-cream/10 bg-brand-navy-deep px-6 py-4 lg:hidden"
          aria-label="Menu mobile"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="label-caps block py-3 text-brand-cream/70 transition-colors hover:text-brand-gold"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-3 border-t border-brand-cream/10 pt-3">
              <a
                href="https://wa.me/5531991234567"
                target="_blank"
                rel="noopener noreferrer"
                className="label-caps block text-brand-gold"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
