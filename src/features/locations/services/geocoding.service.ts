/* ============================================================
   features/locations/services/geocoding.service.ts

   Utilise Nominatim (OpenStreetMap) — 100% gratuit, sans clé.
   Limite : 1 requête/seconde max (respectée par le debounce).

   Swap futur vers Mapbox : remplacer les 3 fonctions par
   les appels API Mapbox, l'interface reste identique.
   ============================================================ */

import type { Location } from '../types/location.types'

const NOMINATIM = 'https://nominatim.openstreetmap.org'
const HEADERS   = { 'Accept-Language': 'fr', 'User-Agent': 'VTC-App/1.0' }

/* ────────────────────────────────────────────
   Autocomplétion — appelée à chaque frappe
   ──────────────────────────────────────────── */
export async function searchAddress(
  query: string,
): Promise<(Location & { sublabel?: string })[]> {
  if (!query || query.length < 2) return []

  const params = new URLSearchParams({
    q:              query,
    format:         'json',
    addressdetails: '1',
    limit:          '5',
    countrycodes:   'fr',
    dedupe:         '1',
  })

  try {
    const res  = await fetch(`${NOMINATIM}/search?${params}`, { headers: HEADERS })
    const data = await res.json() as NominatimResult[]

    return data.map(item => {
      const parts  = item.display_name.split(', ')
      const label  = parts[0]
      const sublabel = parts.slice(1, 3).join(', ')

      return {
        label,
        sublabel,
        lat:     parseFloat(item.lat),
        lng:     parseFloat(item.lon),
        placeId: item.place_id.toString(),
      }
    })
  } catch {
    return []
  }
}

/* ────────────────────────────────────────────
   Reverse geocoding — coordonnées → adresse
   Utilisé pour géolocalisation + clic carte
   ──────────────────────────────────────────── */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<Location | null> {
  const params = new URLSearchParams({
    lat:    lat.toString(),
    lon:    lng.toString(),
    format: 'json',
    zoom:   '18',
  })

  try {
    const res  = await fetch(`${NOMINATIM}/reverse?${params}`, { headers: HEADERS })
    const data = await res.json() as NominatimResult

    if (!data?.display_name) return null

    const parts = data.display_name.split(', ')

    return {
      label:   parts.slice(0, 2).join(', '),
      lat,
      lng,
      placeId: data.place_id?.toString(),
    }
  } catch {
    return null
  }
}

/* ────────────────────────────────────────────
   Géolocalisation navigateur
   ──────────────────────────────────────────── */
export function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Géolocalisation non supportée'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos  => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err  => reject(err),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  })
}

/* ── Types Nominatim ── */
interface NominatimResult {
  place_id:     number
  display_name: string
  lat:          string
  lon:          string
}