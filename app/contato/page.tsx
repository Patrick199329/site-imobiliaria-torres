'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

type Estado = 'idle' | 'loading' | 'success' | 'error'

export default function ContatoPage() {
  const [estado, setEstado] = useState<Estado>('idle')
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '' })

  const inputClass =
    'w-full rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2.5 font-sans text-sm text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEstado('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          mensagem: `[Contato geral]\n${form.mensagem}`,
        }),
      })
      if (res.ok) setEstado('success')
      else setEstado('error')
    } catch {
      setEstado('error')
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-navy pt-24">
        <div className="border-b border-brand-cream/10 bg-brand-navy-deep py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="label-caps mb-2 text-brand-gold">Fale conosco</p>
            <h1 className="font-serif text-3xl font-semibold text-brand-cream md:text-4xl">
              Contato
            </h1>
            <p className="mt-2 font-sans text-sm font-light text-brand-cream/50">
              Estamos prontos para ajudar com qualquer dúvida.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[420px_1fr]">
            {/* Informações */}
            <div className="flex flex-col gap-6">
              {[
                {
                  titulo: 'Endereço',
                  valor: 'Av. do Contorno, 5198 — Savassi\nBelo Horizonte, MG — 30110-090',
                  icon: (
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                      fill="currentColor"
                    />
                  ),
                },
                {
                  titulo: 'Telefone',
                  valor: '(31) 3232-5198\n(31) 99999-5198',
                  icon: (
                    <path
                      d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
                      fill="currentColor"
                    />
                  ),
                },
                {
                  titulo: 'E-mail',
                  valor: 'contato@torresimobiliaria.com.br',
                  icon: (
                    <path
                      d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                      fill="currentColor"
                    />
                  ),
                },
                {
                  titulo: 'Horário',
                  valor: 'Segunda a Sexta: 8h–18h\nSábado: 9h–13h',
                  icon: (
                    <path
                      d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z"
                      fill="currentColor"
                    />
                  ),
                },
              ].map((item) => (
                <div key={item.titulo} className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-brand-gold/20 bg-brand-gold/5 text-brand-gold">
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      {item.icon}
                    </svg>
                  </div>
                  <div>
                    <p className="label-caps text-brand-cream/40">{item.titulo}</p>
                    <p className="mt-1 whitespace-pre-line font-sans text-sm text-brand-cream/80">
                      {item.valor}
                    </p>
                  </div>
                </div>
              ))}

              {/* Redes sociais */}
              <div className="pt-2">
                <p className="label-caps mb-3 text-brand-cream/40">Redes sociais</p>
                <div className="flex gap-4">
                  {[
                    {
                      label: 'Instagram',
                      href: 'https://instagram.com/torresimobiliaria',
                      icon: (
                        <path
                          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                          fill="currentColor"
                        />
                      ),
                    },
                    {
                      label: 'LinkedIn',
                      href: 'https://linkedin.com/company/torresimobiliaria',
                      icon: (
                        <path
                          d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      ),
                    },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-cream/15 text-brand-cream/50 transition-colors hover:border-brand-gold hover:text-brand-gold"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        {s.icon}
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp direto */}
              <a
                href="https://wa.me/5531999995198"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-3 rounded-md border border-green-500/20 bg-green-500/5 p-4 transition-colors hover:border-green-500/40"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#22c55e" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <div>
                  <p className="font-sans text-sm font-semibold text-green-400">
                    Atendimento imediato
                  </p>
                  <p className="font-sans text-xs text-brand-cream/50">
                    (31) 99999-5198 — Resposta em minutos
                  </p>
                </div>
              </a>
            </div>

            {/* Formulário */}
            <div>
              {estado === 'success' ? (
                <div className="flex flex-col items-center gap-4 rounded-md border border-brand-gold/20 bg-brand-navy-deep px-8 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <path
                        d="M4 11l5 5L18 6"
                        stroke="#BD8338"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="font-serif text-xl text-brand-cream">Mensagem recebida!</p>
                  <p className="font-sans text-sm font-light text-brand-cream/60">
                    Retornaremos em breve pelo e-mail ou telefone informado.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border border-brand-cream/10 bg-brand-navy-deep p-8">
                  <h2 className="mb-1 font-serif text-xl font-semibold text-brand-cream">
                    Envie uma mensagem
                  </h2>
                  <p className="mb-6 font-sans text-sm font-light text-brand-cream/50">
                    Responderemos em até 1 dia útil.
                  </p>

                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Seu nome *"
                        required
                        value={form.nome}
                        onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                        className={inputClass}
                        aria-label="Nome"
                      />
                      <input
                        type="tel"
                        placeholder="Telefone *"
                        required
                        value={form.telefone}
                        onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
                        className={inputClass}
                        aria-label="Telefone"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="E-mail *"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className={inputClass}
                      aria-label="E-mail"
                    />
                    <textarea
                      placeholder="Sua mensagem *"
                      rows={5}
                      required
                      value={form.mensagem}
                      onChange={(e) => setForm((f) => ({ ...f, mensagem: e.target.value }))}
                      className={`${inputClass} resize-none`}
                      aria-label="Mensagem"
                    />

                    {estado === 'error' && (
                      <p className="font-sans text-xs text-red-400">
                        Erro ao enviar. Tente novamente.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={estado === 'loading'}
                      className="label-caps w-full rounded bg-brand-gold py-3 font-semibold text-brand-navy-deep transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {estado === 'loading' ? 'Enviando…' : 'Enviar mensagem'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
