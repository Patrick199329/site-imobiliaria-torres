import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Substituindo o borderRadius padrão — luxo discreto pede bordas contidas
    borderRadius: {
      none: '0',
      sm: '2px',
      DEFAULT: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
      full: '9999px',
    },
    extend: {
      colors: {
        // ─── Paleta Tôrres Imobiliária ───────────────────────────────
        'brand-navy': '#0A1626',       // Fundo principal do site
        'brand-navy-deep': '#060E16',  // Seções de contraste e rodapé
        'brand-gold': '#BD8338',       // CTAs, ícones, links, bordas ativas
        'brand-gold-light': '#E2AC56', // Hover e estados de brilho do dourado
        'brand-cream': '#E8E0D6',      // Texto principal sobre fundo escuro
      },
      fontFamily: {
        // Serifada editorial — títulos e wordmark
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        // Sans-serif fina — rótulos, subtítulos, selos
        sans: ['var(--font-jost)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Escala tipográfica consistente
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        xs: ['0.75rem', { lineHeight: '1.125rem' }],
        sm: ['0.875rem', { lineHeight: '1.375rem' }],
        base: ['1rem', { lineHeight: '1.625rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.375rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.75rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
        '6xl': ['3.75rem', { lineHeight: '4.25rem' }],
        '7xl': ['4.5rem', { lineHeight: '5rem' }],
      },
      spacing: {
        // Escala base 8px — valores customizados além do padrão Tailwind
        18: '4.5rem',   // 72px
        22: '5.5rem',   // 88px
        26: '6.5rem',   // 104px
        30: '7.5rem',   // 120px
        34: '8.5rem',   // 136px
        38: '9.5rem',   // 152px
        42: '10.5rem',  // 168px
        46: '11.5rem',  // 184px
      },
      letterSpacing: {
        widest: '0.25em',
        'ultra-wide': '0.35em',
      },
      backgroundImage: {
        // Gradiente dourado metálico — uso pontual (logo, divisores, ícones)
        'gold-metallic':
          'linear-gradient(135deg, #BD8338 0%, #E2AC56 40%, #BD8338 60%, #9A6820 100%)',
        'gold-horizontal':
          'linear-gradient(90deg, #9A6820 0%, #E2AC56 50%, #9A6820 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(189, 131, 56, 0.25)',
        'gold-glow-lg': '0 0 40px rgba(189, 131, 56, 0.35)',
        'navy-card': '0 4px 24px rgba(6, 14, 22, 0.6)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        shimmer: 'shimmer 1.8s infinite linear',
      },
    },
  },
  plugins: [],
}

export default config
