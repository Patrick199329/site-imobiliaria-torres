import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function getCorretores() {
  return prisma.corretor.findMany({ orderBy: { nome: 'asc' } })
}

export async function Team() {
  const corretores = await getCorretores()

  return (
    <section className="bg-brand-navy py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="label-caps text-brand-gold">Quem cuida do seu patrimônio</span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-brand-cream sm:text-4xl">
            Nossa equipe
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {corretores.map((corretor) => (
            <div
              key={corretor.id}
              className="flex flex-col items-center gap-4 rounded-md border border-brand-cream/10 bg-brand-navy-deep p-8 text-center transition-all hover:border-brand-gold/20"
            >
              {/* Avatar */}
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-brand-gold/40 bg-brand-navy">
                {corretor.foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={corretor.foto}
                    alt={corretor.nome}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-serif text-2xl font-bold text-brand-gold">
                    {corretor.nome.charAt(0)}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-serif text-lg font-semibold text-brand-cream">
                  {corretor.nome}
                </h3>
                <p className="label-caps mt-1 text-brand-gold/70">{corretor.creci}</p>
              </div>

              {corretor.bio && (
                <p className="line-clamp-3 font-sans text-sm font-light leading-relaxed text-brand-cream/50">
                  {corretor.bio}
                </p>
              )}

              {/* Ações */}
              <div className="mt-auto flex items-center gap-3">
                <a
                  href={`https://wa.me/${corretor.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-caps flex items-center gap-1.5 rounded border border-brand-gold/40 px-3 py-2 text-brand-gold transition-all hover:bg-brand-gold hover:text-brand-navy-deep"
                  aria-label={`WhatsApp de ${corretor.nome}`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </a>
                <Link
                  href={`/equipe/${corretor.id}`}
                  className="label-caps text-brand-cream/40 transition-colors hover:text-brand-cream"
                >
                  Ver perfil
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/equipe"
            className="label-caps inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-light"
          >
            Conhecer toda a equipe
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
