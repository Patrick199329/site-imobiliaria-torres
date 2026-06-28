'use client'

import { useEffect, useRef, useState } from 'react'

interface PropertyMapProps {
  latitude: number
  longitude: number
  titulo: string
  googleMapsKey?: string | null
}

// ── Google Maps ──────────────────────────────────────────────────────────────

function GoogleMap({ latitude, longitude, titulo, apiKey }: {
  latitude: number
  longitude: number
  titulo: string
  apiKey: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const { setOptions, importLibrary } = await import('@googlemaps/js-api-loader')
        setOptions({ key: apiKey })

        const { Map, Circle } = await importLibrary('maps')
        if (cancelled || !ref.current) return

        const map = new Map(ref.current, {
          center: { lat: latitude, lng: longitude },
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#0d1b2e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1b2e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#8899aa' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a2d45' }] },
            { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0a1626' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#060e16' }] },
            { featureType: 'poi', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', stylers: [{ visibility: 'off' }] },
          ],
        })

        new Circle({
          map,
          center: { lat: latitude, lng: longitude },
          radius: 200,
          fillColor: '#BD8338',
          fillOpacity: 0.12,
          strokeColor: '#BD8338',
          strokeOpacity: 0.5,
          strokeWeight: 1.5,
        })
      } catch {
        if (!cancelled) setErro(true)
      }
    }

    init()
    return () => { cancelled = true }
  }, [latitude, longitude, apiKey])

  if (erro) return <OsmMap latitude={latitude} longitude={longitude} titulo={titulo} />

  return (
    <div className="isolate h-64 w-full overflow-hidden rounded-md border border-brand-cream/10">
      <div ref={ref} className="h-full w-full" />
    </div>
  )
}

// ── OpenStreetMap (fallback sem chave) ───────────────────────────────────────

function OsmMap({ latitude, longitude, titulo }: { latitude: number; longitude: number; titulo: string }) {
  const [ready, setReady] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [MapComponents, setMapComponents] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [icon, setIcon] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      import('leaflet/dist/leaflet.css' as string),
      import('react-leaflet'),
      import('leaflet'),
    ]).then(([, rl, L]) => {
      setMapComponents(rl)
      setIcon(new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }))
      setReady(true)
    })
  }, [])

  if (!ready || !MapComponents || !icon) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-md border border-brand-cream/10 bg-brand-navy-deep">
        <p className="font-sans text-sm text-brand-cream/40">Carregando mapa…</p>
      </div>
    )
  }

  const { MapContainer, TileLayer, Marker, Circle } = MapComponents

  return (
    <div className="isolate h-64 w-full overflow-hidden rounded-md border border-brand-cream/10">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={icon} title={titulo} />
        <Circle
          center={[latitude, longitude]}
          radius={200}
          pathOptions={{ color: '#BD8338', fillColor: '#BD8338', fillOpacity: 0.08, weight: 1 }}
        />
      </MapContainer>
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────────────────────

export function PropertyMap({ latitude, longitude, titulo, googleMapsKey }: PropertyMapProps) {
  if (googleMapsKey) {
    return (
      <GoogleMap
        latitude={latitude}
        longitude={longitude}
        titulo={titulo}
        apiKey={googleMapsKey}
      />
    )
  }

  return <OsmMap latitude={latitude} longitude={longitude} titulo={titulo} />
}
