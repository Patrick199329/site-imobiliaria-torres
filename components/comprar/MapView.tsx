'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import type { LatLngExpression, Icon } from 'leaflet'
import Link from 'next/link'
import { formatCurrency } from '@/lib/format'

interface MapImovel {
  id: string
  slug: string
  titulo: string
  preco: string
  bairro: string
  cidade: string
  latitude: number
  longitude: number
}

interface MapViewProps {
  imoveis: MapImovel[]
}

export function MapView({ imoveis }: MapViewProps) {
  const [icon, setIcon] = useState<Icon | null>(null)

  useEffect(() => {
    import('leaflet').then((L) => {
      const leafletIcon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })
      setIcon(leafletIcon)
    })
  }, [])

  const imoveisComCoordenadas = imoveis.filter((i) => i.latitude && i.longitude)

  const center: LatLngExpression =
    imoveisComCoordenadas.length > 0
      ? [imoveisComCoordenadas[0].latitude, imoveisComCoordenadas[0].longitude]
      : [-19.9191, -43.9386]

  if (!icon) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center rounded-md border border-brand-cream/10 bg-brand-navy-deep">
        <p className="font-sans text-sm text-brand-cream/40">Carregando mapa…</p>
      </div>
    )
  }

  return (
    <div className="isolate h-[70vh] w-full overflow-hidden rounded-md border border-brand-cream/10">
      <MapContainer center={center} zoom={12} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {imoveisComCoordenadas.map((imovel) => (
          <Marker key={imovel.id} position={[imovel.latitude, imovel.longitude]} icon={icon}>
            <Popup>
              <div className="min-w-[160px]">
                <p className="text-sm font-bold leading-snug">{imovel.titulo}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {imovel.bairro} · {imovel.cidade}
                </p>
                <p className="mt-1 text-base font-bold">{formatCurrency(imovel.preco)}</p>
                <Link
                  href={`/comprar/${imovel.slug}`}
                  className="mt-2 inline-block text-xs font-medium text-amber-700 hover:underline"
                >
                  Ver detalhes →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
