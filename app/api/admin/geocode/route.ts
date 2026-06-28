import { NextRequest, NextResponse } from 'next/server'
import { getConfig } from '@/lib/config'

export async function POST(req: NextRequest) {
  const { endereco, bairro, cidade, uf } = await req.json()

  if (!endereco || !cidade) {
    return NextResponse.json({ erro: 'Endereço e cidade são obrigatórios.' }, { status: 400 })
  }

  const enderecoCompleto = [endereco, bairro, cidade, uf, 'Brasil']
    .filter(Boolean)
    .join(', ')

  const googleKey = await getConfig('GOOGLE_MAPS_KEY')

  if (googleKey) {
    return geocodeGoogle(enderecoCompleto, googleKey)
  }

  return geocodeNominatim(enderecoCompleto)
}

async function geocodeGoogle(address: string, apiKey: string) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}&language=pt-BR&region=BR`
  const res = await fetch(url)
  const data = await res.json()

  if (data.status !== 'OK' || !data.results?.[0]) {
    return NextResponse.json({ erro: 'Endereço não encontrado.' }, { status: 404 })
  }

  const { lat, lng } = data.results[0].geometry.location
  return NextResponse.json({ lat, lng, fonte: 'google' })
}

async function geocodeNominatim(address: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=br`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'TorresImobiliaria/1.0 (admin-geocode)' },
  })
  const data = await res.json()

  if (!data?.[0]) {
    return NextResponse.json({ erro: 'Endereço não encontrado.' }, { status: 404 })
  }

  return NextResponse.json({
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    fonte: 'nominatim',
  })
}
