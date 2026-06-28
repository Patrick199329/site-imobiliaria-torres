'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setErro('E-mail ou senha incorretos.')
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-navy-deep px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image src="/brand/logo.png" alt="Tôrres Imobiliária" width={88} height={88} priority />
          <p className="text-[9px] uppercase tracking-[0.2em] text-brand-gold">
            Painel Administrativo
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-brand-cream/10 bg-brand-navy p-8"
        >
          <h1 className="mb-6 font-serif text-lg font-semibold text-brand-cream">Entrar</h1>

          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block font-sans text-xs text-brand-cream/50">E-mail</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2.5 font-sans text-sm text-brand-cream placeholder:text-brand-cream/25 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-sans text-xs text-brand-cream/50">Senha</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={form.senha}
                onChange={(e) => setForm((f) => ({ ...f, senha: e.target.value }))}
                className="w-full rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2.5 font-sans text-sm text-brand-cream placeholder:text-brand-cream/25 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20"
              />
            </div>

            {erro && <p className="font-sans text-xs text-red-400">{erro}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded bg-brand-gold py-2.5 font-sans text-sm font-semibold text-brand-navy-deep transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
