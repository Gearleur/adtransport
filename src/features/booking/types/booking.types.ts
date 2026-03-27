/* ============================================================
   features/booking/types/booking.types.ts

   Aligné sur la structure réelle de Supabase :
   table booking_requests
   ============================================================ */

import type { Location } from '@/features/locations/types/location.types'

export type RideType = 'now' | 'schedule'

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export interface ScheduledDateTime {
  date: string   // "2024-03-25"
  time: string   // "14:30"
}

export interface BookingFormState {
  pickup:      Location | null
  destination: Location | null
  rideType:    RideType
  scheduledAt: ScheduledDateTime | null
  notes:       string
}

export interface BookingFormErrors {
  pickup?:      string
  destination?: string
  scheduledAt?: string
}

/* ── Ce qu'on envoie à Supabase ── */
/* Aligné exactement sur les colonnes de booking_requests */
export interface CreateBookingDTO {
  /* Adresses */
  pickup_address:   string
  dropoff_address:  string   // ← ta table utilise dropoff, pas destination
  pickup_lat:       number
  pickup_lng:       number
  dropoff_lat:      number
  dropoff_lng:      number

  /* Client — rempli depuis la session auth */
  customer_name:    string
  customer_email:   string
  customer_phone:   string

  /* Horaire */
  requested_at:     string | null   // ISO string — null = maintenant

  /* Infos complémentaires */
  notes:            string | null
  currency:         string           // 'EUR'

  /* Statut initial */
  status:           BookingStatus    // 'pending'
}

/* ── Ce que Supabase retourne ── */
export interface Booking extends CreateBookingDTO {
  id:                      string
  estimated_distance_km:   number | null
  base_price:              number | null
  distance_price:          number | null
  options_price:           number | null
  total_estimated_price:   number | null
  processed_at:            string | null
  created_at:              string
}