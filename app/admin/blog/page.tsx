'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Post {
  id: string
  titulo: string
  slug: string
  publicadoEm: string
  autor: { nome: string }
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/blog')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
  }, [])

  async function excluir(id: string, titulo: string) {
    if (!confirm(`Excluir post "${titulo}"?`)) return
    const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.erro ?? 'Erro ao excluir. Tente novamente.')
      return
    }
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-y-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-brand-cream">Blog</h1>
          <p className="mt-1 font-sans text-sm text-brand-cream/40">{posts.length} post(s)</p>
        </div>
        <Link
          href="/admin/blog/novo"
          className="rounded bg-brand-gold px-4 py-2 font-sans text-xs font-semibold text-brand-navy-deep transition-opacity hover:opacity-90"
        >
          + Novo post
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center font-sans text-sm text-brand-cream/40">Carregando…</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-brand-cream/10">
          <table className="w-full min-w-[440px] text-left">
            <thead>
              <tr className="border-b border-brand-cream/10 bg-brand-navy-deep">
                {['Título', 'Autor', 'Publicado em', 'Ações'].map((h) => (
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
              {posts.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center font-sans text-sm text-brand-cream/30"
                  >
                    Nenhum post
                  </td>
                </tr>
              ) : (
                posts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-brand-cream/5 transition-colors hover:bg-brand-navy-deep/50"
                  >
                    <td className="px-4 py-3 font-sans text-sm text-brand-cream">{p.titulo}</td>
                    <td className="px-4 py-3 font-sans text-xs text-brand-cream/60">
                      {p.autor.nome}
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-brand-cream/60">
                      {new Date(p.publicadoEm).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/blog/${p.id}`}
                          className="font-sans text-xs text-brand-gold hover:underline"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => excluir(p.id, p.titulo)}
                          className="font-sans text-xs text-red-400/70 hover:text-red-400 hover:underline"
                        >
                          Excluir
                        </button>
                        <Link
                          href={`/blog/${p.slug}`}
                          target="_blank"
                          className="font-sans text-xs text-brand-cream/30 hover:text-brand-cream/60"
                        >
                          Ver
                        </Link>
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
