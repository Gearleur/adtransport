/* ============================================================
   features/booking/services/booking.service.ts
   Aligné sur la nouvelle table `bookings`
   ============================================================ */

import { supabaseClient } from '@/lib/supabase/client'
import type { CreateBookingDTO, Booking } from '../types/booking.types'

/* ── Créer une réservation ── */
export async function createBooking(
  dto: CreateBookingDTO
): Promise<{ booking: Booking; error: null } | { booking: null; error: string }> {

  const { data, error } = await supabaseClient
    .from('bookings')
    .insert(dto)
    .select()
    .single()

  if (error) {
    console.error('[booking.service] createBooking error:', error)
    return { booking: null, error: 'Erreur lors de la création de la réservation' }
  }

  return { booking: data as Booking, error: null }
}

/* ── Récupérer les réservations d'un utilisateur ── */
export async function getBookingsByUserId(
  userId: string
): Promise<Booking[]> {
  const { data, error } = await supabaseClient
    .from('bookings')
    .select('*')
    .eq('booker_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[booking.service] getBookingsByUserId error:', error)
    return []
  }

  return (data ?? []) as Booking[]
}

/* Alias pour compatibilité avec les hooks existants */
export async function getBookingsByEmail(email: string): Promise<Booking[]> {
  /* On passe par l'id utilisateur — récupère d'abord l'user */
  const { data: { user } } = await supabaseClient.auth.getUser()
  if (!user) return []
  return getBookingsByUserId(user.id)
}

/* ── Récupérer une réservation par ID ── */
export async function getBookingById(
  id: string
): Promise<Booking | null> {
  const { data, error } = await supabaseClient
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Booking
}

/* ── Mettre à jour la route (distance + durée) ── */
export async function updateBookingRoute(
  id: string,
  distanceKm: number,
  durationMin: number
): Promise<void> {
  await supabaseClient
    .from('bookings')
    .update({ distance_km: distanceKm, duration_min: durationMin })
    .eq('id', id)
}

/* ── Annuler une réservation ── */
export async function cancelBooking(
  id: string
): Promise<{ error: string | null }> {
  const { error } = await supabaseClient
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', id)

  if (error) return { error: 'Impossible d\'annuler la réservation' }
  return { error: null }
}