'use client'

/* ============================================================
   features/home/hooks/use-user-rides.ts
   Fetch + transform des courses de l'utilisateur connecté
   ============================================================ */

import { useEffect, useState } from 'react'
import { useAuth } from '@/features/auth/context/auth-context'
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
  const [tick, setTick]         = useState(0)

  useEffect(() => {
    /* Auth pas encore résolue → on attend */
    if (authLoading) return

    let cancelled = false

    async function load() {
      if (!user) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const bookings = await getBookingsByEmail(user.email)
        if (cancelled) return
        setRides(sortRides(bookings.map(bookingToRideCard)))
      } catch {
        if (cancelled) return
        setError('Impossible de charger vos courses')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [user, authLoading, tick])

  const upcoming = rides.filter(r => r.status === 'upcoming' || r.status === 'accepted' || r.status === 'in_progress' || r.status === 'pending')
  const past     = rides.filter(r => r.status === 'completed' || r.status === 'cancelled')

  return {
    rides, all: rides, upcoming, past, isLoading, error,
    refetch: () => setTick(t => t + 1),
  }
}