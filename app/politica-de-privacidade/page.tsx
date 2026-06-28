import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade e tratamento de dados da Tôrres Imobiliária.',
}

const SECOES = [
  {
    titulo: '1. Dados coletados',
    conteudo:
      'Coletamos dados fornecidos voluntariamente por você: nome, e-mail, telefone e mensagens enviadas por meio dos formulários do site. Também podemos coletar dados de navegação de forma anônima para análise de uso.',
  },
  {
    titulo: '2. Finalidade do uso',
    conteudo:
      'Os dados são utilizados exclusivamente para: entrar em contato com você sobre os serviços solicitados; enviar informações sobre imóveis de seu interesse; melhorar a experiência de navegação no site.',
  },
  {
    titulo: '3. Compartilhamento de dados',
    conteudo:
      'Não compartilhamos seus dados pessoais com terceiros, exceto quando exigido por lei ou com parceiros diretamente envolvidos na prestação do serviço contratado (ex.: cartórios, advogados).',
  },
  {
    titulo: '4. Retenção dos dados',
    conteudo:
      'Seus dados são mantidos pelo tempo necessário para a prestação do serviço ou conforme exigido pela legislação aplicável. Você pode solicitar a exclusão a qualquer momento.',
  },
  {
    titulo: '5. Seus direitos (LGPD)',
    conteudo:
      'Em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a: acessar seus dados; corrigir dados incompletos ou desatualizados; solicitar a exclusão; revogar o consentimento a qualquer momento.',
  },
  {
    titulo: '6. Contato',
    conteudo:
      'Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato pelo e-mail privacidade@torresimobiliaria.com.br ou pelo formulário de contato do site.',
  },
]

export default function PoliticaPrivacidadePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-navy pt-24">
        <div className="mx-auto max-w-3xl px-6 pb-20 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 font-sans text-sm text-brand-cream/40">
            <Link href="/" className="transition-colors hover:text-brand-cream">
              Início
            </Link>
            <span>/</span>
            <span className="text-brand-cream/70">Política de Privacidade</span>
          </nav>

          <h1 className="mb-2 font-serif text-3xl font-semibold text-brand-cream">
            Política de Privacidade
          </h1>
          <p className="mb-10 font-sans text-sm text-brand-cream/40">
            Última atualização: junho de 2025
          </p>

          <div className="space-y-8">
            {SECOES.map((s) => (
              <div key={s.titulo}>
                <h2 className="mb-2 font-serif text-lg font-semibold text-brand-cream">
                  {s.titulo}
                </h2>
                <p className="font-sans text-sm font-light leading-relaxed text-brand-cream/70">
                  {s.conteudo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
