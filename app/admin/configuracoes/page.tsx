'use client'

import { useEffect, useState } from 'react'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

function KeyInput({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description: string
  value: string
  onChange: (v: string) => void
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="rounded-lg border border-brand-cream/10 bg-brand-navy-deep p-6">
      <div className="mb-4">
        <h3 className="font-sans text-sm font-semibold text-brand-cream">{label}</h3>
        <p className="mt-1 font-sans text-xs text-brand-cream/40">{description}</p>
      </div>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cole aqui a chave de API…"
          className="w-full rounded border border-brand-cream/15 bg-brand-navy px-3 py-2.5 pr-10 font-mono text-sm text-brand-cream placeholder:font-sans placeholder:text-brand-cream/20 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-cream/30 hover:text-brand-cream/70"
          aria-label={visible ? 'Ocultar chave' : 'Mostrar chave'}
        >
          {visible ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
          )}
        </button>
      </div>
      {value && (
        <p className="mt-2 font-sans text-[11px] text-emerald-400/70">
          ✓ Chave configurada — {value.length} caracteres
        </p>
      )}
    </div>
  )
}

export default function ConfiguracoesPage() {
  const [googleMapsKey, setGoogleMapsKey] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/configuracoes')
      .then((r) => r.json())
      .then((d) => {
        setGoogleMapsKey(d.GOOGLE_MAPS_KEY ?? '')
        setLoading(false)
      })
  }, [])

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setSaveState('saving')

    try {
      const res = await fetch('/api/admin/configuracoes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ GOOGLE_MAPS_KEY: googleMapsKey }),
      })

      setSaveState(res.ok ? 'saved' : 'error')
      if (res.ok) setTimeout(() => setSaveState('idle'), 2500)
    } catch {
      setSaveState('error')
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-brand-cream">Configurações</h1>
        <p className="mt-1 font-sans text-sm text-brand-cream/40">
          Integrações e chaves de API do sistema
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center font-sans text-sm text-brand-cream/40">Carregando…</div>
      ) : (
        <form onSubmit={salvar} className="space-y-6">
          {/* Seção: Google Maps */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#BD8338" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <h2 className="font-serif text-base font-semibold text-brand-cream">Google Maps</h2>
            </div>

            <KeyInput
              label="Chave de API (Maps JavaScript API)"
              description="Usada para exibir o mapa interativo nas páginas de imóveis. Sem a chave, o mapa usa OpenStreetMap gratuitamente. Restrinja a chave no Google Cloud Console ao seu domínio."
              value={googleMapsKey}
              onChange={(v) => { setGoogleMapsKey(v); setSaveState('idle') }}
            />

            <div className="mt-3 rounded border border-brand-cream/8 bg-brand-navy-deep/40 px-4 py-3">
              <p className="font-sans text-[11px] text-brand-cream/35 leading-relaxed">
                <strong className="text-brand-cream/50">Como obter:</strong> acesse{' '}
                <span className="font-mono text-brand-cream/40">console.cloud.google.com</span> →
                APIs e serviços → Credenciais → Criar credencial → Chave de API.
                Ative a &ldquo;Maps JavaScript API&rdquo; e restrinja a chave ao seu domínio.
              </p>
            </div>
          </div>

          {/* Botão salvar */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saveState === 'saving'}
              className="rounded bg-brand-gold px-6 py-2.5 font-sans text-sm font-semibold text-brand-navy-deep transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saveState === 'saving' ? 'Salvando…' : 'Salvar configurações'}
            </button>

            {saveState === 'saved' && (
              <span className="font-sans text-sm text-emerald-400">✓ Configurações salvas</span>
            )}
            {saveState === 'error' && (
              <span className="font-sans text-sm text-red-400">Erro ao salvar. Tente novamente.</span>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
