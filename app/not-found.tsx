import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <html lang="pt-BR">
      <body style={{ background: '#0A1626', margin: 0 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          {/* Logo */}
          <div className="mb-10">
            <Image src="/brand/logo.png" alt="Tôrres Imobiliária" width={88} height={88} priority />
          </div>

          {/* Skyline decorativa */}
          <svg
            width="120"
            height="80"
            viewBox="0 0 120 80"
            fill="none"
            aria-hidden="true"
            className="mb-8 opacity-10"
          >
            <rect x="6" y="46" width="10" height="26" rx="1" fill="#BD8338" />
            <rect x="20" y="34" width="10" height="38" rx="1" fill="#BD8338" />
            <rect x="34" y="24" width="10" height="48" rx="1" fill="#BD8338" />
            <rect x="48" y="14" width="10" height="58" rx="1" fill="#BD8338" />
            <rect x="62" y="28" width="10" height="44" rx="1" fill="#BD8338" />
            <rect x="76" y="38" width="10" height="34" rx="1" fill="#BD8338" />
            <rect x="90" y="44" width="10" height="28" rx="1" fill="#BD8338" />
            <rect x="104" y="50" width="10" height="22" rx="1" fill="#BD8338" />
            <path
              d="M2 72 Q60 80 118 72"
              stroke="#BD8338"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          <p
            style={{
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#BD8338',
              marginBottom: '12px',
            }}
          >
            Erro 404
          </p>
          <h1
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '2.5rem',
              fontWeight: 600,
              color: '#E8E0D6',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}
          >
            Página não encontrada
          </h1>
          <p
            style={{
              fontFamily: 'sans-serif',
              fontSize: '14px',
              fontWeight: 300,
              color: 'rgba(232,224,214,0.6)',
              maxWidth: '420px',
              lineHeight: 1.7,
              marginBottom: '32px',
            }}
          >
            A página que você está procurando não existe ou foi movida. Navegue pelo menu ou volte
            para a página inicial.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
            <Link
              href="/"
              style={{
                background: '#BD8338',
                color: '#060E16',
                padding: '12px 24px',
                borderRadius: '4px',
                fontFamily: 'sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Página inicial
            </Link>
            <Link
              href="/comprar"
              style={{
                border: '1px solid rgba(232,224,214,0.2)',
                color: 'rgba(232,224,214,0.7)',
                padding: '12px 24px',
                borderRadius: '4px',
                fontFamily: 'sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Ver imóveis
            </Link>
            <Link
              href="/contato"
              style={{
                border: '1px solid rgba(232,224,214,0.2)',
                color: 'rgba(232,224,214,0.7)',
                padding: '12px 24px',
                borderRadius: '4px',
                fontFamily: 'sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Falar conosco
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
