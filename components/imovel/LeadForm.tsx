'use client'

import { useState } from 'react'

interface LeadFormProps {
  imovelId: string
  titulo: string
  corretorNome: string
  corretorWhatsapp: string
}

type Estado = 'idle' | 'loading' | 'success' | 'error'

export function LeadForm({ imovelId, titulo, corretorNome, corretorWhatsapp }: LeadFormProps) {
  const [estado, setEstado] = useState<Estado>('idle')
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '' })

  const waUrl = `https://wa.me/${corretorWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${corretorNome}, tenho interesse no imóvel: ${titulo}`)}`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEstado('loading')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, imovelId }),
      })

      if (res.ok) {
        setEstado('success')
      } else {
        setEstado('error')
      }
    } catch {
      setEstado('error')
    }
  }

  const inputClass =
    'w-full rounded border border-brand-cream/15 bg-brand-navy px-3 py-2.5 font-sans text-sm text-brand-cream placeholder:text-brand-cream/30 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20'

  if (estado === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-brand-gold/20 bg-brand-navy-deep px-6 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M4 10l4.5 4.5L16 6"
              stroke="#BD8338"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="font-serif text-lg text-brand-cream">Mensagem enviada!</p>
        <p className="font-sans text-sm font-light text-brand-cream/60">
          Em breve entraremos em contato. Você também pode falar diretamente pelo WhatsApp.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 rounded border border-brand-gold px-4 py-2 font-sans text-xs uppercase tracking-widest text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-navy-deep"
        >
          Abrir WhatsApp
        </a>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-brand-cream/10 bg-brand-navy-deep p-6">
      <h3 className="mb-1 font-serif text-lg font-semibold text-brand-cream">Tenho interesse</h3>
      <p className="mb-5 font-sans text-sm font-light text-brand-cream/50">
        Preencha e entraremos em contato em até 2h.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
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
          placeholder="Mensagem (opcional)"
          rows={3}
          value={form.mensagem}
          onChange={(e) => setForm((f) => ({ ...f, mensagem: e.target.value }))}
          className={`${inputClass} resize-none`}
          aria-label="Mensagem"
        />

        {estado === 'error' && (
          <p className="font-sans text-xs text-red-400">
            Ocorreu um erro. Tente novamente ou use o WhatsApp.
          </p>
        )}

        <button
          type="submit"
          disabled={estado === 'loading'}
          className="label-caps mt-1 w-full rounded bg-brand-gold py-3 font-semibold text-brand-navy-deep transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {estado === 'loading' ? 'Enviando…' : 'Enviar mensagem'}
        </button>
      </form>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-brand-cream/10" />
        <span className="font-sans text-xs text-brand-cream/30">ou</span>
        <div className="h-px flex-1 bg-brand-cream/10" />
      </div>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-brand-cream/15 py-2.5 font-sans text-sm text-brand-cream/70 transition-colors hover:border-green-500/50 hover:text-green-400"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Falar pelo WhatsApp
      </a>

      <p className="mt-4 text-center font-sans text-xs text-brand-cream/30">
        Corretor responsável: <span className="text-brand-cream/50">{corretorNome}</span>
      </p>
    </div>
  )
}
