'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

type Estado = 'idle' | 'loading' | 'success' | 'error'

const TIPOS = ['Apartamento', 'Casa', 'Terreno', 'Comercial', 'Outro']

const PASSOS = [
  {
    num: '01',
    titulo: 'Solicitação',
    desc: 'Você preenche o formulário com as informações básicas do imóvel.',
  },
  {
    num: '02',
    titulo: 'Visita técnica',
    desc: 'Um corretor agenda visita em até 48h para avaliação presencial detalhada.',
  },
  {
    num: '03',
    titulo: 'Laudo de avaliação',
    desc: 'Entregamos um laudo completo com o valor de mercado e estratégia de venda.',
  },
  {
    num: '04',
    titulo: 'Anúncio e negociação',
    desc: 'Divulgamos nos principais portais e gerenciamos toda a negociação para você.',
  },
]

export default function VenderPage() {
  const [estado, setEstado] = useState<Estado>('idle')
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipoImovel: '',
    cidade: '',
    bairro: '',
    areaAproximada: '',
    quartos: '',
    mensagem: '',
  })

  const inputClass =
    'w-full rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2.5 font-sans text-sm text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20'
  const selectClass = `${inputClass} cursor-pointer`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEstado('loading')

    const mensagemCompleta = [
      `Tipo: ${form.tipoImovel}`,
      `Cidade: ${form.cidade}`,
      `Bairro: ${form.bairro}`,
      form.areaAproximada && `Área aprox.: ${form.areaAproximada} m²`,
      form.quartos && `Quartos: ${form.quartos}`,
      form.mensagem && `Observações: ${form.mensagem}`,
    ]
      .filter(Boolean)
      .join('\n')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          telefone: form.telefone,
          mensagem: mensagemCompleta,
          tipo: 'AVALIACAO_VENDA',
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
        {/* Hero */}
        <div className="border-b border-brand-cream/10 bg-brand-navy-deep py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="label-caps mb-2 text-brand-gold">Vender seu imóvel</p>
            <h1 className="font-serif text-3xl font-semibold text-brand-cream md:text-4xl">
              Avaliação gratuita,
              <br />
              <span className="text-gold-gradient">sem compromisso.</span>
            </h1>
            <p className="mt-3 max-w-xl font-sans text-sm font-light leading-relaxed text-brand-cream/60">
              Avaliamos seu imóvel em Itabirito e região com base no mercado local real — e cuidamos
              de toda a negociação até o fechamento.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
            {/* ── Como funciona ── */}
            <div>
              <h2 className="mb-8 font-serif text-2xl font-semibold text-brand-cream">
                Como funciona
              </h2>

              <div className="flex flex-col gap-8">
                {PASSOS.map((p) => (
                  <div key={p.num} className="flex gap-5">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10">
                      <span className="font-serif text-sm font-bold text-brand-gold">{p.num}</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-semibold text-brand-cream">
                        {p.titulo}
                      </h3>
                      <p className="mt-1 font-sans text-sm font-light leading-relaxed text-brand-cream/60">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Diferenciais */}
              <div className="mt-8 flex flex-col gap-3">
                {[
                  'Avaliação presencial gratuita e sem compromisso',
                  'Divulgação nos principais portais imobiliários',
                  'Acompanhamento completo até a entrega das chaves',
                  'Comissão cobrada somente após o fechamento',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 5l2.5 2.5L8 3"
                          stroke="#BD8338"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="font-sans text-sm font-light text-brand-cream/70">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Formulário ── */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              {estado === 'success' ? (
                <div className="flex flex-col items-center gap-4 rounded-md border border-brand-gold/20 bg-brand-navy-deep px-6 py-12 text-center">
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
                  <p className="font-serif text-xl text-brand-cream">Solicitação enviada!</p>
                  <p className="font-sans text-sm font-light text-brand-cream/60">
                    Um corretor entrará em contato em até 48h para agendar a visita de avaliação.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border border-brand-cream/10 bg-brand-navy-deep p-6">
                  <h2 className="mb-1 font-serif text-lg font-semibold text-brand-cream">
                    Solicitar avaliação
                  </h2>
                  <p className="mb-5 font-sans text-sm font-light text-brand-cream/50">
                    Gratuita e sem compromisso.
                  </p>

                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
                    {/* Dados do imóvel */}
                    <p className="label-caps text-brand-cream/40">Dados do imóvel</p>

                    <select
                      value={form.tipoImovel}
                      onChange={(e) => setForm((f) => ({ ...f, tipoImovel: e.target.value }))}
                      required
                      className={selectClass}
                      aria-label="Tipo de imóvel"
                    >
                      <option value="">Tipo de imóvel *</option>
                      {TIPOS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Cidade *"
                        required
                        value={form.cidade}
                        onChange={(e) => setForm((f) => ({ ...f, cidade: e.target.value }))}
                        className={inputClass}
                        aria-label="Cidade"
                      />
                      <input
                        type="text"
                        placeholder="Bairro *"
                        required
                        value={form.bairro}
                        onChange={(e) => setForm((f) => ({ ...f, bairro: e.target.value }))}
                        className={inputClass}
                        aria-label="Bairro"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Área aprox. (m²)"
                        value={form.areaAproximada}
                        onChange={(e) => setForm((f) => ({ ...f, areaAproximada: e.target.value }))}
                        className={inputClass}
                        aria-label="Área aproximada"
                      />
                      <select
                        value={form.quartos}
                        onChange={(e) => setForm((f) => ({ ...f, quartos: e.target.value }))}
                        className={selectClass}
                        aria-label="Número de quartos"
                      >
                        <option value="">Quartos</option>
                        {['1', '2', '3', '4', '5+'].map((q) => (
                          <option key={q} value={q}>
                            {q}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dados de contato */}
                    <p className="label-caps mt-2 text-brand-cream/40">Seus dados</p>

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
                      type="email"
                      placeholder="E-mail *"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className={inputClass}
                      aria-label="E-mail"
                    />
                    <input
                      type="tel"
                      placeholder="Telefone / WhatsApp *"
                      required
                      value={form.telefone}
                      onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
                      className={inputClass}
                      aria-label="Telefone"
                    />
                    <textarea
                      placeholder="Observações adicionais (opcional)"
                      rows={2}
                      value={form.mensagem}
                      onChange={(e) => setForm((f) => ({ ...f, mensagem: e.target.value }))}
                      className={`${inputClass} resize-none`}
                      aria-label="Observações"
                    />

                    {estado === 'error' && (
                      <p className="font-sans text-xs text-red-400">
                        Erro ao enviar. Tente novamente.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={estado === 'loading'}
                      className="label-caps mt-1 w-full rounded bg-brand-gold py-3 font-semibold text-brand-navy-deep transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {estado === 'loading' ? 'Enviando…' : 'Solicitar avaliação gratuita'}
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
