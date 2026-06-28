'use client'

import dynamic from 'next/dynamic'

const PropertyMapClient = dynamic(() => import('./PropertyMap').then((m) => m.PropertyMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-full items-center justify-center rounded-md border border-brand-cream/10 bg-brand-navy-deep">
      <p className="font-sans text-sm text-brand-cream/40">Carregando mapa…</p>
    </div>
  ),
})

interface PropertyMapProps {
  latitude: number
  longitude: number
  titulo: string
  googleMapsKey?: string | null
}

export function PropertyMap(props: PropertyMapProps) {
  return <PropertyMapClient {...props} />
}
