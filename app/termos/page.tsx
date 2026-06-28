import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos e condições de uso do site da Tôrres Imobiliária.',
}

const SECOES = [
  {
    titulo: '1. Aceitação dos termos',
    conteudo:
      'Ao acessar e utilizar este site, você concorda com os presentes termos de uso. Caso não concorde com alguma das condições, recomendamos que não utilize o site.',
  },
  {
    titulo: '2. Informações dos imóveis',
    conteudo:
      'As informações sobre imóveis disponibilizadas neste site têm caráter meramente informativo. Preços, disponibilidade e características estão sujeitos a alterações sem aviso prévio. Para informações atualizadas, entre em contato com nossa equipe.',
  },
  {
    titulo: '3. Propriedade intelectual',
    conteudo:
      'Todo o conteúdo deste site — textos, imagens, logotipos e layout — é propriedade da Tôrres Imobiliária ou de seus parceiros, protegido pelas leis de direitos autorais. É proibida a reprodução sem autorização prévia e por escrito.',
  },
  {
    titulo: '4. Limitação de responsabilidade',
    conteudo:
      'A Tôrres Imobiliária não se responsabiliza por danos decorrentes do uso das informações do site, por indisponibilidade temporária do serviço ou por links de terceiros eventualmente presentes.',
  },
  {
    titulo: '5. Legislação aplicável',
    conteudo:
      'Estes termos são regidos pelas leis brasileiras. Qualquer controvérsia será resolvida no foro da comarca de Belo Horizonte, MG.',
  },
  {
    titulo: '6. Alterações',
    conteudo:
      'A Tôrres Imobiliária reserva-se o direito de atualizar estes termos a qualquer momento. Alterações entram em vigor na data de publicação. Recomendamos a consulta periódica desta página.',
  },
]

export default function TermosPage() {
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
            <span className="text-brand-cream/70">Termos de Uso</span>
          </nav>

          <h1 className="mb-2 font-serif text-3xl font-semibold text-brand-cream">Termos de Uso</h1>
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
