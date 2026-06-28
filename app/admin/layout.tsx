'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const NAV = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: (
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor" />
    ),
  },
  {
    href: '/admin/imoveis',
    label: 'Imóveis',
    icon: <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />,
  },
  {
    href: '/admin/lancamentos',
    label: 'Lançamentos',
    icon: (
      <path
        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
        fill="currentColor"
      />
    ),
  },
  {
    href: '/admin/leads',
    label: 'Leads',
    icon: (
      <path
        d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
        fill="currentColor"
      />
    ),
  },
  {
    href: '/admin/corretores',
    label: 'Corretores',
    icon: (
      <path
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        fill="currentColor"
      />
    ),
  },
  {
    href: '/admin/blog',
    label: 'Blog',
    icon: (
      <path
        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
        fill="currentColor"
      />
    ),
  },
  {
    href: '/admin/configuracoes',
    label: 'Configurações',
    adminOnly: true,
    icon: (
      <path
        d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
        fill="currentColor"
      />
    ),
  },
  {
    href: '/admin/usuarios',
    label: 'Usuários',
    adminOnly: true,
    icon: (
      <path
        d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
        fill="currentColor"
      />
    ),
  },
]

function NavItems({
  pathname,
  role,
  onNavigate,
}: {
  pathname: string
  role: string | null
  onNavigate?: () => void
}) {
  return (
    <>
      {NAV.filter((item) => !('adminOnly' in item) || role === 'ADMIN').map(
        (item) => {
          const active =
            item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-5 py-3 font-sans text-xs font-medium transition-colors ${
                active
                  ? 'border-r-2 border-brand-gold bg-brand-gold/10 text-brand-gold'
                  : 'text-brand-cream/50 hover:bg-brand-cream/5 hover:text-brand-cream'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                {item.icon}
              </svg>
              {item.label}
            </Link>
          )
        }
      )}
    </>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((d) => setRole(d.role ?? null))
      .catch(() => {})
  }, [pathname])

  if (pathname === '/admin/login') return <>{children}</>

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const currentPage = NAV.find((n) =>
    n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href)
  )

  return (
    <div className="flex min-h-screen">
      {/* ── Sidebar desktop ── */}
      <aside className="hidden w-56 flex-shrink-0 flex-col bg-brand-navy-deep md:flex">
        <div className="flex items-center gap-3 border-b border-brand-cream/10 px-5 py-4">
          <Image src="/brand/logo.png" alt="Tôrres Imobiliária" width={40} height={40} />
          <p className="text-[8px] uppercase tracking-[0.15em] text-brand-gold">Admin</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <NavItems pathname={pathname} role={role} />
        </nav>

        <div className="border-t border-brand-cream/10 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded px-3 py-2 font-sans text-xs text-brand-cream/40 transition-colors hover:bg-brand-cream/5 hover:text-brand-cream/70"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
            Sair
          </button>
        </div>
      </aside>

      {/* ── Layout mobile ── */}
      <div className="flex flex-1 flex-col md:contents">
        {/* Top bar mobile */}
        <header className="flex items-center justify-between border-b border-brand-cream/10 bg-brand-navy-deep px-4 py-3 md:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
            className="flex h-9 w-9 items-center justify-center rounded border border-brand-cream/15 text-brand-cream/60 hover:text-brand-cream"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <Image src="/brand/logo.png" alt="" width={28} height={28} aria-hidden="true" />
            <span className="font-sans text-[10px] uppercase tracking-widest text-brand-gold">
              Admin
            </span>
          </div>

          {/* Página atual */}
          <span className="font-sans text-xs text-brand-cream/50">{currentPage?.label ?? ''}</span>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-brand-navy">{children}</main>
      </div>

      {/* ── Gaveta mobile ── */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          {/* Painel */}
          <div className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-brand-navy-deep md:hidden">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between border-b border-brand-cream/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <Image src="/brand/logo.png" alt="Tôrres Imobiliária" width={36} height={36} />
                <p className="text-[8px] uppercase tracking-[0.15em] text-brand-gold">Admin</p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Fechar menu"
                className="text-brand-cream/40 hover:text-brand-cream"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4">
              <NavItems pathname={pathname} role={role} onNavigate={() => setDrawerOpen(false)} />
            </nav>

            {/* Logout */}
            <div className="border-t border-brand-cream/10 p-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded px-3 py-2 font-sans text-xs text-brand-cream/40 transition-colors hover:bg-brand-cream/5 hover:text-brand-cream/70"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                </svg>
                Sair
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
