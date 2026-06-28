'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body
        style={{
          background: '#0A1626',
          color: '#E8E0D6',
          fontFamily: 'sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          margin: 0,
          textAlign: 'center',
        }}
      >
        <div>
          <p
            style={{
              color: '#BD8338',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Erro crítico
          </p>
          <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>
            Algo deu errado
          </h1>
          <button
            onClick={reset}
            style={{
              background: '#BD8338',
              color: '#060E16',
              border: 'none',
              padding: '12px 24px',
              cursor: 'pointer',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  )
}
