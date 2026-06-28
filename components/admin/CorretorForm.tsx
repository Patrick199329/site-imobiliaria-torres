'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SaveButton, type SaveStatus } from './SaveButton'

interface CorretorFormProps {
  id?: string
  inicial?: Record<string, string>
}

const inputClass =
  'w-full rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2 font-sans text-sm text-brand-cream placeholder:text-brand-cream/25 focus:border-brand-gold focus:outline-none'
const labelClass = 'block font-sans text-xs text-brand-cream/50 mb-1'

export default function CorretorForm({ id, inicial }: CorretorFormProps) {
  const router = useRouter()
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(id ? 'idle' : 'dirty')
  const [erro, setErro] = useState('')

  const initialFormData = {
    nome: '',
    creci: '',
    email: '',
    telefone: '',
    whatsapp: '',
    bio: '',
    foto: '',
    ...(inicial ?? {}),
  }

  const [form, setForm] = useState(initialFormData)
  const initialRef = useRef(JSON.stringify(initialFormData))

  const checkDirty = useCallback(
    (nextForm: typeof form) => {
      if (!id) return
      setSaveStatus(JSON.stringify(nextForm) !== initialRef.current ? 'dirty' : 'idle')
    },
    [id]
  )

  function set(field: string, value: string) {
    setForm((f) => {
      const next = { ...f, [field]: value }
      checkDirty(next)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setSaveStatus('saving')
    try {
      const url = id ? `/api/admin/corretores/${id}` : '/api/admin/corretores'
      const res = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.erro ?? 'Erro ao salvar')
      }
      setSaveStatus('saved')
      setTimeout(() => {
        window.location.href = '/admin/corretores'
      }, 1200)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar')
      setSaveStatus('dirty')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-brand-cream">
          {id ? 'Editar corretor' : 'Novo corretor'}
        </h1>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded border border-brand-cream/15 px-4 py-2 font-sans text-xs text-brand-cream/60 hover:text-brand-cream"
          >
            Cancelar
          </button>
          <SaveButton status={saveStatus} />
        </div>
      </div>

      {erro && (
        <div className="mb-4 rounded border border-red-500/30 bg-red-500/10 px-4 py-3 font-sans text-xs text-red-400">
          {erro}
        </div>
      )}

      <div className="rounded-lg border border-brand-cream/10 bg-brand-navy-deep p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Nome completo *</label>
            <input
              required
              value={form.nome}
              onChange={(e) => set('nome', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>CRECI *</label>
            <input
              required
              value={form.creci}
              onChange={(e) => set('creci', e.target.value)}
              className={inputClass}
              placeholder="CRECI-MG 12345"
            />
          </div>
          <div>
            <label className={labelClass}>E-mail *</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Telefone *</label>
            <input
              required
              value={form.telefone}
              onChange={(e) => set('telefone', e.target.value)}
              className={inputClass}
              placeholder="(31) 9 9999-9999"
            />
          </div>
          <div>
            <label className={labelClass}>WhatsApp *</label>
            <input
              required
              value={form.whatsapp}
              onChange={(e) => set('whatsapp', e.target.value)}
              className={inputClass}
              placeholder="5531999999999"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>URL da foto</label>
            <input
              value={form.foto}
              onChange={(e) => set('foto', e.target.value)}
              className={inputClass}
              placeholder="https://…"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Bio</label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </div>
    </form>
  )
}
