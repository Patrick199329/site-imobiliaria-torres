'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/slugify'
import dynamic from 'next/dynamic'
import { SaveButton, type SaveStatus } from './SaveButton'

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false })

interface Corretor {
  id: string
  nome: string
}

interface PostFormProps {
  id?: string
  inicial?: Record<string, string>
}

const inputClass =
  'w-full rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2 font-sans text-sm text-brand-cream placeholder:text-brand-cream/25 focus:border-brand-gold focus:outline-none'
const labelClass = 'block font-sans text-xs text-brand-cream/50 mb-1'

export default function PostForm({ id, inicial }: PostFormProps) {
  const router = useRouter()
  const [corretores, setCorretores] = useState<Corretor[]>([])
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(id ? 'idle' : 'dirty')
  const [erro, setErro] = useState('')

  const initialFormData = {
    titulo: '',
    slug: '',
    conteudo: '',
    capa: '',
    autorId: '',
    metaTitle: '',
    metaDescription: '',
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

  useEffect(() => {
    fetch('/api/admin/corretores')
      .then((r) => r.json())
      .then(setCorretores)
  }, [])

  function set(field: string, value: string) {
    setForm((f) => {
      const next = { ...f, [field]: value }
      if (field === 'titulo' && !id) next.slug = slugify(value)
      checkDirty(next)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setSaveStatus('saving')
    try {
      const url = id ? `/api/admin/blog/${id}` : '/api/admin/blog'
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
        window.location.href = '/admin/blog'
      }, 1200)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar')
      setSaveStatus('dirty')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-brand-cream">
          {id ? 'Editar post' : 'Novo post'}
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

      <div className="mb-6 rounded-lg border border-brand-cream/10 bg-brand-navy-deep p-6">
        <h2 className="mb-4 font-serif text-base font-semibold text-brand-cream">Conteúdo</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Título *</label>
            <input
              required
              value={form.titulo}
              onChange={(e) => set('titulo', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input
              required
              value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Autor *</label>
            <select
              required
              value={form.autorId}
              onChange={(e) => set('autorId', e.target.value)}
              className={inputClass}
            >
              <option value="">Selecione…</option>
              {corretores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>URL da capa</label>
            <input
              value={form.capa}
              onChange={(e) => set('capa', e.target.value)}
              className={inputClass}
              placeholder="https://… ou /uploads/…"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Conteúdo *</label>
            <RichEditor value={form.conteudo} onChange={(html) => set('conteudo', html)} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-brand-cream/10 bg-brand-navy-deep p-6">
        <h2 className="mb-4 font-serif text-base font-semibold text-brand-cream">SEO</h2>
        <div className="grid gap-4">
          <div>
            <label className={labelClass}>Meta título</label>
            <input
              value={form.metaTitle}
              onChange={(e) => set('metaTitle', e.target.value)}
              className={inputClass}
              placeholder="Deixe em branco para usar o título do post"
            />
          </div>
          <div>
            <label className={labelClass}>Meta descrição</label>
            <textarea
              rows={2}
              value={form.metaDescription}
              onChange={(e) => set('metaDescription', e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </div>
    </form>
  )
}
