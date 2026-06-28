'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/slugify'
import { SaveButton, type SaveStatus } from './SaveButton'

interface Unidade {
  id?: string
  tipologia: string
  areaPrivativa: string
  valor: string
  status: string
  bloco: string
  andar: string
}

interface Imagem {
  id?: string
  url: string
  isNova?: boolean
}

interface LancamentoFormProps {
  id?: string
  inicial?: Record<string, string>
  imagensIniciais?: Imagem[]
  unidadesIniciais?: Unidade[]
}

const inputClass =
  'w-full rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2 font-sans text-sm text-brand-cream placeholder:text-brand-cream/25 focus:border-brand-gold focus:outline-none'
const labelClass = 'block font-sans text-xs text-brand-cream/50 mb-1'
const UNIDADE_VAZIA: Unidade = {
  tipologia: '',
  areaPrivativa: '',
  valor: '',
  status: 'DISPONIVEL',
  bloco: '',
  andar: '',
}

export default function LancamentoForm({
  id,
  inicial,
  imagensIniciais = [],
  unidadesIniciais = [],
}: LancamentoFormProps) {
  const router = useRouter()
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(id ? 'idle' : 'dirty')
  const [erro, setErro] = useState('')
  const [uploading, setUploading] = useState(false)
  const [imagens, setImagens] = useState<Imagem[]>(imagensIniciais)
  const [imagensRemover, setImagensRemover] = useState<string[]>([])
  const [unidades, setUnidades] = useState<Unidade[]>(
    unidadesIniciais.length ? unidadesIniciais : [{ ...UNIDADE_VAZIA }]
  )

  const initialFormData = {
    codigo: '',
    nome: '',
    slug: '',
    construtora: '',
    descricao: '',
    faseObra: 'LANCAMENTO',
    dataPrevistaEntrega: '',
    endereco: '',
    bairro: '',
    cidade: '',
    uf: '',
    latitude: '',
    longitude: '',
    ...(inicial ?? {}),
  }

  const [form, setForm] = useState(initialFormData)
  const initialRef = useRef(JSON.stringify(initialFormData))
  const initialImgsRef = useRef(JSON.stringify(imagensIniciais.map((i) => i.url)))
  const initialUnidsRef = useRef(JSON.stringify(unidadesIniciais))

  const checkDirty = useCallback(
    (nextForm: typeof form, nextImgs: Imagem[], nextUnids: Unidade[]) => {
      if (!id) return
      const changed =
        JSON.stringify(nextForm) !== initialRef.current ||
        JSON.stringify(nextImgs.map((i) => i.url)) !== initialImgsRef.current ||
        JSON.stringify(nextUnids) !== initialUnidsRef.current
      setSaveStatus(changed ? 'dirty' : 'idle')
    },
    [id]
  )

  function set(field: string, value: string) {
    setForm((f) => {
      const next = { ...f, [field]: value }
      if (field === 'nome' && !id) next.slug = slugify(value)
      checkDirty(next, imagens, unidades)
      return next
    })
  }

  function setUnidade(i: number, field: string, value: string) {
    setUnidades((prev) => {
      const next = prev.map((u, idx) => (idx === i ? { ...u, [field]: value } : u))
      checkDirty(form, imagens, next)
      return next
    })
  }

  async function uploadFiles(files: FileList) {
    setUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      setImagens((prev) => {
        const next = [...prev, { url, isNova: true }]
        checkDirty(form, next, unidades)
        return next
      })
    }
    setUploading(false)
  }

  function removerImagem(img: Imagem) {
    if (img.id) setImagensRemover((prev) => [...prev, img.id!])
    setImagens((prev) => {
      const next = prev.filter((i) => i !== img)
      checkDirty(form, next, unidades)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setSaveStatus('saving')
    try {
      const payload = {
        ...form,
        imagens: imagens.filter((i) => i.isNova).map((i) => i.url),
        imagensRemover,
        unidades,
      }
      const url = id ? `/api/admin/lancamentos/${id}` : '/api/admin/lancamentos'
      const res = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.erro ?? 'Erro ao salvar')
      }
      setSaveStatus('saved')
      setTimeout(() => {
        window.location.href = '/admin/lancamentos'
      }, 1200)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar')
      setSaveStatus('dirty')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-4 py-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-y-3">
        <h1 className="font-serif text-2xl font-semibold text-brand-cream">
          {id ? 'Editar lançamento' : 'Novo lançamento'}
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

      {/* Dados básicos */}
      <div className="mb-6 rounded-lg border border-brand-cream/10 bg-brand-navy-deep p-6">
        <h2 className="mb-4 font-serif text-base font-semibold text-brand-cream">Informações</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Código de referência</label>
            <input
              value={form.codigo}
              onChange={(e) => set('codigo', e.target.value)}
              className={inputClass}
              placeholder="ex: LAN-001"
            />
          </div>
          <div />
          <div className="sm:col-span-2">
            <label className={labelClass}>Nome *</label>
            <input
              required
              value={form.nome}
              onChange={(e) => set('nome', e.target.value)}
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
            <label className={labelClass}>Construtora *</label>
            <input
              required
              value={form.construtora}
              onChange={(e) => set('construtora', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Fase *</label>
            <select
              value={form.faseObra}
              onChange={(e) => set('faseObra', e.target.value)}
              className={inputClass}
            >
              {['LANCAMENTO', 'EM_CONSTRUCAO', 'PRONTO'].map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Previsão de entrega</label>
            <input
              type="date"
              value={form.dataPrevistaEntrega}
              onChange={(e) => set('dataPrevistaEntrega', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Descrição *</label>
            <textarea
              required
              rows={4}
              value={form.descricao}
              onChange={(e) => set('descricao', e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </div>

      {/* Localização */}
      <div className="mb-6 rounded-lg border border-brand-cream/10 bg-brand-navy-deep p-6">
        <h2 className="mb-4 font-serif text-base font-semibold text-brand-cream">Localização</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Endereço *</label>
            <input
              required
              value={form.endereco}
              onChange={(e) => set('endereco', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Bairro *</label>
            <input
              required
              value={form.bairro}
              onChange={(e) => set('bairro', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Cidade *</label>
            <input
              required
              value={form.cidade}
              onChange={(e) => set('cidade', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>UF *</label>
            <input
              required
              maxLength={2}
              value={form.uf}
              onChange={(e) => set('uf', e.target.value.toUpperCase())}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Latitude</label>
            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) => set('latitude', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Longitude</label>
            <input
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) => set('longitude', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Imagens */}
      <div className="mb-6 rounded-lg border border-brand-cream/10 bg-brand-navy-deep p-6">
        <h2 className="mb-4 font-serif text-base font-semibold text-brand-cream">Imagens</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {imagens.map((img, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded">
              <img src={img.url} alt="" className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-brand-gold px-1.5 py-0.5 font-sans text-[9px] font-semibold text-brand-navy-deep">
                  CAPA
                </span>
              )}
              <button
                type="button"
                onClick={() => removerImagem(img)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-brand-cream/20 text-brand-cream/30 hover:border-brand-gold/50 hover:text-brand-gold/50">
            {uploading ? (
              <span className="font-sans text-xs">Enviando…</span>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                <span className="mt-1 font-sans text-[10px]">Adicionar</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => e.target.files && uploadFiles(e.target.files)}
            />
          </label>
        </div>
      </div>

      {/* Unidades */}
      <div className="rounded-lg border border-brand-cream/10 bg-brand-navy-deep p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-base font-semibold text-brand-cream">Unidades</h2>
          <button
            type="button"
            onClick={() => setUnidades((p) => [...p, { ...UNIDADE_VAZIA }])}
            className="rounded bg-brand-gold/10 px-3 py-1.5 font-sans text-xs text-brand-gold hover:bg-brand-gold/20"
          >
            + Adicionar
          </button>
        </div>
        {unidades.map((u, i) => (
          <div
            key={i}
            className="mb-4 grid gap-3 rounded border border-brand-cream/10 p-4 sm:grid-cols-6"
          >
            <div className="sm:col-span-2">
              <label className={labelClass}>Tipologia *</label>
              <input
                required
                value={u.tipologia}
                onChange={(e) => setUnidade(i, 'tipologia', e.target.value)}
                className={inputClass}
                placeholder="2 quartos"
              />
            </div>
            <div>
              <label className={labelClass}>Área (m²) *</label>
              <input
                required
                type="number"
                step="0.01"
                value={u.areaPrivativa}
                onChange={(e) => setUnidade(i, 'areaPrivativa', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Valor (R$) *</label>
              <input
                required
                type="number"
                step="0.01"
                value={u.valor}
                onChange={(e) => setUnidade(i, 'valor', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={u.status}
                onChange={(e) => setUnidade(i, 'status', e.target.value)}
                className={inputClass}
              >
                {['DISPONIVEL', 'RESERVADA', 'VENDIDA'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setUnidades((p) => p.filter((_, idx) => idx !== i))}
                className="mb-0.5 font-sans text-xs text-red-400/60 hover:text-red-400"
              >
                Remover
              </button>
            </div>
            <div>
              <label className={labelClass}>Bloco</label>
              <input
                value={u.bloco}
                onChange={(e) => setUnidade(i, 'bloco', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Andar</label>
              <input
                type="number"
                value={u.andar}
                onChange={(e) => setUnidade(i, 'andar', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        ))}
      </div>
    </form>
  )
}
