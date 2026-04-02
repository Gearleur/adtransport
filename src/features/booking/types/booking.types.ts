/* ============================================================
   features/booking/types/booking.types.ts
   Aligné sur la nouvelle table `bookings`
   ============================================================ */

import type { Location } from '@/features/locations/types/location.types'

export type RideType = 'now' | 'schedule'

export type BookingStatus =
  | 'pending'
  | 'accepted'
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
export interface CreateBookingDTO {
  booker_id:        string | null    // utilisateur connecté
  pickup_address:   string
  dropoff_address:  string
  pickup_lat:       number | null
  pickup_lng:       number | null
  dropoff_lat:      number | null
  dropoff_lng:      number | null
  passenger_name:   string | null    // nom du passager si différent
  passenger_phone:  string | null
  scheduled_at:     string | null    // ISO string — null = maintenant
  notes:            string | null
  status:           BookingStatus    // toujours 'pending' à la création
}

/* ── Ce que Supabase retourne ── */
export interface Booking {
  id:               string
  booker_id:        string | null
  passenger_id:     string | null
  passenger_name:   string | null
  passenger_phone:  string | null
  pickup_address:   string
  dropoff_address:  string
  pickup_lat:       number | null
  pickup_lng:       number | null
  dropoff_lat:      number | null
  dropoff_lng:      number | null
  scheduled_at:     string | null
  notes:            string | null
  estimated_price:  number | null
  driver_price:     number | null
  driver_id:        string | null
  status:           BookingStatus
  created_at:       string
  updated_at:       string
}