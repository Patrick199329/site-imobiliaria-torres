'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

interface Usuario {
  id: string
  nome: string
  email: string
  role: 'ADMIN' | 'CORRETOR'
  ativo: boolean
  createdAt: string
}

const roleBadge = {
  ADMIN: 'bg-brand-gold/15 text-brand-gold',
  CORRETOR: 'bg-brand-cream/10 text-brand-cream/60',
}

const roleLabel = {
  ADMIN: 'Admin',
  CORRETOR: 'Corretor',
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)

  const carregar = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/usuarios')
    setUsuarios(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { carregar() }, [carregar])

  async function excluir(id: string, nome: string) {
    if (!confirm(`Excluir o usuário "${nome}"? Esta ação não pode ser desfeita.`)) return
    const res = await fetch(`/api/admin/usuarios/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.erro ?? 'Erro ao excluir.')
      return
    }
    setUsuarios((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-y-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-brand-cream">Usuários</h1>
          <p className="mt-1 font-sans text-sm text-brand-cream/40">
            Gerencie quem acessa o painel administrativo
          </p>
        </div>
        <Link
          href="/admin/usuarios/novo"
          className="rounded bg-brand-gold px-4 py-2 font-sans text-xs font-semibold text-brand-navy-deep transition-opacity hover:opacity-90"
        >
          + Novo usuário
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center font-sans text-sm text-brand-cream/40">Carregando…</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-brand-cream/10">
          <table className="w-full min-w-[520px] text-left">
            <thead>
              <tr className="border-b border-brand-cream/10 bg-brand-navy-deep">
                {['Nome', 'E-mail', 'Perfil', 'Status', 'Desde', 'Ações'].map((h) => (
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
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center font-sans text-sm text-brand-cream/30">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-brand-cream/5 transition-colors hover:bg-brand-navy-deep/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-sans text-sm font-medium text-brand-cream">{u.nome}</p>
                    </td>
                    <td className="px-4 py-3 font-sans text-sm text-brand-cream/60">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 font-sans text-[10px] font-semibold ${roleBadge[u.role]}`}>
                        {roleLabel[u.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 font-sans text-[10px] font-semibold ${
                        u.ativo ? 'bg-emerald-500/10 text-emerald-400' : 'bg-brand-cream/5 text-brand-cream/30'
                      }`}>
                        {u.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-brand-cream/40">
                      {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/usuarios/${u.id}`}
                          className="font-sans text-xs text-brand-gold hover:underline"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => excluir(u.id, u.nome)}
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
    </div>
  )
}
