'use client'

import { useEffect, useState, useCallback } from 'react'

interface ImovelRef {
  id: string
  titulo: string
  bairro: string
  cidade?: string
}

interface Lead {
  id: string
  nome: string
  email: string
  telefone: string
  mensagem: string | null
  tipo: string
  origem: string
  status: string
  createdAt: string
  imovelId: string | null
  imovel: { titulo: string; slug: string } | null
  imoveisInteresse: ImovelRef[]
}

const STATUS_OPTS = ['', 'NOVO', 'EM_ANDAMENTO', 'CONVERTIDO', 'PERDIDO']
const ORIGEM_OPTS = [
  '',
  'SITE',
  'WHATSAPP',
  'PORTAL_ZAP',
  'PORTAL_VIVAREAL',
  'PORTAL_OLX',
  'MANUAL',
]
const TIPO_OPTS = ['INTERESSE_COMPRA', 'AVALIACAO_VENDA']

const STATUS_STYLE: Record<string, string> = {
  NOVO: 'bg-blue-500/10 text-blue-400',
  EM_ANDAMENTO: 'bg-brand-gold/10 text-brand-gold',
  CONVERTIDO: 'bg-emerald-500/10 text-emerald-400',
  PERDIDO: 'bg-brand-cream/10 text-brand-cream/40',
}

const FORM_VAZIO = {
  nome: '',
  email: '',
  telefone: '',
  mensagem: '',
  tipo: 'INTERESSE_COMPRA',
  origem: 'MANUAL',
  status: 'NOVO',
}

const inputClass =
  'w-full rounded border border-brand-cream/15 bg-brand-navy px-3 py-2 font-sans text-sm text-brand-cream placeholder:text-brand-cream/25 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20'
const labelClass = 'block font-sans text-xs text-brand-cream/50 mb-1'
const selectClass =
  'w-full rounded border border-brand-cream/15 bg-brand-navy px-3 py-2 font-sans text-sm text-brand-cream focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20'

type ModalMode = 'criar' | 'editar' | null

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFiltro, setStatusFiltro] = useState('')
  const [origemFiltro, setOrigemFiltro] = useState('')

  // Modal
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [form, setForm] = useState(FORM_VAZIO)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [carregandoModal, setCarregandoModal] = useState(false)

  // Imóveis de interesse
  const [todosImoveis, setTodosImoveis] = useState<ImovelRef[]>([])
  const [buscaImovel, setBuscaImovel] = useState('')
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set())

  const carregar = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFiltro) params.set('status', statusFiltro)
    if (origemFiltro) params.set('origem', origemFiltro)
    const res = await fetch(`/api/admin/leads?${params}`)
    setLeads(await res.json())
    setLoading(false)
  }, [statusFiltro, origemFiltro])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function carregarImoveis() {
    if (todosImoveis.length > 0) return
    const res = await fetch('/api/admin/imoveis?q=')
    setTodosImoveis(await res.json())
  }

  async function abrirCriar() {
    await carregarImoveis()
    setForm(FORM_VAZIO)
    setSelecionados(new Set())
    setBuscaImovel('')
    setErro('')
    setEditandoId(null)
    setModalMode('criar')
  }

  async function abrirEditar(lead: Lead) {
    setModalMode('editar')
    setCarregandoModal(true)
    setErro('')
    await carregarImoveis()
    const res = await fetch(`/api/admin/leads/${lead.id}`)
    const data = await res.json()
    setEditandoId(lead.id)
    setForm({
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      mensagem: data.mensagem ?? '',
      tipo: data.tipo,
      origem: data.origem,
      status: data.status,
    })
    setSelecionados(new Set((data.imoveisInteresse as ImovelRef[]).map((i) => i.id)))
    setBuscaImovel('')
    setCarregandoModal(false)
  }

  function fecharModal() {
    setModalMode(null)
    setErro('')
    setEditandoId(null)
  }

  function setField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function toggleImovel(id: string) {
    setSelecionados((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function salvarLead(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setSalvando(true)
    try {
      if (modalMode === 'criar') {
        const res = await fetch('/api/admin/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, imoveisInteresse: Array.from(selecionados) }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.erro ?? 'Erro ao salvar')
        }
        const novoLead: Lead = await res.json()
        setLeads((prev) => [novoLead, ...prev])
      } else {
        const res = await fetch(`/api/admin/leads/${editandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, imoveisInteresse: Array.from(selecionados) }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.erro ?? 'Erro ao salvar')
        }
        const atualizado: Lead = await res.json()
        setLeads((prev) => prev.map((l) => (l.id === editandoId ? atualizado : l)))
      }
      fecharModal()
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSalvando(false)
    }
  }

  async function excluir(id: string) {
    if (!confirm('Excluir este lead permanentemente?')) return
    const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.erro ?? 'Erro ao excluir. Tente novamente.')
      return
    }
    setLeads((prev) => prev.filter((l) => l.id !== id))
  }

  const imoveisFiltrados = todosImoveis.filter(
    (i) =>
      !buscaImovel ||
      i.titulo.toLowerCase().includes(buscaImovel.toLowerCase()) ||
      i.bairro.toLowerCase().includes(buscaImovel.toLowerCase())
  )

  return (
    <div className="p-4 md:p-8">
      {/* Cabeçalho */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-y-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-brand-cream">Leads</h1>
          <p className="mt-1 font-sans text-sm text-brand-cream/40">{leads.length} lead(s)</p>
        </div>
        <button
          onClick={abrirCriar}
          className="flex items-center gap-2 rounded bg-brand-gold px-4 py-2 font-sans text-xs font-semibold text-brand-navy-deep hover:opacity-90"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M7 1v12M1 7h12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          Novo Lead
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          className="rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2 font-sans text-xs text-brand-cream focus:border-brand-gold focus:outline-none"
        >
          {STATUS_OPTS.map((s) => (
            <option key={s} value={s}>
              {s || 'Todos os status'}
            </option>
          ))}
        </select>
        <select
          value={origemFiltro}
          onChange={(e) => setOrigemFiltro(e.target.value)}
          className="rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2 font-sans text-xs text-brand-cream focus:border-brand-gold focus:outline-none"
        >
          {ORIGEM_OPTS.map((o) => (
            <option key={o} value={o}>
              {o || 'Todas as origens'}
            </option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      {loading ? (
        <div className="py-20 text-center font-sans text-sm text-brand-cream/40">Carregando…</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-brand-cream/10">
          <table className="w-full min-w-[680px] text-left">
            <thead>
              <tr className="border-b border-brand-cream/10 bg-brand-navy-deep">
                {['Nome', 'Contato', 'Tipo / Origem', 'Imóveis', 'Status', 'Data', 'Ações'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-wider text-brand-cream/40"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center font-sans text-sm text-brand-cream/30"
                  >
                    Nenhum lead encontrado
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-brand-cream/5 transition-colors hover:bg-brand-navy-deep/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-sans text-sm text-brand-cream">{lead.nome}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-sans text-xs text-brand-cream/70">{lead.email}</p>
                      <p className="font-sans text-xs text-brand-cream/40">{lead.telefone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-sans text-xs text-brand-cream/70">
                        {lead.tipo === 'INTERESSE_COMPRA' ? 'Compra' : 'Avaliação'}
                      </p>
                      <p className="font-sans text-[10px] text-brand-cream/30">{lead.origem}</p>
                    </td>
                    <td className="px-4 py-3">
                      {lead.imovel && (
                        <p className="font-sans text-xs text-brand-cream/60">
                          {lead.imovel.titulo}
                        </p>
                      )}
                      {lead.imoveisInteresse?.length > 0 && (
                        <p className="font-sans text-[10px] text-brand-gold/60">
                          +{lead.imoveisInteresse.length} interesse(s)
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold ${STATUS_STYLE[lead.status] ?? ''}`}
                      >
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-brand-cream/40">
                      {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => abrirEditar(lead)}
                          className="font-sans text-xs text-brand-gold hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => excluir(lead.id)}
                          className="font-sans text-xs text-red-400/70 hover:text-red-400 hover:underline"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal criar / editar */}
      {modalMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={fecharModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-brand-cream/10 bg-brand-navy-deep p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-brand-cream">
                {modalMode === 'criar' ? 'Novo Lead' : 'Editar Lead'}
              </h2>
              <button
                onClick={fecharModal}
                className="text-brand-cream/40 hover:text-brand-cream"
                aria-label="Fechar"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M1 1l16 16M17 1L1 17"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {carregandoModal ? (
              <div className="py-16 text-center font-sans text-sm text-brand-cream/40">
                Carregando…
              </div>
            ) : (
              <form onSubmit={salvarLead} className="space-y-4">
                {/* Dados pessoais */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="col-span-2">
                    <label className={labelClass}>Nome *</label>
                    <input
                      required
                      value={form.nome}
                      onChange={(e) => setField('nome', e.target.value)}
                      className={inputClass}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>E-mail *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                      className={inputClass}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Telefone *</label>
                    <input
                      required
                      value={form.telefone}
                      onChange={(e) => setField('telefone', e.target.value)}
                      className={inputClass}
                      placeholder="(31) 99999-9999"
                    />
                  </div>
                </div>

                {/* Tipo / Origem / Status */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Tipo</label>
                    <select
                      value={form.tipo}
                      onChange={(e) => setField('tipo', e.target.value)}
                      className={selectClass}
                    >
                      {TIPO_OPTS.map((t) => (
                        <option key={t} value={t}>
                          {t === 'INTERESSE_COMPRA' ? 'Interesse Compra' : 'Avaliação Venda'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Origem</label>
                    <select
                      value={form.origem}
                      onChange={(e) => setField('origem', e.target.value)}
                      className={selectClass}
                    >
                      {ORIGEM_OPTS.filter(Boolean).map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setField('status', e.target.value)}
                      className={selectClass}
                    >
                      {STATUS_OPTS.filter(Boolean).map((s) => (
                        <option key={s} value={s}>
                          {s.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mensagem */}
                <div>
                  <label className={labelClass}>Mensagem / Observações</label>
                  <textarea
                    rows={3}
                    value={form.mensagem}
                    onChange={(e) => setField('mensagem', e.target.value)}
                    className={inputClass}
                    placeholder="Detalhes do contato, preferências…"
                  />
                </div>

                {/* Imóveis de interesse */}
                <div>
                  <label className={labelClass}>
                    Imóveis de interesse
                    {selecionados.size > 0 && (
                      <span className="ml-1 text-brand-gold">
                        ({selecionados.size} selecionado(s))
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={buscaImovel}
                    onChange={(e) => setBuscaImovel(e.target.value)}
                    placeholder="Buscar por título ou bairro…"
                    className={`${inputClass} mb-2`}
                  />
                  <div className="max-h-48 overflow-y-auto rounded border border-brand-cream/10 bg-brand-navy">
                    {imoveisFiltrados.length === 0 ? (
                      <p className="px-3 py-4 text-center font-sans text-xs text-brand-cream/30">
                        Nenhum imóvel encontrado
                      </p>
                    ) : (
                      imoveisFiltrados.map((imovel) => (
                        <label
                          key={imovel.id}
                          className="flex cursor-pointer items-center gap-3 border-b border-brand-cream/5 px-3 py-2.5 transition-colors last:border-0 hover:bg-brand-navy-deep"
                        >
                          <input
                            type="checkbox"
                            checked={selecionados.has(imovel.id)}
                            onChange={() => toggleImovel(imovel.id)}
                            className="accent-brand-gold"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-sans text-xs text-brand-cream">
                              {imovel.titulo}
                            </p>
                            <p className="font-sans text-[10px] text-brand-cream/40">
                              {imovel.bairro}
                            </p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {erro && (
                  <p className="rounded bg-red-500/10 px-3 py-2 font-sans text-xs text-red-400">
                    {erro}
                  </p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={fecharModal}
                    className="rounded border border-brand-cream/15 px-4 py-2 font-sans text-xs text-brand-cream/60 hover:text-brand-cream"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando}
                    className="flex items-center gap-2 rounded bg-brand-gold px-5 py-2 font-sans text-xs font-semibold text-brand-navy-deep hover:opacity-90 disabled:opacity-60"
                  >
                    {salvando && (
                      <svg
                        className="h-3.5 w-3.5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                    )}
                    {salvando ? 'Salvando…' : 'Salvar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
