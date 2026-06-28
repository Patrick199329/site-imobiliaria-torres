const pillars = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M16 3L4 8v8c0 7.18 5.16 13.89 12 15.5C22.84 29.89 28 23.18 28 16V8L16 3z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 16l3.5 3.5L21 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    titulo: 'Segurança em cada negócio',
    descricao:
      'Cada transação é conduzida com rigor jurídico e transparência total — do primeiro contato à entrega das chaves. Você negocia com a certeza de quem sabe o que está fazendo.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M16 3l3.5 7 7.5 1.1-5.5 5.3 1.3 7.5L16 20.5l-6.8 3.4 1.3-7.5L5 11.1l7.5-1.1L16 3z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    titulo: 'Excelência em cada detalhe',
    descricao:
      'Nossa curadoria vai além do preço por metro quadrado. Analisamos localização, potencial de valorização, infraestrutura do entorno e qualidade construtiva para que você tome a melhor decisão.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="4" y="18" width="24" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M4 18l12-12 12 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 29v-7h6v7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 18v-4M22 18v-4"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
    titulo: 'Patrimônio para a vida toda',
    descricao:
      'Um imóvel bem escolhido é muito mais do que uma compra — é o alicerce do seu patrimônio. Pensamos no longo prazo para que cada decisão construa um legado duradouro para sua família.',
  },
]

export function Pillars() {
  return (
    <section className="bg-brand-navy-deep py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="mb-16 text-center">
          <span className="label-caps text-brand-gold">Por que a Tôrres</span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-brand-cream sm:text-4xl">
            Nossos pilares de valor
          </h2>
        </div>

        {/* Pilares */}
        <div className="grid gap-8 sm:grid-cols-3">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-6 rounded-md border border-brand-cream/10 bg-brand-navy p-8 text-center transition-all duration-300 hover:border-brand-gold/30 hover:shadow-gold-glow"
            >
              {/* Ícone */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold">
                {pillar.icon}
              </div>

              {/* Divisor dourado */}
              <div className="h-px w-12 bg-gold-horizontal" />

              <div>
                <h3 className="font-serif text-xl font-semibold text-brand-cream">
                  {pillar.titulo}
                </h3>
                <p className="mt-3 font-sans text-sm font-light leading-relaxed text-brand-cream/60">
                  {pillar.descricao}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
