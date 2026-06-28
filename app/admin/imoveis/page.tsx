'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
interface Imovel {
  id: string
  slug: string
  codigo: number | null
  titulo: string
  tipo: string
  status: string
  preco: number
  endereco: string
  bairro: string
  cidade: string
  uf: string
  latitude: string | null
  longitude: string | null
  imagens: { url: string }[]
}

function rotaGoogleMaps(imovel: Imovel): string {
  if (imovel.latitude && imovel.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${imovel.latitude},${imovel.longitude}`
  }
  const q = [imovel.endereco, imovel.bairro, imovel.cidade, imovel.uf, 'Brasil']
    .filter(Boolean)
    .join(', ')
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
}

export default function AdminImoveisPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)

  const carregar = useCallback(async (q = '') => {
    setLoading(true)
    const res = await fetch(`/api/admin/imoveis?q=${encodeURIComponent(q)}`)
    setImoveis(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function excluir(id: string, titulo: string) {
    if (!confirm(`Excluir "${titulo}"? Esta ação não pode ser desfeita.`)) return
    const res = await fetch(`/api/admin/imoveis/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.erro ?? 'Erro ao excluir. Tente novamente.')
      return
    }
    setImoveis((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-y-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-brand-cream">Imóveis</h1>
          <p className="mt-1 font-sans text-sm text-brand-cream/40">
            {imoveis.length} imóvel(is) cadastrado(s)
          </p>
        </div>
        <Link
          href="/admin/imoveis/novo"
          className="rounded bg-brand-gold px-4 py-2 font-sans text-xs font-semibold text-brand-navy-deep transition-opacity hover:opacity-90"
        >
          + Novo imóvel
        </Link>
      </div>

      {/* Busca */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Buscar por título, bairro ou cidade…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && carregar(busca)}
          className="flex-1 rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2 font-sans text-sm text-brand-cream placeholder:text-brand-cream/25 focus:border-brand-gold focus:outline-none"
        />
        <button
          onClick={() => carregar(busca)}
          className="rounded border border-brand-cream/15 px-4 py-2 font-sans text-xs text-brand-cream/60 transition-colors hover:border-brand-gold hover:text-brand-gold"
        >
          Buscar
        </button>
        {busca && (
          <button
            onClick={() => {
              setBusca('')
              carregar('')
            }}
            className="rounded border border-brand-cream/15 px-4 py-2 font-sans text-xs text-brand-cream/40 transition-colors hover:text-brand-cream"
          >
            Limpar
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center font-sans text-sm text-brand-cream/40">Carregando…</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-brand-cream/10">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-brand-cream/10 bg-brand-navy-deep">
                {['Ref.', 'Imóvel', 'Localização', 'Tipo', 'Status', 'Preço', 'Ações'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-wider text-brand-cream/40"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {imoveis.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center font-sans text-sm text-brand-cream/30"
                  >
                    Nenhum imóvel encontrado
                  </td>
                </tr>
              ) : (
                imoveis.map((imovel) => (
                  <tr
                    key={imovel.id}
                    className="border-b border-brand-cream/5 transition-colors hover:bg-brand-navy-deep/50"
                  >
                    <td className="px-4 py-3 font-sans text-xs">
                      {imovel.codigo != null ? (
                        <span className="rounded bg-brand-gold/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-brand-gold">
                          #{String(imovel.codigo).padStart(4, '0')}
                        </span>
                      ) : (
                        <span className="text-brand-cream/20">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-14 flex-shrink-0 overflow-hidden rounded bg-brand-navy-deep">
                          {imovel.imagens[0] ? (
                            <img
                              src={imovel.imagens[0].url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-brand-cream/20">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="font-sans text-sm text-brand-cream">{imovel.titulo}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-brand-cream/60">
                      {imovel.bairro}, {imovel.cidade}
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-brand-cream/60">
                      {imovel.tipo}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold ${
                          imovel.status === 'DISPONIVEL'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : imovel.status === 'RESERVADO'
                              ? 'bg-brand-gold/10 text-brand-gold'
                              : 'bg-brand-cream/10 text-brand-cream/50'
                        }`}
                      >
                        {imovel.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans text-sm text-brand-cream">
                      {Number(imovel.preco).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/imoveis/${imovel.id}`}
                          className="font-sans text-xs text-brand-gold hover:underline"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => excluir(imovel.id, imovel.titulo)}
                          className="font-sans text-xs text-red-400/70 hover:text-red-400 hover:underline"
                        >
                          Excluir
                        </button>
                        <Link
                          href={`/comprar/${imovel.slug}`}
                          target="_blank"
                          className="font-sans text-xs text-brand-cream/30 hover:text-brand-cream/60"
                        >
                          Ver
                        </Link>
                        <a
                          href={rotaGoogleMaps(imovel)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Abrir rota no Google Maps"
                          className="flex items-center gap-1 font-sans text-xs text-emerald-400/70 hover:text-emerald-400"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          Rota
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
