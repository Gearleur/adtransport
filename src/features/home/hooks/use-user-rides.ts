'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/features/auth/context/auth-context'
import { supabaseClient } from '@/lib/supabase/client'
import { getBookingsByEmail } from '@/features/booking/services/booking.service'
import { bookingToRideCard, sortRides } from '../utils/ride.utils'
import type { RideCardData } from '../components/ride-card'

interface UseUserRidesResult {
  rides:     RideCardData[]
  all:       RideCardData[]
  upcoming:  RideCardData[]
  past:      RideCardData[]
  isLoading: boolean
  error:     string | null
  refetch:   () => void
}

export function useUserRides(): UseUserRidesResult {
  const { user, isLoading: authLoading } = useAuth()
  const [rides, setRides]       = useState<RideCardData[]>([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError]       = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    setError(null)
    try {
      const bookings = await getBookingsByEmail(user.email)
      setRides(sortRides(bookings.map(bookingToRideCard)))
    } catch {
      setError('Impossible de charger vos courses')
    } finally {
      setLoading(false)
    }
  }, [user])

  /* Chargement initial */
  useEffect(() => {
    if (authLoading) return
    let cancelled = false
    load().then(() => { if (cancelled) return })
    return () => { cancelled = true }
  }, [user, authLoading, load])

  /* Realtime — mise à jour automatique quand le statut change */
  useEffect(() => {
    if (!user) return

    const channel = supabaseClient
      .channel('user-bookings')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `booker_id=eq.${user.id}`,
        },
        () => { load() }
      )
      .subscribe()

    return () => { supabaseClient.removeChannel(channel) }
  }, [user, load])

  const upcoming = rides.filter(r =>
    r.status === 'upcoming' || r.status === 'accepted' ||
    r.status === 'in_progress' || r.status === 'pending'
  )
  const past = rides.filter(r =>
    r.status === 'completed' || r.status === 'cancelled'
  )

  return {
    rides, all: rides, upcoming, past, isLoading, error,
    refetch: load,
  }
}