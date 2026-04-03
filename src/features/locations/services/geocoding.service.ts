/* ============================================================
   features/locations/services/geocoding.service.ts
   Nominatim (OpenStreetMap) — gratuit, sans clé
   ============================================================ */

import type { Location } from '../types/location.types'

const NOMINATIM = 'https://nominatim.openstreetmap.org'
const HEADERS   = { 'Accept-Language': 'fr', 'User-Agent': 'VTC-App/1.0' }

/* ── Construit un label lisible depuis les address details ── */
function buildLabel(item: NominatimResult): { label: string; sublabel: string } {
  const a = item.address ?? {}

  /* Adresse principale : numéro + rue */
  const street = [a.house_number, a.road].filter(Boolean).join(' ')

  /* Ville */
  const city = a.city ?? a.town ?? a.village ?? a.municipality ?? ''

  /* Code postal */
  const postcode = a.postcode ?? ''

  if (street && city) {
    return {
      label:    street,
      sublabel: [postcode, city].filter(Boolean).join(' '),
    }
  }

  /* Fallback : lieu nommé (ex: "Espace du Puy du Roy") */
  const parts = item.display_name.split(', ')
  const fallbackCity = parts.slice(1, 3).join(', ')
  return {
    label:    parts[0],
    sublabel: fallbackCity,
  }
}

/* ── Construit l'adresse complète à stocker en base ── */
function buildFullAddress(item: NominatimResult): string {
  const a = item.address ?? {}
  const street   = [a.house_number, a.road].filter(Boolean).join(' ')
  const city     = a.city ?? a.town ?? a.village ?? a.municipality ?? ''
  const postcode = a.postcode ?? ''
  const country  = a.country ?? ''

  if (street && city) {
    return [street, postcode, city, country].filter(Boolean).join(', ')
  }
  return item.display_name
}

/* ────────────────────────────────────────────
   Autocomplétion
   ──────────────────────────────────────────── */
export async function searchAddress(
  query: string,
): Promise<(Location & { sublabel?: string })[]> {
  if (!query || query.length < 2) return []

  const words = query.trim().split(/\s+/)

  /* Requête sans le dernier mot — utile quand l'utilisateur
     tape le début d'un nom de ville ("vill" au lieu de "Villemomble") */
  const withoutLastWord = words.length > 2 ? words.slice(0, -1).join(' ') : null

  /* Lance les deux requêtes en parallèle */
  const [full, partial] = await Promise.all([
    searchNominatim(query),
    withoutLastWord ? searchNominatim(withoutLastWord) : Promise.resolve([]),
  ])

  /* Déduplique par placeId et fusionne — les résultats complets en premier */
  const seen = new Set<string>()
  const merged: (Location & { sublabel?: string })[] = []

  for (const r of [...full, ...partial]) {
    const key = r.placeId ?? r.label
    if (!seen.has(key)) {
      seen.add(key)
      merged.push(r)
    }
  }

  /* Si toujours rien, ajoute "France" en dernier recours */
  if (merged.length === 0 && !query.toLowerCase().includes('france')) {
    return searchNominatim(`${query}, France`)
  }

  return merged.slice(0, 5)
}

async function searchNominatim(
  query: string,
): Promise<(Location & { sublabel?: string })[]> {
  const params = new URLSearchParams({
    q:              query,
    format:         'json',
    addressdetails: '1',
    limit:          '6',
    countrycodes:   'fr',
    dedupe:         '1',
  })

  try {
    const res  = await fetch(`${NOMINATIM}/search?${params}`, { headers: HEADERS })
    const data = await res.json() as NominatimResult[]

    return data.map(item => {
      const { label, sublabel } = buildLabel(item)
      const fullAddress = buildFullAddress(item)

      return {
        label:    fullAddress,
        sublabel: `${label}${sublabel ? ` — ${sublabel}` : ''}`,
        lat:      parseFloat(item.lat),
        lng:      parseFloat(item.lon),
        placeId:  item.place_id.toString(),
      }
    })
  } catch {
    return []
  }
}

/* ────────────────────────────────────────────
   Reverse geocoding
   ──────────────────────────────────────────── */
export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<Location | null> {
  const params = new URLSearchParams({
    lat:            lat.toString(),
    lon:            lng.toString(),
    format:         'json',
    addressdetails: '1',
    zoom:           '18',
  })

  try {
    const res  = await fetch(`${NOMINATIM}/reverse?${params}`, { headers: HEADERS })
    const data = await res.json() as NominatimResult

    if (!data?.display_name) return null

    return {
      label:   buildFullAddress(data),
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

/* ────────────────────────────────────────────
   Routing OSRM — distance + durée réelles
   ──────────────────────────────────────────── */
export async function getRoutingInfo(
  pickup:  { lat: number; lng: number },
  dropoff: { lat: number; lng: number }
): Promise<{ distanceKm: number; durationMin: number } | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=false`
    const res  = await fetch(url)
    const data = await res.json()
    if (data.code !== 'Ok' || !data.routes?.[0]) return null
    const route = data.routes[0]
    return {
      distanceKm:  Math.round((route.distance / 1000) * 10) / 10,
      durationMin: Math.round(route.duration / 60),
    }
  } catch {
    return null
  }
}

/* ── Types Nominatim ── */
interface NominatimAddress {
  house_number?: string
  road?:         string
  city?:         string
  town?:         string
  village?:      string
  municipality?: string
  postcode?:     string
  country?:      string
}

interface NominatimResult {
  place_id:     number
  display_name: string
  lat:          string
  lon:          string
  address?:     NominatimAddress
}