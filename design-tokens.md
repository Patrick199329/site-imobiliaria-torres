# Design Tokens — Tôrres Imobiliária

Referência de implementação do sistema de marca. Todos os valores abaixo estão configurados em `tailwind.config.ts` e `app/globals.css`.

---

## Cores

| Token Tailwind | Hex | Uso |
|---|---|---|
| `bg-brand-navy` | `#0A1626` | Fundo principal — substitui o branco como base do site |
| `bg-brand-navy-deep` | `#060E16` | Rodapé, seções de contraste máximo |
| `bg-brand-gold` / `text-brand-gold` | `#BD8338` | CTAs, ícones, links, bordas ativas |
| `bg-brand-gold-light` / `text-brand-gold-light` | `#E2AC56` | Hover/brilho, gradientes do dourado |
| `text-brand-cream` | `#E8E0D6` | Texto principal sobre fundo escuro |

**Regra de ouro:** nunca usar `blue-600`, `indigo-600` ou qualquer azul padrão do Tailwind nas telas finais. O navy profundo + dourado metálico é a marca.

---

## Tipografia

### Fonte 1 — Playfair Display (serifada editorial)
- **Variável CSS:** `--font-playfair`
- **Classe Tailwind:** `font-serif`
- **Uso:** `h1`, `h2`, `h3`, títulos de seção, wordmark
- **Pesos disponíveis:** 400, 500, 600, 700, 800
- **Estilo característico:** caixa alta com `tracking-wide` ou `tracking-widest`, ecoando o "TÔRRES" do logo

```html
<!-- Exemplo de título de hero -->
<h1 class="font-serif text-5xl font-700 tracking-widest uppercase text-brand-cream">
  Confiança que constrói futuros.
</h1>
```

### Fonte 2 — Jost (sans-serif fina)
- **Variável CSS:** `--font-jost`
- **Classe Tailwind:** `font-sans` (padrão do body)
- **Uso:** rótulos, subtítulos, selos, legendas e corpo de texto longo
- **Pesos disponíveis:** 300 (light), 400 (regular), 500 (medium), 600 (semibold)
- **Estilo de rótulo:** `label-caps` (utility class — 11px, uppercase, tracking 0.2em)

```html
<!-- Rótulo de seção -->
<span class="label-caps text-brand-gold">Imóveis em destaque</span>

<!-- Corpo de texto -->
<p class="font-sans text-base font-light text-brand-cream/80">
  Texto descritivo do imóvel aqui.
</p>
```

---

## Espaçamento

Base: **8px**. Tailwind usa incrementos de 4px (1 = 4px, 2 = 8px). Os valores mais usados no projeto:

| Tailwind | px | Uso típico |
|---|---|---|
| `p-2` | 8px | Padding interno mínimo |
| `p-4` | 16px | Padding padrão de componentes |
| `p-6` | 24px | Padding de cards |
| `p-8` | 32px | Padding de seções internas |
| `p-12` | 48px | Espaçamento de seções |
| `p-16` | 64px | Seções maiores |
| `p-24` | 96px | Hero e seções de destaque |

---

## Borda e Raio

O tom de luxo da marca pede bordas contidas, não o visual "fofo" de raios grandes.

| Token | Valor | Uso |
|---|---|---|
| `rounded-sm` | 2px | Badges, chips, rótulos |
| `rounded` | 4px | Inputs, botões |
| `rounded-md` | 6px | Cards |
| `rounded-lg` | 8px | Modais, painéis |
| `rounded-full` | 9999px | Avatares, ícones circulares |

**Bordas douradas:** usar `border border-brand-gold` para bordas ativas, `border-brand-gold/30` para bordas sutis.

---

## Gradientes

| Classe | Uso |
|---|---|
| `bg-gold-metallic` | Gradiente metálico em elementos pontuais (ícones, divisores, logo) |
| `bg-gold-horizontal` | Versão horizontal para divisores de seção |
| `text-gold-gradient` | Texto com gradiente dourado — usar em títulos de destaque máximo |

**Atenção:** gradientes nunca como fundo de seção inteira — apenas em elementos pontuais.

---

## Sombras

| Classe | Uso |
|---|---|
| `shadow-gold-glow` | Glow dourado suave em botões CTA e elementos de destaque |
| `shadow-gold-glow-lg` | Glow dourado intenso — hover de elementos premium |
| `shadow-navy-card` | Sombra profunda para cards sobre fundo navy |

---

## Estados e Utilitários

| Classe | Descrição |
|---|---|
| `label-caps` | Rótulo em caixa alta, 11px, tracking 0.2em — padrão dos selos da marca |
| `divider-gold` | `<hr>` com gradiente dourado fade-in/out nas extremidades |
| `skeleton` | Background animado para estados de carregamento — mantém tom escuro |
| `text-gold-gradient` | Texto com gradiente metálico dourado |

---

## SVG do Símbolo

**Arquivo flat:** `public/brand/symbol.svg`
- Silhueta do "T"-skyline sem sombra, textura ou efeito 3D
- Cor: `#BD8338` sobre fundo transparente
- Uso: favicon, ícone de app, contextos onde a versão fotográfica não escala

**Versão fotográfica original:** `public/brand/Logo.jpeg`
- Uso: header desktop, hero, materiais impressos

**Favicon:** `app/favicon.svg` (símbolo sobre fundo navy `#0A1626`)

---

## Anti-clichês — checklist de implementação

- [ ] Nunca usar `bg-blue-600`, `bg-indigo-600` ou similares padrão Tailwind
- [ ] Nunca usar `font-sans` com Inter (removida — Jost é o padrão)
- [ ] Texto principal sempre `text-brand-cream`, nunca `text-white`
- [ ] Estados de loading usam `skeleton` (tom escuro), nunca cinza claro
- [ ] Gradientes decorativos apenas em elementos pontuais, nunca como fundo de seção
