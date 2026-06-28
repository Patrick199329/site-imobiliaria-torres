'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Lancamento {
  id: string
  codigo: string | null
  nome: string
  cidade: string
  faseObra: string
  construtora: string
  _count: { unidades: number }
  imagens: { url: string }[]
}

const FASE_LABEL: Record<string, string> = {
  LANCAMENTO: 'Lançamento',
  EM_CONSTRUCAO: 'Em construção',
  PRONTO: 'Pronto',
}

export default function AdminLancamentosPage() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/lancamentos')
      .then((r) => r.json())
      .then((data) => {
        setLancamentos(data)
        setLoading(false)
      })
  }, [])

  async function excluir(id: string, nome: string) {
    if (!confirm(`Excluir "${nome}"?`)) return
    const res = await fetch(`/api/admin/lancamentos/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.erro ?? 'Erro ao excluir. Tente novamente.')
      return
    }
    setLancamentos((prev) => prev.filter((l) => l.id !== id))
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-y-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-brand-cream">Lançamentos</h1>
          <p className="mt-1 font-sans text-sm text-brand-cream/40">
            {lancamentos.length} lançamento(s)
          </p>
        </div>
        <Link
          href="/admin/lancamentos/novo"
          className="rounded bg-brand-gold px-4 py-2 font-sans text-xs font-semibold text-brand-navy-deep transition-opacity hover:opacity-90"
        >
          + Novo lançamento
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center font-sans text-sm text-brand-cream/40">Carregando…</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-brand-cream/10">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-brand-cream/10 bg-brand-navy-deep">
                {['Código', 'Nome', 'Cidade', 'Construtora', 'Fase', 'Unidades', 'Ações'].map(
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
              {lancamentos.map((l) => (
                <tr
                  key={l.id}
                  className="border-b border-brand-cream/5 transition-colors hover:bg-brand-navy-deep/50"
                >
                  <td className="px-4 py-3 font-sans text-xs">
                    {l.codigo ? (
                      <span className="rounded bg-brand-gold/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-brand-gold">
                        {l.codigo}
                      </span>
                    ) : (
                      <span className="text-brand-cream/20">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 flex-shrink-0 overflow-hidden rounded bg-brand-navy-deep">
                        {l.imagens[0] ? (
                          <img
                            src={l.imagens[0].url}
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
                      <p className="font-sans text-sm text-brand-cream">{l.nome}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-brand-cream/60">{l.cidade}</td>
                  <td className="px-4 py-3 font-sans text-xs text-brand-cream/60">
                    {l.construtora}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-brand-gold/10 px-2 py-0.5 font-sans text-[10px] font-semibold text-brand-gold">
                      {FASE_LABEL[l.faseObra] ?? l.faseObra}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-brand-cream/60">
                    {l._count.unidades}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/lancamentos/${l.id}`}
                        className="font-sans text-xs text-brand-gold hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => excluir(l.id, l.nome)}
                        className="font-sans text-xs text-red-400/70 hover:text-red-400 hover:underline"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
