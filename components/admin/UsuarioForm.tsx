'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SaveButton, type SaveStatus } from './SaveButton'

interface UsuarioFormProps {
  id?: string
  inicial?: {
    nome: string
    email: string
    role: 'ADMIN' | 'CORRETOR'
    ativo: boolean
  }
}

const inputClass =
  'w-full rounded border border-brand-cream/15 bg-brand-navy-deep px-3 py-2.5 font-sans text-sm text-brand-cream placeholder:text-brand-cream/25 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/20'
const labelClass = 'block font-sans text-xs text-brand-cream/50 mb-1'

export default function UsuarioForm({ id, inicial }: UsuarioFormProps) {
  const router = useRouter()
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(id ? 'idle' : 'dirty')
  const [erro, setErro] = useState('')

  const [form, setForm] = useState({
    nome: inicial?.nome ?? '',
    email: inicial?.email ?? '',
    role: inicial?.role ?? 'CORRETOR',
    ativo: inicial?.ativo ?? true,
    senha: '',
    confirmarSenha: '',
  })

  function set(field: string, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }))
    setSaveStatus('dirty')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (form.senha && form.senha !== form.confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setSaveStatus('saving')

    try {
      const payload: Record<string, unknown> = {
        nome: form.nome,
        email: form.email,
        role: form.role,
        ativo: form.ativo,
      }
      if (form.senha) payload.senha = form.senha

      const url = id ? `/api/admin/usuarios/${id}` : '/api/admin/usuarios'
      const method = id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setErro(data.erro ?? 'Erro ao salvar.')
        setSaveStatus('dirty')
        return
      }

      setSaveStatus('saved')
      setTimeout(() => router.push('/admin/usuarios'), 1000)
    } catch {
      setErro('Erro de conexão. Tente novamente.')
      setSaveStatus('dirty')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl px-4 py-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-y-3">
        <h1 className="font-serif text-2xl font-semibold text-brand-cream">
          {id ? 'Editar usuário' : 'Novo usuário'}
        </h1>
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

      <div className="space-y-5 rounded-lg border border-brand-cream/10 bg-brand-navy-deep p-6">
        {/* Nome */}
        <div>
          <label className={labelClass}>Nome completo</label>
          <input
            type="text"
            required
            value={form.nome}
            onChange={(e) => set('nome', e.target.value)}
            className={inputClass}
            placeholder="Ex: João Silva"
          />
        </div>

        {/* E-mail */}
        <div>
          <label className={labelClass}>E-mail</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            className={inputClass}
            placeholder="email@torres.com.br"
          />
        </div>

        {/* Perfil + Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Perfil</label>
            <select
              value={form.role}
              onChange={(e) => set('role', e.target.value)}
              className={inputClass}
            >
              <option value="CORRETOR">Corretor</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              value={form.ativo ? 'true' : 'false'}
              onChange={(e) => set('ativo', e.target.value === 'true')}
              className={inputClass}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
        </div>

        <hr className="border-brand-cream/10" />

        {/* Senha */}
        <div>
          <label className={labelClass}>
            {id ? 'Nova senha (deixe em branco para manter)' : 'Senha'}
          </label>
          <input
            type="password"
            required={!id}
            value={form.senha}
            onChange={(e) => set('senha', e.target.value)}
            className={inputClass}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className={labelClass}>Confirmar senha</label>
          <input
            type="password"
            required={!id && !!form.senha}
            value={form.confirmarSenha}
            onChange={(e) => set('confirmarSenha', e.target.value)}
            className={inputClass}
            placeholder="Repita a senha"
            autoComplete="new-password"
          />
        </div>
      </div>

      {erro && (
        <p className="mt-4 rounded border border-red-400/20 bg-red-400/10 px-4 py-2.5 font-sans text-sm text-red-400">
          {erro}
        </p>
      )}
    </form>
  )
}
