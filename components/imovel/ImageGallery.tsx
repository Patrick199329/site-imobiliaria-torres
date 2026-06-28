'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'

interface GalleryImage {
  url: string
  ordem: number
}

interface ImageGalleryProps {
  images: GalleryImage[]
  titulo: string
}

function Placeholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-brand-navy-deep">
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        aria-hidden="true"
        className="text-brand-gold/20"
      >
        <rect x="6" y="46" width="8" height="20" rx="1" fill="currentColor" />
        <rect x="18" y="36" width="8" height="30" rx="1" fill="currentColor" />
        <rect x="30" y="28" width="8" height="38" rx="1" fill="currentColor" />
        <rect x="42" y="18" width="8" height="48" rx="1" fill="currentColor" />
        <rect x="54" y="32" width="8" height="34" rx="1" fill="currentColor" />
        <rect x="66" y="42" width="8" height="24" rx="1" fill="currentColor" />
        <path
          d="M4 66 Q40 74 76 66"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </svg>
    </div>
  )
}

export function ImageGallery({ images, titulo }: ImageGalleryProps) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const prev = useCallback(
    () => setActive((i) => (i - 1 + images.length) % images.length),
    [images.length]
  )
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length])

  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setLightbox(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, prev, next])

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] w-full overflow-hidden rounded-md border border-brand-cream/10">
        <Placeholder />
      </div>
    )
  }

  return (
    <>
      {/* Imagem principal */}
      <div
        className="group relative aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-md border border-brand-cream/10"
        onClick={() => setLightbox(true)}
        role="button"
        aria-label="Ampliar galeria"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setLightbox(true)}
      >
        <Image
          src={images[active].url}
          alt={`${titulo} — foto ${active + 1}`}
          fill
          className="group-hover:scale-102 object-cover transition-transform duration-500"
          sizes="(max-width: 1024px) 100vw, 65vw"
          priority={active === 0}
        />

        {/* Contador */}
        <div className="absolute bottom-3 right-3 rounded bg-black/50 px-2 py-0.5 font-sans text-xs text-white backdrop-blur-sm">
          {active + 1} / {images.length}
        </div>

        {/* Setas */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/60 group-hover:opacity-100"
              aria-label="Foto anterior"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M10 3L5 8l5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/60 group-hover:opacity-100"
              aria-label="Próxima foto"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M6 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={[
                'relative h-16 w-24 flex-shrink-0 overflow-hidden rounded border-2 transition-all',
                i === active
                  ? 'border-brand-gold'
                  : 'border-transparent opacity-50 hover:opacity-80',
              ].join(' ')}
              aria-label={`Ver foto ${i + 1}`}
              aria-pressed={i === active}
            >
              <Image src={img.url} alt="" fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de fotos"
        >
          <button
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setLightbox(false)}
            aria-label="Fechar"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
                className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Foto anterior"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M13 4L7 10l6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Próxima foto"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M7 4l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}

          <div
            className="relative mx-16 max-h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active].url}
              alt={`${titulo} — foto ${active + 1}`}
              width={1200}
              height={800}
              className="h-auto max-h-[85vh] w-full rounded object-contain"
            />
            <p className="mt-2 text-center font-sans text-sm text-white/50">
              {active + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
