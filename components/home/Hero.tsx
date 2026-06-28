'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

/* ─── Paleta ──────────────────────────────────────────────── */
const GOLD = (a: number) => `rgba(189,131,56,${a})`
const GROUND = 310
const VB_W = 1440
const VB_H = 320

/* ─── Tipos ───────────────────────────────────────────────── */
interface RectBuilding {
  kind: 'rect'
  x: number
  top: number
  w: number
  setback?: { fromTop: number; reduce: number }
  antenna?: boolean
  windows?: 'grid' | 'bands'
  delay: number
}
interface HouseBuilding {
  kind: 'house'
  x: number
  bodyTop: number
  w: number
  roofH: number
  dormer?: boolean
  delay: number
}
interface ChurchBuilding {
  kind: 'church'
  x: number
  bodyTop: number
  w: number
  spireH: number
  delay: number
}
type Building = RectBuilding | HouseBuilding | ChurchBuilding

/* ─── Skyline ─────────────────────────────────────────────── */
const BUILDINGS: Building[] = [
  // ── esquerda ──
  { kind: 'rect', x: 5, top: 240, w: 55, delay: 0.0, windows: 'bands' },
  { kind: 'house', x: 65, bodyTop: 205, w: 70, roofH: 42, delay: 0.2 },
  {
    kind: 'rect',
    x: 142,
    top: 155,
    w: 88,
    delay: 0.4,
    windows: 'grid',
    setback: { fromTop: 40, reduce: 12 },
  },
  { kind: 'church', x: 238, bodyTop: 175, w: 52, spireH: 88, delay: 0.6 },
  { kind: 'house', x: 296, bodyTop: 220, w: 60, roofH: 35, delay: 0.3 },
  { kind: 'rect', x: 362, top: 190, w: 52, delay: 0.1, windows: 'bands' },
  // ── centro-esquerda ──
  { kind: 'rect', x: 420, top: 130, w: 72, delay: 0.5, windows: 'grid', antenna: true },
  {
    kind: 'rect',
    x: 500,
    top: 65,
    w: 90,
    delay: 0.8,
    windows: 'grid',
    setback: { fromTop: 55, reduce: 14 },
    antenna: true,
  },
  { kind: 'rect', x: 598, top: 110, w: 68, delay: 0.6, windows: 'bands' },
  // ── centro (edifício principal) ──
  {
    kind: 'rect',
    x: 674,
    top: 25,
    w: 105,
    delay: 1.0,
    windows: 'grid',
    setback: { fromTop: 60, reduce: 18 },
    antenna: true,
  },
  // ── centro-direita ──
  { kind: 'rect', x: 788, top: 80, w: 82, delay: 0.9, windows: 'grid', antenna: true },
  { kind: 'rect', x: 878, top: 140, w: 62, delay: 0.5, windows: 'bands' },
  { kind: 'house', x: 948, bodyTop: 215, w: 72, roofH: 42, dormer: true, delay: 0.7 },
  // ── direita ──
  { kind: 'rect', x: 1028, top: 75, w: 82, delay: 0.7, windows: 'grid', antenna: true },
  { kind: 'rect', x: 1118, top: 125, w: 68, delay: 0.4, windows: 'bands' },
  { kind: 'church', x: 1194, bodyTop: 185, w: 50, spireH: 75, delay: 0.6 },
  { kind: 'rect', x: 1252, top: 150, w: 72, delay: 0.3, windows: 'grid' },
  { kind: 'house', x: 1332, bodyTop: 210, w: 65, roofH: 38, delay: 0.2 },
  { kind: 'rect', x: 1404, top: 230, w: 36, delay: 0.0, windows: 'bands' },
]

/* ─── Componente ──────────────────────────────────────────── */
function RectBldg({ b }: { b: RectBuilding }) {
  const h = GROUND - b.top
  const midX = b.x + b.w / 2
  const delay = b.delay

  // setback: secção superior mais estreita
  const sbTop = b.setback ? b.top + b.setback.fromTop : null
  const sbReduce = b.setback?.reduce ?? 0
  const lowerH = sbTop ? sbTop - b.top : h
  const upperW = b.w - sbReduce * 2
  const upperX = b.x + sbReduce

  const floors = Math.floor(h / 26)

  const animStyle = (extraDelay = 0): React.CSSProperties => ({
    transformOrigin: `${midX}px ${GROUND}px`,
    animation: `bldgFill 2.2s cubic-bezier(0.22,0.61,0.36,1) ${delay + extraDelay}s both`,
  })

  return (
    <g>
      {/* ── preenchimento ── */}
      {sbTop ? (
        <>
          <rect
            x={b.x}
            y={b.top}
            width={b.w}
            height={lowerH}
            fill={GOLD(0.18)}
            style={animStyle()}
          />
          <rect
            x={upperX}
            y={b.top}
            width={upperW}
            height={b.setback!.fromTop}
            fill={GOLD(0.18)}
            style={animStyle()}
          />
        </>
      ) : (
        <rect x={b.x} y={b.top} width={b.w} height={h} fill={GOLD(0.18)} style={animStyle()} />
      )}

      {/* ── contornos principais ── */}
      {sbTop ? (
        <>
          {/* parte superior (setback) */}
          <path
            d={`M${upperX},${b.top} h${upperW} v${b.setback!.fromTop} h${(b.w - upperW) / 2} v${GROUND - sbTop} H${b.x} V${sbTop} h${(b.w - upperW) / 2} V${b.top}`}
            fill="none"
            stroke={GOLD(0.65)}
            strokeWidth="1.2"
            strokeLinejoin="miter"
          />
        </>
      ) : (
        <rect
          x={b.x}
          y={b.top}
          width={b.w}
          height={h}
          fill="none"
          stroke={GOLD(0.65)}
          strokeWidth="1.2"
        />
      )}

      {/* ── cornice / topo ── */}
      <line
        x1={b.x - 2}
        y1={b.top}
        x2={b.x + b.w + 2}
        y2={b.top}
        stroke={GOLD(0.55)}
        strokeWidth="1.8"
      />

      {/* ── linhas de andares ── */}
      {b.windows === 'grid' &&
        Array.from({ length: floors - 1 }, (_, fi) => (
          <line
            key={fi}
            x1={b.x + 4}
            y1={b.top + (fi + 1) * 26}
            x2={b.x + b.w - 4}
            y2={b.top + (fi + 1) * 26}
            stroke={GOLD(0.22)}
            strokeWidth="0.6"
          />
        ))}

      {/* ── faixas horizontais (janelas em banda) ── */}
      {b.windows === 'bands' &&
        Array.from({ length: Math.floor(h / 32) }, (_, fi) => (
          <rect
            key={fi}
            x={b.x + 6}
            y={b.top + 14 + fi * 32}
            width={b.w - 12}
            height={10}
            fill="none"
            stroke={GOLD(0.28)}
            strokeWidth="0.6"
          />
        ))}

      {/* ── divisória vertical central ── */}
      {b.w >= 68 && (
        <line
          x1={midX}
          y1={b.top + 4}
          x2={midX}
          y2={GROUND - 4}
          stroke={GOLD(0.12)}
          strokeWidth="0.5"
        />
      )}

      {/* ── antena ── */}
      {b.antenna && (
        <>
          <line
            x1={midX}
            y1={b.top - 1}
            x2={midX}
            y2={b.top - 28}
            stroke={GOLD(0.5)}
            strokeWidth="1.2"
          />
          <circle cx={midX} cy={b.top - 28} r="2" fill={GOLD(0.4)} />
        </>
      )}
    </g>
  )
}

function HouseBldg({ b }: { b: HouseBuilding }) {
  const bodyH = GROUND - b.bodyTop
  const midX = b.x + b.w / 2
  const roofTop = b.bodyTop - b.roofH
  const roofPts = `${b.x},${b.bodyTop} ${b.x + b.w},${b.bodyTop} ${midX},${roofTop}`

  const animStyle: React.CSSProperties = {
    transformOrigin: `${midX}px ${GROUND}px`,
    animation: `bldgFill 2.2s cubic-bezier(0.22,0.61,0.36,1) ${b.delay}s both`,
  }

  return (
    <g style={animStyle}>
      {/* fill */}
      <rect x={b.x} y={b.bodyTop} width={b.w} height={bodyH} fill={GOLD(0.18)} />
      <polygon points={roofPts} fill={GOLD(0.18)} />
      {/* contornos */}
      <rect
        x={b.x}
        y={b.bodyTop}
        width={b.w}
        height={bodyH}
        fill="none"
        stroke={GOLD(0.65)}
        strokeWidth="1.2"
      />
      <polygon points={roofPts} fill="none" stroke={GOLD(0.65)} strokeWidth="1.2" />
      {/* linha cumeeira estendida */}
      <line
        x1={b.x - 3}
        y1={b.bodyTop}
        x2={b.x + b.w + 3}
        y2={b.bodyTop}
        stroke={GOLD(0.5)}
        strokeWidth="1.6"
      />
      {/* porta */}
      <path
        d={`M${midX - 7},${GROUND} V${b.bodyTop + bodyH - 20} Q${midX - 7},${b.bodyTop + bodyH - 27} ${midX},${b.bodyTop + bodyH - 27} Q${midX + 7},${b.bodyTop + bodyH - 27} ${midX + 7},${b.bodyTop + bodyH - 20} V${GROUND}`}
        fill="none"
        stroke={GOLD(0.35)}
        strokeWidth="0.8"
      />
      {/* janela esq */}
      <rect
        x={b.x + 10}
        y={b.bodyTop + 14}
        width={14}
        height={13}
        rx="1"
        fill="none"
        stroke={GOLD(0.4)}
        strokeWidth="0.8"
      />
      <line
        x1={b.x + 17}
        y1={b.bodyTop + 14}
        x2={b.x + 17}
        y2={b.bodyTop + 27}
        stroke={GOLD(0.25)}
        strokeWidth="0.5"
      />
      {/* janela dir */}
      <rect
        x={b.x + b.w - 24}
        y={b.bodyTop + 14}
        width={14}
        height={13}
        rx="1"
        fill="none"
        stroke={GOLD(0.4)}
        strokeWidth="0.8"
      />
      <line
        x1={b.x + b.w - 17}
        y1={b.bodyTop + 14}
        x2={b.x + b.w - 17}
        y2={b.bodyTop + 27}
        stroke={GOLD(0.25)}
        strokeWidth="0.5"
      />
      {/* dormer */}
      {b.dormer && (
        <>
          <rect
            x={midX - 10}
            y={roofTop + b.roofH * 0.35}
            width={20}
            height={14}
            fill={GOLD(0.15)}
            stroke={GOLD(0.45)}
            strokeWidth="0.8"
          />
          <polygon
            points={`${midX - 12},${roofTop + b.roofH * 0.35} ${midX + 12},${roofTop + b.roofH * 0.35} ${midX},${roofTop + b.roofH * 0.15}`}
            fill="none"
            stroke={GOLD(0.45)}
            strokeWidth="0.8"
          />
        </>
      )}
    </g>
  )
}

function ChurchBldg({ b }: { b: ChurchBuilding }) {
  const bodyH = GROUND - b.bodyTop
  const midX = b.x + b.w / 2
  const spireBase = b.bodyTop - 8
  const spireTop = spireBase - b.spireH
  const spireW = 18

  const animStyle: React.CSSProperties = {
    transformOrigin: `${midX}px ${GROUND}px`,
    animation: `bldgFill 2.2s cubic-bezier(0.22,0.61,0.36,1) ${b.delay}s both`,
  }

  return (
    <g style={animStyle}>
      {/* fill corpo */}
      <rect x={b.x} y={b.bodyTop} width={b.w} height={bodyH} fill={GOLD(0.18)} />
      {/* fill pináculo */}
      <polygon
        points={`${midX - spireW / 2},${spireBase} ${midX + spireW / 2},${spireBase} ${midX},${spireTop}`}
        fill={GOLD(0.18)}
      />
      {/* contornos corpo */}
      <rect
        x={b.x}
        y={b.bodyTop}
        width={b.w}
        height={bodyH}
        fill="none"
        stroke={GOLD(0.65)}
        strokeWidth="1.2"
      />
      {/* pináculo */}
      <polygon
        points={`${midX - spireW / 2},${spireBase} ${midX + spireW / 2},${spireBase} ${midX},${spireTop}`}
        fill="none"
        stroke={GOLD(0.65)}
        strokeWidth="1.2"
      />
      {/* cornice */}
      <line
        x1={b.x - 4}
        y1={b.bodyTop}
        x2={b.x + b.w + 4}
        y2={b.bodyTop}
        stroke={GOLD(0.55)}
        strokeWidth="2"
      />
      {/* janela em arco */}
      <path
        d={`M${midX - 9},${b.bodyTop + bodyH * 0.55} V${b.bodyTop + bodyH * 0.35} A9,9 0 0 1 ${midX + 9},${b.bodyTop + bodyH * 0.35} V${b.bodyTop + bodyH * 0.55} Z`}
        fill="none"
        stroke={GOLD(0.4)}
        strokeWidth="0.8"
      />
      {/* rosácea */}
      <circle
        cx={midX}
        cy={b.bodyTop + bodyH * 0.2}
        r="7"
        fill="none"
        stroke={GOLD(0.35)}
        strokeWidth="0.7"
      />
      {/* cruz no topo */}
      <line
        x1={midX}
        y1={spireTop - 8}
        x2={midX}
        y2={spireTop + 2}
        stroke={GOLD(0.6)}
        strokeWidth="1.2"
      />
      <line
        x1={midX - 5}
        y1={spireTop - 4}
        x2={midX + 5}
        y2={spireTop - 4}
        stroke={GOLD(0.6)}
        strokeWidth="1.2"
      />
    </g>
  )
}

const tiposImovel = [
  { value: '', label: 'Todos os tipos' },
  { value: 'APARTAMENTO', label: 'Apartamento' },
  { value: 'CASA', label: 'Casa' },
  { value: 'TERRENO', label: 'Terreno' },
  { value: 'COMERCIAL', label: 'Comercial' },
]

export function Hero() {
  const router = useRouter()
  const [localidade, setLocalidade] = useState('')
  const [tipo, setTipo] = useState('')
  const [geoLoading, setGeoLoading] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) return
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=pt-BR`,
            { headers: { 'User-Agent': 'TorresImobiliaria/1.0' } }
          )
          const data = await res.json()
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.municipality ||
            data.address?.village
          if (city) setLocalidade(city)
        } catch {
          // silently ignore — user can type manually
        } finally {
          setGeoLoading(false)
        }
      },
      () => setGeoLoading(false),
      { timeout: 6000 }
    )
  }, [])

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (localidade) params.set('localidade', localidade)
    if (tipo) params.set('tipo', tipo)
    router.push(`/comprar?${params.toString()}`)
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-navy-deep pt-20">
      <style>{`
        @keyframes bldgFill {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
      `}</style>

      {/* ── Fundo ── */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-[#060E16] via-[#0A1626] to-[#0d1f35]" />
        {/* brilho âmbar no horizonte */}
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-brand-gold/10 via-transparent to-transparent" />

        {/* ── Skyline SVG ── */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          fill="none"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
        >
          {/* glow sutil no chão */}
          <line
            x1="0"
            y1={GROUND + 1}
            x2={VB_W}
            y2={GROUND + 1}
            stroke={GOLD(0.35)}
            strokeWidth="3"
          />
          <line
            x1="0"
            y1={GROUND + 1}
            x2={VB_W}
            y2={GROUND + 1}
            stroke={GOLD(0.12)}
            strokeWidth="10"
          />

          {BUILDINGS.map((b, i) => {
            if (b.kind === 'rect') return <RectBldg key={i} b={b} />
            if (b.kind === 'house') return <HouseBldg key={i} b={b} />
            if (b.kind === 'church') return <ChurchBldg key={i} b={b} />
            return null
          })}
        </svg>

        {/* overlay suave — não abafa os prédios */}
        <div className="absolute inset-0 bg-brand-navy-deep/40" />
      </div>

      {/* ── Conteúdo ── */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-52 pt-4 text-center lg:px-8">
        <span className="label-caps mb-6 inline-block text-brand-gold">Itabirito e região</span>

        <h1 className="mb-6 font-serif text-4xl font-bold leading-tight tracking-wide text-brand-cream sm:text-5xl lg:text-6xl">
          Confiança que
          <br />
          <span className="text-gold-gradient">constrói futuros.</span>
        </h1>

        <p className="mx-auto mb-12 max-w-xl font-sans text-base font-light leading-relaxed text-brand-cream/60">
          Especialistas em imóveis. Encontre apartamentos, casas, terrenos e lançamentos com a
          assessoria que seu patrimônio merece.
        </p>

        {/* Barra de busca — fundo claro para destacar */}
        <form
          onSubmit={handleSearch}
          className="mx-auto flex max-w-2xl flex-col gap-0 overflow-hidden rounded-lg border border-brand-gold/40 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(189,131,56,0.15)] sm:flex-row"
          role="search"
          aria-label="Buscar imóveis"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={geoLoading ? 'Detectando sua cidade…' : 'Bairro ou cidade...'}
              value={localidade}
              onChange={(e) => setLocalidade(e.target.value)}
              className="w-full bg-brand-cream px-5 py-4 font-sans text-sm text-brand-navy-deep placeholder:text-brand-navy/40 focus:outline-none"
              aria-label="Localidade"
            />
            {geoLoading && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="h-4 w-4 animate-spin text-brand-navy/30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
                </svg>
              </span>
            )}
          </div>
          <div className="w-px bg-brand-gold/25" />
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="bg-brand-cream px-4 py-4 font-sans text-sm text-brand-navy-deep focus:outline-none sm:w-44"
            aria-label="Tipo de imóvel"
          >
            {tiposImovel.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="label-caps bg-brand-gold px-7 py-4 font-semibold text-brand-navy-deep transition-colors hover:bg-brand-gold-light"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Seta de scroll */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        aria-hidden="true"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brand-gold/40">
          <path
            d="M10 3v14M4 11l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  )
}
