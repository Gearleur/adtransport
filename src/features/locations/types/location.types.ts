/* ============================================================
   features/locations/types/location.types.ts
   ============================================================ */

export interface Location {
  label: string          // adresse lisible "Rue de Rivoli, Paris"
  lat: number
  lng: number
  placeId?: string       // id Mapbox pour éviter les doublons
}

export type SuggestionType = 'geolocation' | 'map-pick' | 'result'

export interface Suggestion {
  type: SuggestionType
  label: string
  sublabel?: string      // ex: "Paris, France"
  location?: Location    // défini pour les résultats Mapbox
}