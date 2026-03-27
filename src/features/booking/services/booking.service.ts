/* ============================================================
   features/booking/services/booking.service.ts

   Appels Supabase pour les réservations.
   Aucune logique UI — uniquement les opérations DB.
   ============================================================ */

import { supabaseClient } from '@/lib/supabase/client'
import type { CreateBookingDTO, Booking } from '../types/booking.types'

/* ── Créer une réservation ── */
export async function createBooking(
  dto: CreateBookingDTO
): Promise<{ booking: Booking; error: null } | { booking: null; error: string }> {

  const { data, error } = await supabaseClient
    .from('booking_requests')
    .insert(dto)
    .select()
    .single()

  if (error) {
    console.error('[booking.service] createBooking error:', error)
    return { booking: null, error: 'Erreur lors de la création de la réservation' }
  }

  return { booking: data as Booking, error: null }
}

/* ── Récupérer les réservations d'un client ── */
export async function getBookingsByEmail(
  email: string
): Promise<Booking[]> {
  const { data, error } = await supabaseClient
    .from('booking_requests')
    .select('*')
    .eq('customer_email', email)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[booking.service] getBookingsByEmail error:', error)
    return []
  }

  return (data ?? []) as Booking[]
}

/* ── Récupérer une réservation par ID ── */
export async function getBookingById(
  id: string
): Promise<Booking | null> {
  const { data, error } = await supabaseClient
    .from('booking_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Booking
}

/* ── Annuler une réservation ── */
export async function cancelBooking(
  id: string
): Promise<{ error: string | null }> {
  const { error } = await supabaseClient
    .from('booking_requests')
    .update({ status: 'cancelled' })
    .eq('id', id)

  if (error) return { error: 'Impossible d\'annuler la réservation' }
  return { error: null }
}