'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Corretor {
  id: string
  nome: string
  creci: string
  email: string
  telefone: string
  _count: { imoveis: number }
}

export default function AdminCorretoresPage() {
  const [corretores, setCorretores] = useState<Corretor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/corretores')
      .then((r) => r.json())
      .then((data) => {
        setCorretores(data)
        setLoading(false)
      })
  }, [])

  async function excluir(id: string, nome: string) {
    if (!confirm(`Excluir corretor "${nome}"?`)) return
    const res = await fetch(`/api/admin/corretores/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.erro ?? 'Erro ao excluir. Tente novamente.')
      return
    }
    setCorretores((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-y-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-brand-cream">Corretores</h1>
          <p className="mt-1 font-sans text-sm text-brand-cream/40">
            {corretores.length} corretor(es)
          </p>
        </div>
        <Link
          href="/admin/corretores/novo"
          className="rounded bg-brand-gold px-4 py-2 font-sans text-xs font-semibold text-brand-navy-deep transition-opacity hover:opacity-90"
        >
          + Novo corretor
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center font-sans text-sm text-brand-cream/40">Carregando…</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-brand-cream/10">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-brand-cream/10 bg-brand-navy-deep">
                {['Nome', 'CRECI', 'E-mail', 'Telefone', 'Imóveis', 'Ações'].map((h) => (
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
              {corretores.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-brand-cream/5 transition-colors hover:bg-brand-navy-deep/50"
                >
                  <td className="px-4 py-3 font-sans text-sm text-brand-cream">{c.nome}</td>
                  <td className="px-4 py-3 font-sans text-xs text-brand-cream/60">{c.creci}</td>
                  <td className="px-4 py-3 font-sans text-xs text-brand-cream/60">{c.email}</td>
                  <td className="px-4 py-3 font-sans text-xs text-brand-cream/60">{c.telefone}</td>
                  <td className="px-4 py-3 font-sans text-xs text-brand-cream/60">
                    {c._count.imoveis}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/corretores/${c.id}`}
                        className="font-sans text-xs text-brand-gold hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => excluir(c.id, c.nome)}
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
