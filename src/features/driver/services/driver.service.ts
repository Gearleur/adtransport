/* ============================================================
   features/driver/services/driver.service.ts
   ============================================================ */

import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type DriverRideStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'

export interface DriverRide {
  id:               string
  status:           DriverRideStatus
  pickup_address:   string
  dropoff_address:  string
  pickup_lat:       number | null
  pickup_lng:       number | null
  dropoff_lat:      number | null
  dropoff_lng:      number | null
  booker_id:        string | null
  passenger_name:   string | null
  passenger_phone:  string | null
  scheduled_at:     string | null
  notes:            string | null
  estimated_price:  number | null
  driver_price:     number | null
  driver_id:        string | null
}

/* Toutes les courses en attente (non assignées) */
export async function getPendingRides(): Promise<DriverRide[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('status', 'pending')
    .order('scheduled_at', { ascending: true })

  if (error || !data) return []
  return data as DriverRide[]
}

/* Courses acceptées par ce conducteur */
export async function getMyRides(driverId: string): Promise<DriverRide[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('driver_id', driverId)
    .neq('status', 'cancelled')
    .order('scheduled_at', { ascending: true })

  if (error || !data) return []
  return data as DriverRide[]
}

/* Accepter une course avec un prix */
export async function acceptRide(
  rideId: string,
  driverId: string,
  price: number | null
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('bookings')
    .update({
      status:       'accepted',
      driver_id:    driverId,
      driver_price: price,
    })
    .eq('id', rideId)
    .eq('status', 'pending') // évite double-accept

  return { error: error ? error.message : null }
}

/* Refuser une course */
export async function declineRide(rideId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', rideId)

  return { error: error ? error.message : null }
}

/* Mettre à jour le prix d'une course */
export async function updateRidePrice(
  rideId: string,
  price: number
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('bookings')
    .update({ driver_price: price })
    .eq('id', rideId)

  return { error: error ? error.message : null }
}

/* Changer le statut d'une course */
export async function updateRideStatus(
  rideId: string,
  status: DriverRideStatus
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', rideId)

  return { error: error ? error.message : null }
}