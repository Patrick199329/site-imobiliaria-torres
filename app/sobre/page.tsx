import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'A empresa | Tôrres Imobiliária',
  description:
    'Conheça a Tôrres Imobiliária — especialistas em imóveis em Itabirito e região, com atendimento personalizado e compromisso real com o seu patrimônio.',
}

const VALORES = [
  {
    titulo: 'Segurança em cada negócio',
    desc: 'Cada transação é conduzida com rigor, clareza e acompanhamento jurídico, para que comprador e vendedor cheguem ao fechamento com total tranquilidade.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7L12 3z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2.5 2.5L15.5 10"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    titulo: 'Excelência em cada detalhe',
    desc: 'Da primeira visita à assinatura do contrato, cuidamos de cada etapa com atenção e profissionalismo — porque o imóvel certo merece o processo certo.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    titulo: 'Patrimônio para a vida toda',
    desc: 'Orientamos cada cliente a tomar decisões que protejam e valorizem seu patrimônio a longo prazo — não apenas a fechar um negócio.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 21h18M5 21V9l7-6 7 6v12"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="9" y="13" width="6" height="8" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
]

const DIFERENCIAIS = [
  'Atendimento personalizado e próximo',
  'Conhecimento profundo do mercado local de Itabirito',
  'Assessoria completa em todas as etapas da negociação',
  'Avaliação de imóvel gratuita e sem compromisso',
  'Divulgação nos principais portais imobiliários',
  'Disponibilidade 7 dias por semana',
]

export default function SobrePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-navy pt-24">
        {/* Hero */}
        <div className="border-b border-brand-cream/10 bg-brand-navy-deep py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="label-caps mb-2 text-brand-gold">A empresa</p>
            <h1 className="font-serif text-4xl font-semibold text-brand-cream md:text-5xl">
              Confiança que
              <br />
              <span className="text-gold-gradient">constrói futuros.</span>
            </h1>
            <p className="mt-4 max-w-xl font-sans text-sm font-light leading-relaxed text-brand-cream/60">
              A Tôrres Imobiliária nasceu com um propósito claro: ser a imobiliária de referência em
              Itabirito e região — com atendimento humano, expertise local e um compromisso genuíno
              com o patrimônio de cada cliente.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Propósito */}
            <div>
              <h2 className="mb-4 font-serif text-2xl font-semibold text-brand-cream">
                Quem somos
              </h2>
              <div className="space-y-4 font-sans text-sm font-light leading-relaxed text-brand-cream/70">
                <p>
                  A Tôrres Imobiliária foi fundada com a convicção de que o mercado imobiliário de
                  Itabirito e região merecia uma imobiliária à altura: especializada, comprometida e
                  com raízes reais na comunidade local.
                </p>
                <p>
                  Atuamos na compra, venda e avaliação de apartamentos, casas, terrenos e
                  lançamentos — sempre com assessoria completa, do primeiro contato à entrega das
                  chaves.
                </p>
                <p>
                  Aqui, cada cliente é atendido como único. Não trabalhamos com volume; trabalhamos
                  com cuidado. Acreditamos que a confiança se constrói negócio a negócio, e é isso
                  que nos move.
                </p>
              </div>
            </div>

            {/* Missão, Visão e Diferenciais */}
            <div className="flex flex-col gap-6">
              <div className="rounded-md border border-brand-cream/10 bg-brand-navy-deep p-6">
                <h3 className="mb-2 font-serif text-base font-semibold text-brand-gold">Missão</h3>
                <p className="font-sans text-sm font-light leading-relaxed text-brand-cream/70">
                  Conectar pessoas ao imóvel certo com segurança, excelência e respeito ao
                  patrimônio — em cada negócio, do início ao fim.
                </p>
              </div>
              <div className="rounded-md border border-brand-cream/10 bg-brand-navy-deep p-6">
                <h3 className="mb-2 font-serif text-base font-semibold text-brand-gold">Visão</h3>
                <p className="font-sans text-sm font-light leading-relaxed text-brand-cream/70">
                  Ser a imobiliária mais confiável de Itabirito e região, reconhecida pela qualidade
                  do atendimento e pela satisfação duradoura dos clientes.
                </p>
              </div>
              <div className="rounded-md border border-brand-cream/10 bg-brand-navy-deep p-6">
                <h3 className="mb-2 font-serif text-base font-semibold text-brand-gold">
                  Por que a Tôrres?
                </h3>
                <ul className="flex flex-col gap-2">
                  {DIFERENCIAIS.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-2 font-sans text-sm text-brand-cream/70"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="mt-0.5 flex-shrink-0 text-brand-gold"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 7l3.5 3.5L12 3.5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="mt-16">
            <h2 className="mb-2 text-center font-serif text-2xl font-semibold text-brand-cream">
              Nossos valores
            </h2>
            <p className="mb-8 text-center font-sans text-sm font-light text-brand-cream/40">
              Os três pilares que guiam cada negócio que realizamos.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {VALORES.map((v) => (
                <div
                  key={v.titulo}
                  className="rounded-md border border-brand-cream/10 bg-brand-navy-deep p-8 text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-brand-gold/20 bg-brand-gold/5 text-brand-gold">
                    {v.icon}
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-semibold text-brand-cream">
                    {v.titulo}
                  </h3>
                  <p className="font-sans text-sm font-light leading-relaxed text-brand-cream/60">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA equipe */}
          <div className="mt-16 flex flex-col items-center gap-4 rounded-md border border-brand-cream/10 bg-brand-navy-deep py-12 text-center">
            <p className="font-sans text-sm text-brand-cream/50">
              Conheça quem faz tudo isso acontecer
            </p>
            <h3 className="font-serif text-2xl font-semibold text-brand-cream">Nossa equipe</h3>
            <Link
              href="/equipe"
              className="label-caps mt-2 inline-flex items-center gap-2 rounded border border-brand-gold px-6 py-2.5 text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-navy-deep"
            >
              Conhecer a equipe
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
