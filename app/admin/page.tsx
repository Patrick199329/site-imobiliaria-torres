import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getStats() {
  const agora = new Date()
  const inicioSemana = new Date(agora)
  inicioSemana.setDate(agora.getDate() - 7)
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1)

  const [totalImoveis, leadsNaSemana, vendidosNoMes, totalLeads, imovelRecente] = await Promise.all(
    [
      prisma.imovel.count(),
      prisma.lead.count({ where: { createdAt: { gte: inicioSemana } } }),
      prisma.imovel.count({ where: { status: 'VENDIDO', updatedAt: { gte: inicioMes } } }),
      prisma.lead.count(),
      prisma.imovel.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { imagens: { orderBy: { ordem: 'asc' }, take: 1 } },
      }),
    ]
  )

  return { totalImoveis, leadsNaSemana, vendidosNoMes, totalLeads, imovelRecente }
}

export default async function AdminDashboard() {
  const { totalImoveis, leadsNaSemana, vendidosNoMes, totalLeads, imovelRecente } = await getStats()

  const STATS = [
    {
      label: 'Total de imóveis',
      value: totalImoveis,
      href: '/admin/imoveis',
      cor: 'text-brand-gold',
    },
    {
      label: 'Leads esta semana',
      value: leadsNaSemana,
      href: '/admin/leads',
      cor: 'text-emerald-400',
    },
    {
      label: 'Vendidos este mês',
      value: vendidosNoMes,
      href: '/admin/imoveis',
      cor: 'text-blue-400',
    },
    { label: 'Total de leads', value: totalLeads, href: '/admin/leads', cor: 'text-brand-cream' },
  ]

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-brand-cream">Dashboard</h1>
        <p className="mt-1 font-sans text-sm text-brand-cream/40">Visão geral da operação</p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-lg border border-brand-cream/10 bg-brand-navy-deep p-5 transition-colors hover:border-brand-gold/30"
          >
            <p className="font-sans text-xs text-brand-cream/40">{s.label}</p>
            <p className={`mt-2 font-serif text-3xl font-semibold ${s.cor}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      {/* Últimos imóveis */}
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-y-3">
          <h2 className="font-serif text-lg font-semibold text-brand-cream">Imóveis recentes</h2>
          <Link
            href="/admin/imoveis/novo"
            className="rounded bg-brand-gold px-4 py-1.5 font-sans text-xs font-semibold text-brand-navy-deep transition-opacity hover:opacity-90"
          >
            + Novo imóvel
          </Link>
        </div>

        <div className="overflow-x-auto rounded-lg border border-brand-cream/10">
          <table className="w-full min-w-[480px] text-left">
            <thead>
              <tr className="border-b border-brand-cream/10 bg-brand-navy-deep">
                {['Imóvel', 'Tipo', 'Status', 'Preço', ''].map((h) => (
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
              {imovelRecente.map((imovel) => (
                <tr
                  key={imovel.id}
                  className="border-b border-brand-cream/5 transition-colors hover:bg-brand-navy-deep/50"
                >
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
                          <div className="flex h-full items-center justify-center">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="text-brand-cream/20"
                            >
                              <path
                                d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="font-sans text-sm text-brand-cream">{imovel.titulo}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-brand-cream/60">{imovel.tipo}</td>
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
                    <Link
                      href={`/admin/imoveis/${imovel.id}`}
                      className="font-sans text-xs text-brand-gold hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
