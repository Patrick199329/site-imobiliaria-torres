'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/slugify'
import { SaveButton, type SaveStatus } from './SaveButton'
import { PropertyMap } from '@/components/imovel/PropertyMapDynamic'

interface Imagem {
  id?: string
  url: string
  isNova?: boolean
}

interface Corretor {
  id: string
  nome: string
}

interface ImovelFormProps {
  id?: string
  inicial?: Record<string, unknown>
  imagensIniciais?: Imagem[]
}

const inputClass =
  'w-full rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2 font-sans text-sm text-brand-cream placeholder:text-brand-cream/25 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20'

const labelClass = 'block font-sans text-xs text-brand-cream/50 mb-1'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-lg border border-brand-cream/10 bg-brand-navy-deep p-6">
      <h2 className="mb-4 font-serif text-base font-semibold text-brand-cream">{title}</h2>
      {children}
    </div>
  )
}

export default function ImovelForm({ id, inicial, imagensIniciais = [] }: ImovelFormProps) {
  const router = useRouter()
  const [corretores, setCorretores] = useState<Corretor[]>([])
  const [imagens, setImagens] = useState<Imagem[]>(imagensIniciais)
  const [imagensRemover, setImagensRemover] = useState<string[]>([])
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(id ? 'idle' : 'dirty')
  const [erro, setErro] = useState('')
  const [uploading, setUploading] = useState(false)
  const [cepStatus, setCepStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [googleMapsKey, setGoogleMapsKey] = useState<string | null>(null)
  const [previewCoords, setPreviewCoords] = useState<{ lat: number; lng: number } | null>(() => {
    if (inicial?.latitude && inicial?.longitude) {
      return { lat: Number(inicial.latitude), lng: Number(inicial.longitude) }
    }
    return null
  })

  const initialFormData = {
    titulo: '',
    slug: '',
    tipo: 'APARTAMENTO',
    status: 'DISPONIVEL',
    preco: '',
    areaUtil: '',
    areaTotal: '',
    quartos: '',
    suites: '',
    vagas: '',
    valorCondominio: '',
    valorIptu: '',
    descricao: '',
    endereco: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
    latitude: '',
    longitude: '',
    destaque: false,
    corretorId: '',
    ...((inicial as Record<string, string | boolean>) ?? {}),
  }

  const [form, setForm] = useState(initialFormData)
  const initialRef = useRef(JSON.stringify(initialFormData))
  const initialImgsRef = useRef(JSON.stringify(imagensIniciais.map((i) => i.url)))

  const checkDirty = useCallback(
    (nextForm: typeof form, nextImgs: Imagem[]) => {
      if (!id) return
      const formChanged = JSON.stringify(nextForm) !== initialRef.current
      const imgsChanged = JSON.stringify(nextImgs.map((i) => i.url)) !== initialImgsRef.current
      setSaveStatus(formChanged || imgsChanged ? 'dirty' : 'idle')
    },
    [id]
  )

  useEffect(() => {
    fetch('/api/admin/corretores')
      .then((r) => r.json())
      .then(setCorretores)
  }, [])

  useEffect(() => {
    fetch('/api/admin/configuracoes')
      .then((r) => r.json())
      .then((d) => setGoogleMapsKey(d.GOOGLE_MAPS_KEY || null))
      .catch(() => {})
  }, [])

  function set(field: string, value: string | boolean) {
    setForm((f) => {
      const next = { ...f, [field]: value }
      if (field === 'titulo' && !id) next.slug = slugify(value as string)
      checkDirty(next, imagens)
      return next
    })
  }

  async function buscarCep(cepDigitado: string) {
    const digits = cepDigitado.replace(/\D/g, '')
    if (digits.length !== 8) return
    setCepStatus('loading')
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (data.erro) {
        setCepStatus('error')
        return
      }
      setForm((f) => ({
        ...f,
        endereco: data.logradouro ?? f.endereco,
        bairro: data.bairro ?? f.bairro,
        cidade: data.localidade ?? f.cidade,
        uf: data.uf ?? f.uf,
      }))
      setSaveStatus('dirty')
      setCepStatus('ok')
    } catch {
      setCepStatus('error')
    }
  }

  async function buscarCoordenadas() {
    setGeoStatus('loading')
    try {
      const res = await fetch('/api/admin/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endereco: form.endereco,
          bairro: form.bairro,
          cidade: form.cidade,
          uf: form.uf,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setGeoStatus('error')
        return
      }
      setForm((f) => ({ ...f, latitude: String(data.lat), longitude: String(data.lng) }))
      setPreviewCoords({ lat: data.lat, lng: data.lng })
      setSaveStatus('dirty')
      setGeoStatus('ok')
    } catch {
      setGeoStatus('error')
    }
  }

  async function uploadFiles(files: FileList) {
    setUploading(true)
    const novas: Imagem[] = []
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      novas.push({ url, isNova: true })
    }
    setImagens((prev) => {
      const next = [...prev, ...novas]
      checkDirty(form, next)
      return next
    })
    setUploading(false)
  }

  function removerImagem(img: Imagem) {
    if (img.id) setImagensRemover((prev) => [...prev, img.id!])
    setImagens((prev) => {
      const next = prev.filter((i) => i !== img)
      checkDirty(form, next)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setSaveStatus('saving')

    try {
      const novasUrls = imagens.filter((i) => i.isNova).map((i) => i.url)
      const payload = {
        ...form,
        imagens: novasUrls,
        imagensRemover,
      }

      const url = id ? `/api/admin/imoveis/${id}` : '/api/admin/imoveis'
      const method = id ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.erro ?? 'Erro ao salvar')
      }

      setSaveStatus('saved')
      setTimeout(() => {
        window.location.href = '/admin/imoveis'
      }, 1200)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar')
      setSaveStatus('dirty')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-4 py-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-y-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-brand-cream">
            {id ? 'Editar imóvel' : 'Novo imóvel'}
          </h1>
          {id && inicial?.codigo != null && (
            <span className="mt-1 inline-block rounded bg-brand-gold/15 px-2 py-0.5 font-mono text-xs font-semibold text-brand-gold">
              Ref. #{String(inicial.codigo).padStart(4, '0')}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded border border-brand-cream/15 px-4 py-2 font-sans text-xs text-brand-cream/60 transition-colors hover:text-brand-cream"
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

      <Section title="Informações básicas">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Título *</label>
            <input
              required
              value={form.titulo}
              onChange={(e) => set('titulo', e.target.value)}
              className={inputClass}
              placeholder="Ex: Apartamento 3 quartos no Savassi"
            />
          </div>
          <div>
            <label className={labelClass}>Slug (URL) *</label>
            <input
              required
              value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              className={inputClass}
              placeholder="apartamento-3-quartos-savassi"
            />
          </div>
          <div>
            <label className={labelClass}>Corretor *</label>
            <select
              required
              value={form.corretorId}
              onChange={(e) => set('corretorId', e.target.value)}
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
          <div>
            <label className={labelClass}>Tipo *</label>
            <select
              value={form.tipo}
              onChange={(e) => set('tipo', e.target.value)}
              className={inputClass}
            >
              {['APARTAMENTO', 'CASA', 'TERRENO', 'COMERCIAL'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status *</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className={inputClass}
            >
              {['DISPONIVEL', 'RESERVADO', 'VENDIDO'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Preço (R$) *</label>
            <input
              required
              type="number"
              step="0.01"
              value={form.preco}
              onChange={(e) => set('preco', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex items-center gap-3 pt-5">
            <input
              type="checkbox"
              id="destaque"
              checked={form.destaque as boolean}
              onChange={(e) => set('destaque', e.target.checked)}
              className="h-4 w-4 accent-brand-gold"
            />
            <label htmlFor="destaque" className="font-sans text-sm text-brand-cream/70">
              Imóvel em destaque
            </label>
          </div>
        </div>
      </Section>

      <Section title="Características">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { field: 'areaUtil', label: 'Área útil (m²)' },
            { field: 'areaTotal', label: 'Área total (m²)' },
            { field: 'quartos', label: 'Quartos' },
            { field: 'suites', label: 'Suítes' },
            { field: 'vagas', label: 'Vagas' },
            { field: 'valorCondominio', label: 'Condomínio (R$)' },
            { field: 'valorIptu', label: 'IPTU (R$)' },
          ].map(({ field, label }) => (
            <div key={field}>
              <label className={labelClass}>{label}</label>
              <input
                type="number"
                step={field.startsWith('area') || field.startsWith('valor') ? '0.01' : '1'}
                value={form[field as keyof typeof form] as string}
                onChange={(e) => set(field, e.target.value)}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Localização">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* CEP — primeiro para disparar o auto-fill */}
          <div>
            <label className={labelClass}>CEP *</label>
            <div className="relative">
              <input
                required
                value={form.cep}
                onChange={(e) => {
                  // Formata: XXXXX-XXX
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 8)
                  const formatted = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
                  set('cep', formatted)
                  setCepStatus('idle')
                  if (digits.length === 8) buscarCep(digits)
                }}
                className={inputClass}
                placeholder="35450-000"
                maxLength={9}
              />
              {cepStatus === 'loading' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="h-4 w-4 animate-spin text-brand-gold/50" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                  </svg>
                </span>
              )}
              {cepStatus === 'ok' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </span>
              )}
              {cepStatus === 'error' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </span>
              )}
            </div>
            {cepStatus === 'error' && (
              <p className="mt-1 font-sans text-[11px] text-red-400">CEP não encontrado.</p>
            )}
            {cepStatus === 'ok' && (
              <p className="mt-1 font-sans text-[11px] text-emerald-400/70">Endereço preenchido — adicione o número.</p>
            )}
          </div>

          {/* UF preenchida junto com CEP */}
          <div>
            <label className={labelClass}>UF *</label>
            <input
              required
              maxLength={2}
              value={form.uf}
              onChange={(e) => set('uf', e.target.value.toUpperCase())}
              className={inputClass}
              placeholder="MG"
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>Endereço *</label>
            <input
              required
              value={form.endereco}
              onChange={(e) => set('endereco', e.target.value)}
              className={inputClass}
              placeholder="Rua, Av… (adicione o número)"
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
          {/* Coordenadas */}
          <div className="sm:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-sans text-xs text-brand-cream/50">Coordenadas (para o mapa)</span>
              <button
                type="button"
                disabled={!form.endereco || !form.cidade || geoStatus === 'loading'}
                onClick={() => { setGeoStatus('idle'); buscarCoordenadas() }}
                className="flex items-center gap-1.5 rounded border border-brand-gold/30 px-3 py-1 font-sans text-xs text-brand-gold transition-colors hover:border-brand-gold hover:bg-brand-gold/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {geoStatus === 'loading' ? (
                  <>
                    <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                    </svg>
                    Buscando…
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    Buscar coordenadas
                  </>
                )}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => { set('latitude', e.target.value); setGeoStatus('idle') }}
                  className={inputClass}
                  placeholder="-20.2345"
                />
              </div>
              <div>
                <label className={labelClass}>Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => { set('longitude', e.target.value); setGeoStatus('idle') }}
                  className={inputClass}
                  placeholder="-43.8052"
                />
              </div>
            </div>
            {geoStatus === 'ok' && (
              <p className="mt-1.5 font-sans text-[11px] text-emerald-400/80">
                ✓ Coordenadas encontradas — confira o mapa abaixo.
              </p>
            )}
            {geoStatus === 'error' && (
              <p className="mt-1.5 font-sans text-[11px] text-red-400">
                Endereço não encontrado. Complete com o número e tente novamente, ou preencha manualmente.
              </p>
            )}
            {/* Botão para atualizar preview com coordenadas editadas manualmente */}
            {!previewCoords && form.latitude && form.longitude && (
              <button
                type="button"
                onClick={() => {
                  const lat = parseFloat(form.latitude)
                  const lng = parseFloat(form.longitude)
                  if (!isNaN(lat) && !isNaN(lng)) setPreviewCoords({ lat, lng })
                }}
                className="mt-2 font-sans text-[11px] text-brand-gold hover:underline"
              >
                Visualizar no mapa →
              </button>
            )}
          </div>

          {/* Preview do mapa */}
          {previewCoords && (
            <div className="sm:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-sans text-xs text-brand-cream/50">Pré-visualização da localização</span>
                <button
                  type="button"
                  onClick={() => {
                    const lat = parseFloat(form.latitude)
                    const lng = parseFloat(form.longitude)
                    if (!isNaN(lat) && !isNaN(lng)) setPreviewCoords({ lat, lng })
                  }}
                  className="font-sans text-[11px] text-brand-gold/60 hover:text-brand-gold"
                >
                  Atualizar
                </button>
              </div>
              <PropertyMap
                latitude={previewCoords.lat}
                longitude={previewCoords.lng}
                titulo={form.titulo || 'Imóvel'}
                googleMapsKey={googleMapsKey}
              />
            </div>
          )}
        </div>
      </Section>

      <Section title="Descrição">
        <textarea
          required
          rows={6}
          value={form.descricao}
          onChange={(e) => set('descricao', e.target.value)}
          className={`${inputClass} resize-none`}
          placeholder="Descreva o imóvel com detalhes relevantes para o comprador…"
        />
      </Section>

      <Section title="Imagens">
        <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
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
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-brand-cream/20 text-brand-cream/30 transition-colors hover:border-brand-gold/50 hover:text-brand-gold/50">
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
        <p className="font-sans text-[10px] text-brand-cream/30">
          A primeira imagem será usada como capa. Clique no × para remover.
        </p>
      </Section>
    </form>
  )
}
